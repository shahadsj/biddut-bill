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
    language: 'bn',
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
            lastExpense: 'সর্বশেষ খরচ',
            noTransactions: 'কোন ট্রানজেকশন নেই',
            recentTransactions: 'সর্বশেষ ট্রানজেকশন',
            recharge: 'রিচার্জ',
            bill: 'বিল',
            taka: '৳',
            addMeter: 'মিটার যোগ করুন',
            welcome: 'স্বাগতম!',
            welcomeMsg: 'প্রথমে একটি মিটার যোগ করুন',
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
            sidebarLogout: 'Logout',
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
    
    // Update mobile nav active
    updateMobileNavActive(page);
    
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
    if (sb) {
        sb.classList.toggle("active");
    }
}

function updateSidebarUserInfo() {
    var ne = document.getElementById("sidebarUserName");
    var re = document.getElementById("sidebarUserRole");
    if (ne && APP.currentUser) ne.textContent = APP.currentUser.name || "User";
    if (re && APP.currentUser) {
        var L = APP.language || 'bn';
        re.textContent = APP.currentUser.role === "admin" ? 
            (L === 'en' ? 'Admin' : 'অ্যাডমিন') : 
            (L === 'en' ? 'User' : 'ইউজার');
        re.className = "badge " + (APP.currentUser.role === "admin" ? "badge-warning" : "badge-success");
    }
}

function logout() {
    localStorage.removeItem("biddut_session");
    APP.currentUser = null;
    var adminNav = document.getElementById("adminNav");
    if (adminNav) adminNav.style.display = "none";
    document.getElementById("appPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";
    if (typeof showLoginPage === "function") showLoginPage();
}

// ==================== SAVE DATA (ONLY FIREBASE) ====================
function saveData() {
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
            
            var adminNav = document.getElementById("adminNav");
            if (adminNav && APP.currentUser.role === "admin") adminNav.style.display = "block";
            if (typeof updateSidebarUserInfo === "function") updateSidebarUserInfo();
            
            // Apply settings
            if (typeof applySettings === "function") {
                applySettings();
            }
            
            // Create mobile nav
            setTimeout(function() {
                if (window.innerWidth <= 768) {
                    createMobileNav();
                }
            }, 500);
            
            // Load from Firebase
            if (typeof loadFromCloud === "function") {
                loadFromCloud().then(function() {
                    // Check badges after loading
                    if (typeof checkBadges === "function") {
                        checkBadges();
                    }
                    setTimeout(function() { 
                        navigateTo("dashboard"); 
                    }, 100);
                });
            } else {
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
    if (document.getElementById('mobileBottomNav')) return;
    
    var isAdmin = APP.currentUser && APP.currentUser.role === 'admin';
    
    var navItems = [
        { id: 'dashboard', icon: '📊', label: 'ড্যাশ' },
        { id: 'meters', icon: '⚡', label: 'মিটার' },
        { id: 'transactions', icon: '💳', label: 'ট্রা.' },
        { id: 'calculator', icon: '🧮', label: 'ক্যাল.' },
        { id: 'reports', icon: '📈', label: 'রিপোর্ট' },
        { id: 'analytics', icon: '📉', label: 'এনা.' },
        { id: 'settings', icon: '⚙️', label: 'সেট.' },
        { id: 'profile', icon: '👤', label: 'প্রো.' }
    ];
    
    if (isAdmin) {
        navItems.push({ id: 'admin', icon: '👑', label: 'অ্যাডমিন', isAdmin: true });
    }
    
    var html = '<div class="mobile-bottom-nav" id="mobileBottomNav">';
    html += '<div class="mobile-nav-items">';
    
    navItems.forEach(function(item) {
        var activeClass = APP.currentPage === item.id ? 'active' : '';
        var adminClass = item.isAdmin ? 'admin-nav' : '';
        html += '<button class="mobile-nav-item ' + activeClass + ' ' + adminClass + '" onclick="navigateTo(\'' + item.id + '\')" data-page="' + item.id + '">';
        html += '<span class="nav-icon">' + item.icon + '</span>';
        html += '<span class="nav-label">' + item.label + '</span>';
        html += '</button>';
    });
    
    html += '</div>';
    html += '</div>';
    
    document.body.insertAdjacentHTML('beforeend', html);
}

function updateMobileNavActive(page) {
    var items = document.querySelectorAll('.mobile-nav-item');
    items.forEach(function(item) {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
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
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;
    
    var toast = document.createElement('div');
    toast.className = 'toast';
    var bgColor = type === 'success' ? '#27ae60' : 
                  type === 'error' ? '#e74c3c' : 
                  type === 'warning' ? '#f39c12' : '#3498db';
    toast.style.background = bgColor;
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '10px';
    toast.style.marginBottom = '10px';
    toast.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    toast.style.animation = 'slideIn 0.3s ease';
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(function() {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// ==================== INIT ON LOAD ====================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}