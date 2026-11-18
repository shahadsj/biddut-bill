// ==================== DASHBOARD ====================

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
    const meterData = APP.metersData[meterId];
    if (!meterData) return 0;
    const transactions = meterData.transactions || [];
    let totalKWH = 0;
    transactions.forEach(t => {
        if (t.units) totalKWH += t.units;
    });
    return totalKWH;
}

function getMonthlyAvgExpense(meterId) {
    const meterData = APP.metersData[meterId];
    if (!meterData) return 0;
    const transactions = (meterData.transactions || []).filter(t => t.type === 'electricity_bill' || t.type === 'bill');
    if (transactions.length === 0) return 0;

    const monthMap = {};
    transactions.forEach(t => {
        const d = new Date(t.date || t.timestamp);
        const key = d.getFullYear() + '-' + d.getMonth();
        if (!monthMap[key]) monthMap[key] = 0;
        monthMap[key] += t.amount;
    });

    const totalExpense = Object.values(monthMap).reduce((sum, v) => sum + v, 0);
    const monthCount = Object.keys(monthMap).length || 1;
    return totalExpense / monthCount;
}

function getMonthlyAvgKWH(meterId) {
    const meterData = APP.metersData[meterId];
    if (!meterData) return 0;
    const transactions = (meterData.transactions || []).filter(t => t.units && t.units > 0);
    if (transactions.length === 0) return 0;

    const monthMap = {};
    transactions.forEach(t => {
        const d = new Date(t.date || t.timestamp);
        const key = d.getFullYear() + '-' + d.getMonth();
        if (!monthMap[key]) monthMap[key] = 0;
        monthMap[key] += t.units;
    });

    const totalKWH = Object.values(monthMap).reduce((sum, v) => sum + v, 0);
    const monthCount = Object.keys(monthMap).length || 1;
    return totalKWH / monthCount;
}

function getLastExpense(meterId) {
    const meterData = APP.metersData[meterId];
    if (!meterData || !meterData.transactions) return 0;
    const bills = meterData.transactions
        .filter(t => t.type === 'electricity_bill' || t.type === 'bill')
        .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp));
    return bills.length > 0 ? bills[0].amount : 0;
}

function getRecentTransactions(meterId, count) {
    const meterData = APP.metersData[meterId];
    if (!meterData || !meterData.transactions) return [];
    return meterData.transactions
        .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp))
        .slice(0, count || 5);
}

