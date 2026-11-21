// ==================== DASHBOARD ====================

function formatToBengaliNumerals(num) {
    if (num === undefined || num === null) return '';
    var L = (typeof APP !== 'undefined' && APP.language) ? APP.language : 'bn';
    if (L === 'en') return String(num);
    var bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, function(d) {
        return bnDigits[d];
    });
}

// ✅ ব্যালেন্স প্রগ্রেস - উন্নত লজিক (১০ স্তর)
function getBalanceProgress(balance) {
    if (balance >= 1000) return 100;
    else if (balance >= 800) return 75;
    else if (balance >= 700) return 65;
    else if (balance >= 600) return 55;
    else if (balance >= 500) return 45;
    else if (balance >= 400) return 35;
    else if (balance >= 300) return 30;
    else if (balance >= 200) return 25;
    else if (balance >= 100) return 10;
    else return 0;
}

// ✅ ব্যালেন্সের রঙ ও স্ট্যাটাস
function getBalanceColor(balance) {
    if (balance >= 1000) return { color: '#10b981', bg: 'linear-gradient(90deg, #10b981, #059669)', text: '✅ Excellent!' };
    else if (balance >= 800) return { color: '#34d399', bg: 'linear-gradient(90deg, #34d399, #10b981)', text: '👍 Great!' };
    else if (balance >= 700) return { color: '#6ee7b7', bg: 'linear-gradient(90deg, #6ee7b7, #34d399)', text: '💪 Good' };
    else if (balance >= 600) return { color: '#fcd34d', bg: 'linear-gradient(90deg, #fcd34d, #f59e0b)', text: '⚡ Moderate' };
    else if (balance >= 500) return { color: '#fbbf24', bg: 'linear-gradient(90deg, #fbbf24, #f59e0b)', text: '⚠️ Average' };
    else if (balance >= 400) return { color: '#fb923c', bg: 'linear-gradient(90deg, #fb923c, #f97316)', text: '⚠️ Low' };
    else if (balance >= 300) return { color: '#f87171', bg: 'linear-gradient(90deg, #f87171, #ef4444)', text: '🔴 Very Low' };
    else if (balance >= 200) return { color: '#ef4444', bg: 'linear-gradient(90deg, #ef4444, #dc2626)', text: '🆘 Critical' };
    else if (balance >= 100) return { color: '#dc2626', bg: 'linear-gradient(90deg, #dc2626, #b91c1c)', text: '🚨 Danger' };
    else return { color: '#991b1b', bg: 'linear-gradient(90deg, #991b1b, #7f1d1d)', text: '🚨 Empty!' };
}

// ✅ ব্যালেন্স আইকন
function getBalanceIcon(balance) {
    if (balance >= 1000) return '🟢';
    else if (balance >= 800) return '🟩';
    else if (balance >= 700) return '🟩';
    else if (balance >= 600) return '🟡';
    else if (balance >= 500) return '🟡';
    else if (balance >= 400) return '🟠';
    else if (balance >= 300) return '🔴';
    else if (balance >= 200) return '🆘';
    else if (balance >= 100) return '🚨';
    else return '🚨';
}

// ✅ ব্যালেন্স স্ট্যাটাস টেক্সট (বাংলা/ইংরেজি)
function getBalanceStatusText(balance, L) {
    var info = getBalanceColor(balance);
    if (L === 'en') return info.text;
    
    if (balance >= 1000) return '✅ চমৎকার!';
    else if (balance >= 800) return '👍 দারুণ!';
    else if (balance >= 700) return '💪 ভালো';
    else if (balance >= 600) return '⚡ মধ্যম';
    else if (balance >= 500) return '⚠️ গড়';
    else if (balance >= 400) return '⚠️ কম';
    else if (balance >= 300) return '🔴 খুব কম';
    else if (balance >= 200) return '🆘 সংকটজনক';
    else if (balance >= 100) return '🚨 বিপজ্জনক';
    else return '🚨 শূন্য!';
}

// ✅ ব্যালেন্স কার্ড তৈরি
function createBalanceCard(balance, L) {
    var progress = getBalanceProgress(balance);
    var balanceInfo = getBalanceColor(balance);
    var icon = getBalanceIcon(balance);
    var statusText = getBalanceStatusText(balance, L);
    
    return `
    <div class="balance-card">
        <div style="position: absolute; top: -60px; right: -40px; width: 180px; height: 180px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -40px; left: -20px; width: 140px; height: 140px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
        
        <div style="position: relative; z-index: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div>
                    <div style="font-size: 14px; color: rgba(255,255,255,0.85); margin-bottom: 4px;">${__('balance')}</div>
                    <div style="font-size: 36px; font-weight: 700;">${__('taka')} ${balance.toFixed(2)}</div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; display: flex; align-items: center; gap: 6px;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${balanceInfo.color};"></span>
                        ${icon} ${statusText}
                    </div>
                </div>
                <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); font-size: 28px;">
                    ${icon}
                </div>
            </div>

            <div style="margin-top: 16px;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.8); margin-bottom: 8px;">
                    <span>0%</span>
                    <span>${L === 'en' ? 'Balance' : 'ব্যালেন্স'}: ${progress}%</span>
                    <span>100%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%; background: ${balanceInfo.bg};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 4px;">
                    <span>${L === 'en' ? 'Target: ৳ 0' : 'টার্গেট: ৳ ০'}</span>
                    <span>${L === 'en' ? 'Target: ৳ 1,000+' : 'টার্গেট: ৳ ১,০০০+'}</span>
                </div>
            </div>
        </div>
    </div>
    `;
}

// ============================================================
// ✅ হেল্পার ফাংশন
// ============================================================
function getTotalKWH(meterId) {
    const meterData = (typeof getMeterData === 'function') ? getMeterData(meterId) : (APP.metersData ? APP.metersData[meterId] : null);
    if (!meterData) return 0;
    var rawTransactions = meterData.transactions || [];
    const transactions = Array.isArray(rawTransactions) ? rawTransactions : (typeof rawTransactions === 'object' && rawTransactions ? Object.values(rawTransactions) : []);
    let totalKWH = 0;
    transactions.forEach(t => {
        if (t.units) totalKWH += t.units;
    });
    return totalKWH;
}

function getMonthlyAvgExpense(meterId) {
    const meterData = (typeof getMeterData === 'function') ? getMeterData(meterId) : (APP.metersData ? APP.metersData[meterId] : null);
    if (!meterData) return 0;
    var rawTx = meterData.transactions || [];
    var txList = Array.isArray(rawTx) ? rawTx : (typeof rawTx === 'object' ? Object.values(rawTx) : []);
    const transactions = txList.filter(t => t && (t.type === 'electricity_bill' || t.type === 'bill'));
    if (transactions.length === 0) return 0;

    const monthMap = {};
    transactions.forEach(t => {
        const d = new Date(t.date || t.timestamp);
        const key = d.getFullYear() + '-' + d.getMonth();
        if (!monthMap[key]) monthMap[key] = 0;
        monthMap[key] += (Number(t.amount) || 0);
    });

    const totalExpense = Object.values(monthMap).reduce((sum, v) => sum + v, 0);
    const monthCount = Object.keys(monthMap).length || 1;
    return totalExpense / monthCount;
}

function getMonthlyAvgKWH(meterId) {
    const meterData = (typeof getMeterData === 'function') ? getMeterData(meterId) : (APP.metersData ? APP.metersData[meterId] : null);
    if (!meterData) return 0;
    var rawTx = meterData.transactions || [];
    var txList = Array.isArray(rawTx) ? rawTx : (typeof rawTx === 'object' ? Object.values(rawTx) : []);
    const transactions = txList.filter(t => t && t.units && t.units > 0);
    if (transactions.length === 0) return 0;

    const monthMap = {};
    transactions.forEach(t => {
        const d = new Date(t.date || t.timestamp);
        const key = d.getFullYear() + '-' + d.getMonth();
        if (!monthMap[key]) monthMap[key] = 0;
        monthMap[key] += (Number(t.units) || 0);
    });

    const totalKWH = Object.values(monthMap).reduce((sum, v) => sum + v, 0);
    const monthCount = Object.keys(monthMap).length || 1;
    return totalKWH / monthCount;
}

function getLastExpense(meterId) {
    const meterData = (typeof getMeterData === 'function') ? getMeterData(meterId) : (APP.metersData ? APP.metersData[meterId] : null);
    if (!meterData || !meterData.transactions) return 0;
    var rawTx = meterData.transactions || [];
    var txList = Array.isArray(rawTx) ? rawTx : (typeof rawTx === 'object' ? Object.values(rawTx) : []);
    const bills = txList
        .filter(t => t && (t.type === 'electricity_bill' || t.type === 'bill'))
        .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp));
    return bills.length > 0 ? (Number(bills[0].amount) || 0) : 0;
}

function getRecentTransactions(meterId, count) {
    const meterData = (typeof getMeterData === 'function') ? getMeterData(meterId) : (APP.metersData ? APP.metersData[meterId] : null);
    if (!meterData || !meterData.transactions) return [];
    var rawTx = meterData.transactions || [];
    var txList = Array.isArray(rawTx) ? rawTx : (typeof rawTx === 'object' ? Object.values(rawTx) : []);
    return txList
        .slice()
        .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp))
        .slice(0, count || 5);
}

function getDemandVatRebateSummary(meterId) {
    const meterData = (typeof getMeterData === 'function') ? getMeterData(meterId) : (APP.metersData ? APP.metersData[meterId] : null);
    if (!meterData) return { totalDemand: 0, totalVat: 0, totalRebate: 0, totalNet: 0, rechargeCount: 0 };
    
    var rawTx = meterData.transactions || [];
    const transactions = Array.isArray(rawTx) ? rawTx : (typeof rawTx === 'object' ? Object.values(rawTx) : []);
    let totalDemand = 0;
    let totalVat = 0;
    let totalRebate = 0;
    let totalNet = 0;
    let rechargeCount = 0;
    
    transactions.forEach(t => {
        if (t && (t.type === 'recharge' || t.deductions)) {
            if (t.deductions) {
                totalDemand += Number(t.deductions.demandCharge) || 0;
                totalVat += Number(t.deductions.vat) || 0;
                totalRebate += Number(t.deductions.rebate) || 0;
                totalNet += Number(t.deductions.netAmount) || 0;
            }
            rechargeCount++;
        }
    });
    
    return {
        totalDemand: Math.round(totalDemand * 100) / 100,
        totalVat: Math.round(totalVat * 100) / 100,
        totalRebate: Math.round(totalRebate * 100) / 100,
        totalNet: Math.round(totalNet * 100) / 100,
        rechargeCount: rechargeCount
    };
}

function getIconSVG(iconName) {
    var icons = {
        wallet: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>',
        dollar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor" font-family="\'Noto Sans Bengali\', sans-serif">৳</text></svg>',
        taka: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><text x="50%" y="54%" dominant-baseline="central" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor" font-family="\'Noto Sans Bengali\', sans-serif">৳</text></svg>',
        activity: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>',
        chart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21v-6"></path><path d="M12 21V3"></path><path d="M19 21V9"></path></svg>',
        zap: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>',
        layers: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg>',
        trendingDown: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>',
        demand: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
        vat: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
        rebate: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>'
    };
    return icons[iconName] || '';
}

function getMeterDisplayName(meter) {
    if (!meter) return 'Unknown';
    var L = APP.language || 'bn';
    if (L === 'en') {
        return meter.name || 'Unknown';
    }
    return meter.nameBn || meter.name || 'Unknown';
}

// ============================================================
// ✅ রেন্ট ডাটা ফাংশন
// ============================================================
function getRentSummary() {
    if (!APP.rentData) {
        return { totalRent: 0, totalService: 0, totalParking: 0, totalOverall: 0, count: 0 };
    }
    return {
        totalRent: APP.rentData.totalRent || 0,
        totalService: APP.rentData.totalService || 0,
        totalParking: APP.rentData.totalParking || 0,
        totalOverall: APP.rentData.totalOverall || 0,
        count: APP.rentData.records?.length || 0
    };
}

// ============================================================
// ✅ এক্সপেন্স ডাটা ফাংশন
// ============================================================
function getExpenseSummary() {
    if (!APP.currentUser) {
        return { totalOverall: 0, count: 0 };
    }
    var userId = APP.currentUser.id || APP.currentUser.email || 'default';
    var key = 'expenseData_' + userId;
    if (!APP[key]) {
        return { totalOverall: 0, count: 0 };
    }
    return {
        totalOverall: APP[key].totalOverall || 0,
        count: APP[key].records?.length || 0
    };
}

