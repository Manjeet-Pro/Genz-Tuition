import { useState, useEffect } from 'react';
import { X, Loader2, IndianRupee } from 'lucide-react';
import API from '../../api/axios';

const FeeModal = ({ isOpen, onClose, onRefresh, selectedMonth, selectedFee }) => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    month: selectedMonth || '',
    amountPaid: '',
    totalAmount: '',
    status: 'Unpaid',
    paymentMode: 'Cash',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthOptions = Array.from({ length: 24 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 12 + i);
    return d.toLocaleString('default', { month: 'long' }) + ' ' + d.getFullYear();
  });

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
      if (selectedFee) {
        setFormData({
          studentId: selectedFee.student?._id || selectedFee.student,
          month: selectedFee.month,
          amountPaid: selectedFee.amountPaid,
          totalAmount: selectedFee.totalAmount,
          status: selectedFee.status,
          paymentMode: selectedFee.paymentMode || 'Cash',
          remarks: selectedFee.remarks || ''
        });
      } else {
        setFormData({
          studentId: '',
          month: selectedMonth || monthOptions[12],
          amountPaid: '',
          totalAmount: '',
          status: 'Paid',
          paymentMode: 'Cash',
          remarks: ''
        });
      }
    }
  }, [isOpen, selectedMonth, selectedFee]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/students', { params: { status: 'Active' } });
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    const student = students.find(s => s._id === studentId);
    setFormData({
      ...formData,
      studentId,
      totalAmount: student ? student.monthlyFees : '',
      amountPaid: student ? student.monthlyFees : '' // Default to full pay
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Sending Fee Data:', formData);
    setIsSubmitting(true);
    try {
      await API.post('/fees', formData);
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving fee', error);
      alert('Failed to record payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[95vh] flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <IndianRupee size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Record Fee Payment</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Select Student</label>
                <select 
                  name="studentId" required value={formData.studentId} onChange={handleStudentChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                >
                  <option value="">Choose a student...</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.fullName} ({s.studentClass})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Month</label>
                  <select 
                    name="month" value={formData.month} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-slate-700"
                  >
                    {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Total Amount (₹)</label>
                  <input 
                    name="totalAmount" readOnly value={formData.totalAmount}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount Paying (₹)</label>
                <input 
                  type="number" name="amountPaid" required value={formData.amountPaid} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-bold text-primary-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <div className="flex gap-3">
                  {['Unpaid', 'Partial', 'Paid'].map((s) => (
                    <button
                      key={s} type="button" onClick={() => setFormData({ ...formData, status: s })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        formData.status === s 
                          ? 'bg-slate-800 border-slate-800 text-white shadow-lg' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Mode</label>
                <div className="flex gap-3">
                  {['Cash', 'UPI', 'Others'].map((mode) => (
                    <button
                      key={mode} type="button" onClick={() => setFormData(prev => ({ ...prev, paymentMode: mode }))}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        formData.paymentMode === mode 
                          ? 'bg-primary-600 border-primary-600 text-white shadow-lg' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Remarks (Optional)</label>
                <textarea 
                  name="remarks" value={formData.remarks} onChange={handleChange} rows="2"
                  placeholder="e.g. Paid via UPI, promise to pay remaining next week..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm resize-none"
                ></textarea>
              </div>

              <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
                <button 
                  type="button" onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all font-sans"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={isSubmitting || !formData.studentId}
                  className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-200 transition-all disabled:opacity-50 flex items-center gap-2 no-underline"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                  <span>Save Record</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeeModal;
