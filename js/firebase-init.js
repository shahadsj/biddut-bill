// ==================== FIREBASE INITIALIZATION (Realtime Database) ====================
// ⚡ Biddut Bill - Firebase Realtime Database Integration

// Firebase Configuration from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyB70I3TGtMZitLU4vz5gviENZoBZRH260E",
    authDomain: "biddutbill-360dd.firebaseapp.com",
    databaseURL: "https://biddutbill-360dd-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "biddutbill-360dd",
    storageBucket: "biddutbill-360dd.firebasestorage.app",
    messagingSenderId: "992860752434",
    appId: "1:992860752434:web:42528829da4a74b78b4a2b"
};

// Firebase State
let firebaseApp = null;
let database = null;
let isFirebaseReady = false;
let syncListeners = [];
let syncTimers = {};
const SYNC_DEBOUNCE_MS = 2000;

// ==================== INITIALIZE FIREBASE ====================
function initFirebase() {
    try {
        if (typeof firebase === 'undefined') {
            console.warn('⚠️ Firebase SDK not loaded.');
            return false;
        }

        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
        } else {
            firebaseApp = firebase.app();
        }

        database = firebase.database();
        isFirebaseReady = true;
        console.log('✅ Firebase Realtime Database initialized successfully');
        
        // Enable offline persistence
        database.ref('.info/connected').on('value', function(snap) {
            if (snap.val() === true) {
                console.log('✅ Connected to Firebase Realtime Database');
                startFirebaseSync();
            } else {
                console.log('📴 Offline - using local cache');
            }
        });
        
        return true;
    } catch (error) {
        console.error('❌ Firebase init error:', error);
        isFirebaseReady = false;
        return false;
    }
}

// ==================== DEVICE ID ====================
function getDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}

