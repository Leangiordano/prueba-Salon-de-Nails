/* Motor de agenda: disponibilidad, turnos, seña, WhatsApp */
(function (global) {
  const C = () => global.AGENDA_CONFIG;
  const KEY = () => C().admin.storageKey;

  function money(n) {
    return C().business.currencySymbol + Number(n || 0).toLocaleString("es-AR");
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  function parseHM(hm) {
    const [h, m] = hm.split(":").map(Number);
    return h * 60 + m;
  }

  function toHM(mins) {
    return pad(Math.floor(mins / 60)) + ":" + pad(mins % 60);
  }

  function dateKey(d) {
    const x = d instanceof Date ? d : new Date(d);
    return x.getFullYear() + "-" + pad(x.getMonth() + 1) + "-" + pad(x.getDate());
  }

  function formatDateHuman(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY());
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { appointments: [], clients: [], settings: {} };
  }

  function saveState(state) {
    localStorage.setItem(KEY(), JSON.stringify(state));
  }

  function uid(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  }

  function getService(id) {
    return C().services.find((s) => s.id === id);
  }
  function getPro(id) {
    return C().professionals.find((p) => p.id === id);
  }

  function depositFor(service) {
    const b = C().booking;
    if (!b.requireDeposit) return 0;
    if (b.depositType === "fixed") return b.depositFixed;
    return Math.round((service.price * b.depositPercent) / 100);
  }

  function hoursForPro(pro, weekday) {
    if (pro.hours && Object.prototype.hasOwnProperty.call(pro.hours, weekday)) {
      return pro.hours[weekday] || null;
    }
    return C().hours[weekday] || null;
  }

  function appointmentsOn(state, date, proId) {
    return (state.appointments || []).filter((a) =>
      a.date === date &&
      a.professionalId === proId &&
      a.status !== "cancelled" &&
      a.status !== "expired"
    );
  }

  function overlaps(startA, durA, startB, durB) {
    const a0 = parseHM(startA), a1 = a0 + durA;
    const b0 = parseHM(startB), b1 = b0 + durB;
    return a0 < b1 && b0 < a1;
  }

  function isPastSlot(date, hm) {
    const now = new Date();
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = hm.split(":").map(Number);
    const slot = new Date(y, m - 1, d, hh, mm);
    const min = new Date(now.getTime() + C().booking.minNoticeHours * 3600 * 1000);
    return slot < min;
  }

  function availableSlots(date, serviceId, proId) {
    const service = getService(serviceId);
    const pro = getPro(proId);
    if (!service || !pro) return [];
    if (!service.professionals.includes(proId)) return [];

    const [y, m, d] = date.split("-").map(Number);
    const weekday = new Date(y, m - 1, d).getDay();
    const hours = hoursForPro(pro, weekday);
    if (!hours) return [];

    const state = loadState();
    const taken = appointmentsOn(state, date, proId);
    const step = C().booking.slotMinutes;
    const start = parseHM(hours.start);
    const end = parseHM(hours.end);
    const slots = [];

    for (let t = start; t + service.duration <= end; t += step) {
      const hm = toHM(t);
      if (isPastSlot(date, hm)) continue;
      const clash = taken.some((a) => overlaps(hm, service.duration, a.time, a.duration));
      slots.push({ time: hm, available: !clash });
    }
    return slots;
  }

  function nextDays(n) {
    const out = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for (let i = 0; i < n; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      out.push({
        date: dateKey(d),
        weekday: d.getDay(),
        label: d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric" }),
        open: !!C().hours[d.getDay()]
      });
    }
    return out;
  }

  function fillTemplate(tpl, data) {
    return tpl.replace(/\{(\w+)\}/g, (_, k) => data[k] ?? "");
  }

  function messageData(appt) {
    const s = getService(appt.serviceId);
    const p = getPro(appt.professionalId);
    return {
      nombre: appt.clientName,
      negocio: C().business.name,
      servicio: s ? s.name : appt.serviceId,
      profesional: p ? p.name : appt.professionalId,
      fecha: formatDateHuman(appt.date),
      hora: appt.time,
      duracion: appt.duration,
      sena: money(appt.deposit),
      total: money(appt.price),
      cancel: C().booking.cancellationHours
    };
  }

  function whatsappLink(phone, text) {
    const num = String(phone).replace(/\D/g, "");
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
  }

  function createAppointment(payload) {
    const service = getService(payload.serviceId);
    const pro = getPro(payload.professionalId);
    if (!service || !pro) throw new Error("Servicio o profesional inválido");

    const slots = availableSlots(payload.date, payload.serviceId, payload.professionalId);
    const slot = slots.find((s) => s.time === payload.time && s.available);
    if (!slot) throw new Error("Ese horario ya no está disponible");

    const state = loadState();
    const appt = {
      id: uid("trn"),
      createdAt: new Date().toISOString(),
      status: C().booking.requireDeposit ? "hold" : "confirmed",
      serviceId: service.id,
      professionalId: pro.id,
      date: payload.date,
      time: payload.time,
      duration: service.duration,
      price: service.price,
      deposit: depositFor(service),
      paid: 0,
      paymentId: null,
      clientName: payload.clientName.trim(),
      clientPhone: payload.clientPhone.replace(/\D/g, ""),
      clientEmail: (payload.clientEmail || "").trim(),
      notes: payload.notes || "",
      remindersSent: []
    };
    state.appointments.push(appt);
    saveState(state);
    return appt;
  }

  function updateAppointment(id, patch) {
    const state = loadState();
    const i = state.appointments.findIndex((a) => a.id === id);
    if (i < 0) return null;
    state.appointments[i] = { ...state.appointments[i], ...patch, updatedAt: new Date().toISOString() };
    saveState(state);
    return state.appointments[i];
  }

  function markPaid(id, paymentId) {
    return updateAppointment(id, { status: "confirmed", paid: undefinedFix, paymentId });
  }

  function confirmPayment(id, paymentId) {
    const state = loadState();
    const appt = state.appointments.find((a) => a.id === id);
    if (!appt) return null;
    return updateAppointment(id, {
      status: "confirmed",
      paid: appt.deposit,
      paymentId: paymentId || "demo"
    });
  }

  function cancelAppointment(id, reason) {
    return updateAppointment(id, { status: "cancelled", cancelReason: reason || "" });
  }

  function exportState() {
    return JSON.stringify(loadState(), null, 2);
  }

  function importState(json) {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    if (!data.appointments) throw new Error("Archivo inválido");
    saveState(data);
  }

  function clearAllAppointments() {
    const state = loadState();
    state.appointments = [];
    saveState(state);
  }

  function applyTheme() {
    const b = C().brand;
    const r = document.documentElement;
    r.style.setProperty("--primary", b.primary);
    r.style.setProperty("--primary-dark", b.primaryDark);
    r.style.setProperty("--accent", b.accent);
    r.style.setProperty("--bg", b.bg);
    r.style.setProperty("--surface", b.surface);
    r.style.setProperty("--text", b.text);
    r.style.setProperty("--muted", b.muted);
  }

  // dummy to avoid undefined in markPaid leftover
  const undefinedFix = undefined;

  global.AgendaEngine = {
    money, dateKey, formatDateHuman, loadState, saveState,
    getService, getPro, depositFor, availableSlots, nextDays,
    fillTemplate, messageData, whatsappLink,
    createAppointment, updateAppointment, confirmPayment, cancelAppointment,
    exportState, importState, clearAllAppointments, applyTheme, hoursForPro
  };
})(window);
