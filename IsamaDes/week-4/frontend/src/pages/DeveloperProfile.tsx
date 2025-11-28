import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDeveloperProfile } from "../services/DeveloperService";
import type{User} from "../types/User"

const DeveloperProfile = () => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
   const fetchUser = async () => {
    setLoading(true)
      try {
        console.log("Fetching developer profile...");
        const data = await getDeveloperProfile();
        console.log("Response received:", data);
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading)
    return "loading";
 
  return (
    <div className="min-h-screen">
     
         <nav className="bg-gradient-to-r from-purple-700 to-indigo-600 shadow-md text-white p-4 mb-8">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-center font-medium text-sm sm:text-base">
          <Link to="/developer-profile" className="hover:text-gray-200 bg-purple-700 border-purple-500 rounded-md p-1 transition-colors">
            Profile
          </Link>
          <Link to="/create-project" className="hover:text-gray-200 p-1 transition-colors">
            Create Project
          </Link>
          <Link to="/view-projects" className="hover:text-gray-200 p-1 transition-colors">
            View Projects
          </Link>
          <Link to="/settings" className="hover:text-gray-200 p-1 transition-colors">
            Settings
          </Link>
        </div>
      </nav>
    <div
      className=" mx-auto bg-white shadow-lg rounded-2xl p-9 border border-gray-100"
    > 
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h2 className="text-3xl font-bold">{`${user?.name}'s Profile`}</h2>
        <span className="text-sm text-gray-500">
          Member since {new Date(user?.createdAt ?? "").toLocaleDateString()}
        </span>
      </div>

  <div className="flex justify-between items-start">
  {/* Profile Details */}
  <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl shadow-md text-gray-700 w-full max-w-md">
    <div>
      <p className="font-semibold text-gray-600">Full Name:</p>
      <p className="text-lg">{user?.name}</p>
    </div>

    <div>
      <p className="font-semibold text-gray-600">Email:</p>
      <p className="text-lg">{user?.email}</p>
    </div>

    <div className="flex gap-3">
      <p className="font-semibold text-gray-600">Role:</p>
      <p className="text-md capitalize">{user?.role}</p>
    </div>

    <div className="flex gap-3">
      <p className="font-semibold text-gray-600">Age:</p>
      <p className="text-md">{user?.age ?? "Not provided"}</p>
    </div>

  </div>

   {/* Edit Button */}
    <button
    className="cursor-pointer px-5 py-2.5 bg-green-600 text-white font-medium rounded-full shadow-md 
               hover:bg-green-700 hover:shadow-lg transition-all duration-200 ease-in-out 
               focus:ring-2 focus:ring-green-400 focus:outline-none self-start"
    >
    Edit Profile
   </button>
   </div>    
    </div>
    </div>
  );
};

export default DeveloperProfile;
