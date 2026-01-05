import { connectDB } from "@/config/db";
import Product from "@/models/Product";
import cloudinary from "@/config/cloudinary";

export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return Response.json(products);
}

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const offerPrice = parseFloat(formData.get("offerPrice") || 0);
    const category = formData.get("category");
    const brand = formData.get("brand");
    const color = formData.get("color");
    const stock = parseInt(formData.get("stock") || "0", 10);

    // Handle multiple image uploads
    const images = formData.getAll("files");
    const imageUrls = [];
    const imagePublicIds = [];

    for (const file of images) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      const upload = await cloudinary.uploader.upload(base64, {
        folder: "products",
      });
      imageUrls.push(upload.secure_url);
      imagePublicIds.push(upload.public_id);
    }

    const product = new Product({
      name,
      description,
      price,
      offerPrice,
      category,
      brand,
      color,
      stock,
      image: imageUrls,
      imagePublicIds,
    });

    await product.save();
    return Response.json({ message: "Product created", product });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error creating product" }, { status: 500 });
  }
}
