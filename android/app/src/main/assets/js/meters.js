// ==================== METER MANAGEMENT ====================
function showMeterManagement() {
    var L = APP.language;
    document.getElementById('pageContent').innerHTML = [
        '<div class="card">',
            '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">',
                '<h2>'+(L==='en'?'Meter Management':'মিটার ম্যানেজমেন্ট')+'</h2>',
                '<button class="btn" onclick="showAddMeterForm()">+ '+(L==='en'?'New Meter':'নতুন মিটার')+'</button>',
            '</div>',
            '<div class="table-container" style="margin-top: 20px;">',
                '<table><thead><tr>',
                    '<th>'+(L==='en'?'Name':'নাম')+'</th>',
                    '<th>'+(L==='en'?'Meter No':'মিটার নং')+'</th>',
                    '<th>'+(L==='en'?'Account No':'অ্যাকাউন্ট নং')+'</th>',
                    '<th>'+(L==='en'?'Address':'ঠিকানা')+'</th>',
                    '<th>'+(L==='en'?'Phone':'ফোন')+'</th>',
                    '<th>'+(L==='en'?'Balance':'ব্যালেন্স')+'</th>',
                    '<th>'+(L==='en'?'Actions':'অ্যাকশন')+'</th>',
                '</tr></thead><tbody>',
                (APP.meters.length > 0 ? APP.meters.map(function(m) {
                    return '<tr>'+
                        '<td><strong>'+escapeHtml(m.name)+'</strong></td>'+
                        '<td>'+(m.meterNumber || m.meterNo || '-')+'</td>'+
                        '<td>'+(m.accountNumber || m.accountNo || '-')+'</td>'+
                        '<td>'+(m.address || '-')+'</td>'+
                        '<td>'+(m.phone || '-')+'</td>'+
                        '<td><strong>৳ '+calculateBalance(m.id).toFixed(2)+'</strong></td>'+
                        '<td>'+
                            '<button class="btn btn-sm" onclick="editMeter(\''+m.id+'\')">&#x270F;&#xFE0F; '+(L==='en'?'Edit':'এডিট')+'</button> '+
                            '<button class="btn btn-sm" onclick="switchToMeter(\''+m.id+'\')">&#x1F504; '+(L==='en'?'Switch':'সুইচ')+'</button> '+
                            '<button class="btn btn-sm btn-danger" onclick="deleteMeter(\''+m.id+'\')">&#x1F5D1;&#xFE0F; '+(L==='en'?'Delete':'ডিলিট')+'</button>'+
                        '</td>'+
                    '</tr>';
                }).join('') :
                '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-light);">'+
                    '<p>'+(L==='en'?'No meters found':'কোন মিটার নেই')+'</p>'+
                    '<button class="btn btn-sm" onclick="showAddMeterForm()">+ '+(L==='en'?'Add New Meter':'নতুন মিটার যোগ করুন')+'</button>'+
                '</td></tr>'),
                '</tbody></table>',
            '</div>',
        '</div>',
    ].join('');
}

function showAddMeterForm(meterId) {
    var L = APP.language;
    var meter = meterId ? APP.meters.find(function(m) { return m.id === meterId; }) : null;
    
    document.getElementById('modalContent').innerHTML = [
        '<h2>'+(meter ? (L==='en'?'Edit Meter':'মিটার এডিট') : (L==='en'?'Add New Meter':'নতুন মিটার যোগ'))+'</h2>',
        '<div class="form-group">',
            '<label>'+(L==='en'?'Meter Name *':'মিটারের নাম *')+'</label>',
            '<input type="text" class="form-control" id="meterName" value="'+(meter?.name || '')+'" placeholder="'+(L==='en'?'e.g. Home Meter':'যেমন: বাড়ির মিটার')+'">',
        '</div>',
        '<div class="form-group">',
            '<label>'+(L==='en'?'Meter Number *':'মিটার নম্বর *')+'</label>',
            '<input type="text" class="form-control" id="meterNumber" value="'+(meter?.meterNumber || meter?.meterNo || '')+'" placeholder="'+(L==='en'?'e.g. 123456':'যেমন: ১২৩৪৫৬')+'">',
        '</div>',
        '<div class="form-group">',
            '<label>'+(L==='en'?'Account Number':'অ্যাকাউন্ট নম্বর')+'</label>',
            '<input type="text" class="form-control" id="accountNumber" value="'+(meter?.accountNumber || meter?.accountNo || '')+'" placeholder="'+(L==='en'?'e.g. 41495666':'যেমন: ৪১৪৯৫৬৬৬')+'">',
        '</div>',
        '<div class="form-group">',
            '<label>'+(L==='en'?'Address':'ঠিকানা')+'</label>',
            '<input type="text" class="form-control" id="address" value="'+(meter?.address || '')+'" placeholder="'+(L==='en'?'Enter address':'ঠিকানা লিখুন')+'">',
        '</div>',
        '<div class="form-group">',
            '<label>'+(L==='en'?'Phone Number':'ফোন নম্বর')+'</label>',
            '<input type="tel" class="form-control" id="phone" value="'+(meter?.phone || '')+'" placeholder="'+(L==='en'?'e.g. +8801XXXXXXXXX':'যেমন: +৮৮০১XXX-XXXXXX')+'">',
        '</div>',
        '<small style="color: var(--text-light);">* '+(L==='en'?'Required fields':'চিহ্নিত ফিল্ড আবশ্যক')+'</small>',
        '<div style="display: flex; gap: 10px; margin-top: 20px;">',
            '<button class="btn" onclick="saveMeter(\''+(meterId || '')+'\')">'+(L==='en'?'Save':'সংরক্ষণ')+'</button>',
            '<button class="btn btn-outline" onclick="closeModal()">'+(L==='en'?'Cancel':'বাতিল')+'</button>',
        '</div>',
    ].join('');
    document.getElementById('modal').classList.add('active');
}

