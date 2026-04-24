import { School } from 'lucide-react';

const AdmissionForm = ({ student }) => {
  if (!student) return null;

  return (
    <div className="w-full max-w-4xl bg-white p-6 md:p-12 border border-slate-200 shadow-xl print:shadow-none print:border-none print:p-0 mx-auto">
      {/* Form Header */}
      <div className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-8">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 bg-slate-900 flex items-center justify-center text-white rounded-xl">
             <School size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">GENZ TUITION MASTER</h1>
            <p className="text-sm font-bold text-slate-500 tracking-widest uppercase">Official Student Admission Record</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-sm font-bold text-slate-400">SESSION 2026-27</p>
           <p className="text-lg font-black text-slate-900">FORM NO: {student._id?.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      {/* Form Photo & Name Section */}
      <div className="flex flex-col-reverse sm:flex-row gap-8 mb-12">
         <div className="flex-1 space-y-6">
            <div className="border-b border-slate-200 pb-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Full Name</p>
               <p className="text-xl font-bold text-slate-800">{student.fullName}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="border-b border-slate-200 pb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Parent/Guardian Name</p>
                  <p className="text-lg font-bold text-slate-700">{student.parentName}</p>
               </div>
               <div className="border-b border-slate-200 pb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class</p>
                  <p className="text-lg font-bold text-slate-700">{student.studentClass}</p>
               </div>
            </div>
         </div>
         <div className="w-32 h-40 sm:w-40 sm:h-48 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-center p-4 mx-auto sm:mx-0 shrink-0">
            <p className="text-[10px] font-bold text-slate-300 uppercase leading-tight">Affix Passport Size Photograph Here</p>
         </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 mb-12">
         <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
            <p className="text-lg font-bold text-slate-700">{student.mobileNumber}</p>
            <div className="h-px bg-slate-100 w-full"></div>
         </div>
         <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission Date</p>
            <p className="text-lg font-bold text-slate-700">{new Date(student.admissionDate).toLocaleDateString()}</p>
            <div className="h-px bg-slate-100 w-full"></div>
         </div>
         <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Timing</p>
            <p className="text-lg font-bold text-slate-700">{student.batchTiming}</p>
            <div className="h-px bg-slate-100 w-full"></div>
         </div>
         <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Fees</p>
            <p className="text-lg font-bold text-slate-700">₹ {student.monthlyFees}</p>
            <div className="h-px bg-slate-100 w-full"></div>
         </div>
      </div>

      <div className="mb-12">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Residential Address</p>
          <p className="text-lg font-bold text-slate-700 leading-relaxed border-b border-slate-200 pb-4">{student.address}</p>
      </div>

      {/* Declarations */}
      <div className="mb-20 space-y-4">
         <h4 className="font-black text-slate-900 text-sm tracking-widest uppercase italic bg-slate-50 px-3 py-1 inline-block">Declaration by Parent</h4>
         <p className="text-xs text-slate-500 leading-relaxed">
           I hereby declare that the particulars furnished above are true and correct to the best of my knowledge and belief. I agree to abide by the rules and regulations of the institution as mentioned in the prospectous. I understand that the fees once paid is non-refundable.
         </p>
      </div>

      {/* Signatures */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-12 pt-12 gap-12 sm:gap-4">
         <div className="text-center w-48">
            <div className="h-px bg-slate-900 w-full mb-2"></div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[2px]">Student's Signature</p>
         </div>
         <div className="text-center w-48">
            <div className="h-px bg-slate-900 w-full mb-2"></div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[2px]">Parent's Signature</p>
         </div>
         <div className="text-center w-48">
            <div className="w-16 h-16 border-2 border-slate-100 rounded-full mx-auto mb-2 opacity-50"></div>
            <div className="h-px bg-slate-900 w-full mb-2"></div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[2px]">Authorized Signatory</p>
         </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
