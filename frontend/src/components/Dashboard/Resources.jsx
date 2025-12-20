import React, { useMemo, useState } from 'react';
import { 
  Boxes, Search, Filter, HardDrive, Cpu, 
  Globe, Tag, AlertCircle, ExternalLink, 
  ArrowUpDown, Info, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- UTILITY: HIGH PRECISION CURRENCY ---
const formatCurrency = (val) => {
  if (val === 0) return '$0.00';
  const absVal = Math.abs(val);
  let digits = absVal < 0.01 ? 4 : 2;
  if (absVal < 0.0001) digits = 6;
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', currency: 'USD', 
    minimumFractionDigits: digits, maximumFractionDigits: digits 
  }).format(val);
};

const Resources = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('All');

  // --- 1. DATA PROCESSING ---
  const resourceStats = useMemo(() => {
    if (!data || !data.length) return null;

    const resourceMap = {};
    let untaggedCount = 0;

    data.forEach(item => {
      const id = item.ResourceId || 'Unknown-ID';
      if (!resourceMap[id]) {
        resourceMap[id] = {
          id,
          name: item.ResourceName || 'N/A',
          service: item.ServiceName || 'Other',
          type: item.ResourceType || 'N/A',
          region: item.RegionName || 'Global',
          provider: item.ProviderName || 'Other',
          cost: 0,
          tags: item.Tags ? String(item.Tags) : ''
        };
        // Check for tagging compliance
        if (!item.Tags || item.Tags === '' || item.Tags === 'NULL') {
          untaggedCount++;
        }
      }
      resourceMap[id].cost += parseFloat(item.BilledCost) || 0;
    });

    const list = Object.values(resourceMap).sort((a, b) => b.cost - a.cost);
    const services = ['All', ...new Set(list.map(r => r.service))].sort();
    
    return { 
      list, 
      totalCost: list.reduce((acc, r) => acc + r.cost, 0),
      count: list.length,
      untaggedCount,
      services
    };
  }, [data]);

  // --- 2. FILTERING ---
  const filteredResources = useMemo(() => {
    if (!resourceStats) return [];
    return resourceStats.list.filter(r => {
      const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesService = selectedService === 'All' || r.service === selectedService;
      return matchesSearch && matchesService;
    });
  }, [resourceStats, searchTerm, selectedService]);

  if (!resourceStats) return null;

  return (
    <div className="flex flex-col h-full bg-[#0f0f11] text-white animate-in fade-in duration-500">
      
      {/* 1. HEADER SECTION */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-[#a02ff1]/10 rounded-lg text-[#a02ff1]">
              <Boxes size={22} />
            </div>
            Resource Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">Granular visibility into individual cost-consuming entities.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search by ID or Name..."
              className="w-full bg-[#1a1b20] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:border-[#a02ff1] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-[#1a1b20] border border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[#a02ff1]"
            style={{ colorScheme: 'dark' }}
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            {resourceStats.services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* 2. TOP METRICS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
        {[
          { label: 'Managed Resources', val: resourceStats.count, icon: Cpu, col: 'text-blue-400' },
          { label: 'Inventory Cost', val: formatCurrency(resourceStats.totalCost), icon: DollarSign, col: 'text-purple-400' },
          { label: 'Avg Unit Cost', val: formatCurrency(resourceStats.totalCost / resourceStats.count), icon: Activity, col: 'text-emerald-400' },
          { label: 'Tagging Debt', val: resourceStats.untaggedCount, icon: Tag, col: 'text-orange-400', sub: 'Untagged Items' },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#1a1b20] border border-white/5 p-4 rounded-2xl">
            <div className="flex justify-between text-gray-500 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest">{kpi.label}</span>
              <kpi.icon size={14} className={kpi.col} />
            </div>
            <div className="text-xl font-bold">{kpi.val}</div>
            {kpi.sub && <div className="text-[9px] text-gray-600 font-bold mt-1 uppercase">{kpi.sub}</div>}
          </div>
        ))}
      </div>

      {/* 3. MAIN TABLE AREA */}
      <div className="flex-1 px-6 pb-6 min-h-0">
        <div className="h-full bg-[#1a1b20] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
          
          <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-800">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#25262b] z-10">
                <tr className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  <th className="px-6 py-4 border-b border-white/5">Resource Identity</th>
                  <th className="px-6 py-4 border-b border-white/5">Service / Type</th>
                  <th className="px-6 py-4 border-b border-white/5">Region</th>
                  <th className="px-6 py-4 border-b border-white/5 text-right">Accumulated Cost</th>
                  <th className="px-6 py-4 border-b border-white/5 text-center">Tagging</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredResources.slice(0, 100).map((res) => (
                  <tr key={res.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-200 truncate max-w-xs" title={res.id}>{res.id}</span>
                        <span className="text-[10px] text-gray-500 font-mono mt-1">{res.name !== 'N/A' ? res.name : 'No Name Provided'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-gray-300">{res.service}</span>
                        <span className="text-[9px] text-gray-600 mt-0.5">{res.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Globe size={12} className="text-gray-600" />
                        {res.region}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs font-bold text-[#a02ff1]">{formatCurrency(res.cost)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {res.tags ? (
                          <div className="p-1.5 rounded-lg bg-green-500/10 text-green-500" title={res.tags}>
                            <Check size={14} />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400" title="Missing Tags">
                            <AlertCircle size={14} />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="p-4 bg-[#0f0f11]/50 border-t border-white/5 flex justify-between items-center shrink-0">
             <div className="text-[10px] text-gray-500 font-bold uppercase">
                Showing {Math.min(filteredResources.length, 100)} of {filteredResources.length} Resources
             </div>
             <div className="flex gap-2">
                <button className="px-3 py-1 bg-white/5 rounded text-[10px] font-bold hover:bg-white/10 transition-all">Prev</button>
                <button className="px-3 py-1 bg-white/5 rounded text-[10px] font-bold hover:bg-white/10 transition-all">Next</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;