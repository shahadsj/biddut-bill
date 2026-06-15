// ==================== ADMIN PANEL ====================
// Firebase-based - NO localStorage user management
// Admin: ONLY k.m.abubakkarsiddek@gmail.com

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
    html += '    <h2>Admin Panel</h2>';
    html += '    <span class="badge badge-warning" style="font-size: 14px; padding: 8px 15px;">Admin: ' + escapeHtml(APP.currentUser.name) + ' (' + escapeHtml(APP.currentUser.email) + ')</span>';
    html += '  </div>';
    
    // Stats
    var totalMeters = (APP.meters || []).length;
    var totalTransactions = 0;
    if (APP.metersData) {
        Object.values(APP.metersData).forEach(function(md) {
            totalTransactions += (md.transactions || []).length;
        });
    }
    
    html += '  <div class="stats-grid" style="margin: 20px 0;">';
    html += '    <div class="stat-card" style="background: var(--gradient-1);"><div class="label">Total Meters</div><div class="value">' + totalMeters + '</div></div>';
    html += '    <div class="stat-card" style="background: var(--gradient-2);"><div class="label">Transactions</div><div class="value">' + totalTransactions + '</div></div>';
    
    var bal = "0.00";
    if (APP.activeMeterId && APP.metersData && APP.metersData[APP.activeMeterId]) {
        bal = (APP.metersData[APP.activeMeterId].currentBalance || 0).toFixed(2);
    }
    html += '    <div class="stat-card" style="background: var(--gradient-3);"><div class="label">Balance</div><div class="value">' + bal + '</div></div>';
    
    // Count users from Firebase
    html += '    <div class="stat-card" style="background: var(--gradient-4);"><div class="label">Users (Firebase)</div><div class="value" id="userCount">...</div></div>';
    html += '  </div>';

    // Users Table
    html += '  <h3 style="margin-top: 30px; margin-bottom: 15px;">Users List (from Firebase)</h3>';
    html += '  <div class="table-container"><table><thead><tr>';
    html += '    <th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Registered</th><th style="text-align: center;">Action</th>';
    html += '  </tr></thead><tbody id="adminUsersBody">';
    html += '    <tr><td colspan="6" style="text-align: center; padding: 30px;">Loading users from Firebase...</td></tr>';
    html += '  </tbody></table></div>';
    html += '</div>';
    
    document.getElementById('pageContent').innerHTML = html;
    
    // Load users from Firebase
    loadUsersFromFirebase();
}

function loadUsersFromFirebase() {
    if (typeof database === "undefined" || !database) {
        document.getElementById("adminUsersBody").innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">Firebase not available</td></tr>';
        return;
    }
    
    database.ref("users").once("value").then(function(snapshot) {
        var usersData = snapshot.val();
        var html = "";
        var count = 0;
        
        if (usersData) {
            var userIds = Object.keys(usersData);
            document.getElementById("userCount").textContent = userIds.length;
            
            userIds.forEach(function(key) {
                var u = usersData[key];
                count++;
                var isCurrent = (u.email === APP.currentUser.email);
                
                html += '<tr>';
                html += '  <td>' + count + '</td>';
                html += '  <td>' + escapeHtml(u.name || "No name") + (isCurrent ? ' <span class="badge badge-success">You</span>' : '') + '</td>';
                html += '  <td>' + escapeHtml(u.email || "No email") + '</td>';
                html += '  <td><span class="badge ' + (u.role === "admin" ? "badge-warning" : "badge-success") + '">' + (u.role === "admin" ? "Admin" : "User") + '</span></td>';
                html += '  <td>' + (u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : "-") + '</td>';
                html += '  <td style="text-align: center; white-space: nowrap;">';
                
                if (u.role !== "admin" && u.email !== "k.m.abubakkarsiddek@gmail.com") {
                    html += '    <button class="btn btn-sm btn-danger" onclick="deleteFirebaseUser('' + key + '')" style="padding: 4px 10px; font-size: 14px;">Delete</button>';
                } else {
                    html += '    <span class="badge badge-warning">Admin</span>';
                }
                
                html += '  </td></tr>';
            });
        } else {
            document.getElementById("userCount").textContent = "0";
            html += '<tr><td colspan="6" style="text-align: center; padding: 30px;">No users found</td></tr>';
        }
        
        document.getElementById("adminUsersBody").innerHTML = html;
    }).catch(function(error) {
        document.getElementById("adminUsersBody").innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">Error loading users</td></tr>';
    });
}

function deleteFirebaseUser(key) {
    if (!confirm("Delete this user? This cannot be undone!")) return;
    
    database.ref("users/" + key).remove().then(function() {
        showToast("User deleted from Firebase!", "success");
        loadUsersFromFirebase();
    }).catch(function(error) {
        showToast("Error deleting user", "error");
    });
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;");
}
