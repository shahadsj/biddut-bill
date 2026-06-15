const APP = {
    currentUser: null,
    activeMeterId: null,
    meters: [],
    metersData: {},
    settings: {
        vatRate: 5,
        rebateRate: 0.85,
        demandCharge: 294,
        darkMode: false,
        highContrast: false,
        fontSize: 14,
        autoBackupTime: '02:00',
        retentionDays: 30
    },
    tariffRates: [
        { range: [0, 50], rate: 3.5, name: "Lifeline" },
        { range: [51, 75], rate: 4, name: "1st Slab" },
        { range: [76, 200], rate: 5.45, name: "2nd Slab" },
        { range: [201, 300], rate: 5.7, name: "3rd Slab" },
        { range: [301, 400], rate: 6.02, name: "4th Slab" },
        { range: [401, 600], rate: 9.3, name: "5th Slab" },
        { range: [601, null], rate: 10.7, name: "6th Slab" }
    ],
    savingsGoal: 0,
    badges: [],
    currentPage: 'dashboard',
    language: 'bn', // 'bn' or 'en'
        translations: {
        bn: {
            sidebarDashboard: 'ড্যাশবোর্ড',
            sidebarMeters: 'মিটার ম্যানেজমেন্ট',
            sidebarTransactions: 'ট্রানজেকশন',
            sidebarCalculator: 'ক্যালকুলেটর',
            sidebarReports: 'রিপোর্ট',
            sidebarAnalytics: 'এনালিটিক্স',
            sidebarSettings: 'সেটিংস',
            sidebarBackup: 'ব্যাকআপ',
            sidebarProfile: 'প্রোফাইল',
            sidebarAdmin: 'অ্যাডমিন প্যানেল',
            sidebarLogout: 'লগআউট',
            currentMeter: 'বর্তমান মিটার:',
            langLabel: 'EN',
            langBtn: 'বাংলা',
            dashboard: 'ড্যাশবোর্ড',
            balance: 'বর্তমান ব্যালেন্স',
            totalRecharge: 'মোট রিচার্জ',
            totalExpense: 'মোট খরচ',
      
// ==================== SESSION MANAGEMENT ====================
};



// ==================== LANGUAGE SYSTEM ====================
function __(key) {
    const lang = APP.language || 'bn';
    return APP.translations[lang][key] || APP.translations['bn'][key] || key;
}

function toggleLanguage() {
    APP.language = APP.language === 'bn' ? 'en' : 'bn';
    saveData();
    
    // Update all sidebar nav texts
    updateAllSidebarTexts();
    
    // Update sidebar user info role text
    updateSidebarUserInfo();
    
    // Re-render current page
    if (APP.currentUser) {
        navigateTo(APP.currentPage);
    }
    
    showToast(APP.language === 'en' ? '✅ Language changed to English' : '✅ ভাষা পরিবর্তন করে বাংলা করা হয়েছে', 'success');
}

// ==================== ACTIVITY LOG SYSTEM ====================
function logActivity(type, details) {
    try {
        const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
        const logEntry = {
            id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            type: type, // 'login', 'register', 'logout', 'recharge', 'bill', 'meter'
            userId: APP.currentUser ? APP.currentUser.id : 'unknown',
            userName: APP.currentUser ? APP.currentUser.name : 'Unknown',
            userEmail: APP.currentUser ? APP.currentUser.email : 'unknown',
            details: details,
            deviceInfo: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language
            },
            timestamp: new Date().toISOString()
        };
        logs.push(logEntry);
        // Keep only last 500 logs
        if (logs.length > 500) {
            logs.splice(0, logs.length - 500);
        }
        localStorage.setItem('activityLogs', JSON.stringify(logs));
    } catch (error) {
        console.error('Activity log error:', error);
    }
}

function getActivityLogs(filter = 'all', limit = 100) {
    try {
        const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
        let filtered = logs;
        if (filter !== 'all') {
            filtered = logs.filter(log => log.type === filter);
        }
        return filtered.reverse().slice(0, limit);
    } catch (error) {
        console.error('Get activity logs error:', error);
        return [];
    }
}

function clearActivityLogs() {
    localStorage.setItem('activityLogs', '[]');
    showToast(APP.language === 'en' ? '✅ Activity logs cleared' : '✅ অ্যাক্টিভিটি লগ ক্লিয়ার করা হয়েছে', 'success');
}

function createDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.some(u => u.email === 'admin@bill.com' || u.role === 'admin');
    
    if (!adminExists) {
        const defaultAdmin = {
            id: 'admin_' + Date.now().toString(),
            name: 'Admin',
            email: 'admin@bill.com',
            password: 'admin123',
            role: 'admin',
            deviceInfo: {
                ip: 'localhost',
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language
            },
            registeredAt: new Date().toISOString()
        };
        
        users.push(defaultAdmin);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Default admin created: admin@bill.com / admin123');
    }
}

