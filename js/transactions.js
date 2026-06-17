// ==================== TRANSACTIONS ====================

function showTransactions() {
    if (!APP.activeMeterId) {
        showToast(APP.language === 'en' ? 'Please add a meter first' : 'প্রথমে একটি মিটার যোগ করুন', 'warning');
        navigateTo('meters');
        return;
    }

    var L = APP.language;
    var dateLocale = L === 'en' ? 'en-US' : 'bn-BD';

    var meterData = getActiveMeterData();
    var transactions = (meterData.transactions || []).sort(function(a, b) {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
    });

    var today = new Date().toISOString().split('T')[0];

    document.getElementById('pageContent').innerHTML = `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
                <h2>${L==='en'?'Transaction Management':'ট্রানজেকশন ম্যানেজমেন্ট'}</h2>
                <button class="btn" onclick="showAddTransactionForm()">+ ${L==='en'?'New Transaction':'নতুন ট্রানজেকশন'}</button>
            </div>

            <!-- Quick Recharge & Balance Update Forms -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
                <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); border-radius: 12px; padding: 20px; box-shadow: var(--shadow);">
                    <h3 style="color: #2e7d32; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-size: 18px;">💰 ${L==='en'?'Monthly Recharge':'মাসিক রিচার্জ'}</h3>
                    <div class="form-group">
                        <label for="quickRechargeAmount" style="font-weight: 600; display: block; margin-bottom: 5px;">${L==='en'?'Recharge Amount':'রিচার্জের টাকার পরিমাণ'}</label>
                        <input type="number" class="form-control" id="quickRechargeAmount" placeholder="${L==='en'?'e.g. 500':'যেমন: 500'}" min="0" step="0.01" style="background: white;">
                    </div>
                    <div class="form-group">
                        <label for="quickRechargeDate" style="font-weight: 600; display: block; margin-bottom: 5px;">${L==='en'?'Select Date':'তারিখ নির্বাচন করুন'}</label>
                        <input type="date" class="form-control" id="quickRechargeDate" value="${today}" style="background: white;">
                    </div>
                    <button class="btn" onclick="addMonthlyRecharge()" style="background: linear-gradient(135deg, #43e97b, #38f9d7); color: #1a1a2e; font-weight: bold; width: 100%; font-size: 16px; padding: 12px;">➕ ${L==='en'?'Add Monthly Recharge':'মাসিক রিচার্জ যোগ করুন'}</button>
                    <div id="quickRechargeStatus" style="margin-top: 10px; font-weight: 500;"></div>
                </div>

                <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-radius: 12px; padding: 20px; box-shadow: var(--shadow);">
                    <h3 style="color: #1565c0; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-size: 18px;">⚖️ ${L==='en'?'Balance Update':'ব্যালেন্স আপডেট'}</h3>
                    <div class="form-group">
                        <label for="quickBalanceAmount" style="font-weight: 600; display: block; margin-bottom: 5px;">${L==='en'?'Enter New Balance':'নতুন ব্যালেন্স ইনপুট দিন'}</label>
                        <input type="number" class="form-control" id="quickBalanceAmount" placeholder="${L==='en'?'e.g. 1000':'যেমন: 1000'}" min="0" step="0.01" style="background: white;">
                    </div>
                    <div class="form-group">
                        <label for="quickBalanceDate" style="font-weight: 600; display: block; margin-bottom: 5px;">${L==='en'?'Select Date':'তারিখ নির্বাচন করুন'}</label>
                        <input type="date" class="form-control" id="quickBalanceDate" value="${today}" style="background: white;">
                    </div>
                    <button class="btn" onclick="updateBalance()" style="background: linear-gradient(135deg, #667eea, #764ba2); font-weight: bold; width: 100%; font-size: 16px; padding: 12px;">🔄 ${L==='en'?'Update Balance':'ব্যালেন্স আপডেট করুন'}</button>
                    <div id="quickBalanceStatus" style="margin-top: 10px; font-weight: 500;"></div>
                </div>
            </div>

            <h3 style="margin-bottom: 15px; color: var(--text); font-size: 18px;">📋 ${L==='en'?'All Transactions':'সব ট্রানজেকশন'}</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>${L==='en'?'Date':'তারিখ'}</th>
                            <th>${L==='en'?'Type':'ধরন'}</th>
                            <th>${L==='en'?'Amount':'পরিমাণ'}</th>
                            <th>${L==='en'?'Units':'ইউনিট'}</th>
                            <th>${L==='en'?'Balance':'ব্যালেন্স'}</th>
                            <th>${L==='en'?'Description':'বিবরণ'}</th>
                            <th>${L==='en'?'Actions':'অ্যাকশন'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${transactions.map(function(t) {
                            return `
                            <tr>
                                <td>${new Date(t.date || t.timestamp).toLocaleDateString(dateLocale)}</td>
                                <td><span class="badge ${t.type === 'recharge' ? 'badge-success' : 'badge-warning'}">${t.type === 'recharge' ? (L==='en'?'Recharge':'রিচার্জ') : (L==='en'?'Bill':'বিল')}</span></td>
                                <td>৳ ${(t.amount || 0).toFixed(2)}</td>
                                <td>${t.units ? t.units.toFixed(2) : '-'}</td>
                                <td>৳ ${(t.balanceAfter || 0).toFixed(2)}</td>
                                <td>${t.description || '-'}</td>
                                <td>
                                    <button class="btn btn-sm" onclick="editTransaction('${t.id}')">${L==='en'?'Edit':'এডিট'}</button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteTransaction('${t.id}')">${L==='en'?'Delete':'ডিলিট'}</button>
                                </td>
                            </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                ${transactions.length === 0 ? '<p style="text-align: center; padding: 20px; color: var(--text-light);">'+(L==='en'?'No transactions found':'কোন ট্রানজেকশন নেই')+'</p>' : ''}
            </div>
        </div>
    `;
}

function showAddTransactionForm(transactionId) {
    var L = APP.language;
    var meterData = getActiveMeterData();
    var transaction = null;
    
    if (transactionId) {
        var txs = meterData.transactions || [];
        for (var i = 0; i < txs.length; i++) {
            if (String(txs[i].id) === String(transactionId)) {
                transaction = txs[i];
                break;
            }
        }
    }
    
    var defaultDate = new Date().toISOString().split('T')[0];
    var transDate = defaultDate;
    if (transaction) {
        if (transaction.date) {
            transDate = transaction.date;
        } else if (transaction.timestamp) {
            try {
                transDate = new Date(transaction.timestamp).toISOString().split('T')[0];
            } catch(e) {
                transDate = defaultDate;
            }
        }
    }
    
    document.getElementById('modalContent').innerHTML = `
        <h2>${transaction ? (L==='en'?'Edit Transaction':'ট্রানজেকশন এডিট') : (L==='en'?'New Transaction':'নতুন ট্রানজেকশন')}</h2>
        <div class="form-group">
            <label>${L==='en'?'Type':'ধরন'}</label>
            <select class="form-control" id="transType">
                <option value="recharge" ${transaction && transaction.type === 'recharge' ? 'selected' : ''}>${L==='en'?'Recharge':'রিচার্জ'}</option>
                <option value="electricity_bill" ${transaction && (transaction.type === 'electricity_bill' || transaction.type === 'bill') ? 'selected' : ''}>${L==='en'?'Electricity Bill':'বিদ্যুৎ বিল'}</option>
            </select>
        </div>
        <div class="form-group">
            <label>${L==='en'?'Amount (Taka)':'পরিমাণ (টাকা)'}</label>
            <input type="number" class="form-control" id="transAmount" value="${transaction && transaction.amount ? transaction.amount : ''}" placeholder="${L==='en'?'Enter amount':'টাকার পরিমাণ'}" step="0.01">
        </div>
        <div class="form-group">
            <label>${L==='en'?'Units (optional)':'ইউনিট (ঐচ্ছিক)'}</label>
            <input type="number" class="form-control" id="transUnits" value="${transaction && transaction.units ? transaction.units : ''}" placeholder="${L==='en'?'Enter units':'ইউনিট সংখ্যা'}" step="0.01">
        </div>
        <div class="form-group">
            <label>${L==='en'?'Date':'তারিখ'}</label>
            <input type="date" class="form-control" id="transDate" value="${transDate}">
        </div>
        <div class="form-group">
            <label>${L==='en'?'Description (optional)':'বিবরণ (ঐচ্ছিক)'}</label>
            <input type="text" class="form-control" id="transDesc" value="${transaction && transaction.description ? transaction.description.replace(/"/g, '&quot;').replace(/'/g, '&#39;') : ''}" placeholder="${L==='en'?'Description':'বিবরণ'}">
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="btn" onclick="saveTransaction('${transactionId || ''}')">${L==='en'?'Save':'সংরক্ষণ'}</button>
            <button class="btn btn-outline" onclick="closeModal()">${L==='en'?'Cancel':'বাতিল'}</button>
        </div>
    `;
    document.getElementById('modal').classList.add('active');
}

function saveTransaction(transactionId) {
    var L = APP.language || 'bn';
    
    if (!APP.activeMeterId) {
        showToast(L === 'en' ? 'Please add a meter first' : 'প্রথমে একটি মিটার যোগ করুন', 'error');
        return;
    }

    var amount = parseFloat(document.getElementById('transAmount').value);
    var units = parseFloat(document.getElementById('transUnits').value) || 0;
    var type = document.getElementById('transType').value;
    var date = document.getElementById('transDate').value;
    var description = document.getElementById('transDesc').value;

    if (!amount || amount <= 0) {
        showToast(L === 'en' ? 'Please enter a valid amount' : 'সঠিক পরিমাণ লিখুন', 'error');
        return;
    }

    if (!date) {
        showToast(L === 'en' ? 'Please select a date' : 'তারিখ নির্বাচন করুন', 'error');
        return;
    }

    var meterData = getActiveMeterData();
    if (!meterData) {
        showToast(L === 'en' ? 'Meter data not found' : 'মিটার ডাটা পাওয়া যায়নি', 'error');
        return;
    }

    var currentBalance = meterData.currentBalance || 0;
    var totalRecharge = meterData.totalRecharge || 0;
    var totalExpended = meterData.totalExpended || 0;
    var transactions = meterData.transactions ? JSON.parse(JSON.stringify(meterData.transactions)) : [];

    // If editing, reverse old transaction
    if (transactionId) {
        var oldIndex = -1;
        for (var i = 0; i < transactions.length; i++) {
            if (String(transactions[i].id) === String(transactionId)) {
                oldIndex = i;
                break;
            }
        }
        if (oldIndex !== -1) {
            var oldTrans = transactions[oldIndex];
            if (oldTrans.type === 'recharge') {
                currentBalance -= oldTrans.amount;
                totalRecharge -= oldTrans.amount;
            } else {
                currentBalance += oldTrans.amount;
                totalExpended -= oldTrans.amount;
            }
            transactions.splice(oldIndex, 1);
        }
    }

    // Calculate new balance
    var balanceAfter;
    if (type === 'recharge') {
        balanceAfter = currentBalance + amount;
        totalRecharge += amount;
    } else {
        balanceAfter = currentBalance - amount;
        totalExpended += amount;
    }

    // Create transaction object
    var transaction = {
        id: transactionId || Date.now().toString(),
        meterId: APP.activeMeterId,
        type: type,
        amount: amount,
        units: units,
        balanceAfter: balanceAfter,
        date: date,
        description: description || (type === 'recharge' ? 
            (L === 'en' ? 'Recharge' : 'রিচার্জ') + ' - ' + amount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') : 
            (L === 'en' ? 'Electricity Bill' : 'বিদ্যুৎ বিল') + ' - ' + amount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা')),
        timestamp: new Date().toISOString()
    };

    // Add transaction
    transactions.push(transaction);

    // Update meter data
    var updatedData = {
        transactions: transactions,
        currentBalance: balanceAfter,
        totalRecharge: totalRecharge,
        totalExpended: totalExpended,
        meterInfo: meterData.meterInfo,
        monthlyRecharges: meterData.monthlyRecharges || [],
        lastDemandChargeMonth: meterData.lastDemandChargeMonth || "",
        initialBalance: meterData.initialBalance || 0,
        lastUpdated: new Date().toISOString()
    };

    updateActiveMeterData(updatedData);
    closeModal();
    
    // Recalculate balance
    recalculateBalance();
    
    // Log transaction activity
    var dateStr = new Date(date).toLocaleDateString(L === 'en' ? 'en-US' : 'bn-BD');
    if (type === 'recharge') {
        logActivity('recharge', (L === 'en' ? 'Recharge: ৳' : 'রিচার্জ: ৳') + amount.toFixed(2) + ' - ' + (L === 'en' ? 'Balance after: ৳' : 'ব্যালেন্স পর: ৳') + balanceAfter.toFixed(2) + ' - ' + dateStr);
    } else {
        logActivity('bill', (L === 'en' ? 'Bill paid: ৳' : 'বিল পরিশোধ: ৳') + amount.toFixed(2) + ' - ' + (L === 'en' ? 'Balance after: ৳' : 'ব্যালেন্স পর: ৳') + balanceAfter.toFixed(2) + ' - ' + dateStr);
    }
    
    // Check badges
    checkBadges();
    
    // Save to cloud
    if (typeof syncAllToCloud === 'function') {
        syncAllToCloud();
    }
    
    // Refresh transactions view
    showTransactions();
    showToast(L === 'en' ? 'Transaction saved successfully' : 'ট্রানজেকশন সফলভাবে সংরক্ষিত', 'success');
}

function editTransaction(transactionId) {
    showAddTransactionForm(transactionId);
}

function deleteTransaction(transactionId) {
    var L = APP.language;
    if (!confirm(L==='en'?'Are you sure you want to delete this transaction?':'আপনি কি নিশ্চিত এই ট্রানজেকশন ডিলিট করতে?')) {
        return;
    }

    var meterData = getActiveMeterData();
    if (!meterData) {
        showToast(L==='en'?'Meter data not found':'মিটার ডাটা পাওয়া যায়নি', 'error');
        return;
    }

    var transaction = null;
    var txs = meterData.transactions || [];
    for (var i = 0; i < txs.length; i++) {
        if (String(txs[i].id) === String(transactionId)) {
            transaction = txs[i];
            break;
        }
    }
    
    if (!transaction) {
        showToast(L==='en'?'Transaction not found':'ট্রানজেকশন পাওয়া যায়নি', 'error');
        return;
    }

    var currentBalance = meterData.currentBalance || 0;
    var totalRecharge = meterData.totalRecharge || 0;
    var totalExpended = meterData.totalExpended || 0;

    // Reverse the transaction effect
    if (transaction.type === 'recharge') {
        currentBalance -= transaction.amount;
        totalRecharge -= transaction.amount;
    } else {
        currentBalance += transaction.amount;
        totalExpended -= transaction.amount;
    }

    // Remove transaction
    var transactions = [];
    for (var i = 0; i < txs.length; i++) {
        if (txs[i].id !== transactionId) {
            transactions.push(txs[i]);
        }
    }

    // Update meter data
    var updatedData = {
        transactions: transactions,
        currentBalance: currentBalance,
        totalRecharge: totalRecharge,
        totalExpended: totalExpended,
        meterInfo: meterData.meterInfo,
        monthlyRecharges: meterData.monthlyRecharges || [],
        lastDemandChargeMonth: meterData.lastDemandChargeMonth || "",
        initialBalance: meterData.initialBalance || 0,
        lastUpdated: new Date().toISOString()
    };

    updateActiveMeterData(updatedData);
    
    // Recalculate balance
    recalculateBalance();
    
    // Save to cloud
    if (typeof syncAllToCloud === 'function') {
        syncAllToCloud();
    }
    
    showTransactions();
    showToast(L==='en'?'Transaction deleted':'ট্রানজেকশন ডিলিট করা হয়েছে', 'success');
}

// ==================== QUICK RECHARGE ====================
function recalculateBalance() {
    var meterData = getActiveMeterData();
    if (!meterData) return;
    
    var transactions = meterData.transactions || [];
    var vatRate = APP.settings.vatRate || 5;
    var rebateRate = APP.settings.rebateRate || 0.85;
    var demandCharge = APP.settings.demandCharge || 294;
    
    // Sort transactions by date (oldest first)
    var sorted = transactions.slice().sort(function(a, b) {
        var da = new Date(a.date || a.timestamp);
        var db = new Date(b.date || b.timestamp);
        return da - db;
    });
    
    // যদি transactions না থাকে, কিছু করি না
    if (sorted.length === 0) return;
    
    // Track which months already had demand charge
    var monthlyDC = {};
    
    // প্রথম রিচার্জের আগে ব্যালেন্স = initialBalance (সংরক্ষিত)
    var initialBalance = meterData.initialBalance;
    if (initialBalance === undefined || initialBalance === null) {
        // প্রথমবার: currentBalance থেকেই initialBalance বের করি
        var totalNet = 0;
        for (var i = 0; i < sorted.length; i++) {
            var t = sorted[i];
            if (t.type === 'recharge') {
                var d = new Date(t.date || t.timestamp);
                if (isNaN(d.getTime())) continue;
                var mk = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
                var dc = 0;
                if (!monthlyDC[mk]) { 
                    dc = demandCharge; 
                    monthlyDC[mk] = true; 
                }
                var net = t.amount - dc - (t.amount * vatRate/100) + (t.amount * rebateRate/100);
                totalNet += net;
            } else if (t.type === 'electricity_bill' || t.type === 'bill') {
                totalNet -= t.amount;
            }
        }
        initialBalance = Math.max(0, (meterData.currentBalance || 0) - totalNet);
    }
    
    // Recalculate from scratch using initialBalance
    // Reset monthlyDC
    for (var key in monthlyDC) {
        delete monthlyDC[key];
    }
    
    var balance = initialBalance;
    var totalRechargeAmount = 0;
    
    for (var i = 0; i < sorted.length; i++) {
        var t = sorted[i];
        if (t.type === 'recharge') {
            var d = new Date(t.date || t.timestamp);
            if (isNaN(d.getTime())) continue;
            var monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
            
            var dcAmount = 0;
            if (!monthlyDC[monthKey]) {
                dcAmount = demandCharge;
                monthlyDC[monthKey] = true;
                t.isFirstOfMonth = true;
            } else {
                t.isFirstOfMonth = false;
            }
            
            var vatDeduction = t.amount * (vatRate / 100);
            var rebateDeduction = t.amount * (rebateRate / 100);
            
            var netAmount = t.amount - dcAmount - vatDeduction + rebateDeduction;
            t.netCredit = netAmount;
            t.deductions = { demandCharge: dcAmount, vat: vatDeduction, rebate: rebateDeduction, netAmount: netAmount };
            
            balance += netAmount;
            totalRechargeAmount += t.amount;
            t.balanceAfter = balance;
        } else if (t.type === 'electricity_bill' || t.type === 'bill') {
            balance -= t.amount;
            t.balanceAfter = balance;
        }
    }
    
    // Save initialBalance for persistence
    meterData.initialBalance = initialBalance;
    meterData.currentBalance = Math.max(0, balance);
    meterData.totalRecharge = totalRechargeAmount;
    
    // Update the transactions with new balanceAfter values
    // But keep the original transaction objects
    updateActiveMeterData(meterData);
}

function addMonthlyRecharge() {
    var L = APP.language || 'bn';
    
    if (!APP.activeMeterId) {
        showToast(L === 'en' ? 'Please add a meter first' : 'প্রথমে একটি মিটার যোগ করুন', 'warning');
        navigateTo('meters');
        return;
    }

    var amount = parseFloat(document.getElementById('quickRechargeAmount').value);
    var date = document.getElementById('quickRechargeDate').value;

    if (!amount || amount <= 0) {
        document.getElementById('quickRechargeStatus').innerHTML = '❌ ' + (L === 'en' ? 'Please enter a valid amount!' : 'দয়া করে সঠিক টাকার পরিমাণ দিন!');
        document.getElementById('quickRechargeStatus').style.color = 'red';
        return;
    }
    if (!date) {
        document.getElementById('quickRechargeStatus').innerHTML = '❌ ' + (L === 'en' ? 'Please select a date!' : 'দয়া করে তারিখ নির্বাচন করুন!');
        document.getElementById('quickRechargeStatus').style.color = 'red';
        return;
    }

    var meterData = getActiveMeterData();
    if (!meterData) {
        showToast(L === 'en' ? 'Meter data not found' : 'মিটার ডাটা পাওয়া যায়নি', 'error');
        return;
    }

    var currentBalance = meterData.currentBalance || 0;
    var totalRecharge = meterData.totalRecharge || 0;
    var transactions = meterData.transactions ? JSON.parse(JSON.stringify(meterData.transactions)) : [];

    var vatRate = APP.settings.vatRate || 5;
    var rebateRate = APP.settings.rebateRate || 0.85;
    var demandCharge = APP.settings.demandCharge || 294;

    // Check if demand charge already applied this month
    var d = new Date(date);
    var monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    var hasDemandChargeThisMonth = false;
    for (var i = 0; i < transactions.length; i++) {
        var t = transactions[i];
        if (t.type !== 'recharge') continue;
        var td = new Date(t.date || t.timestamp);
        if (isNaN(td.getTime())) continue;
        var tk = td.getFullYear() + '-' + String(td.getMonth() + 1).padStart(2, '0');
        if (tk === monthKey && t.isFirstOfMonth === true) {
            hasDemandChargeThisMonth = true;
            break;
        }
    }

    // Calculate deductions
    var dcAmount = 0;
    if (!hasDemandChargeThisMonth) {
        dcAmount = demandCharge;
    }
    
    var vatDeduction = amount * (vatRate / 100);
    var rebateDeduction = amount * (rebateRate / 100);
    var netAmount = amount - dcAmount - vatDeduction + rebateDeduction;
    var balanceAfter = currentBalance + netAmount;
    totalRecharge += amount;

    var descriptionParts = [];
    descriptionParts.push((L === 'en' ? 'Monthly Recharge' : 'মাসিক রিচার্জ') + ' - ' + amount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা'));
    if (dcAmount > 0) {
        descriptionParts.push((L === 'en' ? 'Demand Charge' : 'ডিমান্ড চার্জ') + ': ' + dcAmount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা'));
    } else {
        descriptionParts.push((L === 'en' ? 'Demand Charge' : 'ডিমান্ড চার্জ') + ': 0.00 (Already deducted)');
    }
    descriptionParts.push((L === 'en' ? 'VAT' : 'ভ্যাট') + ': ' + vatDeduction.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা'));
    descriptionParts.push((L === 'en' ? 'Rebate' : 'রিবেট') + ': ' + rebateDeduction.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') + ' (' + (L === 'en' ? 'Discount' : 'ছাড়') + ')');
    descriptionParts.push((L === 'en' ? 'Net' : 'নেট') + ': ' + netAmount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা'));

    var transaction = {
        id: 'recharge_' + Date.now().toString(),
        meterId: APP.activeMeterId,
        type: 'recharge',
        amount: amount,
        units: 0,
        balanceAfter: balanceAfter,
        date: date,
        isFirstOfMonth: !hasDemandChargeThisMonth,
        deductions: { demandCharge: dcAmount, vat: vatDeduction, rebate: rebateDeduction, netAmount: netAmount },
        description: descriptionParts.join(' | '),
        timestamp: new Date().toISOString()
    };

    transactions.push(transaction);

    var updatedData = {
        transactions: transactions,
        currentBalance: balanceAfter,
        totalRecharge: totalRecharge,
        totalExpended: meterData.totalExpended || 0,
        meterInfo: meterData.meterInfo,
        monthlyRecharges: meterData.monthlyRecharges || [],
        lastDemandChargeMonth: meterData.lastDemandChargeMonth || "",
        initialBalance: meterData.initialBalance || 0,
        lastUpdated: new Date().toISOString()
    };

    updateActiveMeterData(updatedData);
    
    document.getElementById('quickRechargeAmount').value = '';
    var detailsHtml = '✅ ' + (L === 'en' ? 'Recharge' : 'রিচার্জ') + ': ' + amount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') +
        (dcAmount > 0 ? '<br>⚡ ' + (L === 'en' ? 'Demand Charge' : 'ডিমান্ড চার্জ') + ': ' + dcAmount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') : '') +
        '<br>🧾 ' + (L === 'en' ? 'VAT' : 'ভ্যাট') + ': ' + vatDeduction.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') +
        '<br>💰 ' + (L === 'en' ? 'Rebate' : 'রিবেট') + ': ' + rebateDeduction.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') +
        '<br>📊 ' + (L === 'en' ? 'Net' : 'নেট') + ': ' + netAmount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') +
        '<br>📅 ' + (L === 'en' ? 'New Balance' : 'নতুন ব্যালেন্স') + ': ' + balanceAfter.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা');
    
    document.getElementById('quickRechargeStatus').innerHTML = detailsHtml;
    document.getElementById('quickRechargeStatus').style.color = '#2e7d32';
    
    // Log recharge activity
    logActivity('recharge', (L === 'en' ? 'Monthly Recharge: ৳' : 'মাসিক রিচার্জ: ৳') + amount.toFixed(2) + ' | ' + (L === 'en' ? 'Net' : 'নেট') + ': ৳' + netAmount.toFixed(2) + ' | ' + (L === 'en' ? 'Balance after' : 'ব্যালেন্স পর') + ': ৳' + balanceAfter.toFixed(2));
    
    // Check badges
    checkBadges();
    
    // Save to cloud
    if (typeof syncAllToCloud === 'function') {
        syncAllToCloud();
    }
    
    showToast((L === 'en' ? '✅ Recharge added: ' : '✅ রিচার্জ হয়েছে: ') + amount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') + ', ' + (L === 'en' ? 'Net' : 'নেট') + ': ' + netAmount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা'), 'success');
    
    // Recalculate all balances
    recalculateBalance();
    showTransactions();
}

// ==================== QUICK BALANCE UPDATE ====================
function updateBalance() {
    var L = APP.language || 'bn';
    
    if (!APP.activeMeterId) {
        showToast(L === 'en' ? 'Please add a meter first' : 'প্রথমে একটি মিটার যোগ করুন', 'warning');
        navigateTo('meters');
        return;
    }

    var amount = parseFloat(document.getElementById('quickBalanceAmount').value);
    var date = document.getElementById('quickBalanceDate').value;

    if (isNaN(amount) || amount === undefined || amount === null) {
        document.getElementById('quickBalanceStatus').innerHTML = '❌ ' + (L === 'en' ? 'Please enter a valid balance!' : 'দয়া করে সঠিক ব্যালেন্স ইনপুট দিন!');
        document.getElementById('quickBalanceStatus').style.color = 'red';
        return;
    }
    if (!date) {
        document.getElementById('quickBalanceStatus').innerHTML = '❌ ' + (L === 'en' ? 'Please select a date!' : 'দয়া করে তারিখ নির্বাচন করুন!');
        document.getElementById('quickBalanceStatus').style.color = 'red';
        return;
    }

    var meterData = getActiveMeterData();
    if (!meterData) {
        showToast(L === 'en' ? 'Meter data not found' : 'মিটার ডাটা পাওয়া যায়নি', 'error');
        return;
    }

    var currentBalance = meterData.currentBalance || 0;
    var transactions = meterData.transactions ? JSON.parse(JSON.stringify(meterData.transactions)) : [];

    var transactionType, balanceAfter, description, diffAmount;

    if (amount >= currentBalance) {
        // Balance increase = recharge
        var rechargeAmount = amount - currentBalance;
        transactionType = 'recharge';
        balanceAfter = amount;
        diffAmount = rechargeAmount;
        description = (L === 'en' ? 'Balance Update (Recharge)' : 'ব্যালেন্স আপডেট (রিচার্জ)') + ' - ' + rechargeAmount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') + ' - ' + (L === 'en' ? 'New Balance' : 'নতুন ব্যালেন্স') + ': ' + amount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা');
        
        var transaction = {
            id: 'balance_update_' + Date.now().toString(),
            meterId: APP.activeMeterId,
            type: 'recharge',
            amount: rechargeAmount,
            units: 0,
            balanceAfter: balanceAfter,
            date: date,
            description: description,
            timestamp: new Date().toISOString()
        };
        transactions.push(transaction);
        
        var updatedData = {
            transactions: transactions,
            currentBalance: amount,
            totalRecharge: (meterData.totalRecharge || 0) + rechargeAmount,
            totalExpended: meterData.totalExpended || 0,
            meterInfo: meterData.meterInfo,
            monthlyRecharges: meterData.monthlyRecharges || [],
            lastDemandChargeMonth: meterData.lastDemandChargeMonth || "",
            initialBalance: meterData.initialBalance || 0,
            lastUpdated: new Date().toISOString()
        };
        updateActiveMeterData(updatedData);
        
    } else {
        // Balance decrease = expense
        var spentAmount = currentBalance - amount;
        transactionType = 'electricity_bill';
        balanceAfter = amount;
        diffAmount = spentAmount;
        description = (L === 'en' ? 'Balance Update (Expense)' : 'ব্যালেন্স আপডেট (খরচ)') + ' - ' + spentAmount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') + ' - ' + (L === 'en' ? 'New Balance' : 'নতুন ব্যালেন্স') + ': ' + amount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা');
        
        var transaction = {
            id: 'balance_update_' + Date.now().toString(),
            meterId: APP.activeMeterId,
            type: 'electricity_bill',
            amount: spentAmount,
            units: 0,
            balanceAfter: balanceAfter,
            date: date,
            description: description,
            timestamp: new Date().toISOString()
        };
        transactions.push(transaction);
        
        var updatedData = {
            transactions: transactions,
            currentBalance: amount,
            totalRecharge: meterData.totalRecharge || 0,
            totalExpended: (meterData.totalExpended || 0) + spentAmount,
            meterInfo: meterData.meterInfo,
            monthlyRecharges: meterData.monthlyRecharges || [],
            lastDemandChargeMonth: meterData.lastDemandChargeMonth || "",
            initialBalance: meterData.initialBalance || 0,
            lastUpdated: new Date().toISOString()
        };
        updateActiveMeterData(updatedData);
    }

    document.getElementById('quickBalanceAmount').value = '';
    document.getElementById('quickBalanceStatus').innerHTML = '✅ ' + (L === 'en' ? 'Balance updated' : 'ব্যালেন্স আপডেট হয়েছে') + ': ' + amount.toFixed(2) + ' ' + (L === 'en' ? 'Taka' : 'টাকা') + ', ' + (L === 'en' ? 'Date' : 'তারিখ') + ': ' + new Date(date).toLocaleDateString(L === 'en' ? 'en-US' : 'bn-BD');
    document.getElementById('quickBalanceStatus').style.color = '#1565c0';
    
    // Log balance update activity
    var logType = amount >= currentBalance ? 'recharge' : 'bill';
    var logAction = amount >= currentBalance ? 
        (L === 'en' ? 'Balance Update (Recharge)' : 'ব্যালেন্স আপডেট (রিচার্জ)') : 
        (L === 'en' ? 'Balance Update (Expense)' : 'ব্যালেন্স আপডেট (খরচ)');
    logActivity(logType, logAction + ': ৳' + diffAmount.toFixed(2) + ' - ' + (L === 'en' ? 'New Balance' : 'নতুন ব্যালেন্স') + ': ৳' + amount.toFixed(2) + ' - ' + new Date(date).toLocaleDateString(L === 'en' ? 'en-US' : 'bn-BD'));
    
    // Check badges
    checkBadges();
    
    // Save to cloud
    if (typeof syncAllToCloud === 'function') {
        syncAllToCloud();
    }
    
    showToast('✅ ' + (L === 'en' ? 'Balance updated successfully' : 'ব্যালেন্স সফলভাবে আপডেট হয়েছে'), 'success');
    showTransactions();
}