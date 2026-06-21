// ============================================================
// RENT MANAGEMENT - সম্পূর্ণ ফাংশন (কমা + এডিট সহ)
// ============================================================

// ✅ রেন্ট ডাটা ইনিশিয়ালাইজ
if (typeof APP !== 'undefined' && APP) {
    if (!APP.rentData) {
        APP.rentData = {
            records: [],
            totalRent: 0,
            totalService: 0,
            totalParking: 0,
            totalOverall: 0
        };
    }
}

// ============================================================
// ✅ কমা সেপারেটর ফাংশন
// ============================================================
function formatNumberWithComma(num) {
    if (num === undefined || num === null) return '0';
    return Number(num).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ============================================================
// ✅ মিটারের নাম পাওয়া
// ============================================================
function getMeterDisplayName(meter) {
    if (!meter) return 'Unknown';
    if (meter.nameBn && meter.nameBn.trim() !== '') {
        return meter.nameBn;
    }
    return meter.name || 'Unknown';
}

// ============================================================
// ✅ ক্যালেন্ডার ভেরিয়েবল
// ============================================================
var calendarDate = new Date();
var selectedDate = null;

// ============================================================
// ✅ ক্যালেন্ডার ফাংশন
// ============================================================
function toggleCalendar() {
    var popup = document.getElementById('calendarPopup');
    if (popup.style.display === 'block') {
        popup.style.display = 'none';
    } else {
        popup.style.display = 'block';
        renderCalendar();
    }
}

function closeCalendar() {
    document.getElementById('calendarPopup').style.display = 'none';
}

function changeMonth(delta) {
    calendarDate.setMonth(calendarDate.getMonth() + delta);
    renderCalendar();
}

function renderCalendar() {
    var year = calendarDate.getFullYear();
    var month = calendarDate.getMonth();
    
    var monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    document.getElementById('calendarMonthYear').textContent = monthNames[month] + ' ' + year;
    
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    
    var daysContainer = document.getElementById('calendarDays');
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
        
        if (selectedDate && d === selectedDate.getDate() && 
            month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
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
                selectDate(year, month, day);
            };
        }(d);
        
        daysContainer.appendChild(dayDiv);
    }
}

function selectDate(year, month, day) {
    selectedDate = new Date(year, month, day);
    renderCalendar();
}

function confirmDate() {
    if (!selectedDate) {
        selectedDate = new Date();
    }
    
    var year = selectedDate.getFullYear();
    var month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    var monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    
    document.getElementById('rentMonthDisplay').value = monthNames[selectedDate.getMonth()] + ' ' + year;
    document.getElementById('rentMonthValue').value = year + '-' + month;
    
    closeCalendar();
}

// ============================================================
// ✅ রেন্ট পেজ দেখানো
// ============================================================
function showRentPage() {
    showRentReport();
}

// ============================================================
// ✅ রেন্ট ফর্ম দেখানো (এডিটের জন্য)
// ============================================================
function showRentForm(rentId) {
    var modal = document.getElementById('rentModal');
    if (!modal) {
        console.error('rentModal not found');
        return;
    }
    
    // মিটার লিস্ট আপডেট করুন
    var select = document.getElementById('rentMeterSelect');
    if (select && APP.meters) {
        select.innerHTML = '<option value="">-- মিটার নির্বাচন করুন --</option>';
        APP.meters.forEach(function(m) {
            var opt = document.createElement('option');
            opt.value = m.id;
            var displayName = getMeterDisplayName(m);
            opt.textContent = displayName + ' - ' + (m.meterNumber || m.meterNo || '');
            select.appendChild(opt);
        });
    }
    
    // ক্যালেন্ডার রিসেট
    var now = new Date();
    selectedDate = new Date(now.getFullYear(), now.getMonth(), 1);
    calendarDate = new Date(now.getFullYear(), now.getMonth(), 1);
    
    var monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    document.getElementById('rentMonthDisplay').value = monthNames[now.getMonth()] + ' ' + now.getFullYear();
    document.getElementById('rentMonthValue').value = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    
    // ফর্ম রিসেট
    document.getElementById('rentAmount').value = '';
    document.getElementById('serviceCharge').value = '0';
    document.getElementById('parkingCharge').value = '0';
    document.getElementById('parkingType').value = 'none';
    document.getElementById('rentStatus').value = 'paid';
    
    // ✅ এডিট মোড
    var titleEl = document.getElementById('rentModalTitle');
    if (rentId) {
        // এডিট মোড - ডাটা লোড করুন
        var record = APP.rentData.records.find(function(r) { return r.id === rentId; });
        if (record) {
            document.getElementById('rentMeterSelect').value = record.meterId || '';
            document.getElementById('rentMonthDisplay').value = getMonthDisplay(record.month);
            document.getElementById('rentMonthValue').value = record.month;
            document.getElementById('rentAmount').value = record.rentAmount;
            document.getElementById('serviceCharge').value = record.serviceCharge;
            document.getElementById('parkingCharge').value = record.parkingCharge || 0;
            document.getElementById('parkingType').value = record.parkingType || 'none';
            document.getElementById('rentStatus').value = record.status || 'paid';
            if (titleEl) titleEl.textContent = APP.language === 'en' ? 'Edit Rent' : 'ভাড়া এডিট';
        }
    } else {
        if (titleEl) titleEl.textContent = APP.language === 'en' ? 'Add Rent' : 'ভাড়া যোগ করুন';
    }
    
    // ✅ এডিট আইডি সংরক্ষণ
    var editInput = document.getElementById('editRentId');
    if (!editInput) {
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'editRentId';
        document.getElementById('rentModal').querySelector('.modal-content').appendChild(hiddenInput);
    }
    document.getElementById('editRentId').value = rentId || '';
    
    closeCalendar();
    modal.classList.add('active');
}

