import { useState } from "react";
import { auth, googleProvider, signInWithPopup } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Account created successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("✅ Signed up with Google!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-center mb-6">Create Account 🎉</h1>
        <p className="text-gray-400 text-center mb-8">Join <span className="font-bold text-blue-400">AYP</span> to start earning coins</p>

        {/* Google Signup */}
        <button 
          onClick={handleGoogleSignup} 
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg mb-4 font-medium transition">
          Sign up with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Email + Password */}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSignup} 
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-medium transition">
          Sign Up
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
