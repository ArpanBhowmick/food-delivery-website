import type { Response } from "express";
import type { AuthRequest } from "../types/types.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../util/cloudinaryUploadAndDel.js";
import { Shop } from "../models/shop.modal.js";
import { Item } from "../models/item.modal.js";

// create shop
export const createShop = async (req: AuthRequest, res: Response) => {
  try {
    const { name, state, city, address } = req.body;

    if (!name || !state || !city || !address) {
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

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.path);

      image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    const shop = await Shop.create({
      name,
      state,
      city,
      address,
      owner: req.userId,
      ...(image && { image }), //onlyif the image exist
    });

    await shop.populate("owner");

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
    }).lean();

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









