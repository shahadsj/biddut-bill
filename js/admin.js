// ==================== ADMIN PANEL ====================
function showAdminPanel() {
    if (!APP.currentUser || APP.currentUser.role !== 'admin') {
        showToast(__('Only admin can access this panel.', 'error'));
        navigateTo('dashboard');
        return;
    }

    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var totalUsers = users.length;
    var totalMeters = APP.meters.length;
    var totalTransactions = 0;
    Object.values(APP.metersData).forEach(function(md) {
        totalTransactions += (md.transactions || []).length;
    });
    var currentUser = APP.currentUser;

    var activities = getActivityLogs('all', 200);
    var loginCount = activities.filter(function(a) { return a.type === 'login'; }).length;
    var registerCount = activities.filter(function(a) { return a.type === 'register'; }).length;
    var rechargeCount = activities.filter(function(a) { return a.type === 'recharge'; }).length;
    var billCount = activities.filter(function(a) { return a.type === 'bill'; }).length;
    var logoutCount = activities.filter(function(a) { return a.type === 'logout'; }).length;

    var bal = (APP.activeMeterId && APP.metersData[APP.activeMeterId]) ? (APP.metersData[APP.activeMeterId].currentBalance || 0).toFixed(2) : '0.00';

    var L = APP.language;
    var t = function(key) { return __(key); };

    var html = '';
    html += '<div class="card">';
    html += '  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">';
    html += '    <h2>'+t('adminPanel')+'</h2>';
    html += '    <span class="badge badge-warning" style="font-size: 14px; padding: 8px 15px;">'+(L==='en'?'Logged in:':'লগইন:')+' ' + escapeHtml(currentUser.name) + ' (' + escapeHtml(currentUser.email) + ')</span>';
    html += '  </div>';
    
    // Stats
    html += '  <div class="stats-grid" style="margin: 20px 0;">';
    html += '    <div class="stat-card" style="background: var(--gradient-1);"><div class="label">'+t('totalUsers')+'</div><div class="value">' + totalUsers + '</div></div>';
    html += '    <div class="stat-card" style="background: var(--gradient-2);"><div class="label">'+t('totalMeters')+'</div><div class="value">' + totalMeters + '</div></div>';
    html += '    <div class="stat-card" style="background: var(--gradient-3);"><div class="label">'+t('totalTransactions')+'</div><div class="value">' + totalTransactions + '</div></div>';
    html += '    <div class="stat-card" style="background: var(--gradient-4);"><div class="label">'+t('balance')+'</div><div class="value">'+t('taka')+' ' + bal + '</div></div>';
    html += '  </div>';
    
    // Activity Stats
    html += '  <div class="activity-stats">';
    html += '    <div class="activity-stat-item"><div class="stat-count" style="color: #3498db;">' + loginCount + '</div><div class="stat-label">'+t('loginActivity')+'</div></div>';
    html += '    <div class="activity-stat-item"><div class="stat-count" style="color: #9b59b6;">' + registerCount + '</div><div class="stat-label">'+t('registerActivity')+'</div></div>';
    html += '    <div class="activity-stat-item"><div class="stat-count" style="color: #27ae60;">' + rechargeCount + '</div><div class="stat-label">'+t('rechargeActivity')+'</div></div>';
    html += '    <div class="activity-stat-item"><div class="stat-count" style="color: #f39c12;">' + billCount + '</div><div class="stat-label">'+t('billActivity')+'</div></div>';
    html += '    <div class="activity-stat-item"><div class="stat-count" style="color: #e74c3c;">' + logoutCount + '</div><div class="stat-label">'+t('logoutActivity')+'</div></div>';
    html += '  </div>';

    // Users Table
    html += '  <h3 style="margin-top: 30px; margin-bottom: 15px;">'+t('userList')+'</h3>';
    html += '  <div class="table-container"><table><thead><tr>';
    html += '    <th>#</th><th>'+t('nameCol')+'</th><th>'+t('emailCol')+'</th><th>'+t('statusCol')+'</th><th>'+t('roleCol')+'</th><th style="text-align: center;">'+t('actionCol')+'</th>';
    html += '  </tr></thead><tbody>';
    
    if (users.length > 0) {
        for (var i = 0; i < users.length; i++) {
            var u = users[i];
            var isCurrent = (u.id === currentUser.id);
            
            html += '<tr>';
            html += '  <td>' + (i + 1) + '</td>';
            html += '  <td style="font-weight: 600;"><span style="font-size: 18px; margin-right: 5px;">' + (u.role === 'admin' ? '&#x1F451;' : '&#x1F464;') + '</span> ' + escapeHtml(u.name) + (isCurrent ? ' <span class="badge badge-success" style="margin-left: 5px; font-size: 10px;">'+t('you')+'</span>' : '') + '</td>';
            html += '  <td>' + escapeHtml(u.email) + '</td>';
            html += '  <td><span class="badge" style="background: #27ae60; color: white; font-size: 11px;">'+getActiveText()+'</span></td>';
            html += '  <td><span class="badge ' + (u.role === 'admin' ? 'badge-warning' : 'badge-success') + '">' + (u.role === 'admin' ? t('adminRole') : t('userRole')) + '</span></td>';
            html += '  <td style="text-align: center; white-space: nowrap;">';
            
            // View icon
            html += '    <button class="btn btn-sm" onclick="viewUserLogs(\'' + u.id + '\')" title="'+(L==='en'?'View Activity Logs':'কার্যকলাপ দেখুন')+'" style="background: #3498db; padding: 4px 10px; min-width: 36px; font-size: 14px;">&#x1F441;&#xFE0F;</button>';
            
            // Edit icon - ALL users
            html += '    <button class="btn btn-sm" onclick="editUser(\'' + u.id + '\')" title="'+(L==='en'?'Edit User Info':'তথ্য সম্পাদনা')+'" style="background: #2ecc71; padding: 4px 10px; min-width: 36px; font-size: 14px;">&#x270F;&#xFE0F;</button>';
            
            // Promote/Demote/Delete
            if (u.role === 'admin' && u.id !== currentUser.id) {
                html += '    <button class="btn btn-sm" onclick="demoteToUser(\'' + u.id + '\')" title="'+(L==='en'?'Demote to User':'ইউজার করুন')+'" style="background: #f39c12; padding: 4px 10px; min-width: 36px; font-size: 14px;">&#x2B07;&#xFE0F;</button>';
            }
            if (u.role !== 'admin') {
                html += '    <button class="btn btn-sm" onclick="promoteToAdmin(\'' + u.id + '\')" title="'+(L==='en'?'Promote to Admin':'অ্যাডমিন করুন')+'" style="background: #9b59b6; padding: 4px 10px; min-width: 36px; font-size: 14px;">&#x2B06;&#xFE0F;</button>';
                html += '    <button class="btn btn-sm btn-danger" onclick="deleteUser(\'' + u.id + '\')" title="'+(L==='en'?'Delete User':'মুছে ফেলুন')+'" style="padding: 4px 10px; min-width: 36px; font-size: 14px;">&#x1F5D1;&#xFE0F;</button>';
            }
            if (isCurrent) {
                html += '    <span class="badge badge-warning" style="font-size: 10px;">'+t('current')+'</span>';
            }
            
            html += '  </td></tr>';
        }
    } else {
        html += '<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--text-light);"><p>'+t('noUsers')+'</p></td></tr>';
    }
    
    html += '  </tbody></table></div>';
    
    // App Data Overview
    html += '  <h3 style="margin-top: 30px; margin-bottom: 15px;">'+t('appDataOverview')+'</h3>';
    html += '  <div class="table-container"><table><thead><tr>';
    html += '    <th>'+t('meterName')+'</th><th>'+t('meterNo')+'</th><th>'+t('totalTransactions')+'</th><th>'+t('balanceCol')+'</th><th>'+t('totalRechargeCol')+'</th><th>'+t('totalExpenseCol')+'</th>';
    html += '  </tr></thead><tbody>';
    
    if (APP.meters.length > 0) {
        for (var j = 0; j < APP.meters.length; j++) {
            var m = APP.meters[j];
            var md = APP.metersData[m.id] || {};
            var itemsText = L==='en'?'items':'টি';
            html += '<tr>';
            html += '  <td><strong>' + escapeHtml(m.name) + '</strong></td>';
            html += '  <td>' + (m.meterNumber || m.meterNo || '-') + '</td>';
            html += '  <td>' + (md.transactions || []).length + ' ' + itemsText + '</td>';
            html += '  <td><strong>'+t('taka')+' ' + (md.currentBalance || 0).toFixed(2) + '</strong></td>';
            html += '  <td>'+t('taka')+' ' + (md.totalRecharge || 0).toFixed(2) + '</td>';
            html += '  <td>'+t('taka')+' ' + (md.totalExpended || 0).toFixed(2) + '</td>';
            html += '</tr>';
        }
    } else {
        html += '<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--text-light);"><p>'+t('noMeters')+'</p></td></tr>';
    }
    
    html += '  </tbody></table></div>';
    html += '</div>';
    
    document.getElementById('pageContent').innerHTML = html;
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


function loadUsersFromFirebase() {
    var tableBody = document.querySelector('#adminUsersTable tbody') || document.querySelector('.table-container tbody');
    if (!tableBody) {
        console.warn("Users table not found, may be using different view");
        return;
    }
    
    if (typeof database === "undefined" || !database) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:#999">Firebase not available</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px">Loading users...</td></tr>';
    
    database.ref("users").once("value").then(function(snapshot) {
        var usersData = snapshot.val();
        if (!usersData) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:#999">No users found in Firebase</td></tr>';
            return;
        }
        
        APP.users = usersData;
        
        var html = '';
        var keys = Object.keys(usersData);
        var currentUser = APP.currentUser;
        var index = 1;
        
        keys.forEach(function(key) {
            var u = usersData[key];
            var isCurrent = (u.email === currentUser.email || u.id === currentUser.id);
            
            html += '<tr>';
            html += '<td>' + (index++) + '</td>';
            html += '<td style="font-weight: 600;"><span style="font-size: 18px; margin-right: 5px;">' + (u.role === "admin" ? "\ud83d\udc51" : "\ud83d\udc64") + '</span> ' + escapeHtml(u.name || u.displayName || "-") + (isCurrent ? ' <span class="badge badge-success" style="margin-left:5px;font-size:10px;">You</span>' : "") + '</td>';
            html += '<td>' + escapeHtml(u.email || "-") + '</td>';
            html += '<td><span class="badge ' + (u.role === "admin" ? "badge-warning" : "badge-success") + '">' + (u.role === "admin" ? "Admin" : "User") + '</span></td>';
            html += '<td style="text-align: center; white-space: nowrap;">';
            html += '<button class="btn btn-sm" onclick="viewUserLogs(\'' + key + '\')" title="View Logs" style="background:#3498db;padding:4px 10px;min-width:36px;font-size:14px;">\ud83d\udc41\ufe0f</button>';
            if (u.role !== "admin" && !isCurrent) {
                html += '<button class="btn btn-sm btn-danger" onclick="deleteFirebaseUser(\'' + key + '\')" title="Delete" style="padding:4px 10px;min-width:36px;font-size:14px;">\ud83d\uddd1\ufe0f</button>';
            }
            html += '</td></tr>';
        });
        
        tableBody.innerHTML = html;
    }).catch(function(err) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:red">Error: ' + err.message + '</td></tr>';
    });
}


