import React from 'react';
import { TrendingUp, AlertTriangle, Target, Search } from 'lucide-react';

const FinOpsSection = () => {
  return (
    <section className="py-24 bg-[#0f0f11] relative overflow-hidden">
      {/* Decorative background line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-900/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Why <span className="text-[#8B2FC9]">FinOps</span> Matters Now
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Cloud spending is the new "dark matter" of the enterprise. Without FinOps, 
            speed kills margins. We help you move fast <em>without</em> breaking the bank.
          </p>
        </div>

        {/* The Grid: 2x2 Layout */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
          
          {/* Item 1: The Problem (Waste) */}
          <div className="flex gap-6 group">
            <div className="shrink-0 w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
              <AlertTriangle className="text-red-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl text-white font-bold mb-2">Stop the Bleeding</h3>
              <p className="text-gray-400 leading-relaxed">
                30% of cloud spend is typically wasted on idle resources and over-provisioning. 
                We ingest your AWS/Azure billing to surface this waste instantly.
              </p>
            </div>
          </div>

          {/* Item 2: The Goal (Margins) */}
          <div className="flex gap-6 group">
            <div className="shrink-0 w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl text-white font-bold mb-2">Expand Margins</h3>
              <p className="text-gray-400 leading-relaxed">
                Every dollar saved on cloud infrastructure goes directly to your bottom line. 
                We help leaders hit plan and improve commitment coverage.
              </p>
            </div>
          </div>

          {/* Item 3: The Method (Visibility) */}
          <div className="flex gap-6 group">
            <div className="shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <Search className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl text-white font-bold mb-2">Granular Visibility</h3>
              <p className="text-gray-400 leading-relaxed">
                You can't fix what you can't see. We provide executive-ready dashboards 
                that connect engineering activity to financial outcomes.
              </p>
            </div>
          </div>

          {/* Item 4: The Outcome (Predictability) */}
          <div className="flex gap-6 group">
            <div className="shrink-0 w-12 h-12 rounded-lg bg-[#8B2FC9]/10 flex items-center justify-center border border-[#8B2FC9]/20 group-hover:bg-[#8B2FC9]/20 transition-colors">
              <Target className="text-[#8B2FC9]" size={24} />
            </div>
            <div>
              <h3 className="text-xl text-white font-bold mb-2">Forecast with Confidence</h3>
              <p className="text-gray-400 leading-relaxed">
                No more end-of-month surprises. Get a weekly "what-to-do" memo 
                so CROs and RevOps leaders can fix leaks before they become board-level issues.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinOpsSection;