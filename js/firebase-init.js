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
    if (typeof APP === "undefined" || !APP) { 
        console.warn("APP not ready"); 
        return Promise.resolve(false); 
    }
    if (!isFirebaseReady || !APP.currentUser) {
        return Promise.resolve(false);
    }
    
    return new Promise(function(resolve) {
        var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
        var changed = false;
        
        console.log('☁️ Loading data from Firebase...');
        
        // Load app data from Firebase
        database.ref('users/' + userEmail + '/app').once('value').then(function(snapshot) {
            var appData = snapshot.val();
            if (appData) {
                // Merge settings
                if (appData.settings) {
                    APP.settings = Object.assign({}, APP.settings, appData.settings);
                }
                if (appData.tariffRates) APP.tariffRates = appData.tariffRates;
                if (appData.language) APP.language = appData.language;
                APP.savingsGoal = appData.savingsGoal || 0;
                APP.badges = appData.badges || [];
                
                // activeMeterId লোড করুন
                if (appData.activeMeterId) {
                    APP.activeMeterId = appData.activeMeterId;
                }
                
                // Merge meters list
                if (appData.meters && Array.isArray(appData.meters)) {
                    APP.meters = appData.meters;
                    changed = true;
                }
            }
            
            // Load each meter's data
            return database.ref('users/' + userEmail + '/meters').once('value');
        }).then(function(metersSnapshot) {
            var metersData = metersSnapshot.val();
            if (metersData) {
                Object.keys(metersData).forEach(function(key) {
                    var cloudMeterData = metersData[key];
                    var cloudMeterId = cloudMeterData.meterInfo ? cloudMeterData.meterInfo.id : null;
                    if (!cloudMeterId) return;
                    
                    APP.metersData[cloudMeterId] = {
                        transactions: cloudMeterData.transactions || [],
                        monthlyRecharges: cloudMeterData.monthlyRecharges || [],
                        currentBalance: cloudMeterData.currentBalance || 0,
                        totalRecharge: cloudMeterData.totalRecharge || 0,
                        totalExpended: cloudMeterData.totalExpended || 0,
                        lastDemandChargeMonth: cloudMeterData.lastDemandChargeMonth || "",
                        initialBalance: cloudMeterData.initialBalance || 0,
                        meterInfo: cloudMeterData.meterInfo || APP.meters.find(function(m) { return m.id === cloudMeterId; }),
                        lastUpdated: new Date().toISOString()
                    };
                    changed = true;
                });
            }
            
            // activeMeterId না থাকলে সেট করুন
            if (!APP.activeMeterId && APP.meters.length > 0) {
                APP.activeMeterId = APP.meters[0].id;
            }
            
            console.log('☁️ Firebase data loaded. Meters:', APP.meters.length, 'ActiveMeterId:', APP.activeMeterId);
            resolve(changed);
        }).catch(function(error) {
            console.error('❌ Firebase load error:', error);
            resolve(false);
        });
    });
}

// ==================== REAL-TIME LISTENER ====================
function startFirebaseSync() {
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
