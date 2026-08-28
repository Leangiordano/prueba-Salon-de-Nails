(function () {
  const C = window.AGENDA_CONFIG;
  const E = window.AgendaEngine;
  E.applyTheme();

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  document.title = C.business.name + " | Agenda online";
  $("#bizName").textContent = C.business.name;
  const logoImg = document.querySelector(".logo-img");
  if (logoImg && C.business.logo) logoImg.src = C.business.logo;
  $("#tagline").textContent = C.business.tagline;
  $("#desc").textContent = C.business.description;
  $("#addr").textContent = C.business.address;
  $("#phone").textContent = C.business.phoneDisplay;
  $("#ig").textContent = "@" + C.business.instagram;
  $("#ig").href = "https://instagram.com/" + C.business.instagram;
  $("#waHeader").href = E.whatsappLink(C.business.phoneWhatsApp, "Hola! Quiero consultar por un turno.");

  const hoursTxt = Object.entries(C.hours).map(([d, h]) => {
    const names = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return names[d] + ": " + (h ? h.start + "–" + h.end : "Cerrado");
  }).join(" · ");
  $("#hours").textContent = hoursTxt;

  const prosBox = $("#pros");
  C.professionals.forEach((p) => {
    const el = document.createElement("div");
    el.className = "avatar";
    el.style.background = p.color;
    el.title = p.name + " · " + p.role;
    el.textContent = p.initial;
    prosBox.appendChild(el);
  });

  let filterCat = "all";
  let query = "";
  const state = {
    serviceId: null,
    professionalId: null,
    date: null,
    time: null
  };

  function renderCats() {
    const box = $("#cats");
    box.innerHTML = "";
    const all = document.createElement("button");
    all.className = "cat-btn" + (filterCat === "all" ? " active" : "");
    all.textContent = "Todos";
    all.onclick = () => { filterCat = "all"; render(); };
    box.appendChild(all);
    C.categories.forEach((c) => {
      const b = document.createElement("button");
      b.className = "cat-btn" + (filterCat === c.id ? " active" : "");
      b.textContent = c.name;
      b.onclick = () => { filterCat = c.id; render(); };
      box.appendChild(b);
    });
  }

  function renderServices() {
    const list = $("#services");
    list.innerHTML = "";
    const items = C.services.filter((s) => {
      const okCat = filterCat === "all" || s.category === filterCat;
      const q = query.trim().toLowerCase();
      const okQ = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      return okCat && okQ;
    });
    if (!items.length) {
      list.innerHTML = "<p class='lead'>No hay servicios con ese filtro.</p>";
      return;
    }
    items.forEach((s) => {
      const el = document.createElement("article");
      el.className = "svc";
      el.innerHTML = `
        <div>
          <h3>${s.name}</h3>
          <p>${s.description}</p>
          <div class="meta">${s.duration} min · <span class="price">${E.money(s.price)}</span>
            ${C.booking.requireDeposit ? " · seña " + E.money(E.depositFor(s)) : ""}</div>
        </div>
        <button class="btn">Agendar</button>`;
      el.querySelector("button").onclick = () => openBooking(s.id);
      list.appendChild(el);
    });
  }

  function render() {
    renderCats();
    renderServices();
  }

  $("#q").addEventListener("input", (e) => { query = e.target.value; renderServices(); });

  const overlay = $("#overlay");
  function openBooking(serviceId) {
    state.serviceId = serviceId;
    state.professionalId = null;
    state.date = null;
    state.time = null;
    overlay.classList.add("show");
    drawModal();
  }
  $("#closeModal").onclick = () => overlay.classList.remove("show");
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("show"); });

  function drawModal() {
    const s = E.getService(state.serviceId);
    $("#mTitle").textContent = "Reservar · " + s.name;
    const pros = C.professionals.filter((p) => s.professionals.includes(p.id));
    const box = $("#mPros");
    box.innerHTML = "";
    if (!state.professionalId && pros.length === 1) state.professionalId = pros[0].id;
    const any = document.createElement("div");
    any.className = "pro" + (!state.professionalId ? " selected" : "");
    any.innerHTML = "<b>Cualquiera</b><div class='meta'>Primera disponible</div>";
    any.onclick = () => { state.professionalId = pickFirstAvailable(pros); state.time = null; drawModal(); };
    // "Cualquiera" actually picks first with slots when date is chosen; keep explicit picks
    box.appendChild(any);
    any.onclick = () => { state.professionalId = null; state.time = null; drawModal(); };

    pros.forEach((p) => {
      const el = document.createElement("div");
      el.className = "pro" + (state.professionalId === p.id ? " selected" : "");
      el.innerHTML = `<b>${p.name}</b><div class="meta">${p.role}</div>`;
      el.onclick = () => { state.professionalId = p.id; state.time = null; drawModal(); };
      box.appendChild(el);
    });

    const days = E.nextDays(C.booking.maxDaysAhead);
    const week = $("#mDays");
    week.innerHTML = "";
    days.slice(0, 14).forEach((d) => {
      const el = document.createElement("div");
      el.className = "day" + (d.open ? "" : " off") + (state.date === d.date ? " selected" : "");
      el.textContent = d.label;
      if (d.open) el.onclick = () => { state.date = d.date; state.time = null; drawModal(); };
      week.appendChild(el);
    });

    const slotsBox = $("#mSlots");
    slotsBox.innerHTML = "";
    if (!state.date) {
      slotsBox.innerHTML = "<p class='lead'>Elegí un día.</p>";
    } else {
      const targetPros = state.professionalId
        ? [E.getPro(state.professionalId)]
        : pros;
      let anySlot = false;
      targetPros.forEach((p) => {
        const slots = E.availableSlots(state.date, s.id, p.id).filter((x) => x.available);
        if (!slots.length) return;
        anySlot = true;
        if (!state.professionalId) {
          const lab = document.createElement("div");
          lab.className = "meta";
          lab.style.flexBasis = "100%";
          lab.textContent = p.name;
          slotsBox.appendChild(lab);
        }
        slots.forEach((sl) => {
          const el = document.createElement("div");
          el.className = "slot" + (state.time === sl.time && state.professionalId === p.id ? " selected" : "");
          el.textContent = sl.time;
          el.onclick = () => {
            state.time = sl.time;
            state.professionalId = p.id;
            drawModal();
          };
          slotsBox.appendChild(el);
        });
      });
      if (!anySlot) slotsBox.innerHTML = "<p class='lead'>No hay horarios libres ese día para este servicio.</p>";
    }

    const dep = E.depositFor(s);
    const pay = C.payment || {};
    const aliasBlock = pay.mode === "alias" && pay.alias
      ? `<div class="alias-box">Seña por transferencia<br><code>${pay.alias}</code><br><span class="meta">${pay.aliasLabel || "Alias"} · ${pay.instructions || ""}</span></div>`
      : `<div class="meta">El resto se abona en el salón.</div>`;
    $("#mSum").innerHTML = `
      <div><span>Servicio</span><span>${s.name}</span></div>
      <div><span>Duración</span><span>${s.duration} min</span></div>
      <div><span>Total</span><span>${E.money(s.price)}</span></div>
      <div class="total"><span>Seña ahora</span><span>${E.money(dep)}</span></div>
      ${aliasBlock}
    `;
    $("#confirmBtn").disabled = !(state.serviceId && state.professionalId && state.date && state.time);
    $("#confirmBtn").textContent = pay.mode === "alias" ? "Reservar y ver datos de seña" : "Pagar seña y reservar";
  }

  function pickFirstAvailable() { return null; }

  $("#bookingForm").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const payload = {
      serviceId: state.serviceId,
      professionalId: state.professionalId,
      date: state.date,
      time: state.time,
      clientName: $("#fName").value,
      clientPhone: $("#fPhone").value,
      clientEmail: $("#fEmail").value,
      notes: $("#fNotes").value
    };
    let appt;
    try {
      appt = E.createAppointment(payload);
    } catch (err) {
      toast(err.message);
      drawModal();
      return;
    }

    if (C.mercadoPago.enabled) {
      try {
        const res = await fetch(C.mercadoPago.apiCreatePreference, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId: appt.id, title: E.getService(appt.serviceId).name, amount: appt.deposit, payerEmail: appt.clientEmail })
        });
        const data = await res.json();
        if (data.init_point) {
          location.href = data.init_point;
          return;
        }
        throw new Error(data.error || "No se pudo iniciar Mercado Pago");
      } catch (err) {
        toast("No se pudo abrir Mercado Pago. Dejamos el turno en espera de seña. " + err.message);
      }
    } else if ((C.payment && C.payment.mode === "alias") || !C.mercadoPago.enabled) {
      // Alias / transferencia: queda en espera de seña hasta que el admin marque "Seña ok"
      // (no confirmamos automático)
    } else {
      E.confirmPayment(appt.id, "demo-local");
    }

    overlay.classList.remove("show");
    showThanks(appt);
  });

  function showThanks(appt) {
    const s = E.getService(appt.serviceId);
    const p = E.getPro(appt.professionalId);
    const pay = C.payment || {};
    const msg = E.fillTemplate(C.reminders.templates.booked, E.messageData(appt));
    const waClient = E.whatsappLink(appt.clientPhone, msg);
    const waSalon = E.whatsappLink(
      C.business.phoneWhatsApp,
      "Nuevo turno: " + s.name + " con " + p.name + " el " + appt.date + " " + appt.time +
      " — " + appt.clientName + " " + appt.clientPhone +
      (pay.alias ? " · Seña a " + pay.alias : "")
    );
    const payInfo = pay.mode === "alias" && pay.alias
      ? `<div class="alias-box">Transferí <b>${E.money(appt.deposit)}</b> a<br><code>${pay.alias}</code><br><span class="meta">${pay.aliasLabel || "Personal Pay"}</span></div>
         <p class="lead">Cuando transfieras, avisá por WhatsApp con el comprobante. El salón confirma la seña.</p>`
      : `<div class="meta">Seña registrada.</div>`;
    $("#thanks").classList.add("show");
    $("#thanksBody").innerHTML = `
      <h2>Turno reservado</h2>
      <p>${s.name} con ${p.name}<br>${E.formatDateHuman(appt.date)} a las ${appt.time}</p>
      <div class="summary">
        <div><span>Total</span><span>${E.money(appt.price)}</span></div>
        <div class="total"><span>Seña</span><span>${E.money(appt.deposit)}</span></div>
        ${payInfo}
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <a class="btn block" href="${waClient}" target="_blank" rel="noopener">Abrir comprobante en WhatsApp</a>
        <a class="btn ghost block" href="${waSalon}" target="_blank" rel="noopener">Avisar al salón</a>
      </div>
    `;
  }
  $("#closeThanks").onclick = () => $("#thanks").classList.remove("show");

  function toast(t) {
    const el = $("#toast");
    el.textContent = t;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2800);
  }

  render();
})();
