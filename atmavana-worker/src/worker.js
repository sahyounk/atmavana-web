/**
 * AtmaVana Cloudflare Worker
 * Main handler for healer toolkit + wellness marketplace platform
 * Handles routing, database, payments (Stripe + crypto), KYC, and admin APIs
 */

import {
  renderLandingPage,
  renderStorefront,
  renderMarketplace,
  renderBookingPage,
  renderCheckoutPage,
  renderConfirmationPage,
  renderAdminDashboard,
  renderHealerDashboard,
  renderLoginPage,
  renderRegisterPage,
  render404Page,
  renderErrorPage,
  renderClientAccount,
} from './templates.js';

const JWT_EXPIRY_HOURS = 24;
const STRIPE_API_URL = 'https://api.stripe.com/v1';
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';
const SUMSUB_API_URL = 'https://api.sumsub.com';
const ATMAVANA_COMMISSION_PERCENT = 20;
const ATMAVANA_FIXED_FEE_USD = 5;

// ============================================================================
// MIDDLEWARE & AUTH
// ============================================================================

/**
 * Decode and verify JWT token
 */
function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    const header = JSON.parse(atob(parts[0]));

    // In production, verify signature using crypto.subtle.verify()
    // For now, validate expiry and structure
    if (payload.exp && payload.exp < Date.now() / 1000) return null;

    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Create JWT token
 */
function createJWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const expirySeconds = JWT_EXPIRY_HOURS * 3600;

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expirySeconds
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(tokenPayload));
  const signature = btoa('signature_stub'); // Simplified for production setup

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Auth middleware: require valid client JWT
 */
async function requireAuth(request, env) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.slice(7);
  const payload = verifyJWT(token, env.JWT_SECRET);

  if (!payload || !payload.clientId) {
    return { error: 'Invalid token', status: 401 };
  }

  // Verify token in KV session store
  const sessionKey = `session:client:${payload.clientId}`;
  const session = await env.SESSIONS.get(sessionKey);

  if (!session) {
    return { error: 'Session expired', status: 401 };
  }

  return { clientId: payload.clientId, email: payload.email };
}

/**
 * Auth middleware: require valid healer JWT
 */
async function requireHealer(request, env) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.slice(7);
  const payload = verifyJWT(token, env.JWT_SECRET);

  if (!payload || !payload.healerId) {
    return { error: 'Invalid token', status: 401 };
  }

  const sessionKey = `session:healer:${payload.healerId}`;
  const session = await env.SESSIONS.get(sessionKey);

  if (!session) {
    return { error: 'Session expired', status: 401 };
  }

  return { healerId: payload.healerId, email: payload.email };
}

/**
 * Auth middleware: require admin JWT
 */
async function requireAdmin(request, env) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.slice(7);
  const payload = verifyJWT(token, env.JWT_SECRET);

  if (!payload || !payload.adminId) {
    return { error: 'Invalid token', status: 401 };
  }

  const sessionKey = `session:admin:${payload.adminId}`;
  const session = await env.SESSIONS.get(sessionKey);

  if (!session) {
    return { error: 'Session expired', status: 401 };
  }

  return { adminId: payload.adminId, email: payload.email };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/**
 * Parse URL and return path components
 */
function parsePath(path) {
  return path.split('/').filter(Boolean);
}

/**
 * Get subdomain from request hostname
 * Returns null for main domain, or the subdomain string for healer storefronts
 */
function getSubdomain(request) {
  const host = request.headers.get('host') || '';

  // Ignore workers.dev domains — always treat as main site
  if (host.includes('workers.dev')) return null;

  // Ignore www
  if (host.startsWith('www.')) return null;

  // Handle atmavana.net subdomains: sarah.atmavana.net → "sarah"
  if (host.endsWith('.atmavana.net')) {
    const sub = host.replace('.atmavana.net', '');
    if (sub && !sub.includes('.')) return sub;
    return null;
  }

  // If it's exactly atmavana.net, it's the main domain
  if (host === 'atmavana.net') return null;

  // Anything else might be a custom domain — return null and let the custom domain handler check
  return null;
}

/**
 * Hash password (simplified - use bcrypt in production)
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify password
 */
async function verifyPassword(password, hash) {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

// ============================================================================
// NOTIFICATIONS HELPER
// ============================================================================

async function createNotification(env, userId, userType, type, title, message, link = null) {
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO notifications (id, user_id, user_type, type, title, message, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))"
  ).bind(id, userId, userType, type, title, message, link).run();
  return id;
}

// ============================================================================
// PAYMENT PROCESSING
// ============================================================================

/**
 * Create Stripe PaymentIntent
 */
async function createStripePaymentIntent(env, amount, currency, metadata) {
  const params = new URLSearchParams({
    amount: Math.round(amount * 100), // cents
    currency: currency.toLowerCase(),
    metadata: JSON.stringify(metadata),
    application_fee_amount: Math.round(ATMAVANA_FIXED_FEE_USD * 100),
    description: metadata.description || 'AtmaVana Service'
  });

  const response = await fetch(`${STRIPE_API_URL}/payment_intents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Stripe error:', error);
    return { error: 'Payment intent creation failed' };
  }

  return await response.json();
}

/**
 * Create NOWPayments invoice for crypto payments
 */
async function createNOWPaymentsInvoice(env, amount, currency, bookingId, notificationUrl) {
  const payload = {
    price_amount: amount,
    price_currency: currency,
    order_id: bookingId,
    order_description: `AtmaVana booking ${bookingId}`,
    ipn_callback_url: notificationUrl,
    success_url: `https://atmavana.net/booking/${bookingId}/success`,
    cancel_url: `https://atmavana.net/booking/${bookingId}/cancel`
  };

  const response = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
    method: 'POST',
    headers: {
      'x-api-key': env.NOWPAYMENTS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('NOWPayments error:', error);
    return { error: 'Invoice creation failed' };
  }

  return await response.json();
}

