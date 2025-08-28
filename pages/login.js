// pages/login.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
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
      await signInWithEmailAndPassword(auth, email, password);
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
        <h1 className="text-2xl font-semibold mb-1 text-center">Welcome to AYP</h1>
        <p className="text-center text-gray-600 mb-6">Log in to continue</p>
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email"
            value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password"
            value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button disabled={loading} className="w-full rounded bg-black text-white py-2">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          No account? <Link className="text-blue-600" href="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
