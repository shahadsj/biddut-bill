// ==================== AUTHENTICATION ====================
// Firebase-based auth (NO localStorage users)
// Admin: ONLY k.m.abubakkarsiddek@gmail.com

function showLoginPage() {
    document.getElementById("appPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";
    var L = APP.language;

    document.getElementById("authPage").innerHTML = [
        '<div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">',
            '<div class="card" style="max-width: 400px; width: 90%;">',
                '<h2 style="text-align: center; margin-bottom: 20px;">Login</h2>',
                '<div class="form-group"><label>Email</label>',
                    '<input type="email" class="form-control" id="loginEmail" placeholder="Email">',
                '</div>',
                '<div class="form-group"><label>Password</label>',
                    '<input type="password" class="form-control" id="loginPassword" placeholder="Password">',
                '</div>',
                '<button class="btn" onclick="login()" style="width: 100%; margin-top: 10px;">Login</button>',
                '<p style="text-align: center; margin-top: 15px;"><a href="#" onclick="showRegisterPage()" style="color: var(--primary);">Register</a></p>',
            '</div>',
        '</div>',
    ].join("");
}

function showRegisterPage() {
    document.getElementById("appPage").style.display = "none";
    document.getElementById("authPage").style.display = "block";
    var L = APP.language;

    document.getElementById("authPage").innerHTML = [
        '<div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">',
            '<div class="card" style="max-width: 400px; width: 90%;">',
                '<h2 style="text-align: center; margin-bottom: 20px;">Register</h2>',
                '<div class="form-group"><label>Name</label>',
                    '<input type="text" class="form-control" id="regName" placeholder="Name">',
                '</div>',
                '<div class="form-group"><label>Email</label>',
                    '<input type="email" class="form-control" id="regEmail" placeholder="Email">',
                '</div>',
                '<div class="form-group"><label>Password</label>',
                    '<input type="password" class="form-control" id="regPassword" placeholder="Password">',
                '</div>',
                '<button class="btn" onclick="register()" style="width: 100%; margin-top: 10px;">Register</button>',
                '<p style="text-align: center; margin-top: 15px;"><a href="#" onclick="showLoginPage()" style="color: var(--primary);">Login</a></p>',
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
