"use client";
import { useState } from "react";
import { auth, googleProvider, RecaptchaVerifier, signInWithPhoneNumber } from "../src/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmObj, setConfirmObj] = useState(null);
  const router = useRouter();

  // 🔹 Email Login
  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Phone OTP - Step 1: Send
  const handleSendOtp = async () => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmObj(confirmation);
      alert("OTP sent!");
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Phone OTP - Step 2: Verify
  const handleVerifyOtp = async () => {
    try {
      await confirmObj.confirm(otp);
      router.push("/dashboard");
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {/* Email Login */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 text-black rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 text-black rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleEmailLogin}
          className="w-full bg-yellow-500 py-2 rounded hover:bg-yellow-600 mb-3"
        >
          Login
        </button>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 py-2 rounded hover:bg-red-600 mb-3 flex items-center justify-center gap-2"
        >
          <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Phone Number Login */}
        <input
          type="tel"
          placeholder="+2348100000000"
          className="w-full p-2 mb-3 text-black rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          onClick={handleSendOtp}
          className="w-full bg-blue-500 py-2 rounded hover:bg-blue-600 mb-3"
        >
          Send OTP
        </button>
        {confirmObj && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 mb-3 text-black rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 py-2 rounded hover:bg-green-600"
            >
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>

        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="text-yellow-400 underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
