import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectDetails from "./pages/ProjectDetails";
import NotFound from "./pages/NotFound";
import Settings from "./components/Settings";
import DeveloperProfile from "./pages/DeveloperProfile";
import AdminProfile from "./pages/AdminProfile";
import CreateProject from "./pages/CreateProject";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/developer-profile" element={<DeveloperProfile />} /> 
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/view-projects" element={<ProjectDetails />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/settings" element={<Settings/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
