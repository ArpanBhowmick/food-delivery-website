import { z } from "zod";


// register schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name cannot exceed 100 characters"),

    email: z
      .email("Please enter a valid email address"),

    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Please enter a valid mobile number"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(25, "Password cannot exceed 100 characters"),

    confirmPassword: z.string(),

    role: z.enum(["user", "owner", "deliveryBoy"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof registerSchema>;



// login schema
export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;