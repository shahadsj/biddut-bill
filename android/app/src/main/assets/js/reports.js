// ==================== REPORTS ====================
var REPORT_MONTH_COLORS = {};

function initMonthColors(L) {
    REPORT_MONTH_COLORS = {};
    var monthsEn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var monthsBn = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
    var colors = [
        { bg: '#2ecc71', grad1: '#27ae60', grad2: '#2ecc71' },
        { bg: '#87CEEB', grad1: '#5fa8d3', grad2: '#87CEEB' },
        { bg: '#f1c40f', grad1: '#d4a017', grad2: '#f1c40f' },
        { bg: '#DDA0DD', grad1: '#c77dff', grad2: '#DDA0DD' },
        { bg: '#2ecc71', grad1: '#1e8449', grad2: '#2ecc71' },
        { bg: '#87CEEB', grad1: '#4a90d9', grad2: '#87CEEB' },
        { bg: '#f1c40f', grad1: '#b7950b', grad2: '#f1c40f' },
        { bg: '#DDA0DD', grad1: '#bb6bd9', grad2: '#DDA0DD' },
        { bg: '#2ecc71', grad1: '#145a32', grad2: '#2ecc71' },
        { bg: '#87CEEB', grad1: '#2874a6', grad2: '#87CEEB' },
        { bg: '#f1c40f', grad1: '#9a7d0a', grad2: '#f1c40f' },
        { bg: '#DDA0DD', grad1: '#9b30ff', grad2: '#DDA0DD' }
    ];
    monthsEn.forEach(function(m, i) { REPORT_MONTH_COLORS[m] = colors[i]; });
    monthsBn.forEach(function(m, i) { REPORT_MONTH_COLORS[m] = colors[i]; });
}

function getMonthColor(displayMonth) {
    for (var month in REPORT_MONTH_COLORS) {
        if (displayMonth.indexOf(month) !== -1) return REPORT_MONTH_COLORS[month];
    }
    return { bg: '#0f3460', grad1: '#1a1a2e', grad2: '#0f3460' };
}

function genSlabDefs(L) {
    if (L === 'en') {
        return [
            { name: 'Lifeline (0-50)', min: 0, max: 50, rate: 3.5 },
            { name: '1st Slab (51-75)', min: 51, max: 75, rate: 4 },
            { name: '2nd Slab (76-200)', min: 76, max: 200, rate: 5.45 },
            { name: '3rd Slab (201-300)', min: 201, max: 300, rate: 5.7 },
            { name: '4th Slab (301-400)', min: 301, max: 400, rate: 6.02 },
            { name: '5th Slab (401-600)', min: 401, max: 600, rate: 9.3 },
            { name: '6th Slab (601+)', min: 601, max: Infinity, rate: 10.7 }
        ];
    }
    return [
        { name: 'Lifeline (০-৫০)', min: 0, max: 50, rate: 3.5 },
        { name: '১ম স্ল্যাব (৫১-৭৫)', min: 51, max: 75, rate: 4 },
        { name: '২য় স্ল্যাব (৭৬-২০০)', min: 76, max: 200, rate: 5.45 },
        { name: '৩য় স্ল্যাব (২০১-৩০০)', min: 201, max: 300, rate: 5.7 },
        { name: '৪র্থ স্ল্যাব (৩০১-৪০০)', min: 301, max: 400, rate: 6.02 },
        { name: '৫ম স্ল্যাব (৪০১-৬০০)', min: 401, max: 600, rate: 9.3 },
        { name: '৬ষ্ঠ স্ল্যাব (৬০১+)', min: 601, max: Infinity, rate: 10.7 }
    ];
}

function getMonths(L) {
    if (L === 'en') return ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
}

