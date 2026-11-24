// ==================== GLOBAL UTILITY FUNCTIONS ====================
function escapeHtml(s) {
    if (!s) return "";
    return s.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;");
}

// ==================== APP STATE & INITIALIZATION ====================
const APP = {
    currentUser: null,
    activeMeterId: null,
    meters: [],
    metersData: {},
    settings: {
        vatRate: 5,
        rebateRate: 0.6,
        sanctionedLoad: 7,
        sanctionedTaka: 42,
        demandCharge: 294,
        darkMode: false,
        highContrast: false,
        fontSize: 14,
        autoBackupTime: '02:00',
        retentionDays: 30
    },
    // ✅ ট্যারিফ রেট - সেটিংসের বর্তমান সরকারি BERC অনুমোদিত রেট
    tariffRates: [
        { range: [0, 50], rate: 4.63, name: "Lifeline", increasePercent: 0 },
        { range: [51, 75], rate: 5.26, name: "1st Slab", increasePercent: 0 },
        { range: [76, 200], rate: 8.50, name: "2nd Slab", increasePercent: 0 },
        { range: [201, 300], rate: 9.10, name: "3rd Slab", increasePercent: 0 },
        { range: [301, 400], rate: 9.62, name: "4th Slab", increasePercent: 0 },
        { range: [401, 600], rate: 15.01, name: "5th Slab", increasePercent: 0 },
        { range: [601, null], rate: 17.35, name: "6th Slab", increasePercent: 0 }
    ],
    savingsGoal: 0,
    badges: [],
    currentPage: 'dashboard',
    language: 'bn', // ✅ ডিফল্ট ভাষা বাংলা
    translations: {
        bn: {
            // ===== Sidebar =====
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
            sidebarRent: 'ভাড়া ব্যবস্থাপনা',
            sidebarExpenses: 'অতিরিক্ত খরচ',
            sidebarLogout: 'লগআউট',
            // ===== Common =====
            currentMeter: 'বর্তমান মিটার:',
            langLabel: 'EN',
            langBtn: 'বাংলা',
            dashboard: 'ড্যাশবোর্ড',
            balance: 'বর্তমান ব্যালেন্স',
            totalRecharge: 'মোট রিচার্জ',
            totalExpense: 'মোট খরচ',
            lastExpense: 'সর্বশেষ খরচ',
            noTransactions: 'কোন ট্রানজেকশন নেই',
            recentTransactions: 'সর্বশেষ ট্রানজেকশন',
            recharge: 'রিচার্জ',
            bill: 'বিল',
            taka: '৳',
            addMeter: 'মিটার যোগ করুন',
            welcome: 'স্বাগতম!',
            welcomeMsg: 'প্রথমে একটি মিটার যোগ করুন',
            // ===== Auth =====
            login: 'লগইন',
            register: 'রেজিস্টার',
            email: 'ইমেইল',
            password: 'পাসওয়ার্ড',
            name: 'নাম',
            loginBtn: 'লগইন',
            registerBtn: 'রেজিস্টার',
            haveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
            noAccount: 'অ্যাকাউন্ট নেই?',
            logoutSuccess: 'সফলভাবে লগআউট হয়েছে',
            loginSuccess: 'স্বাগতম',
            registerSuccess: 'রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন',
            fillAllFields: 'সব ফিল্ড পূরণ করুন',
            passwordLength: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
            emailExists: 'এই ইমেইল ইতিমধ্যে রেজিস্টার্ড',
            invalidCred: 'ইমেইল বা পাসওয়ার্ড ভুল',
            // ===== Common Actions =====
            save: 'সংরক্ষণ',
            cancel: 'বাতিল',
            edit: 'এডিট',
            delete: 'ডিলিট',
            description: 'বিবরণ',
            date: 'তারিখ',
            type: 'ধরন',
            amount: 'পরিমাণ',
            units: 'ইউনিট',
            actions: 'অ্যাকশন',
            // ===== Admin =====
            adminPanel: 'অ্যাডমিন প্যানেল',
            totalUsers: 'মোট রেজিস্টার্ড ইউজার',
            totalMeters: 'মোট মিটার',
            totalTransactions: 'মোট ট্রানজেকশন',
            userList: 'রেজিস্টার্ড ইউজার তালিকা',
            nameCol: 'নাম',
            emailCol: 'ইমেইল',
            roleCol: 'রোল',
            ipCol: 'IP ঠিকানা',
            deviceCol: 'ডিভাইস',
            regDateCol: 'রেজিস্ট্রেশন তারিখ',
            actionCol: 'অ্যাকশন',
            statusCol: 'স্ট্যাটাস',
            userRole: 'ইউজার',
            adminRole: 'অ্যাডমিন',
            you: 'আপনি',
            current: 'বর্তমান',
            noUsers: 'কোন রেজিস্টার্ড ইউজার নেই',
            deleteUser: 'ডিলিট',
            makeAdmin: 'অ্যাডমিন বানান',
            makeUser: 'ইউজার বানান',
            appDataOverview: 'অ্যাপ ডাটা ওভারভিউ',
            meterName: 'মিটারের নাম',
            meterNo: 'মিটার নং',
            balanceCol: 'ব্যালেন্স',
            totalRechargeCol: 'মোট রিচার্জ',
            totalExpenseCol: 'মোট খরচ',
            lastUpdate: 'শেষ আপডেট',
            noMeters: 'কোন মিটার নেই',
            // ===== Activity =====
            activityLog: 'ইউজার অ্যাক্টিভিটি লগ',
            allActivity: 'সকল',
            loginActivity: 'লগইন',
            registerActivity: 'রেজিস্টার',
            rechargeActivity: 'রিচার্জ',
            billActivity: 'বিল',
            logoutActivity: 'লগআউট',
            meterActivity: 'মিটার',
            noActivity: 'কোন অ্যাক্টিভিটি নেই',
            systemLogs: 'সিস্টেম লগস',
            // ===== Settings =====
            settingsTitle: 'সেটিংস',
            billSettings: 'বিল সেটিংস',
            displaySettings: 'ডিসপ্লে সেটিংস',
            backupSettings: 'ব্যাকআপ সেটিংস',
            darkMode: 'ডার্ক মোড',
            highContrast: 'হাই কনট্রাস্ট মোড',
            fontSizeLabel: 'ফন্ট সাইজ',
            dangerZone: 'ডেঞ্জার জোন',
            resetData: 'সমস্ত ডাটা রিসেট করুন',
            resetDataMsg: 'ফ্যাক্টরি ডিফল্টে ফিরে যান। সমস্ত মিটার, ট্রানজেকশন এবং কাস্টম সেটিংস স্থায়ীভাবে মুছে যাবে।',
            clearAll: 'সব ক্লিয়ার করুন',
            // ===== Profile =====
            profile: 'প্রোফাইল',
            newPassword: 'নতুন পাসওয়ার্ড (পরিবর্তন না করতে চাইলে খালি রাখুন)',
            updateProfile: 'আপডেট প্রোফাইল',
            badges: 'অর্জিত ব্যাজ',
            noBadges: 'এখনও কোন ব্যাজ অর্জিত হয়নি।',
            badgeHint: '৫টি বিল যোগ করে প্রথম ব্যাজ অর্জন করুন!',
            savingsGoal: 'সেভিংস গোল',
            savingsGoalInput: 'মাসিক সেভিংস টার্গেট (টাকা)',
            setGoal: 'সেভিংস গোল সেট করুন',
            dataSaved: 'ডাটা সেভ হয়েছে',
            settingsSaved: 'সেটিংস সংরক্ষিত হয়েছে',
            profileUpdated: 'প্রোফাইল আপডেট হয়েছে',
            goalSaved: 'সেভিংস গোল সংরক্ষিত হয়েছে',
        },
        en: {
            // ===== Sidebar =====
            sidebarDashboard: 'Dashboard',
            sidebarMeters: 'Meters',
            sidebarTransactions: 'Transactions',
            sidebarCalculator: 'Calculator',
            sidebarReports: 'Reports',
            sidebarAnalytics: 'Analytics',
            sidebarSettings: 'Settings',
            sidebarBackup: 'Backup',
            sidebarProfile: 'Profile',
            sidebarAdmin: 'Admin Panel',
            sidebarRent: 'Rent Management',
            sidebarExpenses: 'Extra Expenses',
            sidebarLogout: 'Logout',
            // ===== Common =====
            currentMeter: 'Current Meter:',
            langLabel: 'BN',
            langBtn: 'English',
            dashboard: 'Dashboard',
            balance: 'Current Balance',
            totalRecharge: 'Total Recharge',
            totalExpense: 'Total Expense',
            lastExpense: 'Last Expense',
            noTransactions: 'No transactions found',
            recentTransactions: 'Recent Transactions',
            recharge: 'Recharge',
            bill: 'Bill',
            taka: '৳',
            addMeter: 'Add Meter',
            welcome: 'Welcome!',
            welcomeMsg: 'Please add a meter first',
            // ===== Auth =====
            login: 'Login',
            register: 'Register',
            email: 'Email',
            password: 'Password',
            name: 'Name',
            loginBtn: 'Login',
            registerBtn: 'Register',
            haveAccount: 'Already have an account?',
            noAccount: "Don't have an account?",
            logoutSuccess: 'Successfully logged out',
            loginSuccess: 'Welcome',
            registerSuccess: 'Registration successful! Please login now',
            fillAllFields: 'Please fill all fields',
            passwordLength: 'Password must be at least 6 characters',
            emailExists: 'This email is already registered',
            invalidCred: 'Invalid email or password',
            // ===== Common Actions =====
            save: 'Save',
            cancel: 'Cancel',
            edit: 'Edit',
            delete: 'Delete',
            description: 'Description',
            date: 'Date',
            type: 'Type',
            amount: 'Amount',
            units: 'Units',
            actions: 'Actions',
            // ===== Admin =====
            adminPanel: 'Admin Panel',
            totalUsers: 'Total Registered Users',
            totalMeters: 'Total Meters',
            totalTransactions: 'Total Transactions',
            userList: 'Registered Users List',
            nameCol: 'Name',
            emailCol: 'Email',
            roleCol: 'Role',
            ipCol: 'IP Address',
            deviceCol: 'Device',
            regDateCol: 'Registration Date',
            actionCol: 'Actions',
            statusCol: 'Status',
            userRole: 'User',
            adminRole: 'Admin',
            you: 'You',
            current: 'Current',
            noUsers: 'No registered users found',
            deleteUser: 'Delete',
            makeAdmin: 'Make Admin',
            makeUser: 'Make User',
            appDataOverview: 'App Data Overview',
            meterName: 'Meter Name',
            meterNo: 'Meter No',
            balanceCol: 'Balance',
            totalRechargeCol: 'Total Recharge',
            totalExpenseCol: 'Total Expense',
            lastUpdate: 'Last Update',
            noMeters: 'No meters found',
            // ===== Activity =====
            activityLog: 'User Activity Log',
            allActivity: 'All',
            loginActivity: 'Login',
            registerActivity: 'Register',
            rechargeActivity: 'Recharge',
            billActivity: 'Bill',
            logoutActivity: 'Logout',
            meterActivity: 'Meter',
            noActivity: 'No activity found',
            systemLogs: 'System Logs',
            // ===== Settings =====
            settingsTitle: 'Settings',
            billSettings: 'Bill Settings',
            displaySettings: 'Display Settings',
            backupSettings: 'Backup Settings',
            darkMode: 'Dark Mode',
            highContrast: 'High Contrast Mode',
            fontSizeLabel: 'Font Size',
            dangerZone: 'Danger Zone',
            resetData: 'Reset All Data',
            resetDataMsg: 'Reset to factory defaults. All meters, transactions and custom settings will be permanently deleted.',
            clearAll: 'Clear All',
            // ===== Profile =====
            profile: 'Profile',
            newPassword: 'New Password (leave blank to keep current)',
            updateProfile: 'Update Profile',
            badges: 'Earned Badges',
            noBadges: 'No badges earned yet.',
            badgeHint: 'Add 5 bills to earn your first badge!',
            savingsGoal: 'Savings Goal',
            savingsGoalInput: 'Monthly Savings Target (Taka)',
            setGoal: 'Set Savings Goal',
            dataSaved: 'Data saved',
            settingsSaved: 'Settings saved',
            profileUpdated: 'Profile updated',
            goalSaved: 'Savings goal saved',
        }
    }
};

