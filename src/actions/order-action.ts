"use server";

import { db } from "@/db";
import { orderItems, orders } from "@/db/tables";
import { ICartItem } from "@/store/cart-store";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export const createOrder = async ({
  tx,
  products,
  addressId,
  userId,
}: {
  tx: Transaction;
  products: ICartItem[];
  addressId: string;
  userId: string;
}) => {
  const address = await tx.query.addresses.findFirst({
    where: (a, { eq, and }) => and(eq(a.id, addressId), eq(a.userId, userId)),
  });

  if (!address) throw new Error("Dirección inválida");
  let total = 0;
  const items = [];

  for (const p of products) {
    const variant = await tx.query.productVariants.findFirst({
      where: (v, { eq }) => eq(v.id, p.variantId),
      with: { product: true },
    });
    if (!variant) throw new Error("Producto no encontrado");
    if (p.quantity > variant.stock) throw new Error("Stock insuficiente");

    const price = variant.product.price;
    total += price * p.quantity;
    items.push({
      productVariantId: p.variantId,
      quantity: p.quantity,
      price,
    });
  }

  const [order] = await tx
    .insert(orders)
    .values({ addressId, userId, total, status: "pending" })
    .returning();

  await tx
    .insert(orderItems)
    .values(items.map((i) => ({ ...i, orderId: order.id })));

  return { order, total, items };
};