function showReports() {
    var L = APP.language;
    initMonthColors(L);
    if (!APP.activeMeterId || APP.meters.length === 0) {
        showToast(L==='en'?'Please add a meter first':'প্রথমে একটি মিটার যোগ করুন', 'warning');
        navigateTo('meters');
        return;
    }

    document.getElementById('pageContent').innerHTML = [
        '<div class="card">',
            '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">',
                '<h2>&#x1F4CA; '+(L==='en'?'Reports':'রিপোর্ট')+'</h2>',
                '<div style="display: flex; gap: 10px; align-items: center;">',
                    '<select id="reportMeterSelect" onchange="switchReportMeter(this.value)" style="padding: 8px; border-radius: 8px; border: 1px solid var(--border);">',
                        APP.meters.map(function(m) { return '<option value="'+m.id+'" '+(APP.activeMeterId===m.id?'selected':'')+'>'+escapeHtml(m.name)+' - '+(m.meterNumber||m.meterNo||'')+'</option>'; }).join(''),
                    '</select>',
                '</div>',
            '</div>',
            '<div class="tabs" style="margin-top: 15px;">',
                '<div class="tab active" onclick="switchReportTab(\'monthly\')">&#x1F4C5; '+(L==='en'?'Monthly Summary':'মাসিক সারাংশ')+'</div>',
                '<div class="tab" onclick="switchReportTab(\'slab\')">&#x1F4CA; '+(L==='en'?'Slab Analysis':'স্ল্যাব বিশ্লেষণ')+'</div>',
            '</div>',
            '<div id="reportContent"></div>',
            '<div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">',
                '<button class="btn" onclick="exportToExcel()">&#x1F4E5; '+(L==='en'?'Export to Excel':'এক্সপোর্ট টু এক্সেল')+'</button>',
                '<button class="btn" onclick="printReport()">&#x1F5A8;&#xFE0F; '+(L==='en'?'Print Report':'প্রিন্ট রিপোর্ট')+'</button>',
            '</div>',
        '</div>',
    ].join('');
    switchReportTab('monthly');
}

function switchReportMeter(meterId) {
    APP.activeMeterId = meterId;
    saveData();
    var activeTab = document.querySelector('.tab.active');
    var tabName = activeTab ? (activeTab.textContent.indexOf('Monthly') !== -1 || activeTab.textContent.indexOf('মাসিক') !== -1 ? 'monthly' : 'slab') : 'monthly';
    switchReportTab(tabName);
}

function getMonthlySlabAnalysis(meterId) {
    var L = APP.language;
    var meterData = APP.metersData[meterId];
    if (!meterData) return {};
    var transactions = meterData.transactions || [];
    var bills = transactions.filter(function(t) { return t.type === 'electricity_bill' || t.type === 'bill'; });
    var recharges = transactions.filter(function(t) { return t.type === 'recharge'; });
    var slabDefs = genSlabDefs(L);
    var months = getMonths(L);
    var monthlyData = {};
    
    bills.forEach(function(t) {
        var d = new Date(t.date || t.timestamp);
        if (isNaN(d.getTime())) return;
        var monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        var displayMonth = months[d.getMonth()] + ' ' + d.getFullYear();
        
        if (!monthlyData[monthKey]) {
            var sd = {}, sr = {}, sc = {};
            slabDefs.forEach(function(s) { sd[s.name] = 0; sr[s.name] = s.rate; sc[s.name] = 0; });
            monthlyData[monthKey] = { displayMonth: displayMonth, totalUnits: 0, totalBill: 0, billCount: 0, rechargeCount: 0, rechargeTotal: 0, slabData: sd, slabRates: sr, slabCost: sc };
        }
        monthlyData[monthKey].totalUnits += t.units || 0;
        monthlyData[monthKey].totalBill += t.amount || 0;
        monthlyData[monthKey].billCount++;
    });
    
    Object.keys(monthlyData).forEach(function(key) {
        var m = monthlyData[key];
        var remainingUnits = m.totalUnits;
        slabDefs.forEach(function(slab) {
            if (remainingUnits <= 0) return;
            var slabUnits = slab.max === Infinity ? remainingUnits : Math.min(remainingUnits, slab.max - slab.min + 1);
            if (slabUnits > 0) { m.slabData[slab.name] = slabUnits; m.slabCost[slab.name] = slabUnits * slab.rate; remainingUnits -= slabUnits; }
        });
    });
    
    recharges.forEach(function(t) {
        var d = new Date(t.date || t.timestamp);
        if (isNaN(d.getTime())) return;
        var monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
        if (!monthlyData[monthKey]) {
            var sd = {}, sr = {}, sc = {};
            slabDefs.forEach(function(s) { sd[s.name] = 0; sr[s.name] = s.rate; sc[s.name] = 0; });
            var months = getMonths(L);
            monthlyData[monthKey] = { displayMonth: months[d.getMonth()] + ' ' + d.getFullYear(), totalUnits: 0, totalBill: 0, billCount: 0, rechargeCount: 0, rechargeTotal: 0, slabData: sd, slabRates: sr, slabCost: sc };
        }
        monthlyData[monthKey].rechargeCount++;
        monthlyData[monthKey].rechargeTotal += t.amount || 0;
    });
    
    var sorted = {};
    Object.keys(monthlyData).sort().forEach(function(key) { sorted[key] = monthlyData[key]; });
    return sorted;
}

