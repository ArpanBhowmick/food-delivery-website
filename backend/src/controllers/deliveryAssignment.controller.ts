import mongoose from "mongoose";
import type { Response } from "express";
import { DeliveryAssignment } from "../models/deliveryAssignment.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import type { AuthRequest } from "../types/types.js";
import generateBase62Code from "../util/generateBase62Code.js";
import generateDeliveryOtp from "../util/generateDeliveryOtp.js";
import sendEmail from "../util/sendEmail.js";
import getDeliveryOtpEmail from "../util/emailTemplates/deliveryOtpEmail.js";

// get available delivery assignments
export const getAvailableDeliveryAssignments = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    // Get the authenticated delivery boy.
    const deliveryBoyId = req.userId;

    // Require authentication.
    if (!deliveryBoyId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Confirm the user exists.
    const deliveryBoy = await User.findById(deliveryBoyId).select("role");

    // Reject missing users.
    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Allow only delivery boys to view assignments.
    if (deliveryBoy.role !== "deliveryBoy") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access delivery assignments",
      });
    }

    // Find assignments broadcast to this delivery boy.
    const assignments = await DeliveryAssignment.find({
      assignedTo: null,
      status: "available",
      broadcastedTo: {
        $elemMatch: {
          deliveryBoy: deliveryBoyId,
          status: "notified",
        },
      },
    })
      .populate("orderId", "user deliveryAddress pricing shopOrders")
      .populate("shopId", "name address location")
      .sort({ createdAt: -1 })
      .lean();

    // Format assignments for the frontend.
    const formattedAssignments = assignments.map((assignment) => {
      const order = assignment.orderId as any;
      const shop = assignment.shopId as any;

      const shopOrder = order.shopOrders?.find(
        (shopOrder: any) =>
          shopOrder._id.toString() === assignment.shopOrderId.toString(),
      );

      return {
        deliveryAssignmentId: assignment._id.toString(),
        orderId: order._id.toString(),
        shopOrderId: assignment.shopOrderId.toString(),

        shop: {
          name: shop.name,
          address: shop.address,
          location: shop.location,
        },

        deliveryAddress: order.deliveryAddress,

        items: shopOrder?.items ?? [],

        itemTotal: shopOrder?.itemTotal ?? 0,
      };
    });

    return res.status(200).json({
      success: true,
      assignments: formattedAssignments,
    });
  } catch (error) {
    // Handle unexpected errors.
    console.error("getAvailableDeliveryAssignments:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch available delivery assignments",
    });
  }
};

// accept delivery assignment
export const acceptDeliveryAssignment = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    // Read the authenticated user and assignment id.
    const deliveryBoyId = req.userId;
    const { deliveryAssignmentId } = req.params;

    // Require authentication.
    if (!deliveryBoyId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Confirm the user exists.
    const deliveryBoy = await User.findById(deliveryBoyId).select("role");

    // Reject missing users.
    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Allow only delivery boys to accept assignments.
    if (deliveryBoy.role !== "deliveryBoy") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept delivery assignments",
      });
    }

    // Validate the assignment id.
    if (
      typeof deliveryAssignmentId !== "string" ||
      !mongoose.Types.ObjectId.isValid(deliveryAssignmentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid delivery assignment id is required",
      });
    }

    // Generate acceptance details.
    const acceptedAt = new Date();

    const pickupCode = generateBase62Code();

    // Accept the assignment only if it is still available.
    const assignment = await DeliveryAssignment.findOneAndUpdate(
      {
        _id: deliveryAssignmentId,
        assignedTo: null,
        status: "available",
        broadcastedTo: {
          $elemMatch: {
            deliveryBoy: deliveryBoyId,
            status: "notified",
          },
        },
      },
      {
        $set: {
          assignedTo: deliveryBoyId,
          status: "accepted",
          acceptedAt,
          pickupCode,
          "broadcastedTo.$[deliveryBoy].status": "accepted",
        },
      },
      {
        arrayFilters: [
          {
            "deliveryBoy.deliveryBoy": deliveryBoyId,
            "deliveryBoy.status": "notified",
          },
        ],
        new: true,
      },
    )
      .populate("orderId", "user deliveryAddress pricing shopOrders")
      .populate("shopId", "name address location");

    // Prevent accepting an assignment claimed by someone else.
    if (!assignment) {
      return res.status(409).json({
        success: false,
        message: "Delivery assignment is no longer available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery assignment accepted successfully",
      assignment,
    });
  } catch (error) {
    // Handle unexpected errors.
    console.error("acceptDeliveryAssignment:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept delivery assignment",
    });
  }
};

