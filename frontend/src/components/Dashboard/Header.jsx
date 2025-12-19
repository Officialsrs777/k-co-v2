// src/components/Header.jsx
import React, { useState } from 'react';
import { Search, Download, ChevronDown, CheckCircle2, AlertTriangle, X } from 'lucide-react';

const Header = ({ title, anomalies = [], anomaliesCount = 0 }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [visibleAnomaliesCount, setVisibleAnomaliesCount] = useState(5);
  const hasAnomalies = anomaliesCount > 0;
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // Reset visible count when dialog opens/closes
  const handleDialogToggle = (open) => {
    setShowDialog(open);
    if (!open) {
      setVisibleAnomaliesCount(5); // Reset to initial count when closing
    }
  };

  return (
    <>
      {/* HEIGHT: h-[64px], LEFT: left-[240px] */}
      <header className="fixed top-0 left-[240px] right-0 h-[64px] bg-[#0f0f11]/90 backdrop-blur-md border-b border-white/5 z-40 flex items-center px-6 justify-between">
        
        {/* Left: Title */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">
            <span className="hover:text-[#a02ff1] cursor-pointer">K&Co.</span>
            <span>/</span>
            <span className="text-[#a02ff1]">Dashboard</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <div className="relative w-full max-w-sm group/search">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/search:text-[#a02ff1] transition-colors" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[#1a1b20]/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:bg-[#0f0f11] focus:border-[#a02ff1] transition-all"
            />
          </div>
        </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {hasAnomalies ? (
            <button
              onClick={() => handleDialogToggle(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-lg hover:bg-amber-400/20 transition-all cursor-pointer group"
            >
              <AlertTriangle size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">Anomalies</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                {anomaliesCount}
              </span>
            </button>
          ) : (
            <button
              onClick={() => handleDialogToggle(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-400/10 border border-green-400/30 rounded-lg hover:bg-green-400/20 transition-all cursor-pointer group"
            >
              <CheckCircle2 size={14} className="text-green-400" />
              <span className="text-xs font-semibold text-green-400">Smooth</span>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-white/10"></div>
        
        {/* Actions Buttons */}
        <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Download size={16} />
            </button>
        </div>

        {/* User Profile */}
        <div className="pl-2 border-l border-white/10 ml-1">
          <button className="group flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-all">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#a02ff1] to-[#60a5fa] flex items-center justify-center text-white font-bold text-xs shadow-lg ring-1 ring-[#0f0f11]">
                KC
            </div>
            
            <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white group-hover:text-[#a02ff1] transition-colors">Client Admin</div>
            </div>
            
            <ChevronDown size={12} className="text-gray-500 group-hover:text-white transition-colors" />
          </button>
        </div>

      </div>
    </header>

    {/* Insights Dialog */}
    {showDialog && (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => handleDialogToggle(false)}
      >
        <div 
          className="bg-[#1a1b20] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dialog Header */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasAnomalies ? (
                <>
                  <div className="p-2 rounded-lg bg-amber-400/10 ring-1 ring-amber-400/20">
                    <AlertTriangle size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Anomalies Detected</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{anomaliesCount} cost anomalies found requiring attention</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-lg bg-green-400/10 ring-1 ring-green-400/20">
                    <CheckCircle2 size={20} className="text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Smooth Operations</h2>
                    <p className="text-xs text-gray-400 mt-0.5">No cost leakage detected. All costs are within expected ranges.</p>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => handleDialogToggle(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Dialog Content */}
          <div className="p-5 overflow-y-auto max-h-[calc(80vh-100px)]">
            {hasAnomalies ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-300 mb-4">
                  The following cost anomalies have been detected. These represent unusual cost spikes that may indicate inefficiencies or require investigation.
                </p>
                <div className="space-y-2">
                  {anomalies.slice(0, visibleAnomaliesCount).map((item, index) => (
                    <div 
                      key={index}
                      className="bg-[#0f0f11]/50 border border-white/5 rounded-lg p-3 hover:bg-[#0f0f11] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate" title={item.ServiceName || 'Unknown Service'}>
                            {item.ServiceName || 'Unknown Service'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 truncate" title={`${item.ProviderName || 'N/A'} • ${item.RegionName || 'N/A'}`}>
                            {item.ProviderName || 'N/A'} • {item.RegionName || 'N/A'}
                          </p>
                          {item.ResourceId && (
                            <p className="text-xs text-gray-500 mt-1 truncate" title={item.ResourceId}>
                              Resource: {item.ResourceId}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="text-sm font-bold text-amber-400 whitespace-nowrap">{formatCurrency(item.cost)}</p>
                          {item.ChargePeriodStart && (
                            <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                              {item.ChargePeriodStart.split(' ')[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Load More / Show Less Button */}
                {anomalies.length > visibleAnomaliesCount ? (
                  <div className="flex justify-center pt-3">
                    <button
                      onClick={() => setVisibleAnomaliesCount(anomalies.length)}
                      className="px-4 py-2 bg-[#0f0f11] border border-white/10 hover:border-[#a02ff1]/50 rounded-lg text-xs font-semibold text-gray-300 hover:text-[#a02ff1] transition-all"
                    >
                      Load More ({anomalies.length - visibleAnomaliesCount} remaining)
                    </button>
                  </div>
                ) : visibleAnomaliesCount > 5 && (
                  <div className="flex justify-center pt-3">
                    <button
                      onClick={() => setVisibleAnomaliesCount(5)}
                      className="px-4 py-2 bg-[#0f0f11] border border-white/10 hover:border-[#a02ff1]/50 rounded-lg text-xs font-semibold text-gray-300 hover:text-[#a02ff1] transition-all"
                    >
                      Show Less
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-white mb-2">All Systems Operating Smoothly</p>
                <p className="text-sm text-gray-400">
                  Your cost management is optimal. No anomalies or cost leakage detected in the current dataset.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Header;