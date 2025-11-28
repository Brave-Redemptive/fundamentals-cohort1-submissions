import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import StatusPage from "./pages/StatusPage";
import TasksPage from "./pages/TaskPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4 flex gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium ${
                  isActive ? "text-primary" : "text-gray-600"
                } hover:text-primary`
              }
            >
              Status
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `font-medium ${
                  isActive ? "text-primary" : "text-gray-600"
                } hover:text-primary`
              }
            >
              Tasks
            </NavLink>
          </div>
        </nav>

        {/* Routes */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<StatusPage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
