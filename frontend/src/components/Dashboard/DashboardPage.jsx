import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import VerticalSidebar from './VerticalSidebar';
import Header from './Header';
import FilterBar from './FilterBar';
import KpiGrid from './KpiGrid';
import CostTrendChart from './CostTrendChart';
import ServiceSpendChart from './ServiceSpendChart';
import RegionPieChart from './RegionPieChart';
import DataExplorer from './DataExplorer'; 
import CostAnalysis from './CostAnalysis'; 
import CostDrivers from './CostDrivers'; // ✅ Import the new component

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for Filters & Dynamic Grouping (Overview Page Only)
  const [filters, setFilters] = useState({ provider: 'All', service: 'All', region: 'All' });
  const [groupBy, setGroupBy] = useState('ServiceName'); 
  
  // Chart-specific filters
  const [chartFilters, setChartFilters] = useState({
    trendChart: { limit: 30 }, 
    pieChart: { limit: 8 }, 
    barChart: { limit: 8 }, 
    dataLimit: 1000 
  });

  // --- 1. ROBUST DATA LOADING ---
  useEffect(() => {
    const storedRaw = localStorage.getItem('rawRecords');
    
    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw);
        
        let cleanData = [];
        if (Array.isArray(parsed)) {
            cleanData = parsed;
        } else if (parsed && typeof parsed === 'object') {
            if (parsed.data && Array.isArray(parsed.data)) cleanData = parsed.data;
            else if (parsed.records && Array.isArray(parsed.records)) cleanData = parsed.records;
            else cleanData = Object.values(parsed);
        }

        if (cleanData.length > 0) {
            setRawData(cleanData);
            setLoading(false);
        } else {
            console.warn("Data found but empty or invalid format");
            navigate('/upload');
        }

      } catch (e) {
        console.error("Failed to parse data:", e);
        navigate('/upload');
      }
    } else {
      navigate('/upload');
    }
  }, [navigate]);

  // --- 2. DATA PROCESSING (Only for Overview Page Charts) ---
  const processedData = useMemo(() => {
    if (!rawData.length) return null;

    let dataToProcess = [...rawData];
    if (dataToProcess.length > chartFilters.dataLimit) {
      dataToProcess = dataToProcess
        .sort((a, b) => (parseFloat(b.BilledCost) || 0) - (parseFloat(a.BilledCost) || 0))
        .slice(0, chartFilters.dataLimit);
    }

    let filtered = dataToProcess.filter(item => {
      const itemProvider = item.ProviderName || 'Unknown';
      const itemService = item.ServiceName || 'Unknown';
      const itemRegion = item.RegionName || 'Unknown';

      const matchProvider = filters.provider === 'All' || itemProvider === filters.provider;
      const matchService = filters.service === 'All' || itemService === filters.service;
      const matchRegion = filters.region === 'All' || itemRegion === filters.region;

      return matchProvider && matchService && matchRegion;
    });

    const totalSpend = filtered.reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);
    
    const dailyMap = {};
    filtered.forEach(item => {
      const date = item.ChargePeriodStart ? item.ChargePeriodStart.split(' ')[0] : 'Unknown';
      dailyMap[date] = (dailyMap[date] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    let dailyData = Object.keys(dailyMap).sort().map(date => ({ date, cost: dailyMap[date] }));
    if (dailyData.length > chartFilters.trendChart.limit) {
      dailyData = dailyData.slice(-chartFilters.trendChart.limit);
    }

    const groupMap = {};
    filtered.forEach(item => {
      const key = item[groupBy] || 'Unknown'; 
      groupMap[key] = (groupMap[key] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    
    const groupedData = Object.entries(groupMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, chartFilters.barChart.limit); 

    const regionMap = {};
    filtered.forEach(item => {
      const r = item.RegionName || 'Global';
      regionMap[r] = (regionMap[r] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    const topRegion = Object.entries(regionMap).sort((a,b) => b[1] - a[1])[0];
    const regionData = Object.entries(regionMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, chartFilters.pieChart.limit); 

    // Calculate anomalies - items with unusually high costs (2 standard deviations above mean)
    const costs = filtered.map(item => parseFloat(item.BilledCost) || 0);
    const avg = costs.length > 0 ? costs.reduce((a, b) => a + b, 0) / costs.length : 0;
    const variance = costs.length > 0 ? costs.reduce((sum, cost) => sum + Math.pow(cost - avg, 2), 0) / costs.length : 0;
    const stdDev = Math.sqrt(variance);
    const threshold = avg + (2 * stdDev);
    const anomalies = filtered
      .map((item, index) => ({
        ...item,
        cost: parseFloat(item.BilledCost) || 0,
        index
      }))
      .filter(item => item.cost > threshold)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10); // Top 10 anomalies for insights

    // 4. NEW KPI METRICS
    
    // 4a. Spend Change (%) - Compare current period vs previous comparable period
    // Split data by date into two halves for comparison
    const sortedByDate = [...filtered].sort((a, b) => {
      const dateA = a.ChargePeriodStart ? new Date(a.ChargePeriodStart.split(' ')[0]) : new Date(0);
      const dateB = b.ChargePeriodStart ? new Date(b.ChargePeriodStart.split(' ')[0]) : new Date(0);
      return dateA - dateB;
    });
    const midPoint = Math.floor(sortedByDate.length / 2);
    const previousPeriodSpend = sortedByDate.slice(0, midPoint).reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);
    const currentPeriodSpend = sortedByDate.slice(midPoint).reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);
    const spendChangePercent = previousPeriodSpend > 0 
      ? ((currentPeriodSpend - previousPeriodSpend) / previousPeriodSpend) * 100 
      : 0;

    // 4b. Top Cloud Provider - ProviderName with highest SUM(BilledCost)
    const providerMap = {};
    filtered.forEach(item => {
      const provider = item.ProviderName || 'Unknown';
      providerMap[provider] = (providerMap[provider] || 0) + (parseFloat(item.BilledCost) || 0);
    });
    const topProvider = Object.entries(providerMap).sort((a, b) => b[1] - a[1])[0];

    // 4c. Untagged Cost Impact - SUM(BilledCost WHERE Tags IS NULL or empty)
    const untaggedCost = filtered
      .filter(item => {
        const tags = item.Tags || item.Tag || '';
        return !tags || tags.trim() === '' || tags.toLowerCase() === 'null' || tags.toLowerCase() === 'none';
      })
      .reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);

    // 4d. Cost With Missing Metadata - Cost where ServiceName, RegionName, or ResourceName is NULL
    const missingMetadataCost = filtered
      .filter(item => {
        const hasServiceName = item.ServiceName && item.ServiceName.trim() !== '';
        const hasRegionName = item.RegionName && item.RegionName.trim() !== '';
        const hasResourceName = item.ResourceName && item.ResourceName.trim() !== '';
        return !hasServiceName || !hasRegionName || !hasResourceName;
      })
      .reduce((acc, curr) => acc + (parseFloat(curr.BilledCost) || 0), 0);

    return { 
      totalSpend, 
      dailyData, 
      groupedData, 
      topRegion: { name: topRegion?.[0], value: topRegion?.[1] },
      topService: groupedData[0], // Top item of current group
      regionData, // For pie chart
      filteredRecords: filtered,
      anomalies: anomalies,
      anomaliesCount: anomalies.length,
      // New KPIs
      spendChangePercent,
      topProvider: { name: topProvider?.[0] || 'N/A', value: topProvider?.[1] || 0 },
      untaggedCost,
      missingMetadataCost
    };
  }, [rawData, filters, groupBy, chartFilters]);

  if (loading) return <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center"><Loader2 className="animate-spin text-[#a02ff1]" /></div>;
  if (!processedData) return null;

  // --- ROUTING LOGIC ---
  const isDataExplorer = location.pathname.includes('/data-explorer');
  const isCostAnalysis = location.pathname.includes('/cost-analysis'); 
  const isCostDrivers = location.pathname.includes('/cost-drivers'); // ✅ Detect new route

  // Dynamic Header Title
  const getPageTitle = () => {
    if (isDataExplorer) return "Data Explorer";
    if (isCostAnalysis) return "Cost Analysis";
    if (isCostDrivers) return "Cost Drivers"; // ✅ Add Title
    return "Cost Overview";
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans">
      <VerticalSidebar />
      <Header title="Cost Overview" anomalies={processedData.anomalies} anomaliesCount={processedData.anomaliesCount} />

      <main className="ml-[240px] pt-[64px] min-h-screen relative">
        <div className="p-6 space-y-4 max-w-[1920px] mx-auto h-full">
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10 ml-[240px] mt-[64px]" />

          {/* --- VIEW SWITCHER --- */}
          
          <KpiGrid 
            spend={processedData.totalSpend}
            topRegion={processedData.topRegion}
            topService={processedData.topService}
            spendChangePercent={processedData.spendChangePercent}
            topProvider={processedData.topProvider}
            untaggedCost={processedData.untaggedCost}
            missingMetadataCost={processedData.missingMetadataCost}
            filteredRecords={processedData.filteredRecords}
          />

          {/* 2. COST ANALYSIS VIEW */}
          {isCostAnalysis && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
               <CostAnalysis data={rawData} />
            </div>
          )}

          {/* 3. COST DRIVERS VIEW (New) */}
          {isCostDrivers && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
               {/* Pass rawData so it can calculate its own period-over-period stats */}
               <CostDrivers data={rawData} />
            </div>
          )}

          {/* 4. OVERVIEW VIEW (Default) */}
          {!isDataExplorer && !isCostAnalysis && !isCostDrivers && (
            <div className="animate-in fade-in zoom-in-95 duration-300 space-y-4">
              <FilterBar 
                data={rawData} 
                filters={filters} 
                onChange={setFilters}
                groupBy={groupBy}
                onGroupChange={setGroupBy} 
              />
              
              <KpiGrid 
                spend={processedData.totalSpend}
                topRegion={processedData.topRegion}
                topService={processedData.topService}
              />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <CostTrendChart 
                  data={processedData.dailyData} 
                  limit={chartFilters.trendChart.limit}
                  onLimitChange={(limit) => setChartFilters(prev => ({ ...prev, trendChart: { limit } }))}
                />
                <ServiceSpendChart 
                  data={processedData.groupedData} 
                  title={`Spend by ${groupBy.replace(/([A-Z])/g, ' $1').trim()}`}
                  limit={chartFilters.barChart.limit}
                  onLimitChange={(limit) => setChartFilters(prev => ({ ...prev, barChart: { limit } }))}
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <RegionPieChart 
                  data={processedData.regionData} 
                  limit={chartFilters.pieChart.limit}
                  onLimitChange={(limit) => setChartFilters(prev => ({ ...prev, pieChart: { limit } }))}
                />
                <ServiceSpendChart 
                  data={processedData.groupedData.slice(0, 6)} 
                  title="Top Services Breakdown"
                  limit={6}
                />
                <CostTrendChart 
                  data={processedData.dailyData.slice(-14)} 
                  limit={14}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;