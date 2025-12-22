import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, ArrowUpRight, ArrowDownRight, Sliders, Filter,
  Activity, CheckCircle2, AlertTriangle, ChevronRight, X, 
  BarChart2, Server, PieChart, AlertOctagon, Calendar, ArrowLeft,
  DollarSign, Zap, Layers, Trash2, PlusCircle, Database, HardDrive, Cpu
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  PieChart as RechartsPie, Pie, YAxis, CartesianGrid
} from 'recharts';

// --- UTILS ---
const formatCurrency = (val) => {
  if (Math.abs(val) < 0.01 && val !== 0) return '$<0.01';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);
};

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

// --- SMART INSIGHT ENGINE ---
const getSmartInsight = (serviceName, operations) => {
  const topOp = operations[0]?.name || '';
  const service = (serviceName || '').toLowerCase();
  
  if (service.includes('ec2')) {
    if (topOp.includes('DataTransfer') || topOp.includes('Out')) return "⚠️ High Network Traffic: Spike driven by Data Transfer. Check cross-region replication.";
    if (topOp.includes('BoxUsage') || topOp.includes('RunInstances')) return "💻 Compute Scale-Up: Costs rose due to more active instance hours.";
    if (topOp.includes('EBS')) return "💾 Disk Attachment: Increase due to EBS Volumes. Check for orphan volumes.";
  }
  if (service.includes('s3')) {
    if (topOp.includes('TimedStorage')) return "📦 Storage Growth: You are storing significantly more data.";
    if (topOp.includes('Requests')) return "🔄 API Intensity: High Request counts (GET/PUT). Application might be looping.";
  }
  if (service.includes('rds')) {
    if (topOp.includes('InstanceUsage')) return "🗄️ Database Compute: Higher active DB instance hours.";
    if (topOp.includes('Backup')) return "💿 Backup Storage: Snapshot costs are rising.";
  }
  return `Review the "${topOp}" operation usage. This represents the largest portion of the cost change.`;
};

