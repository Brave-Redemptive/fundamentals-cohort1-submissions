import { useState } from "react";
import { createProject } from "../services/DeveloperService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function CreateProject() {
    const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setLoading(true);
    try {
      const response = await createProject(title, description);
      console.log("create response", response)
      setTitle("");
      setDescription("");
    //   onCreated(); 
    navigate("/view-projects")

    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  ">
    
         <nav className="bg-gradient-to-r from-purple-700 to-indigo-600 shadow-md text-white p-4 mb-8">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-center font-medium text-sm sm:text-base">
          <Link to="/developer-profile" className="hover:text-gray-200 transition-colors">
            Profile
          </Link>
          <Link to="/create-project" className="hover:text-gray-200 bg-purple-700 border-purple-500 rounded-md p-1 transition-colors">
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
      <div className="flex items-center justify-center">
    <form onSubmit={handleSubmit} className="mb-6 w-1/2 bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-3">Create New Project</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project Title"
        className="w-full border px-3 py-2 mb-3 rounded-md"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project Description"
        className="w-full border px-3 py-2 mb-3 rounded-md"
      ></textarea>
      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 text-white px-5 py-2 rounded-md hover:bg-purple-700 transition"
      >
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
    </div></div>
  );
}

export default CreateProject;
