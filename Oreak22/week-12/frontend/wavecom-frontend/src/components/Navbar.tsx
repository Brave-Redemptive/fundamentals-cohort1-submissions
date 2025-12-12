import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const loc = useLocation();
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="font-bold text-lg">WaveCom Notifier</div>
        </div>

        <div className="space-x-4">
          <Link
            className={`text-sm ${
              loc.pathname === "/" ? "text-indigo-600" : "text-slate-700"
            }`}
            to="/"
          >
            Dashboard
          </Link>
          <Link
            className={`text-sm ${
              loc.pathname === "/create" ? "text-indigo-600" : "text-slate-700"
            }`}
            to="/create"
          >
            Create Job
          </Link>
        </div>
      </div>
    </nav>
  );
}
