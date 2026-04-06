/**
 * AtmaVana HTML Templates Module
 * Exports functions that return complete HTML strings for each page
 * Brand: Deep Teal #1A6B6B, Soft Gold #C9A03A, Warm Ivory #FAF7F2, Charcoal #1E1E2E
 */

const BRAND_COLORS = {
  PRIMARY: '#1A6B6B',
  ACCENT: '#C9A03A',
  BACKGROUND: '#FAF7F2',
  TEXT: '#1E1E2E',
  LIGHT_GRAY: '#E8E6E1',
  BORDER: '#D4D0C8',
};

const BASE_HTML_TEMPLATE = (title, content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="AtmaVana - Your space to heal. Find trusted practitioners for meditation, reiki, pranic healing, theta healing, wellness coaching, and more.">
  <title>${title} | AtmaVana</title>
  <link rel="icon" type="image/x-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%231A6B6B' width='100' height='100'/><text x='50' y='70' font-size='60' fill='%23C9A03A' text-anchor='middle' font-family='serif' font-weight='bold'>A</text></svg>">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${BRAND_COLORS.PRIMARY};
      --accent: ${BRAND_COLORS.ACCENT};
      --background: ${BRAND_COLORS.BACKGROUND};
      --text: ${BRAND_COLORS.TEXT};
      --light-gray: ${BRAND_COLORS.LIGHT_GRAY};
      --border: ${BRAND_COLORS.BORDER};
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      font-family: 'Inter', sans-serif;
      color: var(--text);
      background-color: var(--background);
      line-height: 1.6;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 600;
      line-height: 1.2;
    }

    h1 { font-size: 3.5rem; margin-bottom: 1.5rem; }
    h2 { font-size: 2.5rem; margin-bottom: 1.5rem; }
    h3 { font-size: 1.75rem; margin-bottom: 1rem; }
    h4 { font-size: 1.35rem; }

    p { margin-bottom: 1rem; color: #3a3a3a; }

    a {
      color: var(--primary);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    a:hover {
      color: var(--accent);
    }

    button, .btn {
      font-family: 'Inter', sans-serif;
      padding: 0.875rem 1.75rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background-color: var(--accent);
      color: white;
    }

    .btn-primary:hover {
      background-color: #b38a2e;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(201, 160, 58, 0.3);
    }

    .btn-secondary {
      background-color: transparent;
      color: var(--primary);
      border: 2px solid var(--primary);
    }

    .btn-secondary:hover {
      background-color: var(--primary);
      color: white;
    }

    /* Navigation */
    nav {
      background-color: white;
      border-bottom: 1px solid var(--border);
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--primary);
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
      align-items: center;
    }

    .nav-links a {
      color: var(--text);
      font-weight: 500;
    }

    .nav-links a:hover {
      color: var(--primary);
    }

    .menu-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: white;
        padding: 1.5rem 2rem;
        gap: 1rem;
      }

      .nav-links.active {
        display: flex;
      }

      .menu-toggle {
        display: block;
      }
    }

    /* Container & Layout */
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .hero {
      background: linear-gradient(135deg, var(--primary) 0%, #245555 100%);
      color: white;
      padding: 6rem 2rem;
      text-align: center;
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .hero h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
      color: white;
    }

    .hero-tagline {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.95;
      color: var(--accent);
      font-style: italic;
    }

    .search-bar {
      max-width: 500px;
      margin: 2rem auto;
      display: flex;
      gap: 0.5rem;
      background: white;
      padding: 0.5rem;
      border-radius: 0.5rem;
    }

    .search-bar input {
      flex: 1;
      border: none;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border-radius: 0.4rem;
    }

    .search-bar input:focus {
      outline: none;
      background-color: var(--light-gray);
    }

    .search-bar button {
      background-color: var(--accent);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.4rem;
      cursor: pointer;
      font-weight: 600;
    }

    /* Cards */
    .card {
      background: white;
      border-radius: 0.75rem;
      overflow: hidden;
      transition: all 0.3s ease;
      border: 1px solid var(--border);
    }

    .card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
      transform: translateY(-4px);
    }

    .card-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
      background-color: var(--light-gray);
    }

    .card-body {
      padding: 1.5rem;
    }

    .card-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.35rem;
      margin-bottom: 0.5rem;
      color: var(--text);
    }

    .card-meta {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .rating {
      color: var(--accent);
      margin-bottom: 0.75rem;
    }

    .star {
      color: var(--accent);
    }

    .badge {
      display: inline-block;
      background-color: var(--primary);
      color: white;
      padding: 0.35rem 0.75rem;
      border-radius: 0.3rem;
      font-size: 0.8rem;
      font-weight: 600;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .badge-accent {
      background-color: var(--accent);
    }

    .badge-free {
      background-color: #27ae60;
    }

    /* Grid */
    .grid {
      display: grid;
      gap: 2rem;
      margin: 3rem 0;
    }

    .grid-2 {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    .grid-3 {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }

    .grid-4 {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 {
        grid-template-columns: 1fr;
      }
    }

    /* Sections */
    .section {
      padding: 4rem 2rem;
      border-bottom: 1px solid var(--border);
    }

    .section-title {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-title h2 {
      margin-bottom: 0.75rem;
    }

    .section-subtitle {
      font-size: 1.1rem;
      color: #666;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Steps */
    .steps {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 2rem;
      margin-top: 2rem;
    }

    .step {
      text-align: center;
      flex: 1;
      min-width: 200px;
    }

    .step-number {
      width: 50px;
      height: 50px;
      background-color: var(--primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto 1rem;
    }

    .step-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }

    .step-desc {
      color: #666;
      line-height: 1.6;
    }

    /* Trust Section */
    .trust-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .trust-item {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 0.75rem;
      border: 1px solid var(--border);
    }

    .trust-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .trust-item h4 {
      margin-bottom: 0.75rem;
      color: var(--primary);
    }

    .trust-item p {
      font-size: 0.95rem;
      color: #666;
    }

    /* Footer */
    footer {
      background-color: var(--text);
      color: white;
      padding: 3rem 2rem 1.5rem;
      margin-top: 4rem;
    }

    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h4 {
      color: var(--accent);
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .footer-section ul {
      list-style: none;
    }

    .footer-section li {
      margin-bottom: 0.75rem;
    }

    .footer-section a {
      color: #ccc;
      font-size: 0.95rem;
    }

    .footer-section a:hover {
      color: var(--accent);
    }

    .social-icons {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .social-icon {
      width: 40px;
      height: 40px;
      background-color: var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
      transition: background-color 0.3s ease;
    }

    .social-icon:hover {
      background-color: var(--accent);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 1.5rem;
      text-align: center;
      font-size: 0.9rem;
      color: #aaa;
    }

    /* Forms */
    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text);
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(26, 107, 107, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 120px;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .checkbox-group input[type="checkbox"] {
      width: auto;
      margin: 0;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 1rem;
      border-bottom: 2px solid var(--border);
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .tab-btn {
      background: none;
      border: none;
      padding: 1rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }

    .tab-btn.active {
      color: var(--primary);
      border-bottom-color: var(--accent);
    }

    .tab-btn:hover {
      color: var(--primary);
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Modal */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }

    .modal.active {
      display: flex;
    }

    .modal-content {
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    /* Sticky CTA */
    .sticky-cta {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid var(--border);
      padding: 1rem 2rem;
      text-align: center;
      z-index: 99;
      display: none;
    }

    .sticky-cta.active {
      display: block;
    }

    @media (min-width: 769px) {
      .sticky-cta {
        display: none !important;
      }
    }

    /* Verified Badge */
    .verified-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background-color: #e8f5e9;
      color: #27ae60;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    /* Profile Section */
    .profile-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      padding: 3rem 0;
    }

    .profile-image {
      width: 100%;
      max-width: 400px;
      aspect-ratio: 1;
      border-radius: 1rem;
      object-fit: cover;
      background: var(--light-gray);
    }

    .profile-info h1 {
      margin-bottom: 0.5rem;
    }

    .profile-tagline {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 1rem;
      font-style: italic;
    }

    .profile-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }

    .profile-meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .profile-header {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      h1 {
        font-size: 2.5rem;
      }
    }

    /* Calendar */
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
      margin: 1.5rem 0;
    }

    .calendar-day {
      aspect-ratio: 1;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 0.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .calendar-day:hover {
      border-color: var(--primary);
      background-color: var(--light-gray);
    }

    .calendar-day.selected {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .calendar-day.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Time Slots */
    .time-slots {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 0.75rem;
      margin: 1.5rem 0;
    }

    .time-slot {
      padding: 0.75rem;
      border: 2px solid var(--border);
      border-radius: 0.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .time-slot:hover:not(.disabled) {
      border-color: var(--primary);
      background-color: var(--light-gray);
    }

    .time-slot.selected {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .time-slot.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Status Messages */
    .alert {
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      border-left: 4px solid;
    }

    .alert-success {
      background-color: #e8f5e9;
      border-color: #27ae60;
      color: #1b5e20;
    }

    .alert-error {
      background-color: #ffebee;
      border-color: #e74c3c;
      color: #c62828;
    }

    .alert-info {
      background-color: #e3f2fd;
      border-color: #3498db;
      color: #1565c0;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
    }

    thead {
      background-color: var(--light-gray);
      border-bottom: 2px solid var(--border);
    }

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--text);
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid var(--border);
    }

    tr:hover {
      background-color: rgba(26, 107, 107, 0.02);
    }

    /* Stats Cards */
    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 0.75rem;
      border: 1px solid var(--border);
      text-align: center;
    }

    .stat-number {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.95rem;
    }

    /* Healer List Item */
    .healer-item {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
      padding: 2rem;
      background: white;
      border-radius: 0.75rem;
      border: 1px solid var(--border);
    }

    .healer-photo {
      width: 150px;
      height: 150px;
      border-radius: 0.75rem;
      object-fit: cover;
      background: var(--light-gray);
      flex-shrink: 0;
    }

    .healer-details h3 {
      margin-bottom: 0.5rem;
    }

    .healer-details .rating {
      margin-bottom: 1rem;
    }

    .healer-bio {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .healer-modalities {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .healer-item {
        flex-direction: column;
        text-align: center;
      }

      .healer-photo {
        width: 100%;
        max-width: 150px;
        margin: 0 auto;
      }

      .healer-modalities {
        justify-content: center;
      }
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin: 3rem 0;
      flex-wrap: wrap;
    }

    .pagination-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border);
      background: white;
      border-radius: 0.4rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .pagination-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .pagination-btn.active {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .pagination-btn.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  ${content}
  <script>
    // Mobile menu toggle
    function setupMobileMenu() {
      const menuToggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');

      if (menuToggle) {
        menuToggle.addEventListener('click', () => {
          navLinks.classList.toggle('active');
        });

        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            navLinks.classList.remove('active');
          });
        });
      }
    }

    // Tab switching
    function setupTabs() {
      const tabBtns = document.querySelectorAll('.tab-btn');
      const tabContents = document.querySelectorAll('.tab-content');

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabId = btn.getAttribute('data-tab');

          tabBtns.forEach(b => b.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));

          btn.classList.add('active');
          document.getElementById(tabId).classList.add('active');
        });
      });
    }

    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
      setupMobileMenu();
      setupTabs();
    });
  </script>
