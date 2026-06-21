import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { 
  Shield, Server, Users, Activity, AlertTriangle, 
  Database, Lock, Search, Filter, RefreshCw, 
  CheckCircle, XCircle, MoreVertical, Settings, 
  HardDrive, Cpu, Globe, Bell, Power, Save, UploadCloud,
  FileText, MessageSquare, AlertCircle, Check, Clock, Loader2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from '../../components/CountUp';
import { MockDatabase, StorageService } from '../../services/mockDatabase';

interface AdminDashboardProps {
  user: User;
  currentView: string;
  onUserUpdate: (user: User) => void;
}

// --- Mock Data ---
const analyticsData = [
  { name: '00:00', traffic: 4000, load: 24 },
  { name: '04:00', traffic: 3000, load: 18 },
  { name: '08:00', traffic: 2000, load: 15 },
  { name: '12:00', traffic: 2780, load: 35 },
  { name: '16:00', traffic: 1890, load: 48 },
  { name: '20:00', traffic: 2390, load: 38 },
  { name: '23:59', traffic: 3490, load: 30 },
];

const serverStatus = [
  { id: 1, name: 'Auth Server (US-East)', status: 'Online', latency: '24ms', uptime: '99.9%' },
  { id: 2, name: 'AI Inference Node (GPU)', status: 'Busy', latency: '110ms', uptime: '98.5%' },
  { id: 3, name: 'Database Primary', status: 'Online', latency: '45ms', uptime: '99.99%' },
  { id: 4, name: 'Storage Vault (Cold)', status: 'Idle', latency: '-', uptime: '100%' },
];

const mockUsersList = [
  { id: 'u1', name: 'Dr. Anjali Gupta', role: 'Doctor', status: 'Active', joined: 'Oct 2023' },
  { id: 'u2', name: 'Rahul Sharma', role: 'Patient', status: 'Active', joined: 'Nov 2023' },
  { id: 'u3', name: 'Vikram Singh', role: 'Researcher', status: 'Pending', joined: 'Today' },
  { id: 'u4', name: 'Sarah Khan', role: 'Patient', status: 'Suspended', joined: 'Aug 2023' },
];

// --- Sub-Components ---

const SystemMonitor = () => {
  const [cpu, setCpu] = useState(45);
  const [memory, setMemory] = useState(62);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.min(100, Math.max(10, prev + (Math.random() * 20 - 10))));
      setMemory(prev => Math.min(100, Math.max(30, prev + (Math.random() * 10 - 5))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
       <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Cpu size={16} /> CPU Load
             </div>
             <div className="text-3xl font-mono font-bold text-white mb-2">{Math.round(cpu)}%</div>
             <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                   className={`h-full ${cpu > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                   animate={{ width: `${cpu}%` }}
                />
             </div>
          </div>
       </div>
       <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <HardDrive size={16} /> Memory
             </div>
             <div className="text-3xl font-mono font-bold text-white mb-2">{Math.round(memory)}%</div>
             <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                   className={`h-full ${memory > 80 ? 'bg-amber-500' : 'bg-purple-500'}`} 
                   animate={{ width: `${memory}%` }}
                />
             </div>
          </div>
       </div>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  const [logs, setLogs] = useState([
    { id: 1, type: 'info', msg: 'System backup completed successfully.', time: '10:00 AM' },
    { id: 2, type: 'warning', msg: 'High latency detected on Node-3.', time: '10:15 AM' },
    { id: 3, type: 'success', msg: 'New Doctor verified: Dr. A. Gupta', time: '10:45 AM' },
  ]);

  const addLog = () => {
     const msgs = [
        { type: 'info', msg: 'User login from new IP (IN).', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
        { type: 'success', msg: 'Database sync complete.', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
        { type: 'warning', msg: 'API Rate limit approaching.', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
     ];
     const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
     setLogs(prev => [ {id: Date.now(), ...randomMsg}, ...prev.slice(0, 4)]);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
       
       {/* Top Header Stats */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel-apple bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
             <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Users</p>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">
                   <CountUp end={12840} separator="," />
                </h3>
             </div>
             <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <Users size={24} />
             </div>
          </div>
          <div className="glass-panel-apple bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
             <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Health</p>
                <h3 className="text-3xl font-display font-bold text-emerald-500 mt-1">98.2%</h3>
             </div>
             <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                <Activity size={24} />
             </div>
          </div>
          <div className="glass-panel-apple bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
             <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Alerts</p>
                <h3 className="text-3xl font-display font-bold text-amber-500 mt-1">3</h3>
             </div>
             <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                <AlertTriangle size={24} />
             </div>
          </div>
          <div className="glass-panel-apple bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-[2rem] flex flex-col justify-center items-center text-center cursor-pointer hover:scale-105 transition-transform" onClick={addLog}>
             <RefreshCw size={28} className="mb-2" />
             <span className="font-bold text-sm">Run Diagnostics</span>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 glass-panel-apple bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">Network Traffic</h3>
                   <p className="text-sm text-slate-500">Live request volume across all nodes</p>
                </div>
                <div className="flex gap-2">
                   <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                   <span className="text-xs font-bold text-slate-500 uppercase">Requests/Sec</span>
                </div>
             </div>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={analyticsData}>
                      <defs>
                         <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                         contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff'}}
                         itemStyle={{color: '#fff'}}
                      />
                      <Area type="monotone" dataKey="traffic" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Right Column: Server Status & Logs */}
          <div className="space-y-6">
             <SystemMonitor />
             
             <div className="glass-panel-apple bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex-1">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-slate-900 dark:text-white">Audit Log</h3>
                   <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Live</span>
                </div>
                <div className="space-y-4">
                   <AnimatePresence>
                      {logs.map((log) => (
                         <motion.div 
                            key={log.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
                         >
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                               log.type === 'info' ? 'bg-blue-500' : 
                               log.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} />
                            <div>
                               <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{log.time}</p>
                               <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{log.msg}</p>
                            </div>
                         </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
             </div>
          </div>
       </div>

       {/* Infrastructure Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serverStatus.map(server => (
             <div key={server.id} className="glass-panel-apple bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-violet-500/50 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                   <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:text-violet-500 transition-colors">
                      <Server size={18} />
                   </div>
                   <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                      server.status === 'Online' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                      server.status === 'Busy' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                   }`}>
                      {server.status}
                   </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{server.name}</h4>
                <div className="flex justify-between text-xs text-slate-500">
                   <span>Lat: {server.latency}</span>
                   <span>Up: {server.uptime}</span>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const AdminProfile: React.FC<{ user: User; onUserUpdate: (user: User) => void }> = ({ user, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: 'Super Admin',
    clearance: 'Level 5 (Root)',
    department: 'IT Operations',
    maintenanceMode: false,
    twoFactor: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        // Sync with mock DB
        onUserUpdate({ ...user, name: formData.name, email: formData.email, avatar });
        alert("Admin profile settings updated successfully.");
    }, 1500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
          try {
              const url = await StorageService.uploadImage(e.target.files[0]);
              setAvatar(url);
          } catch (err) {
              console.error(err);
          }
      }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 400, damping: 25 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8"
    >
       {/* Header Card */}
       <motion.div variants={itemVariants} className="relative glass-panel-apple bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden group">
          {/* Animated Background Gradient */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start mt-12">
             {/* Avatar with Ring Animation */}
             <div className="relative group/avatar">
                <motion.div 
                   whileHover={{ scale: 1.05 }}
                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-white relative z-10"
                >
                   <img src={avatar} className="w-full h-full object-cover" alt="Admin" />
                </motion.div>
                {/* Glowing ring behind */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-[2.8rem] blur-xl opacity-40 group-hover/avatar:opacity-60 transition-opacity duration-500 -z-0"></div>
                
                <label className="absolute -bottom-3 -right-3 z-20 p-3 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-110 active:scale-95 border-4 border-white dark:border-slate-900">
                   <UploadCloud size={18} />
                   <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
             </div>
             
             <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                   <div>
                      <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">{formData.name}</h2>
                      <div className="flex items-center gap-2 mt-2">
                         <span className="px-3 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-200 dark:border-violet-800">
                            {formData.role}
                         </span>
                         <span className="text-slate-400 text-sm font-mono">• {formData.department}</span>
                      </div>
                   </div>
                   
                   <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 relative overflow-hidden"
                   >
                      <AnimatePresence mode="wait">
                        {isSaving ? (
                           <motion.div 
                             key="loading"
                             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                           >
                              <Loader2 size={18} className="animate-spin" />
                           </motion.div>
                        ) : (
                           <motion.div
                             key="idle"
                             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                             className="flex items-center gap-2"
                           >
                              <Save size={18} /> <span>Save Changes</span>
                           </motion.div>
                        )}
                      </AnimatePresence>
                   </motion.button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1 transition-colors group-focus-within:text-violet-500">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500/50 font-medium dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                      />
                   </div>
                   <div className="space-y-2 group">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1 transition-colors group-focus-within:text-violet-500">Email Address</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500/50 font-medium dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                      />
                   </div>
                </div>
             </div>
          </div>
       </motion.div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Security Card */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             
             <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                   <Shield size={22} /> 
                </div>
                Security Protocol
             </h3>
             
             <div className="space-y-4">
                <motion.div 
                   className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 cursor-pointer"
                   onClick={() => setFormData({...formData, twoFactor: !formData.twoFactor})}
                   whileHover={{ scale: 1.01 }}
                   whileTap={{ scale: 0.99 }}
                >
                   <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white">Two-Factor Auth</p>
                      <p className="text-xs text-slate-500 mt-0.5">Hardware key or Authenticator App</p>
                   </div>
                   <div className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors duration-300 ${formData.twoFactor ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      <motion.div 
                         layout
                         transition={{ type: "spring", stiffness: 500, damping: 30 }}
                         className={`w-6 h-6 bg-white rounded-full shadow-md ${formData.twoFactor ? 'ml-auto' : 'ml-0'}`}
                      />
                   </div>
                </motion.div>

                <motion.button 
                   whileHover={{ scale: 1.02, backgroundColor: "rgba(241, 245, 249, 1)" }}
                   whileTap={{ scale: 0.98 }}
                   className="w-full py-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                >
                   Rotate API Keys
                </motion.button>
             </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

             <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-xl">
                   <AlertTriangle size={22} />
                </div>
                Critical Actions
             </h3>
             
             <div className="space-y-4">
                <motion.div 
                   className="flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 cursor-pointer"
                   onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
                   whileHover={{ scale: 1.01 }}
                   whileTap={{ scale: 0.99 }}
                >
                   <div className="flex-1">
                      <p className="font-bold text-red-900 dark:text-red-200">Maintenance Mode</p>
                      <p className="text-xs text-red-700/60 dark:text-red-300/60">Suspend all non-admin access</p>
                   </div>
                   <div className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors duration-300 ${formData.maintenanceMode ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      <motion.div 
                         layout
                         transition={{ type: "spring", stiffness: 500, damping: 30 }}
                         className={`w-6 h-6 bg-white rounded-full shadow-md ${formData.maintenanceMode ? 'ml-auto' : 'ml-0'}`}
                      />
                   </div>
                </motion.div>

                <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="w-full py-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-2xl text-sm font-bold hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                >
                   Flush System Cache
                </motion.button>
             </div>
          </motion.div>
       </div>
    </motion.div>
  );
};

const UserManagement = () => {
   const [users, setUsers] = useState(mockUsersList);
   
   const toggleStatus = (id: string) => {
      setUsers(users.map(u => 
         u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
      ));
   };

   return (
      <div className="space-y-6 animate-fade-in-up">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Directory</h2>
            <div className="flex gap-2">
               <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
               </div>
               <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <Filter size={20} className="text-slate-500" />
               </button>
            </div>
         </div>

         <div className="glass-panel-apple bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800">
            <table className="w-full">
               <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                     <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map(u => (
                     <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                                 {u.name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{u.role}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                              u.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                              u.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                              'bg-red-50 text-red-600 border-red-200'
                           }`}>
                              {u.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{u.joined}</td>
                        <td className="px-6 py-4 text-right">
                           <button 
                              onClick={() => toggleStatus(u.id)}
                              className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                           >
                              <Power size={16} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

const ComplianceHub = () => {
   const [activeTab, setActiveTab] = useState<'audit' | 'feedback'>('feedback');
   
   const mockComplaints = [
      { id: 1, user: 'Rahul Sharma', role: 'Patient', type: 'Usability', severity: 'Low', msg: "The UI is a bit confusing on the appointment page. I couldn't find the cancel button easily.", date: '2 hrs ago', status: 'New', avatar: 'https://picsum.photos/seed/rahul/200' },
      { id: 2, user: 'Dr. Anjali Gupta', role: 'Doctor', type: 'Performance', severity: 'High', msg: "The telemedicine video feed lags when I switch tabs. Please optimize for multitasking.", date: '5 hrs ago', status: 'In Progress', avatar: 'https://picsum.photos/seed/anjali/200' },
      { id: 3, user: 'Dr. Vikram Singh', role: 'Researcher', type: 'Feature Request', severity: 'Medium', msg: "I need granular filters for the 'Prakriti' data in the cohort builder. Currently it's too broad.", date: '1 day ago', status: 'Review', avatar: 'https://picsum.photos/seed/vikram/200' },
      { id: 4, user: 'Sarah Khan', role: 'Patient', type: 'Accessibility', severity: 'Medium', msg: "Dark mode text contrast is too low on the medication reminders.", date: '2 days ago', status: 'Resolved', avatar: 'https://picsum.photos/seed/sarah/200' },
   ];

   const mockAudits = [
      { id: 'LOG-001', event: 'HIPAA Data Access', user: 'System', status: 'Pass', time: '10:00 AM' },
      { id: 'LOG-002', event: 'GDPR Consent Check', user: 'Admin', status: 'Pass', time: '09:45 AM' },
      { id: 'LOG-003', event: 'Encryption Key Rotation', user: 'System', status: 'Pass', time: '04:00 AM' },
      { id: 'LOG-004', event: 'Failed Login Attempt', user: 'Unknown IP', status: 'Flagged', time: '02:30 AM' },
   ];

   return (
      <div className="animate-fade-in-up space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
               <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Compliance Hub</h2>
               <p className="text-slate-500 mt-1">Manage system audits and user feedback reports.</p>
            </div>
            
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
               <button 
                  onClick={() => setActiveTab('feedback')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'feedback' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
               >
                  User Feedback
               </button>
               <button 
                  onClick={() => setActiveTab('audit')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'audit' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
               >
                  Audit Logs
               </button>
            </div>
         </div>

         {activeTab === 'feedback' && (
            <div className="grid gap-4">
               {mockComplaints.map((item) => (
                  <motion.div 
                     key={item.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="glass-panel-apple bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-6 hover:border-violet-500/30 transition-colors"
                  >
                     <div className="flex-shrink-0">
                        <img src={item.avatar} alt={item.user} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
                     </div>
                     <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                           <div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                                 {item.user} 
                                 <span className="text-xs font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">{item.role}</span>
                              </h4>
                              <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                                 <Clock size={12} /> {item.date} • {item.type}
                              </p>
                           </div>
                           <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              item.severity === 'High' ? 'bg-red-50 text-red-600 border-red-200' :
                              item.severity === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                              'bg-blue-50 text-blue-600 border-blue-200'
                           }`}>
                              {item.severity} Priority
                           </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                           "{item.msg}"
                        </p>
                     </div>
                     <div className="flex flex-row md:flex-col gap-2 justify-center min-w-[120px]">
                        {item.status === 'Resolved' ? (
                           <span className="flex items-center justify-center gap-1 text-emerald-500 font-bold text-sm">
                              <CheckCircle size={16} /> Resolved
                           </span>
                        ) : (
                           <>
                              <button className="flex-1 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                                 Resolve
                              </button>
                              <button className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                 Acknowledge
                              </button>
                           </>
                        )}
                     </div>
                  </motion.div>
               ))}
            </div>
         )}

         {activeTab === 'audit' && (
            <div className="glass-panel-apple bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800">
               <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                     <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Log ID</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Event</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Initiator</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                     {mockAudits.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                           <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.id}</td>
                           <td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-sm">{log.event}</td>
                           <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{log.user}</td>
                           <td className="px-6 py-4">
                              <span className={`flex items-center gap-1 text-xs font-bold ${
                                 log.status === 'Pass' ? 'text-emerald-500' : 'text-red-500'
                              }`}>
                                 {log.status === 'Pass' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                 {log.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right text-sm text-slate-500 font-mono">{log.time}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
};

// --- Main Component ---

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, currentView, onUserUpdate }) => {
  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <AdminProfile user={user} onUserUpdate={onUserUpdate} />;
      case 'users':
        return <UserManagement />;
      case 'compliance':
        return <ComplianceHub />;
      case 'dashboard':
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-10">
       <AnimatePresence mode='wait'>
          <motion.div
             key={currentView}
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 10 }}
             transition={{ duration: 0.3 }}
          >
             {renderContent()}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;