function init() {
    createDefaultAdmin();
    loadData();
    checkAuth();
    applySettings();
    setupKeyboardShortcuts();
    updateAllSidebarTexts();
    
    if (APP.currentUser) {
        document.getElementById('authPage').style.display = 'none';
        document.getElementById('appPage').style.display = 'block';
        
        if (APP.currentUser.role === 'admin') {
            document.getElementById('adminNav').style.display = 'block';
        }
        
        updateSidebarUserInfo();
                checkBadgesOnLoad();
        
                // ✅ Recalculate all balances for all meters on load
                try {
                    APP.meters.forEach(meter => {
                        const md = APP.metersData[meter.id];
                        if (md && md.transactions && md.transactions.length > 0) {
                            const vatRate = APP.settings.vatRate || 5;
                            const rebateRate = APP.settings.rebateRate || 0.85;
                            const demandCharge = APP.settings.demandCharge || 294;
                    
                            const sorted = [...md.transactions].sort((a, b) => new Date(a.date||a.timestamp) - new Date(b.date||b.timestamp));
                    
                            // initialBalance: যদি সংরক্ষিত থাকে সেটা ব্যবহার, নাহলে calculate
                            let initialBalance = md.initialBalance;
                            if (initialBalance === undefined || initialBalance === null) {
                                const monthlyDC = {};
                                let totalNet = 0;
                                sorted.forEach(t => {
                                    if (t.type === 'recharge') {
                                        const d = new Date(t.date || t.timestamp);
                                        if (isNaN(d.getTime())) return;
                                        const mk = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0');
                                        let dc = 0;
                                        if (!monthlyDC[mk]) { dc = demandCharge; monthlyDC[mk] = true; }
                                        const net = t.amount - dc - (t.amount * vatRate/100) + (t.amount * rebateRate/100);
                                        totalNet += net;
                                    } else if (t.type === 'bill' || t.type === 'electricity_bill') {
                                        totalNet -= t.amount;
                                    }
                                });
                                initialBalance = Math.max(0, (md.currentBalance || 0) - totalNet);
                            }
                    
                            // Recalculate from scratch
                            const monthlyDC2 = {};
                            let balance = initialBalance;
                    
                            sorted.forEach(t => {
                                if (t.type === 'recharge') {
                                    const d = new Date(t.date || t.timestamp);
                                    if (isNaN(d.getTime())) return;
                                    const mk = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2, '0');
                                    let dc = 0;
                                    if (!monthlyDC2[mk]) { 
                                        dc = demandCharge; 
                                        monthlyDC2[mk] = true; 
                                        t.isFirstOfMonth = true;
                                    } else {
                                        t.isFirstOfMonth = false;
                                    }
                                    const net = t.amount - dc - (t.amount * vatRate/100) + (t.amount * rebateRate/100);
                                    t.netCredit = net;
                                    t.deductions = { demandCharge: dc, vat: (t.amount * vatRate/100), rebate: (t.amount * rebateRate/100), netAmount: net };
                                    balance += net;
                                    t.balanceAfter = balance;
                                } else if (t.type === 'bill' || t.type === 'electricity_bill') {
                                    balance -= t.amount;
                                    t.balanceAfter = balance;
                                }
                            });
                    
                            md.initialBalance = initialBalance;
                            md.currentBalance = Math.max(0, balance);
                            md.totalRecharge = sorted.filter(t => t.type === 'recharge').reduce((s, t2) => s + (t2.amount||0), 0);
                        }
                    });
                    saveData();
                } catch(e) { console.error('Balance recalc error:', e); }
        
        navigateTo('dashboard');
    } else {
        document.getElementById('appPage').style.display = 'none';
        document.getElementById('authPage').style.display = 'block';
        showLoginPage();
    }
}

