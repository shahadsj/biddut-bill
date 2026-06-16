// ==================== AUTHENTICATION ====================
// Firebase-based auth (NO localStorage users)
// Admin: ONLY k.m.abubakkarsiddek@gmail.com

function showLoginPage() {
    document.getElementById("appPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";
    var L = APP.language;

    document.getElementById("authPage").innerHTML = [
        '<div class="auth-page-container">',
            '<div class="auth-content">',
                '<div class="auth-card">',
                    // Logo Section
                    '<div class="auth-logo-section">',
                        '<div class="auth-logo-icon">⚡</div>',
                        '<h1 class="auth-logo-title">বিদ্যুৎ বিল</h1>',
                        '<p class="auth-logo-subtitle">Electricity Bill Manager</p>',
                    '</div>',
                    
                    // Login Header
                    '<div class="auth-header">',
                        '<h2>'+(L==='en'?'Welcome Back':'আপনাকে স্বাগতম')+'</h2>',
                        '<p>'+(L==='en'?'Sign in to your account':'আপনার অ্যাকাউন্টে লগইন করুন')+'</p>',
                    '</div>',
                    
                    // Form
                    '<div class="auth-form">',
                        // Email Input
                        '<div class="form-group">',
                            '<label class="form-label">'+(L==='en'?'Email Address':'ইমেইল')+'</label>',
                            '<div class="input-wrapper">',
                                '<span class="input-icon">📧</span>',
                                '<input type="email" class="form-control auth-input" id="loginEmail" placeholder="'+(L==='en'?'your@email.com':'আপনার ইমেইল')+'">',
                            '</div>',
                        '</div>',
                        
                        // Password Input
                        '<div class="form-group">',
                            '<label class="form-label">'+(L==='en'?'Password':'পাসওয়ার্ড')+'</label>',
                            '<div class="input-wrapper">',
                                '<span class="input-icon">🔐</span>',
                                '<input type="password" class="form-control auth-input" id="loginPassword" placeholder="'+(L==='en'?'Enter your password':'পাসওয়ার্ড লিখুন')+'">',
                            '</div>',
                        '</div>',
                        
                        // Remember Me
                        '<div class="remember-me">',
                            '<input type="checkbox" id="rememberMe">',
                            '<label for="rememberMe">'+(L==='en'?'Remember me':'আমাকে মনে রাখুন')+'</label>',
                        '</div>',
                        
                        // Login Button
                        '<button class="btn auth-btn-primary" onclick="login()">'+(L==='en'?'Sign In':'লগইন করুন')+'</button>',
                    '</div>',
                    
                    // Divider
                    '<div class="auth-divider">',
                        '<span>'+(L==='en'?'Don\'t have an account?':'অ্যাকাউন্ট নেই?')+'</span>',
                    '</div>',
                    
                    // Register Link
                    '<button class="btn auth-btn-secondary" onclick="showRegisterPage()">'+(L==='en'?'Create Account':'নতুন অ্যাকাউন্ট তৈরি করুন')+'</button>',
                    
                    // Footer
                    '<div class="auth-footer">',
                        '<p class="text-small">'+(L==='en'?'Secure login powered by Firebase':'Firebase দ্বারা সুরক্ষিত লগইন')+'</p>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    ].join("");
}

function showRegisterPage() {
    document.getElementById("appPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";
    var L = APP.language;

    document.getElementById("authPage").innerHTML = [
        '<div class="auth-page-container">',
            '<div class="auth-content">',
                '<div class="auth-card">',
                    // Logo Section
                    '<div class="auth-logo-section">',
                        '<div class="auth-logo-icon">⚡</div>',
                        '<h1 class="auth-logo-title">বিদ্যুৎ বিল</h1>',
                        '<p class="auth-logo-subtitle">Electricity Bill Manager</p>',
                    '</div>',
                    
                    // Register Header
                    '<div class="auth-header">',
                        '<h2>'+(L==='en'?'Create Account':'নতুন অ্যাকাউন্ট')+'</h2>',
                        '<p>'+(L==='en'?'Join us today':'আজই যোগ দিন')+'</p>',
                    '</div>',
                    
                    // Form
                    '<div class="auth-form">',
                        // Name Input
                        '<div class="form-group">',
                            '<label class="form-label">'+(L==='en'?'Full Name':'পুরো নাম')+'</label>',
                            '<div class="input-wrapper">',
                                '<span class="input-icon">👤</span>',
                                '<input type="text" class="form-control auth-input" id="regName" placeholder="'+(L==='en'?'John Doe':'আপনার নাম')+'">',
                            '</div>',
                        '</div>',
                        
                        // Email Input
                        '<div class="form-group">',
                            '<label class="form-label">'+(L==='en'?'Email Address':'ইমেইল')+'</label>',
                            '<div class="input-wrapper">',
                                '<span class="input-icon">📧</span>',
                                '<input type="email" class="form-control auth-input" id="regEmail" placeholder="'+(L==='en'?'your@email.com':'আপনার ইমেইল')+'">',
                            '</div>',
                        '</div>',
                        
                        // Password Input
                        '<div class="form-group">',
                            '<label class="form-label">'+(L==='en'?'Password':'পাসওয়ার্ড')+'</label>',
                            '<div class="input-wrapper">',
                                '<span class="input-icon">🔐</span>',
                                '<input type="password" class="form-control auth-input" id="regPassword" placeholder="'+(L==='en'?'Min 6 characters':'কমপক্ষে ৬ অক্ষর')+'">',
                            '</div>',
                            '<small class="password-hint">'+(L==='en'?'Use at least 6 characters':'কমপক্ষে ৬ অক্ষর ব্যবহার করুন')+'</small>',
                        '</div>',
                        
                        // Register Button
                        '<button class="btn auth-btn-primary" onclick="register()">'+(L==='en'?'Create Account':'অ্যাকাউন্ট তৈরি করুন')+'</button>',
                    '</div>',
                    
                    // Divider
                    '<div class="auth-divider">',
                        '<span>'+(L==='en'?'Already have an account?':'অ্যাকাউন্ট আছে?')+'</span>',
                    '</div>',
                    
                    // Login Link
                    '<button class="btn auth-btn-secondary" onclick="showLoginPage()">'+(L==='en'?'Sign In':'লগইন করুন')+'</button>',
                    
                    // Footer
                    '<div class="auth-footer">',
                        '<p class="text-small">'+(L==='en'?'By signing up, you agree to our terms':'সাইন আপ করে আপনি আমাদের শর্তে সম্মত হচ্ছেন')+'</p>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    ].join("");
}

function register() {
    var name = document.getElementById("regName").value;
    var email = document.getElementById("regEmail").value;
    var password = document.getElementById("regPassword").value;

    if (!name || !email || !password) {
        showToast("Please fill all fields", "error");
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
    }

    // ALL users get "user" role - NO ONE can register as admin
    var user = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        role: "user",
        registeredAt: new Date().toISOString()
    };

    // Save to Firebase Realtime Database
    if (typeof database !== "undefined" && database) {
        var key = email.replace(/[.#$\/\[\]]/g, "_");
        var ref = database.ref("users/" + key);

        ref.once("value").then(function(s) {
            if (s.val()) {
                showToast("Email already registered", "error");
                return;
            }
            ref.set(user).then(function() {
                showToast("Registration successful! Please login", "success");
                showLoginPage();
            });
        });
    }
}

function login() {
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    if (typeof database !== "undefined" && database) {
        var key = email.replace(/[.#$\/\[\]]/g, "_");
        var ref = database.ref("users/" + key);

        ref.once("value").then(function(snapshot) {
            var user = snapshot.val();

            if (user && user.password === password) {
                APP.currentUser = user;
                // Save session for persistence
                var sessionData = {
                    userId: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    loginTime: Date.now()
                };
                localStorage.setItem("biddut_session", JSON.stringify(sessionData));
                localStorage.setItem("currentUserId", user.id);

                document.getElementById("authPage").style.display = "none";
                document.getElementById("appPage").style.display = "block";

                // Admin check: ONLY k.m.abubakkarsiddek@gmail.com
                if (email === "k.m.abubakkarsiddek@gmail.com") {
                    user.role = "admin";
                    APP.currentUser.role = "admin";
                    document.getElementById("adminNav").style.display = "block";
                    ref.update({role: "admin"});
                } else {
                    document.getElementById("adminNav").style.display = "none";
                }

                updateSidebarUserInfo();

                if (typeof loadFromCloud === "function") {
                    loadFromCloud().then(function() {
                        navigateTo("dashboard");
                    });
                } else {
                    navigateTo("dashboard");
                }

                showToast("Welcome " + user.name + "!", "success");
            } else {
                showToast("Invalid email or password", "error");
            }
        });
    }
}

function logout() {
    APP.currentUser = null;
    localStorage.removeItem("currentUserId");
    document.getElementById("adminNav").style.display = "none";

    document.getElementById("appPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";

    showToast("Logged out", "success");
    showLoginPage();
}
