/* ===========================================================
   payment.js
   Procesa pagos simulados con distintos métodos.
   Depende de: data.js, reservations.js, main.js
   =========================================================== */

function validateCardData(data) {
  if (!data || !data.number || !data.holder || !data.expiry || !data.cvv) {
    return { ok: false, message: 'Completa todos los datos de la tarjeta.' };
  }
  const num = String(data.number).replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(num)) return { ok: false, message: 'Número de tarjeta inválido.' };
  if (!/^\d{3,4}$/.test(String(data.cvv))) return { ok: false, message: 'CVV inválido.' };
  if (!/^\d{2}\/\d{2}$/.test(String(data.expiry))) return { ok: false, message: 'Fecha de expiración inválida (MM/AA).' };
  return { ok: true };
}

function processPayment({ reservationId, method, cardData = null }) {
  return new Promise((resolvePromise) => {
    const reservation = getReservationById(reservationId);
    if (!reservation) return resolvePromise({ ok: false, message: 'Reserva no encontrada.' });
    if (!reservationCanBePaid(reservation)) return resolvePromise({ ok: false, message: 'Esta reserva ya no admite pago.' });

    if (method === PAYMENT_METHODS.TARJETA.code) {
      const v = validateCardData(cardData);
      if (!v.ok) return resolvePromise({ ok: false, message: v.message });
    }

    setTimeout(() => {
      const payment = {
        operacion: 'OP-' + Date.now().toString().slice(-8),
        metodo: method,
        fecha: new Date().toISOString(),
        monto: reservation.total
      };
      const r = attachPayment(reservationId, payment);
      if (!r.ok) return resolvePromise({ ok: false, message: r.message });
      const payments = readStore(STORAGE_KEYS.PAYMENTS, []);
      payments.push({ ...payment, reservationId });
      writeStore(STORAGE_KEYS.PAYMENTS, payments);
      resolvePromise({ ok: true, payment, reservation: r.reservation });
    }, 1400);
  });
}

function paymentMethodLabel(code) {
  const m = Object.values(PAYMENT_METHODS).find(x => x.code === code);
  return m ? m.label : code;
}