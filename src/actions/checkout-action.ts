"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { ICartItem } from "@/store/cart-store";
import { createOrder } from "./order-action";
import { createPayment } from "./payment-action";

export const checkout = async (
  addressId: string,
  method: "mercadopago" | "transfer",
  products: ICartItem[]
) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("No autorizado: usuario no encontrado");
  }

  return await db.transaction(async (tx) => {
    const { order, total } = await createOrder({
      tx,
      userId,
      addressId,
      products,
    });
    const paymentResult = await createPayment({
      tx,
      order,
      products,
      method,
      total,
    });
    return paymentResult;
  });
};
