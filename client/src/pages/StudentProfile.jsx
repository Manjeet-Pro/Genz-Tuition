import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import { 
  ArrowLeft, 
  Printer, 
  User, 
  Phone, 
  Calendar, 
  IdCard,
  FileText,
  Loader2,
  CreditCard
} from 'lucide-react';
import IDCard from '../components/common/IDCard';
import AdmissionForm from '../components/forms/AdmissionForm';

const StudentProfile = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview'); // 'overview', 'fees', 'idcard', 'admission'

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentRes = await API.get(`/students/${id}`);
        setStudent(studentRes.data);
        const feesRes = await API.get(`/fees/student/${id}`);
        setFees(feesRes.data);
      } catch (error) {
        console.error('Error fetching student details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id]);

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab !== 'overview') {
      setSearchParams({ tab: activeTab });
    } else {
      setSearchParams({});
    }
  }, [activeTab]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary-600" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Loading Student Profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Student not found</h2>
        <Link to="/students" className="text-primary-600 hover:underline mt-4 inline-block">Back to Student List</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Navigation Header */}
      <div className="flex items-center justify-between print:hidden">
        <Link to="/students" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
          <ArrowLeft size={20} />
          <span>Back to Students</span>
        </Link>
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg"
          >
            <Printer size={18} />
            <span>Print {
              activeTab === 'idcard' ? 'ID Card' : 
              activeTab === 'admission' ? 'Admission Form' : 'Profile'
            }</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile Info Card */}
        <div className="lg:col-span-1 space-y-8 print:hidden">
           <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
              <div className="h-24 bg-primary-600"></div>
              <div className="px-8 pb-8 -mt-12 flex flex-col items-center">
                 <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg mb-4">
                    <div className="w-full h-full rounded-[22px] bg-slate-50 flex items-center justify-center text-slate-300">
                       <User size={48} />
                    </div>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800 text-center">{student.fullName}</h2>
                 <p className="text-slate-400 font-medium text-sm mb-4 capitalize">{student.parentName} (Parent)</p>
                 <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                   student.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                 }`}>
                   {student.status}
                 </span>
              </div>
              <div className="px-8 pb-8 space-y-4">
                 <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                       <Calendar size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admission Date</p>
                       <p className="text-sm font-bold">{new Date(student.admissionDate).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                       <Phone size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</p>
                       <p className="text-sm font-bold">{student.mobileNumber}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Tabs and Content */}
        <div className="lg:col-span-2 space-y-8">
           {/* Tab Switcher */}
           <div className="flex gap-4 p-2 bg-white rounded-3xl shadow-sm border border-slate-100 print:hidden">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'fees', label: 'Fees', icon: CreditCard },
                { id: 'idcard', label: 'ID Card', icon: IdCard },
                { id: 'admission', label: 'Admission Form', icon: FileText }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all flex-1 ${
                    activeTab === tab.id 
                      ? 'bg-primary-600 text-white shadow-xl shadow-primary-200' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
           </div>

           {/* Tab Content */}
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'overview' && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8 print:hidden">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Academic Details</h4>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                               <span className="text-slate-500 font-medium">Class</span>
                               <span className="font-bold text-slate-800">{student.studentClass}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                               <span className="text-slate-500 font-medium">Batch Timing</span>
                               <span className="font-bold text-slate-800">{student.batchTiming}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                               <span className="text-slate-500 font-medium">Monthly Fees</span>
                               <span className="font-bold text-primary-600 italic">₹ {student.monthlyFees}</span>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Personal Details</h4>
                         <div className="space-y-4">
                            <div className="flex flex-col gap-2 py-2 border-b border-slate-50">
                               <span className="text-slate-500 font-medium">Address</span>
                               <span className="font-bold text-slate-800 text-sm leading-relaxed">{student.address}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'fees' && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden print:hidden">
                  <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Payment History</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white border-b border-slate-100">
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Month</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mode</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {fees.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="px-8 py-10 text-center text-slate-400 italic">No payment history found.</td>
                          </tr>
                        ) : (
                          fees.map((fee) => (
                            <tr key={fee._id}>
                              <td className="px-8 py-4 text-sm font-bold text-slate-800">{fee.month}</td>
                              <td className="px-8 py-4 text-sm font-black text-primary-600">₹{fee.amountPaid}</td>
                              <td className="px-8 py-4">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
                                  {fee.paymentMode || 'Cash'}
                                </span>
                              </td>
                              <td className="px-8 py-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                  fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                }`}>
                                  {fee.status}
                                </span>
                              </td>
                              <td className="px-8 py-4 text-xs text-slate-500 italic max-w-[200px] truncate" title={fee.remarks}>
                                {fee.remarks || '-'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'idcard' && (
                <div className="flex justify-center py-8">
                   <IDCard student={student} />
                </div>
              )}

              {activeTab === 'admission' && (
                <div className="flex justify-center py-8">
                   <AdmissionForm student={student} />
                </div>
              )}
           </div>
        </div>
      </div>
    
      {/* Print Overlay for ID CARD */}
      {activeTab === 'idcard' && (
        <div className="hidden print:block fixed inset-0 bg-white">
           <div className="flex items-center justify-center min-h-screen">
              <IDCard student={student} />
           </div>
        </div>
      )}

      {/* Print Overlay for Admission Form */}
      {activeTab === 'admission' && (
        <div className="hidden print:block fixed inset-0 bg-white">
           <AdmissionForm student={student} />
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
