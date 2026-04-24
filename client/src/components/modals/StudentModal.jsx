import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import API from '../../api/axios';

const StudentModal = ({ isOpen, onClose, studentId, onRefresh }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    parentName: '',
    studentClass: '',
    batchTiming: '',
    mobileNumber: '',
    address: '',
    admissionDate: new Date().toISOString().split('T')[0],
    monthlyFees: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentDetails();
    } else {
      setFormData({
        fullName: '',
        parentName: '',
        studentClass: '',
        batchTiming: '',
        mobileNumber: '',
        address: '',
        admissionDate: new Date().toISOString().split('T')[0],
        monthlyFees: '',
        status: 'Active'
      });
    }
  }, [isOpen, studentId]);

  const fetchStudentDetails = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/students/${studentId}`);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching student', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (studentId) {
        await API.put(`/students/${studentId}`, formData);
      } else {
        await API.post('/students', formData);
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving student', error);
      alert('Failed to save student details');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[95vh] flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            {studentId ? 'Edit Student Details' : 'Add New Student'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input 
                    name="fullName" required value={formData.fullName} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Parent/Guardian Name</label>
                  <input 
                    name="parentName" required value={formData.parentName} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
                  <select 
                    name="studentClass" required value={formData.studentClass} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                    <option value="">Select Class</option>
                    <option value="Nursery">Nursery</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={`${i+1}${['st', 'nd', 'rd'][i] || 'th'}`}>
                        {i+1}{['st', 'nd', 'rd'][i] || 'th'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Batch Timing</label>
                  <select 
                    name="batchTiming" required value={formData.batchTiming} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                    <option value="">Select Batch</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
                  <input 
                    name="mobileNumber" required value={formData.mobileNumber} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Fees (₹)</label>
                  <input 
                    type="number" name="monthlyFees" required value={formData.monthlyFees} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Admission Date</label>
                  <input 
                    type="date" name="admissionDate" required 
                    value={formData.admissionDate ? formData.admissionDate.split('T')[0] : ''} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                <textarea 
                  name="address" required value={formData.address} onChange={handleChange} rows="2"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

              {studentId && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <div className="flex gap-4">
                    {['Active', 'Inactive'].map((s) => (
                      <button
                        key={s} type="button" onClick={() => setFormData({ ...formData, status: s })}
                        className={`px-6 py-2 rounded-xl text-sm font-bold border transition-all ${
                          formData.status === s 
                            ? 'bg-primary-600 border-primary-600 text-white shadow-lg' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
                <button 
                  type="button" onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all text-sans"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-200 transition-all disabled:opacity-50 flex items-center underline-offset-0"
                >
                  {isSubmitting && <Loader2 className="animate-spin mr-2" size={18} />}
                  {studentId ? 'Update Student' : 'Save Student'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
