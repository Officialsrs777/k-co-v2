import React, { useMemo, useState, useEffect } from 'react';
import { 
  Users, Building, Search, Download, 
  UserPlus, X, AlertTriangle, CheckCircle,
  FileText, TrendingUp, Filter, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- UTILS ---
const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '$0.00';
  const num = typeof val === 'string' ? parseFloat(val.replace(/[$,]/g, '')) : val;
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(num);
};

const AccountsOwnership = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [proposeOwnerAccount, setProposeOwnerAccount] = useState(null);
  
  // Track proposed owners: accountId -> proposedOwner
  const [proposedOwners, setProposedOwners] = useState({});
  
  // Filters
  const [filterOwner, setFilterOwner] = useState('All'); 
  const [filterProvider, setFilterProvider] = useState('All');
  const [sortBy, setSortBy] = useState('cost'); // 'cost' | 'name' | 'owner'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // --- HELPER: Generate suggested owner based on account data ---
  const suggestOwner = (account) => {
    // Analyze account name, service, provider to suggest owner
    const accountName = account.accountName.toLowerCase();
    const service = account.topService.toLowerCase();
    
    // Simple suggestion logic (can be enhanced with ML/AI)
    if (accountName.includes('prod') || accountName.includes('production')) {
      return 'Ops Team';
    } else if (accountName.includes('dev') || accountName.includes('development')) {
      return 'DevOps Team';
    } else if (accountName.includes('test') || accountName.includes('staging')) {
      return 'QA Team';
    } else if (service.includes('compute') || service.includes('ec2')) {
      return 'Infrastructure Team';
    } else if (service.includes('storage') || service.includes('s3')) {
      return 'Data Team';
    } else if (service.includes('database') || service.includes('rds')) {
      return 'Database Team';
    } else {
      // Default suggestion based on cost
      if (account.cost > 10000) {
        return 'Finance Team';
      } else {
        return 'Platform Team';
      }
    }
  };

  // --- 1. DATA PROCESSING ---
  const { accountTable, ownershipInsights, providers } = useMemo(() => {
    if (!data || data.length === 0) return { accountTable: [], ownershipInsights: {}, providers: [] };

    const accountMap = {};
    const providerSet = new Set();
    let totalSpend = 0;
    const accountServices = {};

    data.forEach(row => {
      const accountId = row.LinkedAccountId || row.SubscriptionId || row.SubAccountName || 'Unknown';
      const accountName = row.SubAccountName || row.SubscriptionName || accountId;
      const provider = row.ProviderName || 'Unknown';
      
      let rawCost = row.BilledCost;
      if (typeof rawCost === 'string') rawCost = rawCost.replace(/[$,]/g, '');
      const cost = parseFloat(rawCost) || 0;
      if (isNaN(cost) || cost < 0) return; // Skip invalid rows
      const service = row.ServiceName || 'Other';

      totalSpend += cost;
      providerSet.add(provider);

      if (!accountMap[accountId]) {
        accountMap[accountId] = {
          accountId,
          accountName,
          provider,
          cost: 0,
          owner: Math.random() > 0.4 ? `team-${Math.floor(Math.random() * 5) + 1}@company.com` : null,
          services: {}
        };
      }

      accountMap[accountId].cost += cost;
      if (!accountServices[accountId]) accountServices[accountId] = {};
      accountServices[accountId][service] = (accountServices[accountId][service] || 0) + cost;
    });

    // Calculate top service for each account
    const accountTable = Object.values(accountMap).map(acc => {
      const services = Object.entries(accountServices[acc.accountId] || {})
        .sort((a, b) => b[1] - a[1]);
      const topService = services[0]?.[0] || 'N/A';
      
      return {
        ...acc,
        topService,
        percentage: totalSpend > 0 ? (acc.cost / totalSpend) * 100 : 0,
        ownershipStatus: acc.owner ? 'Assigned' : 'Unassigned'
      };
    });

    // Calculate ownership insights
    const accountsWithOwner = accountTable.filter(a => a.owner).length;
    const accountsWithoutOwner = accountTable.filter(a => !a.owner).length;
    const spendWithOwner = accountTable.filter(a => a.owner).reduce((sum, a) => sum + a.cost, 0);
    const spendWithoutOwner = accountTable.filter(a => !a.owner).reduce((sum, a) => sum + a.cost, 0);
    const spendUnattributedPercent = totalSpend > 0 ? (spendWithoutOwner / totalSpend) * 100 : 0;

    return {
      accountTable,
      ownershipInsights: {
        totalAccounts: accountTable.length,
        accountsWithOwner,
        accountsWithoutOwner,
        spendWithOwner,
        spendWithoutOwner,
        spendUnattributedPercent,
        totalSpend
      },
      providers: Array.from(providerSet)
    };
  }, [data]);

  // --- 2. FILTERING & SORTING (Include Proposed Owners) ---
  const filteredAndSortedAccounts = useMemo(() => {
    let filtered = accountTable.map(acc => ({
      ...acc,
      proposedOwner: proposedOwners[acc.accountId] || null
    })).filter(acc => {
      const matchesSearch = 
        acc.accountName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        acc.accountId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOwner = 
        filterOwner === 'All' ? true : 
        filterOwner === 'Assigned' ? acc.owner : 
        !acc.owner;
      const matchesProvider = filterProvider === 'All' || acc.provider === filterProvider;
      return matchesSearch && matchesOwner && matchesProvider;
    });

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'cost') {
        comparison = a.cost - b.cost;
      } else if (sortBy === 'name') {
        comparison = a.accountName.localeCompare(b.accountName);
      } else if (sortBy === 'owner') {
        const aOwner = a.owner || '';
        const bOwner = b.owner || '';
        comparison = aOwner.localeCompare(bOwner);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [accountTable, searchTerm, filterOwner, filterProvider, sortBy, sortOrder, proposedOwners]);

  // --- 3. APPLY PROPOSAL HANDLER ---
  const handleApplyProposal = (account, suggestedOwner) => {
    // Store the proposed owner
    setProposedOwners(prev => ({
      ...prev,
      [account.accountId]: suggestedOwner
    }));
    
    // Close the panel
    setProposeOwnerAccount(null);
  };

  // --- 4. EXPORT FUNCTION (Includes Proposed Owners) ---
  const handleExport = () => {
    const headers = [
      'Account ID',
      'Account Name',
      'Provider',
      'Top Service',
      'Monthly Cost',
      '% Contribution',
      'Current Owner',
      'Proposed Owner',
      'Ownership Status',
      'Action Required',
      'Governance Note'
    ];

    const rows = filteredAndSortedAccounts.map(acc => {
      const proposedOwner = acc.proposedOwner || null;
      const hasProposal = !!proposedOwner;
      const currentOwner = acc.owner || 'N/A';
      
      let actionRequired = 'None';
      let governanceNote = '';
      
      if (!currentOwner && !hasProposal) {
        actionRequired = 'Assign Owner';
        governanceNote = 'Owner missing - governance risk';
      } else if (!currentOwner && hasProposal) {
        actionRequired = 'Apply Proposed Owner';
        governanceNote = `Proposed owner: ${proposedOwner} - Update in internal systems`;
      } else if (currentOwner && hasProposal && currentOwner !== proposedOwner) {
        actionRequired = 'Review Owner Change';
        governanceNote = `Proposed change from ${currentOwner} to ${proposedOwner}`;
      } else if (currentOwner && currentOwner !== 'N/A') {
        actionRequired = 'None';
        governanceNote = 'Owner assigned';
      } else {
        actionRequired = 'None';
        governanceNote = 'No action needed';
      }
      
      return [
        acc.accountId,
        acc.accountName,
        acc.provider,
        acc.topService,
        acc.cost.toFixed(2),
        acc.percentage.toFixed(2) + '%',
        currentOwner,
        proposedOwner || 'N/A',
        acc.ownershipStatus,
        actionRequired,
        governanceNote
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `accounts-ownership-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 4. PREVENT BACKGROUND SCROLL WHEN MODAL IS OPEN ---
  useEffect(() => {
    if (proposeOwnerAccount) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [proposeOwnerAccount]);


  if (!data || data.length === 0) {
    return (
      <div className="p-10 text-gray-500 text-center">
        <FileText size={48} className="mx-auto mb-4 text-gray-600" />
        <p>No account data available</p>
        <p className="text-xs text-gray-600 mt-2">Upload billing data to view account ownership information</p>
      </div>
    );
  }

  // Safety check for processed data
  if (!accountTable || accountTable.length === 0) {
    return (
      <div className="p-10 text-gray-500 text-center">
        <FileText size={48} className="mx-auto mb-4 text-gray-600" />
        <p>Unable to process account data</p>
        <p className="text-xs text-gray-600 mt-2">Please check your data format and try again</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#0f0f11] text-white font-sans animate-in fade-in duration-500">
      
      {/* 1. HEADER */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-[#a02ff1]" /> Accounts & Ownership
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Cost attribution and governance ledger. Identify account-level cost ownership and accountability gaps.
          </p>
        </div>
      </div>

      {/* 2. OWNERSHIP INSIGHTS (Textual Metrics Only) */}
      <div className="bg-[#1a1b20] border border-white/10 rounded-xl p-6 shadow-lg">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Briefcase size={16} className="text-[#a02ff1]" />
          Ownership Insights
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#0f0f11] border border-white/5 rounded-lg p-4">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Total Accounts</p>
            <p className="text-2xl font-bold text-white">{ownershipInsights.totalAccounts}</p>
          </div>
          <div className="bg-[#0f0f11] border border-white/5 rounded-lg p-4">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">With Assigned Owners</p>
            <p className="text-2xl font-bold text-green-400">{ownershipInsights.accountsWithOwner}</p>
          </div>
          <div className="bg-[#0f0f11] border border-red-500/30 rounded-lg p-4">
            <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider mb-1">Without Owners</p>
            <p className="text-2xl font-bold text-red-400">{ownershipInsights.accountsWithoutOwner}</p>
          </div>
          <div className="bg-[#0f0f11] border border-orange-500/30 rounded-lg p-4">
            <p className="text-[10px] text-orange-400 uppercase font-bold tracking-wider mb-1">Spend Unattributed</p>
            <p className="text-2xl font-bold text-orange-400">{formatCurrency(ownershipInsights.spendWithoutOwner)}</p>
          </div>
          <div className="bg-[#0f0f11] border border-orange-500/30 rounded-lg p-4">
            <p className="text-[10px] text-orange-400 uppercase font-bold tracking-wider mb-1">% Unattributed</p>
            <p className="text-2xl font-bold text-orange-400">{ownershipInsights.spendUnattributedPercent.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* 3. ACCOUNT & OWNERSHIP LEDGER (Primary Table) */}
      <div className="bg-[#1a1b20] border border-white/10 rounded-xl flex flex-col shadow-lg">
        <div className="p-4 border-b border-white/10 flex flex-col lg:flex-row justify-between items-center gap-4 bg-[#25262b]">
          <div className="flex-1 w-full lg:w-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search accounts..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:border-[#a02ff1] focus:ring-1 focus:ring-[#a02ff1] outline-none transition-all placeholder:text-gray-600" 
            />
          </div>
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
            <select 
              value={filterOwner} 
              onChange={(e) => setFilterOwner(e.target.value)} 
              className="pl-3 pr-8 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white outline-none cursor-pointer min-w-[140px]"
            >
              <option value="All" className="bg-[#1a1b20]">All Ownership Status</option>
              <option value="Assigned" className="bg-[#1a1b20]">Assigned</option>
              <option value="Unassigned" className="bg-[#1a1b20]">Unassigned Only</option>
            </select>
            <select 
              value={filterProvider} 
              onChange={(e) => setFilterProvider(e.target.value)} 
              className="pl-3 pr-8 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white outline-none cursor-pointer min-w-[120px]"
            >
              <option value="All" className="bg-[#1a1b20]">All Providers</option>
              {providers.map(p => <option key={p} value={p} className="bg-[#1a1b20]">{p}</option>)}
            </select>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#a02ff1]/10 hover:bg-[#a02ff1]/20 border border-[#a02ff1]/30 rounded-lg text-xs font-bold text-[#a02ff1] transition-all whitespace-nowrap"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#15161a] text-gray-500 font-bold text-[10px] uppercase tracking-wider sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button 
                    onClick={() => {
                      if (sortBy === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortBy('name'); setSortOrder('asc'); }
                    }}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    Account Name / Account ID
                    {sortBy === 'name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">Cloud Provider</th>
                <th className="px-6 py-4 text-left">Top Service by Spend</th>
                <th className="px-6 py-4 text-right">
                  <button 
                    onClick={() => {
                      if (sortBy === 'cost') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortBy('cost'); setSortOrder('desc'); }
                    }}
                    className="flex items-center gap-1 hover:text-white transition-colors ml-auto"
                  >
                    Monthly Cost
                    {sortBy === 'cost' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </button>
                </th>
                <th className="px-6 py-4 text-right">% of Total Spend</th>
                <th className="px-6 py-4 text-left">
                  <button 
                    onClick={() => {
                      if (sortBy === 'owner') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else { setSortBy('owner'); setSortOrder('asc'); }
                    }}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    Owner (Team / Email)
                    {sortBy === 'owner' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                  </button>
                </th>
                <th className="px-6 py-4 text-left">Ownership Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {filteredAndSortedAccounts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No accounts found matching filters
                  </td>
                </tr>
              ) : (
                filteredAndSortedAccounts.map((account) => (
                  <tr 
                    key={account.accountId} 
                    className={`hover:bg-white/5 transition-colors ${
                      account.ownershipStatus === 'Unassigned' ? 'bg-red-500/5 border-l-2 border-red-500/50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-200 text-xs font-bold">{account.accountName}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{account.accountId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400">{account.provider}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-300">{account.topService}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-xs font-bold text-white">{formatCurrency(account.cost)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[10px] text-gray-500 font-mono">{account.percentage.toFixed(2)}%</span>
                    </td>
                    <td className="px-6 py-4">
                      {account.proposedOwner ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-400">
                              {account.proposedOwner.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs text-orange-400 truncate max-w-[150px] font-semibold" title={account.proposedOwner}>
                              {account.proposedOwner}
                            </span>
                          </div>
                          <span className="text-[9px] text-gray-500 italic">(Proposed)</span>
                        </div>
                      ) : account.owner ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                            {account.owner.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-gray-400 truncate max-w-[150px]" title={account.owner}>
                            {account.owner}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {account.proposedOwner ? (
                        <span className="flex items-center gap-1.5 text-[10px] bg-orange-500/10 text-orange-400 px-2 py-1 rounded border border-orange-500/20 w-fit font-bold">
                          <UserPlus size={10} /> Proposed
                        </span>
                      ) : account.ownershipStatus === 'Assigned' ? (
                        <span className="flex items-center gap-1.5 text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20 w-fit font-bold">
                          <CheckCircle size={10} /> Assigned
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20 w-fit font-bold">
                          <AlertTriangle size={10} /> Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {account.proposedOwner ? (
                        <span className="text-[10px] text-orange-400 font-semibold">Proposal Applied</span>
                      ) : !account.owner ? (
                        <button
                          onClick={() => setProposeOwnerAccount(account)}
                          className="flex items-center gap-1.5 text-[10px] text-orange-400 bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20 hover:bg-orange-500/20 transition-all mx-auto"
                        >
                          <UserPlus size={10} /> Propose Owner
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic">No action needed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. PROPOSE OWNER SIDE PANEL (Right-side slide-in, like Resources) */}
      <AnimatePresence>
        {proposeOwnerAccount && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setProposeOwnerAccount(null)} 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed right-0 top-0 bottom-0 w-[500px] bg-[#1a1b20] border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              {/* Panel Header - Fixed */}
              <div className="p-6 border-b border-white/10 bg-[#25262b] flex justify-between items-start flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase bg-[#a02ff1]/10 text-[#a02ff1] px-2 py-0.5 rounded border border-[#a02ff1]/20">Propose Owner</span>
                    <span className="text-xs text-gray-500">Governance</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Account Ownership Proposal</h2>
                </div>
                <button 
                  onClick={() => setProposeOwnerAccount(null)}
                  className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Panel Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Account Information Card */}
                <div className="bg-gradient-to-br from-[#0f0f11] to-[#15161a] border border-[#a02ff1]/20 rounded-lg p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Building size={16} className="text-[#a02ff1]" />
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Account Information</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1 uppercase font-bold">Account Name</p>
                      <p className="text-base text-white font-semibold">{proposeOwnerAccount.accountName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1 uppercase font-bold">Account ID</p>
                      <p className="text-xs text-gray-400 font-mono bg-black/30 px-2 py-1 rounded border border-white/5 inline-block break-all">{proposeOwnerAccount.accountId}</p>
                    </div>
                    <div className="pt-3 border-t border-white/5">
                      <p className="text-xs text-gray-500 mb-1 uppercase font-bold">Monthly Spend</p>
                      <p className="text-2xl text-[#a02ff1] font-bold">{formatCurrency(proposeOwnerAccount.cost)}</p>
                    </div>
                  </div>
                </div>

                {/* Why Ownership Matters */}
                <div className="bg-[#0f0f11] border border-white/5 rounded-lg p-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Briefcase size={14} className="text-[#a02ff1]" />
                    Why Ownership Matters
                  </label>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Account ownership enables cost accountability, budget allocation, and governance. 
                    Unassigned accounts represent governance gaps that should be addressed to ensure 
                    proper financial responsibility and cost optimization.
                  </p>
                </div>

                {/* Analyzed & Suggested Owner */}
                {(() => {
                  const suggestedOwner = suggestOwner(proposeOwnerAccount);
                  return (
                    <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-lg p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={16} className="text-orange-400" />
                        <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider">
                          Analyzed & Suggested Owner
                        </label>
                      </div>
                      <div className="bg-[#0f0f11] border border-orange-500/20 rounded-lg p-5 mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-lg font-bold text-orange-400 flex-shrink-0">
                            {suggestedOwner.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-xl text-white font-bold mb-1">{suggestedOwner}</p>
                            <p className="text-[10px] text-gray-400">Based on account analysis</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        This suggestion is based on account name patterns, service types, and cost analysis. 
                        Review carefully before applying to ensure it aligns with your organization's ownership structure.
                      </p>
                    </div>
                  );
                })()}

                {/* Governance Note */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-amber-400 font-semibold mb-1">⚠️ Governance Note</p>
                      <p className="text-xs text-amber-300/90 leading-relaxed">
                        Ownership updates must be applied in internal or cloud systems. 
                        This proposal will be included in the CSV export for review and implementation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel Footer - Fixed */}
              <div className="p-6 border-t border-white/10 bg-[#25262b] flex-shrink-0">
                <div className="flex gap-3">
                  <button
                    onClick={() => setProposeOwnerAccount(null)}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-semibold text-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const suggestedOwner = suggestOwner(proposeOwnerAccount);
                      handleApplyProposal(proposeOwnerAccount, suggestedOwner);
                    }}
                    className="flex-1 px-4 py-3 bg-[#a02ff1] hover:bg-[#8e25d9] rounded-lg text-sm font-semibold text-white transition-all shadow-lg shadow-[#a02ff1]/20"
                  >
                    Apply Proposal
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

export default AccountsOwnership;
