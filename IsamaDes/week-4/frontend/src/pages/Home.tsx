import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Welcome to DevConnect</h1>
      <p className="text-gray-500 mb-8">Your Ideas are valid.</p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="px-6 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