// ==================== SYNC ALL TO CLOUD ====================
function syncAllToCloud() {
    if (!isFirebaseReady || !APP.currentUser) return;
    
    var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
    var deviceId = getDeviceId();
    var timestamp = firebase.database.ServerValue.TIMESTAMP;
    
    // 1. Save app settings
    var appRef = database.ref('users/' + userEmail + '/app');
    appRef.update({
        activeMeterId: APP.activeMeterId || '',
        settings: APP.settings,
        tariffRates: APP.tariffRates,
        savingsGoal: APP.savingsGoal || 0,
        badges: APP.badges || [],
        language: APP.language || 'bn',
        meters: APP.meters,
        lastModifiedBy: APP.currentUser.email,
        lastModifiedDevice: deviceId,
        lastModifiedAt: timestamp
    }).catch(function(error) {
        console.error('❌ App sync error:', error);
    });
    
    // 2. Save each meter's data separately
    APP.meters.forEach(function(meter) {
        var meterData = APP.metersData[meter.id];
        if (!meterData) return;
        
        var meterRef = database.ref('users/' + userEmail + '/meters/' + meter.id.replace(/[.#$\/\[\]]/g, '_'));
        
        var cloudData = {
            meterInfo: meter,
            transactions: meterData.transactions || [],
            monthlyRecharges: meterData.monthlyRecharges || [],
            currentBalance: meterData.currentBalance || 0,
            totalRecharge: meterData.totalRecharge || 0,
            totalExpended: meterData.totalExpended || 0,
            lastDemandChargeMonth: meterData.lastDemandChargeMonth || "",
            initialBalance: meterData.initialBalance || 0,
            lastModifiedBy: APP.currentUser.email,
            lastModifiedDevice: deviceId,
            lastModifiedAt: timestamp
        };
        
        meterRef.update(cloudData).catch(function(error) {
            console.error('❌ Meter sync error for', meter.name, ':', error);
        });
    });
    
    console.log('☁️ Synced all data to cloud');
}

// ==================== LOAD FROM CLOUD ====================
function loadFromCloud() {
    return new Promise(function(resolve, reject) {
        try {
            if (typeof APP === 'undefined' || !APP) {
                console.warn('APP not ready, retrying in 1s');
                setTimeout(function() {
                    loadFromCloud().then(resolve).catch(function(){resolve(false)});
                }, 1000);
                return;
            }
            
            if (typeof database === 'undefined' || !database) {
                resolve(false);
                return;
            }
            
            var userId = APP.currentUser ? APP.currentUser.id : localStorage.getItem('currentUserId');
            if (!userId) {
                resolve(false);
                return;
            }
            
            var email = APP.currentUser ? APP.currentUser.email : '';
            if (!email) {
                resolve(false);
                return;
            }
            
            var key = email.replace(/[.#$\/\[\]]/g, '_');
            
            // Load meters
            database.ref('meters/' + key).once('value').then(function(snap) {
                var data = snap.val();
                if (data) {
                    if (data.meters) APP.meters = data.meters || [];
                    if (data.metersData) APP.metersData = data.metersData || {};
                    if (data.tariffRates) APP.tariffRates = data.tariffRates;
                    if (data.settings) Object.assign(APP.settings, data.settings);
                }
                resolve(true);
            }).catch(function(err) {
                console.warn('Error loading from cloud:', err);
                resolve(false);
            });
        } catch (e) {
            console.warn('loadFromCloud error:', e);
            resolve(false);
        }
    });
}

// ==================== REAL-TIME LISTENER ====================
function startFirebaseSync() {

    if (typeof APP === 'undefined' || !APP) {
        setTimeout(startFirebaseSync, 2000);
        return;
    }

    if (typeof APP === 'undefined' || !APP) {
        console.warn('APP not ready yet, will retry');
        setTimeout(startFirebaseSync, 1000);
        return;
    }

    if (!isFirebaseReady || !APP.currentUser) return;
    
    stopFirebaseSync();
    
    var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
    var deviceId = getDeviceId();
    
    // Listen for app data changes
    var appListener = database.ref('users/' + userEmail + '/app').on('value', function(snapshot) {
        var data = snapshot.val();
        if (!data || !data.lastModifiedDevice) return;
        
        // Skip own changes
        if (data.lastModifiedDevice === deviceId) return;
        
        console.log('☁️ Remote change detected in app data');
        
        setTimeout(function() {
            loadFromCloud().then(function(hasChanges) {
                if (hasChanges && APP.currentUser) {
                    saveData();
                    if (APP.currentPage) navigateTo(APP.currentPage);
                    showToast(
                        APP.language === 'en' ? '☁️ Data synced from cloud' : '☁️ ক্লাউড থেকে ডাটা সিঙ্ক হয়েছে',
                        'success'
                    );
                }
            });
        }, 1000);
    });
    
    syncListeners.push({ type: 'app', ref: appListener });
    
    // Listen for meter data changes
    var metersListener = database.ref('users/' + userEmail + '/meters').on('value', function(snapshot) {
        var data = snapshot.val();
        if (!data) return;
        
        // Check if change is from another device
        var hasRemoteChange = false;
        Object.keys(data).forEach(function(key) {
            var meterData = data[key];
            if (meterData.lastModifiedDevice && meterData.lastModifiedDevice !== deviceId) {
                hasRemoteChange = true;
            }
        });
        
        if (!hasRemoteChange) return;
        
        console.log('☁️ Remote meter data change detected');
        
        setTimeout(function() {
            loadFromCloud().then(function(hasChanges) {
                if (hasChanges && APP.currentUser) {
                    saveData();
                    if (APP.currentPage) navigateTo(APP.currentPage);
                    showToast(
                        APP.language === 'en' ? '☁️ Data synced from cloud' : '☁️ ক্লাউড থেকে ডাটা সিঙ্ক হয়েছে',
                        'success'
                    );
                }
            });
        }, 1000);
    });
    
    syncListeners.push({ type: 'meters', ref: metersListener });
    
    console.log('👂 Real-time listeners started');
}

function stopFirebaseSync() {
    if (!database) return;
    syncListeners.forEach(function(listener) {
        try { database.ref().off(listener.type === 'app' ? 'value' : 'value'); } catch(e) {}
    });
    syncListeners = [];
}

// ==================== SYNC STATUS ====================
function getSyncStatus() {
    if (!isFirebaseReady) {
        return { connected: false, message: APP.language === 'en' ? 'Not configured' : 'কনফিগার করা হয়নি' };
    }
    if (!navigator.onLine) {
        return { connected: false, message: APP.language === 'en' ? 'Offline' : 'অফলাইন' };
    }
    return { connected: true, message: APP.language === 'en' ? 'Synced' : 'সিঙ্ক হয়েছে' };
}

// ==================== INIT ====================
function tryFirebaseInit() {
    var result = initFirebase();
    if (result) {
        setTimeout(function() {
            loadFromCloud().then(function(hasChanges) {
                if (hasChanges) {
                    saveData();
                    if (APP.currentUser && APP.currentPage) {
                        navigateTo(APP.currentPage);
                    }
                }
            });
        }, 2000);
    }
}

// Auto init when app loads
if (document.readyState === 'complete') {
    setTimeout(tryFirebaseInit, 1500);
} else {
    window.addEventListener('load', function() {
        setTimeout(tryFirebaseInit, 1500);
    });
}