// get active delivery assignments
export const getMyActiveDeliveries = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    // Get the authenticated delivery boy.
    const deliveryBoyId = req.userId;

    // Require authentication.
    if (!deliveryBoyId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Confirm the user exists.
    const deliveryBoy = await User.findById(deliveryBoyId).select("role");

    // Reject missing users.
    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Allow only delivery boys to view active deliveries.
    if (deliveryBoy.role !== "deliveryBoy") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access delivery assignments",
      });
    }

    // Find the delivery boy's active assignments.
    const assignments = await DeliveryAssignment.find({
      assignedTo: deliveryBoyId,
      status: {
        $in: ["accepted", "pickedUp"],
      },
    })
      .populate("orderId", "user deliveryAddress pricing shopOrders")
      .populate("shopId", "name address location")
      .sort({ acceptedAt: -1 })
      .lean();

    // Format assignments for the frontend.
    const formattedAssignments = assignments.map((assignment) => {
      const order = assignment.orderId as any;
      const shop = assignment.shopId as any;

      const shopOrder = order.shopOrders?.find(
        (shopOrder: any) =>
          shopOrder._id.toString() === assignment.shopOrderId.toString(),
      );

      return {
        deliveryAssignmentId: assignment._id.toString(),
        orderId: order._id.toString(),
        shopOrderId: assignment.shopOrderId.toString(),
         pickupCode: assignment.pickupCode,

        shop: {
          name: shop.name,
          address: shop.address,
          location: shop.location,
        },

        deliveryAddress: order.deliveryAddress,

        items: shopOrder?.items ?? [],

        itemTotal: shopOrder?.itemTotal ?? 0,

        status: assignment.status,
      };
    });

    return res.status(200).json({
      success: true,
      assignments: formattedAssignments,
    });
  } catch (error) {
    // Handle unexpected errors.
    console.error("getMyActiveDeliveries:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch active delivery assignments",
    });
  }
};

// verify code for pickup

export const verifyPickupCode = async (req: AuthRequest, res: Response) => {
  try {
    // Read the authenticated owner and submitted code.
    const ownerId = req.userId;
    const { pickupCode } = req.body as { pickupCode?: unknown };

    // Require authentication.
    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Confirm the user exists.
    const owner = await User.findById(ownerId).select("role");

    // Reject missing users.
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Allow only restaurant owners to verify pickup codes.
    if (owner.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to verify pickup codes",
      });
    }

    // Validate the submitted pickup code.
    if (typeof pickupCode !== "string" || !pickupCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Pickup code is required",
      });
    }

    // Find the accepted assignment linked to the pickup code.
    const assignment = await DeliveryAssignment.findOne({
      pickupCode: pickupCode.trim(),
      status: "accepted",
      assignedTo: {
        $ne: null,
      },
    })
      .populate("orderId", "shopOrders")
      .populate("shopId", "owner")
      .populate("assignedTo", "role")
      .lean();

    // Reject invalid or unavailable codes.
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Invalid or unavailable pickup code",
      });
    }

    // Confirm the shop reference exists.
    const shop = assignment.shopId as any;

    // Reject assignments with missing shop data.
    if (!shop || !shop.owner) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Verify that the owner manages this shop.
    if (shop.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to verify this pickup",
      });
    }

    const order = assignment.orderId as any;
    const deliveryBoy = assignment.assignedTo as any;

    // Confirm the order and delivery boy references exist.
    if (!order || !deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery assignment details not found",
      });
    }

    // Confirm the assignment belongs to a delivery boy.
    if (deliveryBoy.role !== "deliveryBoy") {
      return res.status(409).json({
        success: false,
        message: "Delivery assignment is not assigned to a delivery boy",
      });
    }

    // Confirm the assignment points to this shop's order.
    const shopOrderExists = order.shopOrders?.some(
      (shopOrder: any) =>
        shopOrder._id.toString() === assignment.shopOrderId.toString() &&
        shopOrder.shop.toString() === shop._id.toString(),
    );

    // Reject assignments with a missing shop order.
    if (!shopOrderExists) {
      return res.status(404).json({
        success: false,
        message: "Shop order not found",
      });
    }

    // Return identifiers for the existing owner order.
    return res.status(200).json({
      success: true,
      message: "Pickup code verified successfully",
      assignment: {
        deliveryAssignmentId: assignment._id.toString(),
        orderId: order._id.toString(),
        shopOrderId: assignment.shopOrderId.toString(),
        shopId: shop._id.toString(),
        deliveryBoyId: deliveryBoy._id.toString(),
        status: assignment.status,
      },
    });
  } catch (error) {
    // Handle unexpected errors.
    console.error("verifyPickupCode:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify pickup code",
    });
  }
};