// ✅ রেন্ট সারাংশ কার্ড তৈরি
// ============================================================
function createRentSummaryCards(L) {
    // রেন্ট ডাটা চেক করুন
    if (!APP.rentData || !APP.rentData.records || APP.rentData.records.length === 0) {
        return `
        <div style="background: #fff; border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; border: 1px solid #f1f5f9;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <h4 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
                    <span style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;">🏠</span>
                    ${L === 'en' ? 'Rent & Service Summary' : 'ভাড়া ও সার্ভিস সারাংশ'}
                </h4>
                <button onclick="navigateTo('rent')" style="background: none; border: none; color: #f59e0b; font-weight: 600; font-size: 12px; cursor: pointer; padding: 4px 12px; border-radius: 6px; transition: all 0.2s;">
                    ${L === 'en' ? 'Add Rent →' : 'ভাড়া যোগ করুন →'}
                </button>
            </div>
            <div style="text-align: center; padding: 16px 0; color: #94a3b8; font-size: 13px;">
                ${L === 'en' ? 'No rent records found. Click "Add Rent" to get started.' : 'কোন ভাড়া রেকর্ড পাওয়া যায়নি। "ভাড়া যোগ করুন" ক্লিক করে শুরু করুন।'}
            </div>
        </div>
        `;
    }

    // টোটাল আপডেট
    updateRentTotals();

    // ============================================================
    // ✅ মিটার ভিত্তিক গ্রুপিং
    // ============================================================
    var meterGroups = {};
    APP.rentData.records.forEach(function(record) {
        var meterId = record.meterId || 'unknown';
        if (!meterGroups[meterId]) {
            meterGroups[meterId] = {
                meterName: record.meterName || 'Unknown',
                totalRent: 0,
                totalService: 0,
                totalParking: 0,
                totalOverall: 0,
                count: 0,
                records: []
            };
        }
        meterGroups[meterId].totalRent += record.rentAmount || 0;
        meterGroups[meterId].totalService += record.serviceCharge || 0;
        meterGroups[meterId].totalParking += record.parkingCharge || 0;
        meterGroups[meterId].totalOverall += record.totalAmount || 0;
        meterGroups[meterId].count++;
        meterGroups[meterId].records.push(record);
    });

    var meterKeys = Object.keys(meterGroups);
    var totalRent = APP.rentData.totalRent || 0;
    var totalService = APP.rentData.totalService || 0;
    var totalParking = APP.rentData.totalParking || 0;
    var totalOverall = APP.rentData.totalOverall || 0;
    var recordCount = APP.rentData.records.length || 0;

    // ✅ রং (সাদা বাদ - গাঢ় রং)
    var colorPalette = [
        { bg: 'linear-gradient(135deg, #f093fb, #f5576c)', text: '#000000' },
        { bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', text: '#070707' },
        { bg: 'linear-gradient(135deg, #43e97b, #38f9d7)', text: '#0f172a' },
        { bg: 'linear-gradient(135deg, #fa709a, #fee140)', text: '#0f172a' },
        { bg: 'linear-gradient(135deg, #a18cd1, #c2dbfb)', text: '#0f172a' },
        { bg: 'linear-gradient(135deg, #f6d365, #fda085)', text: '#0f172a' },
        { bg: 'linear-gradient(135deg, #89f7fe, #66a6ff)', text: '#0f172a' },
        { bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)', text: '#0f172a' }
    ];

    // ============================================================
    // ✅ HTML তৈরি
    // ============================================================
    var html = `
    <div style="background: #fff; border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 12px rgba(10, 10, 10, 0.06); margin-bottom: 20px; border: 1px solid #323435;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
            <h4 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
                <span style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;">🏠</span>
                ${L === 'en' ? 'Rent & Service Summary' : 'ভাড়া ও সার্ভিস সারাংশ'}
                <span style="font-size: 11px; color: #41454b; font-weight: 400;">(${recordCount} ${L === 'en' ? 'records' : 'টি'})</span>
            </h4>
            <button onclick="navigateTo('rent')" style="background: none; border: none; color: #f59e0b; font-weight: 600; font-size: 12px; cursor: pointer; padding: 4px 12px; border-radius: 6px; transition: all 0.2s;">
                ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
            </button>
        </div>
    `;

    // ============================================================
    // ✅ মিটার ভিত্তিক বিস্তারিত কার্ড
    // ============================================================
    if (meterKeys.length > 0) {
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-bottom: 12px;">`;
        
        meterKeys.forEach(function(meterId, index) {
            var group = meterGroups[meterId];
            var colorIdx = index % colorPalette.length;
            var colors = colorPalette[colorIdx];
            
            // মাসের নাম বের করুন
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var latestRecord = group.records[group.records.length - 1];
            var monthDisplay = '';
            if (latestRecord && latestRecord.month) {
                var parts = latestRecord.month.split('-');
                monthDisplay = monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0];
            }
            
            html += `
            <div style="background: ${colors.bg}; border-radius: 12px; padding: 14px 16px; color: ${colors.text}; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div style="font-size: 13px; font-weight: 700; color: ${colors.text};">${group.meterName || 'Unknown'}</div>
                    <div style="font-size: 10px; font-weight: 600; background: rgba(0,0,0,0.08); padding: 2px 10px; border-radius: 12px; color: ${colors.text};">
                        ${group.count} ${L === 'en' ? 'rec' : 'টি'} ${monthDisplay ? '· ' + monthDisplay : ''}
                    </div>
                </div>
                
                <!-- মোট পরিমাণ -->
                <div style="font-size: 22px; font-weight: 700; margin: 4px 0; color: ${colors.text};">
                    ৳ ${formatNumberWithComma(group.totalOverall)}
                </div>
                
                <!-- বিস্তারিত (ভাড়া, সার্ভিস, পার্কিং) - গাঢ় রং -->
                <div style="display: grid; grid-template-columns: ${group.totalParking > 0 ? '1fr 1fr 1fr' : '1fr 1fr'}; gap: 6px; margin-top: 8px;">
                    <div style="background: rgba(0,0,0,0.08); border-radius: 6px; padding: 4px 8px; text-align: center;">
                        <div style="font-size: 8px; text-transform: uppercase; opacity: 0.6; color: ${colors.text};">${L === 'en' ? 'Rent' : 'ভাড়া'}</div>
                        <div style="font-weight: 700; font-size: 12px; color: ${colors.text};">৳ ${formatNumberWithComma(group.totalRent)}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.08); border-radius: 6px; padding: 4px 8px; text-align: center;">
                        <div style="font-size: 8px; text-transform: uppercase; opacity: 0.6; color: ${colors.text};">${L === 'en' ? 'Service' : 'সার্ভিস'}</div>
                        <div style="font-weight: 700; font-size: 12px; color: ${colors.text};">৳ ${formatNumberWithComma(group.totalService)}</div>
                    </div>
                    ${group.totalParking > 0 ? `
                    <div style="background: rgba(0,0,0,0.08); border-radius: 6px; padding: 4px 8px; text-align: center;">
                        <div style="font-size: 8px; text-transform: uppercase; opacity: 0.6; color: ${colors.text};">${L === 'en' ? 'Parking' : 'পার্কিং'}</div>
                        <div style="font-weight: 700; font-size: 12px; color: ${colors.text};">৳ ${formatNumberWithComma(group.totalParking)}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            `;
        });

        html += `</div>`;
    }

    // ============================================================
    // ✅ গ্র্যান্ড টোটাল (৪টি কলাম)
    // ============================================================
    html += `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
            <div style="background: #fffbeb; border-radius: 8px; padding: 8px 10px; text-align: center; border: 1px solid #fde68a;">
                <div style="font-size: 9px; color: #92400e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">${L === 'en' ? 'Total Rent' : 'মোট ভাড়া'}</div>
                <div style="font-size: 16px; font-weight: 700; color: #d97706;">৳ ${formatNumberWithComma(totalRent)}</div>
            </div>
            <div style="background: #ecfdf5; border-radius: 8px; padding: 8px 10px; text-align: center; border: 1px solid #a7f3d0;">
                <div style="font-size: 9px; color: #065f46; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">${L === 'en' ? 'Total Service' : 'মোট সার্ভিস'}</div>
                <div style="font-size: 16px; font-weight: 700; color: #059669;">৳ ${formatNumberWithComma(totalService)}</div>
            </div>
            <div style="background: #f5f3ff; border-radius: 8px; padding: 8px 10px; text-align: center; border: 1px solid #c4b5fd;">
                <div style="font-size: 9px; color: #5b21b6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">${L === 'en' ? 'Total Parking' : 'মোট পার্কিং'}</div>
                <div style="font-size: 16px; font-weight: 700; color: #7c3aed;">৳ ${formatNumberWithComma(totalParking)}</div>
            </div>
            <div style="background: #eff6ff; border-radius: 8px; padding: 8px 10px; text-align: center; border: 1px solid #93c5fd;">
                <div style="font-size: 9px; color: #1e40af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">${L === 'en' ? 'Grand Total' : 'সর্বমোট'}</div>
                <div style="font-size: 16px; font-weight: 700; color: #2563eb;">৳ ${formatNumberWithComma(totalOverall)}</div>
            </div>
        </div>
    </div>
    `;

    return html;
}

// ============================================================
// ✅ কমা সেপারেটর ফাংশন
// ============================================================
function formatNumberWithComma(num) {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return Number(num).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ✅ এক্সপেন্স সারাংশ কার্ড তৈরি
function createExpenseSummaryCards(L) {
    var todayExpense = 0;
    var weekExpense = 0;
    var monthExpense = 0;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 7);
    var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // সব মিটারের ট্রানজেকশন সংগ্রহ করুন
    var allTransactions = [];
    for (var mid in APP.metersData) {
        if (APP.metersData.hasOwnProperty(mid)) {
            var tx = APP.metersData[mid].transactions || [];
            allTransactions = allTransactions.concat(tx);
        }
    }
    
    // খরচ ক্যালকুলেট করুন
    allTransactions.forEach(function(t) {
        if (t.type === 'electricity_bill' || t.type === 'bill') {
            var d = new Date(t.date || t.timestamp);
            if (isNaN(d.getTime())) return;
            var amount = t.amount || 0;
            if (d >= today) todayExpense += amount;
            if (d >= weekStart) weekExpense += amount;
            if (d >= monthStart) monthExpense += amount;
        }
    });

    // ফরম্যাট ফাংশন
    var formatNum = function(num) {
        return Number(num).toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    // কোনো খরচ নেই
    if (todayExpense === 0 && weekExpense === 0 && monthExpense === 0) {
        return `
        <div style="background: #fff; border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; border: 1px solid #f1f5f9;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <h4 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
                    <span style="background: linear-gradient(135deg, #f5576c, #ff6b6b); width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;">💰</span>
                    ${L === 'en' ? 'Expense Summary' : 'খরচ সারাংশ'}
                </h4>
                <button onclick="navigateTo('expenses')" style="background: none; border: none; color: #f5576c; font-weight: 600; font-size: 12px; cursor: pointer; padding: 4px 12px; border-radius: 6px; transition: all 0.2s;">
                    ${L === 'en' ? 'Add →' : 'যোগ করুন →'}
                </button>
            </div>
            <div style="text-align: center; padding: 16px 0; color: #94a3b8; font-size: 13px;">
                ${L === 'en' ? 'No expense records yet' : 'এখনও কোনো খরচ রেকর্ড নেই'}
            </div>
        </div>
        `;
    }

    // খরচ সারাংশ দেখান
    return `
    <div style="background: #fff; border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; border: 1px solid #f1f5f9;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
            <h4 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
                <span style="background: linear-gradient(135deg, #f5576c, #ff6b6b); width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;">💰</span>
                ${L === 'en' ? 'Expense Summary' : 'খরচ সারাংশ'}
            </h4>
            <button onclick="navigateTo('expenses')" style="background: none; border: none; color: #f5576c; font-weight: 600; font-size: 12px; cursor: pointer; padding: 4px 12px; border-radius: 6px; transition: all 0.2s;">
                ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
            </button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
            <div style="background: #fef2f2; border-radius: 10px; padding: 10px; text-align: center; border: 1px solid #fecaca;">
                <div style="font-size: 9px; color: #991b1b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">${L === 'en' ? 'Today' : 'আজ'}</div>
                <div style="font-size: 18px; font-weight: 700; color: #dc2626;">৳ ${formatNum(todayExpense)}</div>
            </div>
            <div style="background: #fffbeb; border-radius: 10px; padding: 10px; text-align: center; border: 1px solid #fde68a;">
                <div style="font-size: 9px; color: #92400e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">${L === 'en' ? 'This Week' : 'এই সপ্তাহ'}</div>
                <div style="font-size: 18px; font-weight: 700; color: #d97706;">৳ ${formatNum(weekExpense)}</div>
            </div>
            <div style="background: #eff6ff; border-radius: 10px; padding: 10px; text-align: center; border: 1px solid #93c5fd;">
                <div style="font-size: 9px; color: #1e40af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">${L === 'en' ? 'This Month' : 'এই মাস'}</div>
                <div style="font-size: 18px; font-weight: 700; color: #2563eb;">৳ ${formatNum(monthExpense)}</div>
            </div>
        </div>
    </div>
    `;
}

// ============================================================
// 🔮 ১. স্ল্যাব-সচেতন স্মার্ট ব্যালেন্স পূর্বাভাস (Slab-Aware Dynamic Forward Simulator)
// ============================================================
function getSmartBalancePrediction(balance, meterId, transactions, monthlyAvgExpense, monthUnits, tariffRates) {
    var L = (typeof APP !== 'undefined' && APP.language) ? APP.language : 'bn';
    var now = new Date();
    balance = Math.max(0, Number(balance) || 0);
    monthUnits = Math.max(0, Number(monthUnits) || 0);

    tariffRates = tariffRates || (APP && APP.tariffRates) || [
        { range: [0, 50], rate: 4.63, name: "Lifeline" },
        { range: [51, 75], rate: 5.26, name: "1st Slab" },
        { range: [76, 200], rate: 8.50, name: "2nd Slab" },
        { range: [201, 300], rate: 9.10, name: "3rd Slab" },
        { range: [301, 400], rate: 9.62, name: "4th Slab" },
        { range: [401, 600], rate: 15.01, name: "5th Slab" },
        { range: [601, null], rate: 17.35, name: "6th Slab" }
    ];

    // 1. ব্যবহারকারীর বাস্তবসম্মত দৈনিক ইউনিট খরচ (Daily KWh consumption)
    // ব্যবহারকারীর সাম্প্রতিক দৈনিক এন্ট্রিগুলো থেকে স্বয়ংক্রিয়ভাবে গড় ইউনিট বিশ্লেষণ
    var recentUnitsList = [];
    (transactions || []).forEach(function(t) {
        if ((t.type === 'bill' || t.type === 'electricity_bill') && Number(t.units) > 0) {
            var d = new Date(t.date || t.timestamp);
            if (!isNaN(d.getTime()) && (now.getTime() - d.getTime()) <= 14 * 24 * 60 * 60 * 1000) {
                recentUnitsList.push(Number(t.units));
            }
        }
    });

    var dailyUnits = 3.5; // ডিফল্ট বেঞ্চমার্ক
    if (recentUnitsList.length > 0) {
        var sumRecent = recentUnitsList.reduce(function(a, b) { return a + b; }, 0);
        var avgRecentUnits = sumRecent / recentUnitsList.length;
        if (avgRecentUnits >= 1.5 && avgRecentUnits <= 20.0) {
            dailyUnits = Math.round(avgRecentUnits * 100) / 100;
        }
    } else if (monthUnits > 0 && now.getDate() > 0) {
        var calculatedDaily = monthUnits / now.getDate();
        if (calculatedDaily >= 1.5 && calculatedDaily <= 15.0) {
            dailyUnits = Math.round(calculatedDaily * 100) / 100;
        }
    }

    var vatRate = (APP.settings && APP.settings.vatRate) ? (Number(APP.settings.vatRate) / 100) : 0.05;
    var demandCharge = (APP.settings && APP.settings.demandCharge) ? Number(APP.settings.demandCharge) : 42;
    var dailyDemand = demandCharge / 30;

    // 2. দিনভিত্তিক ডায়নামিক স্ল্যাব জাম্প সিমুলেশন (Day-by-Day Forward Simulation)
    var simBalance = balance;
    var simDays = 0;
    var simDate = new Date(now.getTime());
    var simMonthUnits = monthUnits;
    var dailyCosts = [];

    while (simBalance > 0 && simDays < 180) {
        simDays++;
        simDate.setDate(simDate.getDate() + 1);

        // নতুন মাস শুরু হলে (১লা তারিখ) ইউনিট রিসেট ও মাসিক ডিমান্ড চার্জ কর্তন
        if (simDate.getDate() === 1) {
            simMonthUnits = 0;
            simBalance -= demandCharge;
            if (simBalance <= 0) break;
        }

        // ঐ দিনের স্ল্যাব রেট নির্ধারণ
        var slabRate = 4.63;
        for (var s = 0; s < tariffRates.length; s++) {
            var slb = tariffRates[s];
            if (slb.range[1] === null || simMonthUnits < slb.range[1]) {
                slabRate = Number(slb.rate);
                break;
            }
        }

        // প্রিপেইড মিটারে প্রতিদিনের বিল সরাসরি ইউনিট × প্রযোজ্য স্ল্যাব রেট অনুযায়ী কাটে
        // (ভ্যাট ও ডিমান্ড চার্জ রিচার্জের সময় বা মাসের ১ তারিখে কাটা হয়)
        var dayCost = dailyUnits * slabRate;
        dailyCosts.push(dayCost);
        simBalance -= dayCost;
        simMonthUnits += dailyUnits;
    }

    var estimatedDays = Math.max(0, simDays);
    var avgDailyBurn = dailyCosts.length > 0 ? (dailyCosts.reduce(function(a, b) { return a + b; }, 0) / dailyCosts.length) : 31.00;
    avgDailyBurn = Math.round(avgDailyBurn * 100) / 100;

    // 3. সম্ভাব্য ব্যালেন্স শেষ হওয়ার তারিখ (Runout Date)
    var runoutDate = new Date(now.getTime() + estimatedDays * 24 * 60 * 60 * 1000);
    var dateLocale = L === 'en' ? 'en-US' : 'bn-BD';
    var runoutDateFormatted = runoutDate.toLocaleDateString(dateLocale, {
        day: 'numeric',
        month: 'long'
    });

    // 4. চলতি মাস শেষ হতে কত দিন বাকি
    var totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    var currentDay = now.getDate();
    var daysRemainingInMonth = Math.max(0, totalDaysInMonth - currentDay);

    // 5. ঘাটতি ও অতিরিক্ত রিচার্জের পরামর্শ
    var deficitDays = Math.max(0, daysRemainingInMonth - estimatedDays);
    var recommendedRecharge = 0;
    if (deficitDays > 0) {
        recommendedRecharge = Math.ceil((deficitDays * avgDailyBurn) / 50) * 50;
        if (recommendedRecharge < 100) recommendedRecharge = 100;
    }

    // অতিরিক্ত দিন যদি চলতি মাস পার হয়ে পরের মাসে যায়
    var extraDaysNextMonth = Math.max(0, estimatedDays - daysRemainingInMonth);

    var bnDigits = function(n) {
        return (typeof formatToBengaliNumerals === 'function') ? formatToBengaliNumerals(n) : n;
    };

    var status = 'healthy';
    var statusTitle = '';
    var statusPill = '';
    var message = '';

    if (balance <= 100 || estimatedDays <= 2) {
        status = 'critical';
        statusTitle = L === 'en' ? 'Critical Balance Warning!' : 'জরুরি ব্যালেন্স সতর্কতা!';
        statusPill = L === 'en' ? `🚨 Only ${estimatedDays} Days Left` : `🚨 মাত্র ${bnDigits(estimatedDays)} দিন বাকি`;
        message = L === 'en'
            ? `Warning! At current usage (~৳${avgDailyBurn.toFixed(2)}/day with slab escalations), your remaining ৳${balance.toFixed(2)} balance will last only ${estimatedDays} days (until ${runoutDateFormatted}). Recharge at least ৳${recommendedRecharge || 300} immediately to avoid power disruption!`
            : `সতর্কতা! স্ল্যাব বৃদ্ধির কারণে দৈনিক খরচ বৃদ্ধি (গড়ে ~৳${bnDigits(avgDailyBurn.toFixed(2))}/দিন) বিবেচনায় আপনার অবশিষ্ট ৳${bnDigits(balance.toFixed(2))} ব্যালেন্স মাত্র ${bnDigits(estimatedDays)} দিন (${runoutDateFormatted} পর্যন্ত) চলবে। সংযোগ বিচ্ছিন্ন এড়াতে অবিলম্বে কমপক্ষে ৳${bnDigits(recommendedRecharge || 300)} রিচার্জ করুন!`;
    } else if (deficitDays > 0) {
        status = 'warning';
        statusTitle = L === 'en' ? 'Smart Balance & Recharge Advice' : 'স্মার্ট ব্যালেন্স ও রিচার্জ পরামর্শ';
        statusPill = L === 'en' ? `⏳ ${estimatedDays} Days Left` : `⏳ ${bnDigits(estimatedDays)} দিন চলবে`;
        message = L === 'en'
            ? `Accounting for slab rate increases (averaging ~৳${avgDailyBurn.toFixed(2)}/day), your remaining ৳${balance.toFixed(2)} balance will last ${estimatedDays} days (until ${runoutDateFormatted}). ${daysRemainingInMonth} days remain in this month, so ৳${recommendedRecharge} additional recharge is advised.`
            : `স্ল্যাব বৃদ্ধির প্রভাব (গড়ে ~৳${bnDigits(avgDailyBurn.toFixed(2))}/দিন) অন্তর্ভুক্ত করে আপনার অবশিষ্ট ৳${bnDigits(balance.toFixed(2))} ব্যালেন্স আগামী ${bnDigits(estimatedDays)} দিন (${runoutDateFormatted} পর্যন্ত) চলবে। মাস শেষ হতে আরও ${bnDigits(daysRemainingInMonth)} দিন বাকি, তাই ৳${bnDigits(recommendedRecharge)} অতিরিক্ত রিচার্জের পরামর্শ দেওয়া হচ্ছে।`;
    } else {
        status = 'healthy';
        statusTitle = L === 'en' ? 'Balance is Sufficient for Month' : 'মাসিক ব্যালেন্স সন্তোষজনক';
        statusPill = L === 'en' ? `✅ Safe (${estimatedDays} Days)` : `✅ নিরাপদ (${bnDigits(estimatedDays)} দিন)`;
        message = L === 'en'
            ? `Accounting for future slab price changes (averaging ~৳${avgDailyBurn.toFixed(2)}/day), your ৳${balance.toFixed(2)} balance will last ${estimatedDays} days (until ${runoutDateFormatted}), comfortably covering this month with ${extraDaysNextMonth} days into next month.`
            : `পরবর্তী স্ল্যাব বৃদ্ধির খরচ (গড়ে ~৳${bnDigits(avgDailyBurn.toFixed(2))}/দিন) হিসাব করে আপনার অবশিষ্ট ৳${bnDigits(balance.toFixed(2))} ব্যালেন্স আগামী ${bnDigits(estimatedDays)} দিন (${runoutDateFormatted} পর্যন্ত) চলবে। চলতি মাসের বাকি ${bnDigits(daysRemainingInMonth)} দিন শেষ হয়েও আগামী মাসের ${bnDigits(extraDaysNextMonth)} দিন কভার করবে!`;
    }

    return {
        balance: balance,
        dailyAvg: avgDailyBurn,
        dailyUnits: dailyUnits,
        estimatedDays: estimatedDays,
        runoutDateFormatted: runoutDateFormatted,
        daysRemainingInMonth: daysRemainingInMonth,
        extraDaysNextMonth: extraDaysNextMonth,
        deficitDays: deficitDays,
        recommendedRecharge: recommendedRecharge,
        status: status,
        statusTitle: statusTitle,
        statusPill: statusPill,
        message: message
    };
}

// ============================================================
// ⚠️ ২. ট্যারিফ স্ল্যাব জাম্প অ্যালার্ট (Slab Threshold Warning Engine)
// ============================================================
function getSmartSlabJumpStatus(currentUnits, meterId, tariffRates) {
    var L = (typeof APP !== 'undefined' && APP.language) ? APP.language : 'bn';
    tariffRates = tariffRates || (APP && APP.tariffRates) || [
        { range: [0, 50], rate: 4.63, name: "Lifeline", nameBn: "লাইফলাইন" },
        { range: [51, 75], rate: 5.26, name: "1st Slab", nameBn: "১ম স্ল্যাব" },
        { range: [76, 200], rate: 8.50, name: "2nd Slab", nameBn: "২য় স্ল্যাব" },
        { range: [201, 300], rate: 9.10, name: "3rd Slab", nameBn: "৩য় স্ল্যাব" },
        { range: [301, 400], rate: 9.62, name: "4th Slab", nameBn: "৪র্থ স্ল্যাব" },
        { range: [401, 600], rate: 15.01, name: "5th Slab", nameBn: "৫ম স্ল্যাব" },
        { range: [601, null], rate: 17.35, name: "6th Slab", nameBn: "৬ষ্ঠ স্ল্যাব" }
    ];

    currentUnits = Math.max(0, Number(currentUnits) || 0);

    var bnDigits = function(n) {
        return (typeof formatToBengaliNumerals === 'function') ? formatToBengaliNumerals(n) : n;
    };

    var activeSlabIndex = 0;
    for (var i = 0; i < tariffRates.length; i++) {
        var s = tariffRates[i];
        var min = s.range[0];
        var max = s.range[1];
        if (max === null || max === undefined) {
            if (currentUnits >= min) {
                activeSlabIndex = i;
                break;
            }
        } else if (currentUnits <= max) {
            activeSlabIndex = i;
            break;
        }
    }

    var currSlab = tariffRates[activeSlabIndex];
    var nextSlab = (activeSlabIndex + 1 < tariffRates.length) ? tariffRates[activeSlabIndex + 1] : null;

    var slabMin = currSlab.range[0];
    var slabMax = currSlab.range[1];
    var unitsRemaining = (slabMax !== null && slabMax !== undefined) ? Math.max(0, slabMax - currentUnits) : 999;
    var slabSpan = (slabMax !== null && slabMax !== undefined) ? (slabMax - (slabMin === 0 ? 0 : (slabMin - 1))) : 100;
    var usedInSlab = currentUnits - (slabMin === 0 ? 0 : (slabMin - 1));
    var fillPct = Math.min(100, Math.max(0, (usedInSlab / slabSpan) * 100));

    var slabNameBn = currSlab.nameBn || (currSlab.name === 'Lifeline' ? 'লাইফলাইন' : (currSlab.name === '1st Slab' ? '১ম স্ল্যাব' : (currSlab.name === '2nd Slab' ? '২য় স্ল্যাব' : (currSlab.name === '3rd Slab' ? '৩য় স্ল্যাব' : (currSlab.name === '4th Slab' ? '৪র্থ স্ল্যাব' : (currSlab.name === '5th Slab' ? '৫ম স্ল্যাব' : currSlab.name))))));
    var nextSlabNameBn = nextSlab ? (nextSlab.nameBn || (nextSlab.name === '1st Slab' ? '১ম স্ল্যাব' : (nextSlab.name === '2nd Slab' ? '২য় স্ল্যাব' : (nextSlab.name === '3rd Slab' ? '৩য় স্ল্যাব' : (nextSlab.name === '4th Slab' ? '৪র্থ স্ল্যাব' : (nextSlab.name === '5th Slab' ? '৫ম স্ল্যাব' : (nextSlab.name === '6th Slab' ? '৬ষ্ঠ স্ল্যাব' : nextSlab.name))))))) : '';

    var isWarning = (nextSlab && unitsRemaining <= 20);
    var isCritical = (nextSlab && unitsRemaining <= 8);

    var status = isCritical ? 'critical' : (isWarning ? 'warning' : 'info');
    var statusPill = '';
    var message = '';

    if (nextSlab) {
        if (isWarning || isCritical) {
            statusPill = L === 'en'
                ? `⚡ Only ${unitsRemaining.toFixed(1)} kWh Left!`
                : `⚡ আর মাত্র ${bnDigits(unitsRemaining.toFixed(1))} ইউনিট বাকি!`;
            message = L === 'en'
                ? `Alert! Your electricity usage this month is ${currentUnits.toFixed(1)} kWh. In just ${unitsRemaining.toFixed(1)} units, you will enter ${nextSlab.name} (৳${nextSlab.rate.toFixed(2)}/unit). Be energy-efficient to save on your bill!`
                : `সতর্কতা! চলতি মাসে আপনার খরচ ${bnDigits(currentUnits.toFixed(1))} KWh। আর মাত্র ${bnDigits(unitsRemaining.toFixed(1))} ইউনিট ব্যবহার করলেই আপনি ${nextSlabNameBn}ে (৳${bnDigits(nextSlab.rate.toFixed(2))}/ইউনিট) প্রবেশ করবেন। বিদ্যুৎ ব্যবহারে সাশ্রয়ী হোন!`;
        } else {
            statusPill = L === 'en'
                ? `📊 ${currSlab.name} (৳${currSlab.rate.toFixed(2)}/u)`
                : `📊 ${slabNameBn} (৳${bnDigits(currSlab.rate.toFixed(2))}/ইউনিট)`;
            message = L === 'en'
                ? `Current month usage: ${currentUnits.toFixed(1)} kWh in ${currSlab.name} (৳${currSlab.rate.toFixed(2)}/kWh). ${unitsRemaining.toFixed(1)} units remaining before reaching ${nextSlab.name} (৳${nextSlab.rate.toFixed(2)}/kWh).`
                : `চলতি মাসে আপনার খরচ ${bnDigits(currentUnits.toFixed(1))} KWh। আপনি ${slabNameBn}ে (৳${bnDigits(currSlab.rate.toFixed(2))}/ইউনিট) আছেন। পরবর্তী স্ল্যাবে (৳${bnDigits(nextSlab.rate.toFixed(2))}) যেতে আরও ${bnDigits(unitsRemaining.toFixed(1))} ইউনিট বাকি।`;
        }
    } else {
        statusPill = L === 'en' ? `⚠️ Highest Tier (6th Slab)` : `⚠️ সর্বোচ্চ স্ল্যাব (৬ষ্ঠ স্ল্যাব)`;
        message = L === 'en'
            ? `You are in the highest tariff slab (৳${currSlab.rate.toFixed(2)}/unit). Maximum energy conservation is strongly advised!`
            : `আপনি সর্বোচ্চ ট্যারিফ স্ল্যাবে (৳${bnDigits(currSlab.rate.toFixed(2))}/ইউনিট) অবস্থান করছেন। বিদ্যুৎ ব্যবহারে সর্বোচ্চ মিতব্যয়ী হওয়ার অনুরোধ করা হচ্ছে!`;
    }

    return {
        currentUnits: currentUnits,
        currSlab: currSlab,
        nextSlab: nextSlab,
        unitsRemaining: unitsRemaining,
        fillPct: fillPct,
        isWarning: isWarning,
        isCritical: isCritical,
        status: status,
        statusPill: statusPill,
        message: message,
        slabNameBn: slabNameBn,
        nextSlabNameBn: nextSlabNameBn
    };
}

// ============================================================
// ✅ প্রধান ড্যাশবোর্ড ফাংশন (রি-অর্ডার করা) - সম্পূর্ণ
// ============================================================
function showDashboard() {
    console.log('📊 showDashboard called');
    console.log('ActiveMeterId:', APP.activeMeterId);
    console.log('Meters:', APP.meters.length);
    console.log('Language:', APP.language);
    
    if (APP.meters.length === 0 && typeof loadFromCloud === 'function') {
        console.log('⏳ মিটার লোড হচ্ছে, অপেক্ষা করুন...');
        setTimeout(function() {
            if (APP.meters.length > 0) {
                console.log('✅ মিটার লোড হয়েছে, ড্যাশবোর্ড দেখানো হচ্ছে...');
                showDashboard();
            } else {
                setTimeout(function() {
                    if (APP.meters.length > 0) {
                        console.log('✅ মিটার লোড হয়েছে, ড্যাশবোর্ড দেখানো হচ্ছে...');
                        showDashboard();
                    } else {
                        document.getElementById('pageContent').innerHTML = `
                            <div class="card" style="text-align: center; padding: 50px;">
                                <h2>${__('welcome')}</h2>
                                <p style="margin: 20px 0;">${__('welcomeMsg')}</p>
                                <button class="btn" onclick="navigateTo('meters')">${__('addMeter')}</button>
                            </div>
                        `;
                    }
                }, 1000);
            }
        }, 1000);
        return;
    }
    
    if (APP.meters.length === 0) {
        document.getElementById('pageContent').innerHTML = `
            <div class="card" style="text-align: center; padding: 50px;">
                <h2>${__('welcome')}</h2>
                <p style="margin: 20px 0;">${__('welcomeMsg')}</p>
                <button class="btn" onclick="navigateTo('meters')">${__('addMeter')}</button>
            </div>
        `;
        return;
    }
    
    console.log('📌 সেভ করা মিটার:', APP.activeMeterId);
    
    var savedMeterId = localStorage.getItem('biddut_activeMeterId');
    if (savedMeterId && APP.meters.find(function(m) { return m.id === savedMeterId; })) {
        if (APP.activeMeterId !== savedMeterId) {
            APP.activeMeterId = savedMeterId;
            console.log('✅ Active meter updated from localStorage:', APP.activeMeterId);
        }
    }
    
    if (!APP.activeMeterId || !APP.meters.find(function(m) { return m.id === APP.activeMeterId; })) {
        if (APP.meters.length > 0) {
            APP.activeMeterId = APP.meters[0].id;
            console.log('✅ নতুন মিটার সেট করা হয়েছে:', APP.activeMeterId);
            localStorage.setItem('biddut_activeMeterId', APP.activeMeterId);
            saveData();
        } else {
            document.getElementById('pageContent').innerHTML = `
                <div class="card" style="text-align: center; padding: 50px;">
                    <h2>${__('welcome')}</h2>
                    <p style="margin: 20px 0;">${__('welcomeMsg')}</p>
                    <button class="btn" onclick="navigateTo('meters')">${__('addMeter')}</button>
                </div>
            `;
            return;
        }
    }

    const activeMeter = APP.meters.find(m => m.id === APP.activeMeterId);
    if (!activeMeter) {
        APP.activeMeterId = APP.meters[0].id;
        saveData();
        showDashboard();
        return;
    }

    if (!APP.metersData) {
        APP.metersData = {};
    }

    var meterData = (typeof getActiveMeterData === 'function') ? getActiveMeterData() : null;
    if (!meterData && typeof getMeterData === 'function') {
        meterData = getMeterData(APP.activeMeterId);
    }
    if (!meterData && APP.metersData) {
        meterData = APP.metersData[APP.activeMeterId];
    }

    if (!meterData) {
        meterData = {
            transactions: [],
            monthlyRecharges: [],
            currentBalance: 0,
            totalRecharge: 0,
            totalExpended: 0,
            lastDemandChargeMonth: "",
            meterInfo: activeMeter,
            lastUpdated: new Date().toISOString()
        };
        APP.metersData[APP.activeMeterId] = meterData;
    }

    var rawTransactions = meterData.transactions || [];
    const transactions = Array.isArray(rawTransactions) ? rawTransactions : (typeof rawTransactions === 'object' && rawTransactions ? Object.values(rawTransactions) : []);
    
    // ✅ ট্রানজেকশন অ্যারে থেকে ডায়নামিক রিচার্জ ও খরচ হিসাব (যাতে কোনোভাবেই ০ না দেখায়)
    var calculatedRecharge = 0;
    var calculatedExpense = 0;
    (transactions || []).forEach(function(t) {
        var amt = parseFloat(t.amount) || 0;
        if (t.type === 'recharge') {
            calculatedRecharge += amt;
        } else if (t.type === 'bill' || t.type === 'electricity_bill') {
            calculatedExpense += amt;
        }
    });

    const balance = (meterData.currentBalance !== undefined && meterData.currentBalance !== null) ? meterData.currentBalance : 0;
    var totalRecharge = (meterData.totalRecharge !== undefined && meterData.totalRecharge !== null) ? meterData.totalRecharge : 0;
    if (calculatedRecharge > totalRecharge || totalRecharge === 0) {
        totalRecharge = calculatedRecharge;
    }
    var totalExpense = (meterData.totalExpended !== undefined && meterData.totalExpended !== null) ? meterData.totalExpended : 0;
    if (calculatedExpense > totalExpense || totalExpense === 0) {
        totalExpense = calculatedExpense;
    }

    const lastExpense = getLastExpense(APP.activeMeterId);
    const totalTransactions = transactions.length;
    const totalKWH = getTotalKWH(APP.activeMeterId);
    const monthlyAvgExpense = getMonthlyAvgExpense(APP.activeMeterId);
    const monthlyAvgKWH = getMonthlyAvgKWH(APP.activeMeterId);
    const recentTx = getRecentTransactions(APP.activeMeterId, 5);
    
    const summary = getDemandVatRebateSummary(APP.activeMeterId);
    var deductTotal = (summary.totalDemand || 0) + (summary.totalVat || 0) + (summary.totalRebate || 0);
    var demandPct = deductTotal > 0 ? (((summary.totalDemand || 0) / deductTotal) * 100).toFixed(1) : '0.0';
    var vatPct = deductTotal > 0 ? (((summary.totalVat || 0) / deductTotal) * 100).toFixed(1) : '0.0';
    var rebatePct = deductTotal > 0 ? (((summary.totalRebate || 0) / deductTotal) * 100).toFixed(1) : '0.0';

    const L = APP.language;
    const dateLocale = L === 'en' ? 'en-US' : 'bn-BD';

    function calculateDashboardTrends(meterId, monthlyAvgExpense, monthlyAvgKWH) {
        var defaultTrends = {
            totalRecharge: { value: '0.0', direction: 'up' },
            totalExpense: { value: '0.0', direction: 'up' },
            totalTransactions: { value: '0.0', direction: 'up' },
            monthlyAvgExpense: { value: '0.0', direction: 'up' },
            totalKWH: { value: '0.0', direction: 'up' },
            monthlyAvgKWH: { value: '0.0', direction: 'up' },
            lastExpense: { value: '0.0', direction: 'up' }
        };

        try {
            function calcPercentageTrend(curr, prev) {
                curr = Number(curr) || 0;
                prev = Number(prev) || 0;
                if (prev === 0) {
                    if (curr === 0) {
                        return { value: '0.0', direction: 'up' };
                    }
                    return { value: '100.0', direction: 'up' };
                }
                var diff = curr - prev;
                var pct = (diff / Math.abs(prev)) * 100;
                return {
                    value: Math.abs(pct).toFixed(1),
                    direction: pct >= 0 ? 'up' : 'down'
                };
            }

            if (typeof getMonthlySummary !== 'function') return defaultTrends;

            var monthlySummary = getMonthlySummary(meterId) || {};
            var monthKeys = Object.keys(monthlySummary).sort();

            if (monthKeys.length === 0) {
                return defaultTrends;
            }

            var currMonthKey = monthKeys[monthKeys.length - 1];
            var currMonth = monthlySummary[currMonthKey] || {};
            var currRecharge = currMonth.recharge || 0;
            var currExpense = currMonth.bill || 0;
            var currTxCount = (currMonth.billCount || 0) + (currMonth.rechargeCount || 0);
            var currUnits = currMonth.units || 0;

            if (monthKeys.length <= 1) {
                var singleMonthTag = { label: L === 'en' ? 'Current' : 'চলতি মাস', isSingleMonth: true, direction: 'neutral' };
                return {
                    totalRecharge: singleMonthTag,
                    totalExpense: singleMonthTag,
                    totalTransactions: singleMonthTag,
                    monthlyAvgExpense: singleMonthTag,
                    totalKWH: singleMonthTag,
                    monthlyAvgKWH: singleMonthTag,
                    lastExpense: singleMonthTag
                };
            }

            var prevMonthKey = monthKeys[monthKeys.length - 2];
            var prevMonth = monthlySummary[prevMonthKey] || {};
            var prevRecharge = prevMonth.recharge || 0;
            var prevExpense = prevMonth.bill || 0;
            var prevTxCount = (prevMonth.billCount || 0) + (prevMonth.rechargeCount || 0);
            var prevUnits = prevMonth.units || 0;

            return {
                totalRecharge: calcPercentageTrend(currRecharge, prevRecharge),
                totalExpense: calcPercentageTrend(currExpense, prevExpense),
                totalTransactions: calcPercentageTrend(currTxCount, prevTxCount),
                monthlyAvgExpense: calcPercentageTrend(currExpense, monthlyAvgExpense),
                totalKWH: calcPercentageTrend(currUnits, prevUnits),
                monthlyAvgKWH: calcPercentageTrend(currUnits, monthlyAvgKWH),
                lastExpense: calcPercentageTrend(currExpense, prevExpense)
            };
        } catch(err) {
            console.error('calculateDashboardTrends error:', err);
            return defaultTrends;
        }
    }

    var trends = calculateDashboardTrends(APP.activeMeterId, monthlyAvgExpense, monthlyAvgKWH) || {
        totalRecharge: { value: '0.0', direction: 'up' },
        totalExpense: { value: '0.0', direction: 'up' },
        totalTransactions: { value: '0.0', direction: 'up' },
        monthlyAvgExpense: { value: '0.0', direction: 'up' },
        totalKWH: { value: '0.0', direction: 'up' },
        monthlyAvgKWH: { value: '0.0', direction: 'up' },
        lastExpense: { value: '0.0', direction: 'up' }
    };

    // Calculate expense for Today, Week, Month
    var todayExpense = 0;
    var weekExpense = 0;
    var monthExpense = 0;
    var now = new Date();
    var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    (transactions || []).forEach(function(t) {
        if (t.type === 'bill' || t.type === 'electricity_bill') {
            var d = new Date(t.date || t.timestamp);
            if (!isNaN(d.getTime())) {
                var amt = Number(t.amount) || 0;
                if (d >= todayStart) todayExpense += amt;
                if (d >= weekStart) weekExpense += amt;
                if (d >= monthStart) monthExpense += amt;
            }
        }
    });

    if (todayExpense === 0 && lastExpense > 0) todayExpense = lastExpense;
    if (weekExpense === 0 && todayExpense > 0) weekExpense = todayExpense;
    if (monthExpense === 0 && totalExpense > 0) monthExpense = totalExpense;

    // Calculate Month Units for Slab Tracking
    var monthUnits = 0;
    (transactions || []).forEach(function(t) {
        if (t.type === 'bill' || t.type === 'electricity_bill') {
            var d = new Date(t.date || t.timestamp);
            if (!isNaN(d.getTime()) && d >= monthStart) {
                monthUnits += (Number(t.units) || 0);
            }
        }
    });
    if (monthUnits === 0 && totalKWH > 0) {
        monthUnits = totalKWH;
    }

    // 🔮 স্মার্ট ব্যালেন্স পূর্বাভাস ও ট্যারিফ স্ল্যাব ট্র্যাকার ক্যালকুলেশন
    var smartPrediction = getSmartBalancePrediction(balance, APP.activeMeterId, transactions, monthlyAvgExpense, monthUnits, APP.tariffRates);
    var slabStatus = getSmartSlabJumpStatus(monthUnits, APP.activeMeterId, APP.tariffRates);

    function createStatCard(iconName, label, value, gradient, trend) {
        trend = trend || { value: '0.0', direction: 'up' };
        var badgeHtml = '';
        if (trend.isSingleMonth || trend.direction === 'neutral') {
            var tagText = trend.label || (L === 'en' ? 'Current' : 'চলতি মাস');
            badgeHtml = `<span class="trend-badge neutral" title="${L === 'en' ? 'Current month active data' : 'চলতি মাসের সক্রিয় তথ্য'}">${tagText}</span>`;
        } else {
            var isUp = trend.direction !== 'down';
            var arrow = isUp ? '↗' : '↘';
            var sign = isUp ? '+' : '-';
            var trendVal = (trend.value !== undefined && trend.value !== null) ? trend.value : '0.0';
            badgeHtml = `
                <span class="trend-badge ${isUp ? 'up' : 'down'}">
                    ${arrow} ${sign}${trendVal}%
                </span>
            `;
        }
        return `
            <div class="stat-card">
                <div class="stat-card-glow" style="background: ${gradient};"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div class="stat-icon" style="background: ${gradient};">
                            ${getIconSVG(iconName)}
                        </div>
                        ${badgeHtml}
                    </div>
                    <div class="stat-label">${label}</div>
                    <div class="stat-value" title="${value}">${value}</div>
                </div>
            </div>
        `;
    }

    var meterOptions = APP.meters.map(function(m) {
        var displayName = getMeterDisplayName(m);
        var selected = APP.activeMeterId === m.id ? 'selected' : '';
        return `<option value="${m.id}" ${selected}>${displayName} - ${m.meterNumber || m.meterNo}</option>`;
    }).join('');

    // ✅ রিচার্জ চক্র ভিত্তিক ব্যালেন্স প্রগ্রেস বার (Usable Net Balance Cycle)
    // লজিক: রিচার্জের নেট ব্যালেন্স (ডিমান্ড চার্জ ও ভ্যাট বাদে যে টাকা ব্যবহারের যোগ্য) + আগের ব্যালেন্স = ১০০% শুরুর সাইকেল
    // এরপর বিল বাবদ খরচ হলে সেই সাইকেল থেকে শতকরা হার হ্রাস পাবে
    var cycleBase = 0;
    var cycleExpense = 0;

    var sortedTx = (transactions || []).slice().sort(function(a, b) {
        var tA = new Date(a.date || a.timestamp || 0).getTime();
        var tB = new Date(b.date || b.timestamp || 0).getTime();
        return tA - tB;
    });

    var lastRechargeIdx = -1;
    for (var i = sortedTx.length - 1; i >= 0; i--) {
        var txItem = sortedTx[i];
        if (txItem.type === 'recharge' || (txItem.deductions && txItem.deductions.netAmount)) {
            lastRechargeIdx = i;
            break;
        }
    }

    if (lastRechargeIdx !== -1) {
        var rTx = sortedTx[lastRechargeIdx];
        if (rTx.balanceAfter !== undefined && rTx.balanceAfter !== null && Number(rTx.balanceAfter) > 0) {
            cycleBase = Number(rTx.balanceAfter);
        } else {
            var net = (rTx.deductions && rTx.deductions.netAmount) ? Number(rTx.deductions.netAmount) : Number(rTx.amount || 0);
            cycleBase = net;
        }

        // ঐ রিচার্জের পর থেকে মোট কত টাকা বিল খরচ হয়েছে
        for (var j = lastRechargeIdx + 1; j < sortedTx.length; j++) {
            var bTx = sortedTx[j];
            if (bTx.type === 'bill' || bTx.type === 'electricity_bill') {
                cycleExpense += (Number(bTx.amount) || 0);
            }
        }

        if (balance + cycleExpense > cycleBase) {
            cycleBase = balance + cycleExpense;
        }
    } else {
        (transactions || []).forEach(function(tx) {
            if (tx.type === 'bill' || tx.type === 'electricity_bill') {
                cycleExpense += (Number(tx.amount) || 0);
            }
        });
        cycleBase = balance + cycleExpense;
        if (cycleBase <= 0) cycleBase = balance > 0 ? balance : 1000;
    }

    var currBal = Math.max(0, Number(balance) || 0);
    var balancePct = cycleBase > 0 ? Math.min(Math.max((currBal / cycleBase) * 100, 0), 100) : 0;
    var usagePct = cycleBase > 0 ? Math.min(Math.max((cycleExpense / cycleBase) * 100, 0), 100) : 0;
    if (cycleExpense === 0 && balancePct < 100) {
        usagePct = Math.max(0, 100 - balancePct);
    }

    // ব্যালেন্স অনুযায়ী ডায়নামিক রঙ ও ব্যাকগ্রাউন্ড
    var balanceProgressBg = 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'; // সবুজ (স্বাস্থ্যকর ব্যালেন্স)
    if (balancePct < 25) {
        balanceProgressBg = 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'; // লাল (সতর্কতা)
    } else if (balancePct < 55) {
        balanceProgressBg = 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'; // হলুদ/অরেঞ্জ (মাঝারি)
    }

    // Rent records dynamic aggregation
    var rentRecords = (APP.rentData && APP.rentData.records) ? APP.rentData.records : [];
    var totalRentVal = 0;
    var totalServiceVal = 0;
    var totalParkingVal = 0;
    var totalDueVal = 0;
    var totalPaidVal = 0;
    var totalOverallVal = 0;

    var tenantGroups = {};

    rentRecords.forEach(function(rec) {
        var rRent = parseFloat(rec.rentAmount) || 0;
        var sCharge = parseFloat(rec.serviceCharge) || 0;
        var pCharge = parseFloat(rec.parkingCharge) || 0;
        var tAmount = parseFloat(rec.totalAmount) || (rRent + sCharge + pCharge);
        var isPaid = (rec.status === 'paid' || rec.status === 'পরিশোধিত');

        totalRentVal += rRent;
        totalServiceVal += sCharge;
        totalParkingVal += pCharge;
        totalOverallVal += tAmount;

        if (isPaid) {
            totalPaidVal += tAmount;
        } else {
            totalDueVal += tAmount;
        }

        var tKey = rec.meterId || rec.meterName || rec.tenantName || 'default';
        if (!tenantGroups[tKey]) {
            tenantGroups[tKey] = {
                name: rec.meterName || rec.tenantName || (L === 'en' ? 'Tenant' : 'ভাড়াটিয়া'),
                totalRent: 0,
                totalService: 0,
                totalParking: 0,
                totalOverall: 0,
                totalPaid: 0,
                totalDue: 0,
                count: 0,
                latestMonth: rec.month || ''
            };
        }
        tenantGroups[tKey].totalRent += rRent;
        tenantGroups[tKey].totalService += sCharge;
        tenantGroups[tKey].totalParking += pCharge;
        tenantGroups[tKey].totalOverall += tAmount;
        tenantGroups[tKey].count += 1;
        if (isPaid) {
            tenantGroups[tKey].totalPaid += tAmount;
        } else {
            tenantGroups[tKey].totalDue += tAmount;
        }
        if (rec.month && (!tenantGroups[tKey].latestMonth || rec.month > tenantGroups[tKey].latestMonth)) {
            tenantGroups[tKey].latestMonth = rec.month;
        }
    });

    if (APP.rentData) {
        APP.rentData.totalRent = totalRentVal;
        APP.rentData.totalService = totalServiceVal;
        APP.rentData.totalParking = totalParkingVal;
        APP.rentData.totalOverall = totalOverallVal;
        APP.rentData.totalDue = totalDueVal;
        APP.rentData.totalPaid = totalPaidVal;
    }

    var htmlContent = `
        <!-- ============================================================
        1. ড্যাশবোর্ড হিরো ব্যানার (Landscape Illustration)
        ============================================================ -->
        <div class="dashboard-hero-banner">
            <div class="hero-text-wrap">
                <h1 class="hero-title">${__('dashboard')}</h1>
                <p class="hero-subtitle">${L === 'en' ? 'Overall status of electricity bill management' : 'বিদ্যুৎ বিল ব্যবস্থাপনার সার্বিক অবস্থা'}</p>
            </div>
            <div class="hero-illustration">
                <svg viewBox="0 0 1200 85" fill="none" xmlns="http://www.w3.org/2000/svg" class="hero-panoramic-svg" id="heroRealtimeSvg" preserveAspectRatio="none" style="width: 100%; height: 75px; display: block;">
                    <defs>
                        <!-- Sky Gradients for Day / Sunset / Night Cycle -->
                        <linearGradient id="skyDayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.95"/>
                            <stop offset="55%" stop-color="#e0f2fe" stop-opacity="0.9"/>
                            <stop offset="100%" stop-color="#f0fdf4" stop-opacity="0.95"/>
                        </linearGradient>
                        <linearGradient id="skySunsetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#312e81" stop-opacity="0.95"/>
                            <stop offset="35%" stop-color="#86198f" stop-opacity="0.9"/>
                            <stop offset="70%" stop-color="#ea580c" stop-opacity="0.95"/>
                            <stop offset="100%" stop-color="#facc15" stop-opacity="0.95"/>
                        </linearGradient>
                        <linearGradient id="skyNightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#020617" stop-opacity="0.98"/>
                            <stop offset="50%" stop-color="#0f172a" stop-opacity="0.95"/>
                            <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.98"/>
                        </linearGradient>
                        <linearGradient id="heroSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#fef08a"/>
                            <stop offset="45%" stop-color="#f59e0b"/>
                            <stop offset="100%" stop-color="#ea580c"/>
                        </linearGradient>
                        <linearGradient id="lampConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.75"/>
                            <stop offset="100%" stop-color="#fef08a" stop-opacity="0.04"/>
                        </linearGradient>
                        <linearGradient id="heroCity1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#c7d2fe" stop-opacity="0.65"/>
                            <stop offset="100%" stop-color="#e0e7ff" stop-opacity="0.35"/>
                        </linearGradient>
                        <linearGradient id="heroCity2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#a5b4fc" stop-opacity="0.7"/>
                            <stop offset="100%" stop-color="#c7d2fe" stop-opacity="0.35"/>
                        </linearGradient>
                    </defs>

                    <!-- Dynamic Day-Sunset-Night Sky Layers (Controlled via Real-Time JS) -->
                    <rect id="skyLayerDay" class="sky-layer sky-layer-day" x="0" y="0" width="1200" height="85" fill="url(#skyDayGrad)"/>
                    <rect id="skyLayerSunset" class="sky-layer sky-layer-sunset" x="0" y="0" width="1200" height="85" fill="url(#skySunsetGrad)"/>
                    <rect id="skyLayerNight" class="sky-layer sky-layer-night" x="0" y="0" width="1200" height="85" fill="url(#skyNightGrad)"/>

                    <!-- Twinkling Night Sky Stars (Visible at Night) -->
                    <g id="heroNightStars" class="night-sky-stars">
                        <circle cx="50" cy="12" r="1.2" fill="#ffffff" class="star-twinkle-1"/>
                        <circle cx="110" cy="22" r="1.5" fill="#fef08a" class="star-twinkle-2"/>
                        <circle cx="170" cy="14" r="1.0" fill="#ffffff" class="star-twinkle-3"/>
                        <circle cx="220" cy="8" r="1.4" fill="#67e8f9" class="star-twinkle-1"/>
                        <circle cx="300" cy="18" r="1.2" fill="#ffffff" class="star-twinkle-2"/>
                        <circle cx="350" cy="10" r="1.5" fill="#fef08a" class="star-twinkle-3"/>
                        <circle cx="440" cy="15" r="1.1" fill="#ffffff" class="star-twinkle-1"/>
                        <circle cx="500" cy="22" r="1.6" fill="#ffffff" class="star-twinkle-2"/>
                        <circle cx="570" cy="11" r="1.3" fill="#67e8f9" class="star-twinkle-3"/>
                        <circle cx="630" cy="20" r="1.0" fill="#ffffff" class="star-twinkle-1"/>
                        <circle cx="690" cy="8" r="1.5" fill="#fef08a" class="star-twinkle-2"/>
                        <circle cx="760" cy="16" r="1.2" fill="#ffffff" class="star-twinkle-3"/>
                        <circle cx="820" cy="10" r="1.4" fill="#ffffff" class="star-twinkle-1"/>
                        <circle cx="880" cy="22" r="1.1" fill="#67e8f9" class="star-twinkle-2"/>
                        <circle cx="940" cy="12" r="1.6" fill="#fef08a" class="star-twinkle-3"/>
                        <circle cx="1000" cy="18" r="1.2" fill="#ffffff" class="star-twinkle-1"/>
                        <circle cx="1070" cy="10" r="1.5" fill="#ffffff" class="star-twinkle-2"/>
                        <circle cx="1130" cy="22" r="1.0" fill="#67e8f9" class="star-twinkle-3"/>
                    </g>

                    <!-- Real-Time Traveling Golden Sun (Arc Positioned in Real-Time) -->
                    <g id="heroRealtimeSun" class="hero-realtime-sun" transform="translate(600, 20)">
                        <circle cx="0" cy="0" r="24" fill="url(#heroSunGrad)" opacity="0.3"/>
                        <circle cx="0" cy="0" r="16" fill="url(#heroSunGrad)" opacity="0.8"/>
                        <circle cx="0" cy="0" r="10" fill="#fef08a"/>
                    </g>

                    <!-- Real-Time Traveling Luminous Crescent Moon (Arc Positioned in Real-Time) -->
                    <g id="heroRealtimeMoon" class="hero-realtime-moon" transform="translate(600, 20)">
                        <circle cx="0" cy="0" r="18" fill="#e0e7ff" opacity="0.2"/>
                        <circle cx="0" cy="0" r="12" fill="#fef9c3" opacity="0.45"/>
                        <path d="M 0,-11 A 11,11 0 1,1 -9,9 A 9,9 0 1,0 0,-11 Z" fill="#ffffff"/>
                    </g>

                    <!-- Soft Clouds in Sky -->
                    <g fill="#e2e8f0" opacity="0.35">
                        <path d="M 30,28 Q 50,16 70,22 Q 90,14 110,24 Q 125,18 140,28 Z"/>
                        <path d="M 320,24 Q 340,12 360,18 Q 380,10 400,20 Q 415,15 430,24 Z"/>
                        <path d="M 640,26 Q 660,14 680,20 Q 700,12 720,22 Q 735,16 750,26 Z"/>
                        <path d="M 920,22 Q 940,12 960,18 Q 980,10 1000,20 Q 1015,14 1030,22 Z"/>
                    </g>

                    <!-- Modern City Skyline Silhouette Layers (continuous across 1200px) -->
                    <g fill="url(#heroCity1)">
                        <rect x="20" y="54" width="24" height="31" rx="1"/>
                        <rect x="48" y="46" width="26" height="39" rx="1"/>
                        <rect x="110" y="52" width="22" height="33" rx="1"/>
                        <rect x="136" y="44" width="28" height="41" rx="1"/>
                        <rect x="168" y="55" width="24" height="30" rx="1"/>
                        <rect x="300" y="48" width="26" height="37" rx="1"/>
                        <rect x="330" y="42" width="30" height="43" rx="1"/>
                        <rect x="435" y="46" width="30" height="39" rx="1"/>
                        <rect x="469" y="38" width="26" height="47" rx="1"/>
                        <rect x="499" y="48" width="28" height="37" rx="1"/>
                        <rect x="630" y="50" width="26" height="35" rx="1"/>
                        <rect x="660" y="44" width="30" height="41" rx="1"/>
                        <rect x="755" y="48" width="25" height="37" rx="1"/>
                        <rect x="784" y="40" width="32" height="45" rx="1"/>
                        <rect x="820" y="46" width="26" height="39" rx="1"/>
                        <rect x="850" y="52" width="24" height="33" rx="1"/>
                        <rect x="970" y="46" width="28" height="39" rx="1"/>
                        <rect x="1002" y="40" width="26" height="45" rx="1"/>
                        <rect x="1115" y="54" width="26" height="31" rx="1"/>
                        <rect x="1145" y="48" width="30" height="37" rx="1"/>
                    </g>
                    <g fill="url(#heroCity2)">
                        <rect x="78" y="52" width="26" height="33" rx="1"/>
                        <rect x="198" y="56" width="28" height="29" rx="1"/>
                        <rect x="230" y="48" width="25" height="37" rx="1"/>
                        <rect x="259" y="52" width="26" height="33" rx="1"/>
                        <rect x="365" y="50" width="28" height="35" rx="1"/>
                        <rect x="535" y="52" width="30" height="33" rx="1"/>
                        <rect x="569" y="44" width="26" height="41" rx="1"/>
                        <rect x="599" y="50" width="28" height="35" rx="1"/>
                        <rect x="695" y="52" width="25" height="33" rx="1"/>
                        <rect x="885" y="50" width="28" height="35" rx="1"/>
                        <rect x="917" y="42" width="26" height="43" rx="1"/>
                        <rect x="1035" y="50" width="30" height="35" rx="1"/>
                        <rect x="1069" y="44" width="26" height="41" rx="1"/>
                    </g>

                    <!-- Glowing Road Lights & City Windows (Turns on at Night) -->
                    <g id="heroNightLights" class="hero-night-lights">
                        <!-- Street Lamp 1 at x=180 -->
                        <path d="M 180,82 L 180,68 Q 180,64 185,64 L 188,64" stroke="#334155" stroke-width="1.3" fill="none"/>
                        <polygon points="188,65 174,83 202,83" fill="url(#lampConeGrad)"/>
                        <circle cx="188" cy="65" r="2.2" class="lamp-bulb" fill="#fef08a"/>

                        <!-- Street Lamp 2 at x=290 -->
                        <path d="M 290,82 L 290,68 Q 290,64 295,64 L 298,64" stroke="#334155" stroke-width="1.3" fill="none"/>
                        <polygon points="298,65 284,83 312,83" fill="url(#lampConeGrad)"/>
                        <circle cx="298" cy="65" r="2.2" class="lamp-bulb" fill="#fef08a"/>

                        <!-- Street Lamp 3 at x=520 -->
                        <path d="M 520,82 L 520,68 Q 520,64 525,64 L 528,64" stroke="#334155" stroke-width="1.3" fill="none"/>
                        <polygon points="528,65 514,83 542,83" fill="url(#lampConeGrad)"/>
                        <circle cx="528" cy="65" r="2.2" class="lamp-bulb" fill="#fef08a"/>

                        <!-- Street Lamp 4 at x=620 -->
                        <path d="M 620,82 L 620,68 Q 620,64 625,64 L 628,64" stroke="#334155" stroke-width="1.3" fill="none"/>
                        <polygon points="628,65 614,83 642,83" fill="url(#lampConeGrad)"/>
                        <circle cx="628" cy="65" r="2.2" class="lamp-bulb" fill="#fef08a"/>

                        <!-- Street Lamp 5 at x=850 -->
                        <path d="M 850,82 L 850,68 Q 850,64 855,64 L 858,64" stroke="#334155" stroke-width="1.3" fill="none"/>
                        <polygon points="858,65 844,83 872,83" fill="url(#lampConeGrad)"/>
                        <circle cx="858" cy="65" r="2.2" class="lamp-bulb" fill="#fef08a"/>

                        <!-- Street Lamp 6 at x=950 -->
                        <path d="M 950,82 L 950,68 Q 950,64 955,64 L 958,64" stroke="#334155" stroke-width="1.3" fill="none"/>
                        <polygon points="958,65 944,83 972,83" fill="url(#lampConeGrad)"/>
                        <circle cx="958" cy="65" r="2.2" class="lamp-bulb" fill="#fef08a"/>

                        <!-- Cozy City Windows -->
                        <g fill="#fde047">
                            <rect x="24" y="58" width="4" height="4" rx="0.5"/>
                            <rect x="32" y="58" width="4" height="4" rx="0.5"/>
                            <rect x="52" y="50" width="4" height="4" rx="0.5"/>
                            <rect x="62" y="50" width="4" height="4" rx="0.5"/>
                            <rect x="52" y="60" width="4" height="4" rx="0.5"/>
                            <rect x="140" y="48" width="5" height="5" rx="0.5"/>
                            <rect x="150" y="48" width="5" height="5" rx="0.5"/>
                            <rect x="334" y="46" width="5" height="5" rx="0.5"/>
                            <rect x="346" y="46" width="5" height="5" rx="0.5"/>
                            <rect x="473" y="42" width="4" height="4" rx="0.5"/>
                            <rect x="483" y="42" width="4" height="4" rx="0.5"/>
                            <rect x="473" y="52" width="4" height="4" rx="0.5"/>
                            <rect x="664" y="48" width="5" height="5" rx="0.5"/>
                            <rect x="676" y="48" width="5" height="5" rx="0.5"/>
                            <rect x="788" y="44" width="4" height="4" rx="0.5"/>
                            <rect x="800" y="44" width="4" height="4" rx="0.5"/>
                            <rect x="788" y="54" width="4" height="4" rx="0.5"/>
                            <rect x="1006" y="44" width="5" height="5" rx="0.5"/>
                            <rect x="1016" y="44" width="5" height="5" rx="0.5"/>
                            <rect x="1149" y="52" width="5" height="5" rx="0.5"/>
                            <rect x="1161" y="52" width="5" height="5" rx="0.5"/>
                        </g>
                    </g>

                    <!-- High-Voltage Base Transmission Cables (Across 1200px) -->
                    <path class="cable-base" d="M 0,38 Q 40,48 80,26 Q 240,54 400,24 Q 560,54 720,26 Q 880,56 1040,28 Q 1120,48 1200,40" stroke="#334155" stroke-width="1.4" fill="none"/>
                    <path class="cable-base" d="M 0,48 Q 40,58 80,40 Q 240,68 400,38 Q 560,68 720,40 Q 880,70 1040,42 Q 1120,60 1200,52" stroke="#334155" stroke-width="1.4" fill="none"/>
                    <path class="cable-base" d="M 0,58 Q 40,68 80,52 Q 240,78 400,50 Q 560,78 720,52 Q 880,80 1040,54 Q 1120,70 1200,62" stroke="#334155" stroke-width="1.2" fill="none" opacity="0.75"/>

                    <!-- Continuous Flowing Electricity Pulses Across 3 Cables (Sequential Staggered 3-Phase Plasma Flow) -->
                    <!-- CABLE 1 (Top Cable) -->
                    <path class="cable-pulse-aura cable-seq-1" d="M 0,38 Q 40,48 80,26 Q 240,54 400,24 Q 560,54 720,26 Q 880,56 1040,28 Q 1120,48 1200,40" stroke="#00f0ff" stroke-width="3.6" stroke-linecap="round" fill="none"/>
                    <path class="cable-pulse-core cable-seq-1" d="M 0,38 Q 40,48 80,26 Q 240,54 400,24 Q 560,54 720,26 Q 880,56 1040,28 Q 1120,48 1200,40" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" fill="none"/>
                    <path class="cable-pulse-spark cable-seq-1" d="M 0,38 Q 40,48 80,26 Q 240,54 400,24 Q 560,54 720,26 Q 880,56 1040,28 Q 1120,48 1200,40" stroke="#fde047" stroke-width="1.8" stroke-linecap="round" fill="none"/>

                    <!-- CABLE 2 (Middle Cable) -->
                    <path class="cable-pulse-aura cable-seq-2" d="M 0,48 Q 40,58 80,40 Q 240,68 400,38 Q 560,68 720,40 Q 880,70 1040,42 Q 1120,60 1200,52" stroke="#00f0ff" stroke-width="3.6" stroke-linecap="round" fill="none"/>
                    <path class="cable-pulse-core cable-seq-2" d="M 0,48 Q 40,58 80,40 Q 240,68 400,38 Q 560,68 720,40 Q 880,70 1040,42 Q 1120,60 1200,52" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" fill="none"/>
                    <path class="cable-pulse-spark cable-seq-2" d="M 0,48 Q 40,58 80,40 Q 240,68 400,38 Q 560,68 720,40 Q 880,70 1040,42 Q 1120,60 1200,52" stroke="#fde047" stroke-width="1.8" stroke-linecap="round" fill="none"/>

                    <!-- CABLE 3 (Bottom Cable) -->
                    <path class="cable-pulse-aura cable-seq-3" d="M 0,58 Q 40,68 80,52 Q 240,78 400,50 Q 560,78 720,52 Q 880,80 1040,54 Q 1120,70 1200,62" stroke="#00f0ff" stroke-width="3.4" stroke-linecap="round" fill="none"/>
                    <path class="cable-pulse-core cable-seq-3" d="M 0,58 Q 40,68 80,52 Q 240,78 400,50 Q 560,78 720,52 Q 880,80 1040,54 Q 1120,70 1200,62" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                    <path class="cable-pulse-spark cable-seq-3" d="M 0,58 Q 40,68 80,52 Q 240,78 400,50 Q 560,78 720,52 Q 880,80 1040,54 Q 1120,70 1200,62" stroke="#fde047" stroke-width="1.8" stroke-linecap="round" fill="none"/>

                    <!-- Tower 1 (Left Pylon at x=80) -->
                    <path d="M 80 10 L 64 85 L 96 85 Z" stroke="#334155" stroke-width="2.2" fill="none"/>
                    <line x1="50" y1="32" x2="110" y2="32" stroke="#334155" stroke-width="2.2" stroke-linecap="round"/>
                    <line x1="42" y1="52" x2="118" y2="52" stroke="#334155" stroke-width="2.2" stroke-linecap="round"/>
                    <line x1="68" y1="32" x2="92" y2="52" stroke="#334155" stroke-width="1.5"/>
                    <line x1="92" y1="32" x2="68" y2="52" stroke="#334155" stroke-width="1.5"/>
                    <line x1="64" y1="52" x2="96" y2="85" stroke="#334155" stroke-width="1.5"/>
                    <line x1="96" y1="52" x2="64" y2="85" stroke="#334155" stroke-width="1.5"/>

                    <!-- Tower 2 (Mid-Left Pylon at x=400) -->
                    <path d="M 400 8 L 382 85 L 418 85 Z" stroke="#1e293b" stroke-width="2.4" fill="none"/>
                    <line x1="368" y1="30" x2="432" y2="30" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/>
                    <line x1="360" y1="50" x2="440" y2="50" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/>
                    <line x1="388" y1="30" x2="412" y2="50" stroke="#1e293b" stroke-width="1.6"/>
                    <line x1="412" y1="30" x2="388" y2="50" stroke="#1e293b" stroke-width="1.6"/>
                    <line x1="382" y1="50" x2="418" y2="85" stroke="#1e293b" stroke-width="1.6"/>
                    <line x1="418" y1="50" x2="382" y2="85" stroke="#1e293b" stroke-width="1.6"/>

                    <!-- Tower 3 (Mid-Right Pylon at x=720) -->
                    <path d="M 720 10 L 704 85 L 736 85 Z" stroke="#334155" stroke-width="2.2" fill="none"/>
                    <line x1="690" y1="32" x2="750" y2="32" stroke="#334155" stroke-width="2.2" stroke-linecap="round"/>
                    <line x1="682" y1="52" x2="758" y2="52" stroke="#334155" stroke-width="2.2" stroke-linecap="round"/>
                    <line x1="708" y1="32" x2="732" y2="52" stroke="#334155" stroke-width="1.5"/>
                    <line x1="732" y1="32" x2="708" y2="52" stroke="#334155" stroke-width="1.5"/>
                    <line x1="704" y1="52" x2="736" y2="85" stroke="#334155" stroke-width="1.5"/>
                    <line x1="736" y1="52" x2="704" y2="85" stroke="#334155" stroke-width="1.5"/>

                    <!-- Tower 4 (Far-Right Perspective Pylon at x=1040) -->
                    <path d="M 1040 12 L 1026 85 L 1054 85 Z" stroke="#475569" stroke-width="2" fill="none"/>
                    <line x1="1014" y1="34" x2="1066" y2="34" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
                    <line x1="1008" y1="52" x2="1072" y2="52" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
                    <line x1="1030" y1="34" x2="1050" y2="52" stroke="#475569" stroke-width="1.4"/>
                    <line x1="1050" y1="34" x2="1030" y2="52" stroke="#475569" stroke-width="1.4"/>
                    <line x1="1026" y1="52" x2="1054" y2="85" stroke="#475569" stroke-width="1.4"/>
                    <line x1="1054" y1="52" x2="1026" y2="85" stroke="#475569" stroke-width="1.4"/>

                    <!-- Rolling Green Landscape Base (Continuous across 1200px) -->
                    <path d="M 0,85 C 100,75 200,82 300,78 C 400,74 500,80 600,76 C 700,72 800,80 900,75 C 1000,70 1100,78 1200,76 L 1200,85 L 0,85 Z" fill="#86efac" opacity="0.85"/>
                    <path d="M 0,85 C 120,78 240,84 360,80 C 480,76 600,82 720,78 C 840,74 960,82 1080,77 L 1200,78 L 1200,85 L 0,85 Z" fill="#4ade80" opacity="0.75"/>
                    <path d="M 0,85 C 150,81 300,85 450,82 C 600,79 750,84 900,81 C 1050,78 1150,83 1200,82 L 1200,85 L 0,85 Z" fill="#22c55e" opacity="0.9"/>

                    <!-- Lush Green Tree Clusters Across the Horizon -->
                    <g fill="#15803d">
                        <circle cx="25" cy="78" r="6"/>
                        <circle cx="34" cy="75" r="8" fill="#16a34a"/>
                        <circle cx="44" cy="77" r="7" fill="#22c55e"/>
                        <circle cx="120" cy="77" r="7"/>
                        <circle cx="131" cy="74" r="9" fill="#16a34a"/>
                        <circle cx="143" cy="77" r="6" fill="#22c55e"/>
                        <circle cx="230" cy="78" r="7"/>
                        <circle cx="241" cy="74" r="9" fill="#16a34a"/>
                        <circle cx="253" cy="77" r="6" fill="#22c55e"/>
                        <circle cx="340" cy="78" r="6"/>
                        <circle cx="350" cy="74" r="8" fill="#16a34a"/>
                        <circle cx="460" cy="77" r="7"/>
                        <circle cx="472" cy="73" r="9" fill="#16a34a"/>
                        <circle cx="484" cy="76" r="6" fill="#22c55e"/>
                        <circle cx="575" cy="78" r="7"/>
                        <circle cx="586" cy="75" r="9" fill="#16a34a"/>
                        <circle cx="670" cy="77" r="7"/>
                        <circle cx="681" cy="73" r="9" fill="#16a34a"/>
                        <circle cx="693" cy="76" r="6" fill="#22c55e"/>
                        <circle cx="795" cy="78" r="6"/>
                        <circle cx="805" cy="74" r="8" fill="#16a34a"/>
                        <circle cx="895" cy="77" r="7"/>
                        <circle cx="906" cy="73" r="9" fill="#16a34a"/>
                        <circle cx="918" cy="76" r="6" fill="#22c55e"/>
                        <circle cx="1005" cy="78" r="6"/>
                        <circle cx="1015" cy="74" r="8" fill="#16a34a"/>
                        <circle cx="1110" cy="77" r="7"/>
                        <circle cx="1121" cy="74" r="9" fill="#16a34a"/>
                        <circle cx="1165" cy="78" r="6"/>
                        <circle cx="1175" cy="74" r="8" fill="#16a34a"/>
                    </g>
                </svg>
            </div>
        </div>
        </div>

        <!-- ============================================================
        2. বর্তমান মিটার কার্ড (Meter Selector Card)
        ============================================================ -->
        <div class="meter-selector-card">
            <div class="meter-label-wrap">
                <span class="bolt-icon">⚡</span>
                <label>${__('currentMeter')}</label>
            </div>
            <div class="meter-select-wrap">
                <select class="meter-select-input" onchange="switchMeter(this.value)">
                    ${meterOptions}
                </select>
            </div>
            <div class="lang-toggle-btn" onclick="toggleLanguage()" title="Change Language">
                <span style="font-size: 15px;">🌐</span>
                <span>${APP.language === 'bn' ? 'English' : 'বাংলা'}</span>
            </div>
        </div>

        <!-- ============================================================
        3. ROW 1: ৬টি KPI কার্ড (Desktop 6-Col, Mobile 2-Col)
        ============================================================ -->
        <div class="kpi-grid">
            ${createStatCard('wallet', L === 'en' ? 'Total Recharge' : 'মোট রিচার্জ', `৳ ${totalRecharge.toFixed(2)}`, 'linear-gradient(135deg, #6366f1, #4f46e5)', trends.totalRecharge)}
            ${createStatCard('taka', L === 'en' ? 'Total Expense' : 'মোট খরচ', `৳ ${totalExpense.toFixed(2)}`, 'linear-gradient(135deg, #ec4899, #f43f5e)', trends.totalExpense)}
            ${createStatCard('activity', L === 'en' ? 'Transactions' : 'ট্রানজেকশন', `${totalTransactions}`, 'linear-gradient(135deg, #06b6d4, #0284c7)', trends.totalTransactions)}
            ${createStatCard('chart', L === 'en' ? 'Monthly Avg Expense' : 'মাসিক গড় খরচ', `৳ ${monthlyAvgExpense.toFixed(2)}`, 'linear-gradient(135deg, #10b981, #059669)', trends.monthlyAvgExpense)}
            ${createStatCard('zap', L === 'en' ? 'Total KWH' : 'মোট KWH', `${totalKWH.toFixed(2)}`, 'linear-gradient(135deg, #f59e0b, #ea580c)', trends.totalKWH)}
            ${createStatCard('layers', L === 'en' ? 'Monthly Avg KWH' : 'গড় মাসিক KWH', `${monthlyAvgKWH.toFixed(2)}`, 'linear-gradient(135deg, #8b5cf6, #7c3aed)', trends.monthlyAvgKWH)}
        </div>

        <!-- ============================================================
        🔮 SMART AI INSIGHTS: ব্যালেন্স পূর্বাভাস & ট্যারিফ স্ল্যাব অ্যালার্ট
        ============================================================ -->
        <div class="smart-insights-grid">
            <!-- 1. স্মার্ট ব্যালেন্স পূর্বাভাস ও রিচার্জ রিমাইন্ডার -->
            <div class="smart-insight-card predictor-card status-${smartPrediction.status}">
                <div class="smart-card-header">
                    <div class="smart-badge-title predictor">
                        <span class="smart-icon">🔮</span>
                        <span>${L === 'en' ? 'Smart Balance & Bill Predictor' : 'স্মার্ট ব্যালেন্স পূর্বাভাস ও রিমাইন্ডার'}</span>
                    </div>
                    <div class="smart-status-pill ${smartPrediction.status}">
                        ${smartPrediction.statusPill}
                    </div>
                </div>

                <div class="smart-stats-row">
                    <div class="smart-stat-box">
                        <div class="smart-stat-sub">${L === 'en' ? 'Estimated Duration' : 'চলবে আনুমানিক'}</div>
                        <div class="smart-stat-val primary-purple">${formatToBengaliNumerals(smartPrediction.estimatedDays)} ${L === 'en' ? 'Days' : 'দিন'}</div>
                        <div class="smart-stat-date">📅 ${smartPrediction.runoutDateFormatted} ${L === 'en' ? 'until' : 'পর্যন্ত'}</div>
                    </div>
                    <div class="smart-stat-box">
                        <div class="smart-stat-sub">${L === 'en' ? 'Daily Burn Rate' : 'দৈনিক গড় খরচ'}</div>
                        <div class="smart-stat-val">৳ ${formatToBengaliNumerals(smartPrediction.dailyAvg.toFixed(2))}</div>
                        <div class="smart-stat-date">${L === 'en' ? 'Slab-adjusted burn rate' : 'স্ল্যাব বৃদ্ধির প্রভাবসহ'}</div>
                    </div>
                </div>

                <div class="smart-callout-box predictor-callout">
                    <div class="callout-icon">💡</div>
                    <div class="callout-text">
                        <strong>${L === 'en' ? 'Dashboard Alert' : 'ড্যাশবোর্ড পূর্বাভাস'}:</strong>
                        <span>"${smartPrediction.message}"</span>
                    </div>
                </div>

                <div class="smart-progress-wrap">
                    <div class="smart-progress-label">
                        <span>${smartPrediction.deficitDays > 0 ? (L === 'en' ? `Shortfall: ${smartPrediction.deficitDays} days` : `চলতি মাসে ঘাটতি: ${formatToBengaliNumerals(smartPrediction.deficitDays)} দিন`) : (L === 'en' ? `Covers this month + ${smartPrediction.extraDaysNextMonth} days next month` : `চলতি মাসের বাকি ${formatToBengaliNumerals(smartPrediction.daysRemainingInMonth)} দিন কভার্ড + আগামী মাসের ${formatToBengaliNumerals(smartPrediction.extraDaysNextMonth)} দিন`)}</span>
                        <span>${smartPrediction.deficitDays > 0 ? (L === 'en' ? 'Recharge Needed ⚠️' : 'রিচার্জ প্রয়োজন ⚠️') : (L === 'en' ? 'Full Month Covered ✓' : 'পুরো মাস নিরাপদ ✓')}</span>
                    </div>
                    <div class="smart-progress-track">
                        <div class="smart-progress-fill predictor-fill" style="width: ${Math.min(100, Math.max(10, (smartPrediction.estimatedDays / Math.max(smartPrediction.daysRemainingInMonth, 1)) * 100))}%;"></div>
                    </div>
                </div>

                <div class="smart-card-footer">
                    <span class="smart-tip-text">🛡️ ${L === 'en' ? 'Safe from sudden midnight or holiday blackouts' : 'হুট করে মাঝরাতে বা ছুটির দিনে বিদ্যুৎ চলে যাওয়ার ঝুঁকি থাকবে না'}</span>
                    <button class="smart-action-btn recharge-btn" onclick="navigateTo('transactions')">
                        <span>⚡ ${L === 'en' ? 'Recharge' : 'রিচার্জ করুন'}</span>
                    </button>
                </div>
            </div>

            <!-- 2. ট্যারিফ স্ল্যাব জাম্প অ্যালার্ট -->
            <div class="smart-insight-card slab-card status-${slabStatus.status}">
                <div class="smart-card-header">
                    <div class="smart-badge-title slab">
                        <span class="smart-icon">⚠️</span>
                        <span>${L === 'en' ? 'Tariff Slab Jump Warning' : 'ট্যারিফ স্ল্যাব জাম্প অ্যালার্ট'}</span>
                    </div>
                    <div class="smart-status-pill ${slabStatus.status}">
                        ${slabStatus.statusPill}
                    </div>
                </div>

                <div class="smart-stats-row">
                    <div class="smart-stat-box">
                        <div class="smart-stat-sub">${L === 'en' ? 'This Month Usage' : 'চলতি মাসে খরচ'}</div>
                        <div class="smart-stat-val primary-amber">${formatToBengaliNumerals(slabStatus.currentUnits.toFixed(1))} <span style="font-size: 13px; font-weight: 600;">KWh</span></div>
                        <div class="smart-stat-date">📍 ${slabStatus.slabNameBn} (${L === 'en' ? 'Active' : 'চলমান'})</div>
                    </div>
                    <div class="smart-stat-box">
                        <div class="smart-stat-sub">${L === 'en' ? 'Slab Upper Limit' : 'স্ল্যাব সীমা'}</div>
                        <div class="smart-stat-val">${slabStatus.currSlab.range[1] !== null ? formatToBengaliNumerals(slabStatus.currSlab.range[1]) : '∞'} <span style="font-size: 13px; font-weight: 600;">KWh</span></div>
                        <div class="smart-stat-date">${slabStatus.nextSlab ? (L === 'en' ? `Next: ৳${slabStatus.nextSlab.rate.toFixed(2)}/u` : `পরবর্তী: ৳${formatToBengaliNumerals(slabStatus.nextSlab.rate.toFixed(2))}/ইউনিট`) : (L === 'en' ? 'Max Tier' : 'সর্বোচ্চ স্তর')}</div>
                    </div>
                </div>

                <div class="smart-callout-box slab-callout ${slabStatus.isWarning ? 'warning-glow' : ''}">
                    <div class="callout-icon">${slabStatus.isWarning ? '⚡' : '💡'}</div>
                    <div class="callout-text">
                        <strong>${slabStatus.isWarning ? (L === 'en' ? 'Slab Warning:' : 'স্ল্যাব ওয়ার্নিং:') : (L === 'en' ? 'Slab Status:' : 'স্ল্যাব স্ট্যাটাস:')}</strong>
                        <span>"${slabStatus.message}"</span>
                    </div>
                </div>

                <div class="smart-progress-wrap">
                    <div class="smart-progress-label">
                        <span>${L === 'en' ? 'Current Slab Progress:' : 'স্ল্যাব অগ্রগতি:'} ${formatToBengaliNumerals(slabStatus.fillPct.toFixed(0))}%</span>
                        <span>${slabStatus.nextSlab ? (L === 'en' ? `${slabStatus.unitsRemaining.toFixed(1)} kWh to jump` : `আর ${formatToBengaliNumerals(slabStatus.unitsRemaining.toFixed(1))} ইউনিট বাকি`) : ''}</span>
                    </div>
                    <div class="smart-progress-track">
                        <div class="smart-progress-fill slab-fill ${slabStatus.isWarning ? 'warning-fill' : ''}" style="width: ${slabStatus.fillPct.toFixed(1)}%;"></div>
                    </div>
                </div>

                <div class="smart-card-footer">
                    <span class="smart-tip-text">⚡ ${L === 'en' ? 'Be conscious to avoid higher tier electricity billing shocks' : 'অতিরিক্ত বিলের ধাক্কা থেকে সচেতন হতে পারবেন'}</span>
                    <button class="smart-action-btn slab-btn" onclick="navigateTo('calculator')">
                        <span>📋 ${L === 'en' ? 'Slab Rates' : 'ট্যারিফ স্ল্যাব রেট'}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- ============================================================
        4. ROW 2: বিলিং, ভ্যাট ও রিবেট সারাংশ (Billing Summary Card)
        ============================================================ -->
        <div class="billing-summary-container">
            <div class="billing-header">
                <div class="billing-title">
                    <span class="billing-icon-pill">📊</span>
                    <span>${L === 'en' ? 'Billing, VAT & Rebate Summary' : 'বিলিং, ভ্যাট ও রিবেট সারাংশ'}</span>
                </div>
                <div class="billing-record-badge">
                    <span>${L === 'en' ? 'Total Records' : 'মোট রেকর্ড'}: ${summary.rechargeCount || 0}</span>
                </div>
            </div>
            
            <div class="billing-cards-grid">
                <!-- ডিমান্ড চার্জ (Orange) -->
                <div class="deduction-card orange">
                    <div class="deduction-icon-box" title="${L === 'en' ? 'Demand Charge' : 'ডিমান্ড চার্জ'}">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                            <path d="M13 2L3 14h7v8l11-12h-8z"/>
                        </svg>
                    </div>
                    <div class="deduction-label">${L === 'en' ? 'Demand Charge' : 'ডিমান্ড চার্জ'}</div>
                    <div class="deduction-value">৳ ${(summary.totalDemand || 0).toFixed(2)}</div>
                </div>
                <!-- ভ্যাট (Red/Pink) -->
                <div class="deduction-card pink">
                    <div class="deduction-icon-box" title="${L === 'en' ? 'VAT Tax Receipt' : 'ভ্যাট রসিদ'}">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="rgba(255,255,255,0.22)"></path>
                            <circle cx="10" cy="12" r="1.5" fill="currentColor"></circle>
                            <circle cx="14" cy="16" r="1.5" fill="currentColor"></circle>
                            <line x1="14" y1="12" x2="10" y2="16"></line>
                        </svg>
                    </div>
                    <div class="deduction-label">${L === 'en' ? 'VAT' : 'ভ্যাট'}</div>
                    <div class="deduction-value">৳ ${(summary.totalVat || 0).toFixed(2)}</div>
                </div>
                <!-- রিবেট (Green) -->
                <div class="deduction-card green">
                    <div class="deduction-icon-box" title="${L === 'en' ? 'Rebate Savings Tag' : 'রিবেট ছাড়'}">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" fill="rgba(255,255,255,0.22)"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7" stroke-width="3"></line>
                        </svg>
                    </div>
                    <div class="deduction-label">${L === 'en' ? 'Rebate' : 'রিবেট'}</div>
                    <div class="deduction-value">৳ ${(summary.totalRebate || 0).toFixed(2)}</div>
                </div>
            </div>
            
            <div class="billing-credit-strip">
                <div class="credit-label">
                    <span class="credit-icon">💰</span>
                    <span>${L === 'en' ? 'Total Credit from Rebate' : 'রিবেট থেকে মোট ক্রেডিট'}</span>
                </div>
                <div class="credit-amount">
                    ৳ ${(summary.totalNet || 0).toFixed(2)}
                </div>
            </div>
        </div>

        <!-- ============================================================
        5. ROW 3: বর্তমান ব্যালেন্স & সর্বশেষ খরচ (Balance & Expense Row)
        ============================================================ -->
        <div class="balance-expense-grid">
            <!-- বর্তমান ব্যালেন্স (Purple Gradient Card) -->
            <div class="balance-overview-card">
                <div class="balance-card-watermark">⚡</div>
                <div class="balance-header-row">
                    <div class="balance-label-pill">
                        <span class="bolt-sm">⚡</span>
                        <span>${__('balance')}</span>
                    </div>
                    <div class="balance-wallet-icon">
                        ${getIconSVG('wallet')}
                    </div>
                </div>
                <div class="balance-amount-display">
                    ${__('taka')} ${balance.toFixed(2)}
                </div>
                <div class="balance-progress-wrap">
                    <div class="progress-labels">
                        <span>0%</span>
                        <span>${L === 'en' ? 'Remaining Balance' : 'অবশিষ্ট ব্যালেন্স'}: ${balancePct.toFixed(1)}% (${L === 'en' ? 'Used' : 'খরচ'}: ${usagePct.toFixed(1)}%)</span>
                        <span>100%</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-bar-fill" style="width: ${balancePct.toFixed(1)}%; background: ${balanceProgressBg};"></div>
                    </div>
                </div>
            </div>

            <!-- সর্বশেষ খরচ (Mint Pastel Green Card) -->
            <div class="latest-expense-card">
                <div class="expense-header-row">
                    <div class="expense-icon-box">
                        ${getIconSVG('trendingDown')}
                    </div>
                    <div class="expense-main-info">
                        <div class="expense-label">${__('lastExpense')}</div>
                        <div class="expense-amount">৳ ${lastExpense.toFixed(2)}</div>
                    </div>
                    <div class="expense-cal-icon">📅</div>
                </div>
                <div class="expense-breakdown-list">
                    <div class="expense-item-row">
                        <span class="item-title">${L === 'en' ? "Today's Expense" : 'আজকের খরচ'}</span>
                        <span class="item-val">৳ ${todayExpense.toFixed(2)}</span>
                    </div>
                    <div class="expense-item-row">
                        <span class="item-title">${L === 'en' ? 'This Week' : 'এই সপ্তাহে'}</span>
                        <span class="item-val">৳ ${weekExpense.toFixed(2)}</span>
                    </div>
                    <div class="expense-item-row">
                        <span class="item-title">${L === 'en' ? 'This Month' : 'এই মাসে'}</span>
                        <span class="item-val">৳ ${monthExpense.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================================
        6. ROW 4: ভাড়া ও সার্ভিস সারাংশ (Rent and Service Summary)
        ============================================================ -->
        <div class="rent-summary-box">
            <div class="rent-box-header">
                <div class="rent-title">
                    <span class="rent-house-icon">🏠</span>
                    <span>${L === 'en' ? 'Rent & Service Summary' : 'ভাড়া ও সার্ভিস সারাংশ'}</span>
                    <span class="rent-count">(${rentRecords.length} ${L === 'en' ? 'records' : 'টি'})</span>
                </div>
                <button class="view-all-link" onclick="navigateTo('rent')">
                    ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
                </button>
            </div>
            
            <div class="tenant-cards-grid">
                ${(function() {
                    if (!rentRecords || rentRecords.length === 0) {
                        return `
                            <div style="grid-column: 1 / -1; text-align: center; padding: 24px 16px; color: #94a3b8; font-size: 13.5px; background: #f8fafc; border-radius: 14px; border: 1px dashed #cbd5e1;">
                                ${L === 'en' ? 'No rent records found. Click "View All" to add records.' : 'কোনো ভাড়া রেকর্ড পাওয়া যায়নি। "সব দেখুন →" এ ক্লিক করে রেকর্ড যোগ করুন।'}
                            </div>
                        `;
                    }

                    // Sort records latest first by month descending
                    var sorted = rentRecords.slice().sort(function(a, b) {
                        var ma = (a && a.month) ? String(a.month) : '';
                        var mb = (b && b.month) ? String(b.month) : '';
                        var ca = (a && a.createdAt) ? String(a.createdAt) : '';
                        var cb = (b && b.createdAt) ? String(b.createdAt) : '';
                        return mb.localeCompare(ma) || cb.localeCompare(ca);
                    });

                    function formatMonthLabel(mStr) {
                        if (!mStr) return '';
                        var parts = mStr.split('-');
                        if (parts.length < 2) return mStr;
                        var mIdx = parseInt(parts[1]) - 1;
                        if (mIdx < 0 || mIdx > 11) return mStr;
                        var bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
                        var enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        return (L === 'en' ? enMonths[mIdx] : bnMonths[mIdx]) + ' ' + parts[0];
                    }

                    // Distinct tenants vs single tenant records
                    var cardsToShow = [];
                    var distinctTenantKeys = Object.keys(tenantGroups);

                    if (distinctTenantKeys.length > 1) {
                        var seenTenants = {};
                        sorted.forEach(function(rec) {
                            var tKey = rec.meterId || rec.meterName || rec.tenantName || 'default';
                            if (!seenTenants[tKey] && cardsToShow.length < 2) {
                                seenTenants[tKey] = true;
                                cardsToShow.push(rec);
                            }
                        });
                    } else {
                        // Single tenant: show the 2 most recent records (e.g. Nov and Oct)
                        cardsToShow = sorted.slice(0, 2);
                    }

                    var cardClasses = ['pink-tenant', 'teal-tenant'];
                    var outHtml = cardsToShow.map(function(rec, idx) {
                        var cClass = cardClasses[idx % cardClasses.length];
                        var rRent = parseFloat(rec.rentAmount) || 0;
                        var sCharge = parseFloat(rec.serviceCharge) || 0;
                        var pCharge = parseFloat(rec.parkingCharge) || 0;
                        var tAmount = parseFloat(rec.totalAmount) || (rRent + sCharge + pCharge);
                        var isPaid = (rec.status === 'paid' || rec.status === 'পরিশোধিত');
                        var monthLbl = formatMonthLabel(rec.month);
                        var tName = rec.meterName || rec.tenantName || (L === 'en' ? 'Tenant' : 'ভাড়াটিয়া');

                        return `
                            <div class="tenant-card ${cClass}">
                                <div class="tenant-top-row">
                                    <div class="tenant-name">${tName}</div>
                                    <div class="tenant-date-pill">📅 ${monthLbl || rec.month}</div>
                                </div>
                                <div class="tenant-amount">৳ ${formatNumberWithComma(tAmount)}</div>
                                <div class="tenant-pills-row">
                                    <div class="tenant-subpill" style="background: ${isPaid ? '#dcfce7' : '#fee2e2'}; color: ${isPaid ? '#15803d' : '#b91c1c'}; font-weight: 700;">
                                        <span class="subpill-lbl">${L === 'en' ? (isPaid ? 'Paid' : 'Due') : (isPaid ? 'পরিশোধিত' : 'বকেয়া')}</span>
                                        <span class="subpill-val">${isPaid ? '✓' : ('৳ ' + formatNumberWithComma(tAmount))}</span>
                                    </div>
                                    <div class="tenant-subpill" style="background: rgba(255,255,255,0.85); color: #334155; font-weight: 600;">
                                        <span class="subpill-lbl">${L === 'en' ? 'Rent' : 'ভাড়া'}</span>
                                        <span class="subpill-val">৳ ${formatNumberWithComma(rRent)}</span>
                                    </div>
                                    <div class="tenant-subpill" style="background: rgba(255,255,255,0.85); color: #4338ca; font-weight: 600;">
                                        <span class="subpill-lbl">${L === 'en' ? 'Service' : 'সার্ভিস'}</span>
                                        <span class="subpill-val">৳ ${formatNumberWithComma(sCharge)}</span>
                                    </div>
                                    ${pCharge > 0 ? `
                                    <div class="tenant-subpill" style="background: rgba(255,255,255,0.85); color: #0284c7; font-weight: 600;">
                                        <span class="subpill-lbl">${L === 'en' ? 'Parking' : 'পার্কিং'}</span>
                                        <span class="subpill-val">৳ ${formatNumberWithComma(pCharge)}</span>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('');

                    if (cardsToShow.length === 1) {
                        outHtml += `
                            <div class="tenant-card teal-tenant" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; border: 1.5px dashed #06b6d4; min-height: 105px;">
                                <div style="font-size: 13.5px; font-weight: 700; color: #0891b2; margin-bottom: 6px;">
                                    ➕ ${L === 'en' ? 'Add Rent Record' : 'নতুন মাসের ভাড়া যোগ করুন'}
                                </div>
                                <button class="btn btn-sm" onclick="showRentForm()" style="background: #0891b2; color: #fff; padding: 5px 12px; font-size: 11.5px; border-radius: 8px; border: none; cursor: pointer;">
                                    ${L === 'en' ? 'Add Rent' : 'ভাড়া যোগ করুন'}
                                </button>
                            </div>
                        `;
                    }

                    return outHtml;
                })()}
            </div>

            <!-- 4 Rent Summary Pills -->
            <div class="rent-kpi-pills-grid">
                <div class="rent-pill yellow-pill">
                    <span class="pill-ico">🪙</span>
                    <span class="pill-lbl">${L === 'en' ? 'Total Rent' : 'মোট ভাড়া'}</span>
                    <span class="pill-val">৳ ${formatNumberWithComma(totalRentVal)}</span>
                </div>
                <div class="rent-pill green-pill">
                    <span class="pill-ico">⚙️</span>
                    <span class="pill-lbl">${L === 'en' ? 'Total Service' : 'মোট সার্ভিস'}</span>
                    <span class="pill-val">৳ ${formatNumberWithComma(totalServiceVal)}</span>
                </div>
                <div class="rent-pill violet-pill">
                    <span class="pill-ico">📄</span>
                    <span class="pill-lbl">${L === 'en' ? 'Total Due' : 'মোট বকেয়া'}</span>
                    <span class="pill-val">৳ ${formatNumberWithComma(totalDueVal)}</span>
                </div>
                <div class="rent-pill blue-pill">
                    <span class="pill-ico">🪙</span>
                    <span class="pill-lbl">${L === 'en' ? 'Grand Total' : 'সর্বমোট'}</span>
                    <span class="pill-val">৳ ${formatNumberWithComma(totalOverallVal)}</span>
                </div>
            </div>
        </div>

        <!-- ============================================================
        7. ROW 5: খরচ এনালিটিক্স (Expense Analytics - Line & Donut Chart)
        ============================================================ -->
        <div class="analytics-charts-grid">
            <!-- Line Chart: খরচ সারাংশ -->
            <div class="analytics-chart-card">
                <div class="chart-header">
                    <div class="chart-title">
                        <span class="chart-ico">📊</span>
                        <span>${L === 'en' ? 'Expense Summary' : 'খরচ সারাংশ'}</span>
                    </div>
                    <button class="view-all-link" onclick="navigateTo('analytics')">
                        ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
                    </button>
                </div>
                <div class="chart-canvas-wrap" style="position: relative; height: 210px; width: 100%;">
                    <canvas id="dashboardExpenseChart"></canvas>
                </div>
            </div>

            <!-- Donut Chart: খরচের ধরন -->
            <div class="analytics-chart-card">
                <div class="chart-header">
                    <div class="chart-title">
                        <span class="chart-ico">🏷️</span>
                        <span>${L === 'en' ? 'Expense Breakdown' : 'খরচের ধরন'}</span>
                    </div>
                    <button class="view-all-link" onclick="navigateTo('analytics')">
                        ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
                    </button>
                </div>
                <div class="donut-chart-layout">
                    <div class="donut-canvas-container" style="position: relative; width: 170px; height: 170px; flex-shrink: 0; margin: 0 auto;">
                        <canvas id="dashboardCategoryChart"></canvas>
                        <div class="donut-center-content" onclick="triggerElectricShock(this)" title="${L === 'en' ? 'Click for electric spark effect!' : 'ক্লিক করে বিদ্যুৎ চমক দেখুন!'}">
                            <div class="center-label">
                                <span class="electric-spark-ico">⚡</span>
                                <span>${L === 'en' ? 'Total Cost' : 'মোট খরচ'}</span>
                            </div>
                            <div class="center-value">৳ ${(monthExpense || 223.05).toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="donut-legend-wrap">
                        <div class="legend-row">
                            <span class="legend-dot purple"></span>
                            <span class="legend-name">${L === 'en' ? 'Demand Charge' : 'ডিমান্ড চার্জ'}</span>
                            <span class="legend-percent">${demandPct}%</span>
                        </div>
                        <div class="legend-row">
                            <span class="legend-dot cyan"></span>
                            <span class="legend-name">${L === 'en' ? 'VAT' : 'ভ্যাট'}</span>
                            <span class="legend-percent">${vatPct}%</span>
                        </div>
                        <div class="legend-row">
                            <span class="legend-dot green"></span>
                            <span class="legend-name">${L === 'en' ? 'Rebate' : 'রিবেট'}</span>
                            <span class="legend-percent">${rebatePct}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================================
        8. ROW 6: সর্বশেষ ট্রানজেকশন (Recent Transactions Table)
        ============================================================ -->
        <div class="recent-transactions-container">
            <div class="recent-tx-header">
                <div class="tx-title">
                    <span class="tx-ico">📋</span>
                    <span>${__('recentTransactions')} (${recentTx.length})</span>
                </div>
                <button class="view-all-link" onclick="navigateTo('transactions')">
                    ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
                </button>
            </div>
            
            ${recentTx.length > 0 ? `
            <div class="table-scroll-container">
                <table class="dashboard-tx-table">
                    <thead>
                        <tr>
                            <th style="text-align: left;">${__('date')}</th>
                            <th style="text-align: left;">${__('type')}</th>
                            <th style="text-align: right;">${__('amount')}</th>
                            <th style="text-align: right;">${__('units')}</th>
                            <th style="text-align: right;">${__('balance')}</th>
                            <th style="text-align: left;">${__('description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recentTx.map(function(t) {
                            var dateStr = t.date || t.timestamp;
                            var displayDate = '-';
                            try {
                                if (dateStr) {
                                    var d = new Date(dateStr);
                                    if (!isNaN(d.getTime())) {
                                        displayDate = d.toLocaleDateString(dateLocale);
                                    }
                                }
                            } catch(e) {
                                displayDate = '-';
                            }
                            
                            var description = t.description || '-';
                            var isBill = t.type !== 'recharge';
                            var typeLabel = isBill ? __('bill') : __('recharge');
                            var badgeClass = isBill ? 'tx-badge-amber' : 'tx-badge-green';
                            var amountClass = isBill ? 'tx-amount-bill' : 'tx-amount-recharge';
                            
                            return `
                            <tr>
                                <td class="tx-cell-date">${displayDate}</td>
                                <td><span class="tx-badge ${badgeClass}">${typeLabel}</span></td>
                                <td class="tx-cell-amt ${amountClass}">${__('taka')} ${(t.amount || 0).toFixed(2)}</td>
                                <td class="tx-cell-units">${t.units ? t.units.toFixed(2) : '-'}</td>
                                <td class="tx-cell-balance">${__('taka')} ${(t.balanceAfter || 0).toFixed(2)}</td>
                                <td class="tx-cell-desc" title="${(description || '').replace(/"/g, '&quot;')}">
                                    ${formatTxDescription(description, t)}
                                </td>
                            </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            ` : `
            <div class="no-tx-box">
                <div style="font-size: 40px; margin-bottom: 8px;">📭</div>
                <p style="font-size: 14px; color: #64748b; margin-bottom: 12px;">${__('noTransactions')}</p>
                <button onclick="navigateTo('transactions')" class="add-tx-btn">
                    + ${L === 'en' ? 'Add Transaction' : 'ট্রানজেকশন যোগ করুন'}
                </button>
            </div>
            `}
        </div>
    `;

    document.getElementById('pageContent').innerHTML = htmlContent;

    // Render Chart.js interactive charts
    try {
        initDashboardCharts(APP.activeMeterId, transactions, summary, monthExpense);
    } catch(err) {
        console.error('initDashboardCharts error:', err);
    }

    // Start Live Regional Clock & Real-time Sky Engine
    try {
        initDashboardRealTimeClock();
    } catch(err) {
        console.error('initDashboardRealTimeClock error:', err);
    }
}

// ============================================================
// 🕒 রিয়েল-টাইম রিজিওনাল ঘড়ি ও ডায়নামিক আকাশ ইঞ্জিন (Sun/Moon/Sky)
// ============================================================
var _dashboardClockTimer = null;

function initDashboardRealTimeClock() {
    if (_dashboardClockTimer) {
        clearInterval(_dashboardClockTimer);
        _dashboardClockTimer = null;
    }

    function updateClockAndSky() {
        var timeEl = document.getElementById('liveRegionalTime');
        var dateEl = document.getElementById('liveRegionalDate');
        var pillEl = document.getElementById('livePeriodPill');
        var tzEl = document.getElementById('liveRegionalTZ');
        var skyDay = document.getElementById('skyLayerDay');
        var skySunset = document.getElementById('skyLayerSunset');
        var skyNight = document.getElementById('skyLayerNight');
        var sunGroup = document.getElementById('heroRealtimeSun');
        var moonGroup = document.getElementById('heroRealtimeMoon');
        var starsGroup = document.getElementById('heroNightStars');
        var nightLightsGroup = document.getElementById('heroNightLights');

        // If dashboard is no longer visible, stop the interval
        if (!timeEl && !skyDay) {
            if (_dashboardClockTimer) {
                clearInterval(_dashboardClockTimer);
                _dashboardClockTimer = null;
            }
            return;
        }

        var now = new Date();
        var L = (typeof APP !== 'undefined' && APP.language) ? APP.language : 'bn';
        var locale = L === 'en' ? 'en-US' : 'bn-BD';

        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var decimalHour = hours + (minutes / 60) + (seconds / 3600);

        // 1. Regional Time & Date
        var timeStr = now.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        var dateStr = now.toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        var cityName = 'Dhaka';
        try {
            var rawTz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            if (rawTz.includes('/')) {
                cityName = rawTz.split('/').pop().replace(/_/g, ' ');
            } else if (rawTz) {
                cityName = rawTz.replace(/_/g, ' ');
            }
        } catch(e) {
            cityName = 'Dhaka';
        }

        var cityDisplay = (L === 'bn' && cityName === 'Dhaka') ? 'ঢাকা' : cityName;

        // Dynamic Seasonal Solar Cycle for Dhaka / Regional Latitude (~23.8° N)
        // Accurate sunset & sunrise times for every month of the year
        var m = now.getMonth();
        var nextM = (m + 1) % 12;
        var dayFrac = now.getDate() / 31;
        var monthlySunset = [17.50, 17.85, 18.15, 18.38, 18.65, 18.82, 18.78, 18.45, 17.92, 17.48, 17.18, 17.20];
        var monthlySunrise = [6.72, 6.55, 6.18, 5.70, 5.28, 5.18, 5.32, 5.55, 5.75, 5.95, 6.25, 6.58];

        var sunsetHour = monthlySunset[m] + (monthlySunset[nextM] - monthlySunset[m]) * dayFrac;
        var sunriseHour = monthlySunrise[m] + (monthlySunrise[nextM] - monthlySunrise[m]) * dayFrac;

        // Dynamic Period Classification
        // ভোর (Dawn): 5:00 AM to sunrise + 15m
        // সকাল (Morning): sunrise + 15m to 11:30 AM
        // দুপুর (Noon): 11:30 AM to 3:30 PM
        // বিকেল (Afternoon): 3:30 PM to Sunset / Maghrib (e.g. 5:11 PM in Nov, 6:49 PM in Jun)
        // সন্ধ্যা (Evening / Dusk / Maghrib): Sunset to Sunset + 2 hours (e.g. 5:11 PM to 7:11 PM in winter)
        // রাত্রি (Night): Sunset + 2 hours to 5:00 AM
        var dawnEnd = sunriseHour + 0.25;
        var duskEnd = sunsetHour + 2.0;

        var periodLabel = '';
        var periodIcon = '☀️';
        if (decimalHour >= 5.0 && decimalHour < dawnEnd) {
            periodLabel = L === 'en' ? 'Dawn' : 'ভোর';
            periodIcon = '🌅';
        } else if (decimalHour >= dawnEnd && decimalHour < 11.5) {
            periodLabel = L === 'en' ? 'Morning' : 'সকাল';
            periodIcon = '☀️';
        } else if (decimalHour >= 11.5 && decimalHour < 15.5) {
            periodLabel = L === 'en' ? 'Noon' : 'দুপুর';
            periodIcon = '🌤️';
        } else if (decimalHour >= 15.5 && decimalHour < sunsetHour) {
            periodLabel = L === 'en' ? 'Afternoon' : 'বিকেল';
            periodIcon = '🌇';
        } else if (decimalHour >= sunsetHour && decimalHour < duskEnd) {
            periodLabel = L === 'en' ? 'Evening' : 'সন্ধ্যা';
            periodIcon = '🌆';
        } else {
            periodLabel = L === 'en' ? 'Night' : 'রাত্রি';
            periodIcon = '🌙';
        }

        if (timeEl) timeEl.textContent = timeStr;
        if (dateEl) dateEl.textContent = dateStr;
        if (pillEl) pillEl.innerHTML = `${periodIcon} ${periodLabel}`;
        if (tzEl) tzEl.textContent = '📍 ' + cityDisplay;

        // 2. Real-Time Sky Layers Opacity (Driven by seasonal sunsetHour & sunriseHour)
        var dayOpacity = 0;
        var sunsetOpacity = 0;
        var nightOpacity = 0;
        var starsOpacity = 0;
        var nightLightsOpacity = 0;

        var sunsetStart = sunsetHour - 0.4; // Sunset colors start ~25 mins before sunset
        var twilightEnd = sunsetHour + 1.2; // Twilight ends and night settles in

        if (decimalHour >= dawnEnd && decimalHour < sunsetStart) {
            // Full Daytime
            dayOpacity = 1;
            sunsetOpacity = 0;
            nightOpacity = 0;
            starsOpacity = 0;
            nightLightsOpacity = 0;
        } else if (decimalHour >= sunsetStart && decimalHour < twilightEnd) {
            // Sunset & Maghrib transition
            var p = (decimalHour - sunsetStart) / (twilightEnd - sunsetStart);
            dayOpacity = Math.max(0, 1 - p * 1.5);
            sunsetOpacity = Math.sin(p * Math.PI);
            nightOpacity = Math.min(1, Math.max(0, (p - 0.3) / 0.7));
            starsOpacity = Math.max(0, (p - 0.4) / 0.6);
            nightLightsOpacity = Math.max(0, (p - 0.15) / 0.85);
        } else if (decimalHour >= twilightEnd || decimalHour < 4.8) {
            // Full Deep Night
            dayOpacity = 0;
            sunsetOpacity = 0;
            nightOpacity = 1;
            starsOpacity = 1;
            nightLightsOpacity = 1;
        } else if (decimalHour >= 4.8 && decimalHour < dawnEnd) {
            // Dawn / Sunrise
            var p = (decimalHour - 4.8) / (dawnEnd - 4.8);
            nightOpacity = Math.max(0, 1 - p * 1.3);
            sunsetOpacity = Math.sin(p * Math.PI) * 0.9;
            dayOpacity = Math.min(1, Math.max(0, (p - 0.3) / 0.7));
            starsOpacity = Math.max(0, 1 - p * 2);
            nightLightsOpacity = Math.max(0, 1 - p * 1.8);
        }

        if (skyDay) skyDay.style.opacity = dayOpacity.toFixed(3);
        if (skySunset) skySunset.style.opacity = sunsetOpacity.toFixed(3);
        if (skyNight) skyNight.style.opacity = nightOpacity.toFixed(3);
        if (starsGroup) starsGroup.style.opacity = starsOpacity.toFixed(3);
        if (nightLightsGroup) nightLightsGroup.style.opacity = nightLightsOpacity.toFixed(3);

        // 3. Sun Real-Time Path (Rises at sunriseHour - 0.4, sets at sunsetHour + 0.3)
        if (sunGroup) {
            var sunStart = sunriseHour - 0.4;
            var sunEnd = sunsetHour + 0.3;
            var sunTotal = sunEnd - sunStart;
            if (decimalHour >= sunStart && decimalHour <= sunEnd) {
                var pSun = (decimalHour - sunStart) / sunTotal;
                var xSun = 80 + pSun * 1040;
                var ySun = 16 + 56 * Math.pow(2 * pSun - 1, 2);
                sunGroup.setAttribute('transform', `translate(${xSun.toFixed(1)}, ${ySun.toFixed(1)})`);
                var sunOpacity = 1;
                if (pSun < 0.08) sunOpacity = pSun / 0.08;
                else if (pSun > 0.92) sunOpacity = (1 - pSun) / 0.08;
                sunGroup.style.opacity = sunOpacity.toFixed(3);
            } else {
                sunGroup.style.opacity = '0';
                sunGroup.setAttribute('transform', 'translate(600, 120)');
            }
        }

        // 4. Moon Real-Time Path (Rises around sunsetHour - 0.3, sets at sunriseHour + 0.4)
        if (moonGroup) {
            var moonStart = sunsetHour - 0.3;
            var moonEnd = sunriseHour + 0.4;
            var isMoonTime = (decimalHour >= moonStart || decimalHour <= moonEnd);
            if (isMoonTime) {
                var moonTotal = (24 - moonStart) + moonEnd;
                var moonElapsed = decimalHour >= moonStart ? (decimalHour - moonStart) : (24 - moonStart + decimalHour);
                var pMoon = Math.min(1, Math.max(0, moonElapsed / moonTotal));
                var xMoon = 80 + pMoon * 1040;
                var yMoon = 18 + 52 * Math.pow(2 * pMoon - 1, 2);
                moonGroup.setAttribute('transform', `translate(${xMoon.toFixed(1)}, ${yMoon.toFixed(1)})`);
                var moonOpacity = 1;
                if (pMoon < 0.08) moonOpacity = pMoon / 0.08;
                else if (pMoon > 0.92) moonOpacity = (1 - pMoon) / 0.08;
                moonGroup.style.opacity = moonOpacity.toFixed(3);
            } else {
                moonGroup.style.opacity = '0';
                moonGroup.setAttribute('transform', 'translate(600, 120)');
            }
        }
    }

    updateClockAndSky();
    _dashboardClockTimer = setInterval(updateClockAndSky, 1000);

    if (!window._clockVisibilityListenerAttached) {
        window._clockVisibilityListenerAttached = true;
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden && typeof updateClockAndSky === 'function') {
                updateClockAndSky();
            }
        });
    }
}

// ============================================================
// ✅ CHART.JS ড্যাশবোর্ড চার্ট ইনিশিয়ালাইজেশন
// ============================================================
function initDashboardCharts(meterId, transactions, summary, monthExpense) {
    if (typeof Chart === 'undefined') return;

    if (window._dashExpenseChart) {
        window._dashExpenseChart.destroy();
        window._dashExpenseChart = null;
    }
    if (window._dashCategoryChart) {
        window._dashCategoryChart.destroy();
        window._dashCategoryChart = null;
    }

    // 1. Line Chart: খরচ সারাংশ
    var expenseCanvas = document.getElementById('dashboardExpenseChart');
    if (expenseCanvas) {
        var billTx = (transactions || []).filter(function(t) {
            return t.type === 'bill' || t.type === 'electricity_bill';
        });

        var labels = [];
        var dataPoints = [];
        var isEn = (localStorage.getItem('language') === 'en');
        var monthNamesBn = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নবে', 'ডিসে'];
        var monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var monthNames = isEn ? monthNamesEn : monthNamesBn;

        function toBnDigits(num) {
            var bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            return String(num).replace(/\d/g, function(d) { return bnDigits[d]; });
        }

        // Aggregate real daily expenses (YYYY-MM-DD)
        var dailyExpenseMap = {};
        billTx.forEach(function(t) {
            var d = new Date(t.date || t.timestamp);
            if (!isNaN(d.getTime())) {
                var y = d.getFullYear();
                var m = String(d.getMonth() + 1).padStart(2, '0');
                var day = String(d.getDate()).padStart(2, '0');
                var key = y + '-' + m + '-' + day;
                dailyExpenseMap[key] = (dailyExpenseMap[key] || 0) + (Number(t.amount) || 0);
            }
        });

        // Determine reference date (today, or newest transaction if in past/future)
        var refDate = new Date();
        if (billTx.length > 0) {
            var latestTxDate = null;
            billTx.forEach(function(t) {
                var d = new Date(t.date || t.timestamp);
                if (!isNaN(d.getTime())) {
                    if (!latestTxDate || d > latestTxDate) {
                        latestTxDate = d;
                    }
                }
            });
            if (latestTxDate) {
                var diffDays = (refDate.getTime() - latestTxDate.getTime()) / (1000 * 3600 * 24);
                if (diffDays > 7 || latestTxDate > refDate) {
                    refDate = new Date(latestTxDate);
                }
            }
        }

        // Rolling last 7 days ending at refDate
        for (var i = 6; i >= 0; i--) {
            var dayDate = new Date(refDate);
            dayDate.setDate(refDate.getDate() - i);
            var y = dayDate.getFullYear();
            var m = String(dayDate.getMonth() + 1).padStart(2, '0');
            var day = String(dayDate.getDate()).padStart(2, '0');
            var key = y + '-' + m + '-' + day;

            var dayNum = dayDate.getDate();
            var dayStr = isEn ? String(dayNum) : toBnDigits(dayNum);
            var monthStr = monthNames[dayDate.getMonth()];
            labels.push(dayStr + ' ' + monthStr);
            var dayAmount = dailyExpenseMap[key] || 0;
            dataPoints.push(Math.round(dayAmount * 100) / 100);
        }

        var ctx = expenseCanvas.getContext('2d');
        var gradient = ctx.createLinearGradient(0, 0, 0, 180);
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0.22)');
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0.0)');

        window._dashExpenseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'খরচ',
                    data: dataPoints,
                    borderColor: '#7c3aed',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.45,
                    borderWidth: 2.5,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#7c3aed',
                    pointBorderWidth: 2,
                    pointRadius: 4.5,
                    pointHoverRadius: 6.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e1b4b',
                        titleColor: '#ffffff',
                        bodyColor: '#e0e7ff',
                        padding: 10,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(c) {
                                return '৳ ' + Number(c.raw).toFixed(2);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: "'Noto Sans Bengali', sans-serif", size: 11 }, color: '#64748b' }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(226, 232, 240, 0.6)' },
                        ticks: { font: { family: "'Noto Sans Bengali', sans-serif", size: 11 }, color: '#64748b' }
                    }
                }
            }
        });
    }

    // 2. Donut Chart: খরচের ধরন
    var catCanvas = document.getElementById('dashboardCategoryChart');
    if (catCanvas) {
        var demand = (summary && summary.totalDemand > 0) ? summary.totalDemand : 0;
        var vat = (summary && summary.totalVat > 0) ? summary.totalVat : 0;
        var rebate = (summary && summary.totalRebate > 0) ? summary.totalRebate : 0;
        var total = demand + vat + rebate;

        var catCtx = catCanvas.getContext('2d');
        var L = APP.language || 'bn';
        window._dashCategoryChart = new Chart(catCtx, {
            type: 'doughnut',
            data: {
                labels: [L === 'en' ? 'Demand Charge' : 'ডিমান্ড চার্জ', L === 'en' ? 'VAT' : 'ভ্যাট', L === 'en' ? 'Rebate' : 'রিবেট'],
                datasets: [{
                    data: [demand, vat, rebate],
                    backgroundColor: ['#6366f1', '#06b6d4', '#10b981'],
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                var val = Number(ctx.raw).toFixed(2);
                                var pct = ((ctx.raw / total) * 100).toFixed(1);
                                return ctx.label + ': ৳ ' + val + ' (' + pct + '%)';
                            }
                        }
                    }
                }
            }
        });
    }
}

