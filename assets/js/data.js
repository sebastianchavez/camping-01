/* ===========================================================
   data.js
   Datos seed del sistema: servicios, usuarios demo, reservas demo.
   Persistencia en localStorage con helpers centralizados.
   =========================================================== */

const STORAGE_KEYS = {
  USERS: 'camping_users',
  SESSION: 'camping_session',
  RESERVATIONS: 'camping_reservations',
  PAYMENTS: 'camping_payments',
  SEED_DONE: 'camping_seed_done'
};

/* ---------- Catálogo de servicios ---------- */
const SERVICES_CATALOG = [
  {
    id: 'parcela-tienda',
    name: 'Parcela para tienda',
    description: 'Amplia parcela con sombra natural para instalar tu tienda de campaña.',
    price: 35,
    icon: 'tent',
    category: 'alojamiento',
    type: 'base'
  },
  {
    id: 'parcela-caravana',
    name: 'Parcela para caravana',
    description: 'Parcela con toma eléctrica, agua y desagüe para tu caravana o RV.',
    price: 60,
    icon: 'caravan',
    category: 'alojamiento',
    type: 'base'
  },
  {
    id: 'cabana',
    name: 'Cabaña rústica',
    description: 'Cabaña de madera equipada con literas, mesa y calefacción.',
    price: 120,
    icon: 'cabin',
    category: 'alojamiento',
    type: 'base'
  },
  {
    id: 'electricidad',
    name: 'Electricidad',
    description: 'Toma de corriente 220V en tu parcela.',
    price: 10,
    icon: 'bolt',
    category: 'extra',
    type: 'extra'
  },
  {
    id: 'wifi',
    name: 'Wifi',
    description: 'Acceso a internet de alta velocidad durante toda tu estancia.',
    price: 8,
    icon: 'wifi',
    category: 'extra',
    type: 'extra'
  },
  {
    id: 'parrilla',
    name: 'Parrilla',
    description: 'Parrilla individual con carbón y utensilios.',
    price: 15,
    icon: 'grill',
    category: 'extra',
    type: 'extra'
  },
  {
    id: 'actividades',
    name: 'Actividades guiadas',
    description: 'Senderismo, rapel y orientación nocturna con guías certificados.',
    price: 45,
    icon: 'compass',
    category: 'extra',
    type: 'extra'
  },
  {
    id: 'restaurante',
    name: 'Restaurante',
    description: 'Desayuno, almuerzo y cena con comida típica de la región.',
    price: 30,
    icon: 'restaurant',
    category: 'extra',
    type: 'extra'
  },
  {
    id: 'kayak',
    name: 'Kayak y pesca',
    description: 'Alquiler de kayak y equipo de pesca para el lago.',
    price: 25,
    icon: 'kayak',
    category: 'extra',
    type: 'extra'
  }
];

/* ---------- Estado de reservas ---------- */
const RESERVATION_STATUS = {
  PENDIENTE:  { code: 'pendiente',  label: 'Pendiente',  color: 'yellow' },
  CONFIRMADA: { code: 'confirmada', label: 'Confirmada', color: 'blue'   },
  PAGADA:     { code: 'pagada',     label: 'Pagada',     color: 'green'  },
  ANULADA:    { code: 'anulada',    label: 'Anulada',    color: 'red'    },
  COMPLETADA: { code: 'completada', label: 'Completada', color: 'gray'   }
};

const PAYMENT_METHODS = {
  TARJETA:    { code: 'tarjeta',    label: 'Tarjeta de crédito/débito' },
  YAPE:       { code: 'yape',       label: 'Yape' },
  PLIN:       { code: 'plin',       label: 'Plin' },
  TRANSFERENCIA: { code: 'transferencia', label: 'Transferencia bancaria' }
};

/* ---------- Datos seed ---------- */
const SEED_USERS = [
  {
    id: 'usr-001',
    nombre: 'Sebastián',
    apellidos: 'Castillo',
    dni: '45678901',
    email: 'demo@camping.com',
    password: '123456',
    telefono: '+51 987 654 321',
    createdAt: '2026-08-15T10:00:00.000Z'
  }
];

const SEED_RESERVATIONS = [
  {
    id: 'CAMP-A1B2C3',
    userId: 'usr-001',
    alojamientoId: 'cabana',
    extrasIds: ['electricidad', 'restaurante', 'actividades'],
    checkIn: '2026-09-12',
    checkOut: '2026-09-15',
    noches: 3,
    personas: 4,
    subtotalBase: 360,
    subtotalExtras: 255,
    total: 615,
    estado: 'pagada',
    createdAt: '2026-08-20T14:30:00.000Z',
    pago: {
      operacion: 'OP-001234',
      metodo: 'tarjeta',
      fecha: '2026-08-20T14:35:00.000Z',
      monto: 615
    }
  },
  {
    id: 'CAMP-D4E5F6',
    userId: 'usr-001',
    alojamientoId: 'parcela-tienda',
    extrasIds: ['parrilla', 'wifi'],
    checkIn: '2026-10-02',
    checkOut: '2026-10-04',
    noches: 2,
    personas: 2,
    subtotalBase: 70,
    subtotalExtras: 46,
    total: 116,
    estado: 'pendiente',
    createdAt: '2026-09-25T09:15:00.000Z',
    pago: null
  },
  {
    id: 'CAMP-G7H8I9',
    userId: 'usr-001',
    alojamientoId: 'parcela-caravana',
    extrasIds: ['electricidad', 'kayak'],
    checkIn: '2026-07-10',
    checkOut: '2026-07-14',
    noches: 4,
    personas: 3,
    subtotalBase: 240,
    subtotalExtras: 140,
    total: 380,
    estado: 'completada',
    createdAt: '2026-06-30T18:00:00.000Z',
    pago: {
      operacion: 'OP-000987',
      metodo: 'yape',
      fecha: '2026-06-30T18:05:00.000Z',
      monto: 380
    }
  }
];

/* ---------- Helpers de persistencia ---------- */
function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn('readStore error', e);
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('writeStore error', e);
  }
}

/* ---------- Seed inicial (solo una vez) ---------- */
function seedIfNeeded() {
  if (readStore(STORAGE_KEYS.SEED_DONE, false)) return;
  writeStore(STORAGE_KEYS.USERS, SEED_USERS);
  writeStore(STORAGE_KEYS.RESERVATIONS, SEED_RESERVATIONS);
  writeStore(STORAGE_KEYS.PAYMENTS, []);
  writeStore(STORAGE_KEYS.SEED_DONE, true);
}

/* ---------- Helpers de sesión ---------- */
function getSession() {
  return readStore(STORAGE_KEYS.SESSION, null);
}

function setSession(user) {
  writeStore(STORAGE_KEYS.SESSION, { userId: user.id, email: user.email });
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

/* ---------- Helpers de usuarios ---------- */
function getUsers() {
  return readStore(STORAGE_KEYS.USERS, []);
}

function saveUsers(list) {
  writeStore(STORAGE_KEYS.USERS, list);
}

function findUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  return getUsers().find(u => u.id === id);
}

/* ---------- Helpers de reservas ---------- */
function getReservations() {
  return readStore(STORAGE_KEYS.RESERVATIONS, []);
}

function saveReservations(list) {
  writeStore(STORAGE_KEYS.RESERVATIONS, list);
}

function getReservationById(id) {
  return getReservations().find(r => r.id === id);
}

function getReservationsByUser(userId) {
  return getReservations()
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/* ---------- Auto-ejecutar seed al cargar ---------- */
seedIfNeeded();