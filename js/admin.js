// ==================== ADMIN PANEL ====================
// Firebase-based admin panel
// Admin: ONLY k.m.abubakkarsiddek@gmail.com

function showAdminPanel() {
    if (!APP.currentUser || APP.currentUser.role !== "admin") {
        showToast("Only admin can access this panel.", "error");
        navigateTo("dashboard");
        return;
    }

    var L = APP.language;
    var html = "";
    html += '<div class="card">';
    html += '  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">';
    html += '    <h2>\u26A1 Admin Panel</h2>';
    html += '    <span class="badge badge-warning" style="font-size: 14px; padding: 8px 15px;">Admin: ' + escapeHtml(APP.currentUser.name) + '</span>';
    html += '  </div>';

    // Stats
    var totalMeters = (APP.meters || []).length;
    var totalTransactions = 0;
    if (APP.metersData) {
        Object.values(APP.metersData).forEach(function(md) {
            totalTransactions += (md.transactions || []).length;
        });
    }
    var totalRecharge = 0;
    if (APP.metersData) {
        Object.values(APP.metersData).forEach(function(md) {
            totalRecharge += (md.totalRecharge || 0);
        });
    }

    html += '  <div class="stats-grid" style="margin: 20px 0;">';
    html += '    <div class="stat-card" style="background: #667eea;"><div class="label">Total Meters</div><div class="value">' + totalMeters + '</div></div>';
    html += '    <div class="stat-card" style="background: #27ae60;"><div class="label">Transactions</div><div class="value">' + totalTransactions + '</div></div>';
    html += '    <div class="stat-card" style="background: #f39c12;"><div class="label">Total Recharge</div><div class="value">' + totalRecharge.toFixed(2) + '</div></div>';
    html += '    <div class="stat-card" style="background: #9b59b6;"><div class="label">Users</div><div class="value" id="adminUserCount">...</div></div>';
    html += '  </div>';

    // Users Table
    html += '  <h3 style="margin-top: 25px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">';
    html += '    \u1F465 User Management';
    html += '    <button class="btn btn-sm" onclick="loadUsersFromFirebase()" style="background: #3498db; color: white; padding: 4px 12px; font-size: 12px;">\u1F504 Refresh</button>';
    html += '  </h3>';
    html += '  <div class="table-container"><table><thead><tr>';
    html += '    <th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Registered</th><th style="text-align: center;">Actions</th>';
    html += '  </tr></thead><tbody id="adminUsersBody">';
    html += '    <tr><td colspan="6" style="text-align: center; padding: 30px;">Loading users from Firebase...</td></tr>';
    html += '  </tbody></table></div>';

    // Activity Logs Section
    html += '  <h3 style="margin-top: 30px; margin-bottom: 15px;">\u1F4CB Recent Activity Logs</h3>';
    html += '  <div class="activity-log-container" id="adminActivityLogs" style="max-height: 400px; overflow-y: auto;">';
    html += '    <div style="text-align: center; padding: 30px; color: var(--text-light);">Loading activities...</div>';
    html += '  </div>';

    html += '</div>';

    document.getElementById("pageContent").innerHTML = html;

    // Load data
    loadUsersFromFirebase();
    loadFirebaseActivityLogs();
}

// ==================== LOAD USERS ====================
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
            var keys = Object.keys(usersData);
            if (document.getElementById("adminUserCount")) {
                document.getElementById("adminUserCount").textContent = keys.length;
            }

            keys.forEach(function(key) {
                var u = usersData[key];
                count++;
                var isCurrent = (u.email === APP.currentUser.email);

                html += '<tr>';
                html += '  <td>' + count + '</td>';
                html += '  <td>' + escapeHtml(u.name || "No name") + (isCurrent ? ' <span class="badge badge-success">You</span>' : "") + '</td>';
                html += '  <td>' + escapeHtml(u.email || "No email") + '</td>';
                html += '  <td><span class="badge ' + (u.role === "admin" ? "badge-warning" : "badge-success") + '">' + (u.role === "admin" ? "Admin" : "User") + '</span></td>';
                html += '  <td>' + (u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : "-") + '</td>';
                html += '  <td style="text-align: center; white-space: nowrap;">';

                // View Logs button
                html += '    <button class="btn btn-sm" onclick="viewUserActivityLogs(' + key + ')" title="View Activity Logs" style="background: #3498db; padding: 4px 8px; font-size: 12px;">\u1F441\uFE0F Logs</button>';

                // Edit button
                html += '    <button class="btn btn-sm" onclick="editFirebaseUser(' + key + ')" title="Edit User" style="background: #2ecc71; padding: 4px 8px; font-size: 12px;">\u270F\uFE0F Edit</button>';

                // Delete button (only for non-admin users)
                if (u.role !== "admin") {
                    html += '    <button class="btn btn-sm btn-danger" onclick="deleteFirebaseUser(' + key + ')" title="Delete User" style="padding: 4px 8px; font-size: 12px;">\u1F5D1\uFE0F Del</button>';
                }

                html += '  </td></tr>';
            });
        } else {
            if (document.getElementById("adminUserCount")) {
                document.getElementById("adminUserCount").textContent = "0";
            }
            html += '<tr><td colspan="6" style="text-align: center; padding: 30px;">No users found</td></tr>';
        }

        document.getElementById("adminUsersBody").innerHTML = html;
    }).catch(function(error) {
        document.getElementById("adminUsersBody").innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">Error loading users</td></tr>';
    });
}

