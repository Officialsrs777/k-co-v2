import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle2, FileText, Loader, Server, Database, Shield, ArrowRight, Calculator, BarChart3, Clock, Zap, Search } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('self-serve');
  
  // --- STATE FOR SELF-SERVE (Scanning Logic) ---
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, scanning, complete
  const [scanStep, setScanStep] = useState(0);
  const scanMessages = ["Connecting to Cloud API...", "Analyzing EC2 Utilization...", "Checking Reserved Instances...", "Calculating Waste..."];

  // --- STATE FOR MANAGED (Live ROI Calculator) ---
  const [spend, setSpend] = useState(50); // Initial $50k
  const [savings, setSavings] = useState(10); // Initial Savings

  // Update savings whenever spend changes (Assume ~22% savings)
  useEffect(() => {
    setSavings(Math.floor(spend * 0.22)); 
  }, [spend]);

  // Handle the "Fake" Scan Process
  const handleScan = () => {
    setUploadStatus('scanning');
    setScanStep(0);

    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= scanMessages.length - 1) {
          clearInterval(interval);
          setUploadStatus('complete');
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  // --- DATA FOR THE CARDS ---
  const selfServeSteps = [
    { id: 1, icon: Upload, title: "Upload CSV", desc: "Drag & drop your AWS, Azure, or GCP billing export." },
    { id: 2, icon: Search, title: "Automated Analysis", desc: "Our engine scans for waste, anomalies, and optimization opportunities." },
    { id: 3, icon: FileText, title: "Report + Forecast", desc: "Get detailed findings, savings recommendations, and 90-day projections." },
    { id: 4, icon: CheckCircle2, title: "Download & Act", desc: "Export PDF report and implement changes on your own timeline." }
  ];

  const managedSteps = [
    { id: 1, icon: Zap, title: "Read-only Integration", desc: "Secure API connections to your cloud, CRM, and data platforms." },
    { id: 2, icon: FileText, title: "90-Day Audit", desc: "Comprehensive baseline analysis and savings roadmap creation." },
    { id: 3, icon: BarChart3, title: "Weekly Optimization", desc: "Engineer-approved pull requests and actionable cost-cutting tasks." },
    { id: 4, icon: Clock, title: "Continuous Monitoring", desc: "Real-time dashboards, alerts, and quarterly business reviews." }
  ];

  const currentSteps = activeTab === 'self-serve' ? selfServeSteps : managedSteps;
  
  // UPDATED: Unified Purple Color Theme for both tabs
  const accentColor = 'text-[#8B2FC9]';
  const bgAccent = 'bg-[#8B2FC9]';
  const borderAccent = 'border-[#8B2FC9]';

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="dashboard">
      
      {/* SECTION HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">How Each Service Works</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Choose your path to cloud cost optimization.
        </p>
      </div>

      {/* --- INTERACTIVE TOGGLE SWITCH --- */}
      <div className="flex justify-center mb-16">
        <div className="relative bg-[#18181b] p-1.5 rounded-full border border-white/10 flex w-[340px] shadow-inner">
          {/* UPDATED: Sliding pill is always purple now */}
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[164px] rounded-full transition-all duration-300 ease-out shadow-lg bg-[#8B2FC9] ${activeTab === 'self-serve' ? 'left-1.5' : 'left-[170px]'}`}
          ></div>

          <button 
            onClick={() => setActiveTab('self-serve')}
            className={`relative z-10 w-1/2 py-3 text-sm font-bold transition-colors duration-300 ${activeTab === 'self-serve' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Self-Serve
          </button>
          <button 
            onClick={() => setActiveTab('managed')}
            className={`relative z-10 w-1/2 py-3 text-sm font-bold transition-colors duration-300 ${activeTab === 'managed' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Managed
          </button>
        </div>
      </div>

      {/* --- STEP CARDS (Visual Workflow) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {currentSteps.map((step, index) => (
          <div key={step.id} className="bg-[#121214] border border-white/10 p-6 rounded-2xl relative group hover:border-white/20 transition-all">
            {/* Connecting Line (Desktop only) */}
            {index < 3 && (
              <div className="hidden lg:block absolute top-8 -right-3 w-6 h-px bg-white/10 z-0"></div>
            )}
            
            <div className={`w-8 h-8 rounded-full ${bgAccent} text-white font-bold flex items-center justify-center text-sm mb-4 relative z-10 shadow-lg`}>
              {step.id}
            </div>
            
            <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${accentColor}`}>
              <step.icon size={24} />
            </div>

            <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* --- INTERACTIVE ACTION AREA (Scanner or Calculator) --- */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* HEADER FOR TOOL */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white">
            {activeTab === 'self-serve' ? 'Try Self-Serve FinOps in 60 Seconds' : 'Estimate Your Managed Savings'}
          </h3>
          <p className="text-gray-400 text-sm">
            {activeTab === 'self-serve' ? 'Upload your cloud billing export and see instant insights.' : 'Based on 20-500 FTE benchmarks.'}
          </p>
        </div>

        {/* CONTAINER */}
        <div className={`max-w-4xl mx-auto bg-[#121214] border ${borderAccent} border-opacity-30 rounded-3xl overflow-hidden shadow-2xl relative p-8`}>
          
          {/* TOOL 1: SELF SERVE SCANNER (UPDATED TO PURPLE) */}
          {activeTab === 'self-serve' && (
            <div className="flex flex-col items-center">
               <div className="w-full max-w-xl bg-black/40 border border-white/10 rounded-2xl p-2 relative min-h-[300px]">
                {uploadStatus === 'idle' && (
                  <div 
                    className="h-[300px] border-2 border-dashed border-[#8B2FC9]/30 hover:border-[#8B2FC9] rounded-xl flex flex-col items-center justify-center bg-[#8B2FC9]/5 transition-all cursor-pointer group"
                    onClick={handleScan}
                  >
                    <div className="w-16 h-16 rounded-full bg-[#8B2FC9]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="text-[#8B2FC9] w-8 h-8" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-1">Drop Billing CSV</h4>
                    <p className="text-gray-500 text-sm">or click to browse</p>
                  </div>
                )}

                {uploadStatus === 'scanning' && (
                  <div className="h-[300px] bg-black rounded-xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    <Loader className="w-12 h-12 text-[#8B2FC9] animate-spin mb-6 relative z-10" />
                    <h3 className="text-white font-mono text-lg font-bold mb-2 relative z-10">Processing Data...</h3>
                    <p className="text-[#8B2FC9] font-mono text-sm animate-pulse relative z-10">{">"} {scanMessages[scanStep]}</p>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full mt-6 overflow-hidden relative z-10">
                      <div className="h-full bg-[#8B2FC9] transition-all duration-700" style={{ width: `${(scanStep + 1) * 25}%` }}></div>
                    </div>
                  </div>
                )}

                {uploadStatus === 'complete' && (
                  <div className="h-[300px] flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 bg-[#8B2FC9]/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                      <CheckCircle2 className="text-[#8B2FC9] w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">$12,450 / mo</h3>
                    <p className="text-gray-400 text-sm mb-6">Potential Savings Found</p>
                    <button className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <FileText size={18} /> Download Report
                    </button>
                    <button onClick={() => setUploadStatus('idle')} className="mt-4 text-xs text-gray-500 underline hover:text-[#8B2FC9]">Scan again</button>
                  </div>
                )}
               </div>
            </div>
          )}

          {/* TOOL 2: MANAGED CALCULATOR (Already Purple) */}
          {activeTab === 'managed' && (
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                 <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <label className="flex justify-between text-sm font-semibold text-gray-300 mb-4">
                       <span>Monthly Cloud Spend</span>
                       <span className="text-white">${spend}k / mo</span>
                    </label>
                    <input 
                       type="range" min="10" max="500" step="5"
                       value={spend} 
                       onChange={(e) => setSpend(Number(e.target.value))}
                       className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8B2FC9]" 
                    />
                 </div>
                 <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    Book Audit Call <ArrowRight size={18} />
                 </button>
               </div>

               <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B2FC9]/20 text-[#8B2FC9] text-xs font-bold uppercase mb-4">
                    <Calculator size={14} /> Live Estimate
                  </div>
                  <p className="text-gray-400 text-sm mb-1">Projected Annual Savings</p>
                  <div className="text-5xl md:text-6xl font-bold text-white mb-4">
                    ${(savings * 12).toLocaleString()}
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                     <p className="flex items-center justify-center md:justify-start gap-2"><CheckCircle2 size={16} className="text-[#8B2FC9]" /> 45-Day ROI Timeframe</p>
                     <p className="flex items-center justify-center md:justify-start gap-2"><CheckCircle2 size={16} className="text-[#8B2FC9]" /> Guaranteed Margin Impact</p>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Dashboard;