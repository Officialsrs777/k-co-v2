export const processRecords = (records) => {
  let totalSpend = 0;
  let leakageCost = 0;
  const timelineMap = {};
  const serviceMap = {};
  const regionMap = {};
  const leakageItems = [];

  records.forEach((row, index) => {
    try {
      // 1. Safe Parse Cost (Handle currency symbols or commas if present)
      // Check both 'BilledCost' and 'Cost' (common variations)
      let rawCost = row.BilledCost || row.Cost || '0';
      if (typeof rawCost === 'string') {
        rawCost = rawCost.replace(/[$,]/g, '');
      }
      const cost = parseFloat(rawCost) || 0;

      // 2. Aggregate Total Spend
      totalSpend += cost;

      // 3. Leakage Logic (If CommitmentDiscountStatus is missing/uncovered)
      // Safely check properties existence
      const discountStatus = row.CommitmentDiscountStatus || '';
      const isOptimized = discountStatus.toLowerCase().includes('used') || 
                          discountStatus.toLowerCase().includes('covered');
      
      if (!isOptimized && cost > 0.0001) { 
        leakageCost += cost;
        
        if (leakageItems.length < 100) {
           leakageItems.push({
             name: row.ResourceName || row.ResourceId || row.ServiceName || 'Unknown Resource',
             service: row.ServiceName || 'Unknown Service',
             region: row.RegionName || 'Global',
             cost: cost,
             CommitmentDiscountStatus: 'Uncovered'
           });
        }
      }

      // 4. Timeline (Daily Spend) - Safe Date Parsing
      const dateStr = row.BillingPeriodStart || row.UsageStartDate || row.Date;
      if (dateStr) {
        // Take the YYYY-MM-DD part safely
        const date = dateStr.split(' ')[0]; 
        timelineMap[date] = (timelineMap[date] || 0) + cost;
      }

      // 5. Service Breakdown
      const service = row.ServiceName || row.Product || 'Other';
      serviceMap[service] = (serviceMap[service] || 0) + cost;
      
      // 6. Region Breakdown
      const region = row.RegionName || row.Region || 'Global';
      regionMap[region] = (regionMap[region] || 0) + cost;

    } catch (err) {
      console.warn(`Skipping row ${index} due to error:`, err.message);
    }
  });

  // --- FORMAT FOR FRONTEND ---
  
  // A. Timeline
  const timelineGraph = Object.keys(timelineMap).sort().map(date => ({
    date,
    cost: parseFloat(timelineMap[date].toFixed(2))
  }));

  // B. Top Services
  const productEarnings = Object.entries(serviceMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // C. Efficiency Score
  const efficiencyScore = totalSpend > 0 
    ? Math.round(((totalSpend - leakageCost) / totalSpend) * 100) 
    : 100;

  return {
    totalSpend: totalSpend.toFixed(2),
    leakageCost: leakageCost.toFixed(2),
    efficiencyScore,
    timelineGraph,
    productEarnings,
    leakageItems,
    recordCount: records.length,
    rawRecords: records.slice(0, 1000) // Send first 1000 rows for the table to avoid payload limit
  };
};