// ==================== DELETE USER ====================
function deleteFirebaseUser(key) {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone!")) return;

    database.ref("users/" + key).remove().then(function() {
        showToast("User deleted from Firebase!", "success");
        loadUsersFromFirebase();
    }).catch(function(error) {
        showToast("Error deleting user", "error");
    });
}

// ==================== EDIT USER ====================
function editFirebaseUser(key) {
    database.ref("users/" + key).once("value").then(function(snapshot) {
        var user = snapshot.val();
        if (!user) {
            showToast("User not found", "error");
            return;
        }

        var html = "";
        html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">';
        html += '  <h2 style="margin: 0;">Edit User</h2>';
        html += '  <button class="btn btn-sm btn-danger" onclick="closeModal()" style="min-width: 36px;">X</button>';
        html += '</div>';
        html += '<div class="form-group"><label>Name</label><input type="text" class="form-control" id="editName" value="' + escapeHtml(user.name || "") + '"></div>';
        html += '<div class="form-group"><label>Email</label><input type="email" class="form-control" id="editEmail" value="' + escapeHtml(user.email || "") + '"></div>';
        html += '<div class="form-group"><label>Password</label><input type="password" class="form-control" id="editPassword" placeholder="Leave blank to keep current"></div>';
        html += '<button class="btn" onclick="saveUserEdit(' + key + ')">Save Changes</button>';
        html += '<button class="btn btn-outline" onclick="closeModal()" style="margin-left: 10px;">Cancel</button>';

        document.getElementById("modalContent").innerHTML = html;
        document.getElementById("modal").classList.add("active");
    });
}

function saveUserEdit(key) {
    var name = document.getElementById("editName").value.trim();
    var email = document.getElementById("editEmail").value.trim();
    var password = document.getElementById("editPassword").value;

    if (!name) { showToast("Name is required", "error"); return; }
    if (!email) { showToast("Email is required", "error"); return; }

    var updateData = {name: name, email: email};
    if (password && password.length >= 6) {
        updateData.password = password;
    }

    database.ref("users/" + key).update(updateData).then(function() {
        closeModal();
        showToast("User updated successfully!", "success");
        loadUsersFromFirebase();
    }).catch(function(error) {
        showToast("Error updating user", "error");
    });
}

