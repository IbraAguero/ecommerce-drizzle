import MercadoPagoConfig from "mercadopago";

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    integratorId: "dev_24c65fb163bf11ea96500242ac130004",
    //idempotencyKey: "<IDEMPOTENCY_KEY>",
  },
});
