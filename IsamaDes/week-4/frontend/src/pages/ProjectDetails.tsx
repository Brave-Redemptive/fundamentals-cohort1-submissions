import { useState, useEffect } from "react";
import { getProjects, commentOnProject } from "../services/DeveloperService";
import { Link } from "react-router-dom";

function ProjectDetails() {
  const [projects, setProjects] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [activeProject, setActiveProject] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        console.log("create response", response)
        setProjects(response);
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleComment = async (projectId: string) => {
    if (!commentText.trim()) return;
    try {
      await commentOnProject(projectId, commentText);
      setCommentText("");
      const updated = await getProjects();
      setProjects(updated);
    } catch (error) {
      console.error("Failed to comment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-700 to-indigo-600 shadow-md text-white p-4 mb-8">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-center font-medium text-sm sm:text-base">
          <Link to="/developer-profile" className="hover:text-gray-200  p-1 transition-colors">
            Profile
          </Link>
          <Link to="/create-project" className="hover:text-gray-200 p-1 transition-colors">
            Create Project
          </Link>
          <Link to="/view-projects" className="hover:text-gray-200 bg-purple-700 border-purple-500 rounded-md p-1 transition-colors">
            View Projects
          </Link>
          <Link to="/settings" className="hover:text-gray-200 p-1 transition-colors">
            Settings
          </Link>
        </div>
      </nav>

      {/* Projects */}
      <main className="max-w-4xl mx-auto px-6 pb-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          🌱 All Projects
        </h1>

        {projects.length === 0 && (
          <p className="text-center text-gray-500">No projects available yet.</p>
        )}

        <div className="space-y-8">
          {projects.map((project) => {
             return(
            <div
              key={project._id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                {project.title}
                  <span className="text-sm text-gray-500 ml-2">
                    👤 by {project.createdBy?.name || "Unknown"}
                  </span>

              </h2>
              <p className="text-gray-600 mb-4">{project.description}</p>

              {/* Comments */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-3">
                  💬 Comments
                </h3>
                {project.comments?.length ? (
                  <ul className="space-y-2">
                    {project.comments.map((comment: any) => (
                      <li
                        key={comment._id}
                        className="p-2 rounded-md bg-white border border-gray-100 text-sm shadow-sm"
                      >
                        <strong className="text-purple-700">
                          {comment.user?.name || "Unknown User"}:
                        </strong>{" "}
                        <span className="text-gray-700">{comment.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No comments yet.</p>
                )}
              </div>

              {/* Comment Box */}
              {activeProject === project._id ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleComment(project._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                    >
                      Post
                    </button>
                    <button
                      onClick={() => setActiveProject(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setActiveProject(project._id)}
                  className="text-purple-600 text-sm font-medium hover:text-purple-800 transition-colors"
                >
                  ➕ Add Comment
                </button>
              )}
            </div>)
})}
        </div>
      </main>
    </div>
  );
}

export default ProjectDetails;
