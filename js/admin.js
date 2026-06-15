// ==================== ADMIN PANEL ====================
function showAdminPanel() {
    if (!APP.currentUser || APP.currentUser.role !== 'admin') {
        showToast("Only admin can access this panel.", "error");
        navigateTo('dashboard');
        return;
    }

    var L = APP.language;
    var html = "";
    html += '<div class="card">';
    html += '  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">';
    html += '    <h2> Admin Panel</h2>';
    html += '    <span class="badge badge-warning" style="font-size: 14px; padding: 8px 15px;">Admin: ' + escapeHtml(APP.currentUser.name) + '</span>';
    html += '  </div>';
    
    // Stats
    var totalMeters = APP.meters ? APP.meters.length : 0;
    var totalTransactions = 0;
    if (APP.metersData) {
        Object.values(APP.metersData).forEach(function(md) {
            totalTransactions += (md.transactions || []).length;
        });
    }
    
    html += '  <div class="stats-grid" style="margin: 20px 0;">';
    html += '    <div class="stat-card" style="background: #667eea;"><div class="label">Meters</div><div class="value">' + totalMeters + '</div></div>';
    html += '    <div class="stat-card" style="background: #27ae60;"><div class="label">Transactions</div><div class="value">' + totalTransactions + '</div></div>';
    html += '    <div class="stat-card" style="background: #f39c12;"><div class="label">Users</div><div class="value" id="adminUserCount">Loading...</div></div>';
    html += '    <div class="stat-card" style="background: #9b59b6;"><div class="label">Data Source</div><div class="value">Firebase</div></div>';
    html += '  </div>';

    // Users Table
    html += '  <h3 style="margin-top: 25px; margin-bottom: 15px;">Registered Users (from Firebase)</h3>';
    html += '  <div class="table-container"><table><thead><tr>';
    html += '    <th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th>';
    html += '  </tr></thead><tbody id="adminUsersBody">';
    html += '    <tr><td colspan="5" style="text-align: center; padding: 30px;">Loading users from Firebase...</td></tr>';
    html += '  </tbody></table></div>';
    
    // Activity Logs
    html += '  <h3 style="margin-top: 30px; margin-bottom: 15px;">Activity Logs</h3>';
    html += '  <div class="activity-log-container" id="adminActivityLogs" style="max-height: 300px; overflow-y: auto;">';
    html += '    <div style="text-align: center; padding: 20px;">Loading...</div>';
    html += '  </div>';
    
    html += '</div>';
    
    document.getElementById("pageContent").innerHTML = html;
    
    // Load users from Firebase
    loadUsersFromFirebase();
    loadActivityLogs();
}

function loadUsersFromFirebase() {
    if (typeof database === "undefined" || !database) {
        document.getElementById("adminUsersBody").innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px;">Firebase not available</td></tr>';
        return;
    }
    
    database.ref("users").once("value").then(function(snapshot) {
        var usersData = snapshot.val();
        var html = "";
        var count = 0;
        
        if (usersData) {
            var keys = Object.keys(usersData);
            var userCountEl = document.getElementById("adminUserCount");
            if (userCountEl) userCountEl.textContent = keys.length;
            
            keys.forEach(function(key) {
                var u = usersData[key];
                count++;
                var isCurrent = APP.currentUser && u.email === APP.currentUser.email;
                var roleColor = u.role === "admin" ? "badge-warning" : "badge-success";
                var roleText = u.role === "admin" ? "Admin" : "User";
                
                html += '<tr>';
                html += '  <td>' + count + '</td>';
                html += '  <td>' + escapeHtml(u.name || "-") + (isCurrent ? ' <span class="badge badge-success">You</span>' : '') + '</td>';
                html += '  <td>' + escapeHtml(u.email || "-") + '</td>';
                html += '  <td><span class="badge ' + roleColor + '">' + roleText + '</span></td>';
                html += '  <td style="text-align: center;">';
                html += '    <button class="btn btn-sm" onclick="viewUserLogs('' + key + '')" title="View Logs" style="background: #3498db; padding: 4px 8px; font-size: 12px;"> Logs</button>';
                if (u.role !== "admin") {
                    html += '    <button class="btn btn-sm btn-danger" onclick="deleteFirebaseUser('' + key + '')" title="Delete" style="padding: 4px 8px; font-size: 12px;"> Delete</button>';
                }
                html += '  </td></tr>';
            });
        } else {
            var userCountEl = document.getElementById("adminUserCount");
            if (userCountEl) userCountEl.textContent = "0";
            html += '<tr><td colspan="5" style="text-align: center; padding: 30px;">No users found in Firebase</td></tr>';
        }
        
        document.getElementById("adminUsersBody").innerHTML = html;
    }).catch(function(error) {
        document.getElementById("adminUsersBody").innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px;">Error loading users</td></tr>';
    });
}

