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
    const { cartItems, paymentMethod, deliveryAddress } =
      req.body as CreateOrderRequest;

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
    const shopIds = [...new Set(items.map((item) => item.shop.toString()))];
    const shops = await Shop.find({
      _id: { $in: shopIds },
    }).select("_id owner");
    const existingShopIds = new Set(shops.map((shop) => shop._id.toString()));

    const shopById = new Map(shops.map((shop) => [shop._id.toString(), shop]));

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
        owner: mongoose.Types.ObjectId;
        items: {
          item: mongoose.Types.ObjectId;
          name: string;
          image: string;
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
      const shop = shopById.get(shopId);

      if (!shop) {
        return res.status(404).json({
          success: false,
          message: `Shop not found: ${shopId}`,
        });
      }

      if (existingShopOrder) {
        existingShopOrder.items.push({
          item: item._id,
          name: item.name,
          image: item.image.url,
          price: item.price,
          quantity: requestedItem.quantity,
          subtotal,
        });
        existingShopOrder.itemTotal += subtotal;
      } else {
        shopOrderMap.set(shopId, {
          shop: item.shop,
          owner: shop.owner,
          items: [
            {
              item: item._id,
              name: item.name,
              image: item.image.url,
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

// export const getUserOrders = async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.userId;

//     if (!userId) {
//       return res.status(401).json({
//         message: "User id not found",
//       });
//     }

//     const orders = await Order.find({ user: userId })
//       .populate("shopOrders.shop", "name owner")
//       .populate("shopOrders.owner", "name email mobile")
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     console.error("getMyOrders:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch orders",
//     });
//   }
// };

// get owner orders

// export const getOwnerOrders = async (req: AuthRequest, res: Response) => {
//   try {
//     const ownerId = req.userId;

//     if (!ownerId) {
//       return res.status(401).json({
//         success: false,
//         message: "User is not authenticated",
//       });
//     }

//     const orders = await Order.find(
//       {
//         "shopOrders.owner": ownerId,
//       },
//       {
//         shopOrders: {
//           $elemMatch: {
//             owner: ownerId,
//           },
//         },
//       },
//     )
//       .populate("user", "name email mobile")
//       .populate("shopOrders.shop", "name owner")
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json({
//       success: true,
//       orders,
//     });

//   } catch (error) {
//     console.error("getOwnerOrders:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch owner orders",
//     });
//   }
// };





// Fetch orders for users and owners.

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    // Read the authenticated user's ID.
    const userId = req.userId;

    // Require authentication.
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Load the user's role to select the correct order query.
    const user = await User.findById(userId).select("role");

    // Ensure the authenticated user still exists.
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Select only the order fields needed by the clients.
    const orderFields =
      "user shopOrders paymentMethod paymentStatus deliveryAddress pricing orderStatus";

    if (user.role === "owner") {
      // Find orders containing at least one shop owned by this owner.
      const orders = await Order.find({
        "shopOrders.owner": userId,
      })
        .select(orderFields)
        .sort({ createdAt: -1 })
        .lean();

      // Keep every shop order belonging to this owner.
      const ownerOrders = orders.map((order) => ({
        ...order,
        shopOrders: order.shopOrders.filter(
          (shopOrder) => shopOrder.owner.toString() === userId,
        ),
      }));

      // Populate customer, shop, owner, and item details.
      await Order.populate(ownerOrders, [
        { path: "user", select: "name email mobile" },
        { path: "shopOrders.shop", select: "name owner" },
        { path: "shopOrders.owner", select: "name email mobile" },
        { path: "shopOrders.items.item", select: "name image price" },
      ]);

      // Return the owner's filtered orders.
      return res.status(200).json({
        success: true,
        orders: ownerOrders,
      });
    }

    // Find all orders placed by the authenticated user.
    const orders = await Order.find({ user: userId })
      .select(orderFields)
      .populate("user", "name email mobile")
      .populate("shopOrders.shop", "name owner")
      .populate("shopOrders.owner", "name email mobile")
      .populate("shopOrders.items.item", "name image price")
      .sort({ createdAt: -1 })
      .lean();

    // Return the user's complete orders.
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    // Handle unexpected database or population errors.
    console.error("getOrders:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