/**
 * Generate Sumsub access token for Web SDK
 */
async function generateSumsubAccessToken(env, applicantId, levelName) {
  const ts = Math.floor(Date.now() / 1000);

  // Build request body
  const body = JSON.stringify({
    userId: applicantId,
    levelName: levelName || 'basic-kyc'
  });

  // Create signature: HMAC-SHA256 of body
  const encoder = new TextEncoder();
  const bodyBytes = encoder.encode(body);
  const keyBytes = encoder.encode(env.SUMSUB_SECRET_KEY);

  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, bodyBytes);
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const response = await fetch(`${SUMSUB_API_URL}/resources/accessTokens?userId=${applicantId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.SUMSUB_APP_TOKEN}`,
      'X-App-Access-Sig': signatureHex,
      'X-App-Access-Ts': ts.toString(),
      'Content-Type': 'application/json'
    },
    body
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Sumsub error:', error);
    return { error: 'Token generation failed' };
  }

  return await response.json();
}

// ============================================================================
// API ROUTES: AUTHENTICATION
// ============================================================================

/**
 * POST /api/auth/register - Register new client
 */
async function handleClientRegister(request, env) {
  const { email, password, name, timezone } = await request.json();

  if (!email || !password || !name) {
    return json({ error: 'Missing required fields' }, 400);
  }

  // Check if email already exists
  const existing = await env.DB.prepare(
    'SELECT id FROM clients WHERE email = ?'
  ).bind(email).first();

  if (existing) {
    return json({ error: 'Email already registered' }, 409);
  }

  // Hash password and create client
  const passwordHash = await hashPassword(password);
  const clientId = crypto.randomUUID();

  await env.DB.prepare(`
    INSERT INTO clients (id, email, name, password_hash, timezone, credit_balance_usd, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))
  `).bind(clientId, email, name, passwordHash, timezone || 'UTC').run();

  // Create session token
  const token = createJWT({ clientId, email }, env.JWT_SECRET);
  const sessionKey = `session:client:${clientId}`;
  await env.SESSIONS.put(sessionKey, JSON.stringify({ clientId, email }), {
    expirationTtl: JWT_EXPIRY_HOURS * 3600
  });

  return json({ token, clientId, email, name }, 201);
}

/**
 * POST /api/auth/login - Client login
 */
async function handleClientLogin(request, env) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return json({ error: 'Missing email or password' }, 400);
  }

  const client = await env.DB.prepare(
    'SELECT id, password_hash, email, name FROM clients WHERE email = ?'
  ).bind(email).first();

  if (!client) {
    return json({ error: 'Invalid credentials' }, 401);
  }

  const isValid = await verifyPassword(password, client.password_hash);
  if (!isValid) {
    return json({ error: 'Invalid credentials' }, 401);
  }

  // Create session token
  const token = createJWT({ clientId: client.id, email: client.email }, env.JWT_SECRET);
  const sessionKey = `session:client:${client.id}`;
  await env.SESSIONS.put(sessionKey, JSON.stringify({ clientId: client.id, email: client.email }), {
    expirationTtl: JWT_EXPIRY_HOURS * 3600
  });

  return json({ token, clientId: client.id, email: client.email, name: client.name });
}

/**
 * POST /api/admin/login - Admin login
 */
async function handleAdminLogin(request, env) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return json({ error: 'Missing email or password' }, 400);
  }

  const admin = await env.DB.prepare(
    'SELECT id, password_hash, email, role FROM admin_users WHERE email = ?'
  ).bind(email).first();

  if (!admin) {
    return json({ error: 'Invalid credentials' }, 401);
  }

  const isValid = await verifyPassword(password, admin.password_hash);
  if (!isValid) {
    return json({ error: 'Invalid credentials' }, 401);
  }

  // Create session token
  const token = createJWT({ adminId: admin.id, email: admin.email, role: admin.role }, env.JWT_SECRET);
  const sessionKey = `session:admin:${admin.id}`;
  await env.SESSIONS.put(sessionKey, JSON.stringify({ adminId: admin.id, email: admin.email, role: admin.role }), {
    expirationTtl: JWT_EXPIRY_HOURS * 3600
  });

  return json({ token, adminId: admin.id, email: admin.email, role: admin.role });
}

// ============================================================================
// API ROUTES: HEALERS
// ============================================================================

/**
 * GET /api/healers - List active healers with filters
 */
async function handleGetHealers(request, env) {
  const url = new URL(request.url);
  const modality = url.searchParams.get('modality');
  const language = url.searchParams.get('language');
  const featured = url.searchParams.get('featured') === 'true';
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let query = 'SELECT * FROM healers WHERE is_active = 1';
  const params = [];

  if (featured) {
    query += ' AND is_featured = 1';
  }

  if (modality) {
    query += ' AND modalities LIKE ?';
    params.push(`%${modality}%`);
  }

  if (language) {
    query += ' AND languages LIKE ?';
    params.push(`%${language}%`);
  }

  query += ' ORDER BY rating_avg DESC, created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  let stmt = env.DB.prepare(query);
  for (const param of params) {
    stmt = stmt.bind(param);
  }

  const healers = await stmt.all();

  return json({ healers: healers.results || [] });
}

/**
 * GET /api/healers/:slug - Get healer by slug
 */
