import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const defaultSettings = {
  theme: "light",
  language: "en",
};

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);

  // Load settings from localStorage when component mounts
  useEffect(() => {
    const stored = localStorage.getItem("app_settings");
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem("app_settings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen shadow rounded-lg space-y-6">
       <nav className="bg-gradient-to-r from-purple-700 to-indigo-600 shadow-md text-white p-4 mb-8">
        <div className=" flex flex-wrap gap-6 justify-center font-medium text-sm sm:text-base">
          <Link to="/developer-profile" className="hover:text-gray-200 p-1 transition-colors">
            Profile
          </Link>
          <Link to="/create-project" className="hover:text-gray-200 p-1 transition-colors">
            Create Project
          </Link>
          <Link to="/view-projects" className="hover:text-gray-200 p-1 transition-colors">
            View Projects
          </Link>
          <Link to="/settings" className="hover:text-gray-200 bg-purple-700 border-purple-500 rounded-md p-1 transition-colors">
            Settings
          </Link>
        </div>
      </nav>
      <div className="p-8 w-1/2">
      <h2 className=" text-2xl font-semibold text-gray-800">App Settings</h2>
      <div className="">
        <label className="block text-gray-700 font-medium mb-2">
          Theme
        </label>
        <select
          value={settings.theme}
          onChange={(e) => handleChange("theme", e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="light">🌞 Light</option>
          <option value="dark">🌙 Dark</option>
        </select>
      </div>

   
   
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Language
        </label>
        <select
          value={settings.language}
          onChange={(e) => handleChange("language", e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>

      

      <button
        onClick={() => alert("Settings saved!")}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </div>
    </div>
  );
}
