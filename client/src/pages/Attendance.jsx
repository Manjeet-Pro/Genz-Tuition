import { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Save,
  Loader2,
  CalendarDays
} from 'lucide-react';

const Attendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchTiming, setBatchTiming] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch students based on filters
  const fetchStudentsAndAttendance = async () => {
    if (!batchTiming) return;
    
    setLoading(true);
    try {
      // 1. Fetch Students
      const { data: studentList } = await API.get('/students', {
        params: { batchTiming, status: 'Active' }
      });
      setStudents(studentList);

      // 2. Fetch existing attendance for this date
      const { data: existingAttendance } = await API.get(`/attendance/date/${date}`);
      
      // Map existing records to local state
      const initialAttendance = {};
      studentList.forEach(s => {
        const record = existingAttendance.find(a => a.student._id === s._id);
        initialAttendance[s._id] = record ? record.status : 'Present'; // Default to Present
      });
      setAttendanceData(initialAttendance);

    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsAndAttendance();
  }, [date, batchTiming]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData({ ...attendanceData, [studentId]: status });
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const promises = Object.keys(attendanceData).map(studentId => 
        API.post('/attendance', {
          studentId,
          date,
          status: attendanceData[studentId]
        })
      );
      await Promise.all(promises);
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance', error);
      alert('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'bg-emerald-500 text-white';
      case 'Absent': return 'bg-red-500 text-white';
      case 'Leave': return 'bg-amber-500 text-white';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
          <p className="text-slate-500">Daily marking and tracking for students.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 pl-2 border-r pr-4 border-slate-100">
            <Calendar size={18} className="text-primary-600" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="outline-none text-sm font-semibold text-slate-700"
            />
          </div>
          <button 
            onClick={saveAttendance}
            disabled={saving || students.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 w-full sm:w-auto"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Batch</label>
            <select 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-700"
              value={batchTiming}
              onChange={(e) => setBatchTiming(e.target.value)}
            >
              <option value="">-- Choose Batch --</option>
              <option value="Afternoon">Afternoon Batch</option>
              <option value="Evening">Evening Batch</option>
            </select>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={fetchStudentsAndAttendance}
              className="px-8 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors w-full md:w-auto"
            >
              Load Students
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Sheet */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-primary-600" size={40} />
            <p className="text-slate-500 font-medium font-sans">Loading student records...</p>
          </div>
        ) : !batchTiming ? (
          <div className="flex flex-col items-center justify-center py-32 text-center text-slate-400">
            <CalendarDays size={48} className="mb-4 opacity-20" />
            <p className="max-w-xs">Please select a batch to start marking attendance.</p>
          </div>
        ) : students.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            No active students found in this batch.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 md:px-8 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Student Details</th>
                  <th className="px-4 py-3 md:px-8 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center whitespace-nowrap">Mark Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 md:px-8 md:py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold uppercase transition-all shrink-0">
                          {student.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 truncate">{student.fullName}</div>
                          <div className="text-xs text-slate-400 capitalize truncate">{student.mobileNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 md:px-8 md:py-6">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {['Present', 'Absent', 'Leave'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(student._id, status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                              attendanceData[student._id] === status 
                                ? getStatusColor(status) 
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {status === 'Present' && <CheckCircle2 size={14} />}
                            {status === 'Absent' && <XCircle size={14} />}
                            {status === 'Leave' && <Clock size={14} />}
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {students.length > 0 && (
         <div className="bg-primary-50 p-4 md:p-6 rounded-3xl border border-primary-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
               <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {Object.values(attendanceData).filter(v => v === 'Present').length}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Present</div>
               </div>
               <div className="hidden md:block h-10 w-px bg-primary-200"></div>
               <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {Object.values(attendanceData).filter(v => v === 'Absent').length}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Absent</div>
               </div>
               <div className="hidden md:block h-10 w-px bg-primary-200"></div>
               <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">
                    {Object.values(attendanceData).filter(v => v === 'Leave').length}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase">Leave</div>
               </div>
            </div>
            <p className="text-sm font-medium text-slate-500 italic text-center md:text-right">
               Summary for {new Date(date).toLocaleDateString()}
            </p>
         </div>
      )}
    </div>
  );
};

export default Attendance;
