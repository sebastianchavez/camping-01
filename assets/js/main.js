/* ===========================================================
   main.js
   Layout inyectado (navbar + footer), helpers globales,
   validaciones, toasts y modales.
   Depende de: data.js
   =========================================================== */

/* ---------- Detección de página actual ---------- */
const CURRENT_PATH = window.location.pathname;
const IS_IN_PAGES = /\/pages\//.test(CURRENT_PATH);
const BASE = IS_IN_PAGES ? '../' : './';

/* ---------- Helpers de formato ---------- */
function formatPEN(n) {
  return 'CLP$ ' + Number(n || 0).toLocaleString('es-CL', { maximumFractionDigits: 0 });
}

function formatDate(d, withTime = false) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';
  const opts = withTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('es-CL', opts);
}

function formatDateShort(d) {
  const date = new Date(d);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function diffDays(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const ms = b - a;
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return 'CAMP-' + s;
}

function generateId(prefix = 'usr') {
  return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/* ---------- Toasts ---------- */
function ensureToastContainer() {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(c);
  }
  return c;
}

function toast(message, type = 'success') {
  const c = ensureToastContainer();
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warn: 'bg-yellow-600'
  };
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warn: '⚠'
  };
  const el = document.createElement('div');
  el.className = `pointer-events-auto text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 toast-in ${colors[type] || colors.success}`;
  el.innerHTML = `<span class="text-xl leading-none">${icons[type] || icons.success}</span><span class="text-sm font-medium">${message}</span>`;
  c.appendChild(el);
  setTimeout(() => {
    el.classList.add('toast-out');
    setTimeout(() => el.remove(), 350);
  }, 3200);
}

