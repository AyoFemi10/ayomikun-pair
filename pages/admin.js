"use client";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [coinAmount, setCoinAmount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      // ✅ Restrict access only to your admin email
      if (user.email !== "emmanuelkelebe@gmail.com") {
        alert("Access Denied: Admins only!");
        router.push("/dashboard");
        return;
      }

      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const userList = [];
        querySnapshot.forEach((docSnap) => {
          userList.push({ id: docSnap.id, ...docSnap.data() });
        });
        setUsers(userList);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // 🔹 Update user coins
  const updateUserCoins = async (uid, coins) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { coins });
      alert("User coins updated!");
      setEditingUser(null);
      setCoinAmount(0);
    } catch (err) {
      console.error(err);
      alert("Error updating coins");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <table className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700 text-left">
            <th className="p-3">User ID</th>
            <th className="p-3">Email</th>
            <th className="p-3">Coins</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-gray-700">
              <td className="p-3">{u.id}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3 text-yellow-400">{u.coins || 0}</td>
              <td className="p-3">
                {editingUser === u.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={coinAmount}
                      onChange={(e) => setCoinAmount(parseInt(e.target.value))}
                      className="p-1 text-black rounded w-24"
                    />
                    <button
                      onClick={() => updateUserCoins(u.id, coinAmount)}
                      className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingUser(u.id)}
                    className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit Coins
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 bg-yellow-500 px-6 py-2 rounded hover:bg-yellow-600"
      >
        Back to User Dashboard
      </button>
    </div>
  );
}