// ==================== TRANSLATION FUNCTION ====================
function __(key) {
    var L = APP.language || 'bn';
    var translations = APP.translations[L] || APP.translations.bn;
    return translations[key] || key;
}

// ==================== NAVIGATION ====================
function navigateTo(page) {
    APP.currentPage = page;
    
    // Close mobile drawer if open
    closeMobileSidebar();
    
    // Ensure mobile nav exists on mobile screens
    if (window.innerWidth <= 768 && !document.getElementById('mobileBottomNav')) {
        createMobileNav();
    }
    
    // Update mobile nav active
    updateMobileNavActive(page);
    
    // Update header user info if elements present
    updateSidebarUserInfo();
    
    // ✅ ডাটা লোড না হলে অপেক্ষা করুন
    if (page === "dashboard" && APP.meters.length === 0) {
        // loadFromCloud চেষ্টা করুন
        if (typeof loadFromCloud === 'function') {
            loadFromCloud().then(function() {
                if (typeof showDashboard === "function") showDashboard();
            });
            return;
        }
    }
    
    // Show page content
    if (page === "dashboard" && typeof showDashboard === "function") showDashboard();
    else if (page === "meters" && typeof showMeters === "function") showMeters();
    else if (page === "transactions" && typeof showTransactions === "function") showTransactions();
    else if (page === "calculator" && typeof showCalculator === "function") showCalculator();
    else if (page === "reports" && typeof showReports === "function") showReports();
    else if (page === "analytics" && typeof showAnalytics === "function") showAnalytics();
    else if (page === "settings" && typeof showSettings === "function") showSettings();
    else if (page === "backup" && typeof showBackup === "function") showBackup();
    else if (page === "admin" && typeof showAdminPanel === "function") showAdminPanel();
    else if (page === "profile" && typeof showProfile === "function") showProfile();
    else if (page === "rent" && typeof showRentPage === "function") showRentPage();
    else if (page === "expenses" && typeof showExpensesPage === "function") showExpensesPage();
    else if (typeof showDashboard === "function") showDashboard();
    
    // Update nav items
    updateNavItems(page);
}

