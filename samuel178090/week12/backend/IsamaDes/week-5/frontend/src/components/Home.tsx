import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => navigate("/register");

  return (
    <div className="min-h-screen from-green-50 to-white flex flex-col items-center justify-center px-6 text-center">
      {/* Hero Section */}
    
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-green-600">PulseTracker</span> 🌿
        </h1>

        <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
          Your personalized path to a healthier lifestyle.  
          Get curated meal plans, expert advice, and wellness tracking — all in one place.
        </p>

        <button
          onClick={handleNavigate}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300 mx-auto"
        >
          Get Started
          <ArrowRight size={20} />
        </button>
     

   
    
    </div>
  );
};

export default Home;