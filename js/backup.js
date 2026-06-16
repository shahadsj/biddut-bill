// ==================== BACKUP SYSTEM ====================
function showBackup() {
    var L = APP.language;
    document.getElementById('pageContent').innerHTML = [
        '<div class="card">',
            '<h2>'+(L==='en'?'Backup & Restore':'ব্যাকআপ ও রিস্টোর')+'</h2>',
            
            '<div style="display: grid; gap: 20px; margin-top: 20px;">',
                '<div class="card" style="background: var(--gradient-1); color: white;">',
                    '<h3>&#x1F4BE; '+(L==='en'?'Local JSON Backup':'লোকাল JSON ব্যাকআপ')+'</h3>',
                    '<p>'+(L==='en'?'Download all your data in JSON format':'আপনার সমস্ত ডাটা JSON ফরম্যাটে ডাউনলোড করুন')+'</p>',
                    '<button class="btn" style="background: white; color: var(--primary);" onclick="backupToJSON()">'+(L==='en'?'Download JSON':'JSON ডাউনলোড')+'</button>',
                '</div>',
                
                '<div class="card" style="background: var(--gradient-2); color: white;">',
                    '<h3>&#x1F4E6; '+(L==='en'?'ZIP Backup':'জিপ ব্যাকআপ')+'</h3>',
                    '<p>'+(L==='en'?'Create a compressed ZIP backup':'কমপ্রেসড জিপ ফরম্যাটে ব্যাকআপ নিন')+'</p>',
                    '<button class="btn" style="background: white; color: var(--primary);" onclick="backupToZip()">'+(L==='en'?'Download ZIP':'জিপ ডাউনলোড')+'</button>',
                '</div>',
                
                '<div class="card" style="background: var(--gradient-3); color: white;">',
                    '<h3>&#x1F4C2; '+(L==='en'?'Restore Data':'ডাটা রিস্টোর')+'</h3>',
                    '<p>'+(L==='en'?'Restore data from a previous JSON backup':'পূর্ববর্তী JSON ব্যাকআপ থেকে ডাটা ফিরিয়ে আনুন')+'</p>',
                    '<input type="file" id="restoreFile" accept=".json" style="display: none;" onchange="restoreFromJSON(event)">',
                    '<button class="btn" style="background: white; color: var(--primary);" onclick="document.getElementById(\'restoreFile\').click()">'+(L==='en'?'Select File':'ফাইল সিলেক্ট করুন')+'</button>',
                    '<p style="margin-top: 10px; font-size: 12px;">&#x26A0;&#xFE0F; '+(L==='en'?'Restore will overwrite current data':'রিস্টোর করলে বর্তমান ডাটা ওভাররাইট হয়ে যাবে')+'</p>',
                '</div>',
                
                '<div class="card" style="background: var(--gradient-4); color: white;">',
                    '<h3>&#x2601;&#xFE0F; '+(L==='en'?'Cloud Backup':'ক্লাউড ব্যাকআপ')+'</h3>',
                    '<p>'+(L==='en'?'Cloud storage backup (coming soon)':'ক্লাউড স্টোরেজে ব্যাকআপ (শীঘ্রই আসছে)')+'</p>',
                    '<button class="btn" style="background: white; color: var(--primary); margin: 5px;" disabled>&#x1F4F1; Google Drive</button>',
                    '<button class="btn" style="background: white; color: var(--primary); margin: 5px;" disabled>&#x1F4F1; Dropbox</button>',
                '</div>',
            '</div>',
            
            '<div style="margin-top: 40px; padding-top: 20px; border-top: 3px solid var(--danger);">',
                '<h2 style="color: var(--danger);">&#x26A0;&#xFE0F; '+(L==='en'?'Danger Zone':'ডেঞ্জার জোন')+'</h2>',
                
                '<div class="card" style="background: #fff5f5; border: 2px solid var(--danger); margin-top: 20px;">',
                    '<div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">',
                        '<div style="flex: 1;">',
                            '<h3 style="color: var(--danger); margin-bottom: 10px;">&#x1F5D1;&#xFE0F; '+(L==='en'?'Delete All Data':'সমস্ত ডাটা মুছে ফেলুন')+'</h3>',
                            '<p style="color: #666; margin-bottom: 10px;">'+(L==='en'?'This will permanently delete all meters, transactions, settings and backup data.':'এই অপারেশন আপনার সমস্ত মিটার, ট্রানজেকশন, সেটিংস এবং ব্যাকআপ ডাটা স্থায়ীভাবে মুছে ফেলবে।')+'</p>',
                        '</div>',
                        '<button class="btn btn-danger" onclick="showClearDataConfirmation()" style="white-space: nowrap;">&#x1F5D1;&#xFE0F; '+(L==='en'?'Clear All':'সব ক্লিয়ার করুন')+'</button>',
                    '</div>',
                '</div>',
                
                '<div class="card" style="background: #fff8e1; border: 2px solid var(--warning); margin-top: 15px;">',
                    '<div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">',
                        '<div style="flex: 1;">',
                            '<h3 style="color: var(--warning); margin-bottom: 10px;">&#x1F504; '+(L==='en'?'Clear Only Transactions':'শুধু ট্রানজেকশন ক্লিয়ার করুন')+'</h3>',
                            '<p style="color: #666;">'+(L==='en'?'Remove all transactions of the current meter only.':'শুধুমাত্র বর্তমান মিটারের সব ট্রানজেকশন মুছে ফেলুন।')+'</p>',
                        '</div>',
                        '<button class="btn" style="background: var(--warning); color: white; white-space: nowrap;" onclick="clearCurrentMeterTransactions()">&#x1F504; '+(L==='en'?'Clear Transactions':'ট্রানজেকশন ক্লিয়ার')+'</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    ].join('');
}

function backupToJSON() {
    var L = APP.language;
    try {
        var backupData = {
            meters: APP.meters,
            metersData: APP.metersData,
            activeMeterId: APP.activeMeterId,
            settings: APP.settings,
            tariffRates: APP.tariffRates,
            savingsGoal: APP.savingsGoal || 0,
            badges: APP.badges || [],
            language: APP.language || 'bn',
            timestamp: new Date().toISOString(),
            type: "manual_backup",
            version: "2.0"
        };
        
        var jsonString = JSON.stringify(backupData, null, 2);
        var blob = new Blob([jsonString], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = L==='en' ? 'electricity_bill_backup_' + new Date().toISOString().split('T')[0] + '.json' : 'বিদ্যুৎ_বিল_ব্যাকআপ_' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(L==='en'?'Backup downloaded successfully':'ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে', 'success');
    } catch (error) {
        showToast((L==='en'?'Backup failed: ':'ব্যাকআপ ব্যর্থ: ') + error.message, 'error');
    }
}

function restoreFromJSON(event) {
    var L = APP.language;
    var file = event.target.files[0];
    if (!file) return;
    
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var backup = JSON.parse(e.target.result);
            
            if (!backup.metersData && !backup.meters) {
                showToast(L==='en'?'Invalid backup file':'অবৈধ ব্যাকআপ ফাইল', 'error');
                return;
            }
            
            if (!confirm(L==='en'?'Warning! Restore will overwrite all current data. Continue?':'সতর্কতা! রিস্টোর করলে বর্তমান সমস্ত ডাটা ওভাররাইট হয়ে যাবে। কি চালিয়ে যাবেন?')) {
                event.target.value = '';
                return;
            }
            
            // ===== ১. APP তে ডাটা লোড করুন =====
            if (backup.meters && Array.isArray(backup.meters)) {
                APP.meters = JSON.parse(JSON.stringify(backup.meters));
            }
            if (backup.metersData) {
                APP.metersData = JSON.parse(JSON.stringify(backup.metersData));
            }
            
            // Meter Data ঠিক করুন
            APP.meters.forEach(function(meter) {
                if (!APP.metersData[meter.id]) {
                    APP.metersData[meter.id] = {
                        transactions: [], 
                        monthlyRecharges: [], 
                        currentBalance: 0, 
                        totalRecharge: 0, 
                        totalExpended: 0,
                        lastDemandChargeMonth: "", 
                        settings: JSON.parse(JSON.stringify(APP.settings)),
                        tariffRates: JSON.parse(JSON.stringify(APP.tariffRates)), 
                        meterInfo: meter, 
                        lastUpdated: new Date().toISOString()
                    };
                } else { 
                    APP.metersData[meter.id].meterInfo = meter; 
                }
            });
            
            if (backup.activeMeterId && APP.meters.find(function(m){return m.id===backup.activeMeterId;})) {
                APP.activeMeterId = backup.activeMeterId;
            } else if (APP.meters.length > 0) { 
                APP.activeMeterId = APP.meters[0].id; 
            }
            
            if (backup.settings) APP.settings = Object.assign({}, APP.settings, backup.settings);
            if (backup.tariffRates) APP.tariffRates = JSON.parse(JSON.stringify(backup.tariffRates));
            if (backup.language) APP.language = backup.language;
            
            // ===== ২. লোকাল স্টোরেজে সেভ করুন =====
            saveData();
            
            // ===== ৩. Firebase এ সেভ করুন (গুরুত্বপূর্ণ) =====
            if (typeof syncAllToCloud === 'function') {
                syncAllToCloud();
                showToast(L==='en'?'Data restored and synced to cloud!':'ডাটা রিস্টোর এবং ক্লাউডে সিঙ্ক হয়েছে!', 'success');
            } else {
                // Firebase এ ম্যানুয়ালি সেভ
                saveToFirebase();
            }
            
            // ===== ৪. Settings Apply করুন =====
            if (typeof applySettings === 'function') {
                applySettings();
            }
            
            // ===== ৫. Badges চেক করুন =====
            checkBadgesOnLoad();
            
            showToast(L==='en'?'Data restored successfully!':'ডাটা সফলভাবে রিস্টোর হয়েছে!', 'success');
            event.target.value = '';
            
            // ===== ৬. Dashboard এ নেভিগেট করুন =====
            setTimeout(function(){ 
                navigateTo('dashboard'); 
            }, 500);
            
        } catch (error) {
            console.error('Restore error:', error);
            showToast(L==='en'?'Failed to read file: ':'ফাইল পড়তে ব্যর্থ: ' + error.message, 'error');
            event.target.value = '';
        }
    };
    reader.onerror = function() { 
        showToast(L==='en'?'Failed to read file':'ফাইল পড়তে ব্যর্থ', 'error'); 
        event.target.value = ''; 
    };
    reader.readAsText(file);
}

// ===== Firebase এ ম্যানুয়ালি সেভ করার ফাংশন =====
function saveToFirebase() {
    if (typeof database === "undefined" || !database) {
        console.warn("Firebase not available, saving locally only");
        return;
    }
    
    if (!APP.currentUser) {
        console.warn("No user logged in");
        return;
    }
    
    var userEmail = APP.currentUser.email.replace(/[.#$\/\[\]]/g, '_');
    var deviceId = getDeviceId ? getDeviceId() : 'device_' + Date.now();
    var timestamp = firebase.database.ServerValue.TIMESTAMP;
    
    // 1. App data save
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
        console.error('App save error:', error);
    });
    
    // 2. Each meter data save
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
            console.error('Meter save error for', meter.name, ':', error);
        });
    });
    
    console.log('☁️ Data saved to Firebase successfully');
}

function backupToZip() {
    var L = APP.language;
    try {
        var zip = new JSZip();
        var backupData = {
            meters: APP.meters, metersData: APP.metersData, activeMeterId: APP.activeMeterId,
            settings: APP.settings, tariffRates: APP.tariffRates, savingsGoal: APP.savingsGoal || 0,
            badges: APP.badges || [], language: APP.language || 'bn',
            timestamp: new Date().toISOString(), type: "zip_backup", version: "2.0"
        };
        zip.file('data.json', JSON.stringify(backupData, null, 2));
        zip.file('README.txt', (L==='en'?'Electricity Bill Management System Backup\nDate: ':'বিদ্যুৎ বিল ম্যানেজমেন্ট সিস্টেম ব্যাকআপ\nতারিখ: ') + new Date().toLocaleString(L==='en'?'en-US':'bn-BD') + (L==='en'?'\nVersion: 2.0\n\nRestore Instructions:\n1. Extract ZIP file\n2. Use data.json to restore\n':'\nভার্সন: 2.0\n\nরিস্টোর করার নিয়ম:\n১. জিপ ফাইল এক্সট্রাক্ট করুন\n২. data.json ফাইল ব্যবহার করে রিস্টোর করুন\n'));
        zip.generateAsync({ type: 'blob' }).then(function(content) {
            var url = URL.createObjectURL(content);
            var a = document.createElement('a');
            a.href = url;
            a.download = L==='en' ? 'electricity_bill_zip_'+new Date().toISOString().split('T')[0]+'.zip' : 'বিদ্যুৎ_বিল_জিপ_'+new Date().toISOString().split('T')[0]+'.zip';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(L==='en'?'ZIP backup downloaded':'জিপ ব্যাকআপ ডাউনলোড হয়েছে', 'success');
        });
    } catch (error) { showToast((L==='en'?'ZIP backup failed: ':'জিপ ব্যাকআপ ব্যর্থ: ')+error.message, 'error'); }
}

