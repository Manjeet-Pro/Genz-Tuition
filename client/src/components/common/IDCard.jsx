import { School, User, Phone, MapPin, Calendar } from 'lucide-react';

const IDCard = ({ student }) => {
  if (!student) return null;

  return (
    <div className="w-[350px] h-[550px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative print:shadow-none print:border print:m-0">
      {/* Header Decoration */}
      <div className="h-32 bg-primary-600 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500 rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="flex items-center gap-2 text-white mb-1">
             <School size={20} />
             <span className="font-bold tracking-widest text-sm">GENZ TUITION</span>
          </div>
          <div className="h-1 w-12 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="px-8 -mt-16 flex flex-col items-center relative z-10">
        {/* Photo Container */}
        <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-lg mb-4">
           <div className="w-full h-full rounded-[20px] bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden">
              <User size={64} strokeWidth={1.5} />
           </div>
        </div>

        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight text-center mb-1">
          {student.fullName}
        </h3>
        <p className="text-primary-600 font-bold text-sm bg-primary-50 px-4 py-1 rounded-full mb-8">
          STUDENT ID: {student._id?.slice(-6).toUpperCase()}
        </p>

        {/* Info Grid */}
        <div className="w-full space-y-4 pt-4 border-t border-slate-100">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Calendar size={16} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class & Batch</p>
                 <p className="text-sm font-bold text-slate-700">{student.studentClass} • {student.batchTiming}</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Phone size={16} />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</p>
                 <p className="text-sm font-bold text-slate-700">{student.mobileNumber}</p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <MapPin size={16} />
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</p>
                 <p className="text-xs font-bold text-slate-700 line-clamp-2 leading-tight">{student.address}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 w-full flex flex-col items-center">
         <div className="w-16 h-1 bg-slate-100 rounded-full mb-3"></div>
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[4px]">Verified Member</p>
      </div>

      {/* Ribbon */}
      <div className="absolute top-4 right-4 text-[10px] font-black bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md border border-white/20 uppercase tracking-widest">
        2026-27
      </div>
    </div>
  );
};

export default IDCard;