function deleteFirebaseUser(key) {
    if (!confirm("Delete this user? This cannot be undone!")) return;
    database.ref("users/" + key).remove().then(function() {
        showToast("User deleted!", "success");
        loadUsersFromFirebase();
    });
}

function viewUserLogs(key) {
    database.ref("users/" + key).once("value").then(function(snapshot) {
        var user = snapshot.val();
        if (!user) { showToast("User not found", "error"); return; }
        
        var html = "";
        html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">';
        html += '  <h2 style="margin: 0;">' + escapeHtml(user.name || "User") + '</h2>';
        html += '  <button class="btn btn-sm btn-danger" onclick="closeModal()" style="min-width: 36px;">X</button>';
        html += '</div>';
        html += '<div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 20px; color: white;">';
        html += '  <p>Email: ' + escapeHtml(user.email || "-") + '</p>';
        html += '  <p>Role: <span class="badge ' + (user.role === "admin" ? "badge-warning" : "badge-success") + '">' + (user.role === "admin" ? "Admin" : "User") + '</span></p>';
        html += '  <p>Registered: ' + (user.registeredAt ? new Date(user.registeredAt).toLocaleString() : "-") + '</p>';
        html += '</div>';
        
        // Try to load activities for this user
        var userEmail = user.email || "";
        database.ref("activities").orderByChild("userEmail").equalTo(userEmail).limitToLast(50).once("value").then(function(logSnap) {
            var logs = logSnap.val();
            html += '<h3 style="margin: 20px 0 10px;">Activity Logs</h3><div class="activity-log-container" style="max-height: 300px;">';
            if (logs) {
                var logList = [];
                Object.keys(logs).forEach(function(k) { logList.push(logs[k]); });
                logList.sort(function(a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
                logList.slice(0, 30).forEach(function(log) {
                    var icon = log.type === "login" ? "" : (log.type === "register" ? "" : (log.type === "recharge" ? "" : (log.type === "bill" ? "" : "")));
                    html += '<div class="activity-log-card log-' + log.type + '">';
                    html += '  <div><span class="log-user">' + icon + ' ' + escapeHtml(log.userName || "") + '</span><span class="log-time">' + new Date(log.timestamp).toLocaleString() + '</span></div>';
                    html += '  <div class="log-details">' + escapeHtml(log.details || "") + '</div>';
                    html += '</div>';
                });
            } else {
                html += '<div style="text-align: center; padding: 20px;">No activity logs found</div>';
            }
            html += '</div>';
            document.getElementById("modalContent").innerHTML = html;
            document.getElementById("modal").classList.add("active");
        });
    });
}

function loadActivityLogs() {
    if (typeof database === "undefined" || !database) return;
    database.ref("activities").orderByChild("timestamp").limitToLast(50).once("value").then(function(snapshot) {
        var logs = snapshot.val();
        var html = "";
        if (logs) {
            var logList = [];
            Object.keys(logs).forEach(function(k) { logList.push(logs[k]); });
            logList.sort(function(a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
            logList.forEach(function(log) {
                var icon = log.type === "login" ? "" : (log.type === "register" ? "" : (log.type === "recharge" ? "" : (log.type === "bill" ? "" : "")));
                html += '<div class="activity-log-card log-' + log.type + '">';
                html += '  <div><span class="log-user">' + icon + ' ' + escapeHtml(log.userName || "") + '</span><span class="log-time">' + new Date(log.timestamp).toLocaleString() + '</span></div>';
                html += '  <div class="log-details">' + escapeHtml(log.details || "") + '</div>';
                html += '</div>';
            });
        } else {
            html = '<div style="text-align: center; padding: 20px;">No activity logs in Firebase</div>';
        }
        document.getElementById("adminActivityLogs").innerHTML = html;
    });
}


function getActiveText() {
    if (APP.language === 'en') return 'Active';
    return 'সক্রিয়';
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// ==================== EDIT USER ====================
function editUser(userId) {
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) { user = users[i]; break; }
    }
    
    if (!user) {
        showToast(APP.language==='en'?'User not found':'ইউজার পাওয়া যায়নি', 'error');
        return;
    }

    var L = APP.language;
    var modalHtml = '';
    modalHtml += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">';
    modalHtml += '  <h2 style="margin: 0;">'+(L==='en'?'Edit User':'ইউজার সম্পাদনা')+'</h2>';
    modalHtml += '  <button class="btn btn-sm btn-danger" onclick="closeModal()" style="min-width: 36px;">X</button>';
    modalHtml += '</div>';
    
    modalHtml += '<div class="form-group">';
    modalHtml += '  <label>'+(L==='en'?'Full Name':'পুরো নাম')+'</label>';
    modalHtml += '  <input type="text" class="form-control" id="editUserName" value="' + escapeHtml(user.name) + '" placeholder="'+(L==='en'?'Enter full name':'নাম লিখুন')+'">';
    modalHtml += '</div>';
    
    modalHtml += '<div class="form-group">';
    modalHtml += '  <label>'+(L==='en'?'Email Address':'ইমেইল')+'</label>';
    modalHtml += '  <input type="email" class="form-control" id="editUserEmail" value="' + escapeHtml(user.email) + '" placeholder="'+(L==='en'?'Enter email address':'ইমেইল লিখুন')+'">';
    modalHtml += '</div>';
    
    modalHtml += '<div class="form-group">';
    modalHtml += '  <label>'+(L==='en'?'New Password (leave blank to keep current)':'নতুন পাসওয়ার্ড (ফাঁকা রাখলে পুরনো থাকবে)')+'</label>';
    modalHtml += '  <input type="password" class="form-control" id="editUserPassword" placeholder="'+(L==='en'?'Enter new password':'নতুন পাসওয়ার্ড লিখুন')+'">';
    modalHtml += '</div>';
    
    modalHtml += '<div class="form-group">';
    modalHtml += '  <label>'+(L==='en'?'Phone/Mobile Number':'মোবাইল নম্বর')+'</label>';
    modalHtml += '  <input type="text" class="form-control" id="editUserPhone" value="' + escapeHtml(user.phone || '') + '" placeholder="'+(L==='en'?'Enter phone number':'ফোন নম্বর লিখুন')+'">';
    modalHtml += '</div>';
    
    modalHtml += '<div class="form-group">';
    modalHtml += '  <label>'+(L==='en'?'Address':'ঠিকানা')+'</label>';
    modalHtml += '  <textarea class="form-control" id="editUserAddress" placeholder="'+(L==='en'?'Enter address':'ঠিকানা লিখুন')+'" rows="2" style="resize: vertical;">' + escapeHtml(user.address || '') + '</textarea>';
    modalHtml += '</div>';
    
    modalHtml += '<div style="display: flex; gap: 10px; margin-top: 20px;">';
    modalHtml += '  <button class="btn" onclick="saveUserEdit(\'' + userId + '\')">'+(L==='en'?'Save Changes':'সংরক্ষণ')+'</button>';
    modalHtml += '  <button class="btn btn-outline" onclick="closeModal()">'+(L==='en'?'Cancel':'বাতিল')+'</button>';
    modalHtml += '</div>';
    
    document.getElementById('modalContent').innerHTML = modalHtml;
    document.getElementById('modal').classList.add('active');
}

// ==================== SAVE USER EDIT ====================
function saveUserEdit(userId) {
    var name = document.getElementById('editUserName').value.trim();
    var email = document.getElementById('editUserEmail').value.trim();
    var password = document.getElementById('editUserPassword').value;
    var phone = document.getElementById('editUserPhone').value.trim();
    var address = document.getElementById('editUserAddress').value.trim();
    var L = APP.language;
    
    if (!name) { showToast(L==='en'?'Name is required':'নাম প্রয়োজন', 'error'); return; }
    if (!email) { showToast(L==='en'?'Email is required':'ইমেইল প্রয়োজন', 'error'); return; }
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        showToast(L==='en'?'Please enter a valid email address':'সঠিক ইমেইল দিন', 'error');
        return;
    }
    
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var userIndex = -1;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) { userIndex = i; break; }
    }
    
    if (userIndex === -1) {
        showToast(L==='en'?'User not found':'ইউজার পাওয়া যায়নি', 'error');
        return;
    }
    
    for (var i = 0; i < users.length; i++) {
        if (i !== userIndex && users[i].email === email) {
            showToast(L==='en'?'This email is already taken':'এই ইমেইলটি অন্য কেউ ব্যবহার করছে', 'error');
            return;
        }
    }
    
    users[userIndex].name = name;
    users[userIndex].email = email;
    if (password && password.length >= 6) {
        users[userIndex].password = password;
    }
    users[userIndex].phone = phone;
    users[userIndex].address = address;
    
    localStorage.setItem('users', JSON.stringify(users));
    
    if (userId === APP.currentUser.id) {
        APP.currentUser = users[userIndex];
        updateSidebarUserInfo();
    }
    
    closeModal();
    showToast(L==='en'?'User updated successfully!':'ইউজার আপডেট হয়েছে!', 'success');
    showAdminPanel();
}