</body>
</html>`;

const NAVIGATION = `
<nav>
  <div class="nav-container">
    <div class="nav-logo">AtmaVana</div>
    <button class="menu-toggle">☰</button>
    <ul class="nav-links">
      <li><a href="/">Home</a></li>
      <li><a href="/healers">Practitioners</a></li>
      <li><a href="/#how-it-works">How It Works</a></li>
      <li id="nav-notif-item" style="display:none; position:relative;">
        <a href="#" id="nav-notif-bell" style="position:relative; font-size:1.2rem; text-decoration:none;">🔔<span id="nav-notif-badge" style="display:none; position:absolute; top:-6px; right:-8px; background:#e53e3e; color:white; font-size:0.65rem; font-weight:700; width:16px; height:16px; border-radius:50%; text-align:center; line-height:16px;"></span></a>
        <div id="nav-notif-dropdown" style="display:none; position:absolute; right:0; top:2.5rem; width:320px; max-height:400px; overflow-y:auto; background:white; border:1px solid var(--border); border-radius:0.75rem; box-shadow:0 8px 24px rgba(0,0,0,0.12); z-index:1000;">
          <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem; border-bottom:1px solid var(--border);">
            <strong style="font-size:0.95rem;">Notifications</strong>
            <a href="#" id="notif-mark-all" style="font-size:0.8rem; color:var(--primary);">Mark all read</a>
          </div>
          <div id="notif-list" style="padding:0.5rem;">
            <p style="text-align:center; color:#999; padding:1.5rem; font-size:0.9rem;">No notifications yet</p>
          </div>
        </div>
      </li>
      <li id="nav-auth-item"><a href="/login">Login</a></li>
    </ul>
  </div>
</nav>
<script>
(function() {
  var token = localStorage.getItem('atmavana_token');
  if (token) {
    // Show My Account + Logout
    var el = document.getElementById('nav-auth-item');
    if (el) {
      var userName = localStorage.getItem('atmavana_name') || 'My Account';
      var firstName = userName.split(' ')[0];
      el.innerHTML = '<a href="/account" style="font-weight:600;">' + firstName + '</a> &nbsp; <a href="#" id="nav-logout" style="font-size:0.9rem;opacity:0.8;">Logout</a>';
      document.getElementById('nav-logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('atmavana_token');
        localStorage.removeItem('atmavana_client_id');
        localStorage.removeItem('atmavana_healer_id');
        localStorage.removeItem('atmavana_name');
        window.location.href = '/';
      });
    }

    // Show notification bell and load notifications
    var notifItem = document.getElementById('nav-notif-item');
    if (notifItem) notifItem.style.display = 'block';

    var bell = document.getElementById('nav-notif-bell');
    var dropdown = document.getElementById('nav-notif-dropdown');
    var badge = document.getElementById('nav-notif-badge');
    var notifList = document.getElementById('notif-list');

    // Toggle dropdown
    bell.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', function() { dropdown.style.display = 'none'; });
    dropdown.addEventListener('click', function(e) { e.stopPropagation(); });

    // Fetch notifications
    async function loadNotifications() {
      try {
        var res = await fetch('/api/notifications', { headers: { 'Authorization': 'Bearer ' + token } });
        if (!res.ok) return;
        var data = await res.json();
        if (data.unread > 0) {
          badge.textContent = data.unread > 9 ? '9+' : data.unread;
          badge.style.display = 'block';
        } else {
          badge.style.display = 'none';
        }
        if (data.notifications && data.notifications.length > 0) {
          notifList.innerHTML = data.notifications.map(function(n) {
            return '<a href="' + (n.link || '#') + '" style="display:block; padding:0.75rem; border-radius:0.5rem; text-decoration:none; color:var(--text); ' + (n.is_read ? '' : 'background:#f0fdf4;') + ' margin-bottom:0.25rem;">' +
              '<div style="font-weight:' + (n.is_read ? '400' : '600') + '; font-size:0.9rem;">' + n.title + '</div>' +
              '<div style="font-size:0.8rem; color:#666; margin-top:0.25rem;">' + n.message + '</div>' +
              '<div style="font-size:0.7rem; color:#999; margin-top:0.25rem;">' + new Date(n.created_at).toLocaleDateString() + '</div>' +
            '</a>';
          }).join('');
        }
      } catch (e) {}
    }
    loadNotifications();

    // Mark all read
    document.getElementById('notif-mark-all').addEventListener('click', async function(e) {
      e.preventDefault();
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: 'all' })
      });
      badge.style.display = 'none';
      loadNotifications();
    });
  }
})();
</script>
`;

const FOOTER = `
<footer>
  <div class="footer-content">
    <div class="footer-section">
      <h4>About</h4>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/how-it-works">How It Works</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h4>For Practitioners</h4>
      <ul>
        <li><a href="/join">Join Our Network</a></li>
        <li><a href="/healer-dashboard">Dashboard</a></li>
        <li><a href="/resources">Resources</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h4>Legal</h4>
      <ul>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/cookies">Cookie Policy</a></li>
        <li><a href="/compliance">Compliance</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h4>Connect</h4>
      <p>Follow us on social media for wellness tips and updates.</p>
      <div class="social-icons">
        <a href="#" class="social-icon" title="Facebook">f</a>
        <a href="#" class="social-icon" title="Instagram">📷</a>
        <a href="#" class="social-icon" title="Twitter">𝕏</a>
        <a href="#" class="social-icon" title="LinkedIn">in</a>
      </div>
    </div>
  </div>
  <div style="border-top: 1px solid rgba(255,255,255,0.1); padding: 2rem 0; margin: 0 2rem;">
    <div style="max-width: 500px; margin: 0 auto; text-align: center;">
      <h4 style="color: white; margin-bottom: 0.5rem;">Stay Connected to Your Wellness Journey</h4>
      <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 1rem;">Receive healing insights, practitioner spotlights, and exclusive offers.</p>
      <form id="newsletter-form" style="display: flex; gap: 0.5rem; max-width: 420px; margin: 0 auto;">
        <input type="email" id="newsletter-email" placeholder="Your email address" required style="flex: 1; padding: 0.75rem 1rem; border: 1px solid rgba(255,255,255,0.3); border-radius: 0.5rem; background: rgba(255,255,255,0.1); color: white; font-size: 0.95rem;">
        <button type="submit" id="newsletter-btn" style="padding: 0.75rem 1.5rem; background: var(--accent); color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; white-space: nowrap;">Subscribe</button>
      </form>
      <div id="newsletter-msg" style="display:none; margin-top: 0.75rem; font-size: 0.9rem;"></div>
    </div>
  </div>
  <script>
    document.getElementById('newsletter-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      var email = document.getElementById('newsletter-email').value.trim();
      var msg = document.getElementById('newsletter-msg');
      var btn = document.getElementById('newsletter-btn');
      msg.style.display = 'none';
      btn.disabled = true;
      btn.textContent = '...';
      try {
        var res = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        });
        var data = await res.json();
        if (res.ok) {
          msg.style.color = '#86efac';
          msg.textContent = 'Welcome to the AtmaVana community ✨';
          document.getElementById('newsletter-email').value = '';
        } else {
          msg.style.color = '#fca5a5';
          msg.textContent = data.error || 'Something went wrong.';
        }
      } catch (err) {
        msg.style.color = '#fca5a5';
        msg.textContent = 'Network error. Please try again.';
      }
      msg.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Subscribe';
    });
  </script>
  <div class="footer-bottom">
    <p>&copy; 2026 AtmaVana. Your space to heal. All rights reserved.</p>
  </div>
