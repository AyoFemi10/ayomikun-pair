// pages/signup.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        coins: 0,
        createdAt: Date.now()
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-1 text-center">Create account</h1>
        <p className="text-center text-gray-600 mb-6">Join AYP to get coins</p>
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email"
            value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password (min 6)"
            value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button disabled={loading} className="w-full rounded bg-black text-white py-2">
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Already have an account? <Link className="text-blue-600" href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
