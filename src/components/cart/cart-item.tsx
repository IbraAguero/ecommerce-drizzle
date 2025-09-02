import { ICartItem, useCartStore } from "@/store/cart-store";
import { Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

function CartItem({ item }: { item: ICartItem }) {
  const removeItem = useCartStore((state) => state.removeItem);

  const totalAmount = item.price * item.quantity;

  return (
    <div className="flex w-full">
      <div className="h-[100px] w-[70px] bg-blue-300">IMAGEN</div>
      <div className=" ml-2 flex-1 w-full flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <span>
            <Link
              href={`/producto/${item.slug}`}
              className="uppercase font-semibold hover:text-white/80 transition-colors"
            >
              {item.name}
            </Link>{" "}
            ({item.color}, {item.size})
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="p-0 m-0"
            onClick={() => removeItem(item.variantId)}
          >
            <Trash />
          </Button>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span>{item.quantity}</span>
          <span className="font-semibold">
            {totalAmount.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
export default CartItem;