// ==================== SIDEBAR TEXT UPDATER ====================
function updateAllSidebarTexts() {
    // Update all nav-text elements by data-key (only text, not icon)
    document.querySelectorAll('.nav-text[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        el.textContent = __(key);
    });
}

function updateSidebarUserInfo() {
    const userInfo = document.getElementById('sidebarUserInfo');
    const userName = document.getElementById('sidebarUserName');
    const userRole = document.getElementById('sidebarUserRole');
    
    if (APP.currentUser && userInfo && userName && userRole) {
        userInfo.style.display = 'block';
        userName.textContent = APP.currentUser.name;
        userRole.textContent = APP.currentUser.role === 'admin' 
            ? (APP.language === 'en' ? 'Admin' : 'অ্যাডমিন') 
            : (APP.language === 'en' ? 'User' : 'ইউজার');
    }
}

function loadData() {
    // 🚫 NO localStorage - Firebase is single source of truth
    // Data loads from Firebase Realtime Database in tryFirebaseInit()
    APP.meters = [];
    APP.metersData = {};
    APP.activeMeterId = null;
    APP.badges = [];
    APP.savingsGoal = 0;
    
    // Try to restore from localStorage cache first (for instant load)
    try {
        const cached = localStorage.getItem('electricityBillApp_cache');
        if (cached) {
            const data = JSON.parse(cached);
            if (data.timestamp && (Date.now() - new Date(data.timestamp).getTime() < 3600000)) {
                // Cache is less than 1 hour old - use it temporarily
                APP.meters = data.meters || [];
                APP.metersData = data.metersData || {};
                APP.activeMeterId = data.activeMeterId || null;
                APP.settings = data.settings ? Object.assign({}, APP.settings, data.settings) : APP.settings;
                APP.tariffRates = data.tariffRates || APP.tariffRates;
                APP.savingsGoal = data.savingsGoal || 0;
                APP.badges = data.badges || [];
                APP.language = data.language || 'bn';
            }
        }
    } catch(e) {
        console.warn('Cache read error:', e);
    }
}

function saveData() {
    // 🚫 NO localStorage permanent save - Firebase is single source of truth
    // Firebase এ immediate save
    
    // 💡 Save to cache for instant load (optional, no conflict risk)
    try {
        const cacheData = {
            meters: APP.meters,
            metersData: APP.metersData,
            activeMeterId: APP.activeMeterId,
            settings: APP.settings,
            tariffRates: APP.tariffRates,
            savingsGoal: APP.savingsGoal,
            badges: APP.badges,
            language: APP.language,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('electricityBillApp_cache', JSON.stringify(cacheData));
    } catch(e) {
        // Cache fail is fine
    }
    
    // 🔥 Firebase Cloud Sync - immediate (not debounced for reliability)
    try {
        if (typeof syncAllToCloud === 'function') {
            syncAllToCloud();
        }
    } catch(e) {
        console.warn('Cloud sync warning:', e.message);
    }
}

function getActiveMeterData() {
    if (!APP.activeMeterId) {
        return {
            transactions: [],
            monthlyRecharges: [],
            currentBalance: 0,
            totalRecharge: 0,
            totalExpended: 0,
            lastDemandChargeMonth: "",
            settings: { ...APP.settings },
            tariffRates: [...APP.tariffRates],
            meterInfo: null,
            lastUpdated: new Date().toISOString()
        };
    }
    
    // ✅ Check if meter exists in meters array
    const meterExists = APP.meters.find(m => m.id === APP.activeMeterId);
    if (!meterExists) {
        console.warn('⚠️ Active meter not found in meters array, resetting');
        if (APP.meters.length > 0) {
            APP.activeMeterId = APP.meters[0].id;
            saveData();
        }
        return getActiveMeterData();
    }
    
    // ✅ If metersData entry doesn't exist, create it
    if (!APP.metersData[APP.activeMeterId]) {
        console.log('🔄 Creating new metersData entry for:', APP.activeMeterId, meterExists.name);
        APP.metersData[APP.activeMeterId] = {
            transactions: [],
            monthlyRecharges: [],
            currentBalance: 0,
            totalRecharge: 0,
            totalExpended: 0,
            lastDemandChargeMonth: "",
            settings: { ...APP.settings },
            tariffRates: [...APP.tariffRates],
            meterInfo: meterExists,
            lastUpdated: new Date().toISOString()
        };
        saveData();
    }
    
    // ✅ Double-check meterInfo is set
    if (!APP.metersData[APP.activeMeterId].meterInfo) {
        APP.metersData[APP.activeMeterId].meterInfo = meterExists;
    }
    
    return APP.metersData[APP.activeMeterId];
}

function updateActiveMeterData(updates) {
    if (!APP.activeMeterId) return;
    
    if (!APP.metersData[APP.activeMeterId]) {
        APP.metersData[APP.activeMeterId] = {
            transactions: [],
            monthlyRecharges: [],
            currentBalance: 0,
            totalRecharge: 0,
            totalExpended: 0,
            lastDemandChargeMonth: "",
            settings: { ...APP.settings },
            tariffRates: [...APP.tariffRates],
            meterInfo: APP.meters.find(m => m.id === APP.activeMeterId),
            lastUpdated: new Date().toISOString()
        };
    }
    
    Object.assign(APP.metersData[APP.activeMeterId], updates);
    APP.metersData[APP.activeMeterId].lastUpdated = new Date().toISOString();
    saveData();
}

function checkAuth() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
        APP.currentUser = users.find(u => u.id === currentUserId);
    }
}

