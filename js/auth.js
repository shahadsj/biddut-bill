// ==================== AUTHENTICATION ====================
function showLoginPage() {
    document.getElementById('appPage').style.display = 'none';
    document.getElementById('authPage').style.display = 'block';
    var L = APP.language;
    
    document.getElementById('authPage').innerHTML = [
        '<div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">',
            '<div class="card" style="max-width: 400px; width: 90%;">',
                '<div style="text-align: center; margin-bottom: 20px;">',
                    '<div style="font-size: 28px; display: flex; justify-content: center; gap: 10px; margin-bottom: 10px;">',
                        '<span onclick="toggleLanguage()" style="cursor: pointer; padding: 5px 10px; border-radius: 5px; '+(L==='en'?'background: #3498db; color: white;':'background: #eee;')+'">&#x1F1FA;&#x1F1F8; EN</span>',
                        '<span onclick="toggleLanguage()" style="cursor: pointer; padding: 5px 10px; border-radius: 5px; '+(L==='bn'?'background: #3498db; color: white;':'background: #eee;')+'">&#x1F1E7;&#x1F1E9; BN</span>',
                    '</div>',
                '</div>',
                '<h2 style="text-align: center; margin-bottom: 20px;">&#x26A1; '+(L==='en'?'Login':'লগইন')+'</h2>',
                '<div class="form-group">',
                    '<label>'+(L==='en'?'Email':'ইমেইল')+'</label>',
                    '<input type="email" class="form-control" id="loginEmail" placeholder="'+(L==='en'?'Enter email':'ইমেইল লিখুন')+'">',
                '</div>',
                '<div class="form-group">',
                    '<label>'+(L==='en'?'Password':'পাসওয়ার্ড')+'</label>',
                    '<input type="password" class="form-control" id="loginPassword" placeholder="'+(L==='en'?'Enter password':'পাসওয়ার্ড লিখুন')+'">',
                '</div>',
                '<button class="btn" onclick="login()" style="width: 100%; margin-top: 10px;">'+(L==='en'?'Login':'লগইন')+'</button>',
                '<p style="text-align: center; margin-top: 15px;">'+(L==='en'?"Don't have an account?":'অ্যাকাউন্ট নেই?')+' <a href="#" onclick="showRegisterPage()" style="color: var(--primary);">'+(L==='en'?'Register':'রেজিস্টার করুন')+'</a></p>',
            '</div>',
        '</div>',
    ].join('');
}

function showRegisterPage() {
    document.getElementById('appPage').style.display = 'none';
    document.getElementById('authPage').style.display = 'block';
    var L = APP.language;
    
    document.getElementById('authPage').innerHTML = [
        '<div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">',
            '<div class="card" style="max-width: 400px; width: 90%;">',
                '<h2 style="text-align: center; margin-bottom: 20px;">&#x26A1; '+(L==='en'?'Register':'রেজিস্টার')+'</h2>',
                '<div class="form-group">',
                    '<label>'+(L==='en'?'Name':'নাম')+'</label>',
                    '<input type="text" class="form-control" id="regName" placeholder="'+(L==='en'?'Your Name':'আপনার নাম')+'">',
                '</div>',
                '<div class="form-group">',
                    '<label>'+(L==='en'?'Email':'ইমেইল')+'</label>',
                    '<input type="email" class="form-control" id="regEmail" placeholder="'+(L==='en'?'Enter email':'ইমেইল লিখুন')+'">',
                '</div>',
                '<div class="form-group">',
                    '<label>'+(L==='en'?'Password':'পাসওয়ার্ড')+'</label>',
                    '<input type="password" class="form-control" id="regPassword" placeholder="'+(L==='en'?'Enter password':'পাসওয়ার্ড লিখুন')+'">',
                '</div>',
                '<button class="btn" onclick="register()" style="width: 100%; margin-top: 10px;">'+(L==='en'?'Register':'রেজিস্টার')+'</button>',
                '<p style="text-align: center; margin-top: 15px;">'+(L==='en'?'Already have an account?':'ইতিমধ্যে অ্যাকাউন্ট আছে?')+' <a href="#" onclick="showLoginPage()" style="color: var(--primary);">'+(L==='en'?'Login':'লগইন করুন')+'</a></p>',
            '</div>',
        '</div>',
    ].join('');
}

async function getDeviceInfo() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return {
            ip: data.ip,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
    } catch (error) {
        return {
            ip: 'unknown',
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
    }
}

async function register() {
    var L = APP.language;
    var name = document.getElementById('regName').value;
    var email = document.getElementById('regEmail').value;
    var password = document.getElementById('regPassword').value;

    if (!name || !email || !password) {
        showToast(L==='en'?'Please fill all fields':'সব ফিল্ড পূরণ করুন', 'error');
        return;
    }

    if (password.length < 6) {
        showToast(L==='en'?'Password must be at least 6 characters':'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', 'error');
        return;
    }

    var users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(function(u) { return u.email === email; })) {
        showToast(L==='en'?'This email is already registered':'এই ইমেইল ইতিমধ্যে রেজিস্টার্ড', 'error');
        return;
    }

    var deviceInfo = await getDeviceInfo();
    var user = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        role: email === 'admin@admin.com' ? 'admin' : 'user',
        deviceInfo: deviceInfo,
        registeredAt: new Date().toISOString()
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    logActivity('register', (L==='en'?'New user registered':'নতুন ইউজার রেজিস্টার করেছে') + ': ' + name + ' (' + email + ')');

    showToast(L==='en'?'Registration successful! Please login now':'রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন', 'success');
    showLoginPage();
}

function login() {
    var L = APP.language;
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    
    var user = users.find(function(u) { return u.email === email && u.password === password; });
    
    if (user) {
        APP.currentUser = user;
        localStorage.setItem('currentUserId', user.id);
        
        logActivity('login', (L==='en'?'User logged in':'ইউজার লগইন করেছে') + ': ' + user.name + ' (' + user.email + ') - ' + (user.role === 'admin' ? (L==='en'?'Admin':'অ্যাডমিন') : (L==='en'?'User':'ইউজার')));
        
        document.getElementById('authPage').style.display = 'none';
        document.getElementById('appPage').style.display = 'block';
        
        if (user.role === 'admin') {
            document.getElementById('adminNav').style.display = 'block';
        }
        
        showToast((L==='en'?'Welcome ':'স্বাগতম ') + user.name + '!', 'success');
        navigateTo('dashboard');
    } else {
        showToast(L==='en'?'Invalid email or password':'ইমেইল বা পাসওয়ার্ড ভুল', 'error');
    }
}

function logout() {
    var L = APP.language;
    if (APP.currentUser) {
        logActivity('logout', (L==='en'?'User logged out':'ইউজার লগআউট করেছে') + ': ' + APP.currentUser.name + ' (' + APP.currentUser.email + ')');
    }
    
    APP.currentUser = null;
    APP.currentMeter = null;
    localStorage.removeItem('currentUserId');
    document.getElementById('adminNav').style.display = 'none';
    
    document.getElementById('appPage').style.display = 'none';
    document.getElementById('authPage').style.display = 'block';
    
    showToast(L==='en'?'Successfully logged out':'সফলভাবে লগআউট হয়েছে', 'success');
    showLoginPage();
}
