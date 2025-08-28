"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../src/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const transRef = collection(db, "users", user.uid, "transactions");
        const querySnapshot = await getDocs(transRef);
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setTransactions(list);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Amount (₦)</th>
              <th className="p-3">Coins</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-gray-700">
                <td className="p-3">{new Date(t.date).toLocaleString()}</td>
                <td className="p-3">{t.amount / 100}</td>
                <td className="p-3">{t.coins}</td>
                <td
                  className={`p-3 ${
                    t.status === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {t.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 bg-yellow-500 px-6 py-2 rounded hover:bg-yellow-600"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