// ============================================================
// ✅ রেন্ট টোটাল আপডেট
// ============================================================
function updateRentTotals() {
    if (!APP.rentData || !APP.rentData.records) return;

    var totalRent = 0;
    var totalService = 0;
    var totalParking = 0;
    var totalOverall = 0;
    var totalPaid = 0;
    var totalDue = 0;

    APP.rentData.records.forEach(function(record) {
        var rRent = parseFloat(record.rentAmount) || 0;
        var rService = parseFloat(record.serviceCharge) || 0;
        var rParking = parseFloat(record.parkingCharge) || 0;
        var rTotal = parseFloat(record.totalAmount) || (rRent + rService + rParking);

        totalRent += rRent;
        totalService += rService;
        totalParking += rParking;
        totalOverall += rTotal;

        if (record.status === 'paid' || record.status === 'পরিশোধিত') {
            totalPaid += rTotal;
        } else {
            totalDue += rTotal;
        }
    });

    APP.rentData.totalRent = totalRent;
    APP.rentData.totalService = totalService;
    APP.rentData.totalParking = totalParking;
    APP.rentData.totalOverall = totalOverall;
    APP.rentData.totalPaid = totalPaid;
    APP.rentData.totalDue = totalDue;
}

// ============================================================
// ✅ রেন্ট উইজেট ফাংশন (ড্যাশবোর্ডের জন্য)
// ============================================================
function renderRentWidget() {
    var L = APP.language || 'bn';
    
    if (!APP.rentData) {
        APP.rentData = { records: [], totalRent: 0, totalService: 0, totalParking: 0, totalOverall: 0 };
    }
    
    if (!APP.rentData.records || APP.rentData.records.length === 0) {
        return '<div class="rent-widget" style="background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; color: #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">' +
            '<div style="display: flex; align-items: center; gap: 12px;">' +
            '<div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">🏠</div>' +
            '<div><div style="font-size: 12px; opacity: 0.7; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">' + (L === 'en' ? 'House Rent & Service Charge' : 'ভাড়া ও সার্ভিস চার্জ') + '</div>' +
            '<div style="font-size: 14px; opacity: 0.6;">' + (L === 'en' ? 'No records yet' : 'এখনও কোনো রেকর্ড নেই') + '</div></div></div>' +
            '<button onclick="showRentForm()" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; padding: 10px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">' +
            '<i class="fas fa-plus"></i> ' + (L === 'en' ? 'Add Rent' : 'ভাড়া যোগ করুন') +
            '</button></div></div>';
    }

    if (typeof updateRentTotals === 'function') {
        updateRentTotals();
    }
    
    var totalOverall = APP.rentData.totalOverall || 0;
    var recordCount = APP.rentData.records ? APP.rentData.records.length : 0;

    var meterGroups = {};
    if (APP.rentData.records) {
        APP.rentData.records.forEach(function(record) {
            var meterId = record.meterId || 'unknown';
            if (!meterGroups[meterId]) {
                meterGroups[meterId] = {
                    meterName: record.meterName || 'Unknown',
                    totalOverall: 0,
                    count: 0
                };
            }
            meterGroups[meterId].totalOverall += record.totalAmount || 0;
            meterGroups[meterId].count++;
        });
    }

    var meterKeys = Object.keys(meterGroups);
    var colors = ['#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#fb923c'];

    var html = '<div class="rent-widget" style="background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; color: #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06);">';
    
    html += '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">';
    html += '<div style="display: flex; align-items: center; gap: 12px;">';
    html += '<div style="width: 44px; height: 44px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">🏠</div>';
    html += '<div><div style="font-size: 11px; opacity: 0.6; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">' + (L === 'en' ? 'Rent & Service Summary' : 'ভাড়া ও সার্ভিস সারাংশ') + '</div>';
    html += '<div style="font-size: 16px; font-weight: 700;">' + (L === 'en' ? 'Total' : 'মোট') + ': <span style="color: #fbbf24;">৳ ' + totalOverall.toFixed(0) + '</span> (' + recordCount + ' ' + (L === 'en' ? 'records' : 'টি') + ')</div></div></div>';
    html += '<div style="display: flex; gap: 8px;">';
    html += '<button onclick="showRentForm()" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; padding: 8px 16px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-size: 12px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">';
    html += '<i class="fas fa-plus"></i> ' + (L === 'en' ? 'Add' : 'যোগ') + '</button>';
    html += '<button onclick="showRentReport()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 8px 16px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-size: 12px; backdrop-filter: blur(4px);">';
    html += '<i class="fas fa-list"></i> ' + (L === 'en' ? 'History' : 'ইতিহাস') + '</button>';
    html += '</div></div>';

    if (meterKeys.length > 0) {
        html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px;">';
        
        meterKeys.forEach(function(meterId, index) {
            var group = meterGroups[meterId];
            var colorIdx = index % colors.length;
            var bgColor = colors[colorIdx];
            
            html += '<div style="background: rgba(255,255,255,0.06); border-radius: 10px; padding: 10px 14px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.06);">';
            html += '<div style="display: flex; justify-content: space-between; align-items: center;">';
            html += '<div style="font-size: 11px; font-weight: 600; color: ' + bgColor + ';">' + (group.meterName || 'Unknown') + '</div>';
            html += '<span style="font-size: 9px; opacity: 0.4;">' + group.count + 'x</span>';
            html += '</div>';
            html += '<div style="font-size: 18px; font-weight: 700; color: #fff;">৳ ' + group.totalOverall.toFixed(0) + '</div>';
            html += '</div>';
        });

        html += '</div>';
    }

    html += '</div>';
    return html;
}

