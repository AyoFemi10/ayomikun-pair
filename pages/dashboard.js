import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Get user coins
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setCoins(userSnap.data().coins || 0);
        } else {
          await setDoc(userRef, { coins: 0, email: currentUser.email });
          setCoins(0);
        }

        // Load transactions
        const txRef = collection(db, "users", currentUser.uid, "transactions");
        const q = query(txRef, orderBy("date", "desc"));
        const querySnap = await getDocs(q);
        const txs = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(txs);

      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  const handleBuyCoins = async (amount, coinsAmount) => {
    const handler = window.PaystackPop.setup({
      key: "pk_test_4c5a8e225145c5ee49073262a9f4e37a6cebcc63",
      email: user?.email || "test@email.com",
      amount: amount * 100,
      currency: "NGN",
      callback: async function(response) {
        alert(`✅ Payment successful! Reference: ${response.reference}`);

        // Update coins in Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { coins: coins + coinsAmount });
        setCoins(prev => prev + coinsAmount);

        // Save transaction history
        const txRef = collection(db, "users", user.uid, "transactions");
        await addDoc(txRef, {
          amount,
          coins: coinsAmount,
          reference: response.reference,
          date: new Date().toISOString()
        });

        // Reload history
        const q = query(txRef, orderBy("date", "desc"));
        const querySnap = await getDocs(q);
        const txs = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(txs);
      },
      onClose: function() {
        alert("❌ Transaction cancelled");
      }
    });
    handler.openIframe();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <h1 className="text-2xl">Please <a href="/login" className="text-blue-400">Login</a></h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">AYP Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg">Logout</button>
      </div>

      {/* User Info */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg flex items-center mb-8">
        <img src={user.photoURL || "/avatar.png"} alt="avatar" className="w-16 h-16 rounded-full border-2 border-blue-500 mr-4" />
        <div>
          <h2 className="text-xl font-bold">{user.displayName || "User"}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Coins Section */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Your Balance</h2>
        <p className="text-4xl font-extrabold text-yellow-400">{coins} AYP COINS</p>
      </div>

      {/* Buy Coins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-bold mb-3">50 AYP COINS</h3>
          <p className="text-gray-400 mb-4">₦1000</p>
          <button onClick={() => handleBuyCoins(1000, 50)} className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-medium transition">Buy Now</button>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-bold mb-3">100 AYP COINS</h3>
          <p className="text-gray-400 mb-4">₦2000</p>
          <button onClick={() => handleBuyCoins(2000, 100)} className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-medium transition">Buy Now</button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-400">No transactions yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Reference</th>
                <th className="py-2 px-3">Amount (₦)</th>
                <th className="py-2 px-3">Coins</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id} className="border-b border-gray-800">
                  <td className="py-2 px-3">{new Date(tx.date).toLocaleString()}</td>
                  <td className="py-2 px-3">{tx.reference}</td>
                  <td className="py-2 px-3">{tx.amount}</td>
                  <td className="py-2 px-3 text-yellow-400 font-bold">{tx.coins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
