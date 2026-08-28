/**
 * Webhook de Mercado Pago.
 * Cuando la seña se acredita, acá tendrías que marcar el turno como confirmed
 * en tu base (Supabase). En el MVP localStorage eso se hace desde el admin
 * o en gracias.html.
 *
 * Variable: MP_ACCESS_TOKEN
 */
export default async function handler(req, res) {
  const token = process.env.MP_ACCESS_TOKEN;
  const type = req.query.type || req.body?.type;
  const id = req.query["data.id"] || req.body?.data?.id;

  if (type === "payment" && id && token) {
    const payRes = await fetch("https://api.mercadopago.com/v1/payments/" + id, {
      headers: { Authorization: "Bearer " + token }
    });
    const payment = await payRes.json();
    const appointmentId = payment.external_reference;
    const status = payment.status;
    console.log("MP payment", { appointmentId, status, amount: payment.transaction_amount });
    // TODO: updateAppointment(appointmentId, { status: status === "approved" ? "confirmed" : "hold", paid: payment.transaction_amount, paymentId: String(id) })
  }

  res.status(200).json({ ok: true });
}
