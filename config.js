/* ============================================================
   AGENDA PROPIA — Configuración del negocio
   ============================================================ */

window.AGENDA_CONFIG = {
  business: {
    name: "Manos Esculpidas",
    logo: "assets/logo-manos-esculpidas.jpg",
    tagline: "Esculpidas, pedicuría, pestañas, cejas y depilación definitiva",
    description:
      "Reservá tu turno online. Elegí el servicio, la profesional y el horario. La seña se acredita directo a la cuenta del salón.",
    address: "Juana Gorriti 43, Ing. Maschwitz, Buenos Aires",
    phoneDisplay: "11 6524-4920",
    phoneWhatsApp: "5491165244920",
    instagram: "manosesculpidas.maschwitz",
    email: "ejemplo@ejemplo.com",
    timezone: "America/Argentina/Buenos_Aires",
    currency: "ARS",
    currencySymbol: "$"
  },

  brand: {
    primary: "#FF4EC8",
    primaryDark: "#C2188A",
    accent: "#FF8AD8",
    bg: "#F7F1EC",
    surface: "#FFFFFF",
    text: "#2B1D22",
    muted: "#7A6A70"
  },

  booking: {
    slotMinutes: 15,
    minNoticeHours: 2,
    maxDaysAhead: 30,
    holdMinutes: 15,
    requireDeposit: true,
    depositType: "percent",
    depositPercent: 50,
    depositFixed: 5000,
    allowPayLater: false,
    cancellationHours: 12
  },

  hours: {
    0: null,
    1: null,
    2: { start: "09:00", end: "20:00" },
    3: { start: "09:00", end: "20:00" },
    4: { start: "09:00", end: "20:00" },
    5: { start: "09:00", end: "20:00" },
    6: { start: "09:00", end: "20:00" }
  },

  categories: [
    { id: "esculpidas", name: "Esculpidas" },
    { id: "pies", name: "Pedicuría" },
    { id: "pestanas", name: "Pestañas" },
    { id: "cejas", name: "Cejas" },
    { id: "depilacion", name: "Depilación definitiva" }
  ],

  services: [
    { id: "full-set", category: "esculpidas", name: "Full set", description: "Primera puesta de uñas esculpidas.", duration: 120, price: 34000, professionals: ["sofia", "camila", "valentina"] },
    { id: "service-esculpidas", category: "esculpidas", name: "Service", description: "Mantenimiento de esculpidas.", duration: 90, price: 30000, professionals: ["sofia", "camila", "valentina"] },
    { id: "capping-gel", category: "esculpidas", name: "Capping gel", description: "Refuerzo con gel sobre uña natural.", duration: 75, price: 27000, professionals: ["sofia", "camila", "valentina"] },
    { id: "soft-gel", category: "esculpidas", name: "Soft gel", description: "Extensión con tips de soft gel.", duration: 75, price: 25000, professionals: ["sofia", "camila", "valentina"] },
    { id: "capping-semi", category: "esculpidas", name: "Capping semipermanente", description: "Capping + esmaltado semipermanente.", duration: 60, price: 23000, professionals: ["sofia", "camila", "valentina"] },
    { id: "retirado", category: "esculpidas", name: "Retirado", description: "Retiro de esculpidas, capping o soft gel.", duration: 30, price: 10000, professionals: ["sofia", "camila", "valentina"] },
    { id: "pedicuria", category: "pies", name: "Pedicuría", description: "Pedicuría completa.", duration: 75, price: 28000, professionals: ["sofia", "camila", "valentina"] },
    { id: "belleza-pies", category: "pies", name: "Belleza de pies", description: "Belleza de pies.", duration: 50, price: 22000, professionals: ["sofia", "camila", "valentina"] },
    { id: "extensiones-veganas", category: "pestanas", name: "Extensiones de pestañas veganas", description: "Extensiones veganas.", duration: 120, price: 30000, professionals: ["sofia", "camila", "valentina"] },
    { id: "lifting-pestanas", category: "pestanas", name: "Lifting de pestañas coreano", description: "Curvado permanente desde la raíz + tinte negro intenso. Efecto rímel 24 hs, sin extensiones.", duration: 60, price: 18000, professionals: ["sofia", "camila", "valentina"] },
    { id: "depi-cejas", category: "cejas", name: "Depilación de cejas", description: "Depilación de cejas.", duration: 20, price: 8000, professionals: ["sofia", "camila", "valentina"] },
    { id: "laminado-cejas", category: "cejas", name: "Laminado de cejas", description: "Laminado de cejas.", duration: 45, price: 10000, professionals: ["sofia", "camila", "valentina"] },
    { id: "depi-p1", category: "depilacion", name: "Promo 1 — Cavado + tira", description: "Depilación definitiva Soprano Ice Platinum.", duration: 20, price: 20000, professionals: ["sofia", "camila", "valentina"] },
    { id: "depi-p2", category: "depilacion", name: "Promo 2 — Rostro completo", description: "Depilación definitiva Soprano Ice Platinum.", duration: 25, price: 18000, professionals: ["sofia", "camila", "valentina"] },
    { id: "depi-p3", category: "depilacion", name: "Promo 3 — Cavado + tira + axila", description: "Depilación definitiva Soprano Ice Platinum.", duration: 25, price: 20000, professionals: ["sofia", "camila", "valentina"] },
    { id: "depi-p4", category: "depilacion", name: "Promo 4 — Cavado + tira + axila + media pierna", description: "Depilación definitiva Soprano Ice Platinum.", duration: 40, price: 22000, professionals: ["sofia", "camila", "valentina"] },
    { id: "depi-p5", category: "depilacion", name: "Promo 5 — Cavado + tira + axila + pierna completa", description: "Depilación definitiva Soprano Ice Platinum.", duration: 50, price: 24000, professionals: ["sofia", "camila", "valentina"] },
    { id: "depi-p6", category: "depilacion", name: "Promo 6 — Bozo + mentón + cavado + tira + axila + pierna completa", description: "Depilación definitiva Soprano Ice Platinum.", duration: 60, price: 26000, professionals: ["sofia", "camila", "valentina"] }
  ],

  professionals: [
    { id: "sofia", name: "Sofía", role: "Nail artist", initial: "S", color: "#7A3048", hours: { 2: { start: "09:00", end: "20:00" }, 3: { start: "09:00", end: "20:00" }, 4: { start: "09:00", end: "20:00" }, 5: { start: "09:00", end: "20:00" }, 6: { start: "09:00", end: "20:00" } } },
    { id: "camila", name: "Camila", role: "Manicurista", initial: "C", color: "#C9A27A", hours: { 2: { start: "09:00", end: "20:00" }, 3: { start: "09:00", end: "20:00" }, 4: { start: "09:00", end: "20:00" }, 5: { start: "09:00", end: "20:00" }, 6: { start: "09:00", end: "20:00" } } },
    { id: "valentina", name: "Valentina", role: "Estética y uñas", initial: "V", color: "#4A6B6A", hours: { 2: { start: "09:00", end: "20:00" }, 3: { start: "09:00", end: "20:00" }, 4: { start: "09:00", end: "20:00" }, 5: { start: "09:00", end: "20:00" }, 6: { start: "09:00", end: "20:00" } } }
  ],

  reminders: {
    hoursBefore: [24, 2],
    confirmKeyword: "SI",
    cancelKeyword: "NO",
    templates: {
      booked:
        "Hola {nombre}! Confirmamos tu turno en {negocio}:\n\n💅 {servicio}\n👤 {profesional}\n📅 {fecha} a las {hora}\n⏱ {duracion} min\n💰 Seña: {sena}\n\nSi no podés venir, avisanos con {cancel} hs de anticipación.",
      reminder:
        "Hola {nombre}! Te recordamos tu turno de mañana en {negocio}:\n\n💅 {servicio} con {profesional}\n📅 {fecha} a las {hora}\n\nRespondé *SI* para confirmar o *NO* para cancelar y liberar el horario.",
      reminderSoon:
        "Hola {nombre}! En 2 horas tenés tu turno de {servicio} con {profesional} ({hora}). Te esperamos en {negocio} 💕",
      cancelled:
        "Hola {nombre}, cancelamos tu turno del {fecha} a las {hora}. Cuando quieras podés volver a reservar desde el link."
    }
  },

  payment: {
    mode: "alias",
    alias: "lgiordano2.ppay",
    aliasLabel: "Personal Pay",
    instructions:
      "Transferí la seña a este alias. Después compartí por WhatsApp con el comprobante."
  },

  mercadoPago: {
    enabled: false,
    publicKey: "APP_USR-xxxxxxxx",
    apiCreatePreference: "/api/create-preference",
    successUrl: "/gracias.html",
    pendingUrl: "/pendiente.html",
    failureUrl: "/pago-fallido.html"
  },

  admin: {
    pin: "2914",
    storageKey: "agenda_propia_v1"
  }
};