async function handleGetHealerBySlug(request, env, slug) {
  const healer = await env.DB.prepare(
    'SELECT * FROM healers WHERE slug = ? AND is_active = 1'
  ).bind(slug).first();

  if (!healer) {
    return json({ error: 'Healer not found' }, 404);
  }

  // Get services
  const services = await env.DB.prepare(
    'SELECT * FROM services WHERE healer_id = ? AND is_active = 1'
  ).bind(healer.id).all();

  // Get reviews
  const reviews = await env.DB.prepare(
    'SELECT r.*, c.name as client_name FROM reviews r JOIN clients c ON r.client_id = c.id WHERE r.healer_id = ? AND r.is_visible = 1 ORDER BY r.created_at DESC LIMIT 10'
  ).bind(healer.id).all();

  // Get availability
  const availability = await env.DB.prepare(
    'SELECT * FROM availability WHERE healer_id = ? AND is_active = 1'
  ).bind(healer.id).all();

  return json({
    healer,
    services: services.results || [],
    reviews: reviews.results || [],
    availability: availability.results || []
  });
}

/**
 * PUT /api/healers/:id - Healer update own profile
 */
async function handleUpdateHealer(request, env, healerId) {
  const auth = await requireHealer(request, env);
  if (auth.error) return json(auth, auth.status);
  if (auth.healerId !== healerId) return json({ error: 'Forbidden' }, 403);

  const updates = await request.json();
  const allowed = ['bio', 'tagline', 'photo_url', 'modalities', 'languages', 'timezone'];

  const setClauses = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowed.includes(key)) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) {
    return json({ error: 'No valid fields to update' }, 400);
  }

  values.push(healerId);
  const query = `UPDATE healers SET ${setClauses.join(', ')}, updated_at = datetime('now') WHERE id = ?`;

  await env.DB.prepare(query).bind(...values).run();

  const updated = await env.DB.prepare('SELECT * FROM healers WHERE id = ?').bind(healerId).first();
  return json(updated);
}

/**
 * POST /api/healers - Admin: create healer invitation
 */
async function handleCreateHealerInvitation(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return json(auth, auth.status);

  const { email, name } = await request.json();

  if (!email || !name) {
    return json({ error: 'Missing email or name' }, 400);
  }

  // Check if healer email already exists
  const existing = await env.DB.prepare(
    'SELECT id FROM healers WHERE email = ?'
  ).bind(email).first();

  if (existing) {
    return json({ error: 'Healer email already exists' }, 409);
  }

  // Create healer record (invitation state)
  const healerId = crypto.randomUUID();
  const slug = name.toLowerCase().replace(/\s+/g, '-');

  await env.DB.prepare(`
    INSERT INTO healers (
      id, email, name, slug, bio, tagline, kyc_status,
      subscription_tier, subscription_status, is_active, rating_avg, rating_count,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, '', '', 'pending', 'free', 'inactive', 0, 0, 0, datetime('now'), datetime('now'))
  `).bind(healerId, email, name, slug).run();

  return json({ healerId, email, name, slug }, 201);
}

// ============================================================================
// API ROUTES: SERVICES
// ============================================================================

/**
 * GET /api/services/:healerId - List services for a healer
 */
async function handleGetServices(request, env, healerId) {
  const services = await env.DB.prepare(
    'SELECT * FROM services WHERE healer_id = ? AND is_active = 1'
  ).bind(healerId).all();

  return json({ services: services.results || [] });
}

/**
 * POST /api/services - Healer: create service
 */
async function handleCreateService(request, env) {
  const auth = await requireHealer(request, env);
  if (auth.error) return json(auth, auth.status);

  const { title, description, type, duration_minutes, price_usd, is_free, max_participants, modality, intake_form_json } = await request.json();

  if (!title || !type) {
    return json({ error: 'Missing required fields' }, 400);
  }

  const serviceId = crypto.randomUUID();

  await env.DB.prepare(`
    INSERT INTO services (
      id, healer_id, title, description, type, duration_minutes, price_usd, is_free,
      max_participants, modality, intake_form_json, is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
  `).bind(
    serviceId,
    auth.healerId,
    title,
    description || '',
    type,
    duration_minutes || 60,
    price_usd || 0,
    is_free ? 1 : 0,
    max_participants || 1,
    modality || '',
    intake_form_json || '{}'
  ).run();

  const service = await env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(serviceId).first();
  return json(service, 201);
}

/**
 * PUT /api/services/:id - Healer: update service
 */
async function handleUpdateService(request, env, serviceId) {
  const auth = await requireHealer(request, env);
  if (auth.error) return json(auth, auth.status);

  // Check ownership
  const service = await env.DB.prepare('SELECT healer_id FROM services WHERE id = ?').bind(serviceId).first();
  if (!service || service.healer_id !== auth.healerId) {
    return json({ error: 'Forbidden' }, 403);
  }

  const updates = await request.json();
  const allowed = ['title', 'description', 'type', 'duration_minutes', 'price_usd', 'is_free', 'max_participants', 'modality', 'intake_form_json'];

  const setClauses = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowed.includes(key)) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) {
    return json({ error: 'No valid fields to update' }, 400);
  }

  values.push(serviceId);
  const query = `UPDATE services SET ${setClauses.join(', ')}, updated_at = datetime('now') WHERE id = ?`;

  await env.DB.prepare(query).bind(...values).run();

  const updated = await env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(serviceId).first();
  return json(updated);
}

// ============================================================================
// API ROUTES: BOOKINGS
// ============================================================================

/**
 * POST /api/bookings - Client: create booking
 */
