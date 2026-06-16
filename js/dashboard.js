// ==================== DASHBOARD ====================
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

function showDashboard() {
    console.log('showDashboard called, activeMeterId:', APP.activeMeterId, 'meters:', APP.meters.length);
    
    // ===== activeMeterId চেক করুন =====
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

    // ===== Meter Data তৈরি করুন =====
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
    const balance = meterData.currentBalance || 0;
    const totalRecharge = meterData.totalRecharge || 0;
    const totalExpense = meterData.totalExpended || 0;
    const lastExpense = getLastExpense(APP.activeMeterId);
    const totalTransactions = (meterData.transactions || []).length;
    
    // ===== FIX: allTx ডিফাইন করুন =====
    const allTx = (meterData.transactions || []).filter(t => t.type === 'recharge').sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastRecharge = allTx.length > 0 ? allTx[0] : null;
    
    const totalKWH = getTotalKWH(APP.activeMeterId);
    const monthlyAvgExpense = getMonthlyAvgExpense(APP.activeMeterId);
    const monthlyAvgKWH = getMonthlyAvgKWH(APP.activeMeterId);

    // ===== Balance Progress Bar =====
    let maxBalance = balance;
    if (lastRecharge && lastRecharge.balanceAfter && lastRecharge.balanceAfter > balance) {
        maxBalance = lastRecharge.balanceAfter;
    }
    if (maxBalance < balance) maxBalance = balance;
    if (maxBalance <= 0) maxBalance = 1;

    const percentage = Math.min((balance / maxBalance) * 100, 100);
    let barColor;
    if (percentage > 80) {
        barColor = '#2ecc71';
    } else if (percentage > 55) {
        barColor = '#f1c40f';
    } else if (percentage > 30) {
        barColor = '#e67e22';
    } else {
        barColor = '#e74c3c';
    }

    const L = APP.language;
    const dateLocale = L === 'en' ? 'en-US' : 'bn-BD';

    document.getElementById('pageContent').innerHTML = `
        <div class="meter-selector">
            <label>${__('currentMeter')}</label>
            <select onchange="switchMeter(this.value)">
                ${APP.meters.map(m => `<option value="${m.id}" ${APP.activeMeterId === m.id ? 'selected' : ''}>${m.name} - ${m.meterNumber || m.meterNo}</option>`).join('')}
            </select>
            <div class="lang-toggle-btn" onclick="toggleLanguage()">
                <span class="lang-icon">🌐</span>
                <span>${APP.language === 'bn' ? '🇺🇸 English' : '🇧🇩 বাংলা'}</span>
            </div>
        </div>

        <!-- Summary Stats Row -->
        <div class="stats-grid">
            <div class="stat-card" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                <div class="label">💰 ${L === 'en' ? 'Total Recharge' : 'মোট রিচার্জ'}</div>
                <div class="value">৳ ${totalRecharge.toFixed(2)}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
                <div class="label">💸 ${L === 'en' ? 'Total Expense' : 'মোট খরচ'}</div>
                <div class="value">৳ ${totalExpense.toFixed(2)}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">
                <div class="label">📝 ${L === 'en' ? 'Transactions' : 'ট্রানজেকশন'}</div>
                <div class="value">${totalTransactions}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #43e97b, #38f9d7);">
                <div class="label">📊 ${L === 'en' ? 'Monthly Avg Expense' : 'মাসিক গড় খরচ'}</div>
                <div class="value">৳ ${monthlyAvgExpense.toFixed(2)}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #fa709a, #fee140);">
                <div class="label">⚡ ${L === 'en' ? 'Total KWH' : 'মোট KWH'}</div>
                <div class="value">${totalKWH.toFixed(2)}</div>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #a18cd1, #fbc2eb);">
                <div class="label">📈 ${L === 'en' ? 'Monthly Avg KWH' : 'গড় মাসিক KWH'}</div>
                <div class="value">${monthlyAvgKWH.toFixed(2)}</div>
            </div>
        </div>

        <!-- Balance & Last Expense Row -->
        <div class="stats-grid" style="margin-top: 15px;">
            <div class="stat-card" style="background: var(--gradient-1);">
                <div class="label">${__('balance')}</div>
                <div class="value">${__('taka')} ${balance.toFixed(2)}</div>
                <div class="progress-bar">
                    <div id="balanceProgress" class="progress-fill" style="width: ${percentage.toFixed(2)}%; background: ${barColor};"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; opacity: 0.9;">
                    <span>${L === 'en' ? '0%' : '০%'}</span>
                    <span>${L === 'en' ? 'Balance' : 'ব্যালেন্স'}: ${percentage.toFixed(1)}%</span>
                    <span>${L === 'en' ? '100%' : '১০০%'}</span>
                </div>
            </div>
            <div class="stat-card" style="background: var(--gradient-4);">
                <div class="label">${__('lastExpense')}</div>
                <div class="value">${__('taka')} ${lastExpense.toFixed(2)}</div>
            </div>
        </div>

        <div class="card">
            <h3>${__('recentTransactions')}</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>${__('date')}</th>
                            <th>${__('type')}</th>
                            <th>${__('amount')}</th>
                            <th>${__('units')}</th>
                            <th>${__('description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${getRecentTransactions(APP.activeMeterId, 5).map(t => `
                            <tr>
                                <td>${new Date(t.date || t.timestamp).toLocaleDateString(dateLocale)}</td>
                                <td><span class="badge ${t.type === 'recharge' ? 'badge-success' : 'badge-warning'}">${t.type === 'recharge' ? __('recharge') : __('bill')}</span></td>
                                <td>${__('taka')} ${t.amount.toFixed(2)}</td>
                                <td>${t.units ? t.units.toFixed(2) : '-'}</td>
                                <td>${t.description || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${getRecentTransactions(APP.activeMeterId, 5).length === 0 ? '<p style="text-align: center; padding: 20px; color: var(--text-light);">' + __('noTransactions') + '</p>' : ''}
        </div>
    `;
}
