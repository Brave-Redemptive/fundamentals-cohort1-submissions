import { useState } from "react";
import type{FormEvent} from "react";
import { registerUser,  } from "../services/authService";
import type{RegisterData} from "../services/authService"
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, } from 'lucide-react';
// import foodcool from "../assets/foodcool.jpg"

// import { toast } from "react-hot-toast";

const Register = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData((prev: any) => (
      {...prev,
        [name]: value,
      })
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await registerUser(formData);
      setSuccess(response.message);
     if(response) console.log(response)
      localStorage.setItem("access_token", response.verificationToken)
     navigate("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => navigate("/login");

  return (

      <div className=" h-screen flex md:flex-row">
      <div className="relative w-full md:w-1/2  md:h-auto">
        {/* <img src={foodcool}
          
          className="absolute inset-0 w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-8">
          <h1 className="text-3xl font-bold mb-2">PulseTracker</h1>
          <p className="text-sm md:text-base opacity-90">
            Your Health Our Priority.
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-8 py-10 shadow-inner">
        <div className="max-w-sm w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h2>

      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      
      <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
      <input
          type="text"
          name="name"
          placeholder="Enter your username"
          value={formData.name}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 mb-3 w-full rounded-md"
        />
      </div>
        
       <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 mb-3 w-full rounded-md"
        />
       </div>
        

        <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
        />

        <button type="button" onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18}/>}
        </button>
        </div>

        <select  name="role"
          value={formData.role}
          onChange={handleChange}
          className="border border-gray-300 p-2 mb-4 w-full rounded-md"
          required>
          <option value="">Select Role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
          </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded disabled:bg-blue-400"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button onClick={handleLogin} className="text-green-600 font-medium hover:underline">
              Login here
            </button>
          </p>
          </div>
    </div>
    </div>
  );
};

export default Register;