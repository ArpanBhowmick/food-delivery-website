import type { Response } from "express";
import type { AuthRequest } from "../types/types.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../util/cloudinaryUploadAndDel.js";
import { Shop } from "../models/shop.modal.js";
import { Item } from "../models/item.modal.js";

export const addItem = async (req: AuthRequest, res: Response) => {
  try {
    const { shopId } = req.params;
    const { name, description, category, price, foodType } = req.body;

    if (!name || !description || !category || !price || !foodType) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // verify ownership of the shop
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized in item creation as user id is not the owner",
      });
    }

    // upload image to cloudinary if there is

    let image;
    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.path);

      image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    // crete item

    const item = await Item.create({
      name,
      description,
      category,
      price,
      foodType,
      ...(image && { image }),
      shop: shop._id,
    });

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      item,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Item creation failed",
    });
  }
};

// edit/update item
export const editItem = async (req: AuthRequest, res: Response) => {
  try {
    const { shopId, itemId } = req.params;

    const { name, description, category, price, foodType } = req.body;

    // find shop
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // verify ownership of the shop
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update items in this shop",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Verify item belongs to this shop or not

    if (item.shop.toString() !== shop._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Item does not belong to this shop",
      });
    }

    // update the provided fields

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (category !== undefined) item.category = category;
    if (price !== undefined) item.price = price;
    if (foodType !== undefined) item.foodType = foodType;

    // upload image to cloudinary if there is
    if (req.file) {
      //  upload new image
      const uploadedImage = await uploadToCloudinary(req.file.path);

      // del old image if exists
      if (item.image) {
        await deleteFromCloudinary(item.image.publicId);
      }

      item.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item,
    });
    
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update item",
    });
  }
};



// get all items by shop 
export const getItemsByShop = async (req: AuthRequest, res: Response) => {
  try {
    const { shopId } = req.params;

    // Find the shop
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Verify ownership
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this shop's items",
      });
    }

    // Find all items of this shop
    const items = await Item.find({ shop: shop._id });

    return res.status(200).json({
      success: true,
      message: "Items found",
      items,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch items",
    });
  }
};


// delete item 
export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    const { shopId, itemId } = req.params;

    // Find shop
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Verify ownership of the shop
    if (shop.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete items from this shop",
      });
    }

    // Find item
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Verify that this item belongs to this shop
    if (item.shop.toString() !== shop._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Item does not belong to this shop",
      });
    }

    // Delete image from Cloudinary if it exists
    if (item.image?.publicId) {
      await deleteFromCloudinary(item.image.publicId);
    }

    // Delete item from database
    await Item.findByIdAndDelete(itemId);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete item",
    });
  }
};

