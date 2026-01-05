import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/models/Order";
import { connectDB } from "@/config/db";

// ✅ connect to MongoDB
await connectDB();

// POST: create a new order
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, items, address, amount, paymentMethod } = body;

    if (!userId || !items || !address || !amount) {
      return NextResponse.json({ success: false, message: "Missing fields" });
    }

    const newOrder = await Order.create({
      userId,
      items,
      address,
      amount,
      paymentMethod,
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}

// GET: fetch orders - all for admin/seller, filtered by userId for customers
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let orders;
    if (userId) {
      // Fetch orders for specific user (customer)
      orders = await Order.find({ userId }).populate("items.product").sort({ createdAt: -1 });
    } else {
      // Fetch all orders (for admin/seller)
      orders = await Order.find().populate("items.product").sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching orders",
    });
  }
}

