function escapeHtml(s) {
    if (!s) return "";
    return s.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;");
}

function __(k) {
    var l = APP.language || "bn";
    return APP.translations && APP.translations[l] && APP.translations[l][k] ? APP.translations[l][k] : 
           APP.translations && APP.translations["bn"] && APP.translations["bn"][k] ? APP.translations["bn"][k] : k;
}

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
    
    var transactions = meterData.transactions || [];
    var tariffRates = APP.tariffRates || [];
    
    // মাস অনুযায়ী গ্রুপিং
    var monthlyData = {};
    
    for (var i = 0; i < transactions.length; i++) {
        var t = transactions[i];
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
        var monthKey = year + '-' + String(monthIndex + 1).padStart(2, '0');
        var displayMonth = banglaMonths[monthIndex] + ' ' + year;
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                displayMonth: displayMonth,
                transactions: [],
                rechargeTotal: 0,
                rechargeCount: 0,
                billTotal: 0,
                billCount: 0,
                totalUnits: 0
            };
        }
        
        monthlyData[monthKey].transactions.push(t);
        
        if (t.type === 'recharge') {
            monthlyData[monthKey].rechargeTotal += (t.amount || 0);
            monthlyData[monthKey].rechargeCount++;
        } else if (t.type === 'electricity_bill' || t.type === 'bill') {
            monthlyData[monthKey].billTotal += (t.amount || 0);
            monthlyData[monthKey].billCount++;
            monthlyData[monthKey].totalUnits += (t.units || 0);
        }
    }
    
    // প্রতিটি মাসের জন্য স্ল্যাব ডিস্ট্রিবিউশন করুন
    var sortedKeys = Object.keys(monthlyData).sort();
    
    for (var m = 0; m < sortedKeys.length; m++) {
        var key = sortedKeys[m];
        var data = monthlyData[key];
        var totalUnits = data.totalUnits || 0;
        var remainingUnits = totalUnits;
        
        var slabData = {};
        var slabCost = {};
        var slabRates = {};
        
        // ✅ সঠিক স্ল্যাব ডিস্ট্রিবিউশন (Lifeline ৫০ ইউনিট)
        for (var s = 0; s < tariffRates.length; s++) {
            if (remainingUnits <= 0) break;
            
            var slab = tariffRates[s];
            var min = slab.range[0];
            var max = slab.range[1];
            var rate = slab.rate;
            
            var maxUnitsInSlab = (max === null || max === undefined) ? Infinity : max - min + 1;
            var unitsInThisSlab = Math.min(remainingUnits, maxUnitsInSlab);
            
            // ✅ বিশেষ চেক: Lifeline স্ল্যাব ৫০ ইউনিটের বেশি হবে না
            // স্ল্যাবের নাম চেক করুন (বাংলা বা ইংরেজি)
            var slabName = slab.name || '';
            if (slabName === 'Lifeline' || 
                slabName === 'Lifeline (0-50)' || 
                slabName === 'Lifeline (০-৫০)' ||
                slabName.indexOf('Lifeline') !== -1) {
                unitsInThisSlab = Math.min(unitsInThisSlab, 50);
            }
            
            slabData[slab.name] = unitsInThisSlab;
            slabRates[slab.name] = rate;
            slabCost[slab.name] = unitsInThisSlab * rate;
            
            remainingUnits -= unitsInThisSlab;
        }
        
        // summary-তে যোগ করুন
        summary[key] = {
            displayMonth: data.displayMonth,
            recharge: data.rechargeTotal,
            bill: data.billTotal,
            balance: data.rechargeTotal - data.billTotal,
            units: data.totalUnits,
            billCount: data.billCount,
            rechargeCount: data.rechargeCount,
            slabData: slabData,
            slabRates: slabRates,
            slabCost: slabCost,
            sortKey: key
        };
    }
    
    return summary;
}

