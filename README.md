# Agenda Propia

Sistema de turnos online **tuyo**: servicios, profesionales, disponibilidad, seña con Mercado Pago (entra a tu cuenta) y recordatorios por WhatsApp.

No usa AgendaPro. No copia su código. Es un producto independiente que podés publicar en tu dominio.

## Qué hace hoy

Flujo del cliente:

1. Elige el servicio (manos, pies, estética, etc.).
2. Elige profesional o “cualquiera” (primera con horario libre).
3. Ve solo los horarios **libres** de esa profesional para ese servicio y duración.
4. Deja nombre + WhatsApp.
5. Paga la **seña** (porcentaje o monto fijo).
6. Recibe el comprobante por WhatsApp.

Panel admin (`admin.html`):

- Agenda del día por profesional.
- Marcar seña cobrada / cancelar turno.
- Botón WhatsApp con el texto de recordatorio ya armado.
- Exportar / importar backup JSON (importante: los turnos viven en el navegador hasta que pases a una base).

## Archivos

| Archivo | Para qué |
|---|---|
| `config.js` | Nombre, colores, servicios, precios, profesionales, horarios, % de seña, PIN, WhatsApp |
| `index.html` | Sitio público de reservas |
| `admin.html` | Panel |
| `engine.js` | Disponibilidad y turnos |
| `api/create-preference.js` | Cobra la seña con Mercado Pago (Vercel) |
| `api/webhook-mp.js` | Aviso cuando MP acredita |

## Personalizar

Abrí `config.js` y cambiá:

- `business.name`, dirección, Instagram, `phoneWhatsApp` (formato `54911…` sin +).
- `services` (nombre, minutos, precio, qué profesionales lo hacen).
- `professionals` y sus horarios por día (`1` lunes … `6` sábado, `0` domingo).
- `booking.depositPercent` o `depositFixed`.
- `admin.pin` **antes de publicar**.

Colores en `brand`.

## Publicar en tu dominio (Vercel)

1. Subí esta carpeta a un repo de GitHub.
2. En [vercel.com](https://vercel.com) → Import project.
3. En Domain, conectá `tudominio.com` o `reservas.tudominio.com`.

Desde el iPhone se puede hacer con la app de GitHub + Vercel.

## Mercado Pago (la seña entra a tu cuenta)

1. Entrá a [Tus integraciones](https://www.mercadopago.com.ar/developers/panel) con **tu** usuario de MP.
2. Creá una aplicación y copiá:
   - Public Key → `mercadoPago.publicKey` en `config.js`
   - Access Token → **solo** en Vercel → Settings → Environment Variables → `MP_ACCESS_TOKEN`
3. En `config.js` poné `mercadoPago.enabled: true`.

Nunca pegues el Access Token en el HTML. Si lo publicás, cualquiera puede cobrar a tu nombre o meter mano.

La seña se crea como una *preferencia* de Checkout Pro. El cliente paga con dinero en cuenta, tarjeta, etc. MP te acredita a vos, con la comisión habitual de Mercado Pago. Este sistema no se queda con un peso.

Hasta que no actives MP, el sitio corre en **modo demo**: reserva y marca la seña como acreditada para que pruebes el flujo.

## WhatsApp

Hay dos niveles.

### Nivel 1 — ya funciona (gratis)

El admin abre `wa.me` con el mensaje listo (confirmación o recordatorio 24 h / 2 h).  
Mandás desde el WhatsApp Business del salón. Cero costo de API.

### Nivel 2 — automático (pago de Meta)

Para que salga solo, sin tocar el teléfono:

1. WhatsApp Business Cloud API (Meta) o un BSP (360dialog, Twilio, etc.).
2. Plantillas preaprobadas tipo Utility: “Recordatorio de turno”.
3. Un cron / Vercel scheduled function que mire los turnos de mañana y dispare la plantilla.

En Argentina el recordatorio (utility) tiene costo por mensaje de Meta. Confirmaciones dentro de las 24 h de una respuesta del cliente pueden salir más baratas o gratis según la ventana.

El texto de las plantillas está en `config.js` → `reminders.templates`.

## Límite importante del MVP

Los turnos se guardan en **localStorage del navegador**.

Eso sirve para:

- Probar el diseño y el flujo.
- Usar el panel siempre **desde el mismo teléfono/computadora**.

No sirve todavía para:

- Que una clienta reserve desde su celular y vos veas el turno en el tuyo (son storages distintos).
- Varias profesionales editando a la vez.

Para producción de verdad hay que pasar el storage a **Supabase** (gratis) o Firebase. La lógica de `engine.js` ya está separada para eso: `loadState` / `saveState` se cambian por llamadas a la base.

Si querés, el siguiente paso es exactamente ese: misma interfaz + base en la nube + webhook de MP que confirme el turno solo.

## Qué no es

No es AgendaPro, Fresha ni Booksy. No trae marketplace, inventario, caja, comisiones ni ficha clínica. Trae lo que pediste: agenda con disponibilidad por servicio y profesional, seña a tu billetera y recordatorio por WhatsApp.
