export interface IItem {
  _id: string;

  name: string;
  description: string;

  image?: {
    url: string;
    publicId: string;
  };

  shop: string;

  category:
    | "Snacks"
    | "Main Courses"
    | "Desserts"
    | "Pizza"
    | "Burgers"
    | "Sandwiches"
    | "South Indian"
    | "North Indian"
    | "Chinese"
    | "Fast Food"
    | "Others";

  price: number;

  foodType: "veg" | "non-veg";

  isAvailable: boolean;

  createdAt: string;
  updatedAt: string;
}