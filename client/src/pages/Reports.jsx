import { useState } from 'react';
import API from '../api/axios';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Filter, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  CalendarCheck,
  Loader2,
  Table as TableIcon
} from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('fees'); // 'fees', 'attendance'
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const months = [
    { name: 'January', value: 1 }, { name: 'February', value: 2 }, { name: 'March', value: 3 },
    { name: 'April', value: 4 }, { name: 'May', value: 5 }, { name: 'June', value: 6 },
    { name: 'July', value: 7 }, { name: 'August', value: 8 }, { name: 'September', value: 9 },
    { name: 'October', value: 10 }, { name: 'November', value: 11 }, { name: 'December', value: 12 }
  ];

  const years = [2024, 2025, 2026, 2027];

  const fetchReport = async () => {
    setLoading(true);
    try {
      if (reportType === 'fees') {
        const monthName = months.find(m => m.value === parseInt(selectedMonth)).name;
        const queryMonth = `${monthName} ${selectedYear}`;
        const { data } = await API.get(`/fees/report/${queryMonth}`);
        setReportData(data);
      } else {
        const { data } = await API.get(`/attendance/report/${selectedMonth}/${selectedYear}`);
        setReportData({ records: data, type: 'attendance' });
      }
    } catch (error) {
      console.error('Error fetching report', error);
      alert('Failed to generate report data');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!reportData || !reportData.records || reportData.records.length === 0) return;

    let ws;
    if (reportType === 'fees') {
      const data = reportData.records.map(r => ({
        Student: r.student?.fullName,
        Month: r.month,
        Total_Amount: r.totalAmount,
        Amount_Paid: r.amountPaid,
        Status: r.status,
        Payment_Mode: r.paymentMode || 'N/A',
        Remarks: r.remarks || 'None',
        Date: new Date(r.paymentDate).toLocaleDateString()
      }));
      ws = XLSX.utils.json_to_sheet(data);
    } else {
      const data = reportData.records.map(r => ({
        Student: r.name,
        Class: r.class,
        Present: r.present,
        Absent: r.absent,
        Leave: r.leave,
        Total_Days: r.total
      }));
      ws = XLSX.utils.json_to_sheet(data);
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${reportType}_report_${selectedMonth}_${selectedYear}.xlsx`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 print:space-y-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 font-medium">Generate, analyze, and export institutional performance data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
        {/* Left Bar: Config */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Filter size={16} />
                 Report Settings
              </h3>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Category</label>
                    <div className="flex flex-col gap-2">
                       <button 
                         onClick={() => setReportType('fees')}
                         className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                           reportType === 'fees' ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                         }`}
                       >
                          <CreditCard size={18} />
                          Fees Collection
                       </button>
                       <button 
                         onClick={() => setReportType('attendance')}
                         className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                           reportType === 'attendance' ? 'bg-primary-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                         }`}
                       >
                          <CalendarCheck size={18} />
                          Attendance Stats
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Month</label>
                       <select 
                         value={selectedMonth}
                         onChange={(e) => setSelectedMonth(e.target.value)}
                         className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                       >
                          {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Year</label>
                       <select 
                         value={selectedYear}
                         onChange={(e) => setSelectedYear(e.target.value)}
                         className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm"
                       >
                          {years.map(y => <option key={y} value={y}>{y}</option>)}
                       </select>
                    </div>
                 </div>

                 <button 
                   onClick={fetchReport}
                   disabled={loading}
                   className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl transition-all disabled:opacity-50"
                 >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <TrendingUp size={18} />}
                    <span>Generate Report</span>
                 </button>
              </div>
           </div>

           {reportData && (
             <div className="bg-primary-600 p-6 rounded-3xl shadow-xl shadow-primary-200 text-white relative overflow-hidden group">
                <div className="relative z-10">
                   <h4 className="font-bold mb-4 flex items-center gap-2">
                      <Download size={18} />
                      Data Export
                   </h4>
                   <button 
                     onClick={exportToExcel}
                     className="w-full bg-white text-primary-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-50 transition-colors"
                   >
                     <FileSpreadsheet size={16} />
                     Download Excel (XLSX)
                   </button>
                   <button 
                     onClick={() => window.print()}
                     className="w-full mt-3 bg-primary-700 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-800 transition-colors border border-primary-500/30"
                   >
                     <FileText size={16} />
                     Save as PDF
                   </button>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-500 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform"></div>
             </div>
           )}
        </div>

        {/* Right Area: Report View */}
        <div className="lg:col-span-3 print:w-full">
           {!reportData ? (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] h-[500px] flex flex-col items-center justify-center text-center p-10">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-sm">
                   <TableIcon size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-400">Preview Report</h3>
                <p className="text-slate-400 max-w-xs mt-2 text-sm">Select report type and time period to view the generated data here.</p>
             </div>
           ) : (
             <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-500 print:border-none print:shadow-none">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                   <div>
                      <h2 className="text-xl font-bold text-slate-800 capitalize">{reportType} Overview</h2>
                      <p className="text-xs font-medium text-slate-400">{months.find(m => m.value == selectedMonth).name} {selectedYear}</p>
                   </div>
                   <span className="px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100">
                      Generated: {new Date().toLocaleDateString()}
                   </span>
                </div>
                
                <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full text-left">
                      <thead>
                         <tr className="bg-white">
                            {reportType === 'fees' ? (
                               <>
                                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Student Name</th>
                                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Amount Paid</th>
                                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Month</th>
                                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Mode</th>
                                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Status</th>
                                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Remarks</th>
                               </>
                            ) : (
                               <>
                                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Student Name</th>
                                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Present</th>
                                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Absent</th>
                                  <th className="px-4 py-3 md:px-8 md:py-5 text-[10px] font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap">Success Rate</th>
                               </>
                            )}
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {reportData.records?.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                               {reportType === 'fees' ? (
                                  <>
                                     <td className="px-4 py-4 md:px-8 md:py-4 font-bold text-slate-700 whitespace-nowrap">{row.student?.fullName || '---'}</td>
                                     <td className="px-4 py-4 md:px-8 md:py-4 text-sm font-black text-primary-600 whitespace-nowrap">₹ {row.amountPaid}</td>
                                     <td className="px-4 py-4 md:px-8 md:py-4 text-sm font-medium text-slate-500 whitespace-nowrap">{row.month}</td>
                                     <td className="px-4 py-4 md:px-8 md:py-4">
                                        {row.paymentMode ? (
                                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">{row.paymentMode}</span>
                                        ) : (
                                           <span className="text-slate-300">-</span>
                                        )}
                                     </td>
                                     <td className="px-4 py-4 md:px-8 md:py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                                          row.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                           {row.status}
                                        </span>
                                     </td>
                                     <td className="px-4 py-4 md:px-8 md:py-4">
                                        {row.remarks ? (
                                           <span className="text-[11px] italic text-slate-500 max-w-[150px] truncate block" title={row.remarks}>{row.remarks}</span>
                                        ) : (
                                           <span className="text-slate-300">-</span>
                                        )}
                                     </td>
                                  </>
                               ) : (
                                  <>
                                     <td className="px-4 py-4 md:px-8 md:py-4 font-bold text-slate-700 whitespace-nowrap">{row.name}</td>
                                     <td className="px-4 py-4 md:px-8 md:py-4 text-sm font-bold text-emerald-600 whitespace-nowrap">{row.present}</td>
                                     <td className="px-4 py-4 md:px-8 md:py-4 text-sm font-bold text-red-500 whitespace-nowrap">{row.absent}</td>
                                     <td className="px-4 py-4 md:px-8 md:py-4">
                                        <div className="flex items-center gap-2">
                                           <div className="flex-1 h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                                              <div 
                                                className="h-full bg-primary-600" 
                                                style={{ width: `${(row.present / (row.total || 1)) * 100}%` }}
                                              ></div>
                                           </div>
                                           <span className="text-[10px] font-bold text-slate-400">
                                              {Math.round((row.present / (row.total || 1)) * 100)}%
                                           </span>
                                        </div>
                                     </td>
                                  </>
                               )}
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                <div className="p-8 bg-slate-50/50 flex justify-between items-center mt-4">
                   <div className="text-xs text-slate-400 font-medium italic">
                      Copyright 2026 GenZ Tuition Master System. Printed data is subject to verification.
                   </div>
                   <div className="flex items-center gap-1 font-black text-slate-900 tracking-tighter italic">
                      GENZ <span className="text-primary-600">TUITION</span>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
