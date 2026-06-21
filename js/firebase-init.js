// ==================== FIREBASE INITIALIZATION (Realtime Database) ====================
// ⚡ Biddut Bill - Firebase Realtime Database Integration

// Firebase Configuration
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
let isSyncing = false;

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
        
        database.ref('.info/connected').on('value', function(snap) {
            if (snap.val() === true) {
                console.log('✅ Connected to Firebase Realtime Database');
                startFirebaseSync();
                if (APP.currentUser) {
                    loadFromCloud();
                }
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

// ==================== SAVE ALL TO CLOUD ====================
function saveAllToCloud() {
    if (!isFirebaseReady || !APP.currentUser) {
        console.warn('⚠️ Cannot save: Firebase not ready or no user');
        return Promise.reject('Firebase not ready');
    }
    
    if (isSyncing) {
        console.log('⏳ Sync already in progress, skipping...');
        return Promise.resolve();
    }
    
    isSyncing = true;
    
    var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
    var deviceId = getDeviceId();
    var timestamp = firebase.database.ServerValue.TIMESTAMP;
    
    return new Promise(function(resolve, reject) {
        try {
            // Prepare meters data
            var metersDataForCloud = {};
            for (var meterId in APP.metersData) {
                if (APP.metersData.hasOwnProperty(meterId)) {
                    var md = APP.metersData[meterId];
                    metersDataForCloud[meterId.replace(/[.#$\/\[\]]/g, '_')] = {
                        meterInfo: md.meterInfo || null,
                        transactions: md.transactions || [],
                        monthlyRecharges: md.monthlyRecharges || [],
                        currentBalance: md.currentBalance || 0,
                        totalRecharge: md.totalRecharge || 0,
                        totalExpended: md.totalExpended || 0,
                        lastDemandChargeMonth: md.lastDemandChargeMonth || "",
                        initialBalance: md.initialBalance || 0,
                        lastModifiedBy: APP.currentUser.email,
                        lastModifiedDevice: deviceId,
                        lastModifiedAt: timestamp
                    };
                }
            }
            
            // ✅ রেন্ট ডাটা প্রস্তুত করুন
            var rentDataForCloud = null;
            if (APP.rentData) {
                rentDataForCloud = {
                    records: APP.rentData.records || [],
                    totalRent: APP.rentData.totalRent || 0,
                    totalService: APP.rentData.totalService || 0,
                    totalParking: APP.rentData.totalParking || 0,
                    totalOverall: APP.rentData.totalOverall || 0
                };
            }
            
            // ✅ এক্সপেন্স ডাটা প্রস্তুত করুন
            var expenseDataForCloud = null;
            if (APP.currentUser) {
                var userId = APP.currentUser.id || APP.currentUser.email || 'default';
                var key = 'expenseData_' + userId;
                if (APP[key]) {
                    expenseDataForCloud = {
                        records: APP[key].records || [],
                        totalBazar: APP[key].totalBazar || 0,
                        totalGas: APP[key].totalGas || 0,
                        totalInternet: APP[key].totalInternet || 0,
                        totalMobile: APP[key].totalMobile || 0,
                        totalElectricity: APP[key].totalElectricity || 0,
                        totalWater: APP[key].totalWater || 0,
                        totalGrocery: APP[key].totalGrocery || 0,
                        totalOther: APP[key].totalOther || 0,
                        totalOverall: APP[key].totalOverall || 0
                    };
                }
            }
            
            // Save app data
            var appRef = database.ref('users/' + userEmail + '/app');
            var updateData = {
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
            };
            
            // ✅ রেন্ট ডাটা যোগ করুন
            if (rentDataForCloud) {
                updateData.rentData = rentDataForCloud;
            }
            
            // ✅ এক্সপেন্স ডাটা যোগ করুন
            if (expenseDataForCloud) {
                updateData.expenseData = expenseDataForCloud;
            }
            
            appRef.update(updateData).then(function() {
                var metersRef = database.ref('users/' + userEmail + '/meters');
                return metersRef.update(metersDataForCloud);
            }).then(function() {
                console.log('☁️ All data saved to Firebase successfully');
                isSyncing = false;
                resolve();
            }).catch(function(error) {
                console.error('❌ Save error:', error);
                isSyncing = false;
                reject(error);
            });
        } catch (error) {
            console.error('❌ Save error:', error);
            isSyncing = false;
            reject(error);
        }
    });
}

// ==================== LOAD FROM CLOUD ====================
function loadFromCloud() {
    if (!isFirebaseReady || !database || !APP.currentUser) {
        console.warn('⚠️ Cannot load: Firebase not ready or no user');
        return Promise.resolve(false);
    }
    
    return new Promise(function(resolve) {
        var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
        var userId = APP.currentUser.id || APP.currentUser.email || 'default';
        var expenseKey = 'expenseData_' + userId;
        
        console.log('☁️ Loading data from Firebase...');
        
        database.ref('users/' + userEmail + '/app').once('value').then(function(snapshot) {
            var appData = snapshot.val();
            if (appData) {
                // Settings
                if (appData.settings) {
                    APP.settings = Object.assign({}, APP.settings, appData.settings);
                }
                if (appData.tariffRates) APP.tariffRates = appData.tariffRates;
                if (appData.language) APP.language = appData.language;
                APP.savingsGoal = appData.savingsGoal || 0;
                APP.badges = appData.badges || [];
                
                if (appData.activeMeterId) {
                    APP.activeMeterId = appData.activeMeterId;
                    localStorage.setItem('biddut_activeMeterId', appData.activeMeterId);
                }
                
                if (appData.meters && Array.isArray(appData.meters)) {
                    APP.meters = appData.meters;
                }
                
                // ✅✅✅ রেন্ট ডাটা লোড ✅✅✅
                if (appData.rentData) {
                    APP.rentData = appData.rentData;
                    console.log('✅ Rent data loaded. Records:', APP.rentData?.records?.length || 0);
                } else {
                    if (!APP.rentData) {
                        APP.rentData = {
                            records: [],
                            totalRent: 0,
                            totalService: 0,
                            totalParking: 0,
                            totalOverall: 0
                        };
                    }
                    console.log('ℹ️ No rent data found, initialized empty');
                }
                
                // ✅✅✅ এক্সপেন্স ডাটা লোড ✅✅✅
                if (appData.expenseData) {
                    APP[expenseKey] = appData.expenseData;
                    console.log('✅ Expense data loaded. Records:', APP[expenseKey]?.records?.length || 0);
                } else {
                    if (!APP[expenseKey]) {
                        APP[expenseKey] = {
                            records: [],
                            totalBazar: 0,
                            totalGas: 0,
                            totalInternet: 0,
                            totalMobile: 0,
                            totalElectricity: 0,
                            totalWater: 0,
                            totalGrocery: 0,
                            totalOther: 0,
                            totalOverall: 0
                        };
                    }
                    console.log('ℹ️ No expense data found, initialized empty');
                }
            } else {
                console.log('ℹ️ No app data found in Firebase');
            }
            
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
                });
            }
            
            if (!APP.activeMeterId && APP.meters.length > 0) {
                APP.activeMeterId = APP.meters[0].id;
                localStorage.setItem('biddut_activeMeterId', APP.activeMeterId);
            }
            
            console.log('☁️ Firebase data loaded. Meters:', APP.meters.length, 'ActiveMeterId:', APP.activeMeterId);
            console.log('☁️ Rent records:', APP.rentData?.records?.length || 0);
            console.log('☁️ Expense records:', APP[expenseKey]?.records?.length || 0);
            resolve(true);
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
    
    var appListener = database.ref('users/' + userEmail + '/app').on('value', function(snapshot) {
        var data = snapshot.val();
        if (!data || !data.lastModifiedDevice) return;
        if (data.lastModifiedDevice === deviceId) return;
        
        console.log('☁️ Remote change detected in app data');
        
        setTimeout(function() {
            loadFromCloud().then(function(hasChanges) {
                if (hasChanges && APP.currentUser) {
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
    
    var metersListener = database.ref('users/' + userEmail + '/meters').on('value', function(snapshot) {
        var data = snapshot.val();
        if (!data) return;
        
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
        try { 
            if (listener.type === 'app') {
                database.ref('users/' + APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_') + '/app').off();
            } else if (listener.type === 'meters') {
                database.ref('users/' + APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_') + '/meters').off();
            }
        } catch(e) {}
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
            loadFromCloud().then(function() {
                if (APP.currentUser && APP.currentPage) {
                    navigateTo(APP.currentPage);
                }
            });
        }, 2000);
    }
}

if (document.readyState === 'complete') {
    setTimeout(tryFirebaseInit, 1500);
} else {
    window.addEventListener('load', function() {
        setTimeout(tryFirebaseInit, 1500);
    });
}