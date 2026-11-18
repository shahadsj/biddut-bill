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
            <!-- Lightning Canvas -->
            <canvas id="authLightningCanvas" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2;"></canvas>
            
            <!-- Shock & Surge Screen Flashes -->
            <div id="authShockFlash" style="position: absolute; inset: 0; background: rgba(239, 68, 68, 0.28); pointer-events: none; z-index: 3; opacity: 0; transition: opacity 0.12s;"></div>
            <div id="authSurgeFlash" style="position: absolute; inset: 0; background: rgba(16, 185, 129, 0.28); pointer-events: none; z-index: 3; opacity: 0; transition: opacity 0.15s;"></div>

            <!-- Overhead High Voltage Power Wire -->
            <svg style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 140px; height: 42px; pointer-events: none; z-index: 4;" viewBox="0 0 140 42">
                <path d="M 70 0 L 70 32" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
                <path id="authPowerWire" d="M 70 0 L 70 32" stroke="#38bdf8" stroke-width="2.5" class="auth-wire-spark" opacity="0.8"/>
                <rect x="62" y="26" width="16" height="8" rx="2" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
            </svg>

            <div class="auth-card-modern" id="loginCardModern">
                <!-- Voltage & Grid Status Strip -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; font-size: 11px; font-family: monospace;">
                    <span style="color: #64748b; display: flex; align-items: center; gap: 5px;">
                        <span id="authVoltDot" style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                        <span id="authVoltLabel">গ্রিড: 220V STABLE</span>
                    </span>
                    <span id="authBreakerState" style="color: #059669; font-weight: bold; background: #ecfdf5; padding: 2px 8px; border-radius: 12px; font-size: 10px;">সংযুক্ত</span>
                </div>

                <!-- Logo Badge -->
                <div class="auth-bolt-badge" id="authBoltBadge"><img src="favicon.svg" alt="বিদ্যুৎ বিল"></div>
                <h1 class="auth-title">বিদ্যুৎ বিল</h1>
                <p class="auth-subtitle">Electricity Bill Manager</p>

                <!-- Welcome Headings -->
                <h2 class="auth-heading">স্বাগতম</h2>
                <p class="auth-subheading">আপনার অ্যাকাউন্টে লগইন করুন</p>

                <!-- Form -->
                <form onsubmit="event.preventDefault(); login();">
                    <div class="auth-input-group">
                        <label for="loginEmail">ইমেইল</label>
                        <div class="auth-input-box" id="loginEmailBox">
                            <span class="auth-input-icon">✉️</span>
                            <input type="email" id="loginEmail" placeholder="আপনার ইমেইল" required autocomplete="email">
                        </div>
                    </div>

                    <div class="auth-input-group">
                        <label for="loginPassword">পাসওয়ার্ড</label>
                        <div class="auth-input-box" id="loginPasswordBox">
                            <span class="auth-input-icon">🔒</span>
                            <input type="password" id="loginPassword" placeholder="পাসওয়ার্ড লিখুন" required autocomplete="current-password" oninput="onAuthPasswordTyping()">
                        </div>
                    </div>

                    <div class="auth-checkbox-row">
                        <input type="checkbox" id="rememberMe">
                        <label for="rememberMe">আমাকে মনে রাখুন</label>
                    </div>

                    <!-- Status Alert Box -->
                    <div id="loginStatusAlert" style="display: none; margin-bottom: 12px; padding: 8px 12px; border-radius: 10px; font-size: 12px; font-weight: 600; text-align: center;"></div>

                    <button type="submit" class="auth-btn-primary" id="loginBtnPrimary">
                        <span id="loginBtnText">লগইন করুন</span>
                        <span id="loginBtnIcon" style="font-size: 16px;">↪</span>
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

    setTimeout(function() {
        initLoginCanvasAnimations();
    }, 50);
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
                <div class="auth-bolt-badge"><img src="favicon.svg" alt="বিদ্যুৎ বিল"></div>
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
                triggerLoginPowerSurge();

                setTimeout(function() {
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
                }, 650);
            } else {
                triggerLoginElectricShock();
                showToast(APP.language === 'en' ? 'Invalid email or password' : 'ভুল ইমেইল বা পাসওয়ার্ড', 'error');
            }
        }).catch(function(err) {
            triggerLoginElectricShock();
            showToast(err.message, 'error');
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

// ==================== AUTH ELECTRIC ANIMATIONS & SOUNDS ====================
var authAnim = {
    canvas: null,
    ctx: null,
    sparks: [],
    bolts: [],
    animId: null
};

function playAuthElectricZapSound() {
    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        var actx = new AudioContext();
        var osc = actx.createOscillator();
        var gain = actx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, actx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.35, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.4);

        var osc2 = actx.createOscillator();
        var gain2 = actx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(90, actx.currentTime);
        gain2.gain.setValueAtTime(0.2, actx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.25);
        osc2.connect(gain2);
        gain2.connect(actx.destination);
        osc2.start();
        osc2.stop(actx.currentTime + 0.25);
    } catch(e) {}
}

