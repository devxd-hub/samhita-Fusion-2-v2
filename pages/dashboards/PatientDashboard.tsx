
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';
import QRCode from 'react-qr-code';
import { 
  Activity, FileText, Calendar, Heart, 
  Droplets, Weight, User as UserIcon, 
  MapPin, Phone, Mail, Shield, Download, Eye, 
  Video, Clock, AlertCircle, CheckCircle, Camera, Loader2, X, ChevronRight,
  Search, Filter, UploadCloud, Zap, ArrowUpRight, Sparkles, Siren, Navigation, ShieldCheck, Thermometer
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageService, MockDatabase } from '../../services/mockDatabase';
import CountUp from '../../components/CountUp';

interface PatientDashboardProps {
  user: User;
  currentView: string;
  onUserUpdate: (user: User) => void;
}

// --- Optimized Animation Variants ---
const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: 10, 
    transition: { duration: 0.2 } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.98 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1, 
    transition: springTransition 
  }
};

// --- Mock Data ---
const bpData = [
  { name: 'Mon', systolic: 118, diastolic: 78 },
  { name: 'Tue', systolic: 122, diastolic: 82 },
  { name: 'Wed', systolic: 120, diastolic: 80 },
  { name: 'Thu', systolic: 125, diastolic: 85 },
  { name: 'Fri', systolic: 121, diastolic: 79 },
  { name: 'Sat', systolic: 119, diastolic: 78 },
  { name: 'Sun', systolic: 120, diastolic: 80 },
];

const recordsData = [
  { id: 'REC-001', date: 'Oct 15, 2023', doctor: 'Dr. Anjali Gupta', type: 'Prescription', facility: 'Apollo Hospital', status: 'Available', size: '1.2 MB' },
  { id: 'REC-002', date: 'Sep 22, 2023', doctor: 'Dr. Rao', type: 'Lab Report', facility: 'City Path Labs', status: 'Available', size: '3.4 MB' },
  { id: 'REC-003', date: 'Aug 10, 2023', doctor: 'Vaidya Sharma', type: 'Diet Plan', facility: 'AyurCare Center', status: 'Available', size: '0.8 MB' },
];

