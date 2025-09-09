// -------------------------
// This page lets new users create an account
// -------------------------

// Import React's useState function to store and update form input values
'use client'

import { useState } from "react";

// Import Firebase's "create account" function
import { createUserWithEmailAndPassword } from "firebase/auth";

// Import the `auth` service we made in firebase.js
import { auth } from "@/firebase";

// Import the tool that lets us change pages in Next.js
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter(); // lets us redirect to other pages

  // Create variables to store what the user types in the form
  const [email, setEmail] = useState("");       // user's email
  const [password, setPassword] = useState(""); // user's password
  const [message, setMessage] = useState("");   // message for success or errors

  // This runs when the user clicks "Sign Up"
  const handleRegister = async (e) => {
    e.preventDefault(); // stop page from refreshing
    try {
      // Create the account in Firebase
      await createUserWithEmailAndPassword(auth, email, password);

      // Show success message
      setMessage("✅ Registration successful!");

      // Redirect user to the protected page after signing up
      router.push("/chat");
    } catch (err) {
      // If there's an error, show the error message
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#001935] to-[#001245] font-sans">
      <form
        onSubmit={handleRegister}
        className="flex flex-col items-center w-96"
      >
      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 text-white drop-shadow-md">
        Register
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
        Sign Up
      </button>


      {/* Message box */}
      {message && (
        <p className="mt-4 text-center text-white drop-shadow-md">{message}</p>
      )}
    </form>
  </div>
  );
}