function updateNavItems(page) {
    var allNavs = document.querySelectorAll(".nav-item, .mobile-nav-item");
    for (var i = 0; i < allNavs.length; i++) {
        allNavs[i].classList.remove("active");
        var onclick = allNavs[i].getAttribute("onclick") || "";
        var dataPage = allNavs[i].getAttribute("data-page") || "";
        if (onclick.indexOf("navigateTo('" + page + "')") >= 0 || dataPage === page) {
            allNavs[i].classList.add("active");
        }
    }
}

function toggleSidebar() {
    var sb = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebarOverlay");
    if (sb) {
        if (window.innerWidth <= 768) {
            sb.classList.toggle("mobile-open");
            if (overlay) {
                overlay.style.display = sb.classList.contains("mobile-open") ? "block" : "none";
            }
        } else {
            sb.classList.toggle("hidden");
            var mc = document.getElementById("mainContent");
            if (mc) mc.classList.toggle("expanded");
        }
    }
}

function closeMobileSidebar() {
    var sb = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebarOverlay");
    if (sb) sb.classList.remove("mobile-open");
    if (overlay) overlay.style.display = "none";
}

function updateSidebarUserInfo() {
    var ne = document.getElementById("sidebarUserName");
    var re = document.getElementById("sidebarUserRole");
    var hName = document.getElementById("headerUserName");
    var hMeter = document.getElementById("headerUserMeter");
    
    var activeMeter = APP.meters && APP.activeMeterId ? 
        APP.meters.find(function(m) { return m.id === APP.activeMeterId; }) : 
        (APP.meters && APP.meters.length > 0 ? APP.meters[0] : null);
        
    var meterNo = activeMeter ? (activeMeter.meterNumber || activeMeter.meterNo || '') : '';
    var userName = (APP.currentUser && APP.currentUser.name) ? APP.currentUser.name : (activeMeter ? (activeMeter.name || 'এমডি আব্দুল মালেক') : 'ইউজার');

    if (ne) ne.textContent = userName;
    if (hName) hName.textContent = userName;
    if (hMeter) hMeter.textContent = meterNo || '030519023423';

    if (re && APP.currentUser) {
        var L = APP.language || 'bn';
        re.textContent = APP.currentUser.role === "admin" ? 
            (L === 'en' ? 'Admin' : 'অ্যাডমিন') : 
            (L === 'en' ? 'User' : 'ইউজার');
        re.className = "sidebar-user-role";
    }

    if (typeof updateNotificationBadge === "function") {
        updateNotificationBadge();
    }
}