</footer>
`;

/**
 * Landing Page - Main homepage
 */
export function renderLandingPage(healers = []) {
  const defaultHealers = [
    {
      id: 1,
      name: 'Sophia Reeves',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      modality: 'Meditation Practitioner',
      rating: 4.9,
      reviews: 48,
    },
    {
      id: 2,
      name: 'Marcus Chen',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      modality: 'Reiki Practitioner',
      rating: 4.8,
      reviews: 35,
    },
    {
      id: 3,
      name: 'Elena Rossi',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      modality: 'Pranic Healing Practitioner',
      rating: 5.0,
      reviews: 52,
    },
    {
      id: 4,
      name: 'James Morrison',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      modality: 'Wellness Coach',
      rating: 4.7,
      reviews: 42,
    },
  ];

  const displayHealers = healers.length > 0 ? healers : defaultHealers;
  const categories = ['Meditation', 'Reiki', 'Pranic Healing', 'Theta Healing', 'Wellness Coaching', 'Spiritual Coaching', 'Breathwork', 'Holistic Nutrition', 'Crystal Healing'];

  const healerCardsHtml = displayHealers.slice(0, 4).map(healer => `
    <div class="card">
      <img src="${healer.photo}" alt="${healer.name}" class="card-image">
      <div class="card-body">
        <div class="card-title">${healer.name}</div>
        <div class="card-meta">${healer.modality}</div>
        <div class="rating">
          <span class="star">★★★★★</span> ${healer.rating} (${healer.reviews})
        </div>
        <a href="/healer/${healer.id}" class="btn btn-secondary" style="width: 100%; text-align: center;">View Profile</a>
      </div>
    </div>
  `).join('');

  const categoriesHtml = categories.map(cat => `
    <div style="text-align: center; padding: 1.5rem; background: white; border-radius: 0.75rem; border: 1px solid var(--border); cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 4px 12px rgba(26,107,107,0.1)'" onmouseout="this.style.borderColor='var(--border)'; this.style.boxShadow='none'">
      <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">✨</div>
      <div style="font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 600; color: var(--text);">${cat}</div>
    </div>
  `).join('');

  const content = `
    ${NAVIGATION}

    <div class="hero">
      <div class="container" style="width: 100%;">
        <h1>Your Space to Heal</h1>
        <p class="hero-tagline">Connect with trusted practitioners for meditation, energy healing and more.</p>
        <div class="search-bar">
          <input type="text" placeholder="Find a practitioner or modality...">
          <button>Search</button>
        </div>
      </div>
    </div>

    <section class="section" id="how-it-works">
      <div class="container">
        <div class="section-title">
          <h2>How It Works</h2>
          <p class="section-subtitle">Get started in three simple steps</p>
        </div>

        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-title">Browse Practitioners</div>
            <div class="step-desc">Explore our network of trusted healing practitioners from around the world. Filter by modality, language, and rating to find your perfect match.</div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-title">Book a Session</div>
            <div class="step-desc">Choose a time that works for you and book directly. Services are 1-on-1, group, or on-demand video.</div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-title">Begin Your Healing</div>
            <div class="step-desc">Join your session via secure video link. Your private, encrypted space to heal and transform.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>Featured Practitioners</h2>
          <p class="section-subtitle">Discover some of our most-loved practitioners</p>
        </div>

        <div class="grid grid-4">
          ${healerCardsHtml}
        </div>

        <div style="text-align: center; margin-top: 2rem;">
          <a href="/healers" class="btn btn-primary">Explore All Practitioners</a>
        </div>
      </div>
    </section>

    <section class="section" style="background-color: white;">
      <div class="container">
        <div class="section-title">
          <h2>Healing Modalities</h2>
          <p class="section-subtitle">Find the practice that speaks to your soul</p>
        </div>

        <div class="grid grid-3">
          ${categoriesHtml}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-title">
          <h2>Why AtmaVana?</h2>
          <p class="section-subtitle">A sanctuary for your wellness journey — rooted in trust, guided by light</p>
        </div>

        <div class="trust-items">
          <div class="trust-item">
            <div class="trust-icon">🌿</div>
            <h4>Trusted Practitioners</h4>
            <p>Every practitioner on AtmaVana is carefully verified, so you can open your heart to the healing process with confidence and peace of mind.</p>
          </div>
          <div class="trust-item">
            <div class="trust-icon">🕊</div>
            <h4>Sacred & Secure</h4>
            <p>Your transactions are held in a safe space — protected by bank-grade encryption and blockchain-backed stablecoin options.</p>
          </div>
          <div class="trust-item">
            <div class="trust-icon">🔮</div>
            <h4>A Private Space to Heal</h4>
            <p>Your sessions are yours alone. End-to-end encryption keeps every moment of your healing journey completely private.</p>
          </div>
          <div class="trust-item">
            <div class="trust-icon">⭐</div>
            <h4>Guided by Community Wisdom</h4>
            <p>Read authentic reviews from others who have walked the path before you. Let their experiences guide you to the right practitioner.</p>
          </div>
        </div>
      </div>
    </section>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('Home', content);
};

/**
 * Storefront - Individual healer page
 */
