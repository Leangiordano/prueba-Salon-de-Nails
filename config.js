/* ============================================================
   AGENDA PROPIA — Configuración del negocio
   Editá este archivo para personalizar TODO:
   nombre, colores, servicios, profesionales, horarios, seña, WhatsApp.
   ============================================================ */

window.AGENDA_CONFIG = {
  business: {
    name: "Manos Esculpidas",
    logo: "assets/logo-manos-esculpidas.jpg",
    tagline: "Manicura, pedicura y estética",
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
    1: { start: "10:00", end: "19:00" },
    2: { start: "10:00", end: "19:00" },
    3: { start: "10:00", end: "20:00" },
    4: { start: "10:00", end: "19:00" },
    5: { start: "10:00", end: "19:00" },
    6: { start: "10:00", end: "19:00" }
  },

  categories: [
    { id: "manos", name: "Manos" },
    { id: "pies", name: "Pies" },
    { id: "estetica", name: "Estética" }
  ],

  services: [
    {
      id: "manicuria",
      category: "manos",
      name: "Manicuría",
      description: "Belleza de manos sin esmaltado. Repegue de cutículas, limado e hidratación.",
      duration: 40,
      price: 12000,
      professionals: ["sofia", "camila", "valentina"]
    },
    {
      id: "semi-manos",
      category: "manos",
      name: "Esmaltado semipermanente",
      description: "Manicura completa + color semipermanente. Secado en cabina LED.",
      duration: 60,
      price: 18000,
      professionals: ["sofia", "camila", "valentina"]
    },
    {
      id: "french",
      category: "manos",
      name: "French",
      description: "French clásico o moderno sobre semipermanente.",
      duration: 75,
      price: 22000,
      professionals: ["sofia", "camila"]
    },
    {
      id: "cateye",
      category: "manos",
      name: "Cat Eye",
      description: "Efecto ojo de gato con imán. Incluye manicura.",
      duration: 70,
      price: 23000,
      professionals: ["sofia", "valentina"]
    },
    {
      id: "nailart",
      category: "manos",
      name: "Full nail art",
      description: "Diseño a medida en las 10 uñas.",
      duration: 90,
      price: 28000,
      professionals: ["sofia"]
    },
    {
      id: "kapping",
      category: "manos",
      name: "Kapping / Soft gel",
      description: "Refuerzo con gel sobre uña natural + color.",
      duration: 90,
      price: 26000,
      professionals: ["sofia", "camila"]
    },
    {
      id: "retiro",
      category: "manos",
      name: "Retiro de esmaltado",
      description: "Retiro de semipermanente o soft gel. Sin cargo si te volvés a esmaltar.",
      duration: 30,
      price: 7000,
      professionals: ["sofia", "camila", "valentina"]
    },
    {
      id: "pedicuria",
      category: "pies",
      name: "Pedicuría",
      description: "Belleza de pies sin esmaltado. Limado, cutículas e hidratación.",
      duration: 50,
      price: 15000,
      professionals: ["camila", "valentina"]
    },
    {
      id: "semi-pies",
      category: "pies",
      name: "Esmaltado semipermanente pies",
      description: "Pedicura + color semipermanente.",
      duration: 70,
      price: 20000,
      professionals: ["camila", "valentina"]
    },
    {
      id: "spa-pies",
      category: "pies",
      name: "Spa de pies",
      description: "Exfoliación, hidratación profunda y masaje.",
      duration: 80,
      price: 24000,
      professionals: ["valentina"]
    },
    {
      id: "cejas",
      category: "estetica",
      name: "Perfilado de cejas",
      description: "Diseño y perfilado con pinza o cera.",
      duration: 20,
      price: 8000,
      professionals: ["camila", "valentina"]
    },
    {
      id: "limpieza",
      category: "estetica",
      name: "Limpieza facial",
      description: "Limpieza profunda, extracción e hidratación.",
      duration: 60,
      price: 25000,
      professionals: ["valentina"]
    }
  ],

  professionals: [
    {
      id: "sofia",
      name: "Sofía",
      role: "Nail artist",
      initial: "S",
      color: "#7A3048",
      hours: {
        1: { start: "10:00", end: "18:00" },
        2: { start: "10:00", end: "18:00" },
        3: { start: "11:00", end: "19:00" },
        4: { start: "10:00", end: "18:00" },
        5: { start: "10:00", end: "18:00" },
        6: { start: "10:00", end: "16:00" }
      }
    },
    {
      id: "camila",
      name: "Camila",
      role: "Manicurista",
      initial: "C",
      color: "#C9A27A",
      hours: {
        1: { start: "12:00", end: "19:00" },
        2: { start: "12:00", end: "19:00" },
        3: { start: "12:00", end: "20:00" },
        4: { start: "12:00", end: "19:00" },
        5: { start: "12:00", end: "19:00" },
        6: { start: "10:00", end: "19:00" }
      }
    },
    {
      id: "valentina",
      name: "Valentina",
      role: "Estética y uñas",
      initial: "V",
      color: "#4A6B6A",
      hours: {
        2: { start: "10:00", end: "19:00" },
        3: { start: "10:00", end: "19:00" },
        4: { start: "10:00", end: "19:00" },
        5: { start: "10:00", end: "19:00" },
        6: { start: "10:00", end: "14:00" }
      }
    }
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