function switchReportTab(tab) {
    var L = APP.language;
    var months = getMonths(L);
    initMonthColors(L);
    
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(t) { t.classList.remove('active'); });
    tabs.forEach(function(t) {
        if ((tab === 'monthly' && (t.textContent.indexOf('Monthly') !== -1 || t.textContent.indexOf('মাসিক') !== -1)) ||
            (tab === 'slab' && (t.textContent.indexOf('Slab') !== -1 || t.textContent.indexOf('স্ল্যাব') !== -1))) {
            t.classList.add('active');
        }
    });
    
    var content = document.getElementById('reportContent');
    if (!content) return;
    
    var meterData = getActiveMeterData();
    var transactions = (meterData && meterData.transactions) ? meterData.transactions : [];
    
    if (tab === 'monthly') {
        var vatRate = APP.settings.vatRate || 5;
        var rebateRate = APP.settings.rebateRate || 0.85;
        var demandCharge = APP.settings.demandCharge || 294;
        var slabAnalysis = getMonthlySlabAnalysis(APP.activeMeterId);
        var monthlyData = {};
        
        Object.keys(slabAnalysis).forEach(function(key) {
            var m = slabAnalysis[key];
            monthlyData[key] = { display: m.displayMonth, rechargeTotal: 0, rechargeCount: 0, billTotal: m.totalBill, billCount: m.billCount, billUnits: m.totalUnits };
        });
        
        transactions.forEach(function(t) {
            if (t.type !== 'recharge') return;
            var d = new Date(t.date || t.timestamp);
            if (isNaN(d.getTime())) return;
            var key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
            if (monthlyData[key]) { monthlyData[key].rechargeTotal += t.amount || 0; monthlyData[key].rechargeCount++; }
        });
        
        var sortedMonths = Object.keys(monthlyData).sort().reverse();
        
        content.innerHTML = [
            '<style>.monthly-card{background:#fff;border-radius:20px;box-shadow:0 2px 16px rgba(0,0,0,0.07);overflow:hidden;transition:transform 0.2s ease,box-shadow 0.2s ease;margin-bottom:16px}.monthly-card:hover{transform:translateY(-3px);box-shadow:0 6px 24px rgba(0,0,0,0.12)}.monthly-header{padding:25px 18px;display:flex;justify-content:space-between;align-items:center}.monthly-header-left,.monthly-header-right{display:flex;align-items:center;gap:8px}.monthly-tiles{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#fff}.monthly-tile{background:#fff;padding:16px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px}.monthly-tile-left{display:flex;align-items:center;gap:7px;font-size:13px;color:#555}.monthly-tile-right{font-size:17px;font-weight:700;white-space:nowrap}.monthly-footer{display:flex;justify-content:space-between;align-items:center;padding:10px 18px;background:#f9fafb}.monthly-footer-left{display:flex;align-items:center;gap:6px;font-size:13px;color:#666}.monthly-pill{display:inline-flex;align-items:center;justify-content:center;min-width:44px;padding:14px 14px;border-radius:40px;background:#000;font-size:18px;font-weight:600;color:#fff}</style>',
            '<div style="margin-top: 10px;">',
            sortedMonths.map(function(key) {
                var m = monthlyData[key];
                var rechargeAmount = m.rechargeTotal;
                var hasRecharge = rechargeAmount > 0;
                var usableAmount = hasRecharge ? Math.max(0, rechargeAmount - demandCharge) : 0;
                var vat = hasRecharge ? usableAmount * (vatRate / 100) : 0;
                var rebate = hasRecharge ? usableAmount * (rebateRate / 100) : 0;
                var mc = getMonthColor(m.display);
                return [
                    '<div class="monthly-card">',
                        '<div class="monthly-header" style="background: linear-gradient(135deg, '+mc.grad1+', '+mc.grad2+');">',
                            '<div class="monthly-header-left"><span style="font-size:16px;color:white;">&#x1F4C5;</span><span style="color:white;font-size:15px;font-weight:600;">'+m.display+'</span></div>',
                            '<div class="monthly-header-right"><span style="font-size:14px;color:white;opacity:0.9;">&#x1F4B0;</span><span style="color:white;font-size:19px;font-weight:700;">'+rechargeAmount.toFixed(2)+' '+(L==='en'?'Taka':'টাকা')+'</span></div>',
                        '</div>',
                        '<div class="monthly-tiles">',
                            '<div class="monthly-tile" style="background:#f0faf0;"><div class="monthly-tile-left"><span style="font-size:16px;">&#x1F4CB;</span><span>'+(L==='en'?'Usable':'ব্যবহারযোগ্য')+'</span></div><div class="monthly-tile-right" style="color:#e67e22;">'+usableAmount.toFixed(2)+' '+(L==='en'?'Taka':'টাকা')+'</div></div>',
                            '<div class="monthly-tile" style="background:#fffbe6;"><div class="monthly-tile-left"><span style="font-size:16px;">&#x26A1;</span><span>'+(L==='en'?'Demand Charge':'ডিমান্ড চার্জ')+'</span></div><div class="monthly-tile-right" style="color:#e67e22;">'+(hasRecharge ? demandCharge.toFixed(2) : '0.00')+' '+(L==='en'?'Taka':'টাকা')+'</div></div>',
                            '<div class="monthly-tile" style="background:#f3e8ff;"><div class="monthly-tile-left"><span style="font-size:16px;">&#x1F9FE;</span><span>VAT ('+vatRate+'%)</span></div><div class="monthly-tile-right" style="color:#8b5cf6;">'+vat.toFixed(2)+' '+(L==='en'?'Taka':'টাকা')+'</div></div>',
                            '<div class="monthly-tile" style="background:#fce4ec;"><div class="monthly-tile-left"><span style="font-size:16px;">&#x1F4B0;</span><span>'+(L==='en'?'Rebate':'রিবেট')+' ('+rebateRate+'%)</span></div><div class="monthly-tile-right" style="color:#ef4444;">'+rebate.toFixed(2)+' '+(L==='en'?'Taka':'টাকা')+'</div></div>',
                        '</div>',
                        '<div class="monthly-footer"><div class="monthly-footer-left"><span>&#x1F522; '+(L==='en'?'Recharges:':'রিচার্জ সংখ্যা:')+'</span></div><span class="monthly-pill">'+m.rechargeCount+'টি</span></div>',
                    '</div>',
                ].join('');
            }).join(''),
            (sortedMonths.length === 0 ? '<p style="text-align: center; padding: 30px; color: var(--text-light); font-size: 15px;">'+(L==='en'?'No monthly data':'কোনো মাসিক ডাটা নেই')+'</p>' : ''),
            '</div>',
        ].join('');
    } else if (tab === 'slab') {
        var analysis = getMonthlySlabAnalysis(APP.activeMeterId);
        var sortedMonths = Object.keys(analysis).sort().reverse().filter(function(key) { return analysis[key].totalUnits > 0; });
        var totalUnits = 0, totalCost = 0;
        sortedMonths.forEach(function(key) { totalUnits += analysis[key].totalUnits; totalCost += analysis[key].totalBill; });
        var slabColors = ['#4CAF50','#8BC34A','#FFC107','#FF9800','#FF5722','#f44336','#9C27B0'];
        
        content.innerHTML = [
            '<div style="margin-top: 15px;">',
                '<h3>&#x1F4CA; '+(L==='en'?'Slab Analysis':'স্ল্যাব বিশ্লেষণ')+'</h3>',
                '<div style="display: grid; gap: 20px;">',
                sortedMonths.map(function(key) {
                    var m = analysis[key];
                    var avgRate = m.totalUnits > 0 ? (m.totalBill / m.totalUnits) : 0;
                    var activeSlabs = Object.keys(m.slabData).filter(function(k) { return m.slabData[k] > 0; });
                    var mc = getMonthColor(m.displayMonth);
                    
                    return [
                        '<div class="card" style="background:#fff;border:1px solid #e0e0e0;overflow:hidden;">',
                            '<div style="background:linear-gradient(135deg,'+mc.grad1+','+mc.grad2+');color:white;padding:20px;margin:-20px -20px 0 -20px;">',
                                '<h4 style="margin:0 0 15px 0;">&#x1F4C5; '+m.displayMonth+'</h4>',
                                '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;">',
                                    '<div><div style="font-size:12px;opacity:0.7;">'+(L==='en'?'Monthly Units':'মাসিক ইউনিট')+'</div><div style="font-size:24px;font-weight:bold;">'+m.totalUnits.toFixed(2)+'</div></div>',
                                    '<div><div style="font-size:12px;opacity:0.7;">'+(L==='en'?'Monthly Cost':'মাসিক খরচ')+'</div><div style="font-size:24px;font-weight:bold;">'+(L==='en'?'Tk':'৳')+' '+m.totalBill.toFixed(2)+'</div></div>',
                                    '<div><div style="font-size:12px;opacity:0.7;">'+(L==='en'?'Per Unit':'গড়/ইউনিট')+'</div><div style="font-size:24px;font-weight:bold;">'+(L==='en'?'Tk':'৳')+' '+avgRate.toFixed(2)+'</div></div>',
                                '</div>',
                                '<div style="margin-top:10px;font-size:13px;opacity:0.9;text-align:center;">&#x1F4CC; '+m.billCount+' '+(L==='en'?'bills':'টি বিল')+' | &#x1F4B0; '+m.rechargeCount+' '+(L==='en'?'recharges':'টি রিচার্জ')+'</div>',
                            '</div>',
                            '<div style="margin-top:15px;">',
                                '<h5 style="margin-bottom:10px;color:#555;">'+(L==='en'?'Slab-wise cost for ':'স্ল্যাব ভিত্তিক খরচ: ')+m.displayMonth+':</h5>',
                                activeSlabs.map(function(slabKey, idx) {
                                    var units = m.slabData[slabKey];
                                    var rate = m.slabRates[slabKey];
                                    var cost = m.slabCost[slabKey];
                                    return '<div style="margin-bottom:6px;padding:8px 12px;background:#f8f9fa;border-radius:6px;border-left:4px solid '+slabColors[idx%slabColors.length]+';font-size:14px;">'+
                                        '<strong>'+slabKey+'</strong><span style="float:right;">'+units.toFixed(2)+' kWh &times; '+rate+' '+(L==='en'?'Taka':'টাকা')+' = <strong style="color:'+slabColors[idx%slabColors.length]+';">'+(L==='en'?'Tk':'৳')+' '+cost.toFixed(2)+'</strong></span></div>';
                                }).join(''),
                                (activeSlabs.length===0?'<p style="color:var(--text-light);padding:10px;">'+(L==='en'?'No slab data':'কোনো স্ল্যাব ডাটা নেই')+'</p>':''),
                            '</div>',
                        '</div>',
                    ].join('');
                }).join(''),
                (sortedMonths.length===0?'<p style="text-align:center;padding:40px;color:var(--text-light);">'+(L==='en'?'No slab data':'কোনো স্ল্যাব ডাটা নেই')+'</p>':''),
                '<div class="card" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;margin-top:25px;">',
                    '<h4 style="margin:0 0 15px 0;">&#x1F4CA; '+(L==='en'?'Overall Statistics':'পূর্ববর্তী মাসের সামগ্রিক পরিসংখ্যান')+'</h4>',
                    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:15px;text-align:center;">',
                        '<div><div style="font-size:13px;opacity:0.8;">'+(L==='en'?'Total Months':'মোট মাস')+'</div><div style="font-size:32px;font-weight:bold;">'+sortedMonths.length+'</div></div>',
                        '<div><div style="font-size:13px;opacity:0.8;">'+(L==='en'?'Total Units':'মোট ইউনিট')+'</div><div style="font-size:32px;font-weight:bold;">'+totalUnits.toFixed(2)+'</div></div>',
                        '<div><div style="font-size:13px;opacity:0.8;">'+(L==='en'?'Total Cost':'মোট খরচ')+'</div><div style="font-size:32px;font-weight:bold;">'+(L==='en'?'Tk':'৳')+' '+totalCost.toFixed(2)+'</div></div>',
                        '<div><div style="font-size:13px;opacity:0.8;">'+(L==='en'?'Avg Cost/Month':'গড় খরচ/মাস')+'</div><div style="font-size:24px;font-weight:bold;">'+(L==='en'?'Tk':'৳')+' '+(sortedMonths.length>0?(totalCost/sortedMonths.length).toFixed(2):'0.00')+'</div></div>',
                    '</div>',
                '</div>',
            '</div>',
        ].join('');
    }
}

