import mongoose, { mongo } from "mongoose";

//creating a userschema
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    cartItems: { type: Object, default: {} },
  },
  { minimize: false }
);

//creating a user model 
const User =mongoose.models.user || mongoose.model('user',userSchema)

export default User