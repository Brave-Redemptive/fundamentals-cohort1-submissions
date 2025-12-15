import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import UserList from "./pages/UserList";
import CreateUser from "./pages/CreateUser";

export default function App() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "px-3 py-2 rounded-md text-sm font-medium " +
    (isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100");

  return (
    <BrowserRouter>
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-lg font-semibold text-gray-900">SyncForge</span>
              </div>
              <nav className="hidden sm:flex items-center space-x-1" aria-label="Primary">
                <NavLink to="/" className={linkClass} end>
                  Users
                </NavLink>
                <NavLink to="/create" className={linkClass}>
                  Create User
                </NavLink>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <input
                  aria-label="Search users"
                  placeholder="Search users..."
                  className="px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <button
                onClick={() => setOpen((v) => !v)}
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
                aria-expanded={open}
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {open ? (
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="sm:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 max-w-4xl mx-auto">
              <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
                Users
              </NavLink>
              <NavLink to="/create" className={linkClass} onClick={() => setOpen(false)}>
                Create User
              </NavLink>
              <div className="pt-2">
                <input
                  aria-label="Search users"
                  placeholder="Search users..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/create" element={<CreateUser />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
