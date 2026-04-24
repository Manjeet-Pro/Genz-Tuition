import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { 
  Users, 
  IndianRupee, 
  Clock, 
  TrendingUp, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl"></div>)}
      </div>
      <div className="h-80 bg-slate-200 rounded-3xl"></div>
    </div>;
  }

  const statCards = [
    { title: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Fees Collected', value: `₹${stats?.feesCollected || 0}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Pending Fees', value: `₹${stats?.pendingFees || 0}`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Attendance Today', value: `${stats?.presentToday || 0}/${stats?.totalToday || 0}`, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
        <p className="text-slate-500">Welcome to your dashboard. Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2 bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary-600" />
              Monthly Revenue
            </h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 outline-none text-slate-600 font-medium">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.chartData || []}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="bg-white p-4 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 font-sans">Quick Links</h3>
          <div className="space-y-4">
            {[
              { label: 'Add New Student', path: '/students' },
              { label: 'Mark Attendance', path: '/attendance' },
              { label: 'Record Fee Payment', path: '/fees' },
              { label: 'Monthly Report', path: '/reports' }
            ].map((link, i) => (
              <Link key={i} to={link.path} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-primary-50 hover:text-primary-600 transition-all group">
                <span className="font-medium">{link.label}</span>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-primary-600 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