function showClearDataConfirmation() {
    var L = APP.language;
    document.getElementById('modalContent').innerHTML = [
        '<h2>&#x26A0;&#xFE0F; '+(L==='en'?'Delete All Data':'সমস্ত ডাটা মুছে ফেলুন')+'</h2>',
        '<div style="background: #ffeaa7; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #fdcb6e;">',
            '<p style="color: #d63031; font-weight: bold;">&#x1F534; '+(L==='en'?'Warning!':'সতর্কতা!')+'</p>',
            '<p>'+(L==='en'?'This will permanently delete all data and cannot be undone!':'এই অপারেশন সমস্ত ডাটা স্থায়ীভাবে মুছে ফেলবে এবং আন্ডু করা যাবে না!')+'</p>',
        '</div>',
        '<div class="form-group">',
            '<label>'+(L==='en'?'Type "DELETE" to confirm':'নিশ্চিত করতে "ডিলিট" লিখুন')+'</label>',
            '<input type="text" class="form-control" id="confirmText" placeholder="'+(L==='en'?'Type DELETE':'ডিলিট লিখুন')+'" autocomplete="off">',
        '</div>',
        '<div style="display: flex; gap: 10px; margin-top: 20px;">',
            '<button class="btn btn-danger" onclick="clearAllData()" id="clearDataBtn" disabled style="opacity: 0.5;">&#x1F5D1;&#xFE0F; '+(L==='en'?'Delete All Data':'সব ডাটা মুছুন')+'</button>',
            '<button class="btn btn-outline" onclick="closeModal()">'+(L==='en'?'Cancel':'বাতিল')+'</button>',
        '</div>',
    ].join('');
    
    setTimeout(function() {
        var confirmInput = document.getElementById('confirmText');
        var clearBtn = document.getElementById('clearDataBtn');
        if (confirmInput && clearBtn) {
            confirmInput.addEventListener('input', function(e) {
                if (APP.language==='en' ? e.target.value==='DELETE' : e.target.value==='ডিলিট') {
                    clearBtn.disabled = false; clearBtn.style.opacity = '1';
                } else { clearBtn.disabled = true; clearBtn.style.opacity = '0.5'; }
            });
            confirmInput.focus();
        }
    }, 100);
    document.getElementById('modal').classList.add('active');
}

