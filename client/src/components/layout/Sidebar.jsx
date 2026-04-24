import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  CalendarCheck, 
  ClipboardList, 
  Settings,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { title: 'Dashboard', path: '/', icon: BarChart3 },
    { title: 'Students', path: '/students', icon: Users },
    { title: 'Fees', path: '/fees', icon: CreditCard },
    { title: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { title: 'Reports', path: '/reports', icon: ClipboardList },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-y-auto transform transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 print:hidden
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-primary-200">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">GenZ <span className="text-primary-600 italic">Tuition</span></span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-primary-50 text-primary-600 font-semibold shadow-sm shadow-primary-50' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
            `}
          >
            <item.icon size={20} />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold shrink-0">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-800 truncate">Admin Dashboard</h4>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
