// pages/dashboard.js
import { useAuthGuard } from "../utils/authGuard";
import { signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const COIN_NAME = "AYP COINS";
const DEPLOY_COST = 10;

export default function Dashboard() {
  const { user, loading } = useAuthGuard();
  const [balance, setBalance] = useState(0);
  const [busy, setBusy] = useState(false);

  const fetchBalance = useCallback(async (uid) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { email: user.email, coins: 0, createdAt: Date.now() });
      setBalance(0);
    } else {
      setBalance(snap.data().coins || 0);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchBalance(user.uid);
  }, [user, fetchBalance]);

  if (loading || !user) return <div className="p-6">Loading...</div>;

  const payWithPaystack = (amountNaira) => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      alert("Missing Paystack public key. Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.");
      return;
    }
    const handler = window.PaystackPop && window.PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: amountNaira * 100,
      currency: "NGN",
      callback: function(response){
        fetch("/api/paystack-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: response.reference, uid: user.uid })
        })
        .then(res => res.json())
        .then(async (data) => {
          if (data.status === "ok") {
            await fetchBalance(user.uid);
            alert(`Payment verified. Credited ${data.coinsAdded} ${COIN_NAME}.`);
          } else {
            alert("Payment verification failed: " + data.message);
          }
        })
        .catch(() => alert("Verification error."));
      },
      onClose: function(){}
    });
    if (handler && handler.openIframe) handler.openIframe();
    else alert("Paystack script not loaded yet. Please wait and try again.");
  };

  const deployBot = async () => {
    if (balance < DEPLOY_COST) {
      alert(`Not enough ${COIN_NAME}. Need ${DEPLOY_COST}.`);
      return;
    }
    setBusy(true);
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { coins: balance - DEPLOY_COST });
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type: "deploy",
        coins: -DEPLOY_COST,
        balanceAfter: balance - DEPLOY_COST,
        createdAt: serverTimestamp()
      });
      setBalance(b => b - DEPLOY_COST);
      alert("Bot deployed (simulated).");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold">AYP Dashboard</h1>
          <nav className="space-x-4 text-sm">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/history">Transactions</Link>
            <button className="ml-4 text-red-600" onClick={() => signOut(auth)}>Logout</button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm">Balance</div>
            <div className="text-3xl font-bold">{balance} {COIN_NAME}</div>
            <div className="mt-4">
              <button onClick={() => payWithPaystack(1000)} className="mr-3 rounded bg-black text-white px-4 py-2">
                Buy 50 AYP (₦1000)
              </button>
              <button onClick={() => payWithPaystack(2000)} className="rounded bg-black text-white px-4 py-2">
                Buy 100 AYP (₦2000)
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-500 text-sm">Actions</div>
            <button disabled={busy} onClick={deployBot} className="mt-3 rounded bg-emerald-600 text-white px-4 py-2">
              {busy ? "Deploying..." : `Deploy Bot (-${DEPLOY_COST} AYP)`}
            </button>
            <p className="text-xs text-gray-500 mt-2">Deployment is simulated for now.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
