import mongoose from "mongoose";
import type { Response } from "express";
import type { AuthRequest } from "../types/types.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../util/cloudinaryUploadAndDel.js";
import { Shop } from "../models/shop.modal.js";
import { Item } from "../models/item.modal.js";
import { Order } from "../models/order.model.js";
import { DeliveryAssignment } from "../models/deliveryAssignment.model.js";
import { User } from "../models/user.model.js";

// create shop
export const createShop = async (req: AuthRequest, res: Response) => {
  try {
    const { name, state, city, address, latitude, longitude } = req.body;

    if (
      !name ||
      !state ||
      !city ||
      !address ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized in shop creation as user id is missing",
      });
    }

    console.time("duplicate check");
    const existingShop = await Shop.findOne({
      owner: req.userId,
      name: name.trim(),
      address: address.trim(),
    });

    if (existingShop) {
      return res.status(409).json({
        message: "A restaurant with the same name and address already exists.",
      });
    }

    // upload image to cloudinary

    let image;

    console.timeEnd("duplicate check");

    console.time("cloudinary upload");
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.path);

      image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    console.timeEnd("cloudinary upload");

    console.time("shop create");

    const shop = await Shop.create({
      name,
      state,
      city,
      address,
      owner: req.userId,
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
      ...(image && { image }), //onlyif the image exist
    });

    console.timeEnd("shop create");

    console.time("populate");

    await shop.populate("owner");

    console.timeEnd("populate");

    return res.status(201).json({
      success: true,
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: `Internal Server Error ${error}` });
  }
};

// update shop

export const editShop = async (req: AuthRequest, res: Response) => {
  try {
    const { shopId } = req.params;

    const { name, state, city, address } = req.body;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // check ownership

    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized in shop update as user id is not the owner",
      });
    }

    // updating text if there is

    if (name) shop.name = name;
    if (state) shop.state = state;
    if (city) shop.city = city;
    if (address) shop.address = address;

    // update image if there is & delete  old iamge if exists

    if (req.file) {
      // Upload new image
      const uploadedImage = await uploadToCloudinary(req.file.path);

      //  Delete old image
      if (shop.image) {
        await deleteFromCloudinary(shop.image.publicId);
      }

      // Save new image
      shop.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    await shop.save();

    return res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      shop,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "update shop failed",
    });
  }
};

// delete shop

export const deleteShop = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized in shop deletion as user id is missing",
      });
    }

    const { shopId } = req.params;

    if (
      typeof shopId !== "string" ||
      !mongoose.Types.ObjectId.isValid(shopId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop id",
      });
    }

    const user = await User.findById(req.userId).select("role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can delete shops",
      });
    }

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized in shop deletion as user id is not the owner",
      });
    }

    // Reject while any of this shop's entries inside an order is still
    // unresolved. $elemMatch keeps the shop and status conditions on the
    // same shopOrders entry, so another shop's entry cannot match for us.
    const unresolvedOrder = await Order.findOne({
      shopOrders: {
        $elemMatch: {
          shop: shop._id,
          orderStatus: { $in: ["placed", "preparing", "outForDelivery"] },
        },
      },
    });

    if (unresolvedOrder) {
      return res.status(409).json({
        success: false,
        message:
          "Shop has unresolved orders and cannot be deleted or deactivated",
      });
    }

    // Reject while a delivery assignment for this shop is still open.
    const unresolvedAssignment = await DeliveryAssignment.findOne({
      shopId: shop._id,
      status: { $in: ["available", "accepted", "pickedUp"] },
    });

    if (unresolvedAssignment) {
      return res.status(409).json({
        success: false,
        message:
          "Shop has unresolved delivery assignments and cannot be deleted or deactivated",
      });
    }

    // Resolved history exists → deactivate instead of deleting.
    const hasOrderHistory = await Order.exists({
      "shopOrders.shop": shop._id,
    });

    const hasAssignmentHistory = await DeliveryAssignment.exists({
      shopId: shop._id,
    });

    if (hasOrderHistory || hasAssignmentHistory) {
      await Shop.updateOne({ _id: shop._id }, { $set: { isActive: false } });

      return res.status(200).json({
        success: true,
        action: "deactivated",
        message:
          "Shop deactivated successfully. Its order and delivery history have been preserved.",
      });
    }

    // No order or delivery history at all → permanently delete the shop
    // and its items in one transaction.
    const session = await mongoose.startSession();

    try {
      const items = await session.withTransaction(async () => {
        const deleteResult = await Shop.deleteOne(
          { _id: shop._id, owner: shop.owner },
          { session },
        );

        if (deleteResult.deletedCount !== 1) {
          return null;
        }

        const itemsToDelete = await Item.find({
          shop: shop._id,
        })
          .select("image")
          .session(session);

        await Item.deleteMany({ shop: shop._id }, { session });

        return itemsToDelete;
      });

      if (!items) {
        return res.status(404).json({
          success: false,
          message: "Shop not found or already deleted",
        });
      }

      for (const item of items) {
        if (item.image?.publicId) {
          try {
            await deleteFromCloudinary(item.image.publicId);
          } catch (error) {
            console.error(
              "deleteShop: failed to delete item image from Cloudinary",
              error,
            );
          }
        }
      }

      if (shop.image?.publicId) {
        try {
          await deleteFromCloudinary(shop.image.publicId);
        } catch (error) {
          console.error(
            "deleteShop: failed to delete shop image from Cloudinary",
            error,
          );
        }
      }

      return res.status(200).json({
        success: true,
        action: "deleted",
        message: "Shop deleted successfully",
      });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("deleteShop:", error);

    return res.status(500).json({
      success: false,
      message: "delete shop failed",
    });
  }
};

// get all owner shops
export const getOwnerShops = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized in shop update as user id is not the owner",
      });
    }

    const shops = await Shop.find({ owner: ownerId });

    if (shops.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No shops found",
        shops: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shops found",
      shops,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "get shops failed",
    });
  }
};

// get shop by id

export const getShopById = async (req: AuthRequest, res: Response) => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(400).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Verify the logged-in owner owns this shop
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this shop",
      });
    }

    return res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop",
    });
  }
};

// get shops by city

export const getShopsByCity = async (req: AuthRequest, res: Response) => {
  try {
    const { city } = req.query;

    if (typeof city !== "string" || !city.trim()) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const shops = await Shop.find({
      city: city.trim(),
      isActive: { $ne: false },
    })
      .lean()
      .limit(4);

    return res.status(200).json({
      success: true,
      shops,
    });
  } catch (error) {
    console.error("getShopsByCity:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shops",
    });
  }
};

// get public shop by id (user facing, no ownership check)

export const getPublicShopById = async (req: AuthRequest, res: Response) => {
  try {
    const { shopId } = req.params as { shopId: string };

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    console.error("getPublicShopById:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch shop",
    });
  }
};
