"use server";

import { db } from "@/db";
import { payments } from "@/db/tables";
import { mercadopago } from "@/lib/mercadopago";
import { ICartItem } from "@/store/cart-store";
import { Order } from "@/types/order.type";
import { Preference } from "mercadopago";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

interface Item {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  picture_url: string;
}

export async function createPayment({
  tx,
  order,
  total,
  method,
  products,
}: {
  tx: Transaction;
  order: Order;
  total: number;
  method: "mercadopago" | "transfer";
  products: ICartItem[];
}) {
  if (method === "mercadopago") {
    const mercadoPagoItems: Item[] = products.map((p) => ({
      id: p.variantId,
      title: p.name,
      quantity: p.quantity,
      unit_price: p.price,
      picture_url: p.image,
    }));

    const paymentLink = await createMercadoPagoLink(order.id, mercadoPagoItems);

    await tx.insert(payments).values({
      orderId: order.id,
      amount: total,
      status: "pending",
    });

    return { order, paymentLink };
  }

  /* await tx.insert(payments).values({
    orderId: order.id,
    amount: total,
    method: "BANK_TRANSFER",
    status: "pending",
  });

  return { order }; */
}

export const createMercadoPagoLink = async (orderId: string, items: Item[]) => {
  try {
    const preference = await new Preference(mercadopago).create({
      body: { items, external_reference: orderId },
    });

    return preference.init_point;
  } catch (error) {
    console.error(error);
  }
};
