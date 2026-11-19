// ==================== SETTINGS ====================
function showSettings() {
    var L = APP.language;
    if (APP.settings.rebateRate === 0.85 || !APP.settings.rebateRate) {
        APP.settings.rebateRate = 0.6;
    }
    var sLoad = APP.settings.sanctionedLoad !== undefined ? APP.settings.sanctionedLoad : 7;
    var sTaka = APP.settings.sanctionedTaka !== undefined ? APP.settings.sanctionedTaka : 42;
    var dCharge = (APP.settings.demandCharge !== undefined && APP.settings.demandCharge !== null) ? APP.settings.demandCharge : Math.round(sLoad * sTaka * 100) / 100;
    if (APP.settings.sanctionedLoad === undefined && APP.settings.demandCharge && APP.settings.demandCharge !== 294) {
        sLoad = Math.round((APP.settings.demandCharge / sTaka) * 10) / 10;
    }

    document.getElementById('pageContent').innerHTML = [
        '<div class="card">',
            '<h2>&#x2699;&#xFE0F; '+(L==='en'?'Settings':'সেটিংস')+'</h2>',
            
            '<h3>&#x1F4B0; '+(L==='en'?'Bill Settings':'বিল সেটিংস')+'</h3>',
            '<div class="form-group"><label>'+(L==='en'?'VAT Rate (%)':'VAT রেট (%)')+'</label>',
                '<input type="number" class="form-control" id="vatRate" value="'+APP.settings.vatRate+'" step="0.1"></div>',
            '<div class="form-group"><label>'+(L==='en'?'Rebate Rate (%)':'রিবেট রেট (%)')+'</label>',
                '<input type="number" class="form-control" id="rebateRate" value="'+APP.settings.rebateRate+'" step="0.01"></div>',
            
            '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0 20px 0;">',
                '<div style="font-weight: 700; color: #1e293b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; font-size: 15px;">',
                    '<span>&#x26A1;</span> <span>'+(L==='en'?'Demand Charge Calculation (Sanctioned Load &times; Sanctioned Taka)':'ডিমান্ড চার্জ হিসাব (Sanctioned Load &times; Sanctioned Taka)')+'</span>',
                '</div>',
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">',
                    '<div class="form-group" style="margin-bottom: 0;">',
                        '<label style="font-weight: 600; color: #334155;">'+(L==='en'?'Sanctioned Load (kW)':'Sanctioned Load (মঞ্জুরিকৃত লোড - kW)')+'</label>',
                        '<input type="number" class="form-control" id="sanctionedLoad" value="'+sLoad+'" step="0.1" min="0" oninput="calculateDemandCharge()" placeholder="e.g. 7">',
                    '</div>',
                    '<div class="form-group" style="margin-bottom: 0;">',
                        '<label style="font-weight: 600; color: #334155;">'+(L==='en'?'Sanctioned Taka (Rate/kW)':'Sanctioned Taka (রেট - টাকা/kW)')+'</label>',
                        '<input type="number" class="form-control" id="sanctionedTaka" value="'+sTaka+'" step="0.5" min="0" oninput="calculateDemandCharge()" placeholder="e.g. 42">',
                    '</div>',
                    '<div class="form-group" style="margin-bottom: 0;">',
                        '<label style="font-weight: 700; color: #4338ca;">'+(L==='en'?'Total Demand Charge (Taka)':'Total Demand Charge (মোট ডিমান্ড চার্জ - টাকা)')+'</label>',
                        '<input type="number" class="form-control" id="demandCharge" value="'+dCharge+'" readonly style="background: #eef2ff; border-color: #c7d2fe; color: #3730a3; font-weight: 800; font-size: 16px; cursor: default;">',
                    '</div>',
                '</div>',
                '<div id="demandCalcFormula" style="margin-top: 10px; font-size: 13px; color: #6366f1; font-weight: 500;">',
                    (L==='en' ? '&#x1F4D0; Calculation: '+sLoad+' kW &times; &#2547;'+sTaka+' = &#2547;'+dCharge : '&#x1F4D0; হিসাব: '+sLoad+' kW &times; &#2547;'+sTaka+' = &#2547;'+dCharge),
                '</div>',
            '</div>',
            
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
            
            // Account Section
            '<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">',
                '<h3>&#x1F464; '+(L==='en'?'Account & Session':'অ্যাকাউন্ট ও সেশন')+'</h3>',
                '<div style="display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 12px; flex-wrap: wrap; background: #f8fafc; padding: 14px 16px; border-radius: 12px; border: 1px solid #e2e8f0;">',
                    '<div>',
                        '<strong style="font-size: 15px; color: #1e293b;">'+(APP.currentUser ? (APP.currentUser.name || APP.currentUser.email) : 'ইউজার')+'</strong>',
                        '<div style="font-size: 13px; color: #64748b; margin-top: 2px;">'+(APP.currentUser ? APP.currentUser.email : '')+'</div>',
                    '</div>',
                    '<button class="btn" onclick="logout()" style="background: #ef4444; color: white;">&#x1F6AA; '+(L==='en'?'Logout':'লগআউট করুন')+'</button>',
                '</div>',
            '</div>',
            
            // App Information & Version Section
            '<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">',
                '<h3>&#x2139;&#xFE0F; '+(L==='en'?'App Information & Version':'অ্যাপ তথ্য ও সংস্করণ')+'</h3>',
                '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-top: 12px;">',
                    '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid #edf2f7;">',
                        '<div>',
                            '<div style="font-weight: 700; font-size: 16px; color: #1e293b;">'+(L==='en'?'Electricity Bill System':'বিদ্যুৎ বিল সিস্টেম')+'</div>',
                            '<div style="font-size: 13px; color: #64748b;">'+(L==='en'?'Smart Prepaid Meter & Expense Tracker':'স্মার্ট প্রিপেইড মিটার ও খরচ ট্র্যাকার')+'</div>',
                        '</div>',
                        '<span style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 13px; box-shadow: 0 2px 8px rgba(102,126,234,0.3);">v2.3.0</span>',
                    '</div>',
                    '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 13px;">',
                        '<div><span style="color: #64748b;">'+(L==='en'?'Release Status: ':'রিলিজ স্ট্যাটাস: ')+'</span><strong style="color: #10b981;">'+(L==='en'?'Up to date (Latest)':'আপ-টু-ডেট (সর্বশেষ সংস্করণ)')+'</strong></div>',
                        '<div><span style="color: #64748b;">'+(L==='en'?'Build: ':'বিল্ড: ')+'</span><strong>'+(L==='en'?'November 2026':'নভেম্বর ২০২৬')+'</strong></div>',
                        '<div><span style="color: #64748b;">'+(L==='en'?'Developer: ':'ডেভেলপার: ')+'</span><strong>K. M. Abu Bakkar Siddek Shahed</strong></div>',
                    '</div>',
                '</div>',
            '</div>',

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

// ✅ Sanctioned Load এবং Sanctioned Taka থেকে Total Demand Charge অটো-ক্যালকুলেশন
function calculateDemandCharge() {
    var loadInput = document.getElementById('sanctionedLoad');
    var takaInput = document.getElementById('sanctionedTaka');
    var totalInput = document.getElementById('demandCharge');
    if (!loadInput || !takaInput || !totalInput) return 0;
    
    var load = parseFloat(loadInput.value) || 0;
    var taka = parseFloat(takaInput.value) || 0;
    var total = Math.round(load * taka * 100) / 100;
    
    totalInput.value = total;
    
    var formulaEl = document.getElementById('demandCalcFormula');
    if (formulaEl) {
        var L = APP.language;
        if (L === 'en') {
            formulaEl.innerHTML = '&#x1F4D0; Calculation: ' + load + ' kW &times; &#2547;' + taka + ' = &#2547;' + total;
        } else {
            formulaEl.innerHTML = '&#x1F4D0; হিসাব: ' + load + ' kW &times; &#2547;' + taka + ' = &#2547;' + total;
        }
    }
    return total;
}

// ✅ সেভ সেটিংস
function saveSettings() {
    var L = APP.language;
    APP.settings.vatRate = parseFloat(document.getElementById('vatRate').value) || 5;
    APP.settings.rebateRate = parseFloat(document.getElementById('rebateRate').value) || 0.6;
    
    var load = parseFloat(document.getElementById('sanctionedLoad').value) || 0;
    var taka = parseFloat(document.getElementById('sanctionedTaka').value) || 0;
    var totalDemand = Math.round(load * taka * 100) / 100;
    
    APP.settings.sanctionedLoad = load;
    APP.settings.sanctionedTaka = taka;
    APP.settings.demandCharge = totalDemand;
    
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


// Note: saveData() and loadFromCloud() are managed centrally in js/app.js and js/firebase-init.js