function exportToExcel() {
    var L = APP.language;
    var meterData = getActiveMeterData();
    var transactions = meterData.transactions || [];
    var dateLocale = L==='en'?'en-US':'bn-BD';

    var data = transactions.map(function(t) {
        var row = {};
        row[L==='en'?'Date':'তারিখ'] = new Date(t.date||t.timestamp).toLocaleDateString(dateLocale);
        row[L==='en'?'Type':'ধরন'] = t.type==='recharge' ? (L==='en'?'Recharge':'রিচার্জ') : (L==='en'?'Bill':'বিল');
        row[L==='en'?'Amount (Taka)':'পরিমাণ (টাকা)'] = t.amount||0;
        row[L==='en'?'Units':'ইউনিট'] = t.units||0;
        row[L==='en'?'Description':'বিবরণ'] = t.description||'';
        return row;
    });
    
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, L==='en'?'Transactions':'ট্রানজেকশন');
    var fileName = L==='en' ? 'electricity_bill_report_'+new Date().toISOString().split('T')[0]+'.xlsx' : 'বিদ্যুৎ_বিল_রিপোর্ট_'+new Date().toISOString().split('T')[0]+'.xlsx';
    XLSX.writeFile(wb, fileName);
    showToast(L==='en'?'Excel file downloaded':'এক্সেল ফাইল ডাউনলোড হয়েছে', 'success');
}

function printReport() {
    window.print();
}