// --- COMPONENT: DRIVER ROW ---
const DriverRow = ({ item, type, onClick }) => (
  <div 
    onClick={onClick} 
    className="flex items-center justify-between p-4 bg-[#1a1b20] border border-white/5 rounded-xl cursor-pointer hover:border-[#a02ff1] transition-all group shadow-sm"
  >
     <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${type === 'inc' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
           {type === 'inc' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        </div>
        <div>
           <div className="flex items-center gap-2">
              <h4 className="font-bold text-white group-hover:text-[#a02ff1] transition-colors">{item.name}</h4>
              {item.isNew && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">New</span>}
           </div>
           <p className="text-xs text-gray-500 mt-1">
              Moved from <span className="text-gray-300">{formatCurrency(item.prev)}</span> to <span className="text-gray-300">{formatCurrency(item.curr)}</span>
           </p>
        </div>
     </div>
     <div className="text-right">
        <p className={`text-lg font-mono font-bold ${type === 'inc' ? 'text-red-400' : 'text-green-400'}`}>
           {type === 'inc' ? '+' : ''}{formatCurrency(item.diff)}
        </p>
        <p className="text-xs text-gray-500">{item.pct === Infinity ? 'New' : `${Math.abs(item.pct).toFixed(1)}%`}</p>
     </div>
  </div>
);

// --- COMPONENT: COMPACT DRIVERS LIST (UPDATED: Shows ALL rows) ---
const DriversList = ({ title, items, type, onSelect, sortBy, onSortChange }) => {
  // Sort Logic
  const sortedItems = [...items].sort((a, b) => {
      if (sortBy === 'pct') return Math.abs(b.pct) - Math.abs(a.pct);
      return Math.abs(b.diff) - Math.abs(a.diff); 
  });

  return (
    <div className="flex flex-col h-full">
       <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
             <div className={`w-1.5 h-1.5 rounded-full ${type === 'inc' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div> 
             {title} <span className="text-gray-600">({items.length})</span>
          </h3>
          <div className="flex items-center gap-2">
             <span className="text-[10px] text-gray-500 uppercase font-bold">Sort:</span>
             <button onClick={() => onSortChange('abs')} className={`text-[10px] px-1.5 py-0.5 rounded ${sortBy === 'abs' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>$</button>
             <button onClick={() => onSortChange('pct')} className={`text-[10px] px-1.5 py-0.5 rounded ${sortBy === 'pct' ? 'bg-white/10 text-white' : 'text-gray-500'}`}>%</button>
          </div>
       </div>
       {/* ✅ UPDATED: Changed height to h-[600px] to show many more rows */}
       <div className="bg-[#1a1b20] border border-white/10 rounded-xl overflow-hidden h-[600px] flex flex-col">
          {sortedItems.length > 0 ? (
             <div className="divide-y divide-white/5 overflow-y-auto h-full scrollbar-thin">
                {/* ✅ UPDATED: Removed .slice() to show ALL items */}
                {sortedItems.map((item) => (
                   <div 
                     key={item.name} 
                     onClick={() => onSelect(item)}
                     className="flex items-center justify-between px-3 py-3 cursor-pointer hover:bg-white/5 hover:border-l-2 hover:border-l-[#a02ff1] transition-all group border-l-2 border-l-transparent"
                   >
                      <div className="flex items-center gap-3 min-w-0">
                         <div className={`p-1.5 rounded-md ${type === 'inc' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {type === 'inc' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                         </div>
                         <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white truncate max-w-[180px] group-hover:text-[#a02ff1] transition-colors">{item.name}</h4>
                                {item.isNew && <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded border border-blue-500/30 font-bold">NEW</span>}
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
                               <span>{formatCurrency(item.prev)}</span>
                               <span className="text-gray-700">➜</span>
                               <span className="text-gray-400">{formatCurrency(item.curr)}</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right whitespace-nowrap pl-2">
                         <div className={`text-xs font-mono font-bold ${type === 'inc' ? 'text-red-400' : 'text-green-400'}`}>
                            {type === 'inc' ? '+' : ''}{formatCurrency(item.diff)}
                         </div>
                         <div className="flex items-center justify-end gap-1 text-[9px] text-gray-500 mt-0.5">
                            <span>{item.pct === Infinity ? 'New' : `${Math.abs(item.pct).toFixed(1)}%`}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          ) : (
             <div className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 py-6">
                <CheckCircle2 size={24} className="text-gray-700 mb-2" />
                <p className="text-xs">No drivers found.</p>
             </div>
          )}
       </div>
    </div>
  );
};

// --- COMPONENT: FULL SCREEN DETAILS PAGE ---
const DriverDetailsPage = ({ driver, onBack }) => {
  const stats = useMemo(() => {
    const dailyTrend = {};
    driver.rows.forEach(r => dailyTrend[r.dateStr] = (dailyTrend[r.dateStr] || 0) + r.cost);
    const trendData = Object.entries(dailyTrend).sort((a,b) => a[0].localeCompare(b[0])).map(([date, val]) => ({ date: date.slice(5), val }));

    const operationsMap = {};
    driver.rows.filter(r => r.period === 'curr').forEach(r => {
        let op = r.UsageType || r.Operation || r.ItemDescription || r.ServiceName || 'General Usage';
        if (op.length > 40) op = op.substring(0, 37) + '...'; 
        operationsMap[op] = (operationsMap[op] || 0) + r.cost;
    });
    const subDrivers = Object.entries(operationsMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5);

    const resourceMap = {};
    driver.rows.filter(r => r.period === 'curr').forEach(r => {
       const uniqueKey = r.ResourceId || r.ResourceName || 'Unknown';
       if (!resourceMap[uniqueKey]) {
           resourceMap[uniqueKey] = {
               id: uniqueKey,
               cost: 0,
               displayName: r.ResourceName || r.ResourceId || r.ItemDescription || 'Unknown Resource'
           };
       }
       resourceMap[uniqueKey].cost += r.cost;
    });
    const topResources = Object.values(resourceMap).sort((a,b) => b.cost - a.cost).slice(0, 20);

    const annualizedImpact = driver.diff * (365 / 7);
    const insightText = getSmartInsight(driver.name, subDrivers);

    return { trendData, subDrivers, topResources, annualizedImpact, insightText };
  }, [driver]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
       {/* Compact Header */}
       <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <button onClick={onBack} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
             <ArrowLeft size={18} />
          </button>
          <div>
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {driver.name}
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${driver.diff > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                   {driver.diff > 0 ? 'Increase' : 'Saving'}
                </span>
             </h2>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1a1b20] border border-white/10 p-4 rounded-xl">
             <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Net Change</p>
             <div className="flex items-end justify-between">
                <span className={`text-2xl font-mono font-bold ${driver.diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                   {driver.diff > 0 ? '+' : ''}{formatCurrency(driver.diff)}
                </span>
                <Activity size={16} className="text-gray-600" />
             </div>
          </div>
          <div className="bg-[#1a1b20] border border-white/10 p-4 rounded-xl">
             <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Spend</p>
             <div className="flex items-end justify-between">
                <span className="text-2xl font-mono font-bold text-white">{formatCurrency(driver.curr)}</span>
                <DollarSign size={16} className="text-gray-600" />
             </div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/20 to-[#1a1b20] border border-blue-500/30 p-4 rounded-xl relative overflow-hidden">
             <p className="text-[10px] text-blue-300 uppercase font-bold mb-1">Annualized Risk</p>
             <span className="text-2xl font-mono font-bold text-blue-100">{formatCurrency(stats.annualizedImpact)}</span>
          </div>
       </div>

       {/* Insight */}
       <div className="bg-blue-500/10 border-l-2 border-blue-500 p-3 rounded-r-lg flex gap-3 items-start">
          <AlertOctagon className="text-blue-400 mt-0.5" size={16} />
          <p className="text-xs text-gray-300 leading-snug">{stats.insightText}</p>
       </div>

       {/* Charts */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[350px]">
          <div className="bg-[#1a1b20] border border-white/10 p-4 rounded-xl flex flex-col">
             <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex gap-2"><BarChart2 size={14}/> Spending Trend</h3>
             <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={stats.trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#666" fontSize={10} tickFormatter={(v)=>`$${v}`} tickLine={false} axisLine={false} />
                      <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#25262b', borderColor: '#333', borderRadius: '8px', fontSize: '11px' }} />
                      <Bar dataKey="val" radius={[2, 2, 0, 0]}>
                         {stats.trendData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={driver.diff > 0 ? '#f87171' : '#4ade80'} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-[#1a1b20] border border-white/10 p-4 rounded-xl flex flex-col">
             <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex gap-2"><PieChart size={14}/> Operations Breakdown</h3>
             <div className="flex-1 w-full flex items-center">
                <div className="w-1/2 h-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                         <Pie data={stats.subDrivers} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5}>
                            {stats.subDrivers.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                         </Pie>
                         <RechartsTooltip contentStyle={{ backgroundColor: '#25262b', borderRadius: '8px', fontSize: '11px' }} formatter={(val) => formatCurrency(val)} />
                      </RechartsPie>
                   </ResponsiveContainer>
                </div>
                <div className="w-1/2 pl-2 space-y-2">
                   {stats.subDrivers.map((d, i) => (
                      <div key={i} className="flex justify-between items-center text-[10px]">
                         <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                            <span className="text-gray-300 truncate max-w-[100px]" title={d.name}>{d.name}</span>
                         </div>
                         <span className="font-mono text-gray-400">{formatCurrency(d.value)}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>

       {/* Table */}
       <div className="bg-[#1a1b20] border border-white/10 rounded-xl overflow-hidden">
          <div className="p-3 border-b border-white/10 bg-[#25262b]">
             <h3 className="text-xs font-bold text-white flex items-center gap-2"><Server size={14}/> Top Contributing Resources</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
             <table className="w-full text-left text-xs">
                <thead className="bg-[#15161a] text-gray-500 font-bold sticky top-0">
                   <tr>
                      <th className="px-4 py-2">Resource Name / ID</th>
                      <th className="px-4 py-2 text-right">Cost</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {stats.topResources.map((res, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                         <td className="px-4 py-2">
                            <div className="font-bold text-gray-200 truncate max-w-[400px]">{res.displayName}</div>
                            {res.displayName !== res.id && <div className="text-[10px] text-gray-500 font-mono mt-0.5 truncate max-w-[400px]">{res.id}</div>}
                         </td>
                         <td className="px-4 py-2 text-right font-bold text-white">{formatCurrency(res.cost)}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
const CostDrivers = ({ data }) => {
  const [period, setPeriod] = useState(30);
  const [dimension, setDimension] = useState('ServiceName');
  const [minChange, setMinChange] = useState(0); 
  const [selectedDriver, setSelectedDriver] = useState(null); 
  const [sortListBy, setSortListBy] = useState('diff'); 
  const [activeServiceFilter, setActiveServiceFilter] = useState('All'); 

  // --- 1. CORE CALCULATION LOGIC ---
  const { increases, decreases, overallStats, dynamics, periods } = useMemo(() => {
    if (!data || data.length === 0) return { increases: [], decreases: [], overallStats: {}, dynamics: {}, periods: {} };

    const cleanData = data.map(d => ({
      ...d,
      cost: parseFloat(d.BilledCost) || 0,
      date: new Date(d.ChargePeriodStart)
    }));

    const maxDate = new Date(Math.max(...cleanData.map(d => d.date)));
    const cutoffCurrent = new Date(maxDate);
    cutoffCurrent.setDate(maxDate.getDate() - period);
    const cutoffPrev = new Date(cutoffCurrent);
    cutoffPrev.setDate(cutoffCurrent.getDate() - period);

    const groups = {};
    let totalCurr = 0, totalPrev = 0;

    cleanData.forEach(row => {
      // Service Filter Logic
      const service = (row.ServiceName || '').toLowerCase();
      if (activeServiceFilter === 'Compute' && !service.includes('ec2') && !service.includes('lambda') && !service.includes('compute')) return;
      if (activeServiceFilter === 'Storage' && !service.includes('s3') && !service.includes('ebs') && !service.includes('glacier')) return;
      if (activeServiceFilter === 'Database' && !service.includes('rds') && !service.includes('dynamo') && !service.includes('db')) return;

      if (row.date > maxDate) return;
      const key = row[dimension] || 'Unknown';
      if (!groups[key]) groups[key] = { curr: 0, prev: 0, rows: [] };
      
      if (row.date > cutoffCurrent) {
        groups[key].curr += row.cost;
        groups[key].rows.push({ ...row, period: 'curr', dateStr: row.date.toISOString().split('T')[0] });
        totalCurr += row.cost;
      } else if (row.date > cutoffPrev) {
        groups[key].prev += row.cost;
        groups[key].rows.push({ ...row, period: 'prev', dateStr: row.date.toISOString().split('T')[0] });
        totalPrev += row.cost;
      }
    });

    const allResults = Object.entries(groups).map(([name, stats]) => ({
      name,
      ...stats,
      diff: stats.curr - stats.prev,
      pct: stats.prev === 0 ? Infinity : ((stats.curr - stats.prev) / stats.prev) * 100,
      isNew: stats.prev === 0 && stats.curr > 0,
      isDeleted: stats.curr === 0 && stats.prev > 0
    })).filter(item => Math.abs(item.diff) >= minChange); 

    const inc = allResults.filter(r => r.diff > 0);
    const dec = allResults.filter(r => r.diff < 0); 

    const dynamics = {
        newSpend: allResults.filter(r => r.isNew).reduce((a,b)=>a+b.diff,0),
        expansion: allResults.filter(r => !r.isNew && r.diff > 0).reduce((a,b)=>a+b.diff,0),
        deleted: allResults.filter(r => r.isDeleted).reduce((a,b)=>a+b.diff,0),
        optimization: allResults.filter(r => !r.isDeleted && r.diff < 0).reduce((a,b)=>a+b.diff,0)
    };

    return { 
      increases: inc, 
      decreases: dec, 
      dynamics,
      periods: { current: cutoffCurrent, prev: cutoffPrev, max: maxDate },
      overallStats: { 
         totalCurr, totalPrev, diff: totalCurr - totalPrev, 
         pct: totalPrev ? ((totalCurr - totalPrev)/totalPrev)*100 : 0,
         totalIncreases: inc.reduce((a,i)=>a+i.diff,0),
         totalDecreases: dec.reduce((a,i)=>a+i.diff,0)
      }
    };
  }, [data, period, dimension, minChange, activeServiceFilter]);

  // --- COMPACT VARIANCE BRIDGE ---
  const VarianceBridge = () => {
    if (!overallStats.totalPrev) return null;
    const maxVal = Math.max(overallStats.totalPrev, overallStats.totalCurr) * 1.3; 
    const getHeight = (val) => `${Math.max(4, (Math.abs(val) / maxVal) * 100)}%`;

    return (
      <div className="h-40 flex items-end justify-between gap-3 px-4 pb-2 relative select-none bg-[#1a1b20] rounded-xl border border-white/10 p-4 shadow-lg">
         <div className="absolute inset-0 border-b border-white/5 pointer-events-none" />
         <div className="w-1/4 flex flex-col items-center group relative">
            <div style={{ height: getHeight(overallStats.totalPrev) }} className="w-full bg-gray-600 rounded-t-lg opacity-60 hover:opacity-100 transition-opacity relative flex justify-center"><span className="absolute -top-7 text-[10px] font-bold text-gray-300 bg-black/80 border border-white/10 px-1.5 py-0.5 rounded">${formatCurrency(overallStats.totalPrev)}</span></div>
            <span className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-wider">Start</span>
         </div>
         <div className="w-1/4 flex flex-col items-center group relative">
            <div style={{ height: getHeight(overallStats.totalIncreases) }} className="w-full bg-red-500/20 border-t border-red-500 rounded-t-lg relative flex justify-center hover:bg-red-500/30 transition-colors"><span className="absolute -top-7 text-[10px] font-bold text-red-400 bg-black/80 border border-red-500/30 px-1.5 py-0.5 rounded">+{formatCurrency(overallStats.totalIncreases)}</span></div>
            <span className="text-[9px] text-red-400 mt-2 font-bold uppercase tracking-wider">Increases</span>
         </div>
         <div className="w-1/4 flex flex-col items-center group relative">
            <div style={{ height: getHeight(overallStats.totalDecreases) }} className="w-full bg-green-500/20 border-t border-green-500 rounded-t-lg relative flex justify-center hover:bg-green-500/30 transition-colors"><span className="absolute -top-7 text-[10px] font-bold text-green-400 bg-black/80 border border-green-500/30 px-1.5 py-0.5 rounded">{formatCurrency(overallStats.totalDecreases)}</span></div>
            <span className="text-[9px] text-green-400 mt-2 font-bold uppercase tracking-wider">Savings</span>
         </div>
         <div className="w-1/4 flex flex-col items-center group relative">
            <div style={{ height: getHeight(overallStats.totalCurr) }} className="w-full bg-[#a02ff1] rounded-t-lg relative flex justify-center hover:brightness-110 transition-all"><span className="absolute -top-7 text-[10px] font-bold text-white bg-black/80 border border-[#a02ff1]/50 px-1.5 py-0.5 rounded">${formatCurrency(overallStats.totalCurr)}</span></div>
            <span className="text-[9px] text-[#a02ff1] mt-2 font-bold uppercase tracking-wider">End</span>
         </div>
      </div>
    );
  };

  if (!data || data.length === 0) return <div className="p-10 text-center text-gray-500">No data available.</div>;

  return (
    <div className="p-4 space-y-4 min-h-screen bg-[#0f0f11] text-white font-sans animate-in fade-in duration-500 relative">
      <AnimatePresence mode="wait">
         {!selectedDriver ? (
            <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                
                {/* 1. COMPACT HEADER */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2"><TrendingUp className="text-[#a02ff1]" size={20} /> Cost Drivers</h1>
                        <p className="text-gray-400 text-xs">Comparing <strong>{formatDate(periods.prev)}</strong> to <strong>{formatDate(periods.current)}</strong></p>
                    </div>
                    
                    {/* Compact Filter Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 bg-[#1a1b20] p-1 rounded-xl border border-white/10">
                        {/* Time Period */}
                        <div className="flex bg-black/40 rounded-lg p-0.5">
                           {[7, 30].map(d => (
                               <button key={d} onClick={() => setPeriod(d)} className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${period === d ? 'bg-[#a02ff1] text-white' : 'text-gray-400 hover:text-white'}`}>{d} Days</button>
                           ))}
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        
                        {/* Group By */}
                        <div className="relative group">
                           <select value={dimension} onChange={(e) => setDimension(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg pl-2 pr-6 py-1 text-[10px] text-white focus:outline-none focus:border-[#a02ff1] appearance-none cursor-pointer w-24">
                               <option value="ServiceName">Service</option>
                               <option value="RegionName">Region</option>
                               <option value="SubAccountName">Account</option>
                           </select>
                           <Filter size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>

                        <div className="h-4 w-px bg-white/10" />

                        {/* Service Filters */}
                        <div className="flex bg-black/40 rounded-lg p-0.5 gap-0.5">
                           {[
                               { id: 'All', icon: Layers },
                               { id: 'Compute', icon: Cpu },
                               { id: 'Storage', icon: HardDrive },
                               { id: 'Database', icon: Database }
                           ].map(f => (
                               <button key={f.id} onClick={() => setActiveServiceFilter(f.id)} className={`p-1.5 rounded transition-all ${activeServiceFilter === f.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`} title={f.id}>
                                   <f.icon size={12} />
                               </button>
                           ))}
                        </div>

                        <div className="h-4 w-px bg-white/10" />

                        {/* Noise Filter */}
                        <div className="flex items-center gap-1.5 px-2">
                           <Sliders size={10} className="text-gray-500" />
                           <input type="range" min="0" max="100" step="1" value={minChange} onChange={(e) => setMinChange(Number(e.target.value))} className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#a02ff1]" title={`Hide < $${minChange}`} />
                           <span className="text-[9px] text-gray-400 font-mono w-6 text-right">${minChange}</span>
                        </div>
                    </div>
                </div>

                {/* 2. BRIDGE & DYNAMICS (With KPI Card Added) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-[#1a1b20] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row gap-6 items-center">
                        {/* KPI CARD ADDED HERE */}
                        <div className="flex-1 min-w-[180px]">
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                <Activity size={14} className="text-[#a02ff1]"/> Net Variance
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-mono font-bold ${overallStats.diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {overallStats.diff > 0 ? '+' : ''}{formatCurrency(overallStats.diff)}
                                </span>
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${overallStats.diff > 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                    {overallStats.pct === Infinity ? 'New' : `${overallStats.pct?.toFixed(1)}%`}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                                Total spend moved from <strong className="text-gray-300">{formatCurrency(overallStats.totalPrev)}</strong> to <strong className="text-gray-300">{formatCurrency(overallStats.totalCurr)}</strong> over {period} days.
                            </p>
                        </div>

                        {/* Vertical Divider */}
                        <div className="w-px h-24 bg-white/10 hidden sm:block" />

                        {/* The Bridge Chart */}
                        <div className="flex-[2] w-full">
                            <VarianceBridge />
                        </div>
                    </div>
                    
                    {/* Compact Dynamics Grid */}
                    <div className="bg-[#1a1b20] border border-white/10 rounded-xl p-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 mb-3"><Layers size={12}/> Dynamics</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                                <div className="flex items-center gap-1.5 text-blue-400 mb-1"><PlusCircle size={10}/><span className="text-[9px] font-bold uppercase">New</span></div>
                                <span className="text-sm font-mono font-bold text-white">{formatCurrency(dynamics.newSpend)}</span>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                                <div className="flex items-center gap-1.5 text-red-400 mb-1"><TrendingUp size={10}/><span className="text-[9px] font-bold uppercase">Growth</span></div>
                                <span className="text-sm font-mono font-bold text-white">{formatCurrency(dynamics.expansion)}</span>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                                <div className="flex items-center gap-1.5 text-green-400 mb-1"><ArrowDownRight size={10}/><span className="text-[9px] font-bold uppercase">Saved</span></div>
                                <span className="text-sm font-mono font-bold text-white">{formatCurrency(dynamics.optimization)}</span>
                            </div>
                            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                                <div className="flex items-center gap-1.5 text-gray-400 mb-1"><Trash2 size={10}/><span className="text-[9px] font-bold uppercase">Gone</span></div>
                                <span className="text-sm font-mono font-bold text-white">{formatCurrency(dynamics.deleted)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. SPLIT LISTS (With Sorting) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DriversList title="Top Increases" items={increases} type="inc" onSelect={setSelectedDriver} sortBy={sortListBy} onSortChange={setSortListBy} />
                    <DriversList title="Top Savings" items={decreases} type="dec" onSelect={setSelectedDriver} sortBy={sortListBy} onSortChange={setSortListBy} />
                </div>
            </motion.div>
         ) : (
            <DriverDetailsPage key="details" driver={selectedDriver} onBack={() => setSelectedDriver(null)} />
         )}
      </AnimatePresence>
    </div>
  );
};

export default CostDrivers;