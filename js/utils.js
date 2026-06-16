function escapeHtml(s){if(!s)return"";return s.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#039;").replace(/"/g,"&quot;");}

function __(k){const l=APP.language||"bn";return APP.translations&&APP.translations[l]&&APP.translations[l][k]?APP.translations[l][k]:APP.translations&&APP.translations["bn"]&&APP.translations["bn"][k]?APP.translations["bn"][k]:k;}

// ==================== UTILITY FUNCTIONS ====================
function calculateBalance(meterId) {
    var meterData = APP.metersData[meterId];
    if (!meterData) return 0;
    return meterData.currentBalance || 0;
}

function getTotalRecharge(meterId) {
    var meterData = APP.metersData[meterId];
    if (!meterData) return 0;
    return meterData.totalRecharge || 0;
}

function getTotalExpense(meterId) {
    var meterData = APP.metersData[meterId];
    if (!meterData) return 0;
    return meterData.totalExpended || 0;
}

function getLastExpense(meterId) {
    var meterData = APP.metersData[meterId];
    if (!meterData || !meterData.transactions) return 0;
    var bills = meterData.transactions
        .filter(function(t) { return t.type === 'electricity_bill' || t.type === 'bill'; })
        .sort(function(a, b) { return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp); });
    return bills.length > 0 ? bills[0].amount : 0;
}

function getRecentTransactions(meterId, count) {
    var meterData = APP.metersData[meterId];
    if (!meterData || !meterData.transactions) return [];
    return meterData.transactions
        .sort(function(a, b) { return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp); })
        .slice(0, count || 5);
}

function calculateBillFromUnits(units) {
    var total = 0;
    var remaining = units;
    var tariffRates = APP.tariffRates || [];
    for (var i = 0; i < tariffRates.length; i++) {
        var slab = tariffRates[i];
        var min = slab.range[0], max = slab.range[1];
        var slabUnits = (max === null || max === undefined) ? remaining : Math.min(remaining, max - min + 1);
        if (slabUnits > 0) { total += slabUnits * slab.rate; remaining -= slabUnits; }
        if (remaining <= 0) break;
    }
    return total + (APP.settings.demandCharge || 0);
}

function calculateUnitsFromTaka(taka) {
    var demandCharge = APP.settings.demandCharge || 0;
    var usableTaka = Math.max(0, taka - demandCharge);
    if (usableTaka <= 0) return 0;
    var tariffRates = APP.tariffRates || [];
    var units = 0;
    var remainingTaka = usableTaka;
    for (var i = 0; i < tariffRates.length; i++) {
        var slab = tariffRates[i];
        var min = slab.range[0], max = slab.range[1];
        var maxUnitsInSlab = (max === null || max === undefined) ? Infinity : max - min + 1;
        var costForFullSlab = maxUnitsInSlab === Infinity ? Infinity : maxUnitsInSlab * slab.rate;
        var takaForThisSlab = Math.min(remainingTaka, costForFullSlab);
        units += takaForThisSlab / slab.rate;
        remainingTaka -= takaForThisSlab;
        if (remainingTaka <= 0) break;
    }
    return units;
}

function getMonthlySummary(meterId) {
    var summary = {};
    var meterData = APP.metersData[meterId];
    if (!meterData || !meterData.transactions) return summary;
    
    meterData.transactions.forEach(function(t) {
        var date, dateStr = t.date || t.timestamp || '';
        try {
            if (dateStr.indexOf('T') !== -1 || dateStr.indexOf('-') !== -1) {
                date = new Date(dateStr);
            } else if (dateStr.indexOf('/') !== -1) {
                var parts = dateStr.split('/');
                if (parts.length === 3) {
                    var day = parseInt(convertBanglaToEnglish(parts[0].trim()));
                    var month = parseInt(convertBanglaToEnglish(parts[1].trim()));
                    var year = parseInt(convertBanglaToEnglish(parts[2].trim()));
                    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) date = new Date(year, month - 1, day);
                }
            } else if (dateStr.indexOf(',') !== -1) {
                var datePart = dateStr.split(',')[0].trim();
                if (datePart.indexOf('/') !== -1) {
                    var parts = datePart.split('/');
                    if (parts.length === 3) {
                        var day = parseInt(convertBanglaToEnglish(parts[0].trim()));
                        var month = parseInt(convertBanglaToEnglish(parts[1].trim()));
                        var year = parseInt(convertBanglaToEnglish(parts[2].trim()));
                        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) date = new Date(year, month - 1, day);
                    }
                }
            }
            if (!date || isNaN(date.getTime())) { date = new Date(); }
        } catch(e) { date = new Date(); }
        
        var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        var banglaMonths = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var monthKey = year + '-' + String(monthIndex + 1).padStart(2, '0') + '-' + monthNames[monthIndex];
        var displayMonth = banglaMonths[monthIndex] + ' ' + year;
        
        if (!summary[monthKey]) {
            summary[monthKey] = { recharge: 0, bill: 0, balance: 0, units: 0, displayMonth: displayMonth, sortKey: '' + year + String(monthIndex + 1).padStart(2, '0') };
        }
        if (t.type === 'recharge') { summary[monthKey].recharge += (t.amount||0); summary[monthKey].balance += (t.amount||0); }
        else if (t.type === 'electricity_bill' || t.type === 'bill') { summary[monthKey].bill += (t.amount||0); summary[monthKey].balance -= (t.amount||0); summary[monthKey].units += (t.units||0); }
    });
    
    var sortedSummary = {};
    var sortedKeys = Object.keys(summary).sort(function(a, b) { return (summary[a].sortKey||'').localeCompare(summary[b].sortKey||''); });
    sortedKeys.forEach(function(key) { sortedSummary[key] = summary[key]; });
    return sortedSummary;
}

