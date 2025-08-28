import axios from "axios";
import { db } from "../../src/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, amount, coinsToAdd, uid } = req.body;

    try {
      // 🔹 Initialize Paystack transaction
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount: amount * 100, // kobo
          metadata: { coinsToAdd, uid },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(200).json(response.data.data);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  } else if (req.method === "GET") {
    const { reference } = req.query;

    try {
      // 🔹 Verify transaction
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      const { status, metadata } = response.data.data;

      if (status === "success") {
        const userRef = doc(db, "users", metadata.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const oldCoins = snap.data().coins || 0;
          await updateDoc(userRef, {
            coins: oldCoins + metadata.coinsToAdd,
          });
        }
      }

      return res.status(200).json(response.data.data);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
