// ==================== CHECK CHART.JS ====================
function isChartJsLoaded() {
    return typeof Chart !== 'undefined';
}

// ==================== ANALYTICS ====================
function showAnalytics() {
    // Chart.js চেক করুন
    if (!isChartJsLoaded()) {
        console.warn('Chart.js not loaded! Trying to load from CDN...');
        loadChartJsFromCDN();
        return;
    }
    
    var L = APP.language;
    if (!APP.activeMeterId || APP.meters.length === 0) {
        showToast(L === 'en' ? 'Please add a meter first' : 'প্রথমে একটি মিটার যোগ করুন', 'warning');
        navigateTo('meters');
        return;
    }

    var meterData = getActiveMeterData();
    var transactions = meterData.transactions || [];
    var summary = getMonthlySummary(APP.activeMeterId);
    var keys = Object.keys(summary);

    var totalRecharge = meterData.totalRecharge || 0;
    var totalExpense = meterData.totalExpended || 0;
    var currentBalance = meterData.currentBalance || 0;
    var monthCount = keys.length || 1;
    var avgRecharge = totalRecharge / monthCount;
    var avgExpense = totalExpense / monthCount;

    // Get last 6 months for trend
    var last6Months = keys.slice(-6);
    var trendLabels = [];
    var trendRecharge = [];
    var trendExpense = [];
    var trendUnits = [];

    last6Months.forEach(function(key) {
        var m = summary[key];
        if (m) {
            trendLabels.push(m.displayMonth || key);
            trendRecharge.push(m.recharge || 0);
            trendExpense.push(m.bill || 0);
            trendUnits.push(m.units || 0);
        }
    });

    if (trendLabels.length === 0) {
        var months = L === 'en' ? 
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] : 
            ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন'];
        trendLabels = months;
        trendRecharge = [0, 0, 0, 0, 0, 0];
        trendExpense = [0, 0, 0, 0, 0, 0];
        trendUnits = [0, 0, 0, 0, 0, 0];
    }

    // Get yearly data
    var yearlyData = {};
    keys.forEach(function(key) {
        var m = summary[key];
        if (m) {
            var year = m.displayMonth ? m.displayMonth.split(' ').pop() : '2024';
            if (!yearlyData[year]) {
                yearlyData[year] = { recharge: 0, expense: 0, units: 0, count: 0 };
            }
            yearlyData[year].recharge += m.recharge || 0;
            yearlyData[year].expense += m.bill || 0;
            yearlyData[year].units += m.units || 0;
            yearlyData[year].count++;
        }
    });

    var yearLabels = Object.keys(yearlyData);
    var yearExpense = yearLabels.map(function(y) { return yearlyData[y].expense || 0; });

    if (yearLabels.length === 0) {
        yearLabels = ['2024', '2025', '2026'];
        yearExpense = [0, 0, 0];
    }

    // Cost breakdown
    var rechargeTotal = 0,
        expenseTotal = 0,
        demandTotal = 0,
        vatTotal = 0;

    transactions.forEach(function(t) {
        if (t.type === 'recharge') {
            rechargeTotal += t.amount || 0;
        } else if (t.type === 'electricity_bill' || t.type === 'bill') {
            expenseTotal += t.amount || 0;
            demandTotal += t.demandCharge || 0;
            vatTotal += t.vat || 0;
        }
    });

    var hasData = transactions.length > 0;
    var taka = '৳';

    document.getElementById('pageContent').innerHTML = `
        <!-- TOP HEADER -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px 25px; border-radius: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 32px;">📊</span>
                <div>
                    <h2 style="color: white; margin: 0; font-size: 22px;">${L === 'en' ? 'Analytics Dashboard' : 'এনালিটিক্স ড্যাশবোর্ড'}</h2>
                    <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 13px;">${L === 'en' ? 'Real-time data analysis' : 'রিয়েল-টাইম ডেটা বিশ্লেষণ'}</p>
                </div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <span style="background: rgba(255,255,255,0.2); color: white; padding: 5px 15px; border-radius: 20px; font-size: 13px;">⚡ ${L === 'en' ? 'Live' : 'লাইভ'}</span>
                <button class="btn" style="background: white; color: #667eea; padding: 8px 18px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;" onclick="showToast('${L === 'en' ? 'Exporting analytics...' : 'এনালিটিক্স এক্সপোর্ট হচ্ছে...'}', 'info')">📥 ${L === 'en' ? 'Export' : 'এক্সপোর্ট'}</button>
            </div>
        </div>

        ${!hasData ? `
        <div style="text-align: center; padding: 40px; background: white; border-radius: 16px; margin-bottom: 20px;">
            <span style="font-size: 48px;">📭</span>
            <h3 style="color: #2d3748; margin: 15px 0 10px;">${L === 'en' ? 'No Data Available' : 'কোন ডাটা নেই'}</h3>
            <p style="color: #718096;">${L === 'en' ? 'Add some transactions to see analytics' : 'এনালিটিক্স দেখতে ট্রানজেকশন যোগ করুন'}</p>
            <button class="btn" onclick="navigateTo('transactions')" style="margin-top: 10px;">${L === 'en' ? 'Add Transaction' : 'ট্রানজেকশন যোগ করুন'}</button>
        </div>
        ` : `
        <!-- 4 COLUMN STATS GRID -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 14px; padding: 20px; color: white; text-align: center;">
                <div style="font-size: 12px; opacity: 0.8;">${L === 'en' ? 'Avg Monthly Recharge' : 'গড় মাসিক রিচার্জ'}</div>
                <div style="font-size: 28px; font-weight: 700; margin: 5px 0;">${taka} ${avgRecharge.toFixed(2)}</div>
                <div style="font-size: 11px; opacity: 0.7;">${L === 'en' ? 'Based on ' + monthCount + ' months' : monthCount + ' মাসের ভিত্তিতে'}</div>
            </div>
            <div style="background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 14px; padding: 20px; color: white; text-align: center;">
                <div style="font-size: 12px; opacity: 0.8;">${L === 'en' ? 'Avg Monthly Expense' : 'গড় মাসিক খরচ'}</div>
                <div style="font-size: 28px; font-weight: 700; margin: 5px 0;">${taka} ${avgExpense.toFixed(2)}</div>
                <div style="font-size: 11px; opacity: 0.7;">${L === 'en' ? 'Based on ' + monthCount + ' months' : monthCount + ' মাসের ভিত্তিতে'}</div>
            </div>
            <div style="background: linear-gradient(135deg, #4facfe, #00f2fe); border-radius: 14px; padding: 20px; color: white; text-align: center;">
                <div style="font-size: 12px; opacity: 0.8;">${L === 'en' ? 'Total Months' : 'মোট মাস'}</div>
                <div style="font-size: 28px; font-weight: 700; margin: 5px 0;">${monthCount}</div>
                <div style="font-size: 11px; opacity: 0.7;">${L === 'en' ? 'Data period' : 'ডাটা পিরিয়ড'}</div>
            </div>
            <div style="background: linear-gradient(135deg, #43e97b, #38f9d7); border-radius: 14px; padding: 20px; color: #1a1a2e; text-align: center;">
                <div style="font-size: 12px; opacity: 0.8;">${L === 'en' ? 'Current Balance' : 'বর্তমান ব্যালেন্স'}</div>
                <div style="font-size: 28px; font-weight: 700; margin: 5px 0;">${taka} ${currentBalance.toFixed(2)}</div>
                <div style="font-size: 11px; opacity: 0.7;">${L === 'en' ? 'Available balance' : 'উপলব্ধ ব্যালেন্স'}</div>
            </div>
        </div>

        <!-- 2x2 GRID FOR CHARTS -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">

            <!-- ROW 1 COL 1: MONTHLY TREND -->
            <div style="background: white; border-radius: 14px; padding: 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-top: 4px solid #667eea;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="font-size: 24px;">📈</span>
                    <div>
                        <div style="font-weight: 700; font-size: 16px; color: #2d3748;">${L === 'en' ? 'Monthly Trend' : 'মাসিক ট্রেন্ড'}</div>
                        <div style="font-size: 11px; color: #888;">${L === 'en' ? 'Last 6 months' : 'সর্বশেষ ৬ মাস'}</div>
                    </div>
                </div>
                <div style="height: 220px; width: 100%;">
                    <canvas id="monthlyTrendChart" style="width: 100% !important; height: 100% !important;"></canvas>
                </div>
            </div>

            <!-- ROW 1 COL 2: YEARLY COMPARISON -->
            <div style="background: white; border-radius: 14px; padding: 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-top: 4px solid #f5576c;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="font-size: 24px;">📊</span>
                    <div>
                        <div style="font-weight: 700; font-size: 16px; color: #2d3748;">${L === 'en' ? 'Yearly Overview' : 'বার্ষিক ওভারভিউ'}</div>
                        <div style="font-size: 11px; color: #888;">${L === 'en' ? 'Year by year' : 'বছর ভিত্তিক'}</div>
                    </div>
                </div>
                <div style="height: 220px; width: 100%;">
                    <canvas id="yearlyChart" style="width: 100% !important; height: 100% !important;"></canvas>
                </div>
            </div>

            <!-- ROW 2 COL 1: COST BREAKDOWN -->
            <div style="background: white; border-radius: 14px; padding: 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-top: 4px solid #43e97b;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="font-size: 24px;">💰</span>
                    <div>
                        <div style="font-weight: 700; font-size: 16px; color: #2d3748;">${L === 'en' ? 'Cost Breakdown' : 'খরচ বিশ্লেষণ'}</div>
                        <div style="font-size: 11px; color: #888;">${L === 'en' ? 'All time' : 'সর্বমোট'}</div>
                    </div>
                </div>
                <div style="height: 220px; width: 100%;">
                    <canvas id="costChart" style="width: 100% !important; height: 100% !important;"></canvas>
                </div>
            </div>

            <!-- ROW 2 COL 2: MONTHLY OVERVIEW -->
            <div style="background: white; border-radius: 14px; padding: 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border-top: 4px solid #4facfe;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="font-size: 24px;">📋</span>
                    <div>
                        <div style="font-weight: 700; font-size: 16px; color: #2d3748;">${L === 'en' ? 'Monthly Stats' : 'মাসিক পরিসংখ্যান'}</div>
                        <div style="font-size: 11px; color: #888;">${L === 'en' ? 'Last 6 months' : 'সর্বশেষ ৬ মাস'}</div>
                    </div>
                </div>
                <div style="max-height: 200px; overflow-y: auto; font-size: 13px;">
                    ${trendLabels.map(function(label, i) {
                        var recharge = trendRecharge[i] || 0;
                        var expense = trendExpense[i] || 0;
                        var balance = recharge - expense;
                        return `
                            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f0f0f0;">
                                <span style="font-weight: 500;">${label}</span>
                                <div style="display: flex; gap: 12px;">
                                    <span style="color: #27ae60;">+${taka}${recharge.toFixed(2)}</span>
                                    <span style="color: #e74c3c;">-${taka}${expense.toFixed(2)}</span>
                                    <span style="font-weight: 600;">${taka}${balance.toFixed(2)}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; font-size: 12px; background: #f7fafc; padding: 8px 12px; border-radius: 8px;">
                    <span style="font-weight: 600;">${L === 'en' ? 'Total' : 'মোট'}</span>
                    <span style="font-weight: 700;">${taka} ${totalRecharge.toFixed(2)}</span>
                    <span style="font-weight: 700; color: #e74c3c;">${taka} ${totalExpense.toFixed(2)}</span>
                    <span style="font-weight: 700; color: #667eea;">${taka} ${currentBalance.toFixed(2)}</span>
                </div>
            </div>

        </div>

        <!-- BOTTOM STATS -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px;">
            <div style="background: #f0faf0; border-radius: 12px; padding: 15px; text-align: center; border: 1px solid #d4edda;">
                <div style="font-size: 12px; color: #666;">${L === 'en' ? 'Total Recharge' : 'সর্বমোট রিচার্জ'}</div>
                <div style="font-size: 24px; font-weight: 700; color: #27ae60;">${taka} ${totalRecharge.toFixed(2)}</div>
            </div>
            <div style="background: #fce4ec; border-radius: 12px; padding: 15px; text-align: center; border: 1px solid #f8d7da;">
                <div style="font-size: 12px; color: #666;">${L === 'en' ? 'Total Expense' : 'সর্বমোট খরচ'}</div>
                <div style="font-size: 24px; font-weight: 700; color: #e74c3c;">${taka} ${totalExpense.toFixed(2)}</div>
            </div>
            <div style="background: #fff8e1; border-radius: 12px; padding: 15px; text-align: center; border: 1px solid #ffe082;">
                <div style="font-size: 12px; color: #666;">${L === 'en' ? 'Transactions' : 'মোট ট্রানজেকশন'}</div>
                <div style="font-size: 24px; font-weight: 700; color: #f39c12;">${transactions.length}</div>
            </div>
            <div style="background: #e3f2fd; border-radius: 12px; padding: 15px; text-align: center; border: 1px solid #bbdefb;">
                <div style="font-size: 12px; color: #666;">${L === 'en' ? 'Data Period' : 'ডাটা পিরিয়ড'}</div>
                <div style="font-size: 20px; font-weight: 700; color: #3498db;">${monthCount} ${L === 'en' ? 'months' : 'মাস'}</div>
            </div>
        </div>
        `}
    `;

    // ===== DRAW CHARTS (with delay and check) =====
    if (hasData) {
        setTimeout(function() {
            // Check if Chart.js is loaded
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded, retrying...');
                setTimeout(function() {
                    drawAnalyticsCharts(trendLabels, trendRecharge, trendExpense, yearLabels, yearExpense, rechargeTotal, expenseTotal, demandTotal, vatTotal);
                }, 1000);
                return;
            }
            drawAnalyticsCharts(trendLabels, trendRecharge, trendExpense, yearLabels, yearExpense, rechargeTotal, expenseTotal, demandTotal, vatTotal);
        }, 600);
    }
}

// ==================== DRAW ANALYTICS CHARTS ====================
function drawAnalyticsCharts(trendLabels, trendRecharge, trendExpense, yearLabels, yearExpense, rechargeTotal, expenseTotal, demandTotal, vatTotal) {

    console.log('Drawing charts...');

    // ===== CHECK IF CHART.JS IS LOADED =====
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        return;
    }

    // ===== HELPER: Destroy chart safely =====
    function destroyChart(chartInstance) {
        if (chartInstance && typeof chartInstance === 'object' && typeof chartInstance.destroy === 'function') {
            try {
                chartInstance.destroy();
                console.log('✅ Chart destroyed successfully');
            } catch(e) {
                console.warn('Chart destroy error:', e);
            }
        }
        return null;
    }

    // ===== CHART 1: Monthly Trend =====
    var ctx1 = document.getElementById('monthlyTrendChart');
    if (ctx1) {
        try {
            // Safely destroy existing chart
            if (window.monthlyTrendChart) {
                if (typeof window.monthlyTrendChart.destroy === 'function') {
                    window.monthlyTrendChart.destroy();
                }
                window.monthlyTrendChart = null;
            }
            
            window.monthlyTrendChart = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: trendLabels,
                    datasets: [{
                        label: 'রিচার্জ',
                        data: trendRecharge,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102,126,234,0.1)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: '#667eea'
                    }, {
                        label: 'খরচ',
                        data: trendExpense,
                        borderColor: '#f5576c',
                        backgroundColor: 'rgba(245,87,108,0.1)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: '#f5576c'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { boxWidth: 12, padding: 10, font: { size: 10 } }
                        }
                    },
                    scales: {
                        y: { beginAtZero: true, ticks: { font: { size: 9 } } },
                        x: { ticks: { font: { size: 9 } } }
                    }
                }
            });
            console.log('✅ Monthly Trend Chart drawn');
        } catch(e) {
            console.error('Monthly Trend Chart error:', e);
            window.monthlyTrendChart = null;
        }
    }

    // ===== CHART 2: Yearly =====
    var ctx2 = document.getElementById('yearlyChart');
    if (ctx2) {
        try {
            // Safely destroy existing chart
            if (window.yearlyChart) {
                if (typeof window.yearlyChart.destroy === 'function') {
                    window.yearlyChart.destroy();
                }
                window.yearlyChart = null;
            }
            
            var colors = ['rgba(102,126,234,0.7)', 'rgba(245,87,108,0.7)', 'rgba(79,172,254,0.7)'];
            var borderColors = ['#667eea', '#f5576c', '#4facfe'];
            
            window.yearlyChart = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: yearLabels,
                    datasets: [{
                        label: 'বার্ষিক খরচ',
                        data: yearExpense,
                        backgroundColor: colors.slice(0, yearLabels.length),
                        borderColor: borderColors.slice(0, yearLabels.length),
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { boxWidth: 12, padding: 10, font: { size: 10 } }
                        }
                    },
                    scales: {
                        y: { beginAtZero: true, ticks: { font: { size: 9 } } },
                        x: { ticks: { font: { size: 9 } } }
                    }
                }
            });
            console.log('✅ Yearly Chart drawn');
        } catch(e) {
            console.error('Yearly Chart error:', e);
            window.yearlyChart = null;
        }
    }

    // ===== CHART 3: Cost Breakdown =====
    var ctx3 = document.getElementById('costChart');
    if (ctx3) {
        try {
            // Safely destroy existing chart
            if (window.costChart) {
                if (typeof window.costChart.destroy === 'function') {
                    window.costChart.destroy();
                }
                window.costChart = null;
            }
            
            var costData = [rechargeTotal, expenseTotal, demandTotal, vatTotal];
            var hasCostData = costData.some(function(v) { return v > 0; });
            
            if (!hasCostData) {
                costData = [1, 0, 0, 0];
            }

            window.costChart = new Chart(ctx3, {
                type: 'doughnut',
                data: {
                    labels: ['রিচার্জ', 'বিল', 'ডিমান্ড', 'ভ্যাট'],
                    datasets: [{
                        data: costData,
                        backgroundColor: ['#27ae60', '#e74c3c', '#f39c12', '#3498db'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { boxWidth: 12, padding: 10, font: { size: 10 } }
                        }
                    },
                    cutout: '60%'
                }
            });
            console.log('✅ Cost Chart drawn');
        } catch(e) {
            console.error('Cost Chart error:', e);
            window.costChart = null;
        }
    }
}

// ===== Chart.js CDN থেকে লোড করার ফাংশন =====
function loadChartJsFromCDN() {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = function() {
        console.log('✅ Chart.js loaded from CDN');
        showToast('Chart.js লোড হয়েছে!', 'success');
        showAnalytics();
    };
    script.onerror = function() {
        console.error('Failed to load Chart.js');
        showToast('Chart.js লোড করতে ব্যর্থ!', 'error');
    };
    document.head.appendChild(script);
}