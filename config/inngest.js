import { Inngest } from "inngest";
import connectDb from "./db";
import User from "@/models/User"; // <-- make sure this import exists

// 🧠 DEBUG: Log environment setup
console.log("🟡 Inngest Config Loaded...");
console.log("➡️ INNGEST_ENV:", process.env.INNGEST_ENV);
console.log("➡️ INNGEST_SIGNING_KEY:", process.env.INNGEST_SIGNING_KEY ? "✅ Loaded" : "❌ Missing");
console.log("➡️ INNGEST_EVENT_KEY:", process.env.INNGEST_EVENT_KEY ? "✅ Loaded" : "❌ Missing");

// Initialize Inngest Client
export const inngest = new Inngest({
  id: "handicraft-next",
  name: "Handicraft E-commerce",
  env: process.env.INNGEST_ENV || "dev",
  signingKey: process.env.INNGEST_SIGNING_KEY,
  eventKey: process.env.INNGEST_EVENT_KEY,
});

console.log("✅ Inngest client initialized successfully.");

// =======================
// 1️⃣ SYNC USER CREATION
// =======================
// export const syncUserCreation = inngest.createFunction(
//   { id: "sync-user-from-clerk" },
//   { event: "clerk/user.created" },
//   async ({ event }) => {
//     console.log("🟢 Event Triggered: clerk/user.created");
//     console.log("📦 Event Data:", event.data);

//     const { id, first_name, last_name, email_addresses, image_url } = event.data;
//     const userData = {
//       _id: id,
//       email: email_addresses?.[0]?.email_address,
//       name: `${first_name || ""} ${last_name || ""}`.trim(),
//       image_Url: image_url,
//     };

//     console.log("🧩 User Data to Create:", userData);

//     await connectDb();
//     console.log("✅ MongoDB Connected for User Creation");

//     await User.create(userData);
//     console.log("🎉 User Created Successfully:", userData._id);
//   }
// );

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("🟢 Inngest Function Triggered: clerk/user.created");
    console.log("📦 Event Data:", event.data);

    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      image_Url: image_url,
    };

    await connectDb();
    console.log("🔗 MongoDB connected successfully");
    await User.create(userData);
    console.log("✅ User created successfully in DB:", userData);
  }
);

// =======================
// 2️⃣ SYNC USER UPDATION
// =======================
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    console.log("🟠 Event Triggered: clerk/user.updated");
    console.log("📦 Event Data:", event.data);

    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      email: email_addresses?.[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      image_Url: image_url,
    };

    console.log("🧩 Updated User Data:", userData);

    await connectDb();
    console.log("✅ MongoDB Connected for User Update");

    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
    console.log("🔁 User Updated Successfully:", updatedUser?._id || "User not found");
  }
);

// =======================
// 3️⃣ SYNC USER DELETION
// =======================
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("🔴 Event Triggered: clerk/user.deleted");
    console.log("📦 Event Data:", event.data);

    const { id } = event.data;

    await connectDb();
    console.log("✅ MongoDB Connected for User Deletion");

    await User.findByIdAndDelete(id);
    console.log("🗑️ User Deleted Successfully:", id);
  }
);
