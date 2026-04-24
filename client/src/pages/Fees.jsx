import { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Search, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Plus,
  Loader2,
  CalendarDays,
  Receipt,
  Trash2,
  Pencil
} from 'lucide-react';
import FeeModal from '../components/modals/FeeModal';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getFullYear()
  );
  
  // Generate last 12 months dynamically
  const availableMonths = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear();
  });
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/fees/report/${selectedMonth}`);
      setFees(data.records || []);
    } catch (error) {
      console.error('Error fetching fees', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [selectedMonth]);

  const handleRecordPayment = () => {
    setSelectedFee(null);
    setIsModalOpen(true);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Partial': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Unpaid': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fee Management</h1>
          <p className="text-slate-500">Track collections and record student payments.</p>
        </div>
        <button 
          onClick={handleRecordPayment}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 transition-all w-full md:w-auto"
        >
          <Plus size={20} />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Collected ({selectedMonth})</p>
            <h3 className="text-xl font-bold text-slate-800">₹{fees.reduce((acc, f) => acc + f.amountPaid, 0)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Dues</p>
            <h3 className="text-xl font-bold text-slate-800">₹{fees.reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Paid Ratio</p>
            <h3 className="text-xl font-bold text-slate-800">
              {fees.length > 0 ? Math.round((fees.filter(f => f.status === 'Paid').length / fees.length) * 100) : 0}%
            </h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search student payment..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 font-medium"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {availableMonths.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary-600" size={40} />
            <p className="text-slate-500 font-medium">Fetching payment records...</p>
          </div>
        ) : fees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
            <CalendarDays size={48} className="mb-4 opacity-20" />
            <p className="max-w-xs">No fee records found for {selectedMonth}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Student</th>
                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Amount Paid</th>
                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Balance Due</th>
                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Mode</th>
                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Remarks</th>
                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 md:px-8 md:py-5">
                      <div className="font-bold text-slate-800 whitespace-nowrap">{fee.student?.fullName}</div>
                      <div className="text-xs text-slate-400 capitalize whitespace-nowrap">{fee.month}</div>
                    </td>
                    <td className="px-4 py-4 md:px-8 md:py-5 text-sm font-semibold text-slate-700 whitespace-nowrap">₹{fee.amountPaid}</td>
                    <td className="px-4 py-4 md:px-8 md:py-5 text-sm font-bold text-red-500 whitespace-nowrap">
                      ₹{fee.totalAmount - fee.amountPaid}
                    </td>
                    <td className="px-4 py-4 md:px-8 md:py-5">
                      {fee.status !== 'Unpaid' ? (
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                          fee.paymentMode === 'UPI' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          fee.paymentMode === 'Cash' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          'bg-slate-50 text-slate-500 border border-slate-200'
                        }`}>
                          {fee.paymentMode || 'Cash'}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-medium">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 md:px-8 md:py-5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${getStatusStyle(fee.status)}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 md:px-8 md:py-5">
                      {fee.remarks ? (
                        <span className="text-xs text-slate-500 italic max-w-[150px] truncate block" title={fee.remarks}>
                          {fee.remarks}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 md:px-8 md:py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedFee(fee);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Edit Record"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={async () => {
                            if (window.confirm('Delete this fee record?')) {
                              try {
                                await API.delete(`/fees/${fee._id}`);
                                fetchFees();
                              } catch (err) {
                                alert('Failed to delete record');
                              }
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchFees}
        selectedMonth={selectedMonth}
        selectedFee={selectedFee}
      />
    </div>
  );
};

export default Fees;
