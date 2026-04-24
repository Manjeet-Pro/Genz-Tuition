import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserCircle2,
  Phone,
  ArrowUpDown
} from 'lucide-react';

import StudentModal from '../components/modals/StudentModal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/students', {
        params: {
          search: searchTerm,
          studentClass: filterClass,
          batchTiming: filterBatch
        }
      });
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, filterClass, filterBatch]);

  const handleAdd = () => {
    setSelectedStudentId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedStudentId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await API.delete(`/students/${id}`);
        fetchStudents();
      } catch (error) {
        alert('Failed to delete student');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-500">Manage and track all students in your tuition center.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 transition-all w-full md:w-auto"
        >
          <Plus size={20} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or mobile..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select 
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>
            <option value="Nursery">Nursery</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            {Array.from({length: 12}, (_, i) => (
              <option key={i+1} value={`${i+1}${['st', 'nd', 'rd'][i] || 'th'}`}>
                Class {i+1}{['st', 'nd', 'rd'][i] || 'th'}
              </option>
            ))}
          </select>
          <select 
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
          >
            <option value="">All Batches</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class/Batch</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Adm. Date</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4 h-16 bg-slate-50/20"></td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No students found matching your criteria.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <Link to={`/students/${student._id}`} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold uppercase group-hover:bg-primary-600 group-hover:text-white transition-all shrink-0">
                          {student.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors truncate">{student.fullName}</div>
                          <div className="text-xs text-slate-400 capitalize underline-offset-2 group-hover:underline truncate">{student.parentName} (P)</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <div className="text-sm font-medium text-slate-700 whitespace-nowrap">{student.studentClass}</div>
                      <div className="text-xs text-slate-400 whitespace-nowrap">{student.batchTiming}</div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 whitespace-nowrap">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        {student.mobileNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <div className="text-sm text-slate-600 font-medium whitespace-nowrap">
                        {new Date(student.admissionDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        student.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(student._id)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" 
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        studentId={selectedStudentId}
        onRefresh={fetchStudents}
      />
    </div>
  );
};

export default Students;
