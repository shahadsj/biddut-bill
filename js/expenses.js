// ============================================================
// EXPENSES TRACKER - ইউজার ভিত্তিক (মিটার মুক্ত)
// ============================================================

// ✅ ডাটা ইনিশিয়ালাইজ - ইউজার অনুযায়ী
function getExpenseData() {
    if (!APP.currentUser) {
        console.warn('No user logged in');
        return {
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
    
    var userId = APP.currentUser.id || APP.currentUser.email || 'default';
    var key = 'expenseData_' + userId;
    
    if (!APP[key] || typeof APP[key] !== 'object') {
        APP[key] = {
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
    
    if (!APP[key].records || !Array.isArray(APP[key].records)) {
        APP[key].records = [];
    }
    
    return APP[key];
}

// ✅ ডাটা সেভ
function saveExpenseData() {
    if (!APP.currentUser) return;
    if (typeof saveAllToCloud === 'function') {
        saveAllToCloud();
    }
}

// ============================================================
// ✅ কমা সেপারেটর
// ============================================================
function formatNumberWithComma(num) {
    if (num === undefined || num === null) return '0';
    return Number(num).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ============================================================
// ✅ খরচের ধরণের নাম
// ============================================================
function getExpenseTypeName(type) {
    var names = {
        'bazar': '🛒 বাজার',
        'gas': '🪔 গ্যাস সিলিন্ডার',
        'internet': '🌐 ইন্টারনেট',
        'mobile': '📱 মোবাইল',
        'electricity': '💡 বিদ্যুৎ',
        'water': '💧 পানি',
        'grocery': '🛍️ মুদি',
        'other': '📦 অন্যান্য'
    };
    return names[type] || type;
}

function getExpenseTypeColor(type) {
    var colors = {
        'bazar': 'linear-gradient(135deg, #f59e0b, #d97706)',
        'gas': 'linear-gradient(135deg, #ef4444, #dc2626)',
        'internet': 'linear-gradient(135deg, #3b82f6, #2563eb)',
        'mobile': 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        'electricity': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        'water': 'linear-gradient(135deg, #06b6d4, #0891b2)',
        'grocery': 'linear-gradient(135deg, #10b981, #059669)',
        'other': 'linear-gradient(135deg, #6b7280, #4b5563)'
    };
    return colors[type] || colors.other;
}

// ============================================================
// ✅ ক্যালেন্ডার ভেরিয়েবল
// ============================================================
var expenseCalendarDate = new Date();
var expenseSelectedDate = null;

function toggleExpenseCalendar() {
    var popup = document.getElementById('expenseCalendarPopup');
    if (popup) {
        if (popup.style.display === 'block') {
            popup.style.display = 'none';
        } else {
            popup.style.display = 'block';
            renderExpenseCalendar();
        }
    }
}

function closeExpenseCalendar() {
    var popup = document.getElementById('expenseCalendarPopup');
    if (popup) popup.style.display = 'none';
}

function changeExpenseMonth(delta) {
    expenseCalendarDate.setMonth(expenseCalendarDate.getMonth() + delta);
    renderExpenseCalendar();
}

function renderExpenseCalendar() {
    var year = expenseCalendarDate.getFullYear();
    var month = expenseCalendarDate.getMonth();
    
    var monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    var titleEl = document.getElementById('expenseCalendarMonthYear');
    if (titleEl) titleEl.textContent = monthNames[month] + ' ' + year;
    
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    
    var daysContainer = document.getElementById('expenseCalendarDays');
    if (!daysContainer) return;
    daysContainer.innerHTML = '';
    
    for (var i = 0; i < firstDay; i++) {
        var emptyDiv = document.createElement('div');
        emptyDiv.style.padding = '6px 0';
        daysContainer.appendChild(emptyDiv);
    }
    
    var today = new Date();
    var todayDate = today.getDate();
    var todayMonth = today.getMonth();
    var todayYear = today.getFullYear();
    
    for (var d = 1; d <= daysInMonth; d++) {
        var dayDiv = document.createElement('div');
        dayDiv.textContent = d;
        dayDiv.style.padding = '6px 0';
        dayDiv.style.borderRadius = '6px';
        dayDiv.style.cursor = 'pointer';
        dayDiv.style.fontSize = '14px';
        dayDiv.style.transition = 'all 0.2s';
        
        if (d === todayDate && month === todayMonth && year === todayYear) {
            dayDiv.style.background = '#e2e8f0';
            dayDiv.style.fontWeight = 'bold';
        }
        
        if (expenseSelectedDate && d === expenseSelectedDate.getDate() && 
            month === expenseSelectedDate.getMonth() && year === expenseSelectedDate.getFullYear()) {
            dayDiv.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            dayDiv.style.color = '#fff';
            dayDiv.style.fontWeight = 'bold';
        }
        
        dayDiv.onmouseover = function() {
            if (!this.style.background || this.style.background.indexOf('linear-gradient') === -1) {
                this.style.background = '#f1f5f9';
            }
        };
        dayDiv.onmouseout = function() {
            if (!this.style.background || this.style.background.indexOf('linear-gradient') === -1) {
                this.style.background = '';
            }
        };
        
        dayDiv.onclick = function(day) {
            return function() {
                expenseSelectedDate = new Date(year, month, day);
                renderExpenseCalendar();
            };
        }(d);
        
        daysContainer.appendChild(dayDiv);
    }
}

function confirmExpenseDate() {
    if (!expenseSelectedDate) {
        expenseSelectedDate = new Date();
    }
    
    var year = expenseSelectedDate.getFullYear();
    var month = String(expenseSelectedDate.getMonth() + 1).padStart(2, '0');
    var monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    var displayEl = document.getElementById('expenseMonthDisplay');
    if (displayEl) {
        displayEl.value = monthNames[expenseSelectedDate.getMonth()] + ' ' + year;
    }
    var valueEl = document.getElementById('expenseMonthValue');
    if (valueEl) {
        valueEl.value = year + '-' + month;
    }
    
    closeExpenseCalendar();
}

// ============================================================
// ✅ ফর্ম দেখানো (এডিট সহ)
// ============================================================
function showExpenseForm(expenseId) {
    var modal = document.getElementById('expenseModal');
    if (!modal) {
        console.error('expenseModal not found');
        return;
    }
    
    // ক্যালেন্ডার রিসেট
    var now = new Date();
    expenseSelectedDate = new Date(now.getFullYear(), now.getMonth(), 1);
    expenseCalendarDate = new Date(now.getFullYear(), now.getMonth(), 1);
    
    var monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    var displayEl = document.getElementById('expenseMonthDisplay');
    if (displayEl) {
        displayEl.value = monthNames[now.getMonth()] + ' ' + now.getFullYear();
    }
    var valueEl = document.getElementById('expenseMonthValue');
    if (valueEl) {
        valueEl.value = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    }
    
    // ফর্ম রিসেট
    document.getElementById('expenseType').value = 'bazar';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
    
    // ✅ এডিট মোড
    var titleEl = document.getElementById('expenseModalTitle');
    var editInput = document.getElementById('editExpenseId');
    
    if (expenseId) {
        var expenseData = getExpenseData();
        var record = expenseData.records.find(function(r) { return r.id === expenseId; });
        if (record) {
            document.getElementById('expenseType').value = record.type || 'bazar';
            document.getElementById('expenseDescription').value = record.description || '';
            document.getElementById('expenseAmount').value = record.amount || 0;
            if (record.month) {
                var parts = record.month.split('-');
                var mNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                              'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
                displayEl.value = mNames[parseInt(parts[1]) - 1] + ' ' + parts[0];
                valueEl.value = record.month;
            }
            if (titleEl) titleEl.textContent = APP.language === 'en' ? 'Edit Expense' : 'খরচ এডিট';
        }
    } else {
        if (titleEl) titleEl.textContent = APP.language === 'en' ? 'Add Expense' : 'খরচ যোগ করুন';
    }
    
    // ✅ এডিট আইডি সংরক্ষণ
    if (!editInput) {
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'editExpenseId';
        modal.querySelector('.modal-content').appendChild(hiddenInput);
    }
    document.getElementById('editExpenseId').value = expenseId || '';
    
    closeExpenseCalendar();
    modal.classList.add('active');
}

function closeExpenseModal() {
    var modal = document.getElementById('expenseModal');
    if (modal) {
        modal.classList.remove('active');
    }
    closeExpenseCalendar();
}

// ============================================================
// ✅ খরচ সেভ করা (এডিট সহ) - সম্পূর্ণ ঠিক করা
// ============================================================
function saveExpense() {
    var month = document.getElementById('expenseMonthValue').value;
    var type = document.getElementById('expenseType').value;
    var description = document.getElementById('expenseDescription').value.trim();
    var amount = parseFloat(document.getElementById('expenseAmount').value) || 0;
    var editId = document.getElementById('editExpenseId').value;
    var L = APP.language || 'bn';

    if (!month) {
        showToast(L === 'en' ? 'Please select a month' : 'দয়া করে একটি মাস নির্বাচন করুন', 'error');
        return;
    }
    if (amount <= 0) {
        showToast(L === 'en' ? 'Please enter a valid amount' : 'দয়া করে সঠিক পরিমাণ দিন', 'error');
        return;
    }

    // ✅ expenseData সঠিকভাবে নিন
    var expenseData = getExpenseData();
    if (!expenseData) {
        showToast(L === 'en' ? 'User data not found' : 'ইউজার ডাটা পাওয়া যায়নি', 'error');
        return;
    }

    // ✅ records চেক করুন
    if (!expenseData.records || !Array.isArray(expenseData.records)) {
        expenseData.records = [];
    }

    var record = {
        id: editId || 'expense_' + Date.now().toString(),
        month: month,
        type: type,
        typeName: getExpenseTypeName(type),
        description: description || getExpenseTypeName(type),
        amount: amount,
        createdAt: new Date().toISOString(),
        userId: APP.currentUser.id || APP.currentUser.email || 'default'
    };

    if (editId) {
        var index = expenseData.records.findIndex(function(r) { return r.id === editId; });
        if (index !== -1) {
            expenseData.records[index] = record;
        } else {
            expenseData.records.push(record);
        }
    } else {
        expenseData.records.push(record);
    }
    
    // ✅ টোটাল আপডেট
    updateExpenseTotals();

    // ✅ Firebase-এ সেভ
    if (typeof saveAllToCloud === 'function') {
        saveAllToCloud();
    }

    closeExpenseModal();

    showToast(L === 'en' ? '✅ Expense saved successfully!' : '✅ খরচ সফলভাবে সংরক্ষিত হয়েছে!', 'success');

    if (APP.currentPage === 'expenses') {
        showExpenseReport();
    } else if (APP.currentPage === 'dashboard') {
        showDashboard();
    }
}

// ============================================================
// ✅ টোটাল আপডেট
// ============================================================
function updateExpenseTotals() {
    var expenseData = getExpenseData();
    if (!expenseData || !expenseData.records) return;

    var totals = {
        bazar: 0, gas: 0, internet: 0, mobile: 0, 
        electricity: 0, water: 0, grocery: 0, other: 0
    };
    var totalOverall = 0;

    expenseData.records.forEach(function(record) {
        var type = record.type || 'other';
        if (totals[type] !== undefined) {
            totals[type] += record.amount || 0;
        } else {
            totals.other += record.amount || 0;
        }
        totalOverall += record.amount || 0;
    });

    expenseData.totalBazar = totals.bazar;
    expenseData.totalGas = totals.gas;
    expenseData.totalInternet = totals.internet;
    expenseData.totalMobile = totals.mobile;
    expenseData.totalElectricity = totals.electricity;
    expenseData.totalWater = totals.water;
    expenseData.totalGrocery = totals.grocery;
    expenseData.totalOther = totals.other;
    expenseData.totalOverall = totalOverall;
}

// ============================================================
// ✅ রিপোর্ট দেখানো (কমা + এডিট সহ)
// ============================================================
function showExpenseReport() {
    var L = APP.language || 'bn';
    
    if (!APP.currentUser) {
        showToast(L === 'en' ? 'Please login first' : 'দয়া করে আগে লগইন করুন', 'error');
        return;
    }
    
    var expenseData = getExpenseData();
    if (!expenseData) {
        expenseData = {
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
    
    var records = expenseData.records.slice().sort(function(a, b) {
        return b.month.localeCompare(a.month) || b.createdAt.localeCompare(a.createdAt);
    });

    var html = '<div class="card">';
    html += '<h2>🛒 ' + (L === 'en' ? 'My Expenses' : 'আমার খরচ') + '</h2>';
    html += '<p style="color: var(--text-light); font-size: 13px; margin-bottom: 12px;">' + 
        (L === 'en' ? 'User: ' : 'ইউজার: ') + (APP.currentUser.name || APP.currentUser.email || 'Unknown') + '</p>';
    html += '<div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">';
    html += '<button class="btn" onclick="showExpenseForm()" style="background: linear-gradient(135deg, #f59e0b, #d97706);">➕ ' + (L === 'en' ? 'Add Expense' : 'খরচ যোগ করুন') + '</button>';
    html += '<button class="btn btn-outline" onclick="navigateTo(\'dashboard\')">⬅ ' + (L === 'en' ? 'Back' : 'ফিরে যান') + '</button>';
    html += '</div>';

    // Stats - 8 টি কার্ড
    html += '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0;">';
    
    var expenseTypes = [
        { key: 'bazar', label: '🛒 ' + (L === 'en' ? 'Bazar' : 'বাজার') },
        { key: 'gas', label: '🪔 ' + (L === 'en' ? 'Gas' : 'গ্যাস') },
        { key: 'internet', label: '🌐 ' + (L === 'en' ? 'Internet' : 'ইন্টারনেট') },
        { key: 'mobile', label: '📱 ' + (L === 'en' ? 'Mobile' : 'মোবাইল') },
        { key: 'electricity', label: '💡 ' + (L === 'en' ? 'Electricity' : 'বিদ্যুৎ') },
        { key: 'water', label: '💧 ' + (L === 'en' ? 'Water' : 'পানি') },
        { key: 'grocery', label: '🛍️ ' + (L === 'en' ? 'Grocery' : 'মুদি') },
        { key: 'other', label: '📦 ' + (L === 'en' ? 'Other' : 'অন্যান্য') }
    ];

    expenseTypes.forEach(function(type) {
        var total = expenseData['total' + type.key.charAt(0).toUpperCase() + type.key.slice(1)] || 0;
        var color = getExpenseTypeColor(type.key);
        html += '<div style="background: ' + color + '; border-radius: 12px; padding: 14px; color: #fff; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">';
        html += '<div style="font-size: 11px; opacity: 0.8;">' + type.label + '</div>';
        html += '<div style="font-size: 18px; font-weight: 700;">৳ ' + formatNumberWithComma(total) + '</div>';
        html += '</div>';
    });

    html += '</div>';

    // Total Overall
    html += '<div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 16px; color: #fff; text-align: center; margin-bottom: 16px;">';
    html += '<div style="font-size: 13px; opacity: 0.8;">' + (L === 'en' ? 'Total Overall Expense' : 'সর্বমোট খরচ') + '</div>';
    html += '<div style="font-size: 28px; font-weight: 700;">৳ ' + formatNumberWithComma(expenseData.totalOverall || 0) + '</div>';
    html += '</div>';

    // Table
    if (records.length > 0) {
        html += '<div class="rent-table-wrap"><table><thead><tr>';
        html += '<th>' + (L === 'en' ? 'Month' : 'মাস') + '</th>';
        html += '<th>' + (L === 'en' ? 'Type' : 'ধরণ') + '</th>';
        html += '<th>' + (L === 'en' ? 'Description' : 'বিবরণ') + '</th>';
        html += '<th>' + (L === 'en' ? 'Amount' : 'পরিমাণ') + '</th>';
        html += '<th>' + (L === 'en' ? 'Actions' : 'অ্যাকশন') + '</th>';
        html += '</tr></thead><tbody>';

        records.forEach(function(record) {
            var parts = record.month.split('-');
            var monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                              'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
            var monthName = monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0];

            html += '<tr>';
            html += '<td><strong>' + monthName + '</strong></td>';
            html += '<td><span class="badge" style="background: #f1f5f9; color: #0f172a;">' + record.typeName + '</span></td>';
            html += '<td>' + (record.description || '-') + '</td>';
            html += '<td><strong>৳ ' + formatNumberWithComma(record.amount || 0) + '</strong></td>';
            html += '<td>';
            html += '<button class="btn btn-sm btn-warning" onclick="showExpenseForm(\'' + record.id + '\')" style="background: #f59e0b; color: #fff; margin-right: 4px;">✏️</button>';
            html += '<button class="btn btn-sm btn-danger" onclick="deleteExpense(\'' + record.id + '\')">🗑️</button>';
            html += '</td>';
            html += '</tr>';
        });

        html += '</tbody></table></div>';
    } else {
        html += '<p style="text-align: center; padding: 30px; color: var(--text-light);">' + 
            (L === 'en' ? 'No expense records found. Click "Add Expense" to get started.' : 'কোন খরচ রেকর্ড পাওয়া যায়নি। "খরচ যোগ করুন" ক্লিক করে শুরু করুন।') + 
            '</p>';
    }

    html += '</div>';
    document.getElementById('pageContent').innerHTML = html;
}

// ============================================================
// ✅ খরচ ডিলিট করা
// ============================================================
function deleteExpense(expenseId) {
    var L = APP.language || 'bn';
    
    if (!confirm(L === 'en' ? 'Are you sure you want to delete this expense record?' : 'আপনি কি এই খরচ রেকর্ড ডিলিট করতে চান?')) {
        return;
    }
    
    var expenseData = getExpenseData();
    if (!expenseData || !expenseData.records) return;
    
    var index = -1;
    for (var i = 0; i < expenseData.records.length; i++) {
        if (expenseData.records[i].id === expenseId) {
            index = i;
            break;
        }
    }
    
    if (index === -1) {
        showToast(L === 'en' ? 'Record not found' : 'রেকর্ড পাওয়া যায়নি', 'error');
        return;
    }
    
    expenseData.records.splice(index, 1);
    updateExpenseTotals();
    
    if (typeof saveAllToCloud === 'function') {
        saveAllToCloud();
    }
    
    showToast(L === 'en' ? '✅ Expense record deleted!' : '✅ খরচ রেকর্ড ডিলিট করা হয়েছে!', 'success');
    showExpenseReport();
}

// ============================================================
// ✅ নেভিগেশন
// ============================================================
function showExpensesPage() {
    showExpenseReport();
}

// ============================================================
// ✅ ড্যাশবোর্ড উইজেট
// ============================================================
function renderExpenseWidget() {
    var L = APP.language || 'bn';
    
    if (!APP.currentUser) {
        return '';
    }
    
    var expenseData = getExpenseData();
    if (!expenseData) {
        expenseData = {
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
    
    if (!expenseData.records || expenseData.records.length === 0) {
        return '<div class="expense-widget" style="background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); border-radius: 16px; padding: 16px 20px; margin-bottom: 20px; color: #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">' +
            '<div style="display: flex; align-items: center; gap: 10px;">' +
            '<div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">🛒</div>' +
            '<div><div style="font-size: 10px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px;">' + (L === 'en' ? 'My Expenses' : 'আমার খরচ') + '</div>' +
            '<div style="font-size: 13px; opacity: 0.6;">' + (L === 'en' ? 'No records yet' : 'এখনও কোনো রেকর্ড নেই') + '</div></div></div>' +
            '<button onclick="showExpenseForm()" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; padding: 8px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); font-size: 12px;">' +
            '<i class="fas fa-plus"></i> ' + (L === 'en' ? 'Add' : 'যোগ') +
            '</button></div></div>';
    }

    updateExpenseTotals();

    var totalOverall = expenseData.totalOverall || 0;

    return '<div class="expense-widget" style="background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); border-radius: 16px; padding: 16px 20px; margin-bottom: 20px; color: #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06);">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">' +
        '<div style="display: flex; align-items: center; gap: 10px;">' +
        '<div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">🛒</div>' +
        '<div><div style="font-size: 10px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px;">' + (L === 'en' ? 'My Expenses' : 'আমার খরচ') + '</div>' +
        '<div style="font-size: 16px; font-weight: 700; color: #fbbf24;">৳ ' + formatNumberWithComma(totalOverall) + '</div></div></div>' +
        '<div style="display: flex; gap: 8px;">' +
        '<button onclick="showExpenseForm()" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); font-size: 12px;">' +
        '<i class="fas fa-plus"></i> ' + (L === 'en' ? 'Add' : 'যোগ') +
        '</button>' +
        '<button onclick="showExpenseReport()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-size: 12px; backdrop-filter: blur(4px);">' +
        '<i class="fas fa-list"></i> ' + (L === 'en' ? 'History' : 'ইতিহাস') +
        '</button>' +
        '</div></div></div>';
}