// ==================== SMART NOTIFICATION CENTER ====================
function getActiveNotifications() {
    var L = APP.language || 'bn';
    var notifs = [];
    var meterData = (typeof getActiveMeterData === 'function') ? getActiveMeterData() : ((APP.activeMeterId && APP.metersData) ? APP.metersData[APP.activeMeterId] : null);
    var meter = (typeof getActiveMeter === 'function') ? getActiveMeter() : (APP.meters ? APP.meters.find(function(m) { return m.id === APP.activeMeterId; }) : null);
    var balance = meterData ? (Number(meterData.currentBalance) || 0) : 0;

    // Pre-calculate month units & recharges
    var now = new Date();
    var curMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    var monthUnits = 0;
    var monthRecharges = 0;

    if (meterData && meterData.transactions) {
        meterData.transactions.forEach(function(t) {
            var d = new Date(t.date || t.timestamp);
            if (isNaN(d.getTime())) return;
            var tMonth = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
            if (tMonth === curMonth) {
                if (t.type === 'electricity_bill' || t.type === 'bill') {
                    monthUnits += (Number(t.units) || 0);
                } else if (t.type === 'recharge' || t.deductions) {
                    monthRecharges += (Number(t.amount) || 0);
                }
            }
        });
    }

    // 1. Smart Balance & Bill Predictor Alert
    if (typeof getSmartBalancePrediction === 'function') {
        var rawTx = (meterData && meterData.transactions) ? meterData.transactions : [];
        var txList = Array.isArray(rawTx) ? rawTx : (typeof rawTx === 'object' ? Object.values(rawTx) : []);
        var monthlyAvg = (typeof getMonthlyAvgExpense === 'function') ? getMonthlyAvgExpense(APP.activeMeterId) : 0;
        var pred = getSmartBalancePrediction(balance, APP.activeMeterId, txList, monthlyAvg, monthUnits, APP.tariffRates);
        if (pred) {
            notifs.push({
                id: 'smart_balance_predictor',
                type: pred.status === 'critical' ? 'critical' : (pred.status === 'warning' ? 'warning' : 'success'),
                icon: '🔮',
                title: L === 'en' ? 'Smart Balance Forecast' : '🔮 স্মার্ট ব্যালেন্স পূর্বাভাস',
                msg: pred.message,
                time: pred.statusPill
            });
        }
    } else if (balance <= 200) {
        notifs.push({
            id: 'low_bal_critical',
            type: 'critical',
            icon: '🚨',
            title: L === 'en' ? 'Critical Low Balance!' : 'জরুরি ব্যালেন্স অ্যালার্ট!',
            msg: L === 'en' ? `Balance is only ৳${balance.toFixed(2)}. Recharge soon to avoid disconnection.` : `ব্যালেন্স মাত্র ৳ ${balance.toFixed(2)}! বিদ্যুৎ সংযোগ সচল রাখতে অবিলম্বে রিচার্জ করুন।`,
            time: L === 'en' ? 'Right now' : 'এখনই'
        });
    } else if (balance <= 500) {
        notifs.push({
            id: 'low_bal_warning',
            type: 'warning',
            icon: '⚠️',
            title: L === 'en' ? 'Low Balance Warning' : 'ব্যালেন্স সতর্কবার্তা',
            msg: L === 'en' ? `Current balance is ৳${balance.toFixed(2)}. Consider recharging soon.` : `বর্তমান ব্যালেন্স ৳ ${balance.toFixed(2)}। কিছুদিনের মধ্যে রিচার্জ করার পরামর্শ দেওয়া হচ্ছে।`,
            time: L === 'en' ? 'Active' : 'চলতি'
        });
    } else {
        notifs.push({
            id: 'bal_healthy',
            type: 'success',
            icon: '✅',
            title: L === 'en' ? 'Balance is Sufficient' : 'ব্যালেন্স সন্তোষজনক',
            msg: L === 'en' ? `Active balance: ৳${balance.toFixed(2)}. System is running normally.` : `চলতি ব্যালেন্স: ৳ ${balance.toFixed(2)}। বিদ্যুৎ সেবা স্বাভাবিক রয়েছে।`,
            time: L === 'en' ? 'Normal' : 'স্বাভাবিক'
        });
    }

    // 2. Current Month Slab Alert & Jump Warning
    if (meterData && meterData.transactions) {
        var now = new Date();
        var curMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
        var monthUnits = 0;
        var monthRecharges = 0;

        meterData.transactions.forEach(function(t) {
            var d = new Date(t.date || t.timestamp);
            if (isNaN(d.getTime())) return;
            var tMonth = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
            if (tMonth === curMonth) {
                if (t.type === 'electricity_bill' || t.type === 'bill') {
                    monthUnits += (Number(t.units) || 0);
                } else if (t.type === 'recharge' || t.deductions) {
                    monthRecharges += (Number(t.amount) || 0);
                }
            }
        });

        if (typeof getSmartSlabJumpStatus === 'function') {
            var slabStat = getSmartSlabJumpStatus(monthUnits, APP.activeMeterId, APP.tariffRates);
            if (slabStat) {
                notifs.push({
                    id: 'smart_slab_warning',
                    type: slabStat.isCritical ? 'critical' : (slabStat.isWarning ? 'warning' : 'info'),
                    icon: slabStat.isWarning ? '⚠️' : '⚡',
                    title: slabStat.isWarning ? (L === 'en' ? '⚠️ Tariff Slab Jump Warning' : '⚠️ স্ল্যাব জাম্প সতর্কতা') : (L === 'en' ? '⚡ Tariff Slab Monitor' : '⚡ ট্যারিফ স্ল্যাব মনিটর'),
                    msg: slabStat.message,
                    time: slabStat.statusPill
                });
            }
        } else if (monthUnits > 50) {
            notifs.push({
                id: 'slab_overflow',
                type: 'info',
                icon: '⚡',
                title: L === 'en' ? 'Lifeline Slab Limit Exceeded' : 'লাইফলাইন স্ল্যাব (৫০ ইউনিট) পূর্ণ',
                msg: L === 'en' ? `You have used ${monthUnits.toFixed(1)} kWh this month. Higher tier rate applies.` : `চলতি মাসে ${monthUnits.toFixed(1)} ইউনিট ব্যবহৃত হয়েছে। এখন ২য় বা উচ্চতর স্ল্যাব রেট প্রযোজ্য।`,
                time: L === 'en' ? 'This month' : 'এই মাস'
            });
        }

        if (monthRecharges === 0) {
            notifs.push({
                id: 'no_recharge_month',
                type: 'warning',
                icon: '📅',
                title: L === 'en' ? 'Monthly Recharge Reminder' : 'মাসিক রিচার্জ রিমাইন্ডার',
                msg: L === 'en' ? 'No recharge recorded yet for this month.' : 'চলতি মাসে এখনও কোনো রিচার্জ রেকর্ড করা হয়নি।',
                time: L === 'en' ? 'Reminder' : 'রিমাইন্ডার'
            });
        }
    }

    // 3. System Notification
    notifs.push({
        id: 'system_ver',
        type: 'info',
        icon: 'ℹ️',
        title: L === 'en' ? 'App Version v2.4.4' : 'অ্যাপ সংস্করণ v2.4.4',
        msg: L === 'en' ? 'Smart prepaid meter tracking is fully active and synchronized.' : 'স্মার্ট প্রিপেইড মিটার ট্র্যাকার এবং সরকারি ট্যারিফ রেট কার্যকর আছে।',
        time: L === 'en' ? 'Latest' : 'আপ-টু-ডেট'
    });

    return notifs;
}

function updateNotificationBadge() {
    var dot = document.querySelector('.notification-dot');
    if (!dot) return;
    var notifs = getActiveNotifications();
    var hasAlerts = notifs.some(function(n) { return n.type === 'critical' || n.type === 'warning'; });
    dot.style.display = hasAlerts ? 'block' : 'none';
}

