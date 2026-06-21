import React, { useState, useEffect } from 'react';
import { X, Database, User, Key, ArrowRight, ShieldCheck, Loader2, Lock, FileBadge, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';
import { MOCK_USERS } from '../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  role: UserRole | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nmcId, setNmcId] = useState('');
  const [imrNumber, setImrNumber] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [step, setStep] = useState<'idle' | 'verifying' | 'success'>('idle');

  useEffect(() => {
    if (isOpen && role) {
      // Find the mock user for this role to auto-fill credentials
      const mockUser = Object.values(MOCK_USERS).find(u => u.role === role);
      if (mockUser) {
        setEmail(mockUser.email);
        setPassword('samhita-secure-pass-8821'); // Mock password
        
        // Auto-fill Doctor specific details
        if (role === UserRole.DOCTOR) {
            setNmcId(mockUser.nmcId || '');
            setImrNumber(mockUser.imrNumber || '');
        }
      }
      setStep('idle');
      setIsAuthenticating(false);
    }
  }, [isOpen, role]);

  if (!isOpen || !role) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setStep('verifying');

    // Simulate database verification connection delay
    setTimeout(() => {
        setStep('success');
        // Short delay to show success state before actual login
        setTimeout(() => {
            onLogin();
        }, 1000);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700 animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/10">
                    <Database size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-white leading-tight">Secure Portal Access</h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Node: {role}
                    </p>
                </div>
            </div>
            <button 
                onClick={onClose} 
                disabled={isAuthenticating}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors disabled:opacity-50"
            >
                <X size={18} />
            </button>
        </div>

        {/* Content */}
        <div className="p-8 bg-slate-50/50 dark:bg-black/20">
            {step === 'success' ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-fade-in-up">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/20 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <ShieldCheck size={48} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Access Granted</h4>
                        <p className="text-slate-500 text-sm font-medium">Redirecting to {role.toLowerCase()} dashboard...</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Standard Email Field */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex justify-between">
                            <span>User ID / Email</span>
                            <span className="text-primary text-[10px]">Auto-Detected</span>
                        </label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input 
                                type="email" 
                                value={email}
                                readOnly
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-700 dark:text-slate-200 font-mono text-sm shadow-sm opacity-90 cursor-default"
                            />
                            <div className="absolute right-4 top-4">
                                <Lock size={14} className="text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* DOCTOR SPECIFIC: NMC & IMR Auto-fill */}
                    {role === UserRole.DOCTOR && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex justify-between">
                                    <span>NMC Reg. ID</span>
                                </label>
                                <div className="relative group">
                                    <FileBadge className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={nmcId}
                                        readOnly
                                        className="w-full pl-9 pr-8 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl outline-none text-slate-700 dark:text-slate-200 font-mono text-xs font-bold shadow-sm cursor-default"
                                    />
                                    <div className="absolute right-3 top-3.5" title="Verified against Registry">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex justify-between">
                                    <span>IMR Number</span>
                                </label>
                                <div className="relative group">
                                    <FileBadge className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={imrNumber}
                                        readOnly
                                        className="w-full pl-9 pr-8 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl outline-none text-slate-700 dark:text-slate-200 font-mono text-xs font-bold shadow-sm cursor-default"
                                    />
                                    <div className="absolute right-3 top-3.5" title="Verified against Registry">
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard Password Field */}
                    <div className="space-y-2">
                         <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex justify-between">
                            <span>Security Token</span>
                            <span className="text-emerald-500 text-[10px]">Encrypted</span>
                        </label>
                        <div className="relative group">
                            <Key className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input 
                                type="password" 
                                value={password}
                                readOnly
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none text-slate-700 dark:text-slate-200 font-mono text-sm shadow-sm opacity-90 cursor-default"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={isAuthenticating}
                            className="w-full btn-futuristic py-4 rounded-xl font-bold flex items-center justify-center gap-2 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isAuthenticating ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Verifying Credentials...</span>
                                </>
                            ) : (
                                <>
                                    <span>Authenticate & Enter</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                        
                        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                            <Lock size={10} />
                            <span>256-bit SSL Encryption Established</span>
                        </div>
                    </div>
                </form>
            )}
        </div>
        
        {/* Loading Bar at bottom */}
        {isAuthenticating && step !== 'success' && (
             <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full overflow-hidden">
                <div className="h-full bg-primary animate-[progress_2s_ease-in-out_infinite] w-full origin-left"></div>
             </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;