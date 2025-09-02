"use client";
import { useCartStore } from "@/store/cart-store";
import { AlertCircle, ShoppingCart } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CartItem from "./cart-item";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import Link from "next/link";

function ButtonCart() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative inline-flex cursor-pointer">
          <ShoppingCart />
          {items.length > 0 && (
            <Badge className="absolute -top-1 -right-2 h-4 min-w-4 rounded-full px-1 font-semibold tabular-nums">
              {items.length}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="min-w-1/3 overflow-auto">
        <SheetHeader>
          <SheetTitle className="text-center font-bold text-xl">
            CARRITO DE COMPRAS
          </SheetTitle>
        </SheetHeader>
        <div className="px-8 pb-4 h-full">
          {items.length > 0 ? (
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-4 flex-1">
                {items.length > 0 &&
                  items.map((i) => <CartItem key={i.variantId} item={i} />)}
              </div>
              <div className="space-y-4 mt-10">
                <div className="flex justify-between font-bold text-xl">
                  <span>TOTAL:</span>
                  <span>
                    {total().toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </span>
                </div>
                <Separator />
                <Link href={"/checkout"}>
                  <Button className="w-full">Iniciar Compra</Button>
                </Link>
                <Button className="w-full" variant="link">
                  Ver mas productos
                </Button>
              </div>
            </div>
          ) : (
            <Alert>
              <AlertCircle />
              <AlertDescription>
                El carrito de compras está vacío.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default ButtonCart;
