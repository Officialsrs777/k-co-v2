import React, { useMemo, useState } from 'react';
import { 
  Server, Tag, AlertOctagon, Search, 
  Box, X, Copy, Layers, 
  CreditCard, Download, Filter,
  TrendingUp, TrendingDown, Zap, AlertTriangle, Activity,
  Trash2, Mail, CheckCircle2, ChevronRight, LayoutGrid, List,
  DollarSign, Ghost, ShieldAlert, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, AreaChart, Area, 
  ComposedChart, Line, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Legend 
} from 'recharts';

// --- UTILS ---
const formatCurrency = (val) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);

const formatDateShort = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
};

const Sparkline = ({ data, color = '#a02ff1' }) => {
  if (!data || data.length < 2) return <div className="h-8 w-24 bg-white/5 rounded opacity-20" />;
  const chartData = data.map((val, i) => ({ i, val }));
  return (
    <div className="h-8 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <Area type="monotone" dataKey="val" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- CUSTOM TOOLTIP FOR PERFECT GRAPH ---
const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1b20] border border-white/10 p-3 rounded-xl shadow-2xl z-50">
          <p className="text-gray-400 text-xs font-bold mb-2 border-b border-white/10 pb-1">{label}</p>
          <div className="flex flex-col gap-1">
              {payload.map((p, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-gray-300 w-16">{p.name}:</span>
                      <span className="font-mono font-bold text-white">
                          {p.name === 'Cost' ? formatCurrency(p.value) : p.value.toLocaleString()}
                      </span>
                  </div>
              ))}
          </div>
        </div>
      );
    }
    return null;
};

// --- COMPONENT: INTERACTIVE KPI CARD ---
const KpiCard = ({ title, count, cost, icon: Icon, color, isActive, onClick, label }) => (
    <div 
        onClick={onClick}
        className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 group overflow-hidden ${
            isActive 
            ? `bg-${color}-500/10 border-${color}-500/50 shadow-[0_0_20px_rgba(0,0,0,0.3)]` 
            : 'bg-[#1a1b20] border-white/10 hover:bg-[#25262b] hover:border-white/20'
        }`}
    >
        <div className="flex justify-between items-start mb-2 relative z-10">
            <div className={`p-2 rounded-lg ${isActive ? `bg-${color}-500/20 text-${color}-400` : 'bg-black/40 text-gray-400 group-hover:text-white'}`}>
                <Icon size={18} />
            </div>
            <span className={`text-2xl font-black ${isActive ? 'text-white' : 'text-gray-200'}`}>{count}</span>
        </div>
        <div className="relative z-10">
            <p className={`text-xs font-bold uppercase tracking-wider ${isActive ? `text-${color}-400` : 'text-gray-500'}`}>{title}</p>
            <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-mono text-gray-300">{formatCurrency(cost)}</span>
                <span className="text-[10px] text-gray-600">{label}</span>
            </div>
        </div>
        {isActive && <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${color}-500/10 blur-[40px] rounded-full`} />}
    </div>
);