function convertBanglaToEnglish(banglaNum) {
    if (!banglaNum && banglaNum !== 0) return '0';
    var banglaDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    var englishDigits = ['0','1','2','3','4','5','6','7','8','9'];
    var result = '';
    var str = String(banglaNum).trim();
    for (var i = 0; i < str.length; i++) {
        var index = banglaDigits.indexOf(str[i]);
        result += (index !== -1) ? englishDigits[index] : str[i];
    }
    return result;
}

function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.background = type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : type === 'warning' ? 'var(--warning)' : 'var(--primary)';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3000);
}

function getRandomColor() {
    var colors = ['#667eea','#764ba2','#f093fb','#f5576c','#4facfe','#00f2fe','#43e97b','#38f9d7'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getBadgeText(key) {
    var L = APP.language || 'bn';
    var badges = {
        '500_plus': { bn: '🏆 ৫০০+ বিল', en: '🏆 500+ Bills' },
        '200_plus': { bn: '🥇 ২০০+ বিল', en: '🥇 200+ Bills' },
        '100_plus': { bn: '💎 ১০০টি বিল', en: '💎 100 Bills' },
        '50_plus': { bn: '🌟 ৫০টি বিল', en: '🌟 50 Bills' },
        '25_plus': { bn: '🎯 ২৫টি বিল', en: '🎯 25 Bills' },
        '10_plus': { bn: '🎖️ ১০টি বিল', en: '🎖️ 10 Bills' },
        '5_plus': { bn: '⭐ ৫টি বিল', en: '⭐ 5 Bills' },
        'first': { bn: '🌱 প্রথম বিল', en: '🌱 First Bill' },
        'recharge_50k': { bn: '💰 ৫০,০০০+ রিচার্জ', en: '💰 50,000+ Recharge' },
        'recharge_10k': { bn: '💵 ১০,০০০+ রিচার্জ', en: '💵 10,000+ Recharge' },
        'recharge_5k': { bn: '🪙 ৫,০০০+ রিচার্জ', en: '🪙 5,000+ Recharge' },
        'recharge_1k': { bn: '💸 ১,০০০+ রিচার্জ', en: '💸 1,000+ Recharge' },
        'expense_50k': { bn: '📊 ৫০,০০০+ খরচ', en: '📊 50,000+ Expense' },
        'expense_10k': { bn: '📈 ১০,০০০+ খরচ', en: '📈 10,000+ Expense' },
        'meters_5': { bn: '🔌 ৫+ মিটার', en: '🔌 5+ Meters' },
        'meters_2': { bn: '⚡ একাধিক মিটার', en: '⚡ Multiple Meters' }
    };
    var b = badges[key];
    return b ? b[L] : key;
}

function checkBadgesOnLoad() {
    var allTransactions = Object.values(APP.metersData).reduce(function(sum, meter) { return sum + (meter.transactions ? meter.transactions.length : 0); }, 0);
    var totalRechargeAmount = Object.values(APP.metersData).reduce(function(sum, meter) { return sum + (meter.totalRecharge || 0); }, 0);
    var totalExpendedAmount = Object.values(APP.metersData).reduce(function(sum, meter) { return sum + (meter.totalExpended || 0); }, 0);
    
    APP.badges = [];
    if (allTransactions >= 500) APP.badges.push(getBadgeText('500_plus'));
    if (allTransactions >= 200) APP.badges.push(getBadgeText('200_plus'));
    if (allTransactions >= 100) APP.badges.push(getBadgeText('100_plus'));
    if (allTransactions >= 50) APP.badges.push(getBadgeText('50_plus'));
    if (allTransactions >= 25) APP.badges.push(getBadgeText('25_plus'));
    if (allTransactions >= 10) APP.badges.push(getBadgeText('10_plus'));
    if (allTransactions >= 5) APP.badges.push(getBadgeText('5_plus'));
    if (allTransactions >= 1) APP.badges.push(getBadgeText('first'));
    if (totalRechargeAmount >= 50000) APP.badges.push(getBadgeText('recharge_50k'));
    else if (totalRechargeAmount >= 10000) APP.badges.push(getBadgeText('recharge_10k'));
    else if (totalRechargeAmount >= 5000) APP.badges.push(getBadgeText('recharge_5k'));
    else if (totalRechargeAmount >= 1000) APP.badges.push(getBadgeText('recharge_1k'));
    if (totalExpendedAmount >= 50000) APP.badges.push(getBadgeText('expense_50k'));
    else if (totalExpendedAmount >= 10000) APP.badges.push(getBadgeText('expense_10k'));
    if (APP.meters.length >= 5) APP.badges.push(getBadgeText('meters_5'));
    if (APP.meters.length >= 2) APP.badges.push(getBadgeText('meters_2'));
    saveData();
}

function checkBadges() {
    var allTransactions = Object.values(APP.metersData).reduce(function(sum, meter) { return sum + (meter.transactions ? meter.transactions.length : 0); }, 0);
    var newBadgeEarned = false;
    
    if (allTransactions >= 5 && !APP.badges.includes(getBadgeText('5_plus'))) { APP.badges.push(getBadgeText('5_plus')); newBadgeEarned = true; }
    if (allTransactions >= 10 && !APP.badges.includes(getBadgeText('10_plus'))) { APP.badges.push(getBadgeText('10_plus')); newBadgeEarned = true; }
    if (allTransactions >= 25 && !APP.badges.includes(getBadgeText('25_plus'))) { APP.badges.push(getBadgeText('25_plus')); newBadgeEarned = true; }
    if (allTransactions >= 50 && !APP.badges.includes(getBadgeText('50_plus'))) { APP.badges.push(getBadgeText('50_plus')); newBadgeEarned = true; }
    if (allTransactions >= 100 && !APP.badges.includes(getBadgeText('100_plus'))) { APP.badges.push(getBadgeText('100_plus')); newBadgeEarned = true; }
    if (allTransactions >= 200 && !APP.badges.includes(getBadgeText('200_plus'))) { APP.badges.push(getBadgeText('200_plus')); newBadgeEarned = true; }
    if (allTransactions >= 500 && !APP.badges.includes(getBadgeText('500_plus'))) { APP.badges.push(getBadgeText('500_plus')); newBadgeEarned = true; }
    
    if (newBadgeEarned) showToast(APP.language==='en'?'New badge earned!':'🎉 নতুন ব্যাজ অর্জিত!', 'success');
    saveData();
}

function switchMeter(meterId) {
    if (APP.activeMeterId === meterId) return;
    APP.activeMeterId = meterId;
    saveData();
    if (APP.currentPage === 'dashboard') showDashboard();
    else navigateTo('dashboard');
}

// ==================== MISSING FUNCTIONS ====================

// applySettings - Settings apply করার জন্য
function applySettings() {
    // Font size apply
    if (APP.settings.fontSize) {
        document.documentElement.style.setProperty('--font-size', APP.settings.fontSize + 'px');
    }
    
    // Dark mode
    if (APP.settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    // High contrast
    if (APP.settings.highContrast) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
}

// getActiveMeterData - বর্তমান মিটারের ডাটা পাওয়ার জন্য
function getActiveMeterData() {
    if (!APP.activeMeterId) return null;
    return APP.metersData[APP.activeMeterId] || null;
}

// updateActiveMeterData - বর্তমান মিটারের ডাটা আপডেট করার জন্য
function updateActiveMeterData(data) {
    if (!APP.activeMeterId) return;
    APP.metersData[APP.activeMeterId] = data;
    saveData();
}

// getMeterData - নির্দিষ্ট মিটারের ডাটা পাওয়ার জন্য
function getMeterData(meterId) {
    return APP.metersData[meterId] || null;
}

// logActivity - অ্যাক্টিভিটি লগ করার জন্য
function logActivity(type, details) {
    if (!APP.currentUser) return;
    
    var log = {
        type: type,
        userName: APP.currentUser.name || 'User',
        userEmail: APP.currentUser.email || '',
        userId: APP.currentUser.id || '',
        details: details || '',
        timestamp: Date.now(),
        deviceInfo: {
            platform: navigator.platform || 'Unknown',
            language: navigator.language || 'Unknown',
            userAgent: navigator.userAgent || 'Unknown'
        }
    };
    
    // Save to Firebase if available
    if (typeof database !== "undefined" && database && APP.currentUser) {
        var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
        var ref = database.ref('users/' + userEmail + '/activities');
        ref.push(log).catch(function(err) {
            console.warn('Activity log save error:', err);
        });
    }
    
    // Also save locally
    var logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    logs.push(log);
    if (logs.length > 1000) logs = logs.slice(-500);
    localStorage.setItem('activity_logs', JSON.stringify(logs));
}

// getActivityLogs - অ্যাক্টিভিটি লগ পাওয়ার জন্য
function getActivityLogs(type, limit) {
    var logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    
    if (type && type !== 'all') {
        logs = logs.filter(function(log) { return log.type === type; });
    }
    
    logs.sort(function(a, b) { return b.timestamp - a.timestamp; });
    
    if (limit) {
        logs = logs.slice(0, limit);
    }
    
    return logs;
}