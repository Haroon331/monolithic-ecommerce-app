import { connectDB } from "@/config/db";
import Product from "@/models/Product";
import cloudinary from "@/config/cloudinary";

export async function GET(req, context) {
  const { params } = await context; // ✅ properly await context.params
  await connectDB();

  const product = await Product.findById(params.id);
  if (!product) return new Response("Not found", { status: 404 });

  return Response.json(product);
}

export async function PUT(req, context) {
  const { params } = await context; // ✅ ensure awaited context
  await connectDB();

  const data = await req.json();
  const updated = await Product.findByIdAndUpdate(params.id, data, { new: true });

  if (!updated) return new Response("Not found", { status: 404 });

  return Response.json(updated);
}

export async function DELETE(req, context) {
  const { params } = await context; // ✅ awaited context
  await connectDB();

  const product = await Product.findById(params.id);
  if (!product) return new Response("Not found", { status: 404 });

  // ✅ Safely destroy Cloudinary images (if any)
  if (product.imagePublicIds && product.imagePublicIds.length > 0) {
    for (const id of product.imagePublicIds) {
      try {
        await cloudinary.uploader.destroy(id);
      } catch (err) {
        console.error(`Failed to delete Cloudinary image ${id}:`, err);
      }
    }
  }

  await Product.findByIdAndDelete(params.id);
  return Response.json({ message: "Product deleted successfully" });
}
