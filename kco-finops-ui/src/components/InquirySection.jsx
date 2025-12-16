import React from 'react';
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react';

const InquirySection = () => {
  return (
    <section className="py-24 bg-[#0f0f11] relative overflow-hidden" id="contact">
      
      {/* Background Glow (Right Side) */}
      <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-[#8B2FC9]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* LEFT SIDE: The Pitch */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#8B2FC9] animate-pulse"></span>
            Accepting New Audits
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            See your baseline & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#8B2FC9]">Quick Wins.</span>
          </h2>
          
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Book a 3–4 week <strong>RevOps Audit</strong> or <strong>Cloud FinOps Audit</strong>. 
            We deliver a focused 90-day plan so you can hit plan and expand margins.
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-[#8B2FC9]" size={20} />
              <p className="text-gray-300">For VC-backed & mid-market B2B SaaS teams</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-[#8B2FC9]" size={20} />
              <p className="text-gray-300">Ideal for 20–500 FTE organizations</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-[#8B2FC9]" size={20} />
              <p className="text-gray-300">Secure-by-default (Read-only access)</p>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl max-w-md">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#8B2FC9]/20 flex items-center justify-center text-[#8B2FC9]">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Direct Email</p>
                  <p className="text-white font-medium">partnerships@kandco.com</p>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT SIDE: The Form (Compact Version) */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative max-w-lg mx-auto w-full">
          <form className="space-y-4"> {/* Reduced space-y from 5 to 4 */}
            <div className="grid grid-cols-2 gap-4"> {/* Reduced gap from 5 to 4 */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">First Name</label>
                <input type="text" className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-colors" placeholder="Jane" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Last Name</label>
                <input type="text" className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-colors" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Work Email</label>
              <input type="email" className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-colors" placeholder="jane@company.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">I am interested in</label>
              <select className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-colors">
                <option>RevOps Audit (3-4 Weeks)</option>
                <option>Cloud FinOps Audit (3-4 Weeks)</option>
                <option>Monthly Subscription Bundle</option>
                <option>Other Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Message (Optional)</label>
              <textarea rows="3" className="w-full bg-[#0f0f11]/50 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-[#8B2FC9] focus:outline-none transition-colors" placeholder="Tell us about your team size or cloud spend..."></textarea>
            </div>

            <button type="button" className="w-full py-3.5 bg-[#8B2FC9] hover:bg-[#7e22ce] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(139,47,201,0.3)] hover:shadow-[0_0_30px_rgba(139,47,201,0.5)] text-sm">
              Book Your Audit
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-[10px] text-gray-500">
              We respect your inbox. No spam, ever.
            </p>
          </form>
        </div>

      </div>
    </section>
  );
};

export default InquirySection;