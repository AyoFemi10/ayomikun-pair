"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../src/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import axios from "axios";

export default function Dashboard() {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔹 Get user’s coin balance
  useEffect(() => {
    const fetchCoins = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setCoins(snap.data().coins || 0);
      }
      setLoading(false);
    };
    fetchCoins();
  }, []);

  // 🔹 Start Paystack payment
  const handlePaystack = async (amount, coinsToAdd) => {
    const user = auth.currentUser;
    if (!user) return alert("Please log in first");

    try {
      const { data } = await axios.post("/api/paystack-verify", {
        email: user.email,
        amount,
        coinsToAdd,
        uid: user.uid,
      });

      window.location.href = data.authorization_url;
    } catch (err) {
      alert("Payment failed: " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to AYP Coins</h1>

      {/* Coin Balance */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <p className="text-lg">Your Balance:</p>
        <h2 className="text-4xl font-bold text-yellow-400">{coins} AYP</h2>
      </div>

      {/* Buy Coins */}
      <div className="space-y-4 w-full max-w-sm">
        <button
          onClick={() => handlePaystack(1000, 50)}
          className="w-full bg-yellow-500 py-3 rounded hover:bg-yellow-600"
        >
          Buy 50 AYP Coins – ₦1000
        </button>
        <button
          onClick={() => handlePaystack(2000, 100)}
          className="w-full bg-yellow-600 py-3 rounded hover:bg-yellow-700"
        >
          Buy 100 AYP Coins – ₦2000
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          auth.signOut();
          router.push("/login");
        }}
        className="mt-8 bg-red-500 px-6 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