function saveMeter(meterId) {
    var L = APP.language;
    var name = document.getElementById('meterName').value.trim();
    var meterNumber = document.getElementById('meterNumber').value.trim();
    var accountNumber = document.getElementById('accountNumber').value.trim();
    var address = document.getElementById('address').value.trim();
    var phone = document.getElementById('phone').value.trim();

    if (!name) { showToast(L==='en'?'Enter meter name':'মিটারের নাম লিখুন', 'error'); return; }
    if (!meterNumber) { showToast(L==='en'?'Enter meter number':'মিটার নম্বর লিখুন', 'error'); return; }

    var duplicate = APP.meters.find(function(m) { 
        return (m.meterNumber === meterNumber || m.meterNo === meterNumber) && m.id !== meterId; 
    });
    if (duplicate) { showToast(L==='en'?'This meter number already exists':'এই মিটার নম্বর ইতিমধ্যে আছে', 'error'); return; }

    var meterData = {
        id: meterId || 'meter_' + Date.now().toString(),
        name: name,
        meterNumber: meterNumber,
        meterNo: meterNumber,
        accountNumber: accountNumber,
        accountNo: accountNumber,
        address: address,
        phone: phone
    };

    if (meterId) {
        var index = APP.meters.findIndex(function(m) { return m.id === meterId; });
        if (index !== -1) {
            APP.meters[index] = meterData;
            if (APP.metersData[meterId]) {
                APP.metersData[meterId].meterInfo = meterData;
            }
        }
        showToast(L==='en'?'Meter updated':'মিটার আপডেট করা হয়েছে', 'success');
    } else {
        APP.meters.push(meterData);
        APP.metersData[meterData.id] = {
            transactions: [],
            monthlyRecharges: [],
            currentBalance: 0,
            totalRecharge: 0,
            totalExpended: 0,
            lastDemandChargeMonth: "",
            settings: { ...APP.settings },
            tariffRates: [...APP.tariffRates],
            meterInfo: meterData,
            lastUpdated: new Date().toISOString()
        };
        if (!APP.activeMeterId) { APP.activeMeterId = meterData.id; }
        showToast(L==='en'?'New meter added':'নতুন মিটার যোগ করা হয়েছে', 'success');
    }

    saveData();
    closeModal();
    showMeterManagement();
}

function editMeter(meterId) { showAddMeterForm(meterId); }

function switchToMeter(meterId) {
    var L = APP.language;
    if (APP.activeMeterId === meterId) {
        showToast(L==='en'?'This meter is already selected':'এই মিটারটি ইতিমধ্যে সিলেক্ট করা আছে', 'warning');
        return;
    }
    APP.activeMeterId = meterId;
    saveData();
    showToast(L==='en'?'Meter switched':'মিটার সুইচ করা হয়েছে', 'success');
    navigateTo('dashboard');
}

function deleteMeter(meterId) {
    var L = APP.language;
    var meter = APP.meters.find(function(m) { return m.id === meterId; });
    if (!meter) return;
    var meterData = APP.metersData[meterId];
    var transactionCount = meterData?.transactions?.length || 0;
    
    var confirmMessage = L==='en' ? 'Are you sure you want to delete "'+meter.name+'"?': 'আপনি কি নিশ্চিত "'+meter.name+'" মিটারটি ডিলিট করতে চান?';
    if (transactionCount > 0) {
        confirmMessage += '\n\n' + (L==='en' ? transactionCount+' transactions will also be deleted!' : 'এই মিটারের '+transactionCount+'টি ট্রানজেকশনও ডিলিট হবে!');
    }
    
    if (!confirm(confirmMessage)) return;
    
    APP.meters = APP.meters.filter(function(m) { return m.id !== meterId; });
    delete APP.metersData[meterId];
    if (APP.activeMeterId === meterId) {
        APP.activeMeterId = APP.meters.length > 0 ? APP.meters[0].id : null;
    }
    saveData();
    showMeterManagement();
    showToast(L==='en'?'Meter deleted':'মিটার ডিলিট করা হয়েছে', 'success');
}
