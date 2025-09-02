import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

export interface ICartItem {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export interface CartStore {
  items: ICartItem[];
  addItem: (item: ICartItem) => void;
  removeItem: (id: string) => void;
  cleanCart: () => void;
  total: () => number;
}

const storeApi: StateCreator<CartStore> = (set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const items = state.items;
      const existing = items.find((i) => i.variantId === item.variantId);

      if (existing) {
        return {
          items: items.map((i) =>
            i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      } else {
        return { items: [...items, item] };
      }
    });
  },

  removeItem: (variantId) => {
    set((state) => {
      const items = state.items;

      return { items: items.filter((i) => i.variantId !== variantId) };
    });
  },

  cleanCart: () => set({ items: [] }),

  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
});

export const useCartStore = create<CartStore>()(
  persist(storeApi, { name: "cart-storage" })
);