function toggleNotificationPanel(event) {
    if (event) event.stopPropagation();
    var existing = document.getElementById('appNotificationDropdown');
    if (existing) {
        existing.remove();
        return;
    }

    var L = APP.language || 'bn';
    var notifs = getActiveNotifications();
    var panel = document.createElement('div');
    panel.id = 'appNotificationDropdown';
    panel.style.cssText = 'position: absolute; top: 62px; right: 20px; width: 340px; max-width: calc(100vw - 30px); background: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.18); border: 1px solid #e2e8f0; z-index: 10000; overflow: hidden; animation: fadeIn 0.2s ease;';

    var headerHtml = `
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                <span>🔔</span> <span>${L === 'en' ? 'Notifications' : 'নোটিফিকেশন ও অ্যালার্ট'}</span>
            </div>
            <span style="background: rgba(255,255,255,0.25); font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 600;">${notifs.length}</span>
        </div>
    `;

    var listHtml = '<div style="max-height: 380px; overflow-y: auto; padding: 10px;">';
    notifs.forEach(function(n) {
        var borderLeftColor = n.type === 'critical' ? '#ef4444' : (n.type === 'warning' ? '#f59e0b' : (n.type === 'success' ? '#10b981' : '#3b82f6'));
        var bg = n.type === 'critical' ? '#fef2f2' : (n.type === 'warning' ? '#fffbeb' : '#f8fafc');

        listHtml += `
            <div style="background: ${bg}; border-left: 4px solid ${borderLeftColor}; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <div style="font-weight: 700; font-size: 13px; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                        <span>${n.icon}</span> <span>${n.title}</span>
                    </div>
                    <span style="font-size: 10px; color: #94a3b8; font-weight: 500;">${n.time}</span>
                </div>
                <div style="font-size: 12px; color: #475569; line-height: 1.4;">${n.msg}</div>
            </div>
        `;
    });
    listHtml += '</div>';

    var footerHtml = `
        <div style="padding: 10px; text-align: center; border-top: 1px solid #f1f5f9; background: #fafafa;">
            <button onclick="document.getElementById('appNotificationDropdown').remove()" style="background: none; border: none; color: #667eea; font-weight: 600; font-size: 12px; cursor: pointer;">
                ${L === 'en' ? 'Close' : 'বন্ধ করুন'}
            </button>
        </div>
    `;

    panel.innerHTML = headerHtml + listHtml + footerHtml;
    document.body.appendChild(panel);

    // Auto close on outside click
    function onDocClick(e) {
        if (!panel.contains(e.target) && !e.target.closest('#headerNotificationBtn') && !e.target.closest('.header-icon-btn')) {
            panel.remove();
            document.removeEventListener('click', onDocClick);
        }
    }
    setTimeout(function() {
        document.addEventListener('click', onDocClick);
    }, 100);
}

function showNotificationToast() {
    toggleNotificationPanel();
}

