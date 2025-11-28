
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { Eye, EyeOff } from 'lucide-react';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser({ email, password });
      console.log(response)
      const userRole =  response.data.role;
      const userName =  response.data.name;
      const token =  response.data.token
       
       localStorage.setItem("user_name", userName);
       localStorage.setItem("user", JSON.stringify(response.data));
       localStorage.setItem("role", userRole);
       localStorage.setItem("access_token", token);

      if (userRole === "admin") navigate("/admin");
      else if (userRole === "nutritionist") navigate("/nutritionist");
      else if (userRole === "client") navigate("/client");
      else navigate("/login");

    } catch (err: any) {
       if (err.response) {
      // Server responded with a status code outside 2xx
      console.error("Server error response:", {
        data: err.response.data,
        status: err.response.status,
        headers: err.response.headers,
      });
      setError(`Server error: ${err.response.data?.message || err.response.status}`);
    } else if (err.request) {
      // Request was made but no response received
      console.error("No response received:", err.request);
      setError("No response from server. Please check your connection.");
    } else {
      // Something else happened
      console.error("Login error:", err.message);
      setError(err.message || "Login failed");
    }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section – Image */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto">
        {/* <img
          src={healthyfoodimg}
          alt="Healthy food"
          className="absolute inset-0 w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-8">
          <h1 className="text-3xl font-bold mb-2">PulseTracker</h1>
          <p className="text-sm md:text-base opacity-90">
            Nourish your body, live healthy.
          </p>
        </div>
      </div>

      {/* Right Section – Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-10  shadow-inner">
        <div className="max-w-sm w-full mx-auto">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Welcome Back 👋</h2>
          <p className="text-gray-500 mb-8">
            Login to your account to continue your healthy journey.
          </p>

          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="relative">
           <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>

            <div className="flex-1">
              <input
                type={visiblePassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="button" 
            onClick={() => setVisiblePassword((previous) => !previous)} 
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700">
            {visiblePassword ? <EyeOff size={18} /> : <Eye size={18}/>}
            </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-green-400"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="/register" className="text-green-600 font-medium hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;