// ==================== VIEW USER LOGS ====================
function viewUserLogs(userId) {
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) { user = users[i]; break; }
    }
    
    if (!user) {
        showToast(APP.language==='en'?'User not found':'ইউজার পাওয়া যায়নি', 'error');
        return;
    }

    var allLogs = getActivityLogs('all', 500);
    var userLogs = [];
    for (var k = 0; k < allLogs.length; k++) {
        if (allLogs[k].userId === userId || allLogs[k].userEmail === user.email) {
            userLogs.push(allLogs[k]);
        }
    }
    
    var loginCount = 0, registerCount = 0, rechargeCount = 0, billCount = 0, logoutCount = 0;
    for (var l = 0; l < userLogs.length; l++) {
        if (userLogs[l].type === 'login') loginCount++;
        else if (userLogs[l].type === 'register') registerCount++;
        else if (userLogs[l].type === 'recharge') rechargeCount++;
        else if (userLogs[l].type === 'bill') billCount++;
        else if (userLogs[l].type === 'logout') logoutCount++;
    }

    var L = APP.language;
    var dateLocale = L==='en' ? 'en-US' : 'bn-BD';

    var modalHtml = '';
    modalHtml += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">';
    modalHtml += '  <h2 style="margin: 0;">'+user.name+'</h2>';
    modalHtml += '  <button class="btn btn-sm btn-danger" onclick="closeModal()" style="min-width: 36px;">X</button>';
    modalHtml += '</div>';
    
    modalHtml += '<div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 20px; color: white; margin-bottom: 20px;">';
    modalHtml += '  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">';
    modalHtml += '    <div><div style="font-size: 12px; opacity: 0.8;">'+(L==='en'?'Name':'নাম')+'</div><div style="font-size: 18px; font-weight: bold;">' + escapeHtml(user.name) + '</div></div>';
    modalHtml += '    <div><div style="font-size: 12px; opacity: 0.8;">'+(L==='en'?'Email':'ইমেইল')+'</div><div style="font-size: 16px;">' + escapeHtml(user.email) + '</div></div>';
    modalHtml += '    <div><div style="font-size: 12px; opacity: 0.8;">'+(L==='en'?'Phone':'ফোন')+'</div><div style="font-size: 14px;">' + (user.phone || 'N/A') + '</div></div>';
    modalHtml += '    <div><div style="font-size: 12px; opacity: 0.8;">'+(L==='en'?'Role':'রোল')+'</div><div><span class="badge ' + (user.role === 'admin' ? 'badge-warning' : 'badge-success') + '">' + (user.role === 'admin' ? (L==='en'?'Admin':'অ্যাডমিন') : (L==='en'?'User':'ইউজার')) + '</span></div></div>';
    modalHtml += '    <div><div style="font-size: 12px; opacity: 0.8;">'+(L==='en'?'Registered':'নিবন্ধিত')+'</div><div style="font-size: 14px;">' + new Date(user.registeredAt).toLocaleString(dateLocale) + '</div></div>';
    modalHtml += '    <div><div style="font-size: 12px; opacity: 0.8;">'+(L==='en'?'Address':'ঠিকানা')+'</div><div style="font-size: 14px;">' + (user.address || 'N/A') + '</div></div>';
    modalHtml += '  </div></div>';
    
    modalHtml += '<div class="activity-stats">';
    modalHtml += '  <div class="activity-stat-item"><div class="stat-count" style="color: #3498db;">' + loginCount + '</div><div class="stat-label">'+t('loginActivity')+'</div></div>';
    modalHtml += '  <div class="activity-stat-item"><div class="stat-count" style="color: #9b59b6;">' + registerCount + '</div><div class="stat-label">'+t('registerActivity')+'</div></div>';
    modalHtml += '  <div class="activity-stat-item"><div class="stat-count" style="color: #27ae60;">' + rechargeCount + '</div><div class="stat-label">'+t('rechargeActivity')+'</div></div>';
    modalHtml += '  <div class="activity-stat-item"><div class="stat-count" style="color: #f39c12;">' + billCount + '</div><div class="stat-label">'+t('billActivity')+'</div></div>';
    modalHtml += '  <div class="activity-stat-item"><div class="stat-count" style="color: #e74c3c;">' + logoutCount + '</div><div class="stat-label">'+t('logoutActivity')+'</div></div>';
    modalHtml += '</div>';
    
    modalHtml += '<h3 style="margin-bottom: 15px;">'+(L==='en'?'Activity History':'কার্যকলাপের ইতিহাস')+' (' + userLogs.length + ')</h3>';
    modalHtml += '<div class="activity-log-container" style="max-height: 400px;">';
    
    if (userLogs.length > 0) {
        for (var m = 0; m < userLogs.length; m++) {
            var log = userLogs[m];
            var icon = log.type === 'login' ? '&#x1F511;' : (log.type === 'register' ? '&#x1F4DD;' : (log.type === 'recharge' ? '&#x1F4B0;' : (log.type === 'bill' ? '&#x1F4C4;' : (log.type === 'logout' ? '&#x1F6AA;' : '&#x1F4CB;'))));
            var timeStr = new Date(log.timestamp).toLocaleString(dateLocale);
            var deviceStr = log.deviceInfo ? ('&#x1F4BB; ' + (log.deviceInfo.platform || (L==='en'?'Unknown':'অজানা')) + ' | &#x1F310; ' + (log.deviceInfo.language || 'N/A')) : '';
            
            modalHtml += '<div class="activity-log-card log-' + log.type + '">';
            modalHtml += '  <div class="log-header"><span class="log-user">' + icon + ' ' + escapeHtml(log.userName) + '</span><span class="log-time">' + timeStr + '</span></div>';
            modalHtml += '  <div class="log-details">' + escapeHtml(log.details) + '</div>';
            if (deviceStr) modalHtml += '  <div class="log-device">' + deviceStr + '</div>';
            modalHtml += '</div>';
        }
    } else {
        modalHtml += '<div style="text-align: center; padding: 30px; color: var(--text-light);"><p style="font-size: 48px; margin-bottom: 10px;">&#x1F4ED;</p><p>'+(L==='en'?'No activity found':'কোন কার্যকলাপ পাওয়া যায়নি')+'</p></div>';
    }
    
    modalHtml += '</div>';
    
    document.getElementById('modalContent').innerHTML = modalHtml;
    document.getElementById('modal').classList.add('active');
}