/* ---------- Modal genérico ---------- */
function modal({ title = '', body = '', confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm = null, onCancel = null, danger = false }) {
  const wrap = document.createElement('div');
  wrap.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 modal-in';
  wrap.innerHTML = `
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" data-close></div>
    <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 modal-content-in">
      <h3 class="text-xl font-bold text-forest mb-3">${title}</h3>
      <div class="text-gray-700 mb-6">${body}</div>
      <div class="flex justify-end gap-3">
        <button class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition" data-cancel>${cancelText}</button>
        <button class="px-4 py-2 rounded-lg text-white transition ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-orange hover:bg-orange-600'}" data-confirm>${confirmText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  const close = () => wrap.remove();
  wrap.querySelector('[data-close]').addEventListener('click', () => { close(); onCancel && onCancel(); });
  wrap.querySelector('[data-cancel]').addEventListener('click', () => { close(); onCancel && onCancel(); });
  wrap.querySelector('[data-confirm]').addEventListener('click', () => { close(); onConfirm && onConfirm(); });
  return close;
}

/* ---------- Validaciones ---------- */
function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
}

function isPhone(v) {
  return /^[+0-9\s()-]{6,20}$/.test(String(v || '').trim());
}

function isStrongPassword(v) {
  return typeof v === 'string' && v.length >= 6;
}

function setFieldError(inputEl, msg) {
  const parent = inputEl.closest('div') || inputEl.parentElement;
  const existing = parent.querySelector('.field-error');
  if (existing) existing.remove();
  if (msg) {
    inputEl.classList.add('border-red-500');
    const e = document.createElement('p');
    e.className = 'field-error text-red-500 text-xs mt-1';
    e.textContent = msg;
    parent.appendChild(e);
  } else {
    inputEl.classList.remove('border-red-500');
  }
}

/* ---------- Navbar ---------- */
function renderNavbar() {
  const session = getSession();
  const user = session ? findUserById(session.userId) : null;

  const authBlock = user
    ? `
      <div class="hidden md:flex items-center gap-3">
        <a href="${BASE}pages/perfil.html" class="flex items-center gap-2 text-forest hover:text-orange transition font-medium">
          <span class="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center font-bold">
            ${user.nombre.charAt(0).toUpperCase()}
          </span>
          <span>${user.nombre}</span>
        </a>
        <button id="btn-logout" class="text-sm text-gray-600 hover:text-red-600 transition">Salir</button>
      </div>`
    : `
      <div class="hidden md:flex items-center gap-2">
        <a href="${BASE}pages/login.html" class="px-4 py-2 text-forest hover:text-orange transition font-medium">Ingresar</a>
        <a href="${BASE}pages/registro.html" class="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-600 transition font-medium">Registrarse</a>
      </div>`;

  const mobileAuthBlock = user
    ? `
      <a href="${BASE}pages/perfil.html" class="block px-3 py-2 rounded-lg hover:bg-cream text-forest font-medium">Mi perfil</a>
      <button id="btn-logout-mobile" class="block w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium">Cerrar sesión</button>`
    : `
      <a href="${BASE}pages/login.html" class="block px-3 py-2 rounded-lg hover:bg-cream text-forest font-medium">Ingresar</a>
      <a href="${BASE}pages/registro.html" class="block px-3 py-2 rounded-lg bg-orange text-white text-center font-medium">Registrarse</a>`;

  return `
    <nav class="bg-white shadow-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a href="${BASE}index.html" class="flex items-center gap-2">
            <span class="text-2xl">🏕️</span>
            <span class="font-bold text-xl text-forest">Camping <span class="text-orange">Pinar</span></span>
          </a>

          <div class="hidden md:flex items-center gap-8">
            <a href="${BASE}index.html" class="text-gray-700 hover:text-forest transition font-medium">Inicio</a>
            <a href="${BASE}pages/servicios.html" class="text-gray-700 hover:text-forest transition font-medium">Servicios</a>
            <a href="${BASE}pages/reserva.html" class="text-gray-700 hover:text-forest transition font-medium">Reservar</a>
            <a href="${BASE}pages/contacto.html" class="text-gray-700 hover:text-forest transition font-medium">Contacto</a>
          </div>

          ${authBlock}

          <button id="btn-mobile" class="md:hidden p-2 rounded-lg hover:bg-cream">
            <svg class="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <div id="mobile-menu" class="hidden md:hidden pb-4 space-y-1 border-t border-gray-100 pt-3">
          <a href="${BASE}index.html" class="block px-3 py-2 rounded-lg hover:bg-cream text-gray-700">Inicio</a>
          <a href="${BASE}pages/servicios.html" class="block px-3 py-2 rounded-lg hover:bg-cream text-gray-700">Servicios</a>
          <a href="${BASE}pages/reserva.html" class="block px-3 py-2 rounded-lg hover:bg-cream text-gray-700">Reservar</a>
          <a href="${BASE}pages/contacto.html" class="block px-3 py-2 rounded-lg hover:bg-cream text-gray-700">Contacto</a>
          <div class="border-t border-gray-100 pt-2 mt-2 space-y-1">
            ${mobileAuthBlock}
          </div>
        </div>
      </div>
    </nav>
  `;
}

/* ---------- Footer ---------- */
function renderFooter() {
  return `
    <footer class="bg-forest text-cream mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl">🏕️</span>
            <span class="font-bold text-xl">Camping Pinar</span>
          </div>
          <p class="text-sm text-cream/80">Conectando con la naturaleza desde 2010. Tu escape perfecto entre montañas y bosques.</p>
        </div>
        <div>
          <h4 class="font-bold mb-4 text-orange">Servicios</h4>
          <ul class="space-y-2 text-sm text-cream/80">
            <li><a href="${BASE}pages/servicios.html" class="hover:text-white transition">Alojamiento</a></li>
            <li><a href="${BASE}pages/servicios.html" class="hover:text-white transition">Actividades</a></li>
            <li><a href="${BASE}pages/servicios.html" class="hover:text-white transition">Restaurante</a></li>
            <li><a href="${BASE}pages/reserva.html" class="hover:text-white transition">Reservar</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4 text-orange">Empresa</h4>
          <ul class="space-y-2 text-sm text-cream/80">
            <li><a href="${BASE}pages/contacto.html" class="hover:text-white transition">Contacto</a></li>
            <li><a href="${BASE}pages/terminos.html" class="hover:text-white transition">Términos</a></li>
            <li><a href="${BASE}pages/privacidad.html" class="hover:text-white transition">Privacidad</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-4 text-orange">Contacto</h4>
          <ul class="space-y-2 text-sm text-cream/80">
            <li>📍 Camino al Volcán Km 8, Cajón del Maipo</li>
            <li>📞 +56 9 8765 4321</li>
            <li>✉️ info@campingpinar.cl</li>
            <li>🕐 Lun-Dom: 8:00 a 20:00</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-cream/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-cream/70">
          © 2026 Camping Pinar. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  `;
}

/* ---------- Layout inyectable principal ---------- */
function injectLayout() {
  const navbarSlot = document.getElementById('app-navbar');
  const footerSlot = document.getElementById('app-footer');
  if (navbarSlot) navbarSlot.innerHTML = renderNavbar();
  if (footerSlot) footerSlot.innerHTML = renderFooter();

  const btnMobile = document.getElementById('btn-mobile');
  const mobileMenu = document.getElementById('mobile-menu');
  if (btnMobile && mobileMenu) {
    btnMobile.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  }

  const btnLogout = document.getElementById('btn-logout');
  const btnLogoutMobile = document.getElementById('btn-logout-mobile');
  const handler = () => logout();
  if (btnLogout) btnLogout.addEventListener('click', handler);
  if (btnLogoutMobile) btnLogoutMobile.addEventListener('click', handler);
}

/* ---------- Guard de rutas protegidas ---------- */
function requireAuth(redirectTo = null) {
  const session = getSession();
  if (!session) {
    const target = redirectTo || (BASE + 'pages/login.html');
    window.location.href = target;
    return false;
  }
  return true;
}

/* ---------- Logo del usuario (para perfil) ---------- */
function userInitials(name = '') {
  return name.trim().charAt(0).toUpperCase() || '?';
}

/* ---------- Init global ---------- */
document.addEventListener('DOMContentLoaded', () => {
  injectLayout();
});