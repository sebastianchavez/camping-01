/* ===========================================================
   reservations.js
   CRUD de reservas en localStorage.
   Depende de: data.js
   =========================================================== */

function buildReservation(payload) {
  const user = getCurrentUser();
  if (!user) return { ok: false, message: 'Debes iniciar sesión para reservar.' };

  const { alojamientoId, serviciosExtra = [], checkIn, checkOut, personas } = payload;
  if (!alojamientoId) return { ok: false, message: 'Selecciona un tipo de alojamiento.' };
  if (!checkIn || !checkOut) return { ok: false, message: 'Selecciona fechas válidas.' };
  if (new Date(checkOut) <= new Date(checkIn)) return { ok: false, message: 'La fecha de salida debe ser posterior a la de entrada.' };

  const base = SERVICES_CATALOG.find(s => s.id === alojamientoId);
  if (!base) return { ok: false, message: 'Alojamiento no válido.' };

  const extras = serviciosExtra
    .map(id => SERVICES_CATALOG.find(s => s.id === id))
    .filter(Boolean);

  const noches = diffDays(checkIn, checkOut);
  const subtotalBase = base.price * noches;
  const subtotalExtras = extras.reduce((acc, s) => acc + s.price * noches, 0);
  const total = subtotalBase + subtotalExtras;

  const reservation = {
    id: generateCode(),
    userId: user.id,
    alojamientoId,
    extrasIds: extras.map(e => e.id),
    checkIn,
    checkOut,
    noches,
    personas: Number(personos) || 1,
    subtotalBase,
    subtotalExtras,
    total,
    estado: RESERVATION_STATUS.PENDIENTE.code,
    createdAt: new Date().toISOString(),
    pago: null
  };

  const list = getReservations();
  list.push(reservation);
  saveReservations(list);
  return { ok: true, reservation };
}

function cancelReservation(id) {
  const list = getReservations();
  const idx = list.findIndex(r => r.id === id);
  if (idx === -1) return { ok: false, message: 'Reserva no encontrada.' };
  if (list[idx].estado === RESERVATION_STATUS.ANULADA.code) return { ok: false, message: 'La reserva ya está anulada.' };
  if (list[idx].estado === RESERVATION_STATUS.COMPLETADA.code) return { ok: false, message: 'No se puede anular una reserva completada.' };

  list[idx].estado = RESERVATION_STATUS.ANULADA.code;
  list[idx].cancelledAt = new Date().toISOString();
  saveReservations(list);
  return { ok: true, reservation: list[idx] };
}

function attachPayment(reservationId, payment) {
  const list = getReservations();
  const idx = list.findIndex(r => r.id === reservationId);
  if (idx === -1) return { ok: false, message: 'Reserva no encontrada.' };
  list[idx].pago = payment;
  list[idx].estado = RESERVATION_STATUS.PAGADA.code;
  saveReservations(list);
  return { ok: true, reservation: list[idx] };
}

function getAlojamientoName(id) {
  const s = SERVICES_CATALOG.find(x => x.id === id);
  return s ? s.name : '—';
}

function getServiceById(id) {
  return SERVICES_CATALOG.find(x => x.id === id);
}

function statusBadge(statusCode) {
  const map = {
    pendiente:  { label: 'Pendiente',  cls: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    confirmada: { label: 'Confirmada', cls: 'bg-blue-100 text-blue-800 border-blue-300' },
    pagada:     { label: 'Pagada',     cls: 'bg-green-100 text-green-800 border-green-300' },
    anulada:    { label: 'Anulada',    cls: 'bg-red-100 text-red-800 border-red-300' },
    completada: { label: 'Completada', cls: 'bg-gray-200 text-gray-800 border-gray-300' }
  };
  const s = map[statusCode] || map.pendiente;
  return `<span class="inline-block px-3 py-1 rounded-full text-xs font-semibold border ${s.cls}">${s.label}</span>`;
}

function reservationCanBePaid(r) {
  return r.estado === 'pendiente' || r.estado === 'confirmada';
}

function reservationCanBeCancelled(r) {
  return r.estado === 'pendiente' || r.estado === 'confirmada' || r.estado === 'pagada';
}