import { Outlet, Link, useLocation } from 'react-router-dom';
import { Bell, PlusCircle, LayoutDashboard } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navLinkClass = (path: string) => {
    const base = "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors";
    return isActive(path)
      ? `${base} bg-primary-100 text-primary-700 font-medium`
      : `${base} text-gray-600 hover:bg-gray-100`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Bell className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WaveCom</h1>
                <p className="text-xs text-gray-600">Notification System</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              
              <Link to="/create" className={navLinkClass('/create')}>
                <PlusCircle size={18} />
                Create Notification
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2024 WaveCom Notification System. Built by John Kolawole</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary-600">Documentation</a>
              <a href="http://localhost:15672" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                RabbitMQ Console
              </a>
              <a href="http://localhost:5000/health" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                Health Check
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;