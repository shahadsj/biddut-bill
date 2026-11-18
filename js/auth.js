// ==================== AUTHENTICATION ====================
// Firebase-based auth (NO localStorage users)
// Admin: ONLY k.m.abubakkarsiddek@gmail.com

function showLoginPage() {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#1d4ed8";

    document.getElementById("appPage").style.display = "none";
    var authPage = document.getElementById("authPage");
    authPage.style.display = "block";

    authPage.innerHTML = `
        <div class="auth-page-wrapper">
            <div class="auth-card-modern">
                <!-- Logo Badge -->
                <div class="auth-bolt-badge">⚡</div>
                <h1 class="auth-title">বিদ্যুৎ বিল</h1>
                <p class="auth-subtitle">Electricity Bill Manager</p>

                <!-- Welcome Headings -->
                <h2 class="auth-heading">স্বাগতম</h2>
                <p class="auth-subheading">আপনার অ্যাকাউন্টে লগইন করুন</p>

                <!-- Form -->
                <form onsubmit="event.preventDefault(); login();">
                    <div class="auth-input-group">
                        <label for="loginEmail">ইমেইল</label>
                        <div class="auth-input-box">
                            <span class="auth-input-icon">✉️</span>
                            <input type="email" id="loginEmail" placeholder="আপনার ইমেইল" required autocomplete="email">
                        </div>
                    </div>

                    <div class="auth-input-group">
                        <label for="loginPassword">পাসওয়ার্ড</label>
                        <div class="auth-input-box">
                            <span class="auth-input-icon">🔒</span>
                            <input type="password" id="loginPassword" placeholder="পাসওয়ার্ড লিখুন" required autocomplete="current-password">
                        </div>
                    </div>

                    <div class="auth-checkbox-row">
                        <input type="checkbox" id="rememberMe">
                        <label for="rememberMe">আমাকে মনে রাখুন</label>
                    </div>

                    <button type="submit" class="auth-btn-primary">
                        <span>লগইন করুন</span>
                        <span style="font-size: 16px;">↪</span>
                    </button>
                </form>

                <div class="auth-divider">
                    <span>অ্যাকাউন্ট নেই?</span>
                </div>

                <button type="button" class="auth-btn-secondary" onclick="showRegisterPage()">
                    <span style="font-size: 15px;">👤</span>
                    <span>নতুন অ্যাকাউন্ট তৈরি করুন</span>
                </button>
            </div>
        </div>
    `;
}

function showRegisterPage() {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "#1d4ed8";

    document.getElementById("appPage").style.display = "none";
    var authPage = document.getElementById("authPage");
    authPage.style.display = "block";

    authPage.innerHTML = `
        <div class="auth-page-wrapper">
            <div class="auth-card-modern">
                <!-- Logo Badge -->
                <div class="auth-bolt-badge">⚡</div>
                <h1 class="auth-title">বিদ্যুৎ বিল</h1>
                <p class="auth-subtitle">Electricity Bill Manager</p>

                <!-- Register Headings -->
                <h2 class="auth-heading">নতুন অ্যাকাউন্ট</h2>
                <p class="auth-subheading">আজই যোগ দিন</p>

                <!-- Form -->
                <form onsubmit="event.preventDefault(); register();">
                    <div class="auth-input-group">
                        <label for="regName">পুরো নাম</label>
                        <div class="auth-input-box">
                            <span class="auth-input-icon">👤</span>
                            <input type="text" id="regName" placeholder="আপনার নাম" required autocomplete="name">
                        </div>
                    </div>

                    <div class="auth-input-group">
                        <label for="regEmail">ইমেইল</label>
                        <div class="auth-input-box">
                            <span class="auth-input-icon">✉️</span>
                            <input type="email" id="regEmail" placeholder="আপনার ইমেইল" required autocomplete="email">
                        </div>
                    </div>

                    <div class="auth-input-group">
                        <label for="regPassword">পাসওয়ার্ড</label>
                        <div class="auth-input-box">
                            <span class="auth-input-icon">🔒</span>
                            <input type="password" id="regPassword" placeholder="কমপক্ষে ৬ অক্ষর" required minlength="6" autocomplete="new-password">
                        </div>
                        <small style="display:block; font-size:12px; color:#94a3b8; margin-top:4px; text-align:left;">কমপক্ষে ৬ অক্ষর ব্যবহার করুন</small>
                    </div>

                    <button type="submit" class="auth-btn-primary" style="margin-top: 20px;">
                        <span>অ্যাকাউন্ট তৈরি করুন</span>
                        <span style="font-size: 16px;">✓</span>
                    </button>
                </form>

                <div class="auth-divider">
                    <span>অ্যাকাউন্ট আছে?</span>
                </div>

                <button type="button" class="auth-btn-secondary" onclick="showLoginPage()">
                    <span>লগইন করুন</span>
                    <span style="font-size: 16px;">↪</span>
                </button>

                <div class="auth-footer">
                    <p>সাইন আপ করে আপনি আমাদের শর্তে সম্মত হচ্ছেন</p>
                </div>
            </div>
        </div>
    `;
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

                document.getElementById("authPage").style.display = "none";
                document.getElementById("appPage").style.display = "block";
                document.body.style.background = "";
                document.body.style.margin = "";
                document.body.style.padding = "";

                // Admin check
                if (email === "k.m.abubakkarsiddek@gmail.com") {
                    user.role = "admin";
                    APP.currentUser.role = "admin";
                    document.getElementById("adminNav").style.display = "block";
                    ref.update({role: "admin"});
                } else {
                    document.getElementById("adminNav").style.display = "none";
                }

                updateSidebarUserInfo();

                // Load from Firebase
                if (typeof loadFromCloud === "function") {
                    loadFromCloud().then(function() {
                        if (typeof checkBadges === "function") {
                            checkBadges();
                        }
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
    localStorage.removeItem("biddut_session");
    if (document.getElementById("adminNav")) {
        document.getElementById("adminNav").style.display = "none";
    }

    document.getElementById("appPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";

    showToast("Logged out", "success");
    showLoginPage();
}