// --- SOS Modal Component ---
const SOSModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [sosState, setSosState] = useState<'countdown' | 'dispatching' | 'active'>('countdown');
  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSosState('countdown');
      setCountdown(5);
      setProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (isOpen && sosState === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        setSosState('dispatching');
      }
    }
    return () => clearTimeout(timer);
  }, [isOpen, sosState, countdown]);

  useEffect(() => {
    if (sosState === 'dispatching') {
      const interval = setInterval(() => {
        setProgress(old => {
          if (old >= 100) {
            clearInterval(interval);
            setSosState('active');
            return 100;
          }
          return old + 2; 
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [sosState]);

  const handleCancel = () => {
    onClose();
    setTimeout(() => setSosState('countdown'), 300);
  };

  const handleImmediate = () => {
    setSosState('dispatching');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-red-950/90 backdrop-blur-xl"
        onClick={handleCancel}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={springTransition}
        className="relative w-full max-w-md bg-black rounded-[3rem] shadow-2xl overflow-hidden border-2 border-red-500/50"
      >
        <AnimatePresence mode="wait">
          {sosState === 'countdown' && (
            <motion.div 
              key="countdown"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 flex flex-col items-center text-center"
            >
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <Siren className="w-24 h-24 text-red-500 animate-bounce" />
              </div>
              
              <h2 className="text-3xl font-display font-bold text-white mb-2">Emergency SOS</h2>
              <p className="text-red-200 mb-8">Sending alert to Emergency Services in</p>
              
              <div className="w-40 h-40 rounded-full border-4 border-red-500/30 flex items-center justify-center mb-8 relative">
                 <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="76" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-red-500" 
                      strokeDasharray="477" 
                      strokeDashoffset={477 - (477 * ((5 - countdown) / 5))}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                 </svg>
                 <span className="text-6xl font-mono font-bold text-white">{countdown}</span>
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={handleCancel}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleImmediate}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-colors shadow-lg shadow-red-600/30"
                >
                  Send Now
                </button>
              </div>
            </motion.div>
          )}

          {sosState === 'dispatching' && (
            <motion.div 
              key="dispatching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-10 flex flex-col items-center text-center h-[500px] justify-center"
            >
               <Loader2 className="w-16 h-16 text-red-500 animate-spin mb-6" />
               <h3 className="text-2xl font-bold text-white mb-8">Connecting to Grid...</h3>
               
               <div className="w-full space-y-4 text-left pl-8">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                     <CheckCircle className={`w-5 h-5 transition-colors duration-300 ${progress > 20 ? 'text-green-500' : 'text-slate-700'}`} />
                     <span>Acquiring GPS Location...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                     <CheckCircle className={`w-5 h-5 transition-colors duration-300 ${progress > 50 ? 'text-green-500' : 'text-slate-700'}`} />
                     <span>Notifying Emergency Contact...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                     <CheckCircle className={`w-5 h-5 transition-colors duration-300 ${progress > 80 ? 'text-green-500' : 'text-slate-700'}`} />
                     <span>Broadcasting Medical ID...</span>
                  </div>
               </div>
            </motion.div>
          )}

          {sosState === 'active' && (
            <motion.div 
              key="active"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 bg-gradient-to-b from-red-600 to-red-700 h-full flex flex-col items-center text-center relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
               
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl animate-pulse">
                  <CheckCircle className="w-10 h-10 text-red-600" />
               </div>
               
               <h2 className="text-3xl font-bold text-white mb-2">Help is on the way!</h2>
               <p className="text-white/80 mb-8">Ambulance dispatched. ETA: 8 Mins.</p>
               
               <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 w-full mb-6 border border-white/10 shadow-inner">
                  <div className="flex items-start gap-4 text-left">
                     <div className="p-3 bg-white/10 rounded-xl">
                        <Navigation className="text-white w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[10px] uppercase font-bold text-white/60">Live Location Shared</p>
                        <p className="text-white font-bold text-lg">12, Gandhi Marg, BBSR</p>
                        <p className="text-white/80 text-xs mt-1">Accuracy: 5 meters</p>
                     </div>
                  </div>
               </div>

               <button 
                  onClick={handleCancel}
                  className="mt-auto w-full py-4 bg-white text-red-600 rounded-2xl font-bold hover:bg-slate-100 transition-colors shadow-xl"
               >
                  I am Safe Now
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// --- Booking Modal Component ---
const BookAppointmentModal: React.FC<{ isOpen: boolean; onClose: () => void; user: User }> = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({ name: user.name, age: '', weight: '', disease: '', symptoms: '' });
  const [step, setStep] = useState<'form' | 'analyzing' | 'success'>('form');
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen && step === 'success') {
       setStep('form');
       setBookingResult(null);
       setFormData({ name: user.name, age: '', weight: '', disease: '', symptoms: '' });
    }
  }, [isOpen]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('analyzing');
    try {
      const result = await MockDatabase.bookAppointment(formData);
      setTimeout(() => {
          setBookingResult(result);
          setStep('success');
      }, 1500);
    } catch (error) {
      console.error(error);
      setStep('form'); 
    }
  };

  const close = () => {
    onClose();
    setTimeout(() => setStep('form'), 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={close}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={springTransition}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
               <Calendar size={20} />
             </div>
             <div>
               <h3 className="font-bold text-slate-900 dark:text-white text-lg">New Appointment</h3>
               <p className="text-xs text-slate-500 font-medium">AI-Guided Specialist Routing</p>
             </div>
          </div>
          <button onClick={close} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode='wait'>
            {step === 'form' && (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleBook} 
                className="space-y-5"
              >
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Patient Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-700 dark:text-white"
                      required
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Age</label>
                      <input 
                        type="number" 
                        value={formData.age}
                        onChange={e => setFormData({...formData, age: e.target.value})}
                        placeholder="e.g. 29"
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-700 dark:text-white"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Weight (kg)</label>
                      <input 
                        type="text" 
                        value={formData.weight}
                        onChange={e => setFormData({...formData, weight: e.target.value})}
                        placeholder="e.g. 70"
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-700 dark:text-white"
                        required
                      />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Primary Condition</label>
                    <input 
                      type="text" 
                      value={formData.disease}
                      onChange={e => setFormData({...formData, disease: e.target.value})}
                      placeholder="e.g. Hypertension, Migraine"
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-700 dark:text-white"
                      required
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Detailed Symptoms</label>
                    <textarea 
                      rows={3}
                      value={formData.symptoms}
                      onChange={e => setFormData({...formData, symptoms: e.target.value})}
                      placeholder="Describe symptoms for AI analysis..."
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-700 dark:text-white resize-none"
                      required
                    />
                 </div>

                 <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-2"
                 >
                    <Sparkles size={18} /> Find Specialist & Book
                 </motion.button>
              </motion.form>
            )}

            {step === 'analyzing' && (
               <motion.div
                 key="analyzing"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="flex flex-col items-center justify-center py-12 text-center"
               >
                  <div className="relative w-28 h-28 mb-8">
                     <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="text-blue-500 animate-pulse" size={40} />
                     </div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analyzing Symptoms...</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Our AI is matching your condition with the best available specialist.</p>
               </motion.div>
            )}

            {step === 'success' && bookingResult && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                 <motion.div 
                   initial={{ scale: 0 }} animate={{ scale: 1 }} 
                   transition={{ type: "spring", stiffness: 200, damping: 15 }}
                   className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400 shadow-inner ring-4 ring-white dark:ring-slate-800"
                 >
                   <CheckCircle size={40} strokeWidth={3} />
                 </motion.div>
                 
                 <div>
                   <h4 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Booking Confirmed!</h4>
                   <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-widest">Ref ID: {bookingResult.appointmentId}</p>
                 </div>
                 
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 text-left flex items-center gap-5 shadow-sm">
                    <img src={bookingResult.assignedDoctor.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-md bg-white" alt="Doctor" />
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Matched Specialist</p>
                       <p className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{bookingResult.assignedDoctor.name}</p>
                       <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{bookingResult.assignedDoctor.specialization}</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-3 pt-2">
                    <button onClick={close} className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      View Calendar
                    </button>
                    <button onClick={close} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-colors">
                      Done
                    </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// --- Dashboard Views ---

const DashboardHome: React.FC<{ user: User; onBookClick: () => void; onSOSClick: () => void }> = ({ user, onBookClick, onSOSClick }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const qrData = `SAMHITA HEALTH CARD\nName: ${user.name}\nUHID: SHA-8821-9921\nBlood: O+ ve\nEmergency: +91 98765 43210`;

  const downloadQR = () => {
    const svg = document.getElementById("patient-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${user.name.replace(/\s+/g, '_')}_HealthID.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const QuickAction = ({ icon: Icon, label, onClick, color, delay }: any) => (
    <motion.button 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm min-w-[100px] h-[100px] gap-2 hover:shadow-md transition-all group will-change-transform"
    >
      <div className={`p-2.5 rounded-2xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{label}</span>
    </motion.button>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Your health dashboard is active. 3 new updates.</p>
        </div>
        
        {/* Quick Actions Strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
           <QuickAction icon={Calendar} label="Book" onClick={onBookClick} color="bg-blue-500 text-blue-500" delay={0.1} />
           <QuickAction icon={UploadCloud} label="Upload" onClick={() => {}} color="bg-purple-500 text-purple-500" delay={0.15} />
           <QuickAction icon={Zap} label="SOS" onClick={onSOSClick} color="bg-red-500 text-red-500" delay={0.2} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Vitals & Trends */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Vitals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', trend: '+2%' },
              { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', trend: 'Stable' },
              { label: 'Glucose', value: '95', unit: 'mg/dL', icon: Droplets, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', trend: '-5%' },
              { label: 'Weight', value: '70', unit: 'kg', icon: Weight, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20', trend: 'Stable' },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group cursor-default will-change-transform"
              >
                 <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                       <stat.icon size={20} />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.trend.includes('-') ? 'text-emerald-600 bg-emerald-50' : stat.trend === 'Stable' ? 'text-slate-500 bg-slate-100 dark:bg-slate-800' : 'text-rose-500 bg-rose-50'}`}>
                       {stat.trend}
                    </span>
                 </div>
                 <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                       {stat.value} <span className="text-xs font-medium text-slate-400">{stat.unit}</span>
                    </h4>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">{stat.label}</p>
                 </div>
              </motion.div>
            ))}
          </div>

          {/* Chart Section */}
          <motion.div variants={itemVariants} className="glass-panel-apple bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
               <div>
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   <Activity className="text-blue-500" size={20} /> Health Trends
                 </h3>
                 <p className="text-sm text-slate-500 mt-1">Weekly Blood Pressure Analysis</p>
               </div>
               <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  View Full Report
               </button>
            </div>
            
            <div className="h-[250px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bpData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)', backgroundColor: '#1e293b', color: '#fff'}}
                    itemStyle={{color: '#fff'}}
                  />
                  <Area type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorBp)" />
                  <Area type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Records Summary */}
          <motion.div variants={itemVariants} className="glass-panel-apple bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
               <button className="text-blue-500 text-sm font-bold hover:underline">View All</button>
             </div>
             <div className="space-y-3">
               {recordsData.slice(0, 3).map((rec, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                   <div className="flex items-center space-x-4">
                     <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl shadow-sm text-slate-500 dark:text-slate-300 group-hover:scale-110 transition-transform">
                       <FileText size={20} />
                     </div>
                     <div>
                       <p className="font-bold text-slate-900 dark:text-white text-sm">{rec.type}</p>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{rec.date} • {rec.doctor}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-xs font-bold px-3 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hidden sm:block">
                          {rec.facility}
                      </span>
                      <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                   </div>
                 </div>
               ))}
             </div>
          </motion.div>

        </div>

        {/* Right Column: Profile & Actions */}
        <div className="space-y-8">
          
          {/* Emergency Card */}
          <motion.div variants={itemVariants} className="glass-panel-apple bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
              
              <div className="mb-6 relative">
                 <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
                 <div className="p-4 bg-white rounded-2xl shadow-lg relative z-10 flex justify-center">
                    <QRCode 
                        id="patient-qr-code"
                        value={qrData} 
                        size={120} 
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox={`0 0 256 256`}
                    />
                 </div>
              </div>
              
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Universal Health ID</h3>
              <p className="text-xs text-slate-500 mb-4">Scan for detailed Medical ID</p>
              
              <div className="flex gap-2 w-full">
                 <button className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors">
                    Share
                 </button>
                 <button 
                    onClick={downloadQR}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                 >
                    Download
                 </button>
              </div>
          </motion.div>

          {/* Upcoming Appointment */}
          <motion.div variants={itemVariants} className="glass-panel-apple bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                      <Calendar size={20} className="text-white" />
                   </div>
                   <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/10">Tomorrow</span>
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-1">General Checkup</h3>
                <p className="text-blue-100 text-sm mb-6">with Dr. Anjali Gupta</p>
                
                <div className="flex items-center gap-3 bg-black/20 p-3 rounded-2xl backdrop-blur-sm border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Clock size={18} />
                   </div>
                   <div>
                      <p className="text-xs font-bold uppercase opacity-70">Time</p>
                      <p className="font-mono font-bold">10:00 AM</p>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Daily Tip */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 p-8 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/30 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500"/> Daily Wisdom
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-100 italic leading-relaxed font-medium">
                "To protect health, one must treat the body like a wet clay pot—with constant care and balance."
              </p>
              <div className="mt-4 flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-[10px] font-bold text-amber-900 dark:text-amber-100">
                    S
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                   Sushruta Samhita
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const PatientProfile: React.FC<{ user: User; onUserUpdate: (user: User) => void }> = ({ user, onUserUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatar, setAvatar] = useState(user.avatar);
    const [isUploading, setIsUploading] = useState(false);
    
    // Mock extended user data for the profile view
    const extendedData = {
        insuranceProvider: "Star Health Premier",
        policyNumber: "POL-8821-9921",
        validTill: "Oct 2025",
        bloodGroup: "O+ ve",
        height: "175 cm",
        weight: "70 kg",
        dob: "14 Aug 1994",
        allergies: ["Peanuts", "Penicillin", "Dust Mites"],
        emergencyContact: {
            name: "Ravi Sharma",
            relation: "Father",
            phone: "+91 99999 88888"
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await StorageService.uploadImage(file);
            setAvatar(url);
            
            await MockDatabase.updateDoctorProfile(user.id, { avatar: url });
            onUserUpdate({ ...user, avatar: url });
            
        } catch (error) {
            console.error(error);
            alert("Image upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, delay }: any) => (
        <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-900/50 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all group cursor-default"
        >
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
        </motion.div>
    );

    return (
        <motion.div 
            initial="hidden" animate="visible" exit="exit"
            variants={containerVariants}
            className="max-w-5xl mx-auto space-y-8"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="relative glass-panel-apple bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-10 overflow-hidden border border-white/50 dark:border-white/10 shadow-xl">
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                    {/* Avatar */}
                    <div className="relative group shrink-0">
                        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-[6px] border-white dark:border-slate-800 shadow-2xl relative bg-slate-100 dark:bg-slate-800">
                            <img src={avatar} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                    <Loader2 className="text-white animate-spin" size={32} />
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all border-[4px] border-white dark:border-slate-900 hover:scale-110 active:scale-95 disabled:opacity-70"
                        >
                            <Camera size={20} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left py-2 space-y-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
                               <Sparkles size={10} /> Premium Member
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">{user.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm mt-1 tracking-wide">
                                UHID: <span className="text-slate-900 dark:text-white font-bold select-all">SHA-8821-9921</span>
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <button className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                                Edit Profile
                            </button>
                            <button className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Settings
                            </button>
                        </div>
                    </div>

                    {/* Right Side Stats / QR */}
                    <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
                            <Activity size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Health Score</p>
                        <div className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">92<span className="text-base text-slate-400 font-sans">/100</span></div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[92%]" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Column */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
                    
                    {/* Vital Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <StatCard icon={Calendar} label="Age" value="29 Yrs" color="bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" />
                        <StatCard icon={Droplets} label="Blood" value={extendedData.bloodGroup} color="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" />
                        <StatCard icon={ArrowUpRight} label="Height" value={extendedData.height} color="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" />
                        <StatCard icon={Weight} label="Weight" value={extendedData.weight} color="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" />
                    </div>

                    {/* Contact Details */}
                    <div className="glass-panel-apple bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl">
                                <UserIcon size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'Email', value: user.email, icon: Mail },
                                { label: 'Phone', value: "+91 98765 43210", icon: Phone },
                                { label: 'Address', value: "12, Gandhi Marg, Bhubaneswar", icon: MapPin },
                                { label: 'Date of Birth', value: extendedData.dob, icon: Calendar },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 transition-colors hover:border-blue-200 dark:hover:border-blue-900">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm">
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column */}
                <motion.div variants={itemVariants} className="space-y-8">
                    
                    {/* Medical Alert */}
                    <div className="glass-panel-apple bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Medical Alert</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Known Allergies</p>
                                <div className="flex flex-wrap gap-2">
                                    {extendedData.allergies.map((allergy, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg border border-red-100 dark:border-red-900/30 flex items-center gap-1.5">
                                            <AlertCircle size={12} /> {allergy}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Emergency Contact</p>
                                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 text-sm">RS</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 dark:text-white truncate">{extendedData.emergencyContact.name}</p>
                                        <p className="text-xs text-slate-500">{extendedData.emergencyContact.relation}</p>
                                    </div>
                                    <button className="w-9 h-9 rounded-xl bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">
                                        <Phone size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Insurance Card */}
                    <div className="glass-panel-apple bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <ShieldCheck size={32} className="text-emerald-400" />
                                <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md">Active</span>
                            </div>
                            
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Insurance Provider</p>
                            <h3 className="text-xl font-display font-bold mb-6">{extendedData.insuranceProvider}</h3>
                            
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Policy Number</p>
                                    <p className="font-mono text-lg tracking-wide">{extendedData.policyNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Valid Till</p>
                                    <p className="font-bold">{extendedData.validTill}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </motion.div>
    );
};

const MyRecords: React.FC = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Medical Records</h2>
               <p className="text-slate-500 dark:text-slate-400 mt-1">Securely stored on the Samhita Vault.</p>
            </div>
            <div className="flex gap-2">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Search records..." className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50" />
               </div>
               <button className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50">
                  <Filter size={18} />
               </button>
            </div>
        </div>

        {/* Drag & Drop Zone */}
        <motion.div variants={itemVariants} className="w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-4 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
               <UploadCloud size={28} className="text-blue-500" />
            </div>
            <div className="text-center">
               <p className="font-bold text-slate-700 dark:text-white">Click to upload or drag and drop</p>
               <p className="text-xs text-slate-400 mt-1">PDF, JPG, or PNG (Max 10MB)</p>
            </div>
        </motion.div>

        {/* Records Table */}
        <motion.div variants={itemVariants} className="glass-panel-apple bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-left border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">File Name / ID</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Size</th>
                            <th className="p-6 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {recordsData.map((record) => (
                            <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-lg">
                                          <FileText size={18} />
                                       </div>
                                       <div>
                                          <p className="font-bold text-slate-900 dark:text-white text-sm">{record.id}</p>
                                          <p className="text-xs text-slate-400 mt-0.5">{record.date}</p>
                                       </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-900/30">
                                        {record.type}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{record.doctor}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{record.facility}</p>
                                </td>
                                <td className="p-6 text-sm text-slate-500 font-mono">
                                    {record.size}
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-colors">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-blue-500 transition-colors">
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    </motion.div>
);

const PatientTelemedicine: React.FC = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest mb-4">
                       <Zap size={12} className="fill-white" /> Live Beta
                    </div>
                    <h2 className="text-4xl font-display font-bold mb-4 leading-tight">Tele-Consultation Lobby</h2>
                    <p className="text-indigo-100 text-lg leading-relaxed">Your secure, high-definition bridge to healthcare professionals. AI-assisted transcription and real-time vitals sync enabled.</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] text-center min-w-[320px] shadow-xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-3">Next Appointment</p>
                    <div className="text-4xl font-display font-bold mb-1">10:00 AM</div>
                    <p className="text-sm font-medium mb-6 opacity-90">Today • Dr. Anjali Gupta</p>
                    <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-3 shadow-lg group">
                        <Video size={20} className="group-hover:scale-110 transition-transform"/> Join Room
                    </button>
                    <p className="text-[10px] mt-4 opacity-60">System checks passed. Camera ready.</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="glass-panel-apple bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Upcoming Schedule</h3>
                <div className="space-y-4">
                    {[1, 2].map((_, i) => (
                        <div key={i} className="flex gap-5 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group cursor-default">
                            <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-sm h-fit text-blue-500">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Follow-up Review</h4>
                                <p className="text-sm text-slate-500 mt-1">Wed, 25 Oct • 04:30 PM</p>
                                <div className="flex items-center gap-2 mt-3">
                                   <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                                   <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Dr. Rao (Neurologist)</p>
                                </div>
                            </div>
                            <div className="ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="p-2 rounded-xl bg-white dark:bg-slate-600 shadow-sm text-slate-400 hover:text-blue-500">
                                  <ArrowUpRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-panel-apple bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Device Health</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl"><Video size={20} /></div>
                            <span className="font-bold text-sm">Camera Access</span>
                        </div>
                        <CheckCircle size={20} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl"><Phone size={20} /></div>
                            <span className="font-bold text-sm">Microphone</span>
                        </div>
                        <CheckCircle size={20} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl"><Activity size={20} /></div>
                            <span className="font-bold text-sm">Network Strength</span>
                        </div>
                        <span className="text-xs font-bold bg-white/50 dark:bg-black/20 px-2 py-1 rounded-lg">Fair (4G)</span>
                    </div>
                </div>
                <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                   Run Diagnostics
                </button>
            </motion.div>
        </div>
    </motion.div>
);

// --- Main Component ---

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, currentView, onUserUpdate }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);

  const renderContent = () => {
    switch(currentView) {
      case 'profile':
        return <PatientProfile user={user} onUserUpdate={onUserUpdate} />;
      case 'records':
        return <MyRecords />;
      case 'telemedicine':
        return <PatientTelemedicine />;
      case 'dashboard':
      default:
        return <DashboardHome user={user} onBookClick={() => setShowBookingModal(true)} onSOSClick={() => setShowSOSModal(true)} />;
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-10">
       <BookAppointmentModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} user={user} />
       <SOSModal isOpen={showSOSModal} onClose={() => setShowSOSModal(false)} />
       
       <AnimatePresence mode='wait'>
          <motion.div
             key={currentView}
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 10 }}
             transition={{ duration: 0.3, ease: "easeOut" }}
          >
             {renderContent()}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};

export default PatientDashboard;