// confirm pickup

export const confirmPickup = async (req: AuthRequest, res: Response) => {
  try {
    // Read the authenticated owner and assignment id.
    const ownerId = req.userId;
    const { deliveryAssignmentId } = req.params;

    // Require authentication.
    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Confirm the user exists.
    const owner = await User.findById(ownerId).select("role");

    // Reject missing users.
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Allow only restaurant owners to confirm pickup.
    if (owner.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to confirm pickup",
      });
    }

    // Validate the assignment id.
    if (
      typeof deliveryAssignmentId !== "string" ||
      !mongoose.Types.ObjectId.isValid(deliveryAssignmentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid delivery assignment id is required",
      });
    }

    // Find an assignment that is currently assigned and accepted.
    const assignment = await DeliveryAssignment.findOne({
      _id: deliveryAssignmentId,
      assignedTo: {
        $ne: null,
      },
      status: "accepted",
    }).populate("shopId", "owner");

    // Reject missing or already processed assignments.
    if (!assignment) {
      return res.status(409).json({
        success: false,
        message: "Delivery assignment is not assigned or accepted",
      });
    }

    // Confirm the shop reference exists.
    const shop = assignment.shopId as any;

    if (!shop || !shop.owner) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    // Verify that the owner manages this shop.
    if (shop.owner.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to confirm this pickup",
      });
    }

    // Mark the assignment as picked up and record the pickup time.
    assignment.status = "pickedUp";
    assignment.pickedUpAt = new Date();
    await assignment.save();

    return res.status(200).json({
      success: true,
      message: "Pickup confirmed successfully",
      assignment,
    });
  } catch (error) {
    // Handle unexpected errors.
    console.error("confirmPickup:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to confirm pickup",
    });
  }
};

// Request a delivery OTP
export const requestDeliveryOtp = async (req: AuthRequest, res: Response) => {
  try {
    // Read the authenticated delivery boy and assignment identifier.
    const deliveryBoyId = req.userId;
    const { deliveryAssignmentId } = req.params;

    // Require an authenticated user.
    if (!deliveryBoyId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Confirm that the authenticated user exists.
    const deliveryBoy = await User.findById(deliveryBoyId).select("role");

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Allow only delivery boys to request delivery OTPs.
    if (deliveryBoy.role !== "deliveryBoy") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to request delivery OTPs",
      });
    }

    // Validate the delivery assignment identifier.
    if (
      typeof deliveryAssignmentId !== "string" ||
      !mongoose.Types.ObjectId.isValid(deliveryAssignmentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid delivery assignment id is required",
      });
    }

    // Find the picked-up assignment belonging to the authenticated delivery boy.
    // Populate the order and customer so the customer's email can be used.
    const assignment = await DeliveryAssignment.findOne({
      _id: deliveryAssignmentId,
      assignedTo: deliveryBoyId,
      status: "pickedUp",
    }).populate({
      path: "orderId",
      select: "user",
      populate: {
        path: "user",
        select: "email name",
      },
    });

    // Reject assignments that are missing, unassigned, or not picked up yet.
    if (!assignment) {
      return res.status(409).json({
        success: false,
        message: "Delivery assignment is not picked up or assigned to you",
      });
    }

    // Read the customer from the populated order relationship.
    const order = assignment.orderId as any;
    const customer = order?.user as any;

    // Require a customer email before attempting to send the OTP.
    if (!customer?.email) {
      return res.status(404).json({
        success: false,
        message: "Customer email not found",
      });
    }

    // Generate and store the OTP on the delivery assignment.
    const deliveryOtp = generateDeliveryOtp();

    const deliveryOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    assignment.deliveryOtp = deliveryOtp;
    assignment.deliveryOtpExpiresAt = deliveryOtpExpiresAt;

    await assignment.save();

    // Send the OTP to the customer through the shared email utility.

    const email = getDeliveryOtpEmail(deliveryOtp);

    await sendEmail({
      to: customer.email,
      ...email,
    });

    // Confirm that the OTP request was completed successfully.
    return res.status(200).json({
      success: true,
      message: "Delivery OTP sent successfully",
    });
  } catch (error) {
    // Log unexpected errors and return a server error response.
    console.error("requestDeliveryOtp:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send delivery OTP",
    });
  }
};