// --- VIEW: TAG MATRIX ---
const TagMatrix = ({ data, requiredTags = ['Owner', 'Environment', 'Project'] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-[#15161a] text-gray-500 font-bold sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 border-b border-white/10 w-64">Resource Identifier</th>
            {requiredTags.map(tag => (
              <th key={tag} className="px-4 py-3 border-b border-white/10 text-center w-32">{tag}</th>
            ))}
            <th className="px-4 py-3 border-b border-white/10 text-right">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-white/5 transition-colors">
              <td className="px-4 py-3">
                <div className="font-bold text-gray-300 truncate max-w-[250px]" title={item.id}>{item.id}</div>
                <div className="text-[10px] text-gray-600">{item.service}</div>
              </td>
              {requiredTags.map(tag => {
                const val = Object.entries(item.tags).find(([k]) => k.toLowerCase() === tag.toLowerCase())?.[1];
                return (
                  <td key={tag} className="px-4 py-3 text-center border-l border-white/5">
                    {val ? (
                      <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 truncate max-w-[100px] inline-block" title={val}>{val}</span>
                    ) : (
                      <span className="inline-block p-1 rounded-full bg-red-500/10 text-red-500"><X size={10}/></span>
                    )}
                  </td>
                );
              })}
              <td className="px-4 py-3 text-right font-mono text-gray-400">{formatCurrency(item.totalCost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);

// --- VIEW: ZOMBIE HUNTER ---
const ZombieList = ({ data, onInspect }) => {
  const zombies = data.filter(i => i.status === 'Zombie');
  const potentialSavings = zombies.reduce((acc, curr) => acc + curr.totalCost, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 border border-orange-500/30 p-6 rounded-2xl flex items-center justify-between shadow-lg">
         <div className="flex items-center gap-5">
            <div className="p-4 bg-orange-500/20 rounded-full text-orange-400 border border-orange-500/20">
                <Trash2 size={32}/>
            </div>
            <div>
               <h3 className="text-xl font-bold text-white mb-1">Cleanup Opportunity</h3>
               <p className="text-sm text-gray-400">
                  <strong className="text-white">{zombies.length}</strong> resources identified as potential zombies (Zero usage, high cost).
               </p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-xs text-orange-300 uppercase font-bold tracking-wider mb-1">Potential Monthly Savings</p>
            <p className="text-4xl font-mono font-black text-orange-400">{formatCurrency(potentialSavings)}</p>
         </div>
      </div>

      <div className="bg-[#1a1b20] border border-white/10 rounded-xl overflow-hidden shadow-lg">
         <table className="w-full text-left text-xs">
            <thead className="bg-[#15161a] text-gray-500 font-bold uppercase">
               <tr>
                  <th className="px-6 py-4">Resource Identifier</th>
                  <th className="px-6 py-4">Detection Logic</th>
                  <th className="px-6 py-4 text-right">Cost Impact</th>
                  <th className="px-6 py-4 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {zombies.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                     <td className="px-6 py-4">
                        <div className="font-bold text-white truncate max-w-[300px] group-hover:text-orange-400 transition-colors">{item.id}</div>
                        <div className="text-[10px] text-gray-500 flex gap-2 mt-1">
                            <span className="bg-white/5 px-1.5 rounded">{item.service}</span>
                            <span>{item.region}</span>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={14} className="text-orange-500" />
                            <span className="text-gray-300">0% Utilization / Idle</span>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-right font-mono font-bold text-white">{formatCurrency(item.totalCost)}</td>
                     <td className="px-6 py-4 text-right">
                        <button onClick={() => onInspect(item)} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-bold transition-colors">Inspect</button>
                     </td>
                  </tr>
               ))}
               {zombies.length === 0 && (
                  <tr><td colSpan="4" className="p-10 text-center text-gray-500 italic">No zombie resources detected. Infrastructure is clean.</td></tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ResourceInventory = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [grouping, setGrouping] = useState('none');
  const [selectedResource, setSelectedResource] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const { inventory, groups, stats } = useMemo(() => {
    if (!data || data.length === 0) return { inventory: [], groups: {}, stats: {} };

    const resourceMap = {};
    
    data.forEach(row => {
      const resId = row.ResourceId || row.ResourceName || row.ItemDescription;
      if (!resId) return; 

      if (!resourceMap[resId]) {
        resourceMap[resId] = {
          id: resId,
          name: row.ResourceName,
          service: row.ServiceName || 'Unknown',
          region: row.RegionName || 'Global',
          account: row.SubAccountName || row.PayerAccountId || 'Unknown',
          totalCost: 0,
          dailyStats: {}, // Stores Cost + Usage per day
          tags: {},
          rawRows: [], 
          allMetadata: {} 
        };
      }

      const r = resourceMap[resId];
      const cost = parseFloat(row.BilledCost) || 0;
      const quantity = parseFloat(row.UsageQuantity) || 0;
      const date = row.ChargePeriodStart?.split(' ')[0];

      r.totalCost += cost;
      r.rawRows.push(row);

      if (date) {
          if (!r.dailyStats[date]) r.dailyStats[date] = { date, cost: 0, usage: 0 };
          r.dailyStats[date].cost += cost;
          r.dailyStats[date].usage += quantity;
      }

      Object.keys(row).forEach(key => { if (row[key]) r.allMetadata[key] = row[key]; });

      if (Object.keys(r.tags).length === 0 && row.Tags && row.Tags !== '{}') {
        try {
           const parsed = JSON.parse(row.Tags.replace(/""/g, '"').replace(/^"|"$/g, ''));
           if (Object.keys(parsed).length > 0) r.tags = parsed;
        } catch(e) {}
      }
    });

    const list = Object.values(resourceMap).map(r => {
        const history = Object.values(r.dailyStats).sort((a,b) => a.date.localeCompare(b.date));
        
        const trend = history.map(d => d.cost);
        const start = trend[0] || 0;
        const end = trend[trend.length - 1] || 0;
        
        let status = 'Active';
        if (end > start * 1.5 && start > 0.1) status = 'Spiking';
        else if (end === 0 && r.totalCost > 0) status = 'Zombie'; 
        else if (start === 0 && end > 0) status = 'New';

        return { ...r, history, trend, status, hasTags: Object.keys(r.tags).length > 0 };
    }).sort((a, b) => b.totalCost - a.totalCost);

    const grouped = {};
    if (grouping !== 'none') {
        list.forEach(item => {
            const key = grouping === 'service' ? item.service : item.region;
            if (!grouped[key]) grouped[key] = { items: [], total: 0 };
            grouped[key].items.push(item);
            grouped[key].total += item.totalCost;
        });
    }

    const zombies = list.filter(i => i.status === 'Zombie');
    const untagged = list.filter(i => !i.hasTags);
    const spiking = list.filter(i => i.status === 'Spiking');

    const stats = {
        total: list.length,
        totalCost: list.reduce((a,b)=>a+b.totalCost,0),
        zombieCount: zombies.length,
        zombieCost: zombies.reduce((a,b)=>a+b.totalCost,0),
        untaggedCount: untagged.length,
        untaggedCost: untagged.reduce((a,b)=>a+b.totalCost,0),
        spikingCount: spiking.length,
        spikingCost: spiking.reduce((a,b)=>a+b.totalCost,0)
    };

    return { inventory: list, groups: grouped, stats };
  }, [data, grouping]);

  const filteredData = useMemo(() => {
    let list = inventory;
    if (activeTab === 'untagged') list = list.filter(i => !i.hasTags);
    if (activeTab === 'spiking') list = list.filter(i => i.status === 'Spiking');
    return list.filter(item => item.id.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [inventory, activeTab, searchTerm]);

  const StatusBadge = ({ status }) => {
    const styles = {
        'Active': 'bg-green-500/10 text-green-400 border-green-500/20',
        'Spiking': 'bg-red-500/10 text-red-400 border-red-500/20',
        'Zombie': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        'New': 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[status] || styles.Active}`}>{status}</span>;
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#0f0f11] text-white font-sans animate-in fade-in duration-500 relative">
      
      {/* 1. HEADER */}
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Box className="text-[#a02ff1]" /> Asset Manager</h1>
            <p className="text-gray-400 text-sm mt-1">Full inventory visibility and waste detection.</p>
         </div>
         <button className="px-4 py-2 bg-[#1a1b20] border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white flex gap-2 items-center text-sm font-bold"><Download size={16}/> Export CSV</button>
      </div>

      {/* 2. INTERACTIVE KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <KpiCard title="Total Assets" count={stats.total} cost={stats.totalCost} icon={Server} color="blue" label="Total Spend" isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
         <KpiCard title="Zombie Assets" count={stats.zombieCount} cost={stats.zombieCost} icon={Ghost} color="orange" label="Wasted Spend" isActive={activeTab === 'zombie'} onClick={() => setActiveTab('zombie')} />
         <KpiCard title="Untagged" count={stats.untaggedCount} cost={stats.untaggedCost} icon={Tag} color="red" label="Unallocated" isActive={activeTab === 'untagged'} onClick={() => setActiveTab('untagged')} />
         <KpiCard title="Spiking" count={stats.spikingCount} cost={stats.spikingCost} icon={TrendingUp} color="purple" label="Cost at Risk" isActive={activeTab === 'spiking'} onClick={() => setActiveTab('spiking')} />
      </div>

      {/* 3. TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-white/10 pb-4 items-center">
         <div className="flex bg-[#1a1b20] p-1 rounded-xl border border-white/10">
            <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${['all','untagged','spiking'].includes(activeTab) ? 'bg-[#a02ff1] text-white' : 'text-gray-400 hover:text-white'}`}>Inventory</button>
            <button onClick={() => setActiveTab('zombie')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'zombie' ? 'bg-[#a02ff1] text-white' : 'text-gray-400 hover:text-white'}`}>Cleanup</button>
            <button onClick={() => setActiveTab('governance')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'governance' ? 'bg-[#a02ff1] text-white' : 'text-gray-400 hover:text-white'}`}>Governance</button>
         </div>
         {['all', 'untagged', 'spiking'].includes(activeTab) && (
             <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                   <input type="text" placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-[#1a1b20] border border-white/10 rounded-xl text-xs text-white focus:border-[#a02ff1] outline-none" />
                </div>
                <div className="flex bg-[#1a1b20] rounded-xl p-1 border border-white/10">
                   <button onClick={() => setGrouping('none')} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${grouping === 'none' ? 'bg-white/10 text-white' : 'text-gray-400'}`} title="List View"><List size={14}/></button>
                   <button onClick={() => setGrouping('service')} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${grouping === 'service' ? 'bg-white/10 text-white' : 'text-gray-400'}`} title="Group by Service"><LayoutGrid size={14}/></button>
                </div>
             </div>
         )}
      </div>

      {/* 4. MAIN CONTENT AREA */}
      <div className="min-h-[500px]">
         {['all', 'untagged', 'spiking'].includes(activeTab) && (
            <div className="bg-[#1a1b20] border border-white/10 rounded-xl overflow-hidden shadow-lg">
               <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  {grouping === 'none' ? (
                      <table className="w-full text-left text-xs border-collapse">
                         <thead className="bg-[#15161a] text-gray-500 font-bold sticky top-0 z-10">
                            <tr>
                               <th className="px-6 py-3">Resource Identifier</th>
                               <th className="px-6 py-3">Type & Location</th>
                               <th className="px-6 py-3">Health Status</th>
                               <th className="px-6 py-3 w-32">Trend</th>
                               <th className="px-6 py-3 text-right">Total Cost</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {filteredData.slice(0, 100).map(item => (
                               <tr key={item.id} onClick={() => setSelectedResource(item)} className="hover:bg-white/5 cursor-pointer group transition-colors">
                                  <td className="px-6 py-3 font-mono text-gray-300 group-hover:text-[#a02ff1] transition-colors truncate max-w-[300px]">{item.id}</td>
                                  <td className="px-6 py-3 text-gray-500">{item.service} • {item.region}</td>
                                  <td className="px-6 py-3"><StatusBadge status={item.status} /></td>
                                  <td className="px-6 py-3"><Sparkline data={item.trend} color={item.status === 'Spiking' ? '#ef4444' : '#a02ff1'} /></td>
                                  <td className="px-6 py-3 text-right font-bold text-white font-mono">{formatCurrency(item.totalCost)}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                  ) : (
                      <div className="flex flex-col">
                          {Object.entries(groups).sort((a,b) => b[1].total - a[1].total).map(([key, grp]) => (
                              <div key={key} className="border-b border-white/5">
                                  <div className="bg-[#25262b] px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-white/10 sticky top-0 z-10">
                                      <div className="flex items-center gap-3">
                                          <ChevronRight size={14} className="text-gray-500" />
                                          <span className="font-bold text-white text-sm">{key}</span>
                                          <span className="text-[10px] text-gray-500 bg-black/40 px-2 py-0.5 rounded-full">{grp.items.length} items</span>
                                      </div>
                                      <span className="font-mono font-bold text-white text-xs">{formatCurrency(grp.total)}</span>
                                  </div>
                                  <div className="divide-y divide-white/5 bg-[#1a1b20]">
                                      {grp.items.slice(0, 10).map(item => (
                                          <div key={item.id} onClick={() => setSelectedResource(item)} className="flex justify-between items-center px-10 py-2 text-xs hover:bg-white/5 cursor-pointer">
                                              <span className="font-mono text-gray-400 truncate max-w-[400px] hover:text-[#a02ff1]">{item.id}</span>
                                              <span className="font-mono text-white w-20 text-right">{formatCurrency(item.totalCost)}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
               </div>
            </div>
         )}

         {activeTab === 'zombie' && <ZombieList data={inventory} onInspect={setSelectedResource} />}
         {activeTab === 'governance' && <div className="bg-[#1a1b20] border border-white/10 rounded-xl overflow-hidden shadow-lg"><TagMatrix data={filteredData.slice(0, 100)} /></div>}
      </div>

      {/* 5. INSPECTOR (SLIDE-OVER) */}
      <AnimatePresence>
         {selectedResource && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedResource(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
               <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed right-0 top-0 bottom-0 w-[500px] bg-[#1a1b20] border-l border-white/10 shadow-2xl z-50 flex flex-col">
                  
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 bg-[#25262b] flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <StatusBadge status={selectedResource.status} />
                           <span className="text-xs text-gray-500">{selectedResource.service}</span>
                        </div>
                        <h2 className="text-lg font-bold text-white break-all">{selectedResource.id}</h2>
                     </div>
                     <button onClick={() => setSelectedResource(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white"><X size={20} /></button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     
                     {/* PERFECT COST VS USAGE CHART */}
                     <div className="h-56 w-full bg-black/20 rounded-xl border border-white/5 p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><BarChart2 size={12}/> Cost vs Usage</h3>
                            <div className="flex gap-3 text-[10px]">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#a02ff1]"></div><span className="text-gray-400">Cost ($)</span></div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div><span className="text-gray-400">Usage (Units)</span></div>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={selectedResource.history} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <XAxis dataKey="date" tickFormatter={formatDateShort} stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" orientation="left" stroke="#a02ff1" fontSize={10} tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} width={35} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={10} tickLine={false} axisLine={false} width={30} />
                                    <RechartsTooltip content={<CustomChartTooltip />} />
                                    <Bar yAxisId="right" dataKey="usage" name="Usage" fill="#3b82f6" opacity={0.3} barSize={10} radius={[2, 2, 0, 0]} />
                                    <Line yAxisId="left" type="monotone" dataKey="cost" name="Cost" stroke="#a02ff1" strokeWidth={2} dot={{ r: 2, fill: '#a02ff1' }} activeDot={{ r: 4 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Cost</p>
                           <p className="text-2xl font-bold text-white">{formatCurrency(selectedResource.totalCost)}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                           <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tags Found</p>
                           <p className="text-2xl font-bold text-blue-400">{Object.keys(selectedResource.tags).length}</p>
                        </div>
                     </div>

                     {/* Zombie Alert */}
                     {selectedResource.status === 'Zombie' && (
                        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex gap-3">
                           <AlertTriangle className="text-orange-400 mt-0.5" size={18} />
                           <div>
                              <p className="text-xs font-bold text-orange-400">Potential Zombie Asset</p>
                              <p className="text-[11px] text-gray-400 mt-1">This resource has accrued costs but shows zero usage/activity recently.</p>
                           </div>
                        </div>
                     )}

                     {/* Tags */}
                     <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                        <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Tag size={12}/> Applied Tags</h3>
                        {selectedResource.hasTags ? (
                           <div className="flex flex-wrap gap-2">
                              {Object.entries(selectedResource.tags).map(([k,v]) => (
                                 <span key={k} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded text-[10px]">
                                    <span className="opacity-50">{k}:</span> {v}
                                 </span>
                              ))}
                           </div>
                        ) : (
                           <div className="text-gray-500 text-xs italic">No tags detected.</div>
                        )}
                     </div>

                     {/* Metadata Table */}
                     <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Attributes</h3>
                        <div className="grid grid-cols-1 gap-1">
                           {Object.entries(selectedResource.allMetadata)
                              .filter(([k]) => !['Tags', 'BilledCost', 'EffectiveCost', 'UsageQuantity'].includes(k))
                              .slice(0, 10)
                              .map(([k, v]) => (
                                 <div key={k} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded border border-white/5">
                                    <span className="text-gray-500 font-medium w-1/3 truncate">{k}</span>
                                    <span className="text-gray-300 font-mono text-right truncate w-2/3" title={String(v)}>{String(v)}</span>
                                 </div>
                              ))
                           }
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
                        <button className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-gray-300 transition-colors">
                           <Mail size={14}/> Contact Owner
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-xs font-bold text-red-400 transition-colors">
                           <Trash2 size={14}/> Mark for Cleanup
                        </button>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>

    </div>
  );
};

export default ResourceInventory;