export function renderStorefront(healer, services = [], reviews = []) {
  const defaultHealer = {
    id: 1,
    name: 'Sophia Reeves',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop',
    tagline: 'Meditation & Mindfulness Guide',
    modalities: ['Meditation', 'Breathwork', 'Mindfulness'],
    rating: 4.9,
    reviews: 48,
    bio: 'With 12 years of meditation practice and formal training from the Insight Meditation Society, I create personalized meditation experiences for modern seekers. My sessions blend traditional techniques with contemporary wellness science.',
    languages: ['English', 'Arabic', 'Spanish', 'French'],
    certified: true,
    credentials: ['Certified Meditation Teacher', 'RYT-500 Yoga Alliance'],
  };

  const defaultServices = [
    {
      id: 1,
      title: '30-Minute Guided Meditation',
      type: '1-on-1',
      duration: '30 min',
      price: 45,
      description: 'Personalized meditation tailored to your needs',
    },
    {
      id: 2,
      title: '60-Minute Deep Meditation & Coaching',
      type: '1-on-1',
      duration: '60 min',
      price: 85,
      description: 'In-depth session with breathing techniques and spiritual guidance',
    },
    {
      id: 3,
      title: 'Group Meditation Circle',
      type: 'Group',
      duration: '45 min',
      price: 0,
      is_free: true,
      participants: 12,
      description: 'Join our weekly community meditation circle',
    },
    {
      id: 4,
      title: 'Meditation Course (4 weeks)',
      type: 'Group',
      duration: '4 weeks',
      price: 199,
      description: 'Comprehensive introduction to meditation practice',
    },
  ];

  const defaultReviews = [
    {
      author: 'Jessica M.',
      rating: 5,
      date: '2026-03-15',
      text: 'Sophia\'s meditation sessions have completely transformed my daily stress levels. Highly recommend!',
    },
    {
      author: 'David K.',
      rating: 5,
      date: '2026-03-10',
      text: 'Best hour I\'ve invested in myself. Sophia\'s guidance is clear and deeply calming.',
    },
    {
      author: 'Rachel L.',
      rating: 4,
      date: '2026-03-05',
      text: 'Great experience. Sophia is professional and creates a welcoming space for practice.',
    },
  ];

  const h = healer && healer.name ? healer : defaultHealer;
  const svcs = services.length > 0 ? services : defaultServices;
  const revs = reviews.length > 0 ? reviews : defaultReviews;

  const servicesHtml = svcs.map(service => `
    <div class="card">
      <div class="card-body">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <div class="card-title">${service.title}</div>
            <div class="card-meta">${service.duration}</div>
          </div>
          <span class="badge">${service.type}</span>
        </div>
        <p style="margin-bottom: 1rem; color: #666;">${service.description || ''}</p>
        <div style="margin-bottom: 1rem;">
          ${service.is_free ? '<span class="badge badge-free">FREE</span>' : ''}
          ${service.participants ? `<span style="color: #666; font-size: 0.9rem;">${service.participants} participants</span>` : ''}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: var(--primary);">
            ${service.is_free ? 'Free' : '$' + service.price}
          </div>
          <a href="/book/${h.id}/${service.id}" class="btn btn-primary" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">Book</a>
        </div>
      </div>
    </div>
  `).join('');

  const reviewsHtml = revs.map(review => `
    <div style="padding: 1.5rem; background: white; border-radius: 0.75rem; border: 1px solid var(--border); margin-bottom: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
        <div>
          <strong style="font-size: 1rem;">${review.author}</strong>
          <div style="font-size: 0.9rem; color: #999; margin-top: 0.25rem;">${new Date(review.date).toLocaleDateString()}</div>
        </div>
        <div style="color: var(--accent);">★ ${review.rating}.0</div>
      </div>
      <p>${review.text}</p>
    </div>
  `).join('');

  const content = `
    ${NAVIGATION}

    <div style="padding-top: 2rem;">
      <div class="container">
        <div class="profile-header">
          <img src="${h.photo}" alt="${h.name}" class="profile-image">
          <div class="profile-info">
            <h1>${h.name}</h1>
            <p class="profile-tagline">${h.tagline}</p>
            ${h.certified ? '<div class="verified-badge">✓ Verified Practitioner</div>' : ''}
            <div style="margin-top: 1.5rem;">
              <div class="rating" style="font-size: 1.1rem;">
                <span class="star">★★★★★</span> ${h.rating} (${h.reviews} reviews)
              </div>
            </div>
            <div class="profile-meta" style="margin-top: 1.5rem;">
              <div class="profile-meta-item">
                <span style="font-size: 1.2rem;">🗣️</span>
                <span>${h.languages ? h.languages.join(', ') : 'English'}</span>
              </div>
            </div>
            <a href="#services" class="btn btn-primary" style="margin-top: 1.5rem;">View Services</a>
          </div>
        </div>
      </div>
    </div>

    <section class="section" style="background-color: white;">
      <div class="container">
        <h2>About</h2>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 3rem;">
          <div>
            <p style="line-height: 1.8; color: #555;">${h.bio}</p>
          </div>
          <div>
            <h4 style="color: var(--primary); margin-bottom: 1rem;">Credentials</h4>
            <ul style="list-style: none;">
              ${(h.credentials || []).map(cred => `<li style="padding-bottom: 0.75rem;">✓ ${cred}</li>`).join('')}
            </ul>
            <h4 style="color: var(--primary); margin-top: 2rem; margin-bottom: 1rem;">Modalities</h4>
            <div class="healer-modalities">
              ${(h.modalities || []).map(mod => `<span class="badge">${mod}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="services">
      <div class="container">
        <h2>Services</h2>
        <div class="grid grid-3">
          ${servicesHtml}
        </div>
      </div>
    </section>

    <section class="section" style="background-color: white;">
      <div class="container">
        <h2>Client Reviews</h2>
        <div style="margin-top: 2rem;">
          ${revs.length > 0 ? reviewsHtml : '<p style="text-align: center; color: #999;">No reviews yet. Be the first to share your experience!</p>'}
        </div>
      </div>
    </section>

    <div class="sticky-cta">
      <a href="/healers" class="btn btn-primary">← Back to Practitioners</a>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE(`${h.name} - Practitioner`, content);
};

/**
 * Marketplace - Browse all healers
 */
