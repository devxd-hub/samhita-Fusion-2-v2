
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import Footer from '../components/Footer';
import CountUp from '../components/CountUp';
import { UserRole } from '../types';
import { 
  FileText, Database, Network, Microscope, ArrowRight, ArrowLeft,
  Search, Clock, Activity, Zap, GitBranch, Globe, Filter, Sparkles, X, CheckCircle, Download, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResearchProps {
  onLoginClick: (role: UserRole) => void;
}

// --- Enhanced Mock Data ---
const papers = [
  {
    id: 'p1',
    category: 'Ayurveda',
    title: 'Ashwagandha & Cortisol: A Clinical Study',
    author: 'Dr. Aditi Rao, AIIMS',
    date: 'Oct 12, 2023',
    citations: 142,
    abstract: 'A double-blind, placebo-controlled study observing the impact of high-concentration full-spectrum Ashwagandha root extract on stress resistance and cortisol levels in 600 adults.',
    detailedSummary: 'This comprehensive study investigates the adaptogenic properties of Ashwagandha (Withania somnifera) in a controlled clinical setting. Over a period of 60 days, 600 participants were administered high-concentration root extract. The results demonstrate a statistically significant reduction in serum cortisol levels (p<0.001) compared to the placebo group. Participants also reported improved sleep quality and reduced perceived stress scores (PSS). This research validates ancient Ayurvedic claims regarding Ashwagandha\'s role in "Rasayana" (rejuvenation) therapies through modern biochemical markers.',
    keyFindings: ['27.9% reduction in serum cortisol', 'Improved sleep quality index (PSQI)', 'No significant side effects observed'],
    tags: ['Stress', 'Endocrinology', 'Herbal'],
    color: 'from-green-500/20 to-emerald-500/5 border-green-500/30 text-green-400'
  },
  {
    id: 'p2',
    category: 'Allopathy',
    title: 'mRNA Efficacy in Post-Viral Fatigue',
    author: 'Dr. James Carter, John Hopkins',
    date: 'Nov 05, 2023',
    citations: 89,
    abstract: 'Analyzing the long-term immune response of mRNA therapeutics in treating chronic fatigue syndrome following viral infections, utilizing global patient cohorts.',
    detailedSummary: 'This paper explores the potential of targeted mRNA sequences to modulate immune responses in patients suffering from Post-Viral Fatigue Syndrome (PVFS). Utilizing a multi-center cohort approach, the study tracks biomarker shifts over 12 months. Early data suggests that reprogramming specific T-cell responses can alleviate fatigue symptoms by up to 40%.',
    keyFindings: ['T-cell modulation achieved in 65% of subjects', 'Fatigue severity scale reduced by 40%', 'Correlation found between viral load and recovery rate'],
    tags: ['Immunology', 'Virology', 'Genetics'],
    color: 'from-blue-500/20 to-indigo-500/5 border-blue-500/30 text-blue-400'
  },
  {
    id: 'p3',
    category: 'Homeopathy',
    title: 'Arnica Montana in Post-Op Recovery',
    author: 'Dr. Sarah Jenkins, Royal London',
    date: 'Sep 20, 2023',
    citations: 56,
    abstract: 'Comparative analysis of Arnica Montana 30C versus placebo in reducing inflammation and pain scores in patients undergoing maxillofacial surgery.',
    detailedSummary: 'Focusing on maxillofacial surgery recovery, this double-blind trial evaluates the efficacy of Arnica Montana 30C. Patients receiving the homeopathic intervention showed a 22% faster reduction in visible swelling compared to the placebo group. Pain scores (VAS) were consistently lower on post-op days 1 through 3.',
    keyFindings: ['22% faster reduction in swelling', 'Lower analgesic consumption in test group', 'Statistically significant for acute trauma'],
    tags: ['Surgery', 'Pain Mgmt', 'Holistic'],
    color: 'from-purple-500/20 to-fuchsia-500/5 border-purple-500/30 text-purple-400'
  },
  {
    id: 'p4',
    category: 'Integrated',
    title: 'Type 2 Diabetes: The Dual Protocol',
    author: 'Samhita Research Group',
    date: 'Dec 01, 2023',
    citations: 210,
    abstract: 'A landmark study combining Metformin therapy with specific Yoga Asanas and bitter gourd supplementation. Results show a 40% higher reduction in HbA1c compared to monotherapy.',
    detailedSummary: 'This landmark integrated study combines standard Metformin therapy with a strict regimen of "Mandukasana" (Frog Pose) and Momordica charantia (Bitter Gourd) supplementation. The dual protocol approach showed a synergistic effect, lowering HbA1c levels significantly more than Metformin alone, suggesting a pathway for reduced drug dependency.',
    keyFindings: ['40% greater reduction in HbA1c', 'Reduced dependency on synthetic insulin', 'Improved pancreatic beta-cell function'],
    tags: ['Metabolic', 'Yoga', 'Pharmacology'],
    color: 'from-orange-500/20 to-amber-500/5 border-orange-500/30 text-orange-400'
  },
  {
    id: 'p5',
    category: 'Ayurveda',
    title: 'Turmeric Curcuminoids in Arthritis',
    author: 'Vaidya S. Sharma',
    date: 'Aug 15, 2023',
    citations: 115,
    abstract: 'Evaluating the bioavailability of curcumin with piperine in reducing joint inflammation markers (CRP, ESR) in elderly patients with Rheumatoid Arthritis.',
    detailedSummary: 'Curcumin, the active compound in Turmeric, often suffers from poor bioavailability. This study utilizes a nano-emulsified formulation with Piperine. Clinical trials on 300 elderly arthritis patients indicate that this formulation rivals non-steroidal anti-inflammatory drugs (NSAIDs) in reducing CRP and ESR markers without gastrointestinal side effects.',
    keyFindings: ['Bioavailability increased by 2000%', 'CRP levels dropped by 35%', 'No GI toxicity observed'],
    tags: ['Inflammation', 'Geriatrics', 'Supplements'],
    color: 'from-green-500/20 to-emerald-500/5 border-green-500/30 text-green-400'
  },
  {
    id: 'p6',
    category: 'Allopathy',
    title: 'Robotic Surgery & Recovery Metrics',
    author: 'Dr. K. Patel',
    date: 'Jan 10, 2024',
    citations: 45,
    abstract: 'Quantifying the reduction in hospital stay duration and post-operative infection rates using AI-assisted Da Vinci surgical systems.',
    detailedSummary: 'A retrospective analysis of 1,000 surgical procedures comparing manual laparoscopic techniques vs. AI-assisted robotic systems. The data highlights a 30% reduction in hospital stay duration and a significant drop in post-operative infection rates due to superior precision and smaller incision sites.',
    keyFindings: ['Hospital stay reduced by 1.5 days', 'Infection rate dropped to <1%', 'Higher precision in tissue resection'],
    tags: ['Surgery', 'Tech', 'Hospital Ops'],
    color: 'from-blue-500/20 to-cyan-500/5 border-blue-500/30 text-blue-400'
  }
];

// --- Modal Component ---
const ResearchDetailModal: React.FC<{ paper: typeof papers[0] | null; onClose: () => void }> = ({ paper, onClose }) => {
  if (!paper) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header Graphic */}
        <div className={`h-32 bg-gradient-to-r ${paper.color.replace('text-', 'from-').split(' ')[0]} to-transparent relative p-8 flex items-end`}>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
           >
              <X size={20} />
           </button>
           <span className="relative z-10 px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest border border-white/20">
              {paper.category} Research
           </span>
        </div>

        <div className="p-8 space-y-8">
           {/* Title & Author */}
           <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                 {paper.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                 <span className="flex items-center gap-1.5 font-medium"><div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">DR</div> {paper.author}</span>
                 <span>•</span>
                 <span className="font-mono">{paper.date}</span>
                 <span>•</span>
                 <span className="text-primary font-bold">{paper.citations} Citations</span>
              </div>
           </div>

           {/* Detailed Summary */}
           <div className="bg-slate-50 dark:bg-black/20 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
              <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
                 <FileText size={16} /> Detailed Summary
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                 {paper.detailedSummary}
              </p>
           </div>

           {/* Key Findings */}
           <div>
              <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                 <Sparkles size={16} /> Key Findings
              </h3>
              <div className="grid gap-3">
                 {paper.keyFindings.map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                       <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                       <span className="text-slate-700 dark:text-slate-200 font-medium">{finding}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Tags */}
           <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              {paper.tags.map(tag => (
                 <span key={tag} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold border border-slate-200 dark:border-slate-700">
                    #{tag}
                 </span>
              ))}
           </div>

           {/* Actions */}
           <div className="flex gap-4">
              <button className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-transform">
                 <Download size={18} /> Download PDF
              </button>
              <button className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                 <Database size={18} /> Raw Data
              </button>
              <button className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                 <Share2 size={18} />
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

const Research: React.FC<ResearchProps> = ({ onLoginClick }) => {
  const [hoveredPaper, setHoveredPaper] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPaper, setSelectedPaper] = useState<typeof papers[0] | null>(null);

  const stats = [
    { label: 'Live Nodes', value: <CountUp end={4209} separator="," duration={2.5} />, icon: Activity, color: 'text-emerald-400' },
    { label: 'Data Points', value: <CountUp end={8.5} suffix="M+" decimals={1} duration={2} />, icon: Database, color: 'text-blue-400' },
    { label: 'Global Citations', value: <CountUp end={142} suffix="k" duration={2} />, icon: Globe, color: 'text-purple-400' },
    { label: 'Active Studies', value: <CountUp end={38} duration={1.5} />, icon: Microscope, color: 'text-amber-400' },
  ];

  const categories = ['All', 'Ayurveda', 'Allopathy', 'Homeopathy', 'Integrated'];

  const filteredPapers = activeFilter === 'All' 
    ? papers 
    : papers.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg font-sans transition-colors duration-700 selection:bg-teal-500/30 overflow-x-hidden">
      <ParticleBackground />
      
      {/* Return to Hub Button */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-50 flex items-center gap-3 px-5 py-3 bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-full shadow-sm hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 group"
      >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
             Return to Hub
          </span>
      </Link>

      <AnimatePresence>
         {selectedPaper && <ResearchDetailModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />}
      </AnimatePresence>

      {/* Futuristic Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
           <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
              Samhita Neural Network V2.4
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-slate-900 dark:text-white mb-8 tracking-tight leading-[0.9]">
            <span className="block animate-fade-in-up delay-100 opacity-50 text-3xl md:text-5xl lg:text-6xl font-light mb-2">Decrypting The</span>
            <span className="block animate-fade-in-up delay-200 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 filter drop-shadow-2xl">
              LANGUAGE OF HEALING
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in-up delay-300">
            A decentralized archive where <span className="text-slate-900 dark:text-white font-medium">Ancient Protocols</span> meet <span className="text-slate-900 dark:text-white font-medium">Molecular Science</span>. 
            Access real-time clinical data streams and peer-reviewed comparative studies.
          </p>

          {/* Search Interface */}
          <div className="max-w-2xl mx-auto relative group animate-fade-in-up delay-500">
             <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
             <div className="relative flex items-center bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-white/10 p-2 shadow-2xl">
                <Search className="ml-4 text-slate-400 group-hover:text-teal-400 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search metadata, compounds, or diseases..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-white placeholder:text-slate-400 h-12 px-4 font-mono text-sm"
                />
                <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm tracking-wide hover:scale-105 transition-transform">
                   INITIALIZE
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Live Stats HUD */}
      <div className="w-full border-y border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md mb-20 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-4 group cursor-default">
                     <div className={`p-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon size={20} />
                     </div>
                     <div>
                        <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white tracking-tighter group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                           {stat.value}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-500">
                           {stat.label}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
         <div className="grid md:grid-cols-3 gap-8">
            {[
               { icon: Database, title: "Unified Datasets", desc: "Synthesizing Allopathic vitals with Ayurvedic Prakriti data points." },
               { icon: GitBranch, title: "Cross-Disciplinary", desc: "Bridging molecular biology with holistic methodologies." },
               { icon: Zap, title: "AI-Powered Analysis", desc: "Samhita Engine identifying patterns invisible to standard models." }
            ].map((item, i) => (
               <div key={i} className="group p-8 rounded-3xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/5 backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/10 dark:to-white/5 rounded-2xl flex items-center justify-center mb-6 text-slate-700 dark:text-white shadow-inner group-hover:scale-110 transition-transform duration-500">
                     <item.icon size={24} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-3 group-hover:text-teal-500 transition-colors">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                     {item.desc}
                  </p>
               </div>
            ))}
         </div>
      </section>

      {/* Research Papers Grid */}
      <section className="relative z-10 pb-32">
         <div className="max-w-7xl mx-auto px-6">
            
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
               <div className="flex items-center gap-2">
                  <div className="p-2 bg-teal-500/10 rounded-lg text-teal-500">
                     <Filter size={20} />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-slate-800 dark:text-white">Archive Access</h2>
               </div>
               
               <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 backdrop-blur-sm">
                  {categories.map((cat) => (
                     <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                           activeFilter === cat 
                              ? 'bg-white dark:bg-teal-500 text-slate-900 dark:text-white shadow-md' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                     >
                        {cat}
                     </button>
                  ))}
               </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredPapers.map((paper) => (
                  <div 
                     key={paper.id}
                     className="group relative h-[420px] perspective-1000"
                     onMouseEnter={() => setHoveredPaper(paper.id)}
                     onMouseLeave={() => setHoveredPaper(null)}
                  >
                     <div className="relative h-full w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-lg transition-all duration-500 ease-out overflow-hidden flex flex-col group-hover:border-teal-500/40 group-hover:shadow-[0_20px_50px_rgba(20,184,166,0.2)] group-hover:scale-[1.02] group-hover:-translate-y-2">
                        
                        {/* Static Content */}
                        <div className="p-8 flex-1 flex flex-col">
                           <div className="flex justify-between items-start mb-6">
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border bg-gradient-to-r ${paper.color} shadow-sm`}>
                                 {paper.category}
                              </span>
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                 <FileText size={14} />
                              </div>
                           </div>

                           <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white mb-3 leading-tight group-hover:text-teal-500 transition-colors duration-300">
                              {paper.title}
                           </h3>
                           
                           <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono mb-6">
                              <span className="flex items-center gap-1"><Clock size={12}/> {paper.date}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                              <span>{paper.author}</span>
                           </div>

                           <div className="mt-auto flex flex-wrap gap-2">
                              {paper.tags.map(tag => (
                                 <span key={tag} className="text-[10px] font-bold uppercase text-slate-400 border border-slate-200 dark:border-white/10 px-2 py-1 rounded hover:border-teal-500/50 hover:text-teal-500 transition-colors cursor-default">
                                    #{tag}
                                 </span>
                              ))}
                           </div>
                        </div>

                        {/* Interactive Holographic Overlay */}
                        <div className={`absolute inset-0 bg-slate-900/95 dark:bg-black/95 backdrop-blur-xl p-8 flex flex-col justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${hoveredPaper === paper.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
                           
                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-blue-400 to-purple-500"></div>
                           
                           <div className="mb-6 transform transition-all duration-500 delay-100">
                              <h4 className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
                                 <Sparkles size={12} /> Abstract View
                              </h4>
                              <p className="text-slate-300 text-sm leading-relaxed font-light">
                                 {paper.abstract}
                              </p>
                           </div>

                           <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-white/10">
                              <div className="text-center p-2 rounded bg-white/5">
                                 <div className="text-lg font-mono font-bold text-white">{paper.citations}</div>
                                 <div className="text-[10px] text-slate-500 uppercase tracking-wider">Citations</div>
                              </div>
                              <div className="text-center p-2 rounded bg-white/5">
                                 <div className="text-lg font-mono font-bold text-emerald-400">98%</div>
                                 <div className="text-[10px] text-slate-500 uppercase tracking-wider">Reliability</div>
                              </div>
                           </div>

                           <button 
                              onClick={() => setSelectedPaper(paper)}
                              className="w-full group/btn relative overflow-hidden rounded-xl bg-white text-slate-900 py-4 font-bold text-sm tracking-wide transition-transform active:scale-95"
                           >
                              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                              <span className="relative flex items-center justify-center gap-2 group-hover/btn:text-white transition-colors">
                                 ACCESS FULL DATA <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                              </span>
                           </button>
                        </div>

                     </div>
                  </div>
               ))}
            </div>

            {/* Access CTA */}
            <div className="mt-24 text-center">
               <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500">
                  <button 
                     onClick={() => onLoginClick(UserRole.RESEARCHER)}
                     className="px-10 py-5 bg-slate-900 rounded-full text-white font-bold tracking-widest uppercase hover:bg-black transition-colors flex items-center gap-3 group"
                  >
                     <Network className="group-hover:rotate-180 transition-transform duration-700" size={20} />
                     Connect to Neural Network
                  </button>
               </div>
            </div>

         </div>
      </section>

      <Footer />
    </div>
  );
};

export default Research;