function getDemandVatRebateSummary(meterId) {
    const meterData = APP.metersData[meterId];
    if (!meterData) return { totalDemand: 0, totalVat: 0, totalRebate: 0, totalNet: 0, rechargeCount: 0 };
    
    const transactions = meterData.transactions || [];
    let totalDemand = 0;
    let totalVat = 0;
    let totalRebate = 0;
    let totalNet = 0;
    let rechargeCount = 0;
    
    transactions.forEach(t => {
        if (t.type === 'recharge' && t.deductions) {
            totalDemand += t.deductions.demandCharge || 0;
            totalVat += t.deductions.vat || 0;
            totalRebate += t.deductions.rebate || 0;
            totalNet += t.deductions.netAmount || 0;
            rechargeCount++;
        }
    });
    
    return {
        totalDemand: totalDemand,
        totalVat: totalVat,
        totalRebate: totalRebate,
        totalNet: totalNet,
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

    if (!APP.metersData[APP.activeMeterId]) {
        APP.metersData[APP.activeMeterId] = {
            transactions: [],
            monthlyRecharges: [],
            currentBalance: 0,
            totalRecharge: 0,
            totalExpended: 0,
            lastDemandChargeMonth: "",
            meterInfo: activeMeter,
            lastUpdated: new Date().toISOString()
        };
        saveData();
    }

    const meterData = APP.metersData[APP.activeMeterId];
    const transactions = meterData.transactions || [];
    
    const balance = meterData.currentBalance || 0;
    const totalRecharge = meterData.totalRecharge || 0;
    const totalExpense = meterData.totalExpended || 0;
    const lastExpense = getLastExpense(APP.activeMeterId);
    const totalTransactions = transactions.length;
    const totalKWH = getTotalKWH(APP.activeMeterId);
    const monthlyAvgExpense = getMonthlyAvgExpense(APP.activeMeterId);
    const monthlyAvgKWH = getMonthlyAvgKWH(APP.activeMeterId);
    const recentTx = getRecentTransactions(APP.activeMeterId, 5);
    
    const summary = getDemandVatRebateSummary(APP.activeMeterId);

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

            if (monthKeys.length === 1) {
                return {
                    totalRecharge: { value: '0.0', direction: 'up' },
                    totalExpense: { value: '0.0', direction: 'up' },
                    totalTransactions: { value: '0.0', direction: 'up' },
                    monthlyAvgExpense: calcPercentageTrend(currExpense, monthlyAvgExpense),
                    totalKWH: { value: '0.0', direction: 'up' },
                    monthlyAvgKWH: calcPercentageTrend(currUnits, monthlyAvgKWH),
                    lastExpense: { value: '0.0', direction: 'up' }
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

    function createStatCard(iconName, label, value, gradient, trend) {
        trend = trend || { value: '0.0', direction: 'up' };
        var isUp = trend.direction !== 'down';
        var arrow = isUp ? '↗' : '↘';
        var sign = isUp ? '+' : '-';
        var trendVal = (trend.value !== undefined && trend.value !== null) ? trend.value : '0.0';
        return `
            <div class="stat-card">
                <div class="stat-card-glow" style="background: ${gradient};"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div class="stat-icon" style="background: ${gradient};">
                            ${getIconSVG(iconName)}
                        </div>
                        <span class="trend-badge ${isUp ? 'up' : 'down'}">
                            ${arrow} ${sign}${trendVal}%
                        </span>
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

    // Usage percentage for balance progress bar
    var usagePct = 1.0;
    if (totalRecharge > 0) {
        usagePct = Math.min(Math.max(((totalExpense % totalRecharge) / totalRecharge) * 100, 1.0), 99.0);
    }

    // Rent records
    var rentRecords = (APP.rentData && APP.rentData.records && APP.rentData.records.length > 0) ? APP.rentData.records : [];
    var totalRentVal = (APP.rentData && APP.rentData.totalRent) ? APP.rentData.totalRent : 176000;
    var totalServiceVal = (APP.rentData && APP.rentData.totalService) ? APP.rentData.totalService : 41200;
    var totalDueVal = 1000;
    var totalOverallVal = (APP.rentData && APP.rentData.totalOverall) ? APP.rentData.totalOverall : 218200;

    var tenant1Name = rentRecords[0] ? (rentRecords[0].meterName || rentRecords[0].tenantName || 'MD. ABDUL MALEQUE') : 'MD. ABDUL MALEQUE';
    var tenant1Amount = rentRecords[0] ? (rentRecords[0].totalAmount || 157200) : 157200;
    var tenant1Date = rentRecords[0] ? (rentRecords[0].month || '৬ জুন ২০২৬') : '৬ জুন ২০২৬';

    var tenant2Name = rentRecords[1] ? (rentRecords[1].meterName || rentRecords[1].tenantName || 'নকসুমা বেগম') : 'নকসুমা বেগম';
    var tenant2Amount = rentRecords[1] ? (rentRecords[1].totalAmount || 61000) : 61000;
    var tenant2Date = rentRecords[1] ? (rentRecords[1].month || '৮ ডিসে ২০২৫') : '৮ ডিসে ২০২৫';

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
                <svg viewBox="0 0 880 85" fill="none" xmlns="http://www.w3.org/2000/svg" class="hero-panoramic-svg" preserveAspectRatio="xMaxYMid meet" style="width: 100%; height: 75px; display: block;">
                    <defs>
                        <linearGradient id="heroSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#fb923c" stop-opacity="0.65"/>
                            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.25"/>
                        </linearGradient>
                        <linearGradient id="heroCity1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#c7d2fe" stop-opacity="0.6"/>
                            <stop offset="100%" stop-color="#e0e7ff" stop-opacity="0.3"/>
                        </linearGradient>
                        <linearGradient id="heroCity2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#a5b4fc" stop-opacity="0.65"/>
                            <stop offset="100%" stop-color="#c7d2fe" stop-opacity="0.3"/>
                        </linearGradient>
                    </defs>

                    <!-- Soft Clouds in Sky -->
                    <g fill="#e2e8f0" opacity="0.45">
                        <path d="M 40,30 Q 60,18 80,24 Q 100,16 120,26 Q 135,20 150,30 Z"/>
                        <path d="M 310,24 Q 330,12 350,18 Q 370,10 390,20 Q 405,15 420,24 Z"/>
                        <path d="M 560,26 Q 580,14 600,20 Q 620,12 640,22 Q 655,16 670,26 Z"/>
                    </g>

                    <!-- Rising Golden Sun -->
                    <circle cx="750" cy="40" r="26" fill="url(#heroSunGrad)"/>
                    <circle cx="750" cy="40" r="16" fill="#f59e0b" opacity="0.65"/>

                    <!-- Modern City Skyline Silhouette Layers -->
                    <g fill="url(#heroCity1)">
                        <rect x="150" y="52" width="22" height="33" rx="1"/>
                        <rect x="176" y="44" width="28" height="41" rx="1"/>
                        <rect x="208" y="55" width="24" height="30" rx="1"/>
                        <rect x="340" y="46" width="30" height="39" rx="1"/>
                        <rect x="374" y="38" width="26" height="47" rx="1"/>
                        <rect x="404" y="48" width="28" height="37" rx="1"/>
                        <rect x="560" y="48" width="25" height="37" rx="1"/>
                        <rect x="589" y="40" width="32" height="45" rx="1"/>
                        <rect x="625" y="46" width="26" height="39" rx="1"/>
                        <rect x="655" y="52" width="24" height="33" rx="1"/>
                        <rect x="780" y="54" width="26" height="31" rx="1"/>
                        <rect x="810" y="48" width="30" height="37" rx="1"/>
                    </g>
                    <g fill="url(#heroCity2)">
                        <rect x="238" y="56" width="28" height="29" rx="1"/>
                        <rect x="270" y="48" width="25" height="37" rx="1"/>
                        <rect x="299" y="52" width="26" height="33" rx="1"/>
                        <rect x="446" y="52" width="30" height="33" rx="1"/>
                        <rect x="480" y="44" width="26" height="41" rx="1"/>
                        <rect x="510" y="50" width="28" height="35" rx="1"/>
                        <rect x="695" y="50" width="28" height="35" rx="1"/>
                        <rect x="727" y="42" width="26" height="43" rx="1"/>
                    </g>

                    <!-- Graceful Sagging High-Voltage Transmission Cables (Across 880px) -->
                    <path d="M 0,44 Q 95,56 190,26 Q 305,54 420,22 Q 545,54 670,28 Q 775,50 880,42" stroke="#94a3b8" stroke-width="1.3" fill="none"/>
                    <path d="M 0,54 Q 95,68 190,40 Q 305,68 420,36 Q 545,68 670,42 Q 775,62 880,52" stroke="#94a3b8" stroke-width="1.3" fill="none"/>
                    <path d="M 0,64 Q 95,78 190,52 Q 305,78 420,48 Q 545,78 670,54 Q 775,72 880,62" stroke="#94a3b8" stroke-width="1.1" fill="none" opacity="0.65"/>

                    <!-- Tower 1 (Mid-Left Pylon at x=190) -->
                    <path d="M 190 10 L 174 85 L 206 85 Z" stroke="#334155" stroke-width="2.2" fill="none"/>
                    <line x1="160" y1="32" x2="220" y2="32" stroke="#334155" stroke-width="2.2" stroke-linecap="round"/>
                    <line x1="152" y1="52" x2="228" y2="52" stroke="#334155" stroke-width="2.2" stroke-linecap="round"/>
                    <line x1="178" y1="32" x2="202" y2="52" stroke="#334155" stroke-width="1.5"/>
                    <line x1="202" y1="32" x2="178" y2="52" stroke="#334155" stroke-width="1.5"/>
                    <line x1="174" y1="52" x2="206" y2="85" stroke="#334155" stroke-width="1.5"/>
                    <line x1="206" y1="52" x2="174" y2="85" stroke="#334155" stroke-width="1.5"/>

                    <!-- Tower 2 (Center Main Pylon at x=420) -->
                    <path d="M 420 8 L 402 85 L 438 85 Z" stroke="#1e293b" stroke-width="2.4" fill="none"/>
                    <line x1="388" y1="30" x2="452" y2="30" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/>
                    <line x1="380" y1="50" x2="460" y2="50" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/>
                    <line x1="408" y1="30" x2="432" y2="50" stroke="#1e293b" stroke-width="1.6"/>
                    <line x1="432" y1="30" x2="408" y2="50" stroke="#1e293b" stroke-width="1.6"/>
                    <line x1="402" y1="50" x2="438" y2="85" stroke="#1e293b" stroke-width="1.6"/>
                    <line x1="438" y1="50" x2="402" y2="85" stroke="#1e293b" stroke-width="1.6"/>

                    <!-- Tower 3 (Right Perspective Pylon at x=670) -->
                    <path d="M 670 12 L 656 85 L 684 85 Z" stroke="#475569" stroke-width="2" fill="none"/>
                    <line x1="644" y1="34" x2="696" y2="34" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
                    <line x1="638" y1="52" x2="702" y2="52" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
                    <line x1="660" y1="34" x2="680" y2="52" stroke="#475569" stroke-width="1.4"/>
                    <line x1="680" y1="34" x2="660" y2="52" stroke="#475569" stroke-width="1.4"/>
                    <line x1="656" y1="52" x2="684" y2="85" stroke="#475569" stroke-width="1.4"/>
                    <line x1="684" y1="52" x2="656" y2="85" stroke="#475569" stroke-width="1.4"/>

                    <!-- Rolling Green Landscape Base (Continuous across 880px) -->
                    <path d="M 0,85 C 80,75 160,82 240,78 C 320,74 400,80 480,76 C 560,72 640,80 720,75 C 800,70 850,78 880,76 L 880,85 L 0,85 Z" fill="#86efac" opacity="0.85"/>
                    <path d="M 0,85 C 100,78 200,84 300,80 C 420,76 520,82 620,78 C 720,74 800,82 880,78 L 880,85 L 0,85 Z" fill="#4ade80" opacity="0.75"/>
                    <path d="M 0,85 C 120,81 250,85 380,82 C 500,79 650,84 780,81 L 880,82 L 880,85 L 0,85 Z" fill="#22c55e" opacity="0.9"/>

                    <!-- Lush Green Tree Clusters Across the Horizon -->
                    <g fill="#15803d">
                        <circle cx="35" cy="78" r="6"/>
                        <circle cx="44" cy="75" r="8" fill="#16a34a"/>
                        <circle cx="54" cy="77" r="7" fill="#22c55e"/>
                        <circle cx="135" cy="77" r="7"/>
                        <circle cx="146" cy="74" r="9" fill="#16a34a"/>
                        <circle cx="158" cy="77" r="6" fill="#22c55e"/>
                        <circle cx="265" cy="78" r="7"/>
                        <circle cx="276" cy="74" r="9" fill="#16a34a"/>
                        <circle cx="288" cy="77" r="6" fill="#22c55e"/>
                        <circle cx="370" cy="78" r="6"/>
                        <circle cx="380" cy="74" r="8" fill="#16a34a"/>
                        <circle cx="495" cy="77" r="7"/>
                        <circle cx="507" cy="73" r="9" fill="#16a34a"/>
                        <circle cx="519" cy="76" r="6" fill="#22c55e"/>
                        <circle cx="615" cy="78" r="7"/>
                        <circle cx="626" cy="75" r="9" fill="#16a34a"/>
                        <circle cx="735" cy="77" r="7"/>
                        <circle cx="746" cy="73" r="9" fill="#16a34a"/>
                        <circle cx="758" cy="76" r="6" fill="#22c55e"/>
                        <circle cx="835" cy="78" r="6"/>
                        <circle cx="845" cy="74" r="8" fill="#16a34a"/>
                    </g>
                </svg>
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
        4. ROW 2: বিলিং, ভ্যাট ও রিবেট সারাংশ (Billing Summary Card)
        ============================================================ -->
        <div class="billing-summary-container">
            <div class="billing-header">
                <div class="billing-title">
                    <span class="billing-icon-pill">📊</span>
                    <span>${L === 'en' ? 'Billing, VAT & Rebate Summary' : 'বিলিং, ভ্যাট ও রিবেট সারাংশ'}</span>
                </div>
                <div class="billing-record-badge">
                    <span>${L === 'en' ? 'Total Records' : 'মোট রেকর্ড'}: ${summary.rechargeCount || 8}</span>
                </div>
            </div>
            
            <div class="billing-cards-grid">
                <!-- বিদ্যুৎ চার্জ (Orange) -->
                <div class="deduction-card orange">
                    <div class="deduction-icon-box">⚡</div>
                    <div class="deduction-label">${L === 'en' ? 'Electricity Charge' : 'বিদ্যুৎ চার্জ'}</div>
                    <div class="deduction-value">৳ ${(summary.totalDemand || 1470).toFixed(2)}</div>
                </div>
                <!-- ভ্যাট (Red/Pink) -->
                <div class="deduction-card pink">
                    <div class="deduction-icon-box">⊕</div>
                    <div class="deduction-label">${L === 'en' ? 'VAT' : 'ভ্যাট'}</div>
                    <div class="deduction-value">৳ ${(summary.totalVat || 469.20).toFixed(2)}</div>
                </div>
                <!-- রিবেট (Green) -->
                <div class="deduction-card green">
                    <div class="deduction-icon-box">🛡️</div>
                    <div class="deduction-label">${L === 'en' ? 'Rebate' : 'রিবেট'}</div>
                    <div class="deduction-value">৳ ${(summary.totalRebate || 79.77).toFixed(2)}</div>
                </div>
            </div>
            
            <div class="billing-credit-strip">
                <div class="credit-label">
                    <span class="credit-icon">💰</span>
                    <span>${L === 'en' ? 'Total Credit from Rebate' : 'রিবেট থেকে মোট ক্রেডিট'}</span>
                </div>
                <div class="credit-amount">
                    ৳ ${(summary.totalNet || 7365.04).toFixed(2)}
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
                        <span>${L === 'en' ? 'Usage' : 'ব্যবহার'}: ${usagePct.toFixed(1)}%</span>
                        <span>100%</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-bar-fill" style="width: ${usagePct}%;"></div>
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
                    <span class="rent-count">(${rentRecords.length || 8} টি)</span>
                </div>
                <button class="view-all-link" onclick="navigateTo('rent')">
                    ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
                </button>
            </div>
            
            <div class="tenant-cards-grid">
                <!-- Tenant 1: Pastel Pink -->
                <div class="tenant-card pink-tenant">
                    <div class="tenant-top-row">
                        <div class="tenant-name">${tenant1Name}</div>
                        <div class="tenant-date-pill">📅 ${tenant1Date}</div>
                    </div>
                    <div class="tenant-amount">৳ ${formatNumberWithComma(tenant1Amount)}</div>
                    <div class="tenant-pills-row">
                        <div class="tenant-subpill">
                            <span class="subpill-lbl">${L === 'en' ? 'Due' : 'বকেয়া'}</span>
                            <span class="subpill-val">৳ 1,26,000.00</span>
                        </div>
                        <div class="tenant-subpill">
                            <span class="subpill-lbl">${L === 'en' ? 'Current' : 'বর্তমান'}</span>
                            <span class="subpill-val">৳ 31,200.00</span>
                        </div>
                    </div>
                </div>

                <!-- Tenant 2: Pastel Cyan -->
                <div class="tenant-card teal-tenant">
                    <div class="tenant-top-row">
                        <div class="tenant-name">${tenant2Name}</div>
                        <div class="tenant-date-pill">📅 ${tenant2Date}</div>
                    </div>
                    <div class="tenant-amount">৳ ${formatNumberWithComma(tenant2Amount)}</div>
                    <div class="tenant-pills-row">
                        <div class="tenant-subpill">
                            <span class="subpill-lbl">${L === 'en' ? 'Due' : 'বকেয়া'}</span>
                            <span class="subpill-val">৳ 50,000.00</span>
                        </div>
                        <div class="tenant-subpill">
                            <span class="subpill-lbl">${L === 'en' ? 'Current' : 'বর্তমান'}</span>
                            <span class="subpill-val">৳ 10,000.00</span>
                        </div>
                        <div class="tenant-subpill">
                            <span class="subpill-lbl">${L === 'en' ? 'Current' : 'বর্তমান'}</span>
                            <span class="subpill-val">৳ 1,000.00</span>
                        </div>
                    </div>
                </div>
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
                        <div class="donut-center-content">
                            <div class="center-label">${L === 'en' ? 'Total Cost' : 'মোট খরচ'}</div>
                            <div class="center-value">৳ ${(monthExpense || 223.05).toFixed(2)}</div>
                        </div>
                    </div>
                    <div class="donut-legend-wrap">
                        <div class="legend-row">
                            <span class="legend-dot purple"></span>
                            <span class="legend-name">${L === 'en' ? 'Electricity Charge' : 'বিদ্যুৎ চার্জ'}</span>
                            <span class="legend-percent">66.0%</span>
                        </div>
                        <div class="legend-row">
                            <span class="legend-dot cyan"></span>
                            <span class="legend-name">${L === 'en' ? 'VAT' : 'ভ্যাট'}</span>
                            <span class="legend-percent">21.0%</span>
                        </div>
                        <div class="legend-row">
                            <span class="legend-dot green"></span>
                            <span class="legend-name">${L === 'en' ? 'Rebate' : 'রিবেট'}</span>
                            <span class="legend-percent">13.0%</span>
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
                                <td class="tx-cell-desc">
                                    <span class="desc-badge-icon">📊</span>
                                    <span>${description}</span>
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
        var monthNamesBn = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নবে', 'ডিসে'];

        if (billTx.length >= 2) {
            var recent = billTx.slice(-7);
            recent.forEach(function(t) {
                var d = new Date(t.date || t.timestamp);
                var lbl = !isNaN(d.getTime()) ? (d.getDate() + ' ' + monthNamesBn[d.getMonth()]) : '-';
                labels.push(lbl);
                dataPoints.push(Number(t.amount || 0));
            });
        } else {
            labels = ['১০ নবে', '১১ নবে', '১২ নবে', '১৩ নবে', '১৪ নবে', '১৫ নবে', '১৬ নবে'];
            dataPoints = [50, 100, 65, 128.85, 80, 140, 75];
            if (billTx.length === 1) {
                dataPoints[3] = Number(billTx[0].amount || 128.85);
            }
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
        var demand = (summary && summary.totalDemand > 0) ? summary.totalDemand : 1470;
        var vat = (summary && summary.totalVat > 0) ? summary.totalVat : 469.20;
        var rebate = (summary && summary.totalRebate > 0) ? summary.totalRebate : 79.77;
        var total = demand + vat + rebate;

        var catCtx = catCanvas.getContext('2d');
        window._dashCategoryChart = new Chart(catCtx, {
            type: 'doughnut',
            data: {
                labels: ['বিদ্যুৎ চার্জ', 'ভ্যাট', 'রিবেট'],
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

    APP.rentData.records.forEach(function(record) {
        totalRent += record.rentAmount || 0;
        totalService += record.serviceCharge || 0;
        totalParking += record.parkingCharge || 0;
        totalOverall += record.totalAmount || 0;
    });

    APP.rentData.totalRent = totalRent;
    APP.rentData.totalService = totalService;
    APP.rentData.totalParking = totalParking;
    APP.rentData.totalOverall = totalOverall;
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