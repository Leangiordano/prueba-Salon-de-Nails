/**
 * Vercel Serverless Function
 * Crea una preferencia de Mercado Pago por la SEÑA del turno.
 * Variable de entorno: MP_ACCESS_TOKEN
 *
 * El dinero entra a TU cuenta de Mercado Pago (la del Access Token).
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    res.status(500).json({ error: "Falta MP_ACCESS_TOKEN en las variables de entorno de Vercel" });
    return;
  }

  const { appointmentId, title, amount, payerEmail } = req.body || {};
  const value = Number(amount);
  if (!appointmentId || !title || !value || value <= 0) {
    res.status(400).json({ error: "Datos incompletos" });
    return;
  }

  const origin = req.headers.origin || ("https://" + (req.headers.host || ""));

  const preference = {
    items: [
      {
        title: "Seña · " + title,
        quantity: 1,
        currency_id: "ARS",
        unit_price: value
      }
    ],
    payer: payerEmail ? { email: payerEmail } : undefined,
    external_reference: appointmentId,
    statement_descriptor: "SENA TURNO",
    binary_mode: true,
    expires: true,
    expiration_date_from: new Date().toISOString(),
    expiration_date_to: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    back_urls: {
      success: origin + "/gracias.html?turno=" + encodeURIComponent(appointmentId),
      pending: origin + "/pendiente.html?turno=" + encodeURIComponent(appointmentId),
      failure: origin + "/pago-fallido.html?turno=" + encodeURIComponent(appointmentId)
    },
    auto_return: "approved",
    notification_url: origin + "/api/webhook-mp"
  };

  const mp = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(preference)
  });

  const data = await mp.json();
  if (!mp.ok) {
    res.status(mp.status).json({ error: data.message || "Error Mercado Pago", details: data });
    return;
  }

  res.status(200).json({
    id: data.id,
    init_point: data.init_point,
    sandbox_init_point: data.sandbox_init_point
  });
}
