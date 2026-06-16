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
            '<div id="tariffRates">',
                APP.tariffRates.map(function(rate, index) {
                    return '<div class="form-group" style="display: flex; gap: 10px; align-items: center;">'+
                        '<span style="min-width: 100px;">'+rate.name+':</span>'+
                        '<input type="number" class="form-control" placeholder="'+(L==='en'?'Min':'সর্বনিম্ন')+'" value="'+rate.range[0]+'" data-index="'+index+'" data-field="min" style="flex: 1;"'+(index===0?' disabled':'')+'>'+
                        '<input type="number" class="form-control" placeholder="'+(L==='en'?'Max':'সর্বোচ্চ')+'" value="'+(rate.range[1]||'')+'" data-index="'+index+'" data-field="max" style="flex: 1;">'+
                        '<input type="number" class="form-control" placeholder="'+(L==='en'?'Rate':'রেট')+'" value="'+rate.rate+'" data-index="'+index+'" data-field="rate" style="flex: 1;" step="0.01">'+
                    '</div>';
                }).join(''),
            '</div>',
            
            '<h3>&#x1F3A8; '+(L==='en'?'Display Settings':'ডিসপ্লে সেটিংস')+'</h3>',
            '<div class="form-group"><label>'+(L==='en'?'Font Size':'ফন্ট সাইজ')+': <span id="fontSizeValue">'+(APP.settings.fontSize||14)+'px</span></label>',
                '<input type="range" min="12" max="20" value="'+(APP.settings.fontSize||14)+'" class="form-control" oninput="changeFontSize(this.value)"></div>',
            '<div class="form-group"><label><input type="checkbox" '+(APP.settings.darkMode?'checked':'')+' onchange="toggleDarkMode()"> &#x1F319; '+(L==='en'?'Dark Mode':'ডার্ক মোড')+'</label></div>',
            '<div class="form-group"><label><input type="checkbox" '+(APP.settings.highContrast?'checked':'')+' onchange="toggleHighContrast()"> &#x1F441;&#xFE0F; '+(L==='en'?'High Contrast':'হাই কনট্রাস্ট')+'</label></div>',
            
            '<h3>&#x1F310; '+(L==='en'?'Language Settings':'ল্যাংগুয়েজ সেটিংস')+'</h3>',
            '<div class="form-group"><label>'+(L==='en'?'Interface Language':'ইন্টারফেস ভাষা')+'</label>',
                '<div style="display: flex; gap: 10px; margin-top: 8px;">'+
                    '<button class="btn '+(APP.language==='bn'?'':'btn-outline')+'" onclick="setLanguage(\'bn\')" style="flex: 1;">&#x1F1E7;&#x1F1E9; বাংলা '+(APP.language==='bn'?'&#x2705;':'')+'</button>'+
                    '<button class="btn '+(APP.language==='en'?'':'btn-outline')+'" onclick="setLanguage(\'en\')" style="flex: 1;">&#x1F1FA;&#x1F1F8; English '+(APP.language==='en'?'&#x2705;':'')+'</button>'+
                '</div></div>',
            
            '<button class="btn" onclick="saveSettings()">'+(L==='en'?'Save Settings':'সেটিংস সংরক্ষণ')+'</button>',
            
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

function saveSettings() {
    var L = APP.language;
    APP.settings.vatRate = parseFloat(document.getElementById('vatRate').value) || 5;
    APP.settings.rebateRate = parseFloat(document.getElementById('rebateRate').value) || 0.85;
    APP.settings.demandCharge = parseFloat(document.getElementById('demandCharge').value) || 294;
    
    document.querySelectorAll('#tariffRates input[data-field="min"]').forEach(function(input) {
        var index = parseInt(input.dataset.index);
        if (index > 0) { APP.tariffRates[index].range[0] = parseInt(input.value) || 0; }
    });
    document.querySelectorAll('#tariffRates input[data-field="max"]').forEach(function(input) {
        var index = parseInt(input.dataset.index);
        APP.tariffRates[index].range[1] = input.value ? parseInt(input.value) : null;
    });
    document.querySelectorAll('#tariffRates input[data-field="rate"]').forEach(function(input) {
        var index = parseInt(input.dataset.index);
        APP.tariffRates[index].rate = parseFloat(input.value) || 0;
    });
    
    saveData();
    applySettings();
    showToast(L==='en'?'Settings saved':'সেটিংস সংরক্ষিত হয়েছে', 'success');
}

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
