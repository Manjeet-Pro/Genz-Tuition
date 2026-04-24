import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';

const MainLayout = () => {
  const { admin, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative print:h-auto print:overflow-visible print:bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-10 print:hidden">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-primary-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-slate-800 hidden md:block">
              Tuition Management System
            </h2>
            <h2 className="text-lg font-bold text-slate-800 md:hidden">
              GenZ <span className="text-primary-600">Tuition</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <User size={18} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{admin?.name}</span>
            </div>
            
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 print:p-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
