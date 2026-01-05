"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AddAddress = () => {
  const router = useRouter();
  const { cartItems, products, getCartAmount, currency, setCartItems } = useAppContext();
  const { user, isSignedIn, isLoaded } = useUser();

  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
    area: "",
    city: "",
    state: "",
  });

  const [placingOrder, setPlacingOrder] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (!cartItems || Object.keys(cartItems).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!products || products.length === 0) {
      alert("Products not loaded yet. Try again.");
      return;
    }

    // 🧾 Prepare items
    const itemsArray = Object.keys(cartItems)
      .map((itemId) => {
        const product = products.find((p) => p._id.toString() === itemId.toString());
        return product ? { product, quantity: cartItems[itemId] } : null;
      })
      .filter(Boolean);

    const totalAmount = itemsArray.reduce(
      (acc, item) => acc + item.product.offerPrice * item.quantity,
      0
    );

    setPlacingOrder(true);

    try {
      // 🧩 Direct order placement (no payment)
      const orderData = {
        userId: user.id,
        items: itemsArray.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        address,
        amount: totalAmount,
        paymentMethod: "Direct",
        status: "Pending",
        date: new Date(),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Clear cart after successful order
        setCartItems({});
        alert("✅ Order placed successfully!");
        router.push("/order-placed");
      } else {
        alert("❌ Order failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-16 flex flex-col md:flex-row justify-between">
        <form onSubmit={onSubmitHandler} className="w-full max-w-md">
          <p className="text-2xl md:text-3xl text-gray-500">
            Add Shipping{" "}
            <span className="font-semibold text-orange-600">Address</span>
          </p>

          {/* Address Inputs */}
          <div className="space-y-3 mt-10">
            {[
              { key: "fullName", label: "Full name" },
              { key: "phoneNumber", label: "Phone number" },
              { key: "pincode", label: "Pin code" },
            ].map(({ key, label }) => (
              <input
                key={key}
                className="px-2 py-2.5 focus:border-orange-500 border border-gray-300 rounded outline-none w-full text-gray-600"
                placeholder={label}
                value={address[key]}
                onChange={(e) =>
                  setAddress({ ...address, [key]: e.target.value })
                }
                required
              />
            ))}

            <textarea
              className="px-2 py-2.5 focus:border-orange-500 border border-gray-300 rounded outline-none w-full text-gray-600 resize-none"
              rows={4}
              placeholder="Address (Area and Street)"
              value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
              required
            ></textarea>

            <div className="flex space-x-3">
              <input
                className="px-2 py-2.5 focus:border-orange-500 border border-gray-300 rounded outline-none w-full text-gray-600"
                placeholder="City/District/Town"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
              <input
                className="px-2 py-2.5 focus:border-orange-500 border border-gray-300 rounded outline-none w-full text-gray-600"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!cartItems || Object.keys(cartItems).length === 0 || placingOrder}
            className={`max-w-sm w-full mt-6 py-3 uppercase text-white ${
              placingOrder || !cartItems || Object.keys(cartItems).length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {placingOrder ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddAddress;
