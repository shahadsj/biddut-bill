// ==================== DASHBOARD (Option A Design - Custom SVG Icons) ====================

// ✅ হেল্পার ফাংশন
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

// ✅ ডিমান্ড চার্জ, ভ্যাট ও রিবেট ক্যালকুলেটর
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

// ✅ SVG আইকন ফাংশন (কালারফুলের জন্য আপডেটেড)
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

// ============================================================
// ✅ প্রধান ড্যাশবোর্ড ফাংশন
// ============================================================
function showDashboard() {
    console.log('📊 showDashboard called');
    console.log('ActiveMeterId:', APP.activeMeterId);
    console.log('Meters:', APP.meters.length);
    
    if (!APP.activeMeterId && APP.meters.length > 0) {
        APP.activeMeterId = APP.meters[0].id;
        saveData();
    }
    
    if (!APP.activeMeterId || APP.meters.length === 0) {
        document.getElementById('pageContent').innerHTML = `
            <div class="card" style="text-align: center; padding: 50px;">
                <h2>${__('welcome')}</h2>
                <p style="margin: 20px 0;">${__('welcomeMsg')}</p>
                <button class="btn" onclick="navigateTo('meters')">${__('addMeter')}</button>
            </div>
        `;
        return;
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
    
    // ✅ ডিমান্ড, ভ্যাট, রিবেট ডাটা
    const summary = getDemandVatRebateSummary(APP.activeMeterId);

    const L = APP.language;
    const dateLocale = L === 'en' ? 'en-US' : 'bn-BD';

    // ✅ ট্রেন্ড ডাটা
    const trends = {
        totalRecharge: { value: 12.5, direction: 'up' },
        totalExpense: { value: 3.2, direction: 'down' },
        totalTransactions: { value: 5.4, direction: 'up' },
        monthlyAvgExpense: { value: 2.1, direction: 'up' },
        totalKWH: { value: 15.3, direction: 'up' },
        monthlyAvgKWH: { value: 7.8, direction: 'up' },
        lastExpense: { value: 2.5, direction: 'up' }
    };

    // ✅ ট্রেন্ড ব্যাজ
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

    // ✅ Stat Card তৈরি
    function createStatCard(iconName, label, value, gradient, trend) {
        return `
            <div class="stat-card" style="background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); position: relative; overflow: hidden;">
                <div style="position: absolute; top: -20px; right: -10px; width: 80px; height: 80px; background: ${gradient}; opacity: 0.2; border-radius: 50%; filter: blur(20px);"></div>
                <div style="position: absolute; top: -10px; right: 20px; width: 50px; height: 50px; background: ${gradient}; opacity: 0.15; border-radius: 50%; filter: blur(15px);"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <div style="width: 48px; height: 48px; background: ${gradient}; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); color: #fff;">
                            ${getIconSVG(iconName)}
                        </div>
                        ${getTrendBadge(trend)}
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">${label}</div>
                    <div style="font-size: 20px; font-weight: 700; color: #1e293b;">${value}</div>
                </div>
            </div>
        `;
    }

    // ✅ কালারফুল ডিমান্ড, ভ্যাট, রিবেট কার্ড (গ্রেডিয়েন্ট ব্যাকগ্রাউন্ড সহ)
    function createColorfulDeductionCard(iconName, label, value, gradient, iconColor) {
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

    document.getElementById('pageContent').innerHTML = `
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
                background: linear-gradient(90deg, #fbbf24, #f97316);
                border-radius: 10px;
                transition: width 0.5s ease;
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
            @media (max-width: 600px) {
                .deduction-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>

        <div class="meter-selector">
            <div style="display: flex; align-items: center; gap: 10px;">
                <label style="font-weight: 600; color: #475569;">${__('currentMeter')}:</label>
                <select onchange="switchMeter(this.value)">
                    ${APP.meters.map(m => `<option value="${m.id}" ${APP.activeMeterId === m.id ? 'selected' : ''}>${m.name} - ${m.meterNumber || m.meterNo}</option>`).join('')}
                </select>
            </div>
            <div class="lang-toggle-btn" onclick="toggleLanguage()">
                <span>${APP.language === 'bn' ? '🇺 English' : '🇧🇩 বাংলা'}</span>
            </div>
        </div>

        <!-- ✅ স্ট্যাটাস কার্ড -->
        <div class="stats-grid">
            ${createStatCard('wallet', L === 'en' ? 'Total Recharge' : 'মোট রিচার্জ', `৳ ${totalRecharge.toFixed(2)}`, 'linear-gradient(135deg, #667eea, #764ba2)', trends.totalRecharge)}
            ${createStatCard('dollar', L === 'en' ? 'Total Expense' : 'মোট খরচ', `৳ ${totalExpense.toFixed(2)}`, 'linear-gradient(135deg, #f093fb, #f5576c)', trends.totalExpense)}
            ${createStatCard('activity', L === 'en' ? 'Transactions' : 'ট্রানজেকশন', `${totalTransactions}`, 'linear-gradient(135deg, #4facfe, #00f2fe)', trends.totalTransactions)}
            ${createStatCard('chart', L === 'en' ? 'Monthly Avg Expense' : 'মাসিক গড় খরচ', `৳ ${monthlyAvgExpense.toFixed(2)}`, 'linear-gradient(135deg, #43e97b, #38f9d7)', trends.monthlyAvgExpense)}
            ${createStatCard('zap', L === 'en' ? 'Total KWH' : 'মোট KWH', `${totalKWH.toFixed(2)}`, 'linear-gradient(135deg, #fa709a, #fee140)', trends.totalKWH)}
            ${createStatCard('layers', L === 'en' ? 'Monthly Avg KWH' : 'গড় মাসিক KWH', `${monthlyAvgKWH.toFixed(2)}`, 'linear-gradient(135deg, #a18cd1, #fbc2eb)', trends.monthlyAvgKWH)}
        </div>

        <!-- ✅ কালারফুল ডিমান্ড চার্জ, ভ্যাট ও রিবেট সারাংশ -->
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
            
            <!-- ✅ কালারফুল ৩টি কার্ড -->
            <div class="deduction-grid">
                ${createColorfulDeductionCard('demand', L === 'en' ? 'Demand Charge' : 'ডিমান্ড চার্জ', `৳ ${summary.totalDemand.toFixed(2)}`, 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)', '#fff')}
                ${createColorfulDeductionCard('vat', L === 'en' ? 'VAT' : 'ভ্যাট', `৳ ${summary.totalVat.toFixed(2)}`, 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)', '#fff')}
                ${createColorfulDeductionCard('rebate', L === 'en' ? 'Rebate' : 'রিবেট', `৳ ${summary.totalRebate.toFixed(2)}`, 'linear-gradient(135deg, #10b981, #059669, #047857)', '#fff')}
            </div>
            
            <!-- ✅ নেট ক্রেডিট -->
            <div style="margin-top: 16px; padding-top: 14px; border-top: 2px dashed #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; padding: 14px 18px;">
                <span style="font-size: 14px; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px;">
                    <span style="background: linear-gradient(135deg, #667eea, #764ba2); width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px;">💰</span>
                    ${L === 'en' ? 'Net Credit from Recharges' : 'রিচার্জ থেকে নেট ক্রেডিট'}
                </span>
                <span style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">৳ ${summary.totalNet.toFixed(2)}</span>
            </div>
        </div>

        <!-- ✅ ব্যালেন্স ও খরচ কার্ড -->
        <div class="stats-grid" style="grid-template-columns: 2fr 1fr; margin-top: 0;">
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
                            <div class="progress-fill" style="width: ${Math.min((balance / (balance + 1000 || 1)) * 100, 100)}%;"></div>
                        </div>
                    </div>
                </div>
            </div>

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
                            <span style="font-weight: 600;">৳ 44.62</span>
                        </div>
                        <div class="expense-row">
                            <span style="font-size: 13px; color: rgba(0,0,0,0.7);">${L === 'en' ? "This Week" : 'এই সপ্তাহে'}</span>
                            <span style="font-weight: 600;">৳ 325.00</span>
                        </div>
                        <div class="expense-row">
                            <span style="font-size: 13px; color: rgba(0,0,0,0.7);">${L === 'en' ? "This Month" : 'এই মাসে'}</span>
                            <span style="font-weight: 600;">৳ 1200.98</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ✅ সাম্প্রতিক ট্রানজেকশন -->
        <div class="card" style="margin-top: 20px;">
            <h3>${__('recentTransactions')} (${recentTx.length})</h3>
            ${recentTx.length > 0 ? `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>${__('date')}</th>
                            <th>${__('type')}</th>
                            <th>${__('amount')}</th>
                            <th>${__('units')}</th>
                            <th style="min-width: 200px;">${__('description')}</th>
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
                            
                            return `
                            <tr>
                                <td>${displayDate}</td>
                                <td><span class="badge ${t.type === 'recharge' ? 'badge-success' : 'badge-warning'}">${t.type === 'recharge' ? __('recharge') : __('bill')}</span></td>
                                <td>${__('taka')} ${(t.amount || 0).toFixed(2)}</td>
                                <td>${t.units ? t.units.toFixed(2) : '-'}</td>
                                <td style="font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif; font-size: 13px; word-break: break-word; max-width: 250px;">${description}</td>
                            </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            ` : `
            <p style="text-align: center; padding: 20px; color: var(--text-light);">${__('noTransactions')}</p>
            `}
        </div>
    `;
}