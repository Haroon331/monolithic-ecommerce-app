import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  offerPrice: Number,
  category: String,
  brand: String,
  color: String,
  stock: { type: Number, default: 0 },
  image: [String],          // array of image URLs
  imagePublicIds: [String], // for deleting Cloudinary images later
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