// ==================== TOAST NOTIFICATION (STACK VERSION) ====================
function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    
    var toast = document.createElement('div');
    toast.className = 'toast';
    
    var colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    toast.style.background = colors[type] || colors.info;
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '10px';
    toast.style.marginBottom = '8px';
    toast.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    toast.style.animation = 'slideInRight 0.3s ease';
    toast.style.position = 'relative';
    toast.style.paddingRight = '35px';
    toast.textContent = message;
    
    // Close button
    var closeBtn = document.createElement('span');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        opacity: 0.7;
        font-size: 16px;
        padding: 2px 6px;
        border-radius: 50%;
        transition: all 0.2s ease;
    `;
    closeBtn.onmouseover = function() { this.style.opacity = '1'; };
    closeBtn.onmouseout = function() { this.style.opacity = '0.7'; };
    closeBtn.onclick = function() {
        removeToast(toast);
    };
    toast.appendChild(closeBtn);
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    var timeout = setTimeout(function() {
        removeToast(toast);
    }, 3000);
    
    // Pause on hover
    toast.onmouseenter = function() { clearTimeout(timeout); };
    toast.onmouseleave = function() {
        timeout = setTimeout(function() {
            removeToast(toast);
        }, 2000);
    };
}

function removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(function() {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

function getRandomColor() {
    var colors = ['#667eea','#764ba2','#f093fb','#f5576c','#4facfe','#00f2fe','#43e97b','#38f9d7'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ==================== BADGE SYSTEM ====================

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

// ==================== CHECK BADGES ====================
function checkBadges() {
    console.log('🏅 Checking badges...');
    
    var allTransactions = [];
    var totalRechargeAmount = 0;
    var totalExpendedAmount = 0;
    
    for (var meterId in APP.metersData) {
        if (APP.metersData.hasOwnProperty(meterId)) {
            var md = APP.metersData[meterId];
            if (md.transactions) {
                allTransactions = allTransactions.concat(md.transactions);
                totalRechargeAmount += md.totalRecharge || 0;
                totalExpendedAmount += md.totalExpended || 0;
            }
        }
    }
    
    var transactionCount = allTransactions.length;
    var meterCount = APP.meters.length;
    
    console.log('📊 Total transactions:', transactionCount);
    console.log('💰 Total recharge:', totalRechargeAmount);
    console.log('💸 Total expense:', totalExpendedAmount);
    console.log('⚡ Total meters:', meterCount);
    
    var L = APP.language || 'bn';
    var newBadgeEarned = false;
    
    if (transactionCount >= 1 && !APP.badges.includes(getBadgeText('first'))) { 
        APP.badges.push(getBadgeText('first')); 
        newBadgeEarned = true; 
    }
    if (transactionCount >= 5 && !APP.badges.includes(getBadgeText('5_plus'))) { 
        APP.badges.push(getBadgeText('5_plus')); 
        newBadgeEarned = true; 
    }
    if (transactionCount >= 10 && !APP.badges.includes(getBadgeText('10_plus'))) { 
        APP.badges.push(getBadgeText('10_plus')); 
        newBadgeEarned = true; 
    }
    if (transactionCount >= 25 && !APP.badges.includes(getBadgeText('25_plus'))) { 
        APP.badges.push(getBadgeText('25_plus')); 
        newBadgeEarned = true; 
    }
    if (transactionCount >= 50 && !APP.badges.includes(getBadgeText('50_plus'))) { 
        APP.badges.push(getBadgeText('50_plus')); 
        newBadgeEarned = true; 
    }
    if (transactionCount >= 100 && !APP.badges.includes(getBadgeText('100_plus'))) { 
        APP.badges.push(getBadgeText('100_plus')); 
        newBadgeEarned = true; 
    }
    if (transactionCount >= 200 && !APP.badges.includes(getBadgeText('200_plus'))) { 
        APP.badges.push(getBadgeText('200_plus')); 
        newBadgeEarned = true; 
    }
    if (transactionCount >= 500 && !APP.badges.includes(getBadgeText('500_plus'))) { 
        APP.badges.push(getBadgeText('500_plus')); 
        newBadgeEarned = true; 
    }
    
    if (totalRechargeAmount >= 1000 && !APP.badges.includes(getBadgeText('recharge_1k'))) { 
        APP.badges.push(getBadgeText('recharge_1k')); 
        newBadgeEarned = true; 
    }
    if (totalRechargeAmount >= 5000 && !APP.badges.includes(getBadgeText('recharge_5k'))) { 
        APP.badges.push(getBadgeText('recharge_5k')); 
        newBadgeEarned = true; 
    }
    if (totalRechargeAmount >= 10000 && !APP.badges.includes(getBadgeText('recharge_10k'))) { 
        APP.badges.push(getBadgeText('recharge_10k')); 
        newBadgeEarned = true; 
    }
    if (totalRechargeAmount >= 50000 && !APP.badges.includes(getBadgeText('recharge_50k'))) { 
        APP.badges.push(getBadgeText('recharge_50k')); 
        newBadgeEarned = true; 
    }
    
    if (totalExpendedAmount >= 10000 && !APP.badges.includes(getBadgeText('expense_10k'))) { 
        APP.badges.push(getBadgeText('expense_10k')); 
        newBadgeEarned = true; 
    }
    if (totalExpendedAmount >= 50000 && !APP.badges.includes(getBadgeText('expense_50k'))) { 
        APP.badges.push(getBadgeText('expense_50k')); 
        newBadgeEarned = true; 
    }
    
    if (meterCount >= 2 && !APP.badges.includes(getBadgeText('meters_2'))) { 
        APP.badges.push(getBadgeText('meters_2')); 
        newBadgeEarned = true; 
    }
    if (meterCount >= 5 && !APP.badges.includes(getBadgeText('meters_5'))) { 
        APP.badges.push(getBadgeText('meters_5')); 
        newBadgeEarned = true; 
    }
    
    if (newBadgeEarned) {
        showToast(APP.language === 'en' ? '🎉 New badge earned!' : '🎉 নতুন ব্যাজ অর্জিত!', 'success');
    }
    
    saveData();
    console.log('🏅 Total badges:', APP.badges.length);
    return APP.badges;
}

function checkBadgesOnLoad() {
    console.log('🏅 Checking badges on load...');
    return checkBadges();
}

function switchMeter(meterId) {
    if (APP.activeMeterId === meterId) return;
    APP.activeMeterId = meterId;
    saveData();
    if (APP.currentPage === 'dashboard') showDashboard();
    else navigateTo('dashboard');
}

// ==================== MISSING FUNCTIONS ====================

function applySettings() {
    if (APP.settings.fontSize) {
        document.documentElement.style.setProperty('--font-size', APP.settings.fontSize + 'px');
    }
    
    if (APP.settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    if (APP.settings.highContrast) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
}

function getActiveMeterData() {
    if (!APP.activeMeterId) return null;
    return APP.metersData[APP.activeMeterId] || null;
}

function updateActiveMeterData(data) {
    if (!APP.activeMeterId) return;
    APP.metersData[APP.activeMeterId] = data;
    saveData();
}

function getMeterData(meterId) {
    return APP.metersData[meterId] || null;
}

// ==================== ACTIVITY LOG ====================
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
    
    if (typeof database !== "undefined" && database && APP.currentUser) {
        var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
        var ref = database.ref('users/' + userEmail + '/activities');
        ref.push(log).catch(function(err) {
            console.warn('Activity log save error:', err);
        });
    }
    
    var logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
    logs.push(log);
    if (logs.length > 1000) logs = logs.slice(-500);
    localStorage.setItem('activity_logs', JSON.stringify(logs));
}

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

// ==================== SAVE DATA (ONLY FIREBASE) ====================
function saveData() {
    if (typeof saveAllToCloud === 'function') {
        saveAllToCloud().catch(function(error) {
            console.warn('⚠️ Save to Firebase failed:', error);
        });
    } else {
        console.warn('⚠️ saveAllToCloud function not available');
    }
}

// ==================== LANGUAGE TOGGLE ====================
function toggleLanguage() {
    if (APP.language === 'bn') {
        APP.language = 'en';
    } else {
        APP.language = 'bn';
    }
    
    saveData();
    updateAllSidebarTexts();
    updateSidebarUserInfo();
    
    var currentPage = APP.currentPage || 'dashboard';
    navigateTo(currentPage);
    
    var msg = APP.language === 'en' ? '🌐 Language changed to English' : '🌐 ভাষা পরিবর্তন করে বাংলা করা হয়েছে';
    showToast(msg, 'success');
}

function updateAllSidebarTexts() {
    var L = APP.language;
    var translations = APP.translations[L] || APP.translations.bn;
    
    document.querySelectorAll('.nav-text[data-key]').forEach(function(el) {
        var key = el.getAttribute('data-key');
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });
    
    var roleEl = document.getElementById('sidebarUserRole');
    if (roleEl && APP.currentUser) {
        roleEl.textContent = APP.currentUser.role === 'admin' ? 
            (L === 'en' ? 'Admin' : 'অ্যাডমিন') : 
            (L === 'en' ? 'User' : 'ইউজার');
    }
    
    var langToggle = document.querySelector('.lang-toggle-btn span');
    if (langToggle) {
        langToggle.textContent = L === 'bn' ? '🇺🇸 English' : '🇧🇩 বাংলা';
    }
}

// ==================== SLAB BASED UNIT CALCULATOR ====================
function calculateUnitsFromAmount(amount, currentBalance, meterId) {
    var diffAmount = Math.abs(amount - currentBalance);
    if (diffAmount <= 0) return 0;
    
    var meterData = APP.metersData[meterId];
    if (!meterData) return 0;
    
    var transactions = meterData.transactions || [];
    
    // বর্তমান মাসের ব্যবহার করা ইউনিট ট্র্যাক করুন
    var now = new Date();
    var currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    
    var usedUnitsThisMonth = 0;
    for (var i = 0; i < transactions.length; i++) {
        var t = transactions[i];
        if (t.type === 'electricity_bill' || t.type === 'bill') {
            var tDate = new Date(t.date || t.timestamp);
            if (isNaN(tDate.getTime())) continue;
            var tMonth = tDate.getFullYear() + '-' + String(tDate.getMonth() + 1).padStart(2, '0');
            if (tMonth === currentMonth) {
                usedUnitsThisMonth += (t.units || 0);
            }
        }
    }
    
    var tariffRates = APP.tariffRates || [];
    var remainingTaka = diffAmount;
    var totalUnits = 0;
    var usedUnits = usedUnitsThisMonth;
    
    for (var i = 0; i < tariffRates.length; i++) {
        if (remainingTaka <= 0) break;
        
        var slab = tariffRates[i];
        var min = slab.range[0];
        var max = slab.range[1];
        var rate = slab.rate;
        
        var maxUnitsInSlab = (max === null || max === undefined) ? Infinity : max - min + 1;
        
        // এই স্ল্যাবে ইতিমধ্যে কত ইউনিট ব্যবহার হয়েছে
        var usedInThisSlab = Math.max(0, Math.min(usedUnits - min + 1, maxUnitsInSlab));
        var remainingInThisSlab = maxUnitsInSlab - usedInThisSlab;
        
        if (remainingInThisSlab <= 0) continue;
        
        var costForRemainingUnits = remainingInThisSlab * rate;
        var takaInThisSlab = Math.min(remainingTaka, costForRemainingUnits);
        var unitsInThisSlab = takaInThisSlab / rate;
        
        totalUnits += unitsInThisSlab;
        remainingTaka -= takaInThisSlab;
        usedUnits += unitsInThisSlab;
    }
    
    return Math.round(totalUnits * 100) / 100;
}

// ==================== TRANSLATION HELPER ====================
function __(key) {
    var L = APP.language || 'bn';
    var translations = APP.translations[L] || APP.translations.bn;
    return translations[key] || key;
}

