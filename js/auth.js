// ==================== AUTHENTICATION ====================
// Firebase-based auth (NO localStorage users)
// Admin: ONLY k.m.abubakkarsiddek@gmail.com

function showLoginPage() {
    document.body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    document.body.style.minHeight = "100vh";
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";
    document.body.style.padding = "20px";
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    document.getElementById("appPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";

    document.getElementById("authPage").innerHTML = `
        <div style="width:100%; max-width:560px; margin:0 auto;">
            <div style="background:white; border-radius:24px; padding:45px 60px; box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                <!-- Logo -->
                <div style="text-align:center; margin-bottom:30px;">
                    <div style="font-size:52px; display:inline-block; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); width:85px; height:85px; line-height:85px; border-radius:50%; color:white; margin-bottom:12px; box-shadow:0 8px 30px rgba(102,126,234,0.4);">⚡</div>
                    <h1 style="font-size:30px; font-weight:700; color:#2d3748; margin:0;">বিদ্যুৎ বিল</h1>
                    <p style="font-size:14px; color:#718096; letter-spacing:1px; margin:4px 0 0 0;">Electricity Bill Manager</p>
                </div>

                <div style="text-align:center; margin-bottom:30px;">
                    <h2 style="font-size:24px; font-weight:700; color:#2d3748; margin:0 0 6px 0;">স্বাগতম</h2>
                    <p style="font-size:15px; color:#718096; margin:0;">আপনার অ্যাকাউন্টে লগইন করুন</p>
                </div>

                <form onsubmit="event.preventDefault(); login();">
                    <div style="margin-bottom:20px;">
                        <label style="display:block; font-size:14px; font-weight:600; color:#4a5568; margin-bottom:6px;">ইমেইল</label>
                        <div style="display:flex; align-items:center; background:#f7fafc; border:2px solid #e2e8f0; border-radius:12px;">
                            <span style="padding:0 12px 0 16px; font-size:18px; color:#a0aec0;">📧</span>
                            <input type="email" id="loginEmail" placeholder="আপনার ইমেইল" style="width:100%; padding:14px 16px 14px 0; border:none; background:transparent; font-size:15px; color:#2d3748; outline:none;" required>
                        </div>
                    </div>

                    <div style="margin-bottom:20px;">
                        <label style="display:block; font-size:14px; font-weight:600; color:#4a5568; margin-bottom:6px;">পাসওয়ার্ড</label>
                        <div style="display:flex; align-items:center; background:#f7fafc; border:2px solid #e2e8f0; border-radius:12px;">
                            <span style="padding:0 12px 0 16px; font-size:18px; color:#a0aec0;">🔐</span>
                            <input type="password" id="loginPassword" placeholder="পাসওয়ার্ড লিখুন" style="width:100%; padding:14px 16px 14px 0; border:none; background:transparent; font-size:15px; color:#2d3748; outline:none;" required>
                        </div>
                    </div>

                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:25px;">
                        <input type="checkbox" id="rememberMe" style="width:18px; height:18px; accent-color:#667eea; cursor:pointer;">
                        <label for="rememberMe" style="font-size:14px; color:#4a5568; cursor:pointer;">আমাকে মনে রাখুন</label>
                    </div>

                    <button type="submit" style="width:100%; padding:15px; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border:none; border-radius:12px; font-size:17px; font-weight:600; cursor:pointer; transition:all 0.3s ease; box-shadow:0 4px 15px rgba(102,126,234,0.4);">লগইন করুন</button>
                </form>

                <div style="display:flex; align-items:center; margin:25px 0; color:#a0aec0; font-size:14px;">
                    <span style="margin:0 15px;">অ্যাকাউন্ট নেই?</span>
                </div>

                <button onclick="showRegisterPage()" style="width:100%; padding:14px; background:transparent; color:#4a5568; border:2px solid #e2e8f0; border-radius:12px; font-size:16px; font-weight:600; cursor:pointer; transition:all 0.3s ease;">নতুন অ্যাকাউন্ট তৈরি করুন</button>

                
            </div>
        </div>
    `;
}

function showRegisterPage() {
    document.getElementById("appPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";

    document.getElementById("authPage").innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <!-- Logo -->
                <div class="auth-logo">
                    <div class="logo-icon">⚡</div>
                    <h1>বিদ্যুৎ বিল</h1>
                    <p>Electricity Bill Manager</p>
                </div>

                <div class="auth-header">
                    <h2>নতুন অ্যাকাউন্ট</h2>
                    <p>আজই যোগ দিন</p>
                </div>

                <form onsubmit="event.preventDefault(); register();">
                    <div class="input-group">
                        <label>পুরো নাম</label>
                        <div class="input-field">
                            <span class="icon">👤</span>
                            <input type="text" id="regName" placeholder="আপনার নাম">
                        </div>
                    </div>

                    <div class="input-group">
                        <label>ইমেইল</label>
                        <div class="input-field">
                            <span class="icon">📧</span>
                            <input type="email" id="regEmail" placeholder="আপনার ইমেইল">
                        </div>
                    </div>

                    <div class="input-group">
                        <label>পাসওয়ার্ড</label>
                        <div class="input-field">
                            <span class="icon">🔐</span>
                            <input type="password" id="regPassword" placeholder="কমপক্ষে ৬ অক্ষর">
                        </div>
                        <small class="hint">কমপক্ষে ৬ অক্ষর ব্যবহার করুন</small>
                    </div>

                    <button type="submit" class="btn-primary">অ্যাকাউন্ট তৈরি করুন</button>
                </form>

                <div class="divider">
                    <span>অ্যাকাউন্ট আছে?</span>
                </div>

                <button class="btn-secondary" onclick="showLoginPage()">লগইন করুন</button>

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
