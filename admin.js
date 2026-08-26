(function () {
  const C = window.AGENDA_CONFIG;
  const E = window.AgendaEngine;
  E.applyTheme();

  function $(s) { return document.querySelector(s); }

  $("#adminBiz").textContent = C.business.name;

  function toast(t) {
    const el = $("#toast");
    el.textContent = t;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2600);
  }

  function openDesk() {
    $("#lock").classList.add("is-hidden");
    $("#desk").classList.add("is-open");
    const sel = $("#adminPro");
    sel.innerHTML = "<option value=''>Todas</option>";
    C.professionals.forEach((p) => {
      const o = document.createElement("option");
      o.value = p.id;
      o.textContent = p.name;
      sel.appendChild(o);
    });
    $("#adminDate").value = E.dateKey(new Date());
    $("#adminDate").onchange = render;
    sel.onchange = render;
    render();
  }

  $("#unlock").onclick = () => {
    if ($("#pin").value === C.admin.pin) {
      sessionStorage.setItem("agenda_admin", "1");
      openDesk();
    } else {
      toast("PIN incorrecto");
    }
  };
  $("#pin").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#unlock").click();
  });
  if (sessionStorage.getItem("agenda_admin") === "1") openDesk();

  function statusBadge(st) {
    const map = { confirmed: "paid", hold: "hold", cancelled: "cancelled", expired: "cancelled" };
    const label = {
      confirmed: "CONFIRMADO",
      hold: "ESPERA SEÑA",
      cancelled: "CANCELADO",
      expired: "VENCIDO"
    };
    return `<span class="badge ${map[st] || ""}">${label[st] || st}</span>`;
  }

  function render() {
    const date = $("#adminDate").value;
    const pro = $("#adminPro").value;
    const state = E.loadState();
    const day = state.appointments
      .filter((a) => a.date === date && (!pro || a.professionalId === pro))
      .sort((a, b) => a.time.localeCompare(b.time));

    const box = $("#dayList");
    if (!day.length) {
      box.innerHTML =
        "<div class='kicker'>" +
        (date ? E.formatDateHuman(date) : "Día") +
        "</div><p class='lead' style='margin:0'>No hay turnos este día.</p>";
    } else {
      let html =
        "<div class='kicker'>Turnos · " +
        E.formatDateHuman(date) +
        "</div>";
      day.forEach((a) => {
        const s = E.getService(a.serviceId);
        const p = E.getPro(a.professionalId);
        const msg = E.fillTemplate(C.reminders.templates.reminder, E.messageData(a));
        const wa = E.whatsappLink(a.clientPhone, msg);
        html += `
          <div class="appt-card">
            <div class="time">${a.time} <span class="meta">· ${a.duration} min</span></div>
            <div style="margin-top:4px">
              <b>${a.clientName}</b> ${statusBadge(a.status)}
            </div>
            <div class="meta" style="margin-top:4px">
              ${s ? s.name : a.serviceId} · ${p ? p.name : ""} · ${a.clientPhone}
            </div>
            <div class="actions">
              <a class="btn" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>
              ${a.status === "hold" ? `<button class="btn ok" type="button" data-pay="${a.id}">Seña ok</button>` : ""}
              ${a.status !== "cancelled" ? `<button class="btn danger" type="button" data-cancel="${a.id}">Cancelar</button>` : ""}
            </div>
          </div>`;
      });
      box.innerHTML = html;
    }

    box.onclick = (ev) => {
      const pay = ev.target.getAttribute("data-pay");
      const cancel = ev.target.getAttribute("data-cancel");
      if (pay) {
        E.confirmPayment(pay, "manual");
        toast("Seña marcada");
        render();
      }
      if (cancel) {
        E.cancelAppointment(cancel, "admin");
        toast("Turno cancelado");
        render();
      }
    };

    const rows = [...state.appointments].sort((a, b) =>
      (b.date + b.time).localeCompare(a.date + a.time)
    );
    $("#allTable").innerHTML =
      "<tr><th>Fecha</th><th>Hora</th><th>Cliente</th><th>Servicio</th><th>Pro</th><th>Seña</th><th>Estado</th></tr>" +
      rows
        .map((a) => {
          const s = E.getService(a.serviceId);
          const p = E.getPro(a.professionalId);
          return `<tr>
            <td>${a.date}</td>
            <td>${a.time}</td>
            <td>${a.clientName}<br><span class="meta">${a.clientPhone}</span></td>
            <td>${s ? s.name : ""}</td>
            <td>${p ? p.name : ""}</td>
            <td>${E.money(a.paid || 0)} / ${E.money(a.deposit)}</td>
            <td>${statusBadge(a.status)}</td>
          </tr>`;
        })
        .join("");
  }

  $("#btnRemindDay").onclick = () => {
    const date = $("#adminDate").value;
    const state = E.loadState();
    const list = state.appointments.filter(
      (a) => a.date === date && a.status === "confirmed"
    );
    if (!list.length) {
      toast("No hay turnos confirmados ese día");
      return;
    }
    const first = list[0];
    const msg = E.fillTemplate(C.reminders.templates.reminder, E.messageData(first));
    window.open(E.whatsappLink(first.clientPhone, msg), "_blank");
    if (list.length > 1) {
      toast("Se abrió el primero. Usá WhatsApp en cada tarjeta.");
    }
  };

  $("#btnExport").onclick = () => {
    const blob = new Blob([E.exportState()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "agenda-backup.json";
    a.click();
  };

  $("#btnImport").onclick = () => $("#fileImport").click();
  $("#fileImport").onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        E.importState(reader.result);
        toast("Datos importados");
        render();
      } catch (err) {
        toast("JSON inválido");
      }
    };
    reader.readAsText(f);
  };

  $("#btnClearAll").onclick = () => {
    if (!confirm("¿Borrar TODOS los turnos? No se puede deshacer.")) return;
    E.clearAllAppointments();
    toast("Todos los turnos borrados");
    render();
  };
})();
