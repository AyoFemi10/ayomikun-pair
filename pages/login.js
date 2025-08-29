import { useState } from "react";
import { auth, googleProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from "./firebase";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("✅ Logged in with Google!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Phone Number Login
  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible"
    });
  };

  const handleSendOtp = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      alert("📲 OTP sent to your phone!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await confirmationResult.confirm(otp);
      alert("✅ Phone login successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-extrabold text-center mb-6">Welcome Back 👋</h1>
        <p className="text-gray-400 text-center mb-8">Login to continue using <span className="font-bold text-blue-400">AYP</span></p>

        {/* Google Login */}
        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg mb-4 font-medium transition">
          Continue with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Phone Login */}
        <input 
          type="text" 
          placeholder="+1234567890" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSendOtp} 
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg mb-3 font-medium transition">
          Send OTP
        </button>

        <input 
          type="text" 
          placeholder="Enter OTP" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button 
          onClick={handleVerifyOtp} 
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-medium transition">
          Verify OTP
        </button>

        <p className="text-center text-gray-400 mt-6">
          Don’t have an account? <a href="/signup" className="text-blue-400 hover:underline">Sign Up</a>
        </p>

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