function getMonthDisplay(monthStr) {
    if (!monthStr) return '';
    var parts = monthStr.split('-');
    var monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    return monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0];
}

// ============================================================
// ✅ রেন্ট মডেল বন্ধ করা
// ============================================================
function closeRentModal() {
    var modal = document.getElementById('rentModal');
    if (modal) {
        modal.classList.remove('active');
    }
    closeCalendar();
}

// ============================================================
// ✅ রেন্ট সেভ করা (এডিট সহ)
// ============================================================
function saveRent() {
    var meterId = document.getElementById('rentMeterSelect').value;
    var month = document.getElementById('rentMonthValue').value;
    var rentAmount = parseFloat(document.getElementById('rentAmount').value) || 0;
    var serviceCharge = parseFloat(document.getElementById('serviceCharge').value) || 0;
    var parkingCharge = parseFloat(document.getElementById('parkingCharge').value) || 0;
    var parkingType = document.getElementById('parkingType').value;
    var status = document.getElementById('rentStatus').value;
    var editId = document.getElementById('editRentId').value;
    var L = APP.language || 'bn';

    // Validation
    if (!meterId) {
        showToast(L === 'en' ? 'Please select a meter' : 'দয়া করে একটি মিটার নির্বাচন করুন', 'error');
        return;
    }
    if (!month) {
        showToast(L === 'en' ? 'Please select a month' : 'দয়া করে একটি মাস নির্বাচন করুন', 'error');
        return;
    }
    if (rentAmount <= 0) {
        showToast(L === 'en' ? 'Please enter a valid rent amount' : 'দয়া করে সঠিক ভাড়ার পরিমাণ দিন', 'error');
        return;
    }

    // Meter Name
    var meterName = 'Unknown';
    var meter = APP.meters.find(function(m) { return m.id === meterId; });
    if (meter) {
        meterName = getMeterDisplayName(meter);
    }

    // চেক করুন এই মাসে এই মিটারের জন্য ইতিমধ্যে রেন্ট আছে কিনা (এডিট除外)
    if (!editId) {
        var existing = APP.rentData.records.find(function(r) {
            return r.meterId === meterId && r.month === month;
        });
        if (existing) {
            showToast(L === 'en' ? 'Rent already exists for this month!' : 'এই মাসের জন্য ইতিমধ্যে ভাড়া আছে!', 'warning');
            return;
        }
    }

    var parkingTypeName = parkingType === 'bike' ? 'বাইক' : 
                          parkingType === 'car' ? 'গাড়ি' : 'নেই';

    var record = {
        id: editId || 'rent_' + Date.now().toString(),
        meterId: meterId,
        meterName: meterName,
        month: month,
        rentAmount: rentAmount,
        serviceCharge: serviceCharge,
        parkingCharge: parkingCharge,
        parkingType: parkingType,
        parkingTypeName: parkingTypeName,
        totalAmount: rentAmount + serviceCharge + parkingCharge,
        status: status,
        createdAt: new Date().toISOString()
    };

    if (editId) {
        // এডিট - পুরনো রেকর্ড রিপ্লেস করুন
        var index = APP.rentData.records.findIndex(function(r) { return r.id === editId; });
        if (index !== -1) {
            APP.rentData.records[index] = record;
        }
    } else {
        APP.rentData.records.push(record);
    }

    updateRentTotals();

    if (typeof saveAllToCloud === 'function') {
        saveAllToCloud();
    }

    closeRentModal();

    showToast(L === 'en' ? '✅ Rent saved successfully!' : '✅ ভাড়া সফলভাবে সংরক্ষিত হয়েছে!', 'success');

    if (APP.currentPage === 'dashboard') {
        showDashboard();
    } else if (APP.currentPage === 'rent') {
        showRentReport();
    }
}

