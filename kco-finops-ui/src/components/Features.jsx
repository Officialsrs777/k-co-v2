import React from 'react';
import { Clock, Activity, ArrowRight, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-16 bg-[#0f0f11] relative overflow-hidden" id="services">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#8B2FC9]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B2FC9]/10 text-[#8B2FC9] text-xs font-bold uppercase mb-3 border border-[#8B2FC9]/20">
             <MoreHorizontal size={14} /> Service Models
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Cloud FinOps <span className="text-[#8B2FC9]">Service Models</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed">
            Choose the engagement model that fits your maturity level—from fast insights on historical data to continuous, real-time cost intelligence.
          </p>
        </div>

        {/* --- SERVICE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* === CARD 1: FINOPS SNAPSHOT (The Audit) === */}
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 hover:border-blue-500/50 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            
            <div className="relative z-10 flex-1">
                {/* Header Area */}
                <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Clock className="text-blue-400" size={24} />
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-bold uppercase tracking-wide">Quick Start</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-bold uppercase tracking-wide">Fixed Cost</span>
                </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-2">FinOps Snapshot™</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 h-16">
                A fixed-duration engagement (3-4 weeks) to analyze a defined window of cloud data, surface cost drivers, and identify immediate quick wins.
                </p>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>

                {/* Feature List (Bulleted) */}
                <div className="flex-1 space-y-4 mb-8">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Key Features</p>
                    <FeatureItem text="Uses 30–90 days of AWS / Azure / GCP billing & usage data" color="blue" />
                    <FeatureItem text="Identifies idle resources, overprovisioning, and pricing inefficiencies" color="blue" />
                    <FeatureItem text="Reviews Savings Plans / Reserved Instance coverage" color="blue" />
                    <FeatureItem text="Delivers executive dashboards and a prioritized savings plan" color="blue" />
                </div>
            </div>

            {/* Footer / CTA (Full Width) */}
            <div className="mt-auto pt-5 border-t border-white/5 relative z-10">
               <button className="w-full py-3.5 bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 rounded-xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 group">
                  Learn More 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-blue-400" />
               </button>
            </div>
          </div>

          {/* === CARD 2: FINOPS CONTINUOUS INTEGRATION === */}
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-6 hover:border-green-500/50 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            <div className="relative z-10 flex-1">
                {/* Header Area */}
                <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <Activity className="text-green-400" size={24} />
                </div>
                <div className="flex flex-col gap-1.5 items-end">
                    <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-bold uppercase tracking-wide">Continuous</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-bold uppercase tracking-wide">Always On</span>
                </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-2">FinOps Continuous Integration™</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 h-16">
                An always-on FinOps operating model with real-time cloud data ingestion, continuous optimization, and a weekly savings cadence.
                </p>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>

                {/* Feature List (Bulleted) */}
                <div className="flex-1 space-y-4 mb-8">
                    <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Key Features</p>
                    <FeatureItem text="Real-time ingestion of cloud billing and usage data" color="green" />
                    <FeatureItem text="Continuous waste detection and spend anomaly alerts" color="green" />
                    <FeatureItem text="Ongoing commitment strategy (Savings Plans / RIs)" color="green" />
                    <FeatureItem text="Weekly executive-ready insights and action memos" color="green" />
                </div>
            </div>

            {/* Footer / CTA (Full Width) */}
            <div className="mt-auto pt-5 border-t border-white/5 relative z-10">
               <button className="w-full py-3.5 bg-white/5 hover:bg-green-500/10 border border-white/10 hover:border-green-500/30 rounded-xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 group">
                  Learn More 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-green-400" />
               </button>
            </div>
          </div>

        </div>

        {/* === BOTTOM CTA === */}
        <div className="w-full bg-[#0a0a0c] border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(139,47,201,0.05)_50%,transparent_75%,transparent_100%)] bg-[size:250%_250%] pointer-events-none"></div>
           
           <h4 className="text-lg font-bold text-white mb-2 relative z-10">Not Sure Which Model Fits?</h4>
           <p className="text-gray-400 text-sm mb-5 max-w-2xl mx-auto relative z-10">
             Most companies start with a <span className="text-white font-medium">FinOps Snapshot™</span> to identify quick wins, then transition to <span className="text-white font-medium">FinOps Continuous Integration™</span> for ongoing optimization.
           </p>
           
           <button className="px-8 py-3 bg-[#8B2FC9] hover:bg-[#7a25b3] text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-900/30 relative z-10 text-sm">
             Book a Free Consultation
           </button>
        </div>

      </div>
    </section>
  );
};

// Helper Component: Uses a Bullet Point with dynamic color
const FeatureItem = ({ text, color }) => {
    const bgColor = color === 'blue' ? 'bg-blue-400' : 'bg-green-400';
    const shadowColor = color === 'blue' ? 'shadow-[0_0_8px_#60a5fa]' : 'shadow-[0_0_8px_#4ade80]';

    return (
        <div className="flex items-start gap-3 group/item">
            <div className="mt-1.5 min-w-[8px]">
            <div className={`w-2 h-2 rounded-full ${bgColor} ${shadowColor} group-hover/item:scale-125 transition-transform`}></div>
            </div>
            <p className="text-sm text-gray-300 leading-snug">{text}</p>
        </div>
    );
};

export default Features;