// ==================== DELETE USER ====================
function deleteUser(userId) {
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var userToDelete = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) { userToDelete = users[i]; break; }
    }
    var L = APP.language;
    
    if (!userToDelete) { showToast(L==='en'?'User not found':'ইউজার পাওয়া যায়নি', 'error'); return; }
    if (userToDelete.role === 'admin') { showToast(L==='en'?'Cannot delete admin user':'অ্যাডমিন ডিলিট করা যাবে না', 'error'); return; }
    if (!confirm(L==='en'?'Are you sure you want to delete "'+userToDelete.name+'" ('+userToDelete.email+')?':'আপনি কি নিশ্চিত "'+userToDelete.name+'" ('+userToDelete.email+') ইউজারটি ডিলিট করতে চান?')) { return; }
    
    var updatedUsers = [];
    for (var i = 0; i < users.length; i++) {
        if (users[i].id !== userId) updatedUsers.push(users[i]);
    }
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    showToast(L==='en'?'User deleted successfully':'ইউজার ডিলিট করা হয়েছে', 'success');
    showAdminPanel();
}

// ==================== PROMOTE TO ADMIN ====================
function promoteToAdmin(userId) {
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var userIndex = -1;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) { userIndex = i; break; }
    }
    var L = APP.language;
    if (userIndex === -1) { showToast(L==='en'?'User not found':'ইউজার পাওয়া যায়নি', 'error'); return; }
    if (!confirm(L==='en'?'Promote "'+users[userIndex].name+'" to Admin?':'"' + users[userIndex].name + '" কে অ্যাডমিন করবেন?')) { return; }
    
    users[userIndex].role = 'admin';
    localStorage.setItem('users', JSON.stringify(users));
    showToast(L==='en'?'"'+users[userIndex].name+'" promoted to Admin':'"' + users[userIndex].name + '" অ্যাডমিন হয়েছে', 'success');
    showAdminPanel();
}

