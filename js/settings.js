// ==================== SETTINGS ====================
function showSettings() {
    var L = APP.language;
    document.getElementById('pageContent').innerHTML = [
        '<div class="card">',
            '<h2>&#x2699;&#xFE0F; '+(L==='en'?'Settings':'সেটিংস')+'</h2>',
            
            '<h3>&#x1F4B0; '+(L==='en'?'Bill Settings':'বিল সেটিংস')+'</h3>',
            '<div class="form-group"><label>'+(L==='en'?'VAT Rate (%)':'VAT রেট (%)')+'</label>',
                '<input type="number" class="form-control" id="vatRate" value="'+APP.settings.vatRate+'" step="0.1"></div>',
            '<div class="form-group"><label>'+(L==='en'?'Rebate Rate (%)':'রিবেট রেট (%)')+'</label>',
                '<input type="number" class="form-control" id="rebateRate" value="'+APP.settings.rebateRate+'" step="0.01"></div>',
            '<div class="form-group"><label>'+(L==='en'?'Demand Charge (Taka)':'ডিমান্ড চার্জ (টাকা)')+'</label>',
                '<input type="number" class="form-control" id="demandCharge" value="'+APP.settings.demandCharge+'"></div>',
            
            '<h3>&#x1F4CA; '+(L==='en'?'Tariff Rates (Slab Based)':'ট্যারিফ রেট (স্ল্যাব ভিত্তিক)')+'</h3>',
            '<p style="color: var(--text-light); font-size: 13px; margin-bottom: 10px;">'+
                (L==='en'?'Edit rate to see increase percentage automatically.':'রেট এডিট করলে বৃদ্ধির শতাংশ অটো দেখাবে।')+
            '</p>',
            '<div id="tariffRates">',
                '<div class="table-container"><table><thead><tr>',
                    '<th>'+(L==='en'?'Slab Name':'স্ল্যাব নাম')+'</th>',
                    '<th>'+(L==='en'?'Rate (Taka)':'রেট (টাকা)')+'</th>',
                    '<th>'+(L==='en'?'Increase %':'বৃদ্ধি %')+'</th>',
                '</tr></thead><tbody>',
                APP.tariffRates.map(function(rate, index) {
                    // স্ল্যাবের নাম তৈরি করুন (রেঞ্জ সহ)
                    var slabName = rate.name;
                    var range = rate.range || [];
                    var rangeText = '';
                    if (range.length >= 2) {
                        var min = range[0];
                        var max = range[1];
                        if (max === null || max === undefined) {
                            rangeText = ' (' + min + '+)';
                        } else {
                            rangeText = ' (' + min + '-' + max + ')';
                        }
                    }
                    var fullName = slabName + rangeText;
                    
                    var currentRate = rate.rate;
                    var increasePercent = rate.increasePercent || 0;
                    
                    return '<tr>'+
                        '<td><strong>'+fullName+'</strong></td>'+
                        '<td><input type="number" class="form-control" style="width:120px;display:inline-block;" value="'+currentRate.toFixed(2)+'" data-index="'+index+'" data-field="rate" step="0.01" oninput="calculateTariffPercent(this)"> ৳</td>'+
                        '<td><strong id="percentDisplay_'+index+'" style="color: '+(increasePercent > 0 ? '#27ae60' : '#666')+';">'+(increasePercent > 0 ? '+'+increasePercent.toFixed(2)+'%' : '0%')+'</strong></td>'+
                    '</tr>';
                }).join(''),
                '</tbody></table></div>',
            '</div>',
            
            '<button class="btn" onclick="saveSettings()">'+(L==='en'?'Save Settings':'সেটিংস সংরক্ষণ')+'</button>',
            
            // Danger Zone
            '<div style="margin-top: 40px; padding-top: 20px; border-top: 3px solid var(--danger);">',
                '<h2 style="color: var(--danger);">&#x26A0;&#xFE0F; '+(L==='en'?'Danger Zone':'ডেঞ্জার জোন')+'</h2>',
                '<div class="card" style="background: #fff5f5; border: 2px solid var(--danger); margin-top: 15px;">',
                    '<div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">',
                        '<div style="flex: 1;">',
                            '<h3 style="color: var(--danger); margin-bottom: 10px;">&#x1F5D1;&#xFE0F; '+(L==='en'?'Reset All Data':'সমস্ত ডাটা রিসেট করুন')+'</h3>',
                            '<p style="color: #666; margin-bottom: 10px;">'+
                                (L==='en'?'Reset to factory defaults. All meters, transactions and custom settings will be permanently deleted.':'ফ্যাক্টরি ডিফল্টে ফিরে যান। সমস্ত মিটার, ট্রানজেকশন এবং কাস্টম সেটিংস স্থায়ীভাবে মুছে যাবে।')+
                            '</p>',
                        '</div>',
                        '<button class="btn btn-danger" onclick="showClearDataConfirmation()" style="white-space: nowrap;">&#x1F5D1;&#xFE0F; '+(L==='en'?'Clear All':'সব ক্লিয়ার করুন')+'</button>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    ].join('');
}

// ✅ রেট ইনপুট দিলে % অটো-ক্যালকুলেট (আগের মানের সাথে তুলনা করে)
function calculateTariffPercent(input) {
    var index = parseInt(input.dataset.index);
    var newRate = parseFloat(input.value) || 0;
    var rate = APP.tariffRates[index];
    
    // আগের রেট (যেটা সেভ করা ছিল)
    var previousRate = rate.rate;
    
    var percentDisplay = document.getElementById('percentDisplay_' + index);
    if (!percentDisplay) return;
    
    if (newRate > 0 && previousRate > 0) {
        // আগের রেট থেকে কত % পরিবর্তন হয়েছে
        var percent = ((newRate - previousRate) / previousRate) * 100;
        var displayText = percent > 0 ? '+'+percent.toFixed(2)+'%' : (percent < 0 ? percent.toFixed(2)+'%' : '0%');
        percentDisplay.textContent = displayText;
        percentDisplay.style.color = percent > 0 ? '#27ae60' : (percent < 0 ? '#e74c3c' : '#666');
        
        // টেম্পোরারি স্টোরেজে রাখুন (সেভ বাটনে সেভ হবে)
        input.dataset.percent = percent;
        input.dataset.newRate = newRate;
    } else {
        percentDisplay.textContent = '0%';
        percentDisplay.style.color = '#666';
    }
}

// ✅ সেভ সেটিংস
function saveSettings() {
    var L = APP.language;
    APP.settings.vatRate = parseFloat(document.getElementById('vatRate').value) || 5;
    APP.settings.rebateRate = parseFloat(document.getElementById('rebateRate').value) || 0.85;
    APP.settings.demandCharge = parseFloat(document.getElementById('demandCharge').value) || 294;
    
    // ✅ ট্যারিফ রেট আপডেট করুন
    document.querySelectorAll('#tariffRates input[data-field="rate"]').forEach(function(input) {
        var index = parseInt(input.dataset.index);
        var newRate = parseFloat(input.value) || 0;
        var rate = APP.tariffRates[index];
        var previousRate = rate.rate;
        
        if (newRate > 0 && previousRate > 0) {
            var percent = ((newRate - previousRate) / previousRate) * 100;
            APP.tariffRates[index].rate = newRate;
            APP.tariffRates[index].increasePercent = percent;
        } else if (newRate > 0) {
            APP.tariffRates[index].rate = newRate;
            APP.tariffRates[index].increasePercent = 0;
        }
    });
    
    saveData();
    applySettings();
    showToast(L==='en'?'Settings saved':'সেটিংস সংরক্ষিত হয়েছে', 'success');
}

// বাকি ফাংশনগুলো আগের মতোই থাকবে...
function toggleDarkMode() {
    APP.settings.darkMode = !APP.settings.darkMode;
    if (APP.settings.darkMode) { document.body.classList.add('dark-mode'); }
    else { document.body.classList.remove('dark-mode'); }
    saveData();
}

function toggleHighContrast() {
    APP.settings.highContrast = !APP.settings.highContrast;
    if (APP.settings.highContrast) { document.body.classList.add('high-contrast'); }
    else { document.body.classList.remove('high-contrast'); }
    saveData();
}

function changeFontSize(size) {
    APP.settings.fontSize = parseInt(size);
    document.documentElement.style.setProperty('--font-size', size + 'px');
    var el = document.getElementById('fontSizeValue');
    if (el) el.textContent = size + 'px';
    saveData();
}

function setLanguage(lang) {
    if (lang === APP.language) return;
    APP.language = lang;
    saveData();
    updateAllSidebarTexts();
    updateSidebarUserInfo();
    showSettings();
    showToast(lang==='en'?'Language changed to English':'ভাষা পরিবর্তন করে বাংলা করা হয়েছে', 'success');
}


function saveData() {
    if (typeof database === "undefined" || !database) {
        showToast("Firebase not available, saving locally", "warning");
        return false;
    }
    
    var userId = APP.currentUser ? APP.currentUser.id : null;
    if (!userId) {
        showToast("User not logged in", "error");
        return false;
    }
    
    var data = {
        settings: APP.settings,
        meters: APP.meters,
        metersData: APP.metersData,
        updatedAt: Date.now()
    };
    
    database.ref("users/" + userId + "/data").set(data).then(function() {
        showToast("Data saved to cloud!", "success");
        return true;
    }).catch(function(err) {
        console.error("Save error:", err);
        showToast("Failed to save to cloud", "error");
        return false;
    });
    
    return true;
}

function loadFromCloud() {
    return new Promise(function(resolve) {
        if (typeof database === "undefined" || !database) {
            console.warn("Firebase not available");
            resolve(false);
            return;
        }
        
        var userId = APP.currentUser ? APP.currentUser.id : null;
        if (!userId) {
            resolve(false);
            return;
        }
        
        database.ref("users/" + userId + "/data").once("value").then(function(snapshot) {
            var data = snapshot.val();
            if (data) {
                if (data.settings) APP.settings = data.settings;
                if (data.meters) APP.meters = data.meters;
                if (data.metersData) APP.metersData = data.metersData;
                console.log("Data loaded from cloud:", Object.keys(data));
                resolve(true);
            } else {
                console.log("No cloud data found");
                resolve(false);
            }
        }).catch(function(err) {
            console.error("Load error:", err);
            resolve(false);
        });
    });
}