// ==================== VIEW USER ACTIVITY LOGS ====================
function viewUserActivityLogs(key) {
    database.ref("users/" + key).once("value").then(function(snapshot) {
        var user = snapshot.val();
        if (!user) {
            showToast("User not found", "error");
            return;
        }

        // Get logs from Firebase activities node
        database.ref("activities").orderByChild("userEmail").equalTo(user.email).once("value").then(function(logSnapshot) {
            var logs = logSnapshot.val();
            var logList = [];
            if (logs) {
                Object.keys(logs).forEach(function(k) {
                    logList.push(logs[k]);
                });
                logList.sort(function(a, b) {
                    return (b.timestamp || 0) - (a.timestamp || 0);
                });
            }

            var loginCount = 0, registerCount = 0, rechargeCount = 0, billCount = 0, logoutCount = 0;
            logList.forEach(function(log) {
                if (log.type === "login") loginCount++;
                else if (log.type === "register") registerCount++;
                else if (log.type === "recharge") rechargeCount++;
                else if (log.type === "bill") billCount++;
                else if (log.type === "logout") logoutCount++;
            });

            var html = "";
            html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">';
            html += '  <h2 style="margin: 0;">' + escapeHtml(user.name) + '</h2>';
            html += '  <button class="btn btn-sm btn-danger" onclick="closeModal()" style="min-width: 36px;">X</button>';
            html += '</div>';
            html += '<div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 20px; color: white; margin-bottom: 20px;">';
            html += '  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">';
            html += '    <div><div style="font-size: 12px; opacity: 0.8;">Name</div><div style="font-size: 18px; font-weight: bold;">' + escapeHtml(user.name) + '</div></div>';
            html += '    <div><div style="font-size: 12px; opacity: 0.8;">Email</div><div style="font-size: 16px;">' + escapeHtml(user.email) + '</div></div>';
            html += '    <div><div style="font-size: 12px; opacity: 0.8;">Role</div><div><span class="badge ' + (user.role === "admin" ? "badge-warning" : "badge-success") + '">' + (user.role === "admin" ? "Admin" : "User") + '</span></div></div>';
            html += '    <div><div style="font-size: 12px; opacity: 0.8;">Registered</div><div style="font-size: 14px;">' + (user.registeredAt ? new Date(user.registeredAt).toLocaleString() : "-") + '</div></div>';
            html += '  </div></div>';

            // Activity Stats
            html += '<div class="activity-stats">';
            html += '  <div class="activity-stat-item"><div class="stat-count" style="color: #3498db;">' + loginCount + '</div><div class="stat-label">Login</div></div>';
            html += '  <div class="activity-stat-item"><div class="stat-count" style="color: #9b59b6;">' + registerCount + '</div><div class="stat-label">Register</div></div>';
            html += '  <div class="activity-stat-item"><div class="stat-count" style="color: #27ae60;">' + rechargeCount + '</div><div class="stat-label">Recharge</div></div>';
            html += '  <div class="activity-stat-item"><div class="stat-count" style="color: #f39c12;">' + billCount + '</div><div class="stat-label">Bill</div></div>';
            html += '  <div class="activity-stat-item"><div class="stat-count" style="color: #e74c3c;">' + logoutCount + '</div><div class="stat-label">Logout</div></div>';
            html += '</div>';

            // Activity History
            html += '<h3 style="margin: 20px 0 10px;">Activity History (' + logList.length + ')</h3>';
            html += '<div class="activity-log-container" style="max-height: 300px;">';
            if (logList.length > 0) {
                logList.forEach(function(log) {
                    var icon = log.type === "login" ? "\u1F511" : (log.type === "register" ? "\u1F4DD" : (log.type === "recharge" ? "\u1F4B0" : (log.type === "bill" ? "\u1F4C4" : (log.type === "logout" ? "\u1F6AA" : "\u1F4CB"))));
                    var timeStr = new Date(log.timestamp).toLocaleString();
                    html += '<div class="activity-log-card log-' + log.type + '">';
                    html += '  <div><span class="log-user">' + icon + ' ' + escapeHtml(log.userName || "") + '</span><span class="log-time">' + timeStr + '</span></div>';
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

// ==================== LOAD ACTIVITY LOGS ====================
function loadFirebaseActivityLogs() {
    if (typeof database === "undefined" || !database) {
        document.getElementById("adminActivityLogs").innerHTML = '<div style="text-align: center; padding: 20px;">Firebase not available</div>';
        return;
    }

    database.ref("activities").orderByChild("timestamp").limitToLast(100).once("value").then(function(snapshot) {
        var logs = snapshot.val();
        var html = "";

        if (logs) {
            var logList = [];
            Object.keys(logs).forEach(function(k) {
                logList.push(logs[k]);
            });
            logList.sort(function(a, b) {
                return (b.timestamp || 0) - (a.timestamp || 0);
            });

            logList.slice(0, 50).forEach(function(log) {
                var icon = log.type === "login" ? "\u1F511" : (log.type === "register" ? "\u1F4DD" : (log.type === "recharge" ? "\u1F4B0" : (log.type === "bill" ? "\u1F4C4" : (log.type === "logout" ? "\u1F6AA" : "\u1F4CB"))));
                var timeStr = new Date(log.timestamp).toLocaleString();
                html += '<div class="activity-log-card log-' + log.type + '">';
                html += '  <div class="log-header"><span class="log-user">' + icon + ' ' + escapeHtml(log.userName || "") + '</span><span class="log-time">' + timeStr + '</span></div>';
                html += '  <div class="log-details">' + escapeHtml(log.details || "") + '</div>';
                html += '</div>';
            });
        } else {
            html = '<div style="text-align: center; padding: 20px;">No activity logs found</div>';
        }

        document.getElementById("adminActivityLogs").innerHTML = html;
    }).catch(function(error) {
        document.getElementById("adminActivityLogs").innerHTML = '<div style="text-align: center; padding: 20px;">Error loading logs</div>';
    });
}

// Close modal function (ensure it exists)
function closeModal() {
    document.getElementById("modal").classList.remove("active");
}
