import {
  integer,
  pgTable,
  text,
  primaryKey,
  timestamp,
  boolean,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

/* TABLA USUARIOS */

export const userRoles = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: userRoles("role").notNull().default("user"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: text("password").notNull(),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

/* TABLA CATEGORIAS */

export const categories = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
});

/* TABLA PRODUCTOS */

export const products = pgTable("product", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  images: text("images").array().notNull(),
  brand: text("brand"),
  isAvailable: boolean("isAvailable").default(true).notNull(),
  price: integer("price").notNull(),
  colorName: text("colorName").notNull(),
  colorHex: text("colorHex").notNull(),

  categoryId: uuid("categoryId")
    .notNull()
    .references(() => categories.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
}));

/* TABLA VARIANTES-PRODUCTOS */

export const productVariants = pgTable("product_variant", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  size: text("size").notNull(),
  stock: integer("stock").notNull().default(0),
});

export const productRelations = relations(products, ({ many, one }) => ({
  variants: many(productVariants),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const variantRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

/* TABLA PEDIDOS */

export const orderStatus = pgEnum("order_status", [
  "pending",
  "paid",
  "shipped",
  "completed",
  "cancelled",
]);

export const orders = pgTable("order", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: orderStatus("status").notNull().default("pending"),
  total: integer("total").notNull(),

  addressId: uuid("addressId")
    .notNull()
    .references(() => addresses.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_item", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productVariantId: uuid("productVariantId")
    .notNull()
    .references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
});

export const orderRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));

/* TABLA DIRECCION */

export const addresses = pgTable("address", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
});

export const addressRelations = relations(addresses, ({ one }) => ({
  user: one(users, { fields: [addresses.userId], references: [users.id] }),
}));

/* TABLA DE PAGOS */

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const payments = pgTable("payment", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  status: paymentStatus("status").default("pending").notNull(),
  transactionId: text("transactionId"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
