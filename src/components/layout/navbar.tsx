import Link from "next/link";
import { UserCircle } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import MenuSide from "./menu-side";
import Cart from "../cart/cart";

const ROUTES = [
  { link: "/camperas", label: "Camperas" },
  { link: "/remeras", label: "Remeras" },
  { link: "/pantalones", label: "Pantalones" },
];

function Navbar() {
  return (
    <nav className="w-full fixed bg-neutral-950 z-10">
      <div className="w-full border-b">
        <div className="max-w-7xl mx-auto p-5 flex justify-between items-center">
          <Link href={"/"}>
            <h1 className="text-3xl font-black tracking-tight italic">
              TIENDA
            </h1>
          </Link>
          <div className="flex items-center gap-5">
            <Cart />
            <Link
              href={"/cuenta"}
              role="button"
              className="hover:text-white/80 transition-colors"
            >
              <UserCircle />
            </Link>
            <div className="sm:hidden">
              <MenuSide />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-b hidden sm:block">
        <div className="max-w-7xl mx-auto p-2 px-5 flex justify-between items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Productos</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-sm">
                  {ROUTES.map((route) => (
                    <NavigationMenuLink
                      key={route.link}
                      href={`/productos/${route.link}`}
                    >
                      {route.label}
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/contacto"
                  className={navigationMenuTriggerStyle()}
                >
                  Contacto
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