function playAuthPowerUpSound() {
    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        var actx = new AudioContext();
        var osc = actx.createOscillator();
        var gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(580, actx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.5);
    } catch(e) {}
}

function onAuthPasswordTyping() {
    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        var actx = new AudioContext();
        var osc = actx.createOscillator();
        var gain = actx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480 + Math.random() * 200, actx.currentTime);
        gain.gain.setValueAtTime(0.06, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.05);
    } catch(e) {}
}

function initLoginCanvasAnimations() {
    var c = document.getElementById('authLightningCanvas');
    if (!c) return;
    authAnim.canvas = c;
    authAnim.ctx = c.getContext('2d');
    authAnim.sparks = [];
    authAnim.bolts = [];

    function resize() {
        if (!authAnim.canvas) return;
        var p = authAnim.canvas.parentElement;
        if (p) {
            authAnim.canvas.width = p.clientWidth || window.innerWidth;
            authAnim.canvas.height = p.clientHeight || window.innerHeight;
        }
    }
    resize();
    window.addEventListener('resize', resize);

    if (authAnim.animId) cancelAnimationFrame(authAnim.animId);

    function loop() {
        if (!authAnim.canvas || !authAnim.ctx) return;
        var ctx = authAnim.ctx;
        ctx.clearRect(0, 0, authAnim.canvas.width, authAnim.canvas.height);

        // Render lightning bolts
        for (var b = authAnim.bolts.length - 1; b >= 0; b--) {
            var bolt = authAnim.bolts[b];
            ctx.save();
            ctx.strokeStyle = bolt.color;
            ctx.globalAlpha = bolt.alpha;
            ctx.shadowColor = bolt.glow;
            ctx.shadowBlur = 18;
            ctx.lineWidth = bolt.width;
            ctx.beginPath();
            for (var s = 0; s < bolt.segments.length; s++) {
                var pt = bolt.segments[s];
                if (s === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();
            ctx.restore();

            bolt.alpha -= 0.09;
            if (bolt.alpha <= 0) authAnim.bolts.splice(b, 1);
        }

        // Render sparks
        for (var i = authAnim.sparks.length - 1; i >= 0; i--) {
            var sp = authAnim.sparks[i];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.life -= sp.decay;
            if (sp.life <= 0) {
                authAnim.sparks.splice(i, 1);
                continue;
            }
            ctx.save();
            ctx.globalAlpha = sp.life;
            ctx.fillStyle = sp.color;
            ctx.shadowColor = sp.color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        authAnim.animId = requestAnimationFrame(loop);
    }
    loop();
}

function spawnAuthSparks(x, y, count, colorType) {
    if (!authAnim.sparks) authAnim.sparks = [];
    for (var i = 0; i < count; i++) {
        var angle = Math.random() * Math.PI * 2;
        var speed = Math.random() * 9 + 4;
        authAnim.sparks.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1.5,
            life: 1.0,
            decay: Math.random() * 0.05 + 0.03,
            color: colorType === 'shock' ? (Math.random() > 0.4 ? '#ef4444' : '#fbbf24') : (Math.random() > 0.5 ? '#10b981' : '#38bdf8')
        });
    }
}

function generateAuthBolt(sx, sy, ex, ey) {
    if (!authAnim.bolts) authAnim.bolts = [];
    var segments = [{ x: sx, y: sy }];
    var count = 10;
    var curX = sx;
    var curY = sy;
    var dx = (ex - sx) / count;
    var dy = (ey - sy) / count;

    for (var i = 1; i < count; i++) {
        var nx = curX + dx + (Math.random() - 0.5) * 45;
        var ny = curY + dy + (Math.random() - 0.5) * 25;
        segments.push({ x: nx, y: ny });
        curX = nx;
        curY = ny;
    }
    segments.push({ x: ex, y: ey });
    authAnim.bolts.push({ segments: segments, alpha: 1.0, color: '#fef08a', glow: '#ef4444', width: 2.5 });
}

function triggerLoginElectricShock() {
    playAuthElectricZapSound();

    var card = document.getElementById('loginCardModern');
    var emailBox = document.getElementById('loginEmailBox');
    var passBox = document.getElementById('loginPasswordBox');
    var btn = document.getElementById('loginBtnPrimary');
    var btnText = document.getElementById('loginBtnText');
    var btnIcon = document.getElementById('loginBtnIcon');
    var status = document.getElementById('loginStatusAlert');
    var flash = document.getElementById('authShockFlash');
    var wire = document.getElementById('authPowerWire');
    var dot = document.getElementById('authVoltDot');
    var voltLabel = document.getElementById('authVoltLabel');
    var breaker = document.getElementById('authBreakerState');

    if (card) {
        card.classList.remove('auth-card-shock', 'auth-card-surge');
        void card.offsetWidth;
        card.classList.add('auth-card-shock');
    }

    if (flash) {
        flash.style.opacity = '0.7';
        setTimeout(function() { flash.style.opacity = '0.1'; }, 70);
        setTimeout(function() { flash.style.opacity = '0.45'; }, 150);
        setTimeout(function() { flash.style.opacity = '0'; }, 300);
    }

    if (emailBox) emailBox.style.borderColor = '#ef4444';
    if (passBox) passBox.style.borderColor = '#ef4444';

    if (wire) {
        wire.setAttribute('stroke', '#ef4444');
        wire.style.opacity = '1';
    }

    if (dot) dot.style.background = '#ef4444';
    if (voltLabel) {
        voltLabel.innerText = '⚡ 440V OVERLOAD!';
        voltLabel.style.color = '#ef4444';
        voltLabel.style.fontWeight = 'bold';
    }
    if (breaker) {
        breaker.innerText = 'TRIPPED ⚠️';
        breaker.style.color = '#dc2626';
        breaker.style.background = '#fee2e2';
    }

    if (btn) btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    if (btnText) btnText.innerText = 'শর্ট সার্কিট! ভুল পাসওয়ার্ড';
    if (btnIcon) btnIcon.innerText = '⚡';

    if (status) {
        status.style.display = 'block';
        status.style.background = '#fef2f2';
        status.style.border = '1px solid #fecaca';
        status.style.color = '#b91c1c';
        status.innerHTML = '⚡ <strong>শর্ট সার্কিট!</strong> ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।';
    }

    if (card && authAnim.canvas) {
        var rect = card.getBoundingClientRect();
        var cRect = authAnim.canvas.getBoundingClientRect();
        var cx = rect.left - cRect.left + rect.width / 2;
        var cy = rect.top - cRect.top + rect.height / 2;

        generateAuthBolt(authAnim.canvas.width / 2, 40, cx + (Math.random() - 0.5) * 80, cy - rect.height / 2 + 10);
        generateAuthBolt(cx - 90, cy - 20, cx + 90, cy - 20);
        spawnAuthSparks(cx, cy - 30, 45, 'shock');
        spawnAuthSparks(cx, cy + 60, 50, 'shock');
    }

    // Reset back after 3.2 seconds
    setTimeout(function() {
        if (card) {
            card.classList.remove('auth-card-shock');
            card.style.border = '';
        }
        if (emailBox) emailBox.style.borderColor = '';
        if (passBox) passBox.style.borderColor = '';
        if (wire) {
            wire.setAttribute('stroke', '#38bdf8');
            wire.style.opacity = '0.8';
        }
        if (dot) dot.style.background = '#10b981';
        if (voltLabel) {
            voltLabel.innerText = 'গ্রিড: 220V STABLE';
            voltLabel.style.color = '';
            voltLabel.style.fontWeight = '';
        }
        if (breaker) {
            breaker.innerText = 'সংযুক্ত';
            breaker.style.color = '#059669';
            breaker.style.background = '#ecfdf5';
        }
        if (btn) btn.style.background = '';
        if (btnText) btnText.innerText = 'লগইন করুন';
        if (btnIcon) btnIcon.innerText = '↪';
        if (status) status.style.display = 'none';
    }, 3200);
}

function triggerLoginPowerSurge() {
    playAuthPowerUpSound();

    var card = document.getElementById('loginCardModern');
    var btn = document.getElementById('loginBtnPrimary');
    var btnText = document.getElementById('loginBtnText');
    var btnIcon = document.getElementById('loginBtnIcon');
    var status = document.getElementById('loginStatusAlert');
    var flash = document.getElementById('authSurgeFlash');
    var wire = document.getElementById('authPowerWire');
    var dot = document.getElementById('authVoltDot');
    var voltLabel = document.getElementById('authVoltLabel');
    var breaker = document.getElementById('authBreakerState');

    if (card) {
        card.classList.remove('auth-card-shock', 'auth-card-surge');
        void card.offsetWidth;
        card.classList.add('auth-card-surge');
    }

    if (flash) {
        flash.style.opacity = '0.6';
        setTimeout(function() { flash.style.opacity = '0'; }, 350);
    }

    if (wire) {
        wire.setAttribute('stroke', '#10b981');
        wire.style.opacity = '1';
    }

    if (dot) dot.style.background = '#10b981';
    if (voltLabel) {
        voltLabel.innerText = '⚡ GRID 100% ONLINE';
        voltLabel.style.color = '#059669';
        voltLabel.style.fontWeight = 'bold';
    }
    if (breaker) {
        breaker.innerText = 'OPTIMAL ✓';
        breaker.style.color = '#059669';
        breaker.style.background = '#ecfdf5';
    }

    if (btn) btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    if (btnText) btnText.innerText = 'পাওয়ার অন! সংযোগ সফল...';
    if (btnIcon) btnIcon.innerText = '✓';

    if (status) {
        status.style.display = 'block';
        status.style.background = '#ecfdf5';
        status.style.border = '1px solid #a7f3d0';
        status.style.color = '#065f46';
        status.innerHTML = '⚡ <strong>পাওয়ার গ্রিড সংযুক্ত!</strong> ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...';
    }

    if (card && authAnim.canvas) {
        var rect = card.getBoundingClientRect();
        var cRect = authAnim.canvas.getBoundingClientRect();
        var cx = rect.left - cRect.left + rect.width / 2;
        var cy = rect.top - cRect.top + rect.height / 2;
        spawnAuthSparks(cx, cy, 60, 'surge');
    }
}