function clearAllData() {
    var L = APP.language;
    if (L==='en' ? document.getElementById('confirmText').value !== 'DELETE' : document.getElementById('confirmText').value !== 'ডিলিট') {
        showToast(L==='en'?'Please type DELETE':'"ডিলিট" লিখুন', 'error');
        return;
    }
    if (!confirm(L==='en'?'Final confirmation! Delete all data?':'শেষবার নিশ্চিত করুন! সমস্ত ডাটা মুছে ফেলবেন?')) return;
    
    try {
        APP.meters = []; APP.metersData = {}; APP.activeMeterId = null;
        APP.settings = { vatRate: 5, rebateRate: 0.85, demandCharge: 294, darkMode: false, highContrast: false, fontSize: 14 };
        APP.tariffRates = [
            { range: [0, 50], rate: 3.5, name: "Lifeline" }, { range: [51, 75], rate: 4, name: "1st Slab" },
            { range: [76, 200], rate: 5.45, name: "2nd Slab" }, { range: [201, 300], rate: 5.7, name: "3rd Slab" },
            { range: [301, 400], rate: 6.02, name: "4th Slab" }, { range: [401, 600], rate: 9.3, name: "5th Slab" },
            { range: [601, null], rate: 10.7, name: "6th Slab" }
        ];
        APP.savingsGoal = 0; APP.badges = [];
        saveData(); closeModal();
        showToast(L==='en'?'All data cleared!':'সমস্ত ডাটা মুছে ফেলা হয়েছে!', 'success');
        setTimeout(function(){ navigateTo('dashboard'); }, 500);
    } catch (error) { showToast((L==='en'?'Failed: ':'ব্যর্থ: ')+error.message, 'error'); closeModal(); }
}

function clearCurrentMeterTransactions() {
    var L = APP.language;
    if (!APP.activeMeterId) { showToast(L==='en'?'No meter selected':'কোন মিটার সিলেক্ট করা নেই', 'error'); return; }
    var meter = APP.meters.find(function(m){return m.id===APP.activeMeterId;});
    if (!meter) return;
    if (!confirm(L==='en'?'Clear all transactions of "'+meter.name+'"?':'"'+meter.name+'" মিটারের সব ট্রানজেকশন মুছে ফেলবেন?')) return;
    try {
        if (APP.metersData[APP.activeMeterId]) {
            APP.metersData[APP.activeMeterId].transactions = [];
            APP.metersData[APP.activeMeterId].currentBalance = 0;
            APP.metersData[APP.activeMeterId].totalRecharge = 0;
            APP.metersData[APP.activeMeterId].totalExpended = 0;
            APP.metersData[APP.activeMeterId].monthlyRecharges = [];
            APP.metersData[APP.activeMeterId].lastUpdated = new Date().toISOString();
        }
        saveData();
        showToast(L==='en'?'Transactions cleared':'ট্রানজেকশন ক্লিয়ার হয়েছে', 'success');
        navigateTo('dashboard');
    } catch (error) { showToast((L==='en'?'Failed: ':'ব্যর্থ: ')+error.message, 'error'); }
}
