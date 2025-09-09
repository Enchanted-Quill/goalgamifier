// -------------------------
// This page lets existing users log into their account
// -------------------------
'use client'

import { useState } from "react"; // for storing what the user types
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase login function
import { auth } from "@/firebase"; // our Firebase Auth instance
import { useRouter } from "next/navigation"; // for redirecting
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  // Store form input
  const [email, setEmail] = useState("");       
  const [password, setPassword] = useState(""); 
  const [message, setMessage] = useState("");   

  // Runs when user clicks "Login"
  const handleLogin = async (e) => {
    e.preventDefault(); // stop refresh
    try {
      // Try to log the user in
      await signInWithEmailAndPassword(auth, email, password);

      // Show success message
      setMessage("✅ Login successful!");

      // Redirect to protected page
      router.push("/chat");
    } catch (err) {
      // Show error if login fails
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#001935] to-[#001245] font-sans">
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center w-96"
      >
      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-md">
        Log In
      </h1>


      {/* Email input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 mb-4 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-300 placeholder-gray-500 text-gray-800 shadow-inner focus:outline-none"
      />


      {/* Password input */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 mb-6 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-300 placeholder-gray-500 text-gray-800 shadow-inner focus:outline-none"
      />


      {/* Sign Up button */}
      <button
        type="submit"
        className="w-40 py-3 rounded-2xl text-lg font-semibold bg-gradient-to-b from-teal-400 to-teal-700 text-white shadow-lg hover:scale-105 transition-transform"
      >
        Log In
      </button>


      {/* Message box */}
      {message && (
        <p className="mt-4 text-center text-white drop-shadow-md">{message}</p>
      )}
    </form>
  </div>
  );
}