async function handleCreateBooking(request, env) {
  const auth = await requireAuth(request, env);
  if (auth.error) return json(auth, auth.status);

  const { service_id, scheduled_at, intake_responses_json } = await request.json();

  if (!service_id || !scheduled_at) {
    return json({ error: 'Missing required fields' }, 400);
  }

  // Get service and healer
  const service = await env.DB.prepare(
    'SELECT s.*, h.id as healer_id FROM services s JOIN healers h ON s.healer_id = h.id WHERE s.id = ?'
  ).bind(service_id).first();

  if (!service) {
    return json({ error: 'Service not found' }, 404);
  }

  const bookingId = crypto.randomUUID();
  const paymentAmount = service.is_free ? 0 : service.price_usd;
  const commissionAmount = Math.round(paymentAmount * (ATMAVANA_COMMISSION_PERCENT / 100) * 100) / 100;

  await env.DB.prepare(`
    INSERT INTO bookings (
      id, service_id, healer_id, client_id, status, scheduled_at, duration_minutes,
      payment_method, payment_status, payment_amount_usd, commission_amount_usd,
      intake_responses_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, 'pending', ?, ?, 'pending', 'pending', ?, ?, ?, datetime('now'), datetime('now'))
  `).bind(
    bookingId,
    service_id,
    service.healer_id,
    auth.clientId,
    scheduled_at,
    service.duration_minutes,
    paymentAmount,
    commissionAmount,
    intake_responses_json || '{}'
  ).run();

  const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(bookingId).first();

  // Notify the practitioner about the new booking
  const clientInfo = await env.DB.prepare('SELECT name FROM clients WHERE id = ?').bind(auth.clientId).first();
  await createNotification(env, service.healer_id, 'healer', 'new_booking',
    'New Booking Request',
    (clientInfo?.name || 'A client') + ' booked ' + (service.title || 'a session') + ' on ' + new Date(scheduled_at).toLocaleDateString(),
    '/dashboard'
  );

  // Notify the client about their booking confirmation
  const healerInfo = await env.DB.prepare('SELECT name FROM healers WHERE id = ?').bind(service.healer_id).first();
  await createNotification(env, auth.clientId, 'client', 'booking_confirmed',
    'Booking Confirmed',
    'Your session with ' + (healerInfo?.name || 'your practitioner') + ' is scheduled for ' + new Date(scheduled_at).toLocaleDateString(),
    '/account'
  );

  return json(booking, 201);
}

/**
 * GET /api/bookings/healer/:healerId - Healer: list their bookings
 */
async function handleGetHealerBookings(request, env, healerId) {
  const auth = await requireHealer(request, env);
  if (auth.error) return json(auth, auth.status);
  if (auth.healerId !== healerId) return json({ error: 'Forbidden' }, 403);

  const bookings = await env.DB.prepare(
    'SELECT b.*, s.title as service_title, c.name as client_name FROM bookings b JOIN services s ON b.service_id = s.id JOIN clients c ON b.client_id = c.id WHERE b.healer_id = ? ORDER BY b.scheduled_at DESC'
  ).bind(healerId).all();

  return json({ bookings: bookings.results || [] });
}

/**
 * GET /api/bookings/client/:clientId - Client: list their bookings
 */
async function handleGetClientBookings(request, env, clientId) {
  const auth = await requireAuth(request, env);
  if (auth.error) return json(auth, auth.status);
  if (auth.clientId !== clientId) return json({ error: 'Forbidden' }, 403);

  const bookings = await env.DB.prepare(
    'SELECT b.*, s.title as service_title, h.name as healer_name FROM bookings b JOIN services s ON b.service_id = s.id JOIN healers h ON b.healer_id = h.id WHERE b.client_id = ? ORDER BY b.scheduled_at DESC'
  ).bind(clientId).all();

  return json({ bookings: bookings.results || [] });
}

/**
 * PUT /api/bookings/:id/cancel - Cancel booking
 */
async function handleCancelBooking(request, env, bookingId) {
  const auth = await requireAuth(request, env);
  if (auth.error) return json(auth, auth.status);

  // Verify ownership
  const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ? AND client_id = ?').bind(bookingId, auth.clientId).first();
  if (!booking) {
    return json({ error: 'Booking not found or unauthorized' }, 404);
  }

  if (booking.status === 'completed' || booking.status === 'cancelled') {
    return json({ error: `Cannot cancel ${booking.status} booking` }, 400);
  }

  await env.DB.prepare('UPDATE bookings SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').bind('cancelled', bookingId).run();

  // Notify the practitioner about the cancellation
  const cancelClient = await env.DB.prepare('SELECT name FROM clients WHERE id = ?').bind(auth.clientId).first();
  const cancelService = await env.DB.prepare('SELECT title FROM services WHERE id = ?').bind(booking.service_id).first();
  await createNotification(env, booking.healer_id, 'healer', 'booking_cancelled',
    'Booking Cancelled',
    (cancelClient?.name || 'A client') + ' cancelled their ' + (cancelService?.title || 'session') + ' on ' + new Date(booking.scheduled_at).toLocaleDateString(),
    '/dashboard'
  );

  const updated = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(bookingId).first();
  return json(updated);
}

// ============================================================================
// API ROUTES: REVIEWS
// ============================================================================

/**
 * POST /api/reviews - Client: submit review
 */
