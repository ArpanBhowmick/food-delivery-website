import { z } from "zod";

export const ITEM_CATEGORIES = [
  "Snacks",
  "Main Courses",
  "Desserts",
  "Pizza",
  "Burgers",
  "Sandwiches",
  "South Indian",
  "North Indian",
  "Chinese",
  "Fast Food",
  "Others",
] as const;

export const createItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Item name is required.")
    .max(50, "Item name cannot exceed 50 characters."),

  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(500, "Description cannot exceed 500 characters."),

  category: z.enum(ITEM_CATEGORIES, {
    error: "Please select a category.",
  }),

  price: z
    .number({ error: "Please enter a valid price." })
    .min(1, "Price must be at least 1."),

  foodType: z.enum(["veg", "non-veg"], {
    error: "Please select a food type.",
  }),

  isAvailable: z.boolean(),

  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Image size must be less than 5MB.",
    )
    .refine(
      (file) =>
        !file || ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      "Only PNG, JPG and JPEG images are allowed.",
    ),
});

export type CreateItemForm = z.infer<typeof createItemSchema>;