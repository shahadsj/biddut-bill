function escapeHtml(s){if(!s)return"";return s.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#039;").replace(/"/g,"&quot;");}

// ==================== PROFILE ====================
function showProfile() {
    if (!APP.currentUser) { showLoginPage(); return; }
    var L = APP.language;
    
    // Check badges first
    checkBadges();
    
    var totalTransactions = Object.values(APP.metersData).reduce(function(sum, meter) {
        return sum + (meter.transactions ? meter.transactions.length : 0);
    }, 0);
    var totalRecharge = Object.values(APP.metersData).reduce(function(sum, meter) {
        return sum + (meter.totalRecharge || 0);
    }, 0);
    var totalExpended = Object.values(APP.metersData).reduce(function(sum, meter) {
        return sum + (meter.totalExpended || 0);
    }, 0);
    
    document.getElementById('pageContent').innerHTML = [
        '<div class="card">',
            '<h2>&#x1F464; '+(L==='en'?'Profile':'প্রোফাইল')+'</h2>',
            '<div class="form-group"><label>'+(L==='en'?'Name':'নাম')+'</label>',
                '<input type="text" class="form-control" id="profileName" value="'+escapeHtml(APP.currentUser.name)+'"></div>',
            '<div class="form-group"><label>'+(L==='en'?'Email':'ইমেইল')+'</label>',
                '<input type="email" class="form-control" id="profileEmail" value="'+escapeHtml(APP.currentUser.email)+'" disabled></div>',
            '<div class="form-group"><label>'+(L==='en'?'New Password (leave blank to keep current)':'নতুন পাসওয়ার্ড (পরিবর্তন না করতে চাইলে খালি রাখুন)')+'</label>',
                '<input type="password" class="form-control" id="profilePassword" placeholder="'+(L==='en'?'New password':'নতুন পাসওয়ার্ড')+'"></div>',
            '<button class="btn" onclick="updateProfile()">'+(L==='en'?'Update Profile':'আপডেট প্রোফাইল')+'</button>',
        '</div>',
        '<div class="stats-grid" style="margin-top: 20px;">',
            '<div class="stat-card" style="background: var(--gradient-1);"><div class="label">'+(L==='en'?'Total Meters':'মোট মিটার')+'</div><div class="value">'+APP.meters.length+'</div></div>',
            '<div class="stat-card" style="background: var(--gradient-2);"><div class="label">'+(L==='en'?'Total Transactions':'মোট ট্রানজেকশন')+'</div><div class="value">'+totalTransactions+'</div></div>',
            '<div class="stat-card" style="background: var(--gradient-3);"><div class="label">'+(L==='en'?'Total Recharge':'মোট রিচার্জ')+'</div><div class="value">৳ '+totalRecharge.toFixed(0)+'</div></div>',
            '<div class="stat-card" style="background: var(--gradient-4);"><div class="label">'+(L==='en'?'Total Expense':'মোট খরচ')+'</div><div class="value">৳ '+totalExpended.toFixed(0)+'</div></div>',
        '</div>',
        '<div class="card" style="margin-top: 20px;">',
            '<h3>&#x1F3C6; '+(L==='en'?'Earned Badges':'অর্জিত ব্যাজ')+'</h3>',
            '<div style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px;">',
                (APP.badges.length > 0 ? 
                    APP.badges.map(function(b) {
                        return '<span style="background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); color: #333; padding: 10px 20px; border-radius: 25px; font-weight: bold; font-size: 14px; box-shadow: 0 3px 10px rgba(0,0,0,0.2);">'+b+'</span>';
                    }).join('') :
                    '<div style="text-align: center; width: 100%; padding: 20px; color: var(--text-light);">'+
                        '<p style="font-size: 48px; margin-bottom: 10px;">🏅</p>'+
                        '<p>'+(L==='en'?'No badges earned yet.':'এখনও কোন ব্যাজ অর্জিত হয়নি।')+'</p>'+
                        '<p style="font-size: 13px;">'+(L==='en'?'Add 5 bills to earn your first badge!':'৫টি বিল যোগ করে প্রথম ব্যাজ অর্জন করুন!')+'</p>'+
                    '</div>'
                ),
            '</div>',
        '</div>',
        '<div class="card" style="margin-top: 20px;">',
            '<h3>&#x1F4B0; '+(L==='en'?'Savings Goal':'সেভিংস গোল')+'</h3>',
            '<div class="form-group"><label>'+(L==='en'?'Monthly Savings Target (Taka)':'মাসিক সেভিংস টার্গেট (টাকা)')+'</label>',
                '<input type="number" class="form-control" id="savingsGoal" value="'+APP.savingsGoal+'" placeholder="'+(L==='en'?'Target amount':'টার্গেট পরিমাণ')+'"></div>',
            '<button class="btn" onclick="saveSavingsGoal()">'+(L==='en'?'Set Savings Goal':'সেভিংস গোল সেট করুন')+'</button>',
        '</div>',
    ].join('');
}

function updateProfile() {
    var L = APP.language;
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var index = users.findIndex(function(u) { return u.id === APP.currentUser.id; });
    if (index !== -1) {
        users[index].name = document.getElementById('profileName').value;
        var password = document.getElementById('profilePassword').value;
        if (password && password.length >= 6) { users[index].password = password; }
        else if (password && password.length < 6) { showToast(L==='en'?'Password must be at least 6 characters':'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে', 'error'); return; }
        localStorage.setItem('users', JSON.stringify(users));
        APP.currentUser = users[index];
        updateSidebarUserInfo();
        showToast(L==='en'?'Profile updated':'প্রোফাইল আপডেট হয়েছে', 'success');
    }
}

function saveSavingsGoal() {
    APP.savingsGoal = parseFloat(document.getElementById('savingsGoal').value) || 0;
    saveData();
    showToast(APP.language==='en'?'Savings goal saved':'সেভিংস গোল সংরক্ষিত হয়েছে', 'success');
}