// ============================================================
// ✅ রেন্ট টোটাল আপডেট
// ============================================================
function updateRentTotals() {
    if (!APP.rentData || !APP.rentData.records) return;

    var totalRent = 0;
    var totalService = 0;
    var totalParking = 0;
    var totalOverall = 0;

    APP.rentData.records.forEach(function(record) {
        totalRent += record.rentAmount || 0;
        totalService += record.serviceCharge || 0;
        totalParking += record.parkingCharge || 0;
        totalOverall += record.totalAmount || 0;
    });

    APP.rentData.totalRent = totalRent;
    APP.rentData.totalService = totalService;
    APP.rentData.totalParking = totalParking;
    APP.rentData.totalOverall = totalOverall;
}

// ============================================================
// ✅ বর্তমান মাসের রেন্ট পাওয়া
// ============================================================
function getCurrentMonthRent(meterId) {
    if (!APP.rentData || !APP.rentData.records) return null;

    var now = new Date();
    var currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    for (var i = 0; i < APP.rentData.records.length; i++) {
        var record = APP.rentData.records[i];
        if (record.meterId === meterId && record.month === currentMonth) {
            return record;
        }
    }
    return null;
}

// ============================================================
// ✅ রেন্ট রিপোর্ট দেখানো (কমা + এডিট সহ)
// ============================================================
function showRentReport() {
    var L = APP.language || 'bn';
    
    if (!APP.rentData) {
        APP.rentData = { records: [], totalRent: 0, totalService: 0, totalParking: 0, totalOverall: 0 };
    }
    
    var records = APP.rentData.records.slice().sort(function(a, b) {
        return b.month.localeCompare(a.month) || b.createdAt.localeCompare(a.createdAt);
    });

    var html = '<div class="card">';
    html += '<h2>🏠 ' + (L === 'en' ? 'Rent & Service Charge Report' : 'ভাড়া ও সার্ভিস চার্জ রিপোর্ট') + '</h2>';
    html += '<div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">';
    html += '<button class="btn" onclick="showRentForm()" style="background: linear-gradient(135deg, #f59e0b, #d97706);">➕ ' + (L === 'en' ? 'Add Rent' : 'ভাড়া যোগ করুন') + '</button>';
    html += '<button class="btn btn-outline" onclick="navigateTo(\'dashboard\')">⬅ ' + (L === 'en' ? 'Back' : 'ফিরে যান') + '</button>';
    html += '</div>';

    // Stats
    html += '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0;">';
    html += '<div style="background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; padding: 16px; color: #fff; text-align: center;">';
    html += '<div style="font-size: 12px; opacity: 0.8;">' + (L === 'en' ? 'Total Rent' : 'মোট ভাড়া') + '</div>';
    html += '<div style="font-size: 20px; font-weight: 700;">৳ ' + formatNumberWithComma(APP.rentData.totalRent || 0) + '</div>';
    html += '</div>';
    html += '<div style="background: linear-gradient(135deg, #34d399, #059669); border-radius: 12px; padding: 16px; color: #fff; text-align: center;">';
    html += '<div style="font-size: 12px; opacity: 0.8;">' + (L === 'en' ? 'Total Service' : 'মোট সার্ভিস') + '</div>';
    html += '<div style="font-size: 20px; font-weight: 700;">৳ ' + formatNumberWithComma(APP.rentData.totalService || 0) + '</div>';
    html += '</div>';
    html += '<div style="background: linear-gradient(135deg, #8b5cf6, #6d28d9); border-radius: 12px; padding: 16px; color: #fff; text-align: center;">';
    html += '<div style="font-size: 12px; opacity: 0.8;">' + (L === 'en' ? 'Total Parking' : 'মোট পার্কিং') + '</div>';
    html += '<div style="font-size: 20px; font-weight: 700;">৳ ' + formatNumberWithComma(APP.rentData.totalParking || 0) + '</div>';
    html += '</div>';
    html += '<div style="background: linear-gradient(135deg, #60a5fa, #2563eb); border-radius: 12px; padding: 16px; color: #fff; text-align: center;">';
    html += '<div style="font-size: 12px; opacity: 0.8;">' + (L === 'en' ? 'Total Overall' : 'সর্বমোট') + '</div>';
    html += '<div style="font-size: 20px; font-weight: 700;">৳ ' + formatNumberWithComma(APP.rentData.totalOverall || 0) + '</div>';
    html += '</div>';
    html += '</div>';

    // Table
    if (records.length > 0) {
        html += '<div class="rent-table-wrap"><table><thead><tr>';
        html += '<th>' + (L === 'en' ? 'Month' : 'মাস') + '</th>';
        html += '<th>' + (L === 'en' ? 'Meter' : 'মিটার') + '</th>';
        html += '<th>' + (L === 'en' ? 'Rent' : 'ভাড়া') + '</th>';
        html += '<th>' + (L === 'en' ? 'Service' : 'সার্ভিস') + '</th>';
        html += '<th>' + (L === 'en' ? 'Parking' : 'পার্কিং') + '</th>';
        html += '<th>' + (L === 'en' ? 'Total' : 'মোট') + '</th>';
        html += '<th>' + (L === 'en' ? 'Status' : 'স্ট্যাটাস') + '</th>';
        html += '<th>' + (L === 'en' ? 'Actions' : 'অ্যাকশন') + '</th>';
        html += '</tr></thead><tbody>';

        records.forEach(function(record) {
            var parts = record.month.split('-');
            var monthNames = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                              'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
            var monthName = monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0];
            
            var statusClass = record.status || 'pending';
            var statusText = statusClass === 'paid' ? (L === 'en' ? 'Paid ✅' : 'পরিশোধিত ✅') :
                             statusClass === 'pending' ? (L === 'en' ? 'Pending ⏳' : 'বাকি ⏳') :
                             (L === 'en' ? 'Overdue ⚠️' : 'অতিদিন ⚠️');

            var parkingDisplay = record.parkingCharge > 0 ? 
                '৳ ' + formatNumberWithComma(record.parkingCharge) + ' (' + (record.parkingTypeName || 'পার্কিং') + ')' : '—';

            html += '<tr>';
            html += '<td><strong>' + monthName + '</strong></td>';
            html += '<td>' + (record.meterName || 'N/A') + '</td>';
            html += '<td>৳ ' + formatNumberWithComma(record.rentAmount || 0) + '</td>';
            html += '<td>৳ ' + formatNumberWithComma(record.serviceCharge || 0) + '</td>';
            html += '<td>' + parkingDisplay + '</td>';
            html += '<td><strong>৳ ' + formatNumberWithComma(record.totalAmount || 0) + '</strong></td>';
            html += '<td><span class="rent-badge ' + statusClass + '">' + statusText + '</span></td>';
            html += '<td>';
            html += '<button class="btn btn-sm btn-warning" onclick="showRentForm(\'' + record.id + '\')" style="background: #f59e0b; color: #fff; margin-right: 4px;">✏️</button>';
            html += '<button class="btn btn-sm btn-danger" onclick="deleteRent(\'' + record.id + '\')">🗑️</button>';
            html += '</td>';
            html += '</tr>';
        });

        html += '</tbody></table></div>';
    } else {
        html += '<p style="text-align: center; padding: 30px; color: var(--text-light);">' + 
            (L === 'en' ? 'No rent records found. Click "Add Rent" to get started.' : 'কোন ভাড়া রেকর্ড পাওয়া যায়নি। "ভাড়া যোগ করুন" ক্লিক করে শুরু করুন।') + 
            '</p>';
    }

    html += '</div>';
    document.getElementById('pageContent').innerHTML = html;
}