export function renderMarketplace(healers = [], filters = {}) {
  const allHealers = [
    { id: 1, name: 'Sophia Reeves', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', modality: 'Meditation', rating: 4.9, price_range: '$45-$85' },
    { id: 2, name: 'Marcus Chen', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', modality: 'Reiki', rating: 4.8, price_range: '$60-$120' },
    { id: 3, name: 'Elena Rossi', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', modality: 'Pranic Healing', rating: 5.0, price_range: '$50-$100' },
    { id: 4, name: 'James Morrison', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', modality: 'Wellness Coaching', rating: 4.7, price_range: '$75-$150' },
    { id: 5, name: 'Luna Martinez', photo: 'https://images.unsplash.com/photo-1517453682078-3ba5db53ce53?w=400&h=400&fit=crop', modality: 'Theta Healing', rating: 4.6, price_range: '$35-$80' },
    { id: 6, name: 'Dr. Amara Okafor', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', modality: 'Breathwork', rating: 4.9, price_range: '$40-$90' },
  ];

  const displayHealers = healers.length > 0 ? healers : allHealers;

  const healersGrid = displayHealers.map(h => `
    <div class="card">
      <img src="${h.photo}" alt="${h.name}" class="card-image">
      <div class="card-body">
        <div class="card-title">${h.name}</div>
        <div class="card-meta">${h.modality}</div>
        <div class="rating">
          <span class="star">★★★★★</span> ${h.rating}
        </div>
        <div style="color: var(--primary); font-weight: 600; margin-bottom: 1.5rem; font-size: 0.95rem;">${h.price_range}</div>
        <a href="/healer/${h.id}" class="btn btn-secondary" style="width: 100%; text-align: center;">View Profile</a>
      </div>
    </div>
  `).join('');

  const content = `
    ${NAVIGATION}

    <div class="section" style="padding-top: 2rem;">
      <div class="container">
        <h1 style="margin-bottom: 2rem;">Find Your Perfect Practitioner</h1>

        <div style="display: grid; grid-template-columns: 250px 1fr; gap: 3rem;">
          <!-- Filters Sidebar -->
          <div style="background: white; padding: 2rem; border-radius: 0.75rem; border: 1px solid var(--border); height: fit-content;">
            <h4 style="margin-bottom: 1.5rem; color: var(--primary);">Filter By</h4>

            <div class="form-group">
              <label style="font-weight: 600; margin-bottom: 0.75rem; display: block;">Modality</label>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${['Meditation', 'Reiki', 'Pranic Healing', 'Theta Healing', 'Wellness Coaching', 'Spiritual Coaching', 'Breathwork', 'Holistic Nutrition', 'Crystal Healing'].map(mod => `
                  <label class="checkbox-group">
                    <input type="checkbox" value="${mod}"> ${mod}
                  </label>
                `).join('')}
              </div>
            </div>

            <div class="form-group" style="margin-top: 1.5rem;">
              <label style="font-weight: 600; margin-bottom: 0.75rem; display: block;">Price Range</label>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <label class="checkbox-group">
                  <input type="checkbox" value="0-50"> Under $50
                </label>
                <label class="checkbox-group">
                  <input type="checkbox" value="50-100"> $50 - $100
                </label>
                <label class="checkbox-group">
                  <input type="checkbox" value="100-200"> $100 - $200
                </label>
                <label class="checkbox-group">
                  <input type="checkbox" value="200+"> $200+
                </label>
              </div>
            </div>

            <div class="form-group" style="margin-top: 1.5rem;">
              <label style="font-weight: 600; margin-bottom: 0.75rem; display: block;">Language</label>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${['English', 'Arabic', 'Spanish', 'French', 'German', 'Mandarin'].map(lang => `
                  <label class="checkbox-group">
                    <input type="checkbox" value="${lang}"> ${lang}
                  </label>
                `).join('')}
              </div>
            </div>

            <div class="form-group" style="margin-top: 1.5rem;">
              <label style="font-weight: 600; margin-bottom: 0.75rem; display: block;">Rating</label>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <label class="checkbox-group">
                  <input type="checkbox" value="5"> ★★★★★ 5.0
                </label>
                <label class="checkbox-group">
                  <input type="checkbox" value="4"> ★★★★☆ 4.0+
                </label>
                <label class="checkbox-group">
                  <input type="checkbox" value="3"> ★★★☆☆ 3.0+
                </label>
              </div>
            </div>

            <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;">Apply Filters</button>
          </div>

          <!-- Results Grid -->
          <div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
              ${healersGrid}
            </div>

            <!-- Pagination -->
            <div class="pagination">
              <button class="pagination-btn active">1</button>
              <button class="pagination-btn">2</button>
              <button class="pagination-btn">3</button>
              <button class="pagination-btn">4</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('Browse Practitioners', content);
};

/**
 * Booking Page - Book a specific service
 */
export function renderBookingPage(service, healer, availableSlots = []) {
  const defaultService = {
    id: 1,
    title: '60-Minute Deep Meditation & Coaching',
    description: 'In-depth session with personalized guidance',
    duration: '60 min',
    price: 85,
  };

  const defaultHealer = {
    id: 1,
    name: 'Sophia Reeves',
    modality: 'Meditation Practitioner',
  };

  const defaultSlots = [
    { date: '2026-04-05', time: '9:00 AM' },
    { date: '2026-04-05', time: '10:30 AM' },
    { date: '2026-04-05', time: '2:00 PM' },
    { date: '2026-04-06', time: '9:00 AM' },
    { date: '2026-04-06', time: '3:00 PM' },
  ];

  const svc = service || defaultService;
  const hlr = healer || defaultHealer;
  const slots = availableSlots.length > 0 ? availableSlots : defaultSlots;

  const content = `
    ${NAVIGATION}

    <div class="section" style="padding-top: 2rem;">
      <div class="container">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 3rem;">
          <div>
            <h1>Book Your Session</h1>

            <!-- Service Details -->
            <div style="background: white; padding: 2rem; border-radius: 0.75rem; border: 1px solid var(--border); margin-bottom: 2rem;">
              <h3 style="margin-bottom: 1rem;">${svc.title}</h3>
              <p style="color: #666; margin-bottom: 1.5rem;">${svc.description}</p>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">
                <div>
                  <div style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">Duration</div>
                  <div style="font-weight: 600;">${svc.duration}</div>
                </div>
                <div>
                  <div style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">Practitioner</div>
                  <div style="font-weight: 600;">${hlr.name}</div>
                </div>
                <div>
                  <div style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">Price</div>
                  <div style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: var(--primary);">$${svc.price}</div>
                </div>
              </div>
            </div>

            <!-- Date Selection -->
            <div style="background: white; padding: 2rem; border-radius: 0.75rem; border: 1px solid var(--border); margin-bottom: 2rem;">
              <h4 style="margin-bottom: 1.5rem;">Select a Date</h4>
              <input type="date" class="form-group" style="width: 100%; margin-bottom: 0;">
            </div>

            <!-- Time Slots -->
            <div style="background: white; padding: 2rem; border-radius: 0.75rem; border: 1px solid var(--border); margin-bottom: 2rem;">
              <h4 style="margin-bottom: 1.5rem;">Select a Time</h4>
              <div class="time-slots">
                ${slots.map((slot, i) => `
                  <button class="time-slot" onclick="this.classList.add('selected'); document.querySelectorAll('.time-slot').forEach((el, idx) => { if (idx !== ${i}) el.classList.remove('selected'); });">${slot.time}</button>
                `).join('')}
              </div>
            </div>

            <!-- Intake Form (optional) -->
            <div style="background: white; padding: 2rem; border-radius: 0.75rem; border: 1px solid var(--border); margin-bottom: 2rem;">
              <h4 style="margin-bottom: 1.5rem;">About You</h4>
              <div class="form-group">
                <label>What are you hoping to get from this session?</label>
                <textarea placeholder="Tell Sophia what brings you here..."></textarea>
              </div>
              <div class="form-group">
                <label>Any experience with meditation?</label>
                <select>
                  <option>Please select</option>
                  <option>Beginner</option>
                  <option>Some experience</option>
                  <option>Regular practitioner</option>
                  <option>Advanced practitioner</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Sidebar Summary -->
          <div style="background: white; padding: 2rem; border-radius: 0.75rem; border: 1px solid var(--border); height: fit-content; position: sticky; top: 100px;">
            <h4 style="margin-bottom: 1.5rem;">Booking Summary</h4>

            <div style="border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                <span style="color: #666;">Service</span>
                <strong>${svc.title}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                <span style="color: #666;">Practitioner</span>
                <strong>${hlr.name}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #666;">Date & Time</span>
                <strong>TBD</strong>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--border);">
              <strong style="font-size: 1.1rem;">Total</strong>
              <strong style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--primary);">$${svc.price}</strong>
            </div>

            <a href="/checkout" class="btn btn-primary" style="width: 100%; text-align: center;">Continue to Payment</a>
            <a href="/healer/${hlr.id}" style="display: block; text-align: center; margin-top: 1rem; color: #666; font-size: 0.95rem;">Back to Profile</a>
          </div>
        </div>
      </div>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE(`Book ${svc.title}`, content);
};

/**
 * Checkout Page - Payment
 */
export function renderCheckoutPage(booking = {}, healer = {}, service = {}) {
  const defaultBooking = {
    id: 'BK-2026-001',
    date: '2026-04-05',
    time: '10:30 AM',
    amount: 85,
  };

  const defaultHealer = { name: 'Sophia Reeves' };
  const defaultService = { title: '60-Minute Deep Meditation & Coaching' };

  const bk = Object.keys(booking).length > 0 ? booking : defaultBooking;
  const hlr = Object.keys(healer).length > 0 ? healer : defaultHealer;
  const svc = Object.keys(service).length > 0 ? service : defaultService;

  const content = `
    ${NAVIGATION}

    <div class="section" style="padding-top: 2rem;">
      <div class="container">
        <h1 style="margin-bottom: 2rem;">Complete Your Payment</h1>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 3rem;">
          <!-- Payment Form -->
          <div>
            <div style="background: white; padding: 2rem; border-radius: 0.75rem; border: 1px solid var(--border); margin-bottom: 2rem;">
              <div class="tabs">
                <button class="tab-btn active" data-tab="card-tab">Credit/Debit Card</button>
                <button class="tab-btn" data-tab="crypto-tab">Stablecoin (USDC/USDT)</button>
              </div>

              <!-- Card Payment -->
              <div id="card-tab" class="tab-content active">
                <div class="form-group">
                  <label>Name on Card</label>
                  <input type="text" placeholder="John Doe">
                </div>

                <div class="form-group">
                  <label>Card Number</label>
                  <div id="stripe-card-element" style="padding: 0.75rem; border: 1px solid var(--border); border-radius: 0.5rem; background: white; color: var(--text); font-family: 'Inter', sans-serif;">
                    <p style="margin: 0; color: #999; font-size: 0.9rem;">Card number will be processed securely by Stripe</p>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY">
                  </div>
                  <div class="form-group">
                    <label>CVC</label>
                    <input type="text" placeholder="123">
                  </div>
                </div>
              </div>

              <!-- Crypto Payment -->
              <div id="crypto-tab" class="tab-content">
                <div class="form-group">
                  <label>Select Stablecoin</label>
                  <select>
                    <option>USDC</option>
                    <option>USDT</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Select Blockchain</label>
                  <select>
                    <option>Ethereum (ETH)</option>
                    <option>Solana (SOL)</option>
                    <option>Tron (TRX)</option>
                    <option>Polygon (MATIC)</option>
                  </select>
                </div>

                <div style="background: var(--light-gray); padding: 2rem; border-radius: 0.75rem; text-align: center; margin-bottom: 1.5rem;">
                  <p style="color: #999; margin-bottom: 1rem;">Send exactly 85.00 USDC to:</p>
                  <div style="background: white; padding: 1rem; border-radius: 0.5rem; font-family: monospace; word-break: break-all; font-size: 0.85rem; margin-bottom: 1rem;">
                    0x1234567890abcdef1234567890abcdef12345678
                  </div>
                  <div style="text-align: center; padding: 1.5rem; background: white; border-radius: 0.5rem;">
                    📱 QR Code
                  </div>
                </div>
              </div>
            </div>

            <!-- Terms -->
            <div style="background: white; padding: 2rem; border-radius: 0.75rem; border: 1px solid var(--border);">
              <label class="checkbox-group" style="margin-bottom: 0;">
                <input type="checkbox" required>
                <span>I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></span>
              </label>
            </div>
          </div>

          <!-- Order Summary -->
          <div style="background: white; padding: 2rem; border-radius: 0.75rem; border: 1px solid var(--border); height: fit-content; position: sticky; top: 100px;">
            <h4 style="margin-bottom: 1.5rem;">Order Summary</h4>

            <div style="border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <div>
                  <div style="font-weight: 600;">${svc.title}</div>
                  <div style="font-size: 0.9rem; color: #999;">${hlr.name}</div>
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                <span style="color: #666;">Date & Time</span>
                <strong>${bk.date} at ${bk.time}</strong>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span>Subtotal</span>
              <span>$${bk.amount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem;">
              <span>Processing Fee</span>
              <span>$0</span>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--border);">
              <strong style="font-size: 1.1rem;">Total</strong>
              <strong style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; color: var(--primary);">$${bk.amount}</strong>
            </div>

            <button class="btn btn-primary" style="width: 100%;">Complete Payment</button>
            <div style="text-align: center; margin-top: 1rem; color: #999; font-size: 0.9rem;">
              🔒 Secure payment powered by Stripe
            </div>
          </div>
        </div>
      </div>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('Checkout', content);
};

/**
 * Confirmation Page - Post-payment
 */
export function renderConfirmationPage(booking = {}, healer = {}, service = {}) {
  const defaultBooking = {
    id: 'BK-2026-001',
    date: '2026-04-05',
    time: '10:30 AM',
    amount: 85,
    video_room_url: 'https://video.atmavana.net/room/abc123',
  };

  const defaultHealer = { name: 'Sophia Reeves' };
  const defaultService = { title: '60-Minute Deep Meditation & Coaching', duration: '60 min' };

  const bk = Object.keys(booking).length > 0 ? booking : defaultBooking;
  const hlr = Object.keys(healer).length > 0 ? healer : defaultHealer;
  const svc = Object.keys(service).length > 0 ? service : defaultService;

  const content = `
    ${NAVIGATION}

    <div class="section" style="padding: 4rem 2rem; text-align: center;">
      <div class="container" style="max-width: 600px;">
        <div style="background: #e8f5e9; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; font-size: 3rem;">
          ✓
        </div>

        <h1 style="color: #27ae60; margin-bottom: 1rem;">Session Booked!</h1>
        <p style="font-size: 1.2rem; color: #666; margin-bottom: 2rem;">Thank you for booking your healing session. You're one step closer to transformation.</p>

        <div style="background: white; border: 2px solid var(--primary); border-radius: 0.75rem; padding: 2rem; margin-bottom: 2rem; text-align: left;">
          <h3 style="margin-bottom: 1.5rem; text-align: center;">Session Details</h3>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
            <div>
              <div style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">Practitioner</div>
              <div style="font-weight: 600;">${hlr.name}</div>
            </div>
            <div>
              <div style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">Booking ID</div>
              <div style="font-weight: 600; font-family: monospace;">${bk.id}</div>
            </div>
            <div>
              <div style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">Service</div>
              <div style="font-weight: 600;">${svc.title}</div>
            </div>
            <div>
              <div style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">Duration</div>
              <div style="font-weight: 600;">${svc.duration}</div>
            </div>
            <div>
              <div style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">Date</div>
              <div style="font-weight: 600;">${new Date(bk.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div>
              <div style="font-size: 0.9rem; color: #999; margin-bottom: 0.5rem;">Time</div>
              <div style="font-weight: 600;">${bk.time} (Your Timezone)</div>
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong style="font-size: 1.1rem;">Amount Paid</strong>
              <strong style="font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; color: var(--primary);">$${bk.amount}</strong>
            </div>
          </div>
        </div>

        <div style="background: var(--light-gray); padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 2rem; text-align: center;">
          <p style="color: #666; margin-bottom: 1rem;">📅 Add to your calendar</p>
          <a href="/calendar/add/${bk.id}" class="btn btn-secondary">Add to Calendar</a>
        </div>

        ${bk.video_room_url ? `
          <a href="${bk.video_room_url}" class="btn btn-primary" style="width: 100%; text-align: center; font-size: 1.1rem; padding: 1.25rem;">Join Your Session</a>
        ` : ''}

        <div style="margin-top: 2rem;">
          <p style="color: #999; font-size: 0.95rem; margin-bottom: 1rem;">A confirmation email has been sent to your registered email address with all session details and the video room link.</p>
          <a href="/healers" style="color: var(--primary); font-weight: 600;">← Back to Practitioners</a>
        </div>
      </div>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('Booking Confirmed', content);
};

/**
 * Admin Dashboard
 */
export function renderAdminDashboard(stats = {}, healers = [], recentBookings = []) {
  const defaultStats = {
    total_healers: 42,
    active_bookings: 18,
    monthly_revenue: 12450,
    pending_kyc: 3,
  };

  const defaultHealers = [
    { id: 1, name: 'Sophia Reeves', email: 'sophia@atmavana.net', kyc_status: 'Verified', subscription: 'Pro', active: true },
    { id: 2, name: 'Marcus Chen', email: 'marcus@atmavana.net', kyc_status: 'Verified', subscription: 'Pro', active: true },
    { id: 3, name: 'Elena Rossi', email: 'elena@atmavana.net', kyc_status: 'Pending', subscription: 'Basic', active: false },
  ];

  const defaultBookings = [
    { id: 'BK-001', client: 'John Doe', healer: 'Sophia Reeves', service: 'Meditation Session', date: '2026-04-05', status: 'Completed', amount: 85 },
    { id: 'BK-002', client: 'Jane Smith', healer: 'Marcus Chen', service: 'Reiki Session', date: '2026-04-06', status: 'Upcoming', amount: 120 },
    { id: 'BK-003', client: 'Robert Wilson', healer: 'Elena Rossi', service: 'Pranic Healing', date: '2026-04-07', status: 'Upcoming', amount: 95 },
  ];

  const st = Object.keys(stats).length > 0 ? stats : defaultStats;
  const hls = healers.length > 0 ? healers : defaultHealers;
  const bks = recentBookings.length > 0 ? recentBookings : defaultBookings;

  const content = `
    ${NAVIGATION}

    <div class="section" style="padding-top: 2rem;">
      <div class="container">
        <h1 style="margin-bottom: 2rem;">Admin Dashboard</h1>

        <!-- Stats Cards -->
        <div class="grid grid-4" style="margin-bottom: 3rem;">
          <div class="stat-card">
            <div class="stat-number">${st.total_healers}</div>
            <div class="stat-label">Total Practitioners</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${st.active_bookings}</div>
            <div class="stat-label">Active Bookings</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">$${st.monthly_revenue}</div>
            <div class="stat-label">Revenue (This Month)</div>
          </div>
          <div class="stat-card" style="background: #fff3cd; border-color: #ffc107;">
            <div class="stat-number" style="color: #ff9800;">${st.pending_kyc}</div>
            <div class="stat-label">Pending KYC</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div style="background: white; border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem; margin-bottom: 3rem;">
          <h3 style="margin-bottom: 1.5rem;">Quick Actions</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            <button class="btn btn-primary">Invite Practitioner</button>
            <button class="btn btn-secondary">View Payouts</button>
            <button class="btn btn-secondary">Review KYC Applications</button>
            <button class="btn btn-secondary">View Reports</button>
          </div>
        </div>

        <!-- Practitioners Table -->
        <div style="background: white; border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem; margin-bottom: 3rem;">
          <h3 style="margin-bottom: 1.5rem;">Practitioners</h3>
          <div style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>KYC Status</th>
                  <th>Subscription</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${hls.map(h => `
                  <tr>
                    <td><strong>${h.name}</strong></td>
                    <td>${h.email}</td>
                    <td>
                      <span class="badge ${h.kyc_status === 'Verified' ? 'badge-free' : 'badge-accent'}">${h.kyc_status}</span>
                    </td>
                    <td>${h.subscription}</td>
                    <td>
                      <input type="checkbox" ${h.active ? 'checked' : ''} style="cursor: pointer;">
                    </td>
                    <td>
                      <a href="#" style="font-size: 0.9rem; color: var(--primary);">Edit</a> |
                      <a href="#" style="font-size: 0.9rem; color: #e74c3c;">Deactivate</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Bookings -->
        <div style="background: white; border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem;">
          <h3 style="margin-bottom: 1.5rem;">Recent Bookings</h3>
          <div style="overflow-x: auto;">
            <table>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Client</th>
                  <th>Practitioner</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${bks.map(b => `
                  <tr>
                    <td><strong style="font-family: monospace;">${b.id}</strong></td>
                    <td>${b.client}</td>
                    <td>${b.healer}</td>
                    <td>${b.service}</td>
                    <td>${new Date(b.date).toLocaleDateString()}</td>
                    <td>
                      <span class="badge ${b.status === 'Completed' ? 'badge-free' : ''}">${b.status}</span>
                    </td>
                    <td><strong>$${b.amount}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('Admin Dashboard', content);
};

/**
 * Healer Dashboard
 */
export function renderHealerDashboard(healer = {}, bookings = [], stats = {}) {
  const defaultHealer = {
    name: 'Sophia Reeves',
    modality: 'Meditation Practitioner',
  };

  const defaultBookings = [
    { id: 'BK-001', client: 'John Doe', service: 'Meditation Session', date: '2026-04-05 10:00 AM', status: 'Upcoming' },
    { id: 'BK-002', client: 'Jane Smith', service: 'Meditation Session', date: '2026-04-06 2:00 PM', status: 'Upcoming' },
  ];

  const defaultStats = {
    upcoming_sessions: 8,
    monthly_revenue: 3420,
    total_clients: 45,
    average_rating: 4.9,
  };

  const hlr = Object.keys(healer).length > 0 ? healer : defaultHealer;
  const bks = bookings.length > 0 ? bookings : defaultBookings;
  const st = Object.keys(stats).length > 0 ? stats : defaultStats;

  const content = `
    ${NAVIGATION}

    <div class="section" style="padding-top: 2rem;">
      <div class="container">
        <div style="margin-bottom: 2rem;">
          <h1>Welcome back, ${hlr.name}! 👋</h1>
          <p style="font-size: 1.1rem; color: #666; margin-top: 0.5rem;">${hlr.modality}</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-4" style="margin-bottom: 3rem;">
          <div class="stat-card">
            <div class="stat-number">${st.upcoming_sessions}</div>
            <div class="stat-label">Upcoming Sessions</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">$${st.monthly_revenue}</div>
            <div class="stat-label">This Month's Revenue</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${st.total_clients}</div>
            <div class="stat-label">Total Clients</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">⭐ ${st.average_rating}</div>
            <div class="stat-label">Average Rating</div>
          </div>
        </div>

        <!-- Quick Links -->
        <div style="background: white; border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem; margin-bottom: 3rem;">
          <h3 style="margin-bottom: 1.5rem;">Quick Links</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <a href="/healer/profile" class="btn btn-secondary">Edit Profile</a>
            <a href="/healer/services" class="btn btn-secondary">Manage Services</a>
            <a href="/healer/payouts" class="btn btn-secondary">View Payouts</a>
            <a href="/healer/domain" class="btn btn-secondary">Domain Settings</a>
          </div>
        </div>

        <!-- Upcoming Bookings -->
        <div style="background: white; border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem;">
          <h3 style="margin-bottom: 1.5rem;">Upcoming Bookings</h3>
          ${bks.length > 0 ? `
            <div style="overflow-x: auto;">
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${bks.map(b => `
                    <tr>
                      <td><strong>${b.client}</strong></td>
                      <td>${b.service}</td>
                      <td>${b.date}</td>
                      <td><span class="badge">${b.status}</span></td>
                      <td>
                        <a href="#" style="font-size: 0.9rem; color: var(--primary);">Join</a> |
                        <a href="#" style="font-size: 0.9rem; color: #666;">Details</a>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : '<p style="text-align: center; color: #999;">No upcoming bookings</p>'}
        </div>
      </div>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('Healer Dashboard', content);
};

/**
 * Login Page
 */
export function renderLoginPage(type = 'client') {
  const titles = {
    client: 'Sign In to Your Healing Journey',
    healer: 'Practitioner Login',
    admin: 'Admin Login',
  };

  const content = `
    ${NAVIGATION}

    <div class="section" style="padding-top: 4rem;">
      <div class="container" style="max-width: 450px;">
        <h1 style="text-align: center; margin-bottom: 0.5rem;">${titles[type] || titles.client}</h1>
        <p style="text-align: center; color: #666; margin-bottom: 3rem;">${type === 'client' ? 'Welcome back. Sign in to continue your healing journey.' : type === 'healer' ? 'Access your practitioner dashboard and manage your sessions.' : 'Admin access only'}</p>

        <div style="background: white; border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem; margin-bottom: 2rem;">
          <div id="login-error" style="display:none; background:#fef2f2; border:1px solid #fca5a5; color:#991b1b; padding:1rem; border-radius:0.5rem; margin-bottom:1.5rem;"></div>
          <form id="loginForm" data-login-type="${type || 'client'}">
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="loginEmail" placeholder="you@example.com" required>
            </div>

            <div class="form-group">
              <label>Password</label>
              <input type="password" id="loginPassword" placeholder="••••••••" required>
            </div>

            <div class="checkbox-group" style="margin-bottom: 2rem;">
              <input type="checkbox" id="remember">
              <label for="remember" style="margin: 0;">Remember me</label>
            </div>

            <button type="submit" id="loginSubmitBtn" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem; padding: 1rem;">Sign In</button>

            <div style="text-align: center;">
              <a href="/forgot-password" style="font-size: 0.95rem;">Forgot your password?</a>
            </div>
          </form>
        </div>

        <script>
          document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const errBox = document.getElementById('login-error');
            const btn = document.getElementById('loginSubmitBtn');
            errBox.style.display = 'none';

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const loginType = this.getAttribute('data-login-type');

            const endpoint = loginType === 'admin' ? '/api/admin/login' : '/api/auth/login';

            btn.disabled = true;
            btn.textContent = 'Signing in...';

            try {
              const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
              });
              const data = await res.json();
              if (!res.ok) {
                errBox.textContent = data.error || 'Invalid credentials. Please try again.';
                errBox.style.display = 'block';
                btn.disabled = false;
                btn.textContent = 'Sign In';
                return;
              }
              localStorage.setItem('atmavana_token', data.token);
              if (loginType === 'admin') {
                window.location.href = '/admin';
              } else if (loginType === 'healer') {
                localStorage.setItem('atmavana_healer_id', data.healerId || '');
                window.location.href = '/dashboard';
              } else {
                localStorage.setItem('atmavana_client_id', data.clientId || '');
                localStorage.setItem('atmavana_name', data.name || '');
                window.location.href = '/account';
              }
            } catch (err) {
              errBox.textContent = 'Network error. Please check your connection and try again.';
              errBox.style.display = 'block';
              btn.disabled = false;
              btn.textContent = 'Sign In';
            }
          });
        </script>

        <div style="text-align: center;">
          ${type === 'client' ? `
            <p style="margin-bottom: 1rem;">Don't have an account? <a href="/register" style="font-weight: 600;">Sign up</a></p>
          ` : `
            <p style="margin-bottom: 1rem;"><a href="/login/client" style="font-weight: 600;">Client login</a> | <a href="/login/admin" style="font-weight: 600;">Admin login</a></p>
          `}
        </div>
      </div>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('Login', content);
};

/**
 * Register Page
 */
export function renderRegisterPage() {
  const content = `
    ${NAVIGATION}

    <div class="section" style="padding-top: 4rem;">
      <div class="container" style="max-width: 550px;">
        <h1 style="text-align: center; margin-bottom: 0.5rem;">Begin Your Healing Journey</h1>
        <p style="text-align: center; color: #666; margin-bottom: 3rem;">Create an account to book sessions with our trusted practitioners</p>

        <div style="background: white; border: 1px solid var(--border); border-radius: 0.75rem; padding: 2rem;">
          <div id="register-error" style="display:none; background:#fef2f2; border:1px solid #fca5a5; color:#991b1b; padding:1rem; border-radius:0.5rem; margin-bottom:1.5rem;"></div>
          <div id="register-success" style="display:none; background:#f0fdf4; border:1px solid #86efac; color:#166534; padding:1rem; border-radius:0.5rem; margin-bottom:1.5rem;"></div>
          <form id="registerForm">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" id="regFirstName" placeholder="John" required>
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" id="regLastName" placeholder="Doe" required>
              </div>
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="regEmail" placeholder="you@example.com" required>
            </div>

            <div class="form-group">
              <label>Password</label>
              <input type="password" id="regPassword" placeholder="At least 8 characters" required minlength="8">
            </div>

            <div class="form-group">
              <label>Confirm Password</label>
              <input type="password" id="regConfirmPassword" placeholder="••••••••" required>
            </div>

            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" id="regPhone" placeholder="+1 (555) 000-0000">
            </div>

            <div class="form-group">
              <label>How did you hear about us?</label>
              <select id="regReferral">
                <option>Please select</option>
                <option>Search Engine</option>
                <option>Social Media</option>
                <option>Friend Referral</option>
                <option>Other</option>
              </select>
            </div>

            <div class="checkbox-group" style="margin-bottom: 2rem;">
              <input type="checkbox" id="terms" required>
              <label for="terms" style="margin: 0;">I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></label>
            </div>

            <button type="submit" id="regSubmitBtn" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem; padding: 1rem;">Create Account</button>

            <div style="text-align: center;">
              <p>Already have an account? <a href="/login" style="font-weight: 600;">Sign in</a></p>
            </div>
          </form>
        </div>

        <script>
          document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const errBox = document.getElementById('register-error');
            const successBox = document.getElementById('register-success');
            const btn = document.getElementById('regSubmitBtn');
            errBox.style.display = 'none';
            successBox.style.display = 'none';

            const firstName = document.getElementById('regFirstName').value.trim();
            const lastName = document.getElementById('regLastName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;

            if (password !== confirmPassword) {
              errBox.textContent = 'Passwords do not match.';
              errBox.style.display = 'block';
              return;
            }
            if (password.length < 8) {
              errBox.textContent = 'Password must be at least 8 characters.';
              errBox.style.display = 'block';
              return;
            }

            btn.disabled = true;
            btn.textContent = 'Creating Account...';

            try {
              const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: firstName + ' ' + lastName,
                  email: email,
                  password: password,
                  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                })
              });
              const data = await res.json();
              if (!res.ok) {
                errBox.textContent = data.error || 'Registration failed. Please try again.';
                errBox.style.display = 'block';
                btn.disabled = false;
                btn.textContent = 'Create Account';
                return;
              }
              // Store token and redirect
              localStorage.setItem('atmavana_token', data.token);
              localStorage.setItem('atmavana_client_id', data.clientId);
              localStorage.setItem('atmavana_name', data.name || firstName);
              successBox.textContent = 'Account created! Redirecting...';
              successBox.style.display = 'block';
              setTimeout(function() { window.location.href = '/account'; }, 1500);
            } catch (err) {
              errBox.textContent = 'Network error. Please check your connection and try again.';
              errBox.style.display = 'block';
              btn.disabled = false;
              btn.textContent = 'Create Account';
            }
          });
        </script>
      </div>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('Register', content);
};

/**
 * Client Account Page
 */
export function renderClientAccount(client = {}, upcomingBookings = [], pastBookings = [], reviews = []) {
  const defaultClient = { name: 'Guest', email: '', credit_balance_usd: 0 };
  const cl = Object.keys(client).length > 0 ? client : defaultClient;

  const upcomingHtml = upcomingBookings.length > 0 ? upcomingBookings.map(b => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 0.75rem; background: white;">
      <div>
        <div style="font-weight: 600; margin-bottom: 0.25rem;">${b.service_title || 'Session'}</div>
        <div style="font-size: 0.9rem; color: #666;">with ${b.healer_name || 'Practitioner'}</div>
        <div style="font-size: 0.85rem; color: #999; margin-top: 0.25rem;">${new Date(b.scheduled_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date(b.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem; font-weight: 600; background: #e0f2fe; color: #0369a1;">${b.status || 'Confirmed'}</span>
        <div style="font-weight: 600; margin-top: 0.5rem; color: var(--primary);">${b.total_amount_usd ? '$' + b.total_amount_usd : 'Free'}</div>
      </div>
    </div>
  `).join('') : '<p style="color: #999; text-align: center; padding: 2rem 0;">No upcoming sessions. <a href="/marketplace" style="color: var(--primary); font-weight: 600;">Browse practitioners</a> to book your next session.</p>';

  const pastHtml = pastBookings.length > 0 ? pastBookings.map(b => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 0.75rem; background: white;">
      <div>
        <div style="font-weight: 600; margin-bottom: 0.25rem;">${b.service_title || 'Session'}</div>
        <div style="font-size: 0.9rem; color: #666;">with ${b.healer_name || 'Practitioner'}</div>
        <div style="font-size: 0.85rem; color: #999; margin-top: 0.25rem;">${new Date(b.scheduled_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.8rem; font-weight: 600; background: #f0fdf4; color: #166534;">Completed</span>
        ${!b.has_review ? '<div style="margin-top: 0.5rem;"><a href="#" class="leave-review-btn" data-booking-id="' + b.id + '" style="font-size: 0.85rem; color: var(--accent); font-weight: 600;">Leave a Review ★</a></div>' : '<div style="margin-top: 0.5rem; font-size: 0.85rem; color: #999;">Reviewed ✓</div>'}
      </div>
    </div>
  `).join('') : '<p style="color: #999; text-align: center; padding: 2rem 0;">No past sessions yet. Your completed sessions will appear here.</p>';

  const reviewsHtml = reviews.length > 0 ? reviews.map(r => `
    <div style="padding: 1.25rem; border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 0.75rem; background: white;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <div style="font-weight: 600;">${r.healer_name || 'Practitioner'}</div>
        <div style="color: var(--accent);">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
      </div>
      <p style="font-size: 0.95rem; color: #444; margin: 0;">${r.comment || ''}</p>
      <div style="font-size: 0.8rem; color: #999; margin-top: 0.5rem;">${new Date(r.created_at).toLocaleDateString()}</div>
    </div>
  `).join('') : '<p style="color: #999; text-align: center; padding: 2rem 0;">Your reviews will appear here after you review a session.</p>';

  const content = `
    ${NAVIGATION}

    <div class="section" style="padding-top: 2rem;">
      <div class="container" style="max-width: 800px;">

        <!-- Profile Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border);">
          <div>
            <h1 style="margin-bottom: 0.25rem;">Welcome back, ${cl.name.split(' ')[0]} 🙏</h1>
            <p style="color: #666; font-size: 1rem; margin: 0;">${cl.email}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.85rem; color: #999;">Account Balance</div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">$${(cl.credit_balance_usd || 0).toFixed(2)}</div>
          </div>
        </div>

        <!-- Upcoming Sessions -->
        <div style="margin-bottom: 3rem;">
          <h2 style="margin-bottom: 1.25rem; font-size: 1.3rem;">🗓 Upcoming Sessions</h2>
          ${upcomingHtml}
        </div>

        <!-- Past Sessions -->
        <div style="margin-bottom: 3rem;">
          <h2 style="margin-bottom: 1.25rem; font-size: 1.3rem;">✨ Past Sessions</h2>
          ${pastHtml}
        </div>

        <!-- My Reviews -->
        <div style="margin-bottom: 3rem;">
          <h2 style="margin-bottom: 1.25rem; font-size: 1.3rem;">⭐ My Reviews</h2>
          ${reviewsHtml}
        </div>

        <!-- Saved Practitioners -->
        <div style="margin-bottom: 3rem;">
          <h2 style="margin-bottom: 1.25rem; font-size: 1.3rem;">💚 Saved Practitioners</h2>
          <p style="color: #999; text-align: center; padding: 2rem 0;">Save your favourite practitioners to quickly rebook them. Coming soon.</p>
        </div>

        <!-- Account Settings -->
        <div style="margin-bottom: 3rem; padding: 1.5rem; background: white; border: 1px solid var(--border); border-radius: 0.75rem;">
          <h3 style="margin-bottom: 1rem;">Account Settings</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <a href="#" style="display: block; padding: 1rem; border: 1px solid var(--border); border-radius: 0.5rem; text-decoration: none; color: var(--text); font-weight: 500;">Edit Profile</a>
            <a href="#" style="display: block; padding: 1rem; border: 1px solid var(--border); border-radius: 0.5rem; text-decoration: none; color: var(--text); font-weight: 500;">Payment Methods</a>
            <a href="#" style="display: block; padding: 1rem; border: 1px solid var(--border); border-radius: 0.5rem; text-decoration: none; color: var(--text); font-weight: 500;">Notification Preferences</a>
            <a href="#" id="account-logout" style="display: block; padding: 1rem; border: 1px solid #fca5a5; border-radius: 0.5rem; text-decoration: none; color: #991b1b; font-weight: 500; cursor: pointer;">Log Out</a>
          </div>
        </div>

      </div>
    </div>

    <script>
      document.getElementById('account-logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('atmavana_token');
        localStorage.removeItem('atmavana_client_id');
        window.location.href = '/';
      });
    </script>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('My Account', content);
};

/**
 * 404 Error Page
 */
export function render404Page() {
  const content = `
    ${NAVIGATION}

    <div class="section" style="padding: 6rem 2rem; text-align: center;">
      <div class="container" style="max-width: 600px;">
        <h1 style="font-size: 5rem; margin-bottom: 1rem; color: var(--primary);">404</h1>
        <h2 style="margin-bottom: 1rem;">Page Not Found</h2>
        <p style="font-size: 1.1rem; color: #666; margin-bottom: 2rem;">The healing space you're looking for doesn't exist. Let's get you back on track.</p>

        <a href="/" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">Return to Home</a>
      </div>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('Page Not Found', content);
};

/**
 * Error Page - Generic error with message
 */
export function renderErrorPage(message = 'An error occurred') {
  const content = `
    ${NAVIGATION}

    <div class="section" style="padding: 4rem 2rem;">
      <div class="container" style="max-width: 600px;">
        <div class="alert alert-error">
          <h2 style="margin-top: 0;">Something went wrong</h2>
          <p>${message}</p>
        </div>

        <a href="/" class="btn btn-primary" style="margin-top: 1.5rem;">Return to Home</a>
      </div>
    </div>

    ${FOOTER}
  `;

  return BASE_HTML_TEMPLATE('Error', content);
};