function logout() {
    localStorage.removeItem("biddut_session");
    localStorage.removeItem("currentUserId");
    APP.currentUser = null;
    if (typeof closeMobileSidebar === "function") closeMobileSidebar();
    var adminNav = document.getElementById("adminNav");
    if (adminNav) adminNav.style.display = "none";
    document.getElementById("appPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";
    var L = APP.language || 'bn';
    showToast(L === 'en' ? 'Successfully logged out' : 'সফলভাবে লগআউট হয়েছে', 'success');
    if (typeof showLoginPage === "function") showLoginPage();
}

// ==================== SAVE DATA (ONLY FIREBASE) ====================
function saveData() {
    // ✅ localStorage-এ activeMeterId সেভ করুন
    if (APP.activeMeterId) {
        localStorage.setItem('biddut_activeMeterId', APP.activeMeterId);
        console.log('💾 Active meter saved to localStorage:', APP.activeMeterId);
    }
    
    // Only save to Firebase - no localStorage
    if (typeof saveAllToCloud === 'function') {
        saveAllToCloud().catch(function(error) {
            console.warn('⚠️ Save to Firebase failed:', error);
        });
    } else {
        console.warn('⚠️ saveAllToCloud function not available');
    }
}

// ==================== INIT ====================
function initApp() {
    try {
        var s = JSON.parse(localStorage.getItem("biddut_session"));
        if (s && s.loginTime && Date.now() - s.loginTime < 604800000) {
            APP.currentUser = {id: s.userId || "1", email: s.email || "", name: s.name || "User", role: s.role || "user"};
            
            document.getElementById("authPage").style.display = "none";
            document.getElementById("appPage").style.display = "block";
            
            // Create mobile bottom navigation
            createMobileNav();
            
            var adminNav = document.getElementById("adminNav");
            if (adminNav && APP.currentUser.role === "admin") adminNav.style.display = "block";
            if (typeof updateSidebarUserInfo === "function") updateSidebarUserInfo();
            
            if (typeof applySettings === "function") {
                applySettings();
            }

            // Start Live Regional Date/Time Clock & Sky Engine
            if (typeof initDashboardRealTimeClock === "function") {
                initDashboardRealTimeClock();
            }

            // Restore cached meters and transactions immediately from localStorage
            try {
                var cachedMeters = localStorage.getItem('biddut_meters');
                if (cachedMeters) {
                    var parsedMeters = JSON.parse(cachedMeters);
                    if (Array.isArray(parsedMeters) && parsedMeters.length > 0) {
                        APP.meters = parsedMeters;
                    }
                }
                var cachedMetersData = localStorage.getItem('biddut_metersData');
                if (cachedMetersData) {
                    var parsedMD = JSON.parse(cachedMetersData);
                    if (parsedMD && typeof parsedMD === 'object') {
                        APP.metersData = Object.assign(parsedMD, APP.metersData || {});
                    }
                }
                // Auto-reconstruct APP.meters from APP.metersData if APP.meters is still empty
                if ((!APP.meters || APP.meters.length === 0) && APP.metersData) {
                    APP.meters = [];
                    Object.keys(APP.metersData).forEach(function(k) {
                        var md = APP.metersData[k];
                        if (md && md.meterInfo && md.meterInfo.id) {
                            if (!APP.meters.some(function(m) { return m.id === md.meterInfo.id; })) {
                                APP.meters.push(md.meterInfo);
                            }
                        }
                    });
                    if (APP.meters.length > 0) {
                        localStorage.setItem('biddut_meters', JSON.stringify(APP.meters));
                    }
                }
                var cachedActiveMeterId = localStorage.getItem('biddut_activeMeterId');
                if (cachedActiveMeterId) {
                    APP.activeMeterId = cachedActiveMeterId;
                } else if (APP.meters && APP.meters.length > 0) {
                    APP.activeMeterId = APP.meters[0].id;
                    localStorage.setItem('biddut_activeMeterId', APP.activeMeterId);
                }
            } catch(e) {}
            
            setTimeout(function() {
                if (window.innerWidth <= 768) {
                    createMobileNav();
                }
            }, 500);
            
            if (typeof loadFromCloud === "function") {
                loadFromCloud().then(function() {
                    if (typeof checkBadges === "function") {
                        checkBadges();
                    }
                    if (APP.settings && APP.settings.language) {
                        APP.language = APP.settings.language;
                    }
                    updateAllSidebarTexts();
                    
                    // ✅✅✅ database চেক সহ রেন্ট ডাটা লোড ✅✅✅
                    setTimeout(function() {
                        // ✅ database চেক করুন
                        if (APP.currentUser && typeof database !== 'undefined' && database !== null && isFirebaseReady) {
                            var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
                            var userId = APP.currentUser.id || APP.currentUser.email || 'default';
                            var expenseKey = 'expenseData_' + userId;
                            
                            database.ref('users/' + userEmail + '/app').once('value').then(function(snapshot) {
                                var data = snapshot.val();
                                if (data) {
                                    if (data.rentData) {
                                        APP.rentData = data.rentData;
                                        if (!Array.isArray(APP.rentData.records)) APP.rentData.records = [];
                                        console.log('✅ রিফ্রেশে রেন্ট ডাটা লোড! রেকর্ড:', APP.rentData.records.length);
                                    }
                                    if (data.expenseData) {
                                        APP[expenseKey] = data.expenseData;
                                        if (!Array.isArray(APP[expenseKey].records)) APP[expenseKey].records = [];
                                        console.log('✅ রিফ্রেশে এক্সপেন্স ডাটা লোড! রেকর্ড:', APP[expenseKey].records.length);
                                    }
                                    if (APP.currentPage === 'rent') {
                                        showRentReport();
                                    }
                                }
                            }).catch(function(err) {
                                console.warn('⚠️ রেন্ট ডাটা লোড করতে ব্যর্থ:', err);
                            });
                        } else {
                            console.log('⏳ Firebase এখনও প্রস্তুত নয়, পরে চেষ্টা করা হবে...');
                            // 2 সেকেন্ড পর আবার চেষ্টা করুন
                            setTimeout(function() {
                                if (APP.currentUser && typeof database !== 'undefined' && database !== null) {
                                    var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
                                    var userId = APP.currentUser.id || APP.currentUser.email || 'default';
                                    var expenseKey = 'expenseData_' + userId;
                                    
                                    database.ref('users/' + userEmail + '/app').once('value').then(function(snapshot) {
                                        var data = snapshot.val();
                                        if (data && data.rentData) {
                                            APP.rentData = data.rentData;
                                            if (!Array.isArray(APP.rentData.records)) APP.rentData.records = [];
                                            console.log('✅ রেন্ট ডাটা লোড! রেকর্ড:', APP.rentData.records.length);
                                            if (APP.currentPage === 'rent') {
                                                showRentReport();
                                            }
                                        }
                                    });
                                }
                            }, 2000);
                        }
                    }, 500);
                    
                    setTimeout(function() { 
                        navigateTo("dashboard"); 
                    }, 700);
                });
            } else {
                if (APP.settings && APP.settings.language) {
                    APP.language = APP.settings.language;
                }
                updateAllSidebarTexts();
                setTimeout(function() { 
                    navigateTo("dashboard"); 
                }, 100);
            }
            return;
        }
    } catch(e) {
        console.warn('Session restore error:', e);
    }
    
    document.getElementById("authPage").style.display = "block";
    document.getElementById("appPage").style.display = "none";
    if (typeof showLoginPage === "function") showLoginPage();
    else document.getElementById("authPage").innerHTML = "<h2>Loading...</h2>";
}

// ==================== MOBILE BOTTOM NAVIGATION ====================
function createMobileNav() {
    var existing = document.getElementById('mobileBottomNav');
    if (existing) {
        existing.remove();
    }
    
    var L = APP.language || 'bn';
    var isEn = (L === 'en');
    var isAdmin = APP.currentUser && (APP.currentUser.role === 'admin' || APP.currentUser.email === 'k.m.abubakkarsiddek@gmail.com');
    
    var navItems = [
        {
            id: 'dashboard',
            label: isEn ? 'Dashboard' : 'ড্যাশবোর্ড',
            color: '#818cf8',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5" fill="currentColor" fill-opacity="0.25"></rect><rect x="14" y="3" width="7" height="5" rx="1.5"></rect><rect x="14" y="12" width="7" height="9" rx="1.5" fill="currentColor" fill-opacity="0.25"></rect><rect x="3" y="16" width="7" height="5" rx="1.5"></rect></svg>'
        },
        {
            id: 'meters',
            label: isEn ? 'Meters' : 'মিটার',
            color: '#fbbf24',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fill-opacity="0.25"></polygon></svg>'
        },
        {
            id: 'transactions',
            label: isEn ? 'Transactions' : 'ট্রানজেকশন',
            color: '#38bdf8',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2.5" fill="currentColor" fill-opacity="0.2"></rect><line x1="2" y1="10" x2="22" y2="10"></line><circle cx="7" cy="15" r="1.5" fill="currentColor"></circle></svg>'
        },
        {
            id: 'calculator',
            label: isEn ? 'Calculator' : 'ক্যালকুলেটর',
            color: '#c084fc',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="3" fill="currentColor" fill-opacity="0.2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"></path></svg>'
        },
        {
            id: 'reports',
            label: isEn ? 'Reports' : 'রিপোর্ট',
            color: '#34d399',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="currentColor" fill-opacity="0.18"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
        },
        {
            id: 'analytics',
            label: isEn ? 'Analytics' : 'এনালিটিক্স',
            color: '#f472b6',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="3 8 9 12 15 6 21 10" stroke-width="2.2"></polyline></svg>'
        },
        {
            id: 'rent',
            label: isEn ? 'Rent' : 'ভাড়া ব্যবস্থাপনা',
            color: '#4ade80',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" fill-opacity="0.2"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
        },
        {
            id: 'expenses',
            label: isEn ? 'Extra' : 'অতিরিক্ত খরচ',
            color: '#fb923c',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" fill="currentColor" fill-opacity="0.2"></path></svg>'
        },
        {
            id: 'settings',
            label: isEn ? 'Settings' : 'সেটিংস',
            color: '#cbd5e1',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" fill="currentColor" fill-opacity="0.25"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
        },
        {
            id: 'profile',
            label: isEn ? 'Profile' : 'ব্যবহারকারী',
            color: '#60a5fa',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="currentColor" fill-opacity="0.2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
        },
        {
            id: 'backup',
            label: isEn ? 'Backup' : 'তথ্য ব্যবস্থাপনা',
            color: '#38bdf8',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" fill="currentColor" fill-opacity="0.2"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>'
        }
    ];

    if (isAdmin) {
        navItems.push({
            id: 'admin',
            label: isEn ? 'Admin' : 'অ্যাডমিন',
            color: '#fbbf24',
            svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" fill="currentColor" fill-opacity="0.25"></path><circle cx="12" cy="18" r="2" fill="currentColor"></circle></svg>'
        });
    }

    // "সব মেনু" (All / Menu drawer) button
    navItems.push({
        id: 'mobileSidebarMenuBtn',
        isAction: true,
        action: 'toggleSidebar',
        label: isEn ? 'All Menu' : 'সব মেনু',
        color: '#a855f7',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>'
    });
    
    var html = '<div class="mobile-bottom-nav" id="mobileBottomNav">';
    html += '<div class="mobile-nav-items">';
    
    navItems.forEach(function(item) {
        if (item.isAction) {
            html += '<button class="mobile-nav-item" onclick="' + item.action + '()" title="' + item.label + '">';
            html += '<span class="nav-icon" style="color: ' + item.color + ';">' + item.svg + '</span>';
            html += '<span class="nav-label">' + item.label + '</span>';
            html += '</button>';
        } else {
            var activeClass = APP.currentPage === item.id ? 'active' : '';
            html += '<button class="mobile-nav-item ' + activeClass + '" onclick="navigateTo(\'' + item.id + '\')" data-page="' + item.id + '" title="' + item.label + '">';
            html += '<span class="nav-icon" style="color: ' + item.color + ';">' + item.svg + '</span>';
            html += '<span class="nav-label">' + item.label + '</span>';
            html += '</button>';
        }
    });
    
    html += '</div>';
    html += '</div>';
    
    document.body.insertAdjacentHTML('beforeend', html);
    updateMobileNavActive(APP.currentPage || 'dashboard');
}

function updateMobileNavActive(page) {
    var items = document.querySelectorAll('.mobile-nav-item');
    items.forEach(function(item) {
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
            try {
                item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } catch(e) {}
        } else if (item.hasAttribute('data-page')) {
            item.classList.remove('active');
        }
    });
}