// verify delivery OTP
export const verifyDeliveryOtp = async (req: AuthRequest, res: Response) => {
  try {
    // Read the authenticated delivery boy, assignment identifier, and OTP.
    const deliveryBoyId = req.userId;
    const { deliveryAssignmentId } = req.params;
    const { deliveryOtp } = req.body as { deliveryOtp?: unknown };

    // Require an authenticated user.
    if (!deliveryBoyId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    // Confirm that the authenticated user exists.
    const deliveryBoy = await User.findById(deliveryBoyId).select("role");

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Allow only delivery boys to verify delivery OTPs.
    if (deliveryBoy.role !== "deliveryBoy") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to verify delivery OTPs",
      });
    }

    // Validate the delivery assignment identifier.
    if (
      typeof deliveryAssignmentId !== "string" ||
      !mongoose.Types.ObjectId.isValid(deliveryAssignmentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid delivery assignment id is required",
      });
    }

    // Validate the submitted OTP.
    if (typeof deliveryOtp !== "string" || !deliveryOtp.trim()) {
      return res.status(400).json({
        success: false,
        message: "Delivery OTP is required",
      });
    }

    // Find the picked-up assignment belonging to the authenticated delivery boy.
    const assignment = await DeliveryAssignment.findOne({
      _id: deliveryAssignmentId,
      assignedTo: deliveryBoyId,
      status: "pickedUp",
    });

    // Reject assignments that are missing, unassigned, or not picked up yet.
    if (!assignment) {
      return res.status(409).json({
        success: false,
        message: "Delivery assignment is not picked up or assigned to you",
      });
    }

    // Ensure an OTP was requested and has not expired.
    if (
      !assignment.deliveryOtp ||
      !assignment.deliveryOtpExpiresAt ||
      assignment.deliveryOtpExpiresAt.getTime() <= Date.now()
    ) {
      assignment.deliveryOtp = undefined;
      assignment.deliveryOtpExpiresAt = undefined;

      await assignment.save();

      return res.status(409).json({
        success: false,
        message: "Delivery OTP is invalid or expired",
      });
    }

    // Compare the submitted OTP with the stored OTP.
    if (assignment.deliveryOtp !== deliveryOtp.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery OTP",
      });
    }

    // Load the linked order and confirm that the assignment points to one of
    // its shop orders before changing delivery status.
    const order = await Order.findById(assignment.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const shopOrder = order.shopOrders.find(
      (candidate) =>
        candidate._id.toString() === assignment.shopOrderId.toString(),
    );

    if (!shopOrder) {
      return res.status(404).json({
        success: false,
        message: "Shop order not found",
      });
    }

    // Mark this assignment and its shop order as delivered.
    assignment.status = "delivered";
    assignment.deliveredAt = new Date();

    assignment.deliveryOtp = undefined;
    assignment.deliveryOtpExpiresAt = undefined;

    shopOrder.orderStatus = "delivered";

    // The complete order is delivered only after every shop order is delivered.
    if (
      order.shopOrders.every(
        (candidate) => candidate.orderStatus === "delivered",
      )
    ) {
      order.orderStatus = "delivered";
    }

    await Promise.all([assignment.save(), order.save()]);

    return res.status(200).json({
      success: true,
      message: "Delivery OTP verified successfully",
      assignment: {
        deliveryAssignmentId: assignment._id.toString(),
        orderId: assignment.orderId.toString(),
        shopOrderId: assignment.shopOrderId.toString(),
        status: assignment.status,
        deliveredAt: assignment.deliveredAt,
      },
    });
  } catch (error) {
    // Handle unexpected errors.
    console.error("verifyDeliveryOtp:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify delivery OTP",
    });
  }
};
