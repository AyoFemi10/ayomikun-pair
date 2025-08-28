// pages/api/paystack-verify.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }
  const { reference, uid } = req.body || {};
  if (!reference || !uid) {
    return res.status(400).json({ status: "error", message: "Missing reference or uid" });
  }
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ status: "error", message: "Missing PAYSTACK_SECRET_KEY" });
    }
    const resp = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const data = await resp.json();
    if (!data.status || data.data.status !== "success") {
      return res.status(400).json({ status: "error", message: "Verification failed" });
    }
    const amountKobo = data.data.amount;
    let coinsAdded = 0;
    if (amountKobo >= 200000) coinsAdded = 100;
    else if (amountKobo >= 100000) coinsAdded = 50;
    if (coinsAdded === 0) {
      return res.status(400).json({ status: "error", message: "Unsupported amount" });
    }
    const { getFirestore, doc, getDoc, updateDoc, setDoc, addDoc, collection, serverTimestamp } = await import("firebase/firestore");
    const { getApps, initializeApp } = await import("firebase/app");
    const firebaseConfig = {
      apiKey: "AIzaSyCHbOU0rn4g1_o2uVY8QYa93YazTtTgj3g",
      authDomain: "ayomikun-pair.firebaseapp.com",
      projectId: "ayomikun-pair",
      storageBucket: "ayomikun-pair.firebasestorage.app",
      messagingSenderId: "906992025885",
      appId: "1:906992025885:web:45af058ab33ef0359961f4",
      measurementId: "G-CYLYW217V8"
    };
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    const current = snap.exists() ? (snap.data().coins || 0) : 0;
    const newBalance = current + coinsAdded;
    if (!snap.exists()) {
      await setDoc(userRef, { coins: newBalance, email: "", createdAt: Date.now() });
    } else {
      await updateDoc(userRef, { coins: newBalance });
    }
    await addDoc(collection(db, "transactions"), {
      uid,
      type: "topup",
      coins: coinsAdded,
      balanceAfter: newBalance,
      amountKobo,
      reference,
      createdAt: serverTimestamp()
    });
    return res.status(200).json({ status: "ok", coinsAdded, newBalance });
  } catch (e) {
    return res.status(500).json({ status: "error", message: e.message });
  }
}
