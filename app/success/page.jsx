'use client';
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Success = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      console.log("Stripe Session ID:", sessionId);
      // Optionally: call backend to fulfill the order
    }
  }, [sessionId]);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p>Thank you for your order. Your payment has been received.</p>
    </div>
  );
};

export default Success;
