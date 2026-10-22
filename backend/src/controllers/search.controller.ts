import type { Response } from "express";
import type { AuthRequest } from "../types/types.js";
import { Item } from "../models/item.modal.js";
import { Shop } from "../models/shop.modal.js";
import { User } from "../models/user.model.js";

// Escape regex special characters so a user query is always matched literally.
const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Resolve the authenticated user's saved city, or null to run a guest search.
// optionalAuth already set req.userId when a valid token was sent.
const getUserCity = async (req: AuthRequest): Promise<string | null> => {
  if (!req.userId) {
    return null;
  }

  const user = await User.findById(req.userId).select("defaultAddress").lean();

  const city = user?.defaultAddress?.city;

  return typeof city === "string" && city.trim() ? city.trim() : null;
};

// Search shops and items with one query.
export const globalSearch = async (req: AuthRequest, res: Response) => {
  try {
    // Read the search query.
    const { query } = req.query;

    // Require a non empty search query.
    if (typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Match the trimmed query against the name fields, ignoring case.
    const nameRegex = new RegExp(escapeRegex(query.trim()), "i");

    // Restrict results to the authenticated user's saved city when possible.
    const city = await getUserCity(req);

    // Match the saved city (case and whitespace tolerant) or search globally.
    const cityCondition = city
      ? { city: new RegExp(`^${escapeRegex(city)}$`, "i") }
      : {};

    // Collect every shop in the user's city so items can be restricted by shop.
    let shopIds: string[] | undefined;

    if (city) {
      const cityShops = await Shop.find({
        ...cityCondition,
        isActive: { $ne: false },
      })
        .select("_id")
        .lean();

      shopIds = cityShops.map((shop) => shop._id.toString());
    }

    // Search shops and items at the same time.
    const [shops, items] = await Promise.all([
      // Only the fields needed to render a shop result card.
      Shop.find({
        name: nameRegex,
        ...cityCondition,
        isActive: { $ne: false },
      })
        .select("name image city address")
        .lean(),

      Item.find({
        name: nameRegex,
        ...(shopIds && { shop: { $in: shopIds } }),
      })
        .select("name description price image")
        .populate({
          path: "shop",
          select: "name image city address",
          match: { isActive: { $ne: false } },
        })
        .lean(),
    ]);

    // Return both result types in one response.
    // Items whose shop is inactive are dropped: the populate match above
    // left their shop field null.
    return res.status(200).json({
      success: true,
      shops,
      items: items.filter((item) => item.shop),
    });
  } catch (error) {
    console.error("globalSearch:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search",
    });
  }
};
