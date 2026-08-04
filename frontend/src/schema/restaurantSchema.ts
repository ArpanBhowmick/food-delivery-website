import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Restaurant name must be at least 3 characters.")
    .max(100, "Restaurant name cannot exceed 100 characters."),

  city: z
    .string()
    .trim()
    .min(1, "Please select a city."),

  state: z
    .string()
    .trim()
    .min(1, "Please select a state."),

  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters.")
    .max(300, "Address cannot exceed 300 characters."),

  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Image size must be less than 5MB."
    )
    .refine(
      (file) =>
        !file ||
        ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      "Only PNG, JPG and JPEG images are allowed."
    ),
});

export type CreateRestaurantForm = z.infer<
  typeof createRestaurantSchema
>;