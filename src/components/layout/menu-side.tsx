"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ROUTES = [
  { link: "/camperas", label: "Camperas" },
  { link: "/remeras", label: "Remeras" },
  { link: "/pantalones", label: "Pantalones" },
];

function MenuSide() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="hover:text-white/80">
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="text-center">
          <SheetTitle className="italic">TIENDA</SheetTitle>
        </SheetHeader>
        <div className="px-5 flex flex-col gap-5">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Productos</AccordionTrigger>
              <AccordionContent className="px-4 space-y-4">
                {ROUTES.map((route) => (
                  <Link
                    key={route.link}
                    href={`/productos/${route.link}`}
                    className="flex justify-between items-center hover:underline transition-transform"
                  >
                    <span className="font-medium ">{route.label}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link
            href="/contacto"
            className="flex justify-between items-center hover:underline transition-transform"
          >
            <span className="font-medium ">Contacto</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default MenuSide;
