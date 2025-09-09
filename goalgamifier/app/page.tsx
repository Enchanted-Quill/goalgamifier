import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#001935] to-[#001245] text-white font-sans">
      {/* Title */}
      <h1
        className="text-6xl font-extrabold mb-4"
        style={{
          fontFamily: "Inter, sans-serif",
          background: "linear-gradient(90deg, #00C853, #00E5FF, #9C27B0)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        GOAL GAMIFIER
      </h1>

      {/* Subtitle */}
      <p className="text-xl mb-12 font-medium drop-shadow-md">
        Make your life a game.
      </p>

      {/* Buttons */}
      <nav className="space-y-6 w-48">
        <Link
          href="/register"
          className="block w-full py-3 rounded-2xl text-center text-lg font-semibold bg-gradient-to-b from-teal-400 to-teal-700 shadow-lg hover:scale-105 transition-transform"
        >
          Sign Up
        </Link>

        <Link
          href="/login"
          className="block w-full py-3 rounded-2xl text-center text-lg font-semibold bg-gradient-to-b from-teal-400 to-teal-700 shadow-lg hover:scale-105 transition-transform"
        >
          Log In
        </Link>
      </nav>
    </div>
  );
}