// Interactive Electric Shock Animation for Donut Center Value
window.triggerElectricShock = function(container) {
    if (!container) return;
    container.classList.remove('electric-shock');
    // Force DOM reflow
    void container.offsetWidth;
    container.classList.add('electric-shock');

    // Create 6-8 flying lightning spark particles
    var sparkCount = 7;
    for (var i = 0; i < sparkCount; i++) {
        var spark = document.createElement('span');
        spark.className = 'electric-particle';
        spark.innerHTML = '⚡';
        var baseAngle = (i * (360 / sparkCount));
        var angle = baseAngle + (Math.random() * 24 - 12);
        var dist = 48 + Math.random() * 26;
        var rad = angle * (Math.PI / 180);
        var tx = Math.cos(rad) * dist;
        var ty = Math.sin(rad) * dist;
        spark.style.setProperty('--tx', tx.toFixed(1) + 'px');
        spark.style.setProperty('--ty', ty.toFixed(1) + 'px');
        container.appendChild(spark);
        (function(el) {
            setTimeout(function() {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            }, 680);
        })(spark);
    }

    // Optional subtle haptic feedback if supported on mobile
    if (window.navigator && window.navigator.vibrate) {
        try { window.navigator.vibrate([30, 20, 40]); } catch (e) {}
    }
};