// ============================================================
// ✅ রেন্ট ডিলিট করা
// ============================================================
function deleteRent(rentId) {
    var L = APP.language || 'bn';
    
    if (!confirm(L === 'en' ? 'Are you sure you want to delete this rent record?' : 'আপনি কি এই ভাড়া রেকর্ড ডিলিট করতে চান?')) {
        return;
    }
    
    if (!APP.rentData || !APP.rentData.records) return;
    
    var index = -1;
    for (var i = 0; i < APP.rentData.records.length; i++) {
        if (APP.rentData.records[i].id === rentId) {
            index = i;
            break;
        }
    }
    
    if (index === -1) {
        showToast(L === 'en' ? 'Record not found' : 'রেকর্ড পাওয়া যায়নি', 'error');
        return;
    }
    
    APP.rentData.records.splice(index, 1);
    updateRentTotals();
    
    if (typeof saveAllToCloud === 'function') {
        saveAllToCloud();
    }
    
    showToast(L === 'en' ? '✅ Rent record deleted!' : '✅ ভাড়া রেকর্ড ডিলিট করা হয়েছে!', 'success');
    showRentReport();
}

// ============================================================
// ✅ ড্যাশবোর্ডে রেন্ট উইজেট (কমা সহ)
// ============================================================
function renderRentWidget() {
    var L = APP.language || 'bn';
    
    if (!APP.rentData) {
        APP.rentData = { records: [], totalRent: 0, totalService: 0, totalParking: 0, totalOverall: 0 };
    }
    
    if (!APP.rentData.records || APP.rentData.records.length === 0) {
        return '<div class="rent-widget" style="background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); border-radius: 16px; padding: 16px 20px; margin-bottom: 20px; color: #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">' +
            '<div style="display: flex; align-items: center; gap: 10px;">' +
            '<div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">🏠</div>' +
            '<div><div style="font-size: 10px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px;">' + (L === 'en' ? 'Rent & Service' : 'ভাড়া ও সার্ভিস') + '</div>' +
            '<div style="font-size: 13px; opacity: 0.6;">' + (L === 'en' ? 'No records yet' : 'এখনও কোনো রেকর্ড নেই') + '</div></div></div>' +
            '<button onclick="showRentForm()" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; padding: 8px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); font-size: 12px;">' +
            '<i class="fas fa-plus"></i> ' + (L === 'en' ? 'Add' : 'যোগ') +
            '</button></div></div>';
    }

    updateRentTotals();

    var now = new Date();
    var currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    var currentRent = null;
    if (APP.activeMeterId) {
        currentRent = getCurrentMonthRent(APP.activeMeterId);
    }
    if (!currentRent && APP.rentData.records.length > 0) {
        currentRent = APP.rentData.records[APP.rentData.records.length - 1];
    }

    var totalAmount = currentRent ? currentRent.totalAmount : 0;

    var monthDisplay = currentRent ? currentRent.month : currentMonth;
    var parts = monthDisplay.split('-');
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var monthName = monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0];

    var meterDisplayName = currentRent ? currentRent.meterName : '';
    if (!meterDisplayName && currentRent) {
        var meter = APP.meters.find(function(m) { return m.id === currentRent.meterId; });
        if (meter) {
            meterDisplayName = getMeterDisplayName(meter);
        }
    }

    return '<div class="rent-widget" style="background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); border-radius: 16px; padding: 16px 20px; margin-bottom: 20px; color: #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06);">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">' +
        '<div style="display: flex; align-items: center; gap: 10px;">' +
        '<div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">🏠</div>' +
        '<div><div style="font-size: 10px; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px;">' + (L === 'en' ? 'Rent & Service' : 'ভাড়া ও সার্ভিস') + '</div>' +
        '<div style="font-size: 16px; font-weight: 700; color: #fbbf24;">৳ ' + formatNumberWithComma(totalAmount) + '</div>' +
        (meterDisplayName ? '<div style="font-size: 11px; opacity: 0.7;">' + meterDisplayName + ' - ' + monthName + '</div>' : '') +
        '</div></div>' +
        '<div style="display: flex; gap: 8px;">' +
        '<button onclick="showRentForm()" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: #fff; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); font-size: 12px;">' +
        '<i class="fas fa-plus"></i> ' + (L === 'en' ? 'Add' : 'যোগ') +
        '</button>' +
        '<button onclick="showRentReport()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-size: 12px; backdrop-filter: blur(4px);">' +
        '<i class="fas fa-list"></i> ' + (L === 'en' ? 'History' : 'ইতিহাস') +
        '</button>' +
        '</div></div></div>';
}