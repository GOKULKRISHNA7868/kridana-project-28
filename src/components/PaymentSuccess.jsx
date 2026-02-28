// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Your Firebase client SDK config
import { motion } from "framer-motion";

export default function PaymentSuccess() {
  const location = useLocation();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const orderId = params.get("order_id");

  useEffect(() => {
    async function fetchPayment() {
      if (!orderId) return setLoading(false);

      try {
        const docRef = doc(db, "payments", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPayment(docSnap.data());
        } else {
          console.warn("No payment found for order:", orderId);
        }
      } catch (err) {
        console.error("Error fetching payment:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPayment();
  }, [orderId]);

  if (loading)
    return <div className="text-center mt-20">Loading payment details...</div>;
  if (!payment)
    return (
      <div className="text-center mt-20 text-red-500">
        Payment record not found.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg text-center"
    >
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Payment Successful ✅
      </h1>

      <div className="text-left space-y-2">
        <p>
          <strong>Order ID:</strong> {payment.order_id}
        </p>
        <p>
          <strong>Transaction ID:</strong> {payment.tracking_id}
        </p>
        <p>
          <strong>Bank Ref No:</strong> {payment.bank_ref_no}
        </p>
        <p>
          <strong>Amount:</strong> ₹{payment.amount}
        </p>
        <p>
          <strong>Currency:</strong> {payment.currency}
        </p>
        <p>
          <strong>Status:</strong> {payment.payment_status}
        </p>
        <p>
          <strong>Name:</strong> {payment.billing_name}
        </p>
        <p>
          <strong>Email:</strong> {payment.billing_email}
        </p>
        <p>
          <strong>Phone:</strong> {payment.billing_tel}
        </p>
        <p>
          <strong>Paid At:</strong>{" "}
          {payment.createdAt?.toDate().toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Go to Home
      </button>
    </motion.div>
  );
}
