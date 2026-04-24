import { IndianRupee, MapPin, Phone, School } from 'lucide-react';

const FeeReceipt = ({ student, fee }) => {
  if (!student || !fee) return null;

  return (
    <div className="w-full max-w-2xl bg-white p-8 border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-primary-600 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <School size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">GenZ Tuition</h1>
            <p className="text-sm font-bold text-primary-600">Excellence in Education</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-black text-slate-800 mb-1">FEE RECEIPT</h2>
          <p className="text-xs font-bold text-slate-400">No: #{fee._id.substring(18).toUpperCase()}</p>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Name</p>
            <p className="text-lg font-bold text-slate-800">{student.fullName}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
            <p className="text-lg font-bold text-slate-800">{new Date(fee.paymentDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class / Batch</p>
            <p className="text-sm font-bold text-slate-700">{student.studentClass} • {student.batchTiming}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Month / Mode</p>
            <p className="text-sm font-bold text-primary-600">{fee.month} • {fee.paymentMode || 'Cash'}</p>
          </div>
        </div>

        {/* Amount Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mt-8">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest">Description</th>
                <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">Monthly Tuition Fee ({fee.month})</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right">₹ {fee.totalAmount}</td>
              </tr>
              {fee.totalAmount > fee.amountPaid && (
                <tr className="bg-red-50/30">
                  <td className="px-6 py-4 text-sm text-red-600">Pending Dues</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600 text-right">- ₹ {fee.totalAmount - fee.amountPaid}</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-primary-600 text-white">
              <tr>
                <td className="px-6 py-4 font-black uppercase text-xs tracking-widest">Total Amount Paid</td>
                <td className="px-6 py-4 text-xl font-black text-right flex items-center justify-end gap-1">
                  <IndianRupee size={20} />
                  <span>{fee.amountPaid}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {fee.remarks && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Remarks / Note</p>
             <p className="text-xs text-slate-600 italic">"{fee.remarks}"</p>
          </div>
        )}

        {/* Footer */}
        <div className="grid grid-cols-2 gap-12 pt-12">
          <div className="space-y-4">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Center Address</p>
             <div className="flex gap-2 text-slate-400">
                <MapPin size={14} className="shrink-0" />
                <p className="text-[10px] leading-relaxed">GenZ Coaching Center, Main Road, Block-A, New Delhi</p>
             </div>
          </div>
          <div className="text-right flex flex-col items-end justify-end">
             <div className="w-32 h-px bg-slate-300 mb-2"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeReceipt;
