
import mongoose from "mongoose";
import type { Response } from "express";
import { Item } from "../models/item.modal.js";
import { Order } from "../models/order.model.js";
import { Shop } from "../models/shop.modal.js";
import { User } from "../models/user.model.js";
import type { AuthRequest } from "../types/types.js";

// Defines the expected shape of cart items.
interface CartItemInput {
  itemId: string;
  quantity: number;
}

// Defines the expected delivery location details.
interface DeliveryAddressInput {
  text: string;
  latitude: number;
  longitude: number;
}

// Defines the accepted order request fields.
interface CreateOrderRequest {
  cartItems?: unknown;
  paymentMethod?: unknown;
  deliveryAddress?: unknown;
}

// Checks whether a value is a non-null object.
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    // Read order details from the request body.
    const { cartItems, paymentMethod, deliveryAddress } = req.body as CreateOrderRequest;

    // Require an authenticated user.
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Require at least one cart item.
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    // if (
    //   paymentMethod !== "cod" &&
    //   paymentMethod !== "upi" &&
    //   paymentMethod !== "card"
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "A valid payment method is required",
    //   });
    // }

    // Only COD is currently supported.
    if (paymentMethod !== "cod") {
      return res.status(400).json({
        success: false,
        message: "Only cash on delivery is currently supported",
      });
    }

    // Validate the delivery address and coordinates.
    if (!isObject(deliveryAddress)) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    const addressText = deliveryAddress.text;
    const latitude = deliveryAddress.latitude;
    const longitude = deliveryAddress.longitude;

    if (
      typeof addressText !== "string" ||
      !addressText.trim() ||
      typeof latitude !== "number" ||
      !Number.isFinite(latitude) ||
      typeof longitude !== "number" ||
      !Number.isFinite(longitude)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid delivery address and location are required",
      });
    }

    // Validate and normalize each requested cart item.
    const requestedCartItems: CartItemInput[] = [];
    const itemIds = new Set<string>();

    for (const cartItem of cartItems) {
      if (!isObject(cartItem)) {
        return res.status(400).json({
          success: false,
          message: "Each cart item must include an item id and quantity",
        });
      }

      const itemId = cartItem.itemId;
      const quantity = cartItem.quantity;

      if (
        typeof itemId !== "string" ||
        !mongoose.Types.ObjectId.isValid(itemId) ||
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Each cart item must have a valid item id and quantity",
        });
      }

      if (itemIds.has(itemId)) {
        return res.status(400).json({
          success: false,
          message: "Duplicate items are not allowed in the cart",
        });
      }

      itemIds.add(itemId);
      requestedCartItems.push({ itemId, quantity });
    }

    // Confirm that the user placing the order exists.
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Load all requested items in one query.
    const items = await Item.find({
      _id: { $in: [...itemIds] },
    });
    const itemById = new Map(items.map((item) => [item._id.toString(), item]));

    // Ensure every item exists and is available.
    for (const requestedItem of requestedCartItems) {
      const item = itemById.get(requestedItem.itemId);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `Item not found: ${requestedItem.itemId}`,
        });
      }

      if (!item.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${item.name} is currently unavailable`,
        });
      }
    }

    // Confirm that all item shops still exist.
    const shopIds = [
      ...new Set(items.map((item) => item.shop.toString())),
    ];
    const shops = await Shop.find({
      _id: { $in: shopIds },
    }).select("_id");
    const existingShopIds = new Set(shops.map((shop) => shop._id.toString()));

    for (const shopId of shopIds) {
      if (!existingShopIds.has(shopId)) {
        return res.status(404).json({
          success: false,
          message: `Shop not found: ${shopId}`,
        });
      }
    }

    // Prepare orders grouped by shop.
    const shopOrderMap = new Map<
      string,
      {
        shop: mongoose.Types.ObjectId;
        items: {
          item: mongoose.Types.ObjectId;
          name: string;
          price: number;
          quantity: number;
          subtotal: number;
        }[];
        itemTotal: number;
      }
    >();

    // Add each item to its shop order and calculate subtotals.
    for (const requestedItem of requestedCartItems) {
      const item = itemById.get(requestedItem.itemId)!;
      const shopId = item.shop.toString();
      const subtotal = item.price * requestedItem.quantity;
      const existingShopOrder = shopOrderMap.get(shopId);

      if (existingShopOrder) {
        existingShopOrder.items.push({
          item: item._id,
          name: item.name,
          price: item.price,
          quantity: requestedItem.quantity,
          subtotal,
        });
        existingShopOrder.itemTotal += subtotal;
      } else {
        shopOrderMap.set(shopId, {
          shop: item.shop,
          items: [
            {
              item: item._id,
              name: item.name,
              price: item.price,
              quantity: requestedItem.quantity,
              subtotal,
            },
          ],
          itemTotal: subtotal,
        });
      }
    }

    // Calculate the final order pricing.
    const shopOrders = [...shopOrderMap.values()];
    const itemTotal = shopOrders.reduce(
      (total, shopOrder) => total + shopOrder.itemTotal,
      0,
    );
    const deliveryFee = itemTotal >= 500 ? 0 : 40;
    const discount = 0;
    const totalAmount = itemTotal + deliveryFee - discount;

    // Save the new order.
    const order = await Order.create({
      user: user._id,
      shopOrders,
      paymentMethod,
      paymentStatus: "pending",
      deliveryAddress: {
        text: addressText.trim(),
        latitude,
        longitude,
      },
      pricing: {
        itemTotal,
        deliveryFee,
        discount,
        totalAmount,
      },
      orderStatus: "placed",
    });

    // Return the created order.
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    // Log unexpected errors and return a server error.
    console.error("createOrder:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};







// get orders by user