// ===== WINDOW RESIZE =====
window.addEventListener('resize', function() {
    var nav = document.getElementById('mobileBottomNav');
    if (window.innerWidth <= 768) {
        if (!nav) {
            createMobileNav();
        }
    } else {
        if (nav) {
            nav.remove();
        }
    }
});

// ==================== LANGUAGE FUNCTIONS ====================
function toggleLanguage() {
    if (APP.language === 'bn') {
        APP.language = 'en';
    } else {
        APP.language = 'bn';
    }
    
    // ✅ সেটিংসে ভাষা সেভ করুন
    if (APP.settings) {
        APP.settings.language = APP.language;
    }
    
    // ✅ HTML lang সেট করুন
    document.documentElement.lang = APP.language;
    
    // ✅ মিটার সিলেক্টর আপডেট করুন
    if (typeof fixMeterSelectorLanguage === 'function') {
        fixMeterSelectorLanguage();
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
    var L = APP.language || 'bn';
    var translations = APP.translations[L] || APP.translations.bn;
    
    // ✅ ১. হেডার ল্যাঙ্গুয়েজ বাটন লেবেল আপডেট
    var headerLangLabel = document.getElementById('headerLangLabel');
    if (headerLangLabel) {
        headerLangLabel.textContent = (L === 'bn' ? 'English' : 'বাংলা');
    }
    var headerLangBtn = document.querySelector('.header-lang-btn');
    if (headerLangBtn) {
        headerLangBtn.setAttribute('title', L === 'bn' ? 'English এ পরিবর্তন করুন' : 'বাংলায় পরিবর্তন করুন');
    }

    // ✅ ২. ড্যাশবোর্ডের ল্যাঙ্গুয়েজ বাটন আপডেট (যদি থাকে)
    document.querySelectorAll('.lang-toggle-btn').forEach(function(btn) {
        var spanLast = btn.querySelector('span:last-child');
        if (spanLast) {
            spanLast.textContent = (L === 'bn' ? 'English' : 'বাংলা');
        }
    });

    // ✅ ৩. ব্র্যান্ড টাইটেল আপডেট
    var brandTitle = document.querySelector('.header-brand-title');
    if (brandTitle) {
        brandTitle.textContent = (L === 'en' ? 'Biddut Bill' : 'বিদ্যুৎ বিল');
    }
    var sidebarTitle = document.querySelector('.sidebar-brand span');
    if (sidebarTitle) {
        sidebarTitle.textContent = (L === 'en' ? 'Biddut Bill' : 'বিদ্যুৎ বিল');
    }

    // ✅ ৪. সাইডবার টেক্সট আপডেট
    document.querySelectorAll('.nav-text[data-key]').forEach(function(el) {
        var key = el.getAttribute('data-key');
        if (translations[key]) {
            el.textContent = translations[key];
        }
    });
    
    // ✅ ৫. মোবাইল নেভিগেশন আপডেট
    document.querySelectorAll('.mobile-nav-item .nav-label').forEach(function(el) {
        var parent = el.closest('.mobile-nav-item');
        if (parent) {
            var page = parent.getAttribute('data-page');
            if (page) {
                var key = 'sidebar' + page.charAt(0).toUpperCase() + page.slice(1);
                if (translations[key]) {
                    el.textContent = translations[key];
                }
            }
        }
    });
    
    // ✅ ৬. ইউজার রোল আপডেট
    var roleEl = document.getElementById('sidebarUserRole');
    if (roleEl && APP.currentUser) {
        roleEl.textContent = APP.currentUser.role === 'admin' ? 
            (L === 'en' ? 'Admin' : 'অ্যাডমিন') : 
            (L === 'en' ? 'User' : 'ইউজার');
    }
}

// ==================== APPLY SETTINGS ====================
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
    
    // ✅ ভাষা সেট করুন
    if (APP.settings && APP.settings.language) {
        APP.language = APP.settings.language;
    }
    updateAllSidebarTexts();

    // ✅ সরকারি রিবেট রেট ০.৬% আপডেট (পুরনো ০.৮৫% থাকলে)
    if (APP.settings && (APP.settings.rebateRate === 0.85 || !APP.settings.rebateRate)) {
        APP.settings.rebateRate = 0.6;
    }
}