function navigateTo(page) {
    if (!APP.currentUser) {
        showLoginPage();
        return;
    }
    
    APP.currentPage = page;
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(`'${page}'`)) {
            item.classList.add('active');
        }
    });
    
    switch(page) {
        case 'dashboard': showDashboard(); break;
        case 'meters': showMeterManagement(); break;
        case 'transactions': showTransactions(); break;
        case 'calculator': showCalculator(); break;
        case 'reports': showReports(); break;
        case 'analytics': showAnalytics(); break;
        case 'settings': showSettings(); break;
        case 'backup': showBackup(); break;
        case 'admin': showAdminPanel(); break;
        case 'profile': showProfile(); break;
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (!APP.currentUser) return;
        
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveData();
            showToast(APP.language === 'en' ? 'Data saved' : 'ডাটা সেভ হয়েছে', 'success');
        }
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            if (typeof exportToExcel === 'function') {
                exportToExcel();
            }
        }
    });
}

function applySettings() {
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
    
    if (APP.settings.fontSize) {
        document.documentElement.style.setProperty('--font-size', APP.settings.fontSize + 'px');
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

init();

// ==================== FALLBACK ADMIN PANEL ====================
// This ensures showAdminPanel works even if admin.js has cache issues

function showAdminPanel() {
    var L = APP.language;
    var html = "";
    html += '<div class="card">';
    html += '  <h2>Admin Panel</h2>';
    html += '  <p>Welcome, ' + (APP.currentUser ? APP.currentUser.name : "Admin") + '</p>';
    html += '  <div id="adminContent">Loading users from Firebase...</div>';
    html += '</div>';
    
    document.getElementById("pageContent").innerHTML = html;
    
    // Load users from Firebase
    if (typeof database !== "undefined" && database) {
        loadAdminUsers();
    } else {
        document.getElementById("adminContent").innerHTML = "Firebase not available";
    }
}

function loadAdminUsers() {
    database.ref("users").once("value").then(function(snapshot) {
        var usersData = snapshot.val();
        var html = '<table><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>';
        var count = 0;
        
        if (usersData) {
            Object.keys(usersData).forEach(function(key) {
                var u = usersData[key];
                count++;
                html += "<tr><td>" + count + "</td><td>" + (u.name || "-") + "</td><td>" + (u.email || "-") + "</td><td><span class=\"badge " + (u.role === "admin" ? "badge-warning" : "badge-success") + "\">" + (u.role === "admin" ? "Admin" : "User") + "</span></td></tr>";
            });
        } else {
            html += "<tr><td colspan='4'>No users found</td></tr>";
        }
        
        html += "</tbody></table>";
        
        var countText = count + " user" + (count !== 1 ? "s" : "") + " found";
        document.getElementById("adminContent").innerHTML = "<p>" + countText + "</p>" + html;
    });
}
