// pages/history.js
import { useAuthGuard } from "../utils/authGuard";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function History() {
  const { user, loading } = useAuthGuard();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      const q = query(
        collection(db, "transactions"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({
        id: d.id, ...d.data(),
        createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toLocaleString() : ""
      }));
      setItems(list);
    };
    run();
  }, [user]);

  if (loading || !user) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold">Transactions</h1>
          <nav className="space-x-4 text-sm">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/history">Transactions</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Coins</th>
                <th className="text-left px-4 py-2">Balance After</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="px-4 py-2">{it.createdAt}</td>
                  <td className="px-4 py-2 capitalize">{it.type}</td>
                  <td className="px-4 py-2">{it.coins}</td>
                  <td className="px-4 py-2">{it.balanceAfter}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td className="px-4 py-6" colSpan="4">No transactions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
