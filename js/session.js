// ==================== SESSION MANAGEMENT ====================
// Handles user session persistence across page refreshes

function tryRestoreSession() {
    try {
        var session = JSON.parse(localStorage.getItem("currentUser") || "null");
        if (session && session.loginTime && typeof APP !== "undefined" && APP) {
            var elapsed = Date.now() - session.loginTime;
            if (elapsed < 7 * 24 * 60 * 60 * 1000) {
                // Session valid - restore
                APP.currentUser = {
                    id: session.userId,
                    email: session.email,
                    name: session.name,
                    role: session.role
                };
                
                document.getElementById("authPage").style.display = "none";
                document.getElementById("appPage").style.display = "block";
                
                if (session.role === "admin") {
                    document.getElementById("adminNav").style.display = "block";
                }
                
                if (typeof updateSidebarUserInfo === "function") {
                    updateSidebarUserInfo();
                }
                
                if (typeof loadFromCloud === "function") {
                    loadFromCloud().then(function() {
                        if (typeof navigateTo === "function") {
                            navigateTo(APP.currentPage || "dashboard");
                        }
                    });
                } else {
                    if (typeof navigateTo === "function") {
                        navigateTo(APP.currentPage || "dashboard");
                    }
                }
                
                return true;
            } else {
                // Session expired
                localStorage.removeItem("currentUser");
                localStorage.removeItem("currentUserId");
            }
        }
    } catch(e) {
        console.warn("Session restore failed:", e);
    }
    return false;
}

// Try restore on load
if (document.readyState === "complete") {
    tryRestoreSession();
} else {
    window.addEventListener("load", function() {
        setTimeout(tryRestoreSession, 100);
    });
}