// Toast notifications handled by deduplicated showToast in js/utils.js

// ==================== DROPDOWN FUNCTIONS ====================

// ড্রপডাউন টগল
function toggleDropdown() {
    var menu = document.getElementById('dropdownMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// ড্রপডাউন বন্ধ (বাইরে ক্লিক করলে)
document.addEventListener('click', function(e) {
    var selector = document.querySelector('.user-selector');
    var menu = document.getElementById('dropdownMenu');
    if (selector && menu && !selector.contains(e.target)) {
        menu.classList.remove('show');
    }
});

// ড্যাশবোর্ড সুইচ
function switchDashboard(type) {
    var newDashboard = document.getElementById('newDashboard');
    var oldDashboard = document.getElementById('oldDashboard');
    var label = document.getElementById('currentViewLabel');

    if (!newDashboard || !oldDashboard) {
        console.warn('Dashboard elements not found');
        return;
    }

    document.querySelectorAll('.dropdown-menu li').forEach(function(li) {
        li.classList.remove('active-option');
    });

    if (type === 'new') {
        newDashboard.style.display = 'block';
        oldDashboard.style.display = 'none';
        if (label) label.textContent = __('sidebarDashboard');
        var activeItem = document.querySelector('.dropdown-menu li[data-view="new"]');
        if (activeItem) activeItem.classList.add('active-option');
        
        setTimeout(function() {
            if (window.usageChart) window.usageChart.resize();
            if (window.pieChart) window.pieChart.resize();
        }, 100);
    } else {
        newDashboard.style.display = 'none';
        oldDashboard.style.display = 'block';
        if (label) label.textContent = 'পুরনো ড্যাশ';
        var activeItem = document.querySelector('.dropdown-menu li[data-view="old"]');
        if (activeItem) activeItem.classList.add('active-option');
    }

    var menu = document.getElementById('dropdownMenu');
    if (menu) menu.classList.remove('show');
}

// ==================== INIT ON LOAD ====================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
        // ✅ সেটিংস থেকে ভাষা লোড করুন
        if (APP.settings && APP.settings.language) {
            APP.language = APP.settings.language;
        }
        initApp();
    });
} else {
    // ✅ সেটিংস থেকে ভাষা লোড করুন
    if (APP.settings && APP.settings.language) {
        APP.language = APP.settings.language;
    }
    initApp();
}

// ============================================================
// রিফ্রেশের পর রেন্ট ও এক্সপেন্স ডাটা অটো-লোড (সরলীকৃত)
// ============================================================
(function autoLoadAllData() {
    window.addEventListener('load', function() {
        setTimeout(function() {
            // ✅ সরাসরি চেক - isFirebaseReady ব্যবহার না করে
            if (APP && APP.currentUser && typeof database !== 'undefined' && database !== null) {
                var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
                var userId = APP.currentUser.id || APP.currentUser.email || 'default';
                var expenseKey = 'expenseData_' + userId;
                
                database.ref('users/' + userEmail + '/app').once('value').then(function(snapshot) {
                    var data = snapshot.val();
                    if (data) {
                        // রেন্ট
                        if (data.rentData) {
                            APP.rentData = data.rentData;
                            if (!Array.isArray(APP.rentData.records)) APP.rentData.records = [];
                            console.log('✅ রেন্ট ডাটা লোড! রেকর্ড:', APP.rentData.records.length);
                        }
                        // এক্সপেন্স
                        if (data.expenseData) {
                            APP[expenseKey] = data.expenseData;
                            if (!Array.isArray(APP[expenseKey].records)) APP[expenseKey].records = [];
                            console.log('✅ এক্সপেন্স ডাটা লোড! রেকর্ড:', APP[expenseKey].records.length);
                        }
                        // পেজ রিফ্রেশ
                        if (APP.currentPage === 'rent') {
                            showRentReport();
                        } else if (APP.currentPage === 'expenses') {
                            showExpenseReport();
                        } else {
                            // ড্যাশবোর্ডে থাকলে রিফ্রেশ
                            if (APP.currentPage === 'dashboard') {
                                showDashboard();
                            }
                        }
                    }
                }).catch(function(err) {
                    console.warn('⚠️ ডাটা লোড করতে ব্যর্থ:', err);
                });
            } else {
                console.log('⏳ Firebase এখনও প্রস্তুত নয়, 2 সেকেন্ড পর চেষ্টা...');
                setTimeout(function() {
                    if (APP && APP.currentUser && typeof database !== 'undefined' && database !== null) {
                        var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
                        var userId = APP.currentUser.id || APP.currentUser.email || 'default';
                        var expenseKey = 'expenseData_' + userId;
                        
                        database.ref('users/' + userEmail + '/app').once('value').then(function(snapshot) {
                            var data = snapshot.val();
                            if (data && data.expenseData) {
                                APP[expenseKey] = data.expenseData;
                                console.log('✅ এক্সপেন্স ডাটা লোড! রেকর্ড:', APP[expenseKey]?.records?.length || 0);
                                if (APP.currentPage === 'expenses') {
                                    showExpenseReport();
                                }
                            }
                        });
                    }
                }, 2000);
            }
        }, 1000);
    });
})();