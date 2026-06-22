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
        dollar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
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
function createRentSummaryCards(L) {
    var rent = getRentSummary();
    
    var formatNum = function(num) {
        return Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    
    if (rent.count === 0) {
        return `
        <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 12px; padding: 14px 20px; margin-bottom: 16px; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <h4 style="margin: 0; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 10px; color: #1e293b;">
                    <span style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #fff;">🏠</span>
                    ${L === 'en' ? 'Rent & Service Summary' : 'ভাড়া ও সার্ভিস সারাংশ'}
                </h4>
                <button onclick="navigateTo('rent')" style="background: #667eea; border: none; color: #fff; padding: 3px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.2s;">
                    ${L === 'en' ? 'Add →' : 'যোগ করুন →'}
                </button>
            </div>
            <div style="text-align: center; padding: 8px; opacity: 0.6; font-size: 13px; color: #64748b;">
                ${L === 'en' ? 'No rent records yet' : 'এখনও কোনো ভাড়া রেকর্ড নেই'}
            </div>
        </div>
        `;
    }
    
    return `
    <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #bbf7d0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 6px;">
            <h4 style="margin: 0; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; color: #1e293b;">
                <span style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #fff;">🏠</span>
                ${L === 'en' ? 'Rent & Service Summary' : 'ভাড়া ও সার্ভিস সারাংশ'}
                <span style="font-size: 11px; color: #94a3b8; font-weight: 400;">(${rent.count} ${L === 'en' ? 'records' : 'টি'})</span>
            </h4>
            <button onclick="navigateTo('rent')" style="background: #667eea; border: none; color: #fff; padding: 3px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.2s;">
                ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
            </button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            <div style="background: rgba(255,255,255,0.7); border-radius: 8px; padding: 10px 12px; text-align: center; border: 1px solid #f0fdf4;">
                <div style="font-size: 9px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.3px; color: #64748b;">${L === 'en' ? 'Rent' : 'ভাড়া'}</div>
                <div style="font-size: 18px; font-weight: 700; color: #d97706;">৳ ${formatNum(rent.totalRent)}</div>
            </div>
            <div style="background: rgba(255,255,255,0.7); border-radius: 8px; padding: 10px 12px; text-align: center; border: 1px solid #f0fdf4;">
                <div style="font-size: 9px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.3px; color: #64748b;">${L === 'en' ? 'Service' : 'সার্ভিস'}</div>
                <div style="font-size: 18px; font-weight: 700; color: #059669;">৳ ${formatNum(rent.totalService)}</div>
            </div>
            <div style="background: rgba(255,255,255,0.7); border-radius: 8px; padding: 10px 12px; text-align: center; border: 1px solid #f0fdf4;">
                <div style="font-size: 9px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.3px; color: #64748b;">${L === 'en' ? 'Parking' : 'পার্কিং'}</div>
                <div style="font-size: 18px; font-weight: 700; color: #7c3aed;">৳ ${formatNum(rent.totalParking)}</div>
            </div>
            <div style="background: rgba(255,255,255,0.7); border-radius: 8px; padding: 10px 12px; text-align: center; border: 1px solid #f0fdf4;">
                <div style="font-size: 9px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.3px; color: #64748b;">${L === 'en' ? 'Total' : 'সর্বমোট'}</div>
                <div style="font-size: 18px; font-weight: 700; color: #2563eb;">৳ ${formatNum(rent.totalOverall)}</div>
            </div>
        </div>
    </div>
    `;
}

// ✅ এক্সপেন্স সারাংশ কার্ড তৈরি
function createExpenseSummaryCards(L) {
    var expense = getExpenseSummary();
    
    var formatNum = function(num) {
        return Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    
    if (expense.count === 0) {
        return `
        <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 12px; padding: 14px 20px; margin-bottom: 16px; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <h4 style="margin: 0; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 10px; color: #1e293b;">
                    <span style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #fff;">🛒</span>
                    ${L === 'en' ? 'My Expenses' : 'আমার খরচ'}
                </h4>
                <button onclick="navigateTo('expenses')" style="background: #667eea; border: none; color: #fff; padding: 3px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.2s;">
                    ${L === 'en' ? 'Add →' : 'যোগ করুন →'}
                </button>
            </div>
            <div style="text-align: center; padding: 8px; opacity: 0.6; font-size: 13px; color: #64748b;">
                ${L === 'en' ? 'No expense records yet' : 'এখনও কোনো খরচ রেকর্ড নেই'}
            </div>
        </div>
        `;
    }
    
    return `
    <div style="background: linear-gradient(135deg, #fefce8, #fef9c3); border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #fde68a;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 6px;">
            <h4 style="margin: 0; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 8px; color: #1e293b;">
                <span style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #fff;">🛒</span>
                ${L === 'en' ? 'My Expenses' : 'আমার খরচ'}
                <span style="font-size: 11px; color: #94a3b8; font-weight: 400;">(${expense.count} ${L === 'en' ? 'records' : 'টি'})</span>
            </h4>
            <button onclick="navigateTo('expenses')" style="background: #667eea; border: none; color: #fff; padding: 3px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.2s;">
                ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
            </button>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: rgba(255,255,255,0.7); border-radius: 8px; padding: 10px 12px; text-align: center; grid-column: 1 / -1; border: 1px solid #fef9c3;">
                <div style="font-size: 9px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.3px; color: #64748b;">${L === 'en' ? 'Total Expense' : 'সর্বমোট খরচ'}</div>
                <div style="font-size: 20px; font-weight: 700; color: #d97706;">৳ ${formatNum(expense.totalOverall)}</div>
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

    const trends = {
        totalRecharge: { value: 12.5, direction: 'up' },
        totalExpense: { value: 3.2, direction: 'down' },
        totalTransactions: { value: 5.4, direction: 'up' },
        monthlyAvgExpense: { value: 2.1, direction: 'up' },
        totalKWH: { value: 15.3, direction: 'up' },
        monthlyAvgKWH: { value: 7.8, direction: 'up' },
        lastExpense: { value: 2.5, direction: 'up' }
    };

    function getTrendBadge(trend) {
        var isUp = trend.direction === 'up';
        var color = isUp ? '#10b981' : '#ef4444';
        var bgColor = isUp ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        var arrow = isUp ? '↗' : '↘';
        var sign = isUp ? '+' : '-';
        return `<span style="color: ${color}; background: ${bgColor}; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 12px; display: inline-flex; align-items: center; gap: 2px;">
            ${arrow} ${sign}${trend.value}%
        </span>`;
    }

    function createStatCard(iconName, label, value, gradient, trend) {
        return `
            <div class="stat-card" style="background: #fff; border-radius: 14px; padding: 14px 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -10px; width: 60px; height: 60px; background: ${gradient}; opacity: 0.15; border-radius: 50%; filter: blur(15px);"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <div style="width: 36px; height: 36px; background: ${gradient}; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.1); color: #fff;">
                            ${getIconSVG(iconName)}
                        </div>
                        <span class="trend-badge ${trend.direction}" style="font-size: 10px; padding: 2px 8px; border-radius: 12px;">
                            ${trend.direction === 'up' ? '↗' : '↘'} ${trend.direction === 'up' ? '+' : '-'}${trend.value}%
                        </span>
                    </div>
                    <div style="font-size: 10px; color: #64748b; margin-bottom: 4px;">${label}</div>
                    <div style="font-size: 18px; font-weight: 700; color: #1e293b;">${value}</div>
                </div>
            </div>
        `;
    }

    function createColorfulDeductionCard(iconName, label, value, gradient) {
        return `
            <div style="background: ${gradient}; border-radius: 16px; padding: 18px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.12); text-align: center; color: #fff; position: relative; overflow: hidden; transition: all 0.3s ease;">
                <div style="position: absolute; top: -30px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -20px; left: -10px; width: 60px; height: 60px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; backdrop-filter: blur(8px); color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        ${getIconSVG(iconName)}
                    </div>
                    <div style="font-size: 11px; font-weight: 500; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px;">${label}</div>
                    <div style="font-size: 22px; font-weight: 700; margin-top: 4px;">${value}</div>
                </div>
            </div>
        `;
    }

    function createBalanceCard(balance, L) {
        return `
            <div class="balance-card">
                <div style="position: absolute; top: -60px; right: -40px; width: 180px; height: 180px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -40px; left: -20px; width: 140px; height: 140px; background: rgba(255,255,255,0.06); border-radius: 50%;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <div>
                            <div style="font-size: 14px; color: rgba(255,255,255,0.85); margin-bottom: 4px;">${__('balance')}</div>
                            <div style="font-size: 36px; font-weight: 700;">${__('taka')} ${balance.toFixed(2)}</div>
                        </div>
                        <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                            ${getIconSVG('wallet')}
                        </div>
                    </div>
                    <div style="margin-top: 16px;">
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.8); margin-bottom: 8px;">
                            <span>0%</span>
                            <span>${L === 'en' ? 'Balance' : 'ব্যালেন্স'}: ${Math.min((balance / (balance + 1000 || 1)) * 100, 100).toFixed(1)}%</span>
                            <span>100%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min((balance / (balance + 1000 || 1)) * 100, 100)}%; background: linear-gradient(90deg, #fbbf24, #f97316);"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function createRentSummaryCards(L) {
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

        updateRentTotals();
        var totalRent = APP.rentData.totalRent || 0;
        var totalService = APP.rentData.totalService || 0;
        var totalParking = APP.rentData.totalParking || 0;
        var totalOverall = APP.rentData.totalOverall || 0;

        return `
            <div style="background: #fff; border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; border: 1px solid #f1f5f9;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <h4 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
                        <span style="background: linear-gradient(135deg, #f59e0b, #d97706); width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;">🏠</span>
                        ${L === 'en' ? 'Rent & Service Summary' : 'ভাড়া ও সার্ভিস সারাংশ'}
                    </h4>
                    <button onclick="navigateTo('rent')" style="background: none; border: none; color: #f59e0b; font-weight: 600; font-size: 12px; cursor: pointer; padding: 4px 12px; border-radius: 6px; transition: all 0.2s;">
                        ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
                    </button>
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 8px;">
                    <div style="background: #fffbeb; border-radius: 10px; padding: 10px; text-align: center;">
                        <div style="font-size: 10px; color: #92400e; font-weight: 600; text-transform: uppercase;">${L === 'en' ? 'Rent' : 'ভাড়া'}</div>
                        <div style="font-size: 16px; font-weight: 700; color: #d97706;">৳ ${totalRent.toFixed(0)}</div>
                    </div>
                    <div style="background: #ecfdf5; border-radius: 10px; padding: 10px; text-align: center;">
                        <div style="font-size: 10px; color: #065f46; font-weight: 600; text-transform: uppercase;">${L === 'en' ? 'Service' : 'সার্ভিস'}</div>
                        <div style="font-size: 16px; font-weight: 700; color: #059669;">৳ ${totalService.toFixed(0)}</div>
                    </div>
                    <div style="background: #f5f3ff; border-radius: 10px; padding: 10px; text-align: center;">
                        <div style="font-size: 10px; color: #5b21b6; font-weight: 600; text-transform: uppercase;">${L === 'en' ? 'Parking' : 'পার্কিং'}</div>
                        <div style="font-size: 16px; font-weight: 700; color: #7c3aed;">৳ ${totalParking.toFixed(0)}</div>
                    </div>
                    <div style="background: #eff6ff; border-radius: 10px; padding: 10px; text-align: center;">
                        <div style="font-size: 10px; color: #1e40af; font-weight: 600; text-transform: uppercase;">${L === 'en' ? 'Total' : 'মোট'}</div>
                        <div style="font-size: 16px; font-weight: 700; color: #2563eb;">৳ ${totalOverall.toFixed(0)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    function createExpenseSummaryCards(L) {
        var todayExpense = 0;
        var weekExpense = 0;
        var monthExpense = 0;
        var now = new Date();
        var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        var weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - 7);
        var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        
        var allTransactions = [];
        for (var mid in APP.metersData) {
            if (APP.metersData.hasOwnProperty(mid)) {
                var tx = APP.metersData[mid].transactions || [];
                allTransactions = allTransactions.concat(tx);
            }
        }
        
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

        return `
            <div style="background: #fff; border-radius: 16px; padding: 16px 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; border: 1px solid #f1f5f9;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <h4 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
                        <span style="background: linear-gradient(135deg, #f5576c, #ff6b6b); width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;">💰</span>
                        ${L === 'en' ? 'Expense Summary' : 'খরচ সারাংশ'}
                    </h4>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px;">
                    <div style="background: #fef2f2; border-radius: 10px; padding: 10px; text-align: center;">
                        <div style="font-size: 10px; color: #991b1b; font-weight: 600; text-transform: uppercase;">${L === 'en' ? 'Today' : 'আজ'}</div>
                        <div style="font-size: 16px; font-weight: 700; color: #dc2626;">৳ ${todayExpense.toFixed(0)}</div>
                    </div>
                    <div style="background: #fffbeb; border-radius: 10px; padding: 10px; text-align: center;">
                        <div style="font-size: 10px; color: #92400e; font-weight: 600; text-transform: uppercase;">${L === 'en' ? 'This Week' : 'এই সপ্তাহ'}</div>
                        <div style="font-size: 16px; font-weight: 700; color: #d97706;">৳ ${weekExpense.toFixed(0)}</div>
                    </div>
                    <div style="background: #eff6ff; border-radius: 10px; padding: 10px; text-align: center;">
                        <div style="font-size: 10px; color: #1e40af; font-weight: 600; text-transform: uppercase;">${L === 'en' ? 'This Month' : 'এই মাস'}</div>
                        <div style="font-size: 16px; font-weight: 700; color: #2563eb;">৳ ${monthExpense.toFixed(0)}</div>
                    </div>
                </div>
            </div>
        `;
    }

    var meterOptions = APP.meters.map(function(m) {
        var displayName = getMeterDisplayName(m);
        var selected = APP.activeMeterId === m.id ? 'selected' : '';
        return `<option value="${m.id}" ${selected}>${displayName} - ${m.meterNumber || m.meterNo}</option>`;
    }).join('');

    var balanceCardHTML = createBalanceCard(balance, L);
    var rentSummaryHTML = createRentSummaryCards(L);
    var expenseSummaryHTML = createExpenseSummaryCards(L);

    // ============================================================
    // ✅ HTML কন্টেন্ট - আপডেটেড মিটার সিলেক্টর সহ
    // ============================================================
    var htmlContent = `
        <style>
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 16px;
                margin-bottom: 20px;
            }
            .stat-card {
                transition: all 0.3s ease;
            }
            .stat-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            }
            .meter-selector {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 12px;
            }
            .meter-selector select {
                padding: 10px 16px;
                border-radius: 10px;
                border: 1px solid #e2e8f0;
                font-size: 14px;
                background: #fff;
                cursor: pointer;
            }
            .lang-toggle-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background: #f1f5f9;
                border-radius: 10px;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
            }
            .lang-toggle-btn:hover {
                background: #e2e8f0;
            }
            .balance-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 24px;
                padding: 28px;
                color: #fff;
                position: relative;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
            }
            .expense-card {
                background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                border-radius: 24px;
                padding: 28px;
                color: #1a1a2e;
                position: relative;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(67, 233, 123, 0.4);
            }
            .progress-bar {
                height: 10px;
                background: rgba(255,255,255,0.25);
                border-radius: 10px;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                border-radius: 10px;
                transition: width 0.8s ease;
            }
            .expense-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255,255,255,0.3);
            }
            .expense-row:last-child {
                border-bottom: none;
            }
            .stat-card svg {
                width: 24px;
                height: 24px;
            }
            .stat-card path {
                fill: none;
                stroke: currentColor;
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
            }
            .deduction-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin-top: 0;
            }
            .deduction-grid > div {
                transition: all 0.3s ease;
            }
            .deduction-grid > div:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            .transaction-table-wrap {
                overflow-x: auto;
                border-radius: 12px;
                border: 1px solid var(--border);
                background: var(--card-bg);
                margin-top: 12px;
            }
            .transaction-table-wrap table {
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
                min-width: 600px;
            }
            .transaction-table-wrap thead {
                background: linear-gradient(135deg, #667eea, #764ba2);
            }
            .transaction-table-wrap th {
                padding: 12px 16px;
                text-align: left;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #fff;
                border-bottom: 2px solid rgba(255,255,255,0.1);
                white-space: nowrap;
            }
            .transaction-table-wrap th:last-child {
                text-align: left;
            }
            .transaction-table-wrap td {
                padding: 10px 16px;
                border-bottom: 1px solid var(--border);
                color: var(--text);
                vertical-align: middle;
            }
            .transaction-table-wrap tbody tr {
                transition: all 0.2s ease;
            }
            .transaction-table-wrap tbody tr:hover {
                background: rgba(102, 126, 234, 0.06);
                transform: scale(1.002);
            }
            .transaction-table-wrap .badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                text-align: center;
                min-width: 60px;
            }
            .transaction-table-wrap .badge-success {
                background: #d1fae5;
                color: #065f46;
            }
            .transaction-table-wrap .badge-warning {
                background: #fef3c7;
                color: #92400e;
            }
            body.dark-mode .transaction-table-wrap .badge-success {
                background: #064e3b;
                color: #6ee7b7;
            }
            body.dark-mode .transaction-table-wrap .badge-warning {
                background: #78350f;
                color: #fcd34d;
            }
            .transaction-table-wrap td .amount-recharge {
                color: #059669;
            }
            .transaction-table-wrap td .amount-bill {
                color: #dc2626;
            }
            .transaction-table-wrap td .units-value {
                color: #6366f1;
                font-family: 'Courier New', monospace;
                font-weight: 600;
            }
            .transaction-table-wrap td .balance-value {
                font-weight: 700;
                color: var(--text);
            }
            .transaction-table-wrap td .description-text {
                font-size: 12px;
                color: var(--text-light);
                line-height: 1.4;
                word-break: break-word;
                max-width: 250px;
            }
            @media (max-width: 768px) {
                .transaction-table-wrap {
                    border-radius: 8px;
                    margin: 0 -8px;
                }
                .transaction-table-wrap table {
                    font-size: 11px;
                    min-width: 480px;
                }
                .transaction-table-wrap th,
                .transaction-table-wrap td {
                    padding: 8px 10px;
                }
                .transaction-table-wrap th {
                    font-size: 10px;
                }
                .transaction-table-wrap .badge {
                    font-size: 9px;
                    padding: 2px 8px;
                    min-width: 40px;
                }
            }
            @media (max-width: 600px) {
                .deduction-grid {
                    grid-template-columns: 1fr;
                }
                .stats-grid {
                    grid-template-columns: 1fr 1fr;
                }
            }
            @media (max-width: 480px) {
                .stats-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>

        <!-- ============================================================
        1. মিটার সিলেক্টর (আপডেটেড)
        ============================================================ -->
        <div class="meter-selector" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px 20px; border-radius: 14px; margin-bottom: 20px; color: #fff; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);">
            <label style="font-weight: 600; font-size: 14px; white-space: nowrap; color: #fff;">${__('currentMeter')}</label>
            <select onchange="switchMeter(this.value)" style="flex: 1; padding: 10px 16px; border-radius: 10px; border: 2px solid rgba(255,255,255,0.3); font-size: 15px; cursor: pointer; background: #fff; color: #2c3e50; font-weight: 500; min-width: 180px; min-height: 44px; appearance: auto; -webkit-appearance: auto;">
                ${meterOptions}
            </select>
            <div class="lang-toggle-btn" onclick="toggleLanguage()" style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 25px; cursor: pointer; border: 1px solid rgba(255,255,255,0.25); font-size: 13px; color: #fff; font-weight: 600; white-space: nowrap; transition: all 0.3s ease;">
                <span style="font-size: 18px;">🌐</span>
                <span>${APP.language === 'bn' ? '🇺🇸 English' : '🇧🇩 বাংলা'}</span>
            </div>
        </div>

        <!-- ============================================================
        2. স্ট্যাটাস কার্ড
        ============================================================ -->
        <div class="stats-grid">
            ${createStatCard('wallet', L === 'en' ? 'Total Recharge' : 'মোট রিচার্জ', `৳ ${totalRecharge.toFixed(2)}`, 'linear-gradient(135deg, #667eea, #764ba2)', trends.totalRecharge)}
            ${createStatCard('dollar', L === 'en' ? 'Total Expense' : 'মোট খরচ', `৳ ${totalExpense.toFixed(2)}`, 'linear-gradient(135deg, #f093fb, #f5576c)', trends.totalExpense)}
            ${createStatCard('activity', L === 'en' ? 'Transactions' : 'ট্রানজেকশন', `${totalTransactions}`, 'linear-gradient(135deg, #4facfe, #00f2fe)', trends.totalTransactions)}
            ${createStatCard('chart', L === 'en' ? 'Monthly Avg Expense' : 'মাসিক গড় খরচ', `৳ ${monthlyAvgExpense.toFixed(2)}`, 'linear-gradient(135deg, #43e97b, #38f9d7)', trends.monthlyAvgExpense)}
            ${createStatCard('zap', L === 'en' ? 'Total KWH' : 'মোট KWH', `${totalKWH.toFixed(2)}`, 'linear-gradient(135deg, #fa709a, #fee140)', trends.totalKWH)}
            ${createStatCard('layers', L === 'en' ? 'Monthly Avg KWH' : 'গড় মাসিক KWH', `${monthlyAvgKWH.toFixed(2)}`, 'linear-gradient(135deg, #a18cd1, #fbc2eb)', trends.monthlyAvgKWH)}
        </div>

        <!-- ============================================================
        3. ডিমান্ড, ভ্যাট ও রিবেট সারাংশ
        ============================================================ -->
        <div style="background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px; border: 1px solid #f1f5f9;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
                <h4 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 8px;">
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px;">📊</span>
                    ${L === 'en' ? 'Demand, VAT & Rebate Summary' : 'ডিমান্ড, ভ্যাট ও রিবেট সারাংশ'}
                </h4>
                <span style="font-size: 12px; color: #94a3b8; background: #f1f5f9; padding: 4px 14px; border-radius: 20px; font-weight: 500;">
                    🔄 ${L === 'en' ? 'Total Recharges' : 'মোট রিচার্জ'}: ${summary.rechargeCount}
                </span>
            </div>
            
            <div class="deduction-grid">
                ${createColorfulDeductionCard('demand', L === 'en' ? 'Demand Charge' : 'ডিমান্ড চার্জ', `৳ ${summary.totalDemand.toFixed(2)}`, 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)')}
                ${createColorfulDeductionCard('vat', L === 'en' ? 'VAT' : 'ভ্যাট', `৳ ${summary.totalVat.toFixed(2)}`, 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)')}
                ${createColorfulDeductionCard('rebate', L === 'en' ? 'Rebate' : 'রিবেট', `৳ ${summary.totalRebate.toFixed(2)}`, 'linear-gradient(135deg, #10b981, #059669, #047857)')}
            </div>
            
            <div style="margin-top: 16px; padding-top: 14px; border-top: 2px dashed #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; padding: 14px 18px;">
                <span style="font-size: 14px; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px;">
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;">💰</span>
                    ${L === 'en' ? 'Net Credit from Recharges' : 'রিচার্জ থেকে নেট ক্রেডিট'}
                </span>
                <span style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">৳ ${summary.totalNet.toFixed(2)}</span>
            </div>
        </div>

        <!-- ============================================================
        4. ব্যালেন্স ও খরচ কার্ড
        ============================================================ -->
        <div class="stats-grid" style="grid-template-columns: 2fr 1fr; margin-top: 0;">
            ${balanceCardHTML}
            
            <div class="expense-card">
                <div style="position: absolute; top: -30px; right: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.15); border-radius: 50%;"></div>
                
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
                        <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.25); border-radius: 14px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                            ${getIconSVG('trendingDown')}
                        </div>
                        <div>
                            <div style="font-size: 13px; color: rgba(0,0,0,0.7);">${__('lastExpense')}</div>
                            <div style="font-size: 28px; font-weight: 700;">${__('taka')} ${lastExpense.toFixed(2)}</div>
                        </div>
                    </div>

                    <div style="margin-top: 16px;">
                        <div class="expense-row">
                            <span style="font-size: 13px; color: rgba(0,0,0,0.7);">${L === 'en' ? "Today's Expense" : 'আজকের খরচ'}</span>
                            <span style="font-weight: 600;">৳ ${recentTx.length > 0 ? (recentTx[0].amount || 0).toFixed(2) : '0.00'}</span>
                        </div>
                        <div class="expense-row">
                            <span style="font-size: 13px; color: rgba(0,0,0,0.7);">${L === 'en' ? "This Week" : 'এই সপ্তাহে'}</span>
                            <span style="font-weight: 600;">৳ ${recentTx.length > 0 ? (recentTx.reduce(function(sum, t) { return sum + (t.amount || 0); }, 0)).toFixed(2) : '0.00'}</span>
                        </div>
                        <div class="expense-row">
                            <span style="font-size: 13px; color: rgba(0,0,0,0.7);">${L === 'en' ? "This Month" : 'এই মাসে'}</span>
                            <span style="font-weight: 600;">৳ ${recentTx.length > 0 ? (recentTx.reduce(function(sum, t) { return sum + (t.amount || 0); }, 0)).toFixed(2) : '0.00'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ============================================================
        5. 🏠 রেন্ট সারাংশ
        ============================================================ -->
        ${rentSummaryHTML}

        <!-- ============================================================
        6. 🛒 এক্সপেন্স সারাংশ
        ============================================================ -->
        ${expenseSummaryHTML}

        <!-- ============================================================
        7. 📋 সর্বশেষ ট্রানজেকশন
        ============================================================ -->
        <div class="card" style="margin-top: 0px; overflow: hidden; border-radius: var(--radius);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 0 4px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 10px;">
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;">📋</span>
                    ${__('recentTransactions')} (${recentTx.length})
                </h3>
                <button onclick="navigateTo('transactions')" style="background: none; border: none; color: #667eea; font-weight: 600; font-size: 13px; cursor: pointer; padding: 6px 12px; border-radius: 6px; transition: all 0.2s;">
                    ${L === 'en' ? 'View All →' : 'সব দেখুন →'}
                </button>
            </div>
            
            ${recentTx.length > 0 ? `
            <div class="transaction-table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th style="text-align: left;">${__('date')}</th>
                            <th style="text-align: left;">${__('type')}</th>
                            <th style="text-align: right;">${__('amount')}</th>
                            <th style="text-align: right;">${__('units')}</th>
                            <th style="text-align: right;">${__('balance')}</th>
                            <th style="text-align: left; min-width: 180px;">${__('description')}</th>
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
                            var typeLabel = t.type === 'recharge' ? __('recharge') : __('bill');
                            var typeClass = t.type === 'recharge' ? 'badge-success' : 'badge-warning';
                            var amountClass = t.type === 'recharge' ? 'amount-recharge' : 'amount-bill';
                            
                            return `
                            <tr>
                                <td style="font-weight: 500; color: var(--text);">${displayDate}</td>
                                <td><span class="badge ${typeClass}">${typeLabel}</span></td>
                                <td style="text-align: right; font-weight: 600;" class="${amountClass}">${__('taka')} ${(t.amount || 0).toFixed(2)}</td>
                                <td style="text-align: right;" class="units-value">${t.units ? t.units.toFixed(2) : '-'}</td>
                                <td style="text-align: right;" class="balance-value">${__('taka')} ${(t.balanceAfter || 0).toFixed(2)}</td>
                                <td class="description-text">${description}</td>
                            </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            ` : `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-light);">
                <div style="font-size: 48px; margin-bottom: 10px;">📭</div>
                <p style="font-size: 15px;">${__('noTransactions')}</p>
                <button onclick="navigateTo('transactions')" style="margin-top: 10px; background: linear-gradient(135deg, #667eea, #764ba2); border: none; color: #fff; padding: 8px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    + ${L === 'en' ? 'Add Transaction' : 'ট্রানজেকশন যোগ করুন'}
                </button>
            </div>
            `}
        </div>
    `;

    document.getElementById('pageContent').innerHTML = htmlContent;
}