function loadActivityLogs() {
    var container = document.getElementById("adminActivityLogs");
    if (!container) return;
    if (typeof database === "undefined" || !database) {
        container.innerHTML = "<div style='text-align:center;padding:20px;color:#999'>Firebase not available</div>";
        return;
    }
    container.innerHTML = "<div style='text-align:center;padding:20px'>Loading...</div>";
    database.ref("activities").orderByChild("timestamp").limitToLast(50).once("value").then(function(snap) {
        var logs = snap.val();
        if (!logs) { container.innerHTML = "<div style='text-align:center;padding:20px;color:#999'>No logs found</div>"; return; }
        var list = [];
        Object.keys(logs).forEach(function(k){list.push(logs[k]);});
        list.sort(function(a,b){return(b.timestamp||0)-(a.timestamp||0);});
        var html = "";
        list.forEach(function(log) {
            var icon = log.type==="login"?"\ud83d\udd11":log.type==="register"?"\ud83d\udce5":log.type==="recharge"?"\ud83d\udcb5":log.type==="bill"?"\ud83d\udcb0":"\ud83d\udccc";
            html += "<div class='activity-log-card log-"+(log.type||"info")+"'>";
            html += "<div><span class='log-user'>"+icon+" "+escapeHtml(log.userName||"")+"</span><span class='log-time'>"+new Date(log.timestamp).toLocaleString()+"</span></div>";
            html += "<div class='log-details'>"+escapeHtml(log.details||"")+"</div></div>";
        });
        container.innerHTML = html;
    }).catch(function(e) {
        container.innerHTML = "<div style='text-align:center;padding:20px;color:red'>Error loading logs</div>";
    });
}

function viewUserLogs(key) {
    if(typeof database==="undefined"||!database){showToast("Firebase unavailable","error");return;}
    database.ref("users/"+key).once("value").then(function(snap){
        var u=snap.val();
        if(!u){showToast("User not found","error");return;}
        var html="<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px'><h2 style='margin:0'>"+escapeHtml(u.name||"User")+"</h2><button class='btn btn-sm btn-danger' onclick='closeModal()' style='min-width:36px'>X</button></div>";
        html+="<div style='background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;padding:20px;color:white'><p>Email: "+escapeHtml(u.email||"-")+"</p><p>Role: <span class='badge "+(u.role==="admin"?"badge-warning":"badge-success")+"'>"+(u.role==="admin"?"Admin":"User")+"</span></p><p>Registered: "+(u.registeredAt?new Date(u.registeredAt).toLocaleString():"-")+"</p></div>";
        database.ref("activities").orderByChild("userEmail").equalTo(u.email).limitToLast(50).once("value").then(function(ls){
            var logs=ls.val();
            html+="<h3 style='margin:20px 0 10px'>Activity Logs</h3><div class='activity-log-container' style='max-height:300px;overflow-y:auto'>";
            if(logs){
                var lst=[];Object.keys(logs).forEach(function(k){lst.push(logs[k]);});
                lst.sort(function(a,b){return(b.timestamp||0)-(a.timestamp||0);});
                lst.slice(0,30).forEach(function(log){
                    var icon=log.type==="login"?"\ud83d\udd11":log.type==="register"?"\ud83d\udce5":log.type==="recharge"?"\ud83d\udcb5":log.type==="bill"?"\ud83d\udcb0":"\ud83d\udccc";
                    html+="<div class='activity-log-card log-"+(log.type||"info")+"'><div><span class='log-user'>"+icon+" "+escapeHtml(log.userName||"")+"</span><span class='log-time'>"+new Date(log.timestamp).toLocaleString()+"</span></div><div class='log-details'>"+escapeHtml(log.details||"")+"</div></div>";
                });
            } else html+="<div style='text-align:center;padding:20px;color:#999'>No logs</div>";
            html+="</div>";
            document.getElementById("modalContent").innerHTML=html;
            document.getElementById("modal").classList.add("active");
        });
    });
}

function deleteFirebaseUser(key) {
    if(!confirm("Delete this user permanently?"))return;
    database.ref("users/"+key).remove().then(function(){showToast("Deleted!","success");loadUsersFromFirebase();});
}


function getActivityLogs(type, limit) {
    // Returns empty array - logs load dynamically via loadActivityLogs()
    return [];
}