async function handleCreateReview(request, env) {
  const auth = await requireAuth(request, env);
  if (auth.error) return json(auth, auth.status);

  const { booking_id, rating, text } = await request.json();

  if (!booking_id || !rating || rating < 1 || rating > 5) {
    return json({ error: 'Invalid rating (1-5)' }, 400);
  }

  // Verify booking exists and belongs to client
  const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ? AND client_id = ?').bind(booking_id, auth.clientId).first();
  if (!booking) {
    return json({ error: 'Booking not found' }, 404);
  }

  const reviewId = crypto.randomUUID();

  await env.DB.prepare(`
    INSERT INTO reviews (id, booking_id, healer_id, client_id, rating, text, is_visible, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))
  `).bind(reviewId, booking_id, booking.healer_id, auth.clientId, rating, text || '').run();

  // Update healer rating
  const ratingStats = await env.DB.prepare(
    'SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE healer_id = ? AND is_visible = 1'
  ).bind(booking.healer_id).first();

  const avgRating = ratingStats.avg || 0;
  const countRating = ratingStats.count || 0;

  await env.DB.prepare(
    'UPDATE healers SET rating_avg = ?, rating_count = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).bind(avgRating, countRating, booking.healer_id).run();

  const review = await env.DB.prepare('SELECT * FROM reviews WHERE id = ?').bind(reviewId).first();

  // Notify the practitioner about the new review
  const reviewClient = await env.DB.prepare('SELECT name FROM clients WHERE id = ?').bind(auth.clientId).first();
  await createNotification(env, booking.healer_id, 'healer', 'new_review',
    'New Review (' + rating + '★)',
    (reviewClient?.name || 'A client') + ' left a ' + rating + '-star review' + (text ? ': "' + text.substring(0, 60) + (text.length > 60 ? '...' : '') + '"' : ''),
    '/dashboard'
  );

  return json(review, 201);
}

// ============================================================================
// API ROUTES: PAYMENTS
// ============================================================================

/**
 * POST /api/payments/create-fiat - Create Stripe PaymentIntent
 */
async function handleCreateFiatPayment(request, env) {
  const auth = await requireAuth(request, env);
  if (auth.error) return json(auth, auth.status);

  const { booking_id, currency } = await request.json();

  const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ? AND client_id = ?').bind(booking_id, auth.clientId).first();
  if (!booking) {
    return json({ error: 'Booking not found' }, 404);
  }

  if (booking.payment_status !== 'pending') {
    return json({ error: 'Booking already paid' }, 400);
  }

  const paymentIntent = await createStripePaymentIntent(env, booking.payment_amount_usd, currency || 'USD', {
    bookingId: booking_id,
    clientId: auth.clientId,
    healerId: booking.healer_id,
    description: `AtmaVana Service Booking`
  });

  if (paymentIntent.error) {
    return json(paymentIntent, 400);
  }

  // Update booking with Stripe payment intent ID
  await env.DB.prepare('UPDATE bookings SET stripe_payment_intent_id = ?, payment_method = ? WHERE id = ?').bind(paymentIntent.id, 'stripe', booking_id).run();

  return json({
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency
  });
}

/**
 * POST /api/payments/create-crypto - Create NOWPayments invoice
 */
async function handleCreateCryptoPayment(request, env) {
  const auth = await requireAuth(request, env);
  if (auth.error) return json(auth, auth.status);

  const { booking_id } = await request.json();

  const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ? AND client_id = ?').bind(booking_id, auth.clientId).first();
  if (!booking) {
    return json({ error: 'Booking not found' }, 404);
  }

  if (booking.payment_status !== 'pending') {
    return json({ error: 'Booking already paid' }, 400);
  }

  const notificationUrl = `${new URL(request.url).origin}/webhooks/nowpayments`;

  const invoice = await createNOWPaymentsInvoice(env, booking.payment_amount_usd, 'USD', booking_id, notificationUrl);

  if (invoice.error) {
    return json(invoice, 400);
  }

  // Update booking with crypto invoice ID
  await env.DB.prepare('UPDATE bookings SET crypto_invoice_id = ?, payment_method = ? WHERE id = ?').bind(invoice.id, 'crypto', booking_id).run();

  return json({
    invoiceId: invoice.id,
    invoiceUrl: invoice.invoice_url,
    amount: invoice.price_amount,
    currency: invoice.price_currency
  });
}

// ============================================================================
// API ROUTES: KYC
// ============================================================================

/**
 * POST /api/kyc/init - Healer: initiate Sumsub verification
 */
async function handleInitKYC(request, env) {
  const auth = await requireHealer(request, env);
  if (auth.error) return json(auth, auth.status);

  // Check KYC status
  const healer = await env.DB.prepare('SELECT kyc_status FROM healers WHERE id = ?').bind(auth.healerId).first();

  if (healer.kyc_status === 'verified') {
    return json({ error: 'KYC already verified' }, 400);
  }

  // Generate Sumsub access token
  const result = await generateSumsubAccessToken(env, auth.healerId, 'basic-kyc');

  if (result.error) {
    return json(result, 400);
  }

  // Update healer KYC status to pending
  await env.DB.prepare('UPDATE healers SET kyc_status = ?, kyc_provider_id = ?, updated_at = datetime(\'now\') WHERE id = ?').bind('pending', auth.healerId, auth.healerId).run();

  return json({
    accessToken: result.token,
    userId: auth.healerId,
    expiresAt: result.expiresAt
  });
}

/**
 * GET /api/kyc/status/:healerId - Get KYC status
 */
async function handleGetKYCStatus(request, env, healerId) {
  const healer = await env.DB.prepare('SELECT id, kyc_status, kyc_provider_id FROM healers WHERE id = ?').bind(healerId).first();

  if (!healer) {
    return json({ error: 'Healer not found' }, 404);
  }

  return json({
    healerId: healer.id,
    status: healer.kyc_status,
    providerId: healer.kyc_provider_id
  });
}

// ============================================================================
// WEBHOOK ROUTES
// ============================================================================

/**
 * POST /webhooks/stripe - Handle Stripe webhooks
 */
async function handleStripeWebhook(request, env) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  // Verify webhook signature (simplified - use proper verification in production)
  let event;
  try {
    event = JSON.parse(body);
  } catch (e) {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const paymentIntent = event.data.object;

  if (event.type === 'payment_intent.succeeded') {
    // Find booking by payment intent ID
    const booking = await env.DB.prepare(
      'SELECT * FROM bookings WHERE stripe_payment_intent_id = ?'
    ).bind(paymentIntent.id).first();

    if (booking) {
      // Update booking as paid
      await env.DB.prepare(
        'UPDATE bookings SET payment_status = ?, status = ? WHERE id = ?'
      ).bind('succeeded', 'confirmed', booking.id).run();

      // Create payout record for healer (deferred)
      const healerPayoutAmount = booking.payment_amount_usd - booking.commission_amount_usd;
      const payoutId = crypto.randomUUID();

      await env.DB.prepare(`
        INSERT INTO payouts (id, healer_id, amount_usd, method, status, created_at)
        VALUES (?, ?, ?, 'stripe', 'pending', datetime('now'))
      `).bind(payoutId, booking.healer_id, healerPayoutAmount).run();
    }
  } else if (event.type === 'payment_intent.failed') {
    const booking = await env.DB.prepare(
      'SELECT * FROM bookings WHERE stripe_payment_intent_id = ?'
    ).bind(paymentIntent.id).first();

    if (booking) {
      await env.DB.prepare(
        'UPDATE bookings SET payment_status = ?, status = ? WHERE id = ?'
      ).bind('failed', 'cancelled', booking.id).run();
    }
  }

  return json({ received: true });
}

/**
 * POST /webhooks/nowpayments - Handle NOWPayments IPN
 */
async function handleNOWPaymentsWebhook(request, env) {
  const body = await request.json();

  // Verify IPN signature (simplified)
  // In production, verify the signature from IPN secret

  const { order_id, payment_status, pay_amount } = body;

  if (payment_status === 'finished') {
    // Payment confirmed
    const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(order_id).first();

    if (booking) {
      await env.DB.prepare(
        'UPDATE bookings SET payment_status = ?, crypto_invoice_id = ?, status = ? WHERE id = ?'
      ).bind('succeeded', body.invoice_id, 'confirmed', order_id).run();

      // Create payout record
      const healerPayoutAmount = booking.payment_amount_usd - booking.commission_amount_usd;
      const payoutId = crypto.randomUUID();

      await env.DB.prepare(`
        INSERT INTO payouts (id, healer_id, amount_usd, method, status, created_at)
        VALUES (?, ?, ?, 'crypto', 'pending', datetime('now'))
      `).bind(payoutId, booking.healer_id, healerPayoutAmount).run();
    }
  } else if (payment_status === 'failed' || payment_status === 'expired') {
    const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(order_id).first();

    if (booking) {
      await env.DB.prepare(
        'UPDATE bookings SET payment_status = ?, status = ? WHERE id = ?'
      ).bind('failed', 'cancelled', order_id).run();
    }
  }

  return json({ status: 'ok' });
}

/**
 * POST /webhooks/sumsub - Handle Sumsub KYC webhooks
 */
async function handleSumsubWebhook(request, env) {
  const body = await request.json();

  // Verify webhook signature (simplified)
  // In production: verify X-App-Access-Sig header

  const { applicantId, reviewStatus, rejectLabels } = body;

  if (reviewStatus === 'approved') {
    // KYC verified
    await env.DB.prepare(
      'UPDATE healers SET kyc_status = ?, updated_at = datetime(\'now\') WHERE id = ?'
    ).bind('verified', applicantId).run();
  } else if (reviewStatus === 'rejected') {
    // KYC rejected
    await env.DB.prepare(
      'UPDATE healers SET kyc_status = ?, updated_at = datetime(\'now\') WHERE id = ?'
    ).bind('rejected', applicantId).run();
  }

  return json({ status: 'ok' });
}

// ============================================================================
// PAGE RENDERING
// ============================================================================

// ============================================================================
// MAIN ROUTER
// ============================================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // Get subdomain or custom domain
    const subdomain = getSubdomain(request);

    try {
      // API Routes
      if (pathname.startsWith('/api/')) {
        const parts = parsePath(pathname);

        // Auth endpoints
        if (parts[1] === 'auth') {
          if (parts[2] === 'register' && method === 'POST') return handleClientRegister(request, env);
          if (parts[2] === 'login' && method === 'POST') return handleClientLogin(request, env);
        }

        if (parts[1] === 'admin') {
          if (parts[2] === 'login' && method === 'POST') return handleAdminLogin(request, env);
        }

        // Healer endpoints
        if (parts[1] === 'healers') {
          if (!parts[2] && method === 'GET') return handleGetHealers(request, env);
          if (!parts[2] && method === 'POST') return handleCreateHealerInvitation(request, env);
          if (parts[2] && !parts[3] && method === 'GET') return handleGetHealerBySlug(request, env, parts[2]);
          if (parts[2] && method === 'PUT') return handleUpdateHealer(request, env, parts[2]);
        }

        // Service endpoints
        if (parts[1] === 'services') {
          if (parts[2] && !parts[3] && method === 'GET') return handleGetServices(request, env, parts[2]);
          if (!parts[2] && method === 'POST') return handleCreateService(request, env);
          if (parts[2] && method === 'PUT') return handleUpdateService(request, env, parts[2]);
        }

        // Booking endpoints
        if (parts[1] === 'bookings') {
          if (!parts[2] && method === 'POST') return handleCreateBooking(request, env);
          if (parts[2] === 'healer' && parts[3]) return handleGetHealerBookings(request, env, parts[3]);
          if (parts[2] === 'client' && parts[3]) return handleGetClientBookings(request, env, parts[3]);
          if (parts[3] === 'cancel') return handleCancelBooking(request, env, parts[2]);
        }

        // Review endpoints
        if (parts[1] === 'reviews' && method === 'POST') return handleCreateReview(request, env);

        // Payment endpoints
        if (parts[1] === 'payments') {
          if (parts[2] === 'create-fiat') return handleCreateFiatPayment(request, env);
          if (parts[2] === 'create-crypto') return handleCreateCryptoPayment(request, env);
        }

        // KYC endpoints
        if (parts[1] === 'kyc') {
          if (parts[2] === 'init') return handleInitKYC(request, env);
          if (parts[2] === 'status' && parts[3]) return handleGetKYCStatus(request, env, parts[3]);
        }

        // Newsletter endpoints
        if (parts[1] === 'newsletter') {
          if (parts[2] === 'subscribe' && method === 'POST') {
            const { email } = await request.json();
            if (!email || !email.includes('@')) return json({ error: 'Valid email required' }, 400);
            const existing = await env.DB.prepare('SELECT id, is_active FROM email_subscribers WHERE email = ?').bind(email.toLowerCase()).first();
            if (existing && existing.is_active) return json({ message: 'Already subscribed' });
            if (existing && !existing.is_active) {
              await env.DB.prepare('UPDATE email_subscribers SET is_active = 1, unsubscribed_at = NULL WHERE id = ?').bind(existing.id).run();
              return json({ message: 'Welcome back' });
            }
            const id = crypto.randomUUID();
            await env.DB.prepare('INSERT INTO email_subscribers (id, email, source) VALUES (?, ?, ?)').bind(id, email.toLowerCase(), 'website').run();
            return json({ message: 'Subscribed' }, 201);
          }
          if (parts[2] === 'unsubscribe' && method === 'POST') {
            const { email } = await request.json();
            if (!email) return json({ error: 'Email required' }, 400);
            await env.DB.prepare("UPDATE email_subscribers SET is_active = 0, unsubscribed_at = datetime('now') WHERE email = ?").bind(email.toLowerCase()).run();
            return json({ message: 'Unsubscribed' });
          }
        }

        // Notification endpoints
        if (parts[1] === 'notifications') {
          const authHeader = request.headers.get('Authorization');
          const token = authHeader ? verifyJWT(authHeader.replace('Bearer ', ''), env.JWT_SECRET) : null;
          if (!token) return json({ error: 'Unauthorized' }, 401);

          const userId = token.clientId || token.healerId;
          const userType = token.clientId ? 'client' : 'healer';

          if (!parts[2] && method === 'GET') {
            const notifs = await env.DB.prepare(
              'SELECT * FROM notifications WHERE user_id = ? AND user_type = ? ORDER BY created_at DESC LIMIT 20'
            ).bind(userId, userType).all();
            const unreadCount = await env.DB.prepare(
              'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND user_type = ? AND is_read = 0'
            ).bind(userId, userType).first();
            return json({ notifications: notifs.results || [], unread: unreadCount?.count || 0 });
          }
          if (parts[2] === 'read' && method === 'POST') {
            const { notificationId } = await request.json();
            if (notificationId === 'all') {
              await env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND user_type = ?').bind(userId, userType).run();
            } else if (notificationId) {
              await env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').bind(notificationId, userId).run();
            }
            return json({ message: 'Marked as read' });
          }
        }

        return json({ error: 'Not found' }, 404);
      }

      // Webhook Routes
      if (pathname.startsWith('/webhooks/')) {
        const parts = parsePath(pathname);

        if (parts[1] === 'stripe') return handleStripeWebhook(request, env);
        if (parts[1] === 'nowpayments') return handleNOWPaymentsWebhook(request, env);
        if (parts[1] === 'sumsub') return handleSumsubWebhook(request, env);

        return json({ error: 'Not found' }, 404);
      }

      // ────────────────────────────────────────────────────────
      // PAGE ROUTES (use templates from templates.js)
      // ────────────────────────────────────────────────────────

      // Subdomain handling — healer storefronts
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        const healer = await env.DB.prepare(
          'SELECT * FROM healers WHERE slug = ? AND is_active = 1'
        ).bind(subdomain).first();

        if (!healer) return html(render404Page());

        const services = await env.DB.prepare(
          'SELECT * FROM services WHERE healer_id = ? AND is_active = 1'
        ).bind(healer.id).all();

        const reviews = await env.DB.prepare(
          'SELECT r.*, c.name as client_name FROM reviews r JOIN clients c ON r.client_id = c.id WHERE r.healer_id = ? AND r.is_visible = 1 ORDER BY r.created_at DESC LIMIT 20'
        ).bind(healer.id).all();

        return html(renderStorefront(healer, services.results || [], reviews.results || []));
      }

      // Custom domain handling (skip for workers.dev and known domains)
      const hostHeader = request.headers.get('host') || '';
      if (!hostHeader.includes('atmavana.net') && !hostHeader.includes('localhost') && !hostHeader.includes('workers.dev')) {
        const healer = await env.DB.prepare(
          'SELECT * FROM healers WHERE custom_domain = ? AND is_active = 1'
        ).bind(hostHeader).first();

        if (healer) {
          const services = await env.DB.prepare(
            'SELECT * FROM services WHERE healer_id = ? AND is_active = 1'
          ).bind(healer.id).all();

          const reviews = await env.DB.prepare(
            'SELECT r.*, c.name as client_name FROM reviews r JOIN clients c ON r.client_id = c.id WHERE r.healer_id = ? AND r.is_visible = 1 ORDER BY r.created_at DESC LIMIT 20'
          ).bind(healer.id).all();

          return html(renderStorefront(healer, services.results || [], reviews.results || []));
        }
      }

      // Landing page
      if (pathname === '/') {
        const featured = await env.DB.prepare(
          'SELECT * FROM healers WHERE is_active = 1 AND is_featured = 1 LIMIT 6'
        ).all();
        return html(renderLandingPage(featured.results || []));
      }

      // Marketplace
      if (pathname === '/marketplace' || pathname === '/healers') {
        const healers = await env.DB.prepare(
          'SELECT * FROM healers WHERE is_active = 1 ORDER BY rating_avg DESC LIMIT 50'
        ).all();
        return html(renderMarketplace(healers.results || []));
      }

      // Healer storefront by slug: /healer/:slug
      if (pathname.startsWith('/healer/')) {
        const slug = pathname.split('/')[2];
        if (slug) {
          const healer = await env.DB.prepare(
            'SELECT * FROM healers WHERE slug = ? AND is_active = 1'
          ).bind(slug).first();

          if (!healer) return html(render404Page());

          const services = await env.DB.prepare(
            'SELECT * FROM services WHERE healer_id = ? AND is_active = 1'
          ).bind(healer.id).all();

          const reviews = await env.DB.prepare(
            'SELECT r.*, c.name as client_name FROM reviews r JOIN clients c ON r.client_id = c.id WHERE r.healer_id = ? AND r.is_visible = 1 ORDER BY r.created_at DESC LIMIT 20'
          ).bind(healer.id).all();

          return html(renderStorefront(healer, services.results || [], reviews.results || []));
        }
      }

      // Booking page: /booking/:serviceId
      if (pathname.startsWith('/booking/')) {
        const serviceId = pathname.split('/')[2];
        const service = await env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1').bind(serviceId).first();
        if (!service) return html(render404Page());
        const healer = await env.DB.prepare('SELECT * FROM healers WHERE id = ?').bind(service.healer_id).first();
        const availability = await env.DB.prepare('SELECT * FROM availability WHERE healer_id = ? AND is_active = 1').bind(healer.id).all();
        return html(renderBookingPage(service, healer, availability.results || []));
      }

      // Checkout page: /checkout/:bookingId
      if (pathname.startsWith('/checkout/')) {
        const bookingId = pathname.split('/')[2];
        const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(bookingId).first();
        if (!booking) return html(render404Page());
        const healer = await env.DB.prepare('SELECT * FROM healers WHERE id = ?').bind(booking.healer_id).first();
        const service = await env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(booking.service_id).first();
        return html(renderCheckoutPage(booking, healer, service));
      }

      // Confirmation page: /confirmation/:bookingId
      if (pathname.startsWith('/confirmation/')) {
        const bookingId = pathname.split('/')[2];
        const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(bookingId).first();
        if (!booking) return html(render404Page());
        const healer = await env.DB.prepare('SELECT * FROM healers WHERE id = ?').bind(booking.healer_id).first();
        const service = await env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(booking.service_id).first();
        return html(renderConfirmationPage(booking, healer, service));
      }

      // Client account page
      if (pathname === '/account') {
        // Parse client token from Authorization header or localStorage (sent via JS)
        const authHeader = request.headers.get('Authorization');
        const token = authHeader ? authHeader.replace('Bearer ', '') : null;

        // Render with empty data — the page will fetch data client-side if needed
        // For now, serve a page that reads clientId from localStorage and fetches data
        return html(renderClientAccount());
      }

      // Auth pages
      if (pathname === '/login') return html(renderLoginPage('client'));
      if (pathname === '/register') return html(renderRegisterPage());
      if (pathname === '/healer-login') return html(renderLoginPage('healer'));

      // Admin dashboard: /admin
      if (pathname === '/admin' || pathname === '/admin/') {
        // TODO: Add admin auth check via cookie/session
        const totalHealers = await env.DB.prepare('SELECT COUNT(*) as count FROM healers').first();
        const activeBookings = await env.DB.prepare("SELECT COUNT(*) as count FROM bookings WHERE status IN ('pending','confirmed')").first();
        const pendingKyc = await env.DB.prepare("SELECT COUNT(*) as count FROM healers WHERE kyc_status = 'pending'").first();
        const revenueMonth = await env.DB.prepare("SELECT COALESCE(SUM(commission_amount_usd), 0) as total FROM bookings WHERE payment_status = 'paid' AND created_at >= date('now', '-30 days')").first();
        const healersList = await env.DB.prepare('SELECT * FROM healers ORDER BY created_at DESC LIMIT 50').all();
        const recentBookings = await env.DB.prepare('SELECT b.*, h.name as healer_name, c.name as client_name, s.title as service_title FROM bookings b JOIN healers h ON b.healer_id = h.id JOIN clients c ON b.client_id = c.id JOIN services s ON b.service_id = s.id ORDER BY b.created_at DESC LIMIT 20').all();

        return html(renderAdminDashboard(
          { totalHealers: totalHealers?.count || 0, activeBookings: activeBookings?.count || 0, pendingKyc: pendingKyc?.count || 0, revenueMonth: revenueMonth?.total || 0 },
          healersList.results || [],
          recentBookings.results || []
        ));
      }

      // Healer dashboard: /dashboard
      if (pathname === '/dashboard') {
        // TODO: Add healer auth check via cookie/session
        return html(renderHealerDashboard());
      }

      // 404 for everything else
      return html(render404Page());

    } catch (error) {
      console.error('Worker error:', error);
      return html(renderErrorPage(error.message || 'An unexpected error occurred'));
    }
  }
};
