import z from "zod";

export const loginSchema = z.object({
  email: z.email("El correo no es valido").min(1, "El correo es requerido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
});

export const registerSchema = z.object({
  email: z.email("El correo no es valido").min(1, "El correo es requerido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "Debe tener más de 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
  name: z
    .string()
    .min(2, "Debe tener más de 2 caracteres")
    .max(16, "La contraseña debe tener menos de 16 caracteres"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