// ==================== DEMOTE TO USER ====================
function demoteToUser(userId) {
    var L = APP.language;
    if (userId === APP.currentUser.id) {
        showToast(L==='en'?'You cannot change your own role':'নিজের রোল পরিবর্তন করা যাবে না', 'error');
        return;
    }
    
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var userIndex = -1;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) { userIndex = i; break; }
    }
    if (userIndex === -1) { showToast(L==='en'?'User not found':'ইউজার পাওয়া যায়নি', 'error'); return; }
    
    var adminCount = 0;
    for (var i = 0; i < users.length; i++) {
        if (users[i].role === 'admin') adminCount++;
    }
    if (adminCount <= 1) { showToast(L==='en'?'At least one admin must remain':'কমপক্ষে একজন অ্যাডমিন থাকতে হবে', 'error'); return; }
    if (!confirm(L==='en'?'Demote "'+users[userIndex].name+'" to User?':'"'+users[userIndex].name+'" কে ইউজার করবেন?')) { return; }
    
    users[userIndex].role = 'user';
    localStorage.setItem('users', JSON.stringify(users));
    showToast(L==='en'?'"'+users[userIndex].name+'" demoted to User':'"'+users[userIndex].name+'" ইউজার হয়েছে', 'success');
    showAdminPanel();
}
