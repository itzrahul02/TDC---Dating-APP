import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-rose-600">💕 TDC</h2>
        <p className="text-sm text-gray-500 mt-1">Matchmaker</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavItem
          label="Dashboard"
          active={isActive('/dashboard')}
          onClick={() => navigate('/dashboard')}
        />
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

function NavItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
        active ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
