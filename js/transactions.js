// ==================== TRANSACTIONS ====================
function showTransactions() {
    if (!APP.activeMeterId) {
        showToast(APP.language === 'en' ? 'Please add a meter first' : 'প্রথমে একটি মিটার যোগ করুন', 'warning');
        navigateTo('meters');
        return;
    }

    var L = APP.language;
    var dateLocale = L === 'en' ? 'en-US' : 'bn-BD';

    const meterData = getActiveMeterData();
    const transactions = (meterData.transactions || []).sort((a, b) => {
        return new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp);
    });

        const today = new Date().toISOString().split('T')[0];

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
                        ${transactions.map(t => `
                            <tr>
                                <td>${new Date(t.date || t.timestamp).toLocaleDateString(dateLocale)}</td>
                                <td><span class="badge ${t.type === 'recharge' ? 'badge-success' : 'badge-warning'}">${t.type === 'recharge' ? (L==='en'?'Recharge':'রিচার্জ') : (L==='en'?'Bill':'বিল')}</span></td>
                                <td>৳ ${t.amount.toFixed(2)}</td>
                                <td>${t.units ? t.units.toFixed(2) : '-'}</td>
                                <td>৳ ${(t.balanceAfter || 0).toFixed(2)}</td>
                                <td>${t.description || '-'}</td>
                                <td>
                                    <button class="btn btn-sm" onclick="editTransaction('${t.id}')">${L==='en'?'Edit':'এডিট'}</button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteTransaction('${t.id}')">${L==='en'?'Delete':'ডিলিট'}</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${transactions.length === 0 ? '<p style="text-align: center; padding: 20px; color: var(--text-light);">'+(L==='en'?'No transactions found':'কোন ট্রানজেকশন নেই')+'</p>' : ''}
            </div>
        </div>
    `;
}

function showAddTransactionForm(transactionId) {
    var L = APP.language;
    const meterData = getActiveMeterData();
    const transaction = transactionId ? 
        (meterData.transactions || []).find(t => String(t.id) === String(transactionId)) : null;
    
    document.getElementById('modalContent').innerHTML = `
        <h2>${transaction ? (L==='en'?'Edit Transaction':'ট্রানজেকশন এডিট') : (L==='en'?'New Transaction':'নতুন ট্রানজেকশন')}</h2>
        <div class="form-group">
            <label>${L==='en'?'Type':'ধরন'}</label>
            <select class="form-control" id="transType">
                <option value="recharge" ${transaction?.type === 'recharge' ? 'selected' : ''}>${L==='en'?'Recharge':'রিচার্জ'}</option>
                <option value="electricity_bill" ${transaction?.type === 'electricity_bill' || transaction?.type === 'bill' ? 'selected' : ''}>${L==='en'?'Electricity Bill':'বিদ্যুৎ বিল'}</option>
            </select>
        </div>
        <div class="form-group">
            <label>${L==='en'?'Amount (Taka)':'পরিমাণ (টাকা)'}</label>
            <input type="number" class="form-control" id="transAmount" value="${transaction?.amount || ''}" placeholder="${L==='en'?'Enter amount':'টাকার পরিমাণ'}" step="0.01">
        </div>
        <div class="form-group">
            <label>${L==='en'?'Units (optional)':'ইউনিট (ঐচ্ছিক)'}</label>
            <input type="number" class="form-control" id="transUnits" value="${transaction?.units || ''}" placeholder="${L==='en'?'Enter units':'ইউনিট সংখ্যা'}" step="0.01">
        </div>
                <div class="form-group">
                    <label>${L==='en'?'Date':'তারিখ'}</label>
                    <input type="date" class="form-control" id="transDate" value="${transaction ? (transaction.date || (() => { try { return new Date(transaction.timestamp).toISOString().split('T')[0]; } catch(e) { return new Date().toISOString().split('T')[0]; } })() || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
            <label>${L==='en'?'Description (optional)':'বিবরণ (ঐচ্ছিক)'}</label>
            <input type="text" class="form-control" id="transDesc" value="${transaction ? transaction.description?.replace(/"/g, '&quot;')?.replace(/'/g, '&#39;') || '' : ''}" placeholder="${L==='en'?'Description':'বিবরণ'}">
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button class="btn" onclick="saveTransaction('${transactionId || ''}')">${L==='en'?'Save':'সংরক্ষণ'}</button>
            <button class="btn btn-outline" onclick="closeModal()">${L==='en'?'Cancel':'বাতিল'}</button>
        </div>
    `;
    document.getElementById('modal').classList.add('active');
}

function saveTransaction(transactionId) {
    if (!APP.activeMeterId) {
        showToast('প্রথমে একটি মিটার যোগ করুন', 'error');
        return;
    }

    const amount = parseFloat(document.getElementById('transAmount').value);
    const units = parseFloat(document.getElementById('transUnits').value) || 0;
    const type = document.getElementById('transType').value;
    const date = document.getElementById('transDate').value;
    const description = document.getElementById('transDesc').value;

    if (!amount || amount <= 0) {
        showToast('সঠিক পরিমাণ লিখুন', 'error');
        return;
    }

    if (!date) {
        showToast('তারিখ নির্বাচন করুন', 'error');
        return;
    }

    const meterData = getActiveMeterData();
    let currentBalance = meterData.currentBalance || 0;
    let totalRecharge = meterData.totalRecharge || 0;
    let totalExpended = meterData.totalExpended || 0;
    let transactions = [...(meterData.transactions || [])];

    // If editing, reverse old transaction
    if (transactionId) {
        const oldIndex = transactions.findIndex(t => String(t.id) === String(transactionId));
        if (oldIndex !== -1) {
            const oldTrans = transactions[oldIndex];
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
    let balanceAfter;
    if (type === 'recharge') {
        balanceAfter = currentBalance + amount;
        totalRecharge += amount;
    } else {
        balanceAfter = currentBalance - amount;
        totalExpended += amount;
    }

    // Create transaction object
    const transaction = {
        id: transactionId || Date.now().toString(),
        meterId: APP.activeMeterId,
        type: type,
        amount: amount,
        units: units,
        balanceAfter: balanceAfter,
        date: date,
        description: description || `${type === 'recharge' ? 'রিচার্জ' : 'বিদ্যুৎ বিল'} - ${amount} টাকা${units ? ` (${units.toFixed(2)} kWh)` : ''} - ${new Date(date).toLocaleDateString('bn-BD')}`,
        timestamp: new Date().toLocaleString('bn-BD')
    };

    // Add transaction
    transactions.push(transaction);

    // Update meter data
    const updatedData = {
        ...meterData,
        transactions: transactions,
        currentBalance: balanceAfter,
        totalRecharge: totalRecharge,
        totalExpended: totalExpended
    };

                updateActiveMeterData(updatedData);
        closeModal();
        
        // Recalculate balance
        recalculateBalance();
        
        showTransactions();
        showToast(L==='en'?'Transaction saved successfully':'ট্রানজেকশন সফলভাবে সংরক্ষিত', 'success');
    
        // Log transaction activity
        const locale = APP.language === 'en' ? 'en-US' : 'bn-BD';
        const dateStr = new Date(date).toLocaleDateString(locale);
        if (type === 'recharge') {
            logActivity('recharge', (APP.language === 'en' ? 'Recharge: ৳' : 'রিচার্জ: ৳') + amount.toFixed(2) + ' - ' + (APP.language === 'en' ? 'Balance after: ৳' : 'ব্যালেন্স পর: ৳') + balanceAfter.toFixed(2) + ' - ' + dateStr);
        } else {
            logActivity('bill', (APP.language === 'en' ? 'Bill paid: ৳' : 'বিল পরিশোধ: ৳') + amount.toFixed(2) + ' - ' + (APP.language === 'en' ? 'Balance after: ৳' : 'ব্যালেন্স পর: ৳') + balanceAfter.toFixed(2) + ' - ' + dateStr);
        }
    
        checkBadges();
}

function editTransaction(transactionId) {
    showAddTransactionForm(transactionId);
}

function deleteTransaction(transactionId) {
    var L = APP.language;
    if (!confirm(L==='en'?'Are you sure you want to delete this transaction?':'আপনি কি নিশ্চিত এই ট্রানজেকশন ডিলিট করতে?')) {
        return;
    }

    const meterData = getActiveMeterData();
    const transaction = (meterData.transactions || []).find(t => String(t.id) === String(transactionId));
    
    if (!transaction) {
        showToast(L==='en'?'Transaction not found':'ট্রানজেকশন পাওয়া যায়নি', 'error');
        return;
    }

    let currentBalance = meterData.currentBalance || 0;
    let totalRecharge = meterData.totalRecharge || 0;
    let totalExpended = meterData.totalExpended || 0;

    // Reverse the transaction effect
    if (transaction.type === 'recharge') {
        currentBalance -= transaction.amount;
        totalRecharge -= transaction.amount;
    } else {
        currentBalance += transaction.amount;
        totalExpended -= transaction.amount;
    }

    // Remove transaction
    const transactions = meterData.transactions.filter(t => t.id !== transactionId);

    // Update meter data
    const updatedData = {
        ...meterData,
        transactions: transactions,
        currentBalance: currentBalance,
        totalRecharge: totalRecharge,
        totalExpended: totalExpended
    };

        updateActiveMeterData(updatedData);
    
    // Recalculate balance
    recalculateBalance();
    
    showTransactions();
    showToast(L==='en'?'Transaction deleted':'ট্রানজেকশন ডিলিট করা হয়েছে', 'success');
}

// ==================== QUICK RECHARGE ====================
function recalculateBalance() {
    const meterData = getActiveMeterData();
    if (!meterData) return;
    
    const transactions = meterData.transactions || [];
    const vatRate = APP.settings.vatRate || 5;
    const rebateRate = APP.settings.rebateRate || 0.85;
    const demandCharge = APP.settings.demandCharge || 294;
    
    // Sort transactions by date (oldest first)
    const sorted = [...transactions].sort((a, b) => {
        const da = new Date(a.date || a.timestamp);
        const db = new Date(b.date || b.timestamp);
        return da - db;
    });
    
    // যদি transactions না থাকে, কিছু করি না
    if (sorted.length === 0) return;
    
    // Track which months already had demand charge
    const monthlyDC = {};
    
    // প্রথম রিচার্জের আগে ব্যালেন্স = initialBalance (সংরক্ষিত)
    // যদি না থাকে, currentBalance থেকে বের করি
    let initialBalance = meterData.initialBalance;
    if (initialBalance === undefined || initialBalance === null) {
        // প্রথমবার: currentBalance থেকেই initialBalance বের করি
        let totalNet = 0;
        sorted.forEach(t => {
            if (t.type === 'recharge') {
                const d = new Date(t.date || t.timestamp);
                if (isNaN(d.getTime())) return;
                const mk = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
                let dc = 0;
                if (!monthlyDC[mk]) { dc = demandCharge; monthlyDC[mk] = true; }
                const net = t.amount - dc - (t.amount * vatRate/100) + (t.amount * rebateRate/100);
                totalNet += net;
            } else if (t.type === 'electricity_bill' || t.type === 'bill') {
                totalNet -= t.amount;
            }
        });
        initialBalance = Math.max(0, (meterData.currentBalance || 0) - totalNet);
    }
    
    // Recalculate from scratch using initialBalance
    // Reset monthlyDC
    Object.keys(monthlyDC).forEach(k => delete monthlyDC[k]);
    
    let balance = initialBalance;
    let totalRechargeAmount = 0;
    
    sorted.forEach(t => {
        if (t.type === 'recharge') {
            const d = new Date(t.date || t.timestamp);
            if (isNaN(d.getTime())) return;
            const monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
            
            let dcAmount = 0;
            if (!monthlyDC[monthKey]) {
                dcAmount = demandCharge;
                monthlyDC[monthKey] = true;
                t.isFirstOfMonth = true;
            } else {
                t.isFirstOfMonth = false;
            }
            
            const vatDeduction = t.amount * (vatRate / 100);
            const rebateDeduction = t.amount * (rebateRate / 100);
            
                        const netAmount = t.amount - dcAmount - vatDeduction + rebateDeduction;
            t.netCredit = netAmount;
            t.deductions = { demandCharge: dcAmount, vat: vatDeduction, rebate: rebateDeduction, netAmount: netAmount };
            
            balance += netAmount;
            totalRechargeAmount += t.amount;
            t.balanceAfter = balance;
        } else if (t.type === 'electricity_bill' || t.type === 'bill') {
            balance -= t.amount;
            t.balanceAfter = balance;
        }
    });
    
    // Save initialBalance for persistence
    meterData.initialBalance = initialBalance;
    meterData.currentBalance = Math.max(0, balance);
    meterData.totalRecharge = totalRechargeAmount;
    updateActiveMeterData(meterData);
}

function addMonthlyRecharge() {
    if (!APP.activeMeterId) {
        showToast('প্রথমে একটি মিটার যোগ করুন', 'warning');
        navigateTo('meters');
        return;
    }

    const amount = parseFloat(document.getElementById('quickRechargeAmount').value);
    const date = document.getElementById('quickRechargeDate').value;

    if (!amount || amount <= 0) {
        document.getElementById('quickRechargeStatus').innerHTML = '❌ দয়া করে সঠিক টাকার পরিমাণ দিন!';
        document.getElementById('quickRechargeStatus').style.color = 'red';
        return;
    }
    if (!date) {
        document.getElementById('quickRechargeStatus').innerHTML = '❌ দয়া করে তারিখ নির্বাচন করুন!';
        document.getElementById('quickRechargeStatus').style.color = 'red';
        return;
    }

    const meterData = getActiveMeterData();
    let currentBalance = meterData.currentBalance || 0;
    let totalRecharge = meterData.totalRecharge || 0;
    let transactions = [...(meterData.transactions || [])];

    const vatRate = APP.settings.vatRate || 5;
    const rebateRate = APP.settings.rebateRate || 0.85;
    const demandCharge = APP.settings.demandCharge || 294;

        // Check if demand charge already applied this month by looking at existing transactions
    const d = new Date(date);
    const monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const hasDemandChargeThisMonth = transactions.some(t => {
        if (t.type !== 'recharge') return false;
        const td = new Date(t.date || t.timestamp);
        if (isNaN(td.getTime())) return false;
        const tk = td.getFullYear() + '-' + String(td.getMonth() + 1).padStart(2, '0');
        return tk === monthKey && t.isFirstOfMonth === true;
    });

        // Calculate deductions
    let deductions = 0;
    let dcAmount = 0;
    let vatDeduction = 0;
    let rebateDeduction = 0;
    
    // ডিমান্ড চার্জ: মাসে ১ বার (প্রথম রিচার্জে) - কাটবে
    if (!hasDemandChargeThisMonth) {
        dcAmount = demandCharge;
        deductions += dcAmount;
    }
    
    // ভ্যাট: প্রতিটি রিচার্জে - কাটবে
    vatDeduction = amount * (vatRate / 100);
    deductions += vatDeduction;
    
    // রিবেট: প্রতিটি রিচার্জে - যোগ হবে (ছাড়)
    rebateDeduction = amount * (rebateRate / 100);
    // deductions -= rebateDeduction; // রিবেট deduction না, বরং যোগ
    
    const netAmount = amount - deductions + rebateDeduction;
    const balanceAfter = currentBalance + netAmount;
    totalRecharge += amount;

        const descriptionParts = [`📱 মাসিক রিচার্জ - ${amount} টাকা`];
    let descDc = 0;
    if (!hasDemandChargeThisMonth) {
        descDc = demandCharge;
        descriptionParts.push(`ডিমান্ড চার্জ: ${descDc.toFixed(2)} টাকা`);
    } else {
        descriptionParts.push(`ডিমান্ড চার্জ: ০.০০ টাকা (ইতিমধ্যে কাটা)`);
    }
    descriptionParts.push(`ভ্যাট: ${vatDeduction.toFixed(2)} টাকা`);
    descriptionParts.push(`রিবেট: ${rebateDeduction.toFixed(2)} টাকা (ছাড়)`);
    descriptionParts.push(`নেট: ${netAmount.toFixed(2)} টাকা`);
    descriptionParts.push(new Date(date).toLocaleDateString('bn-BD'));

    const transaction = {
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
        timestamp: new Date().toLocaleString('bn-BD')
    };

    transactions.push(transaction);

    const updatedData = {
        ...meterData,
        transactions: transactions,
        currentBalance: balanceAfter,
        totalRecharge: totalRecharge
    };

        updateActiveMeterData(updatedData);
    
    document.getElementById('quickRechargeAmount').value = '';
    const detailsHtml = `✅ রিচার্জ: ${amount} টাকা${dcAmount > 0 ? `<br>⚡ ডিমান্ড চার্জ: ${dcAmount.toFixed(2)} টাকা` : ''}<br>🧾 ভ্যাট: ${vatDeduction.toFixed(2)} টাকা<br>💰 রিবেট: ${rebateDeduction.toFixed(2)} টাকা<br>📊 নেট: ${netAmount.toFixed(2)} টাকা<br>📅 নতুন ব্যালেন্স: ${balanceAfter.toFixed(2)} টাকা`;
    document.getElementById('quickRechargeStatus').innerHTML = detailsHtml;
    document.getElementById('quickRechargeStatus').style.color = '#2e7d32';
    
    // Log recharge activity
    logActivity('recharge', `মাসিক রিচার্জ: ৳${amount.toFixed(2)} | নেট: ৳${netAmount.toFixed(2)} | ব্যালেন্স পর: ৳${balanceAfter.toFixed(2)}`);
    
        showToast(`✅ রিচার্জ হয়েছে: ${amount} টাকা, নেট: ${netAmount.toFixed(2)} টাকা`, 'success');
    
    // Recalculate all balances
    recalculateBalance();
    
    showTransactions();
    checkBadges();
}

// ==================== QUICK BALANCE UPDATE ====================
function updateBalance() {
    if (!APP.activeMeterId) {
        showToast('প্রথমে একটি মিটার যোগ করুন', 'warning');
        navigateTo('meters');
        return;
    }

    const amount = parseFloat(document.getElementById('quickBalanceAmount').value);
    const date = document.getElementById('quickBalanceDate').value;

    if (amount === undefined || amount === null || isNaN(amount)) {
        document.getElementById('quickBalanceStatus').innerHTML = '❌ দয়া করে সঠিক ব্যালেন্স ইনপুট দিন!';
        document.getElementById('quickBalanceStatus').style.color = 'red';
        return;
    }
    if (!date) {
        document.getElementById('quickBalanceStatus').innerHTML = '❌ দয়া করে তারিখ নির্বাচন করুন!';
        document.getElementById('quickBalanceStatus').style.color = 'red';
        return;
    }

    const meterData = getActiveMeterData();
    const currentBalance = meterData.currentBalance || 0;

    let transactionType, balanceAfter, description;
    
    if (amount >= currentBalance) {
        // ব্যালেন্স বাড়ানো = রিচার্জ
        const rechargeAmount = amount - currentBalance;
        transactionType = 'recharge';
        balanceAfter = amount;
        description = '📊 ব্যালেন্স আপডেট (রিচার্জ) - ' + rechargeAmount + ' টাকা - নতুন ব্যালেন্স: ' + amount + ' টাকা - ' + new Date(date).toLocaleDateString('bn-BD');
        
        const updatedMeterData = {
            ...meterData,
            currentBalance: amount,
            totalRecharge: (meterData.totalRecharge || 0) + rechargeAmount,
            transactions: [...(meterData.transactions || []), {
                id: 'balance_update_' + Date.now().toString(),
                meterId: APP.activeMeterId,
                type: 'recharge',
                amount: rechargeAmount,
                units: 0,
                balanceAfter: amount,
                date: date,
                description: description,
                timestamp: new Date().toLocaleString('bn-BD')
            }]
        };
        updateActiveMeterData(updatedMeterData);
        
    } else {
        // ব্যালেন্স কমানো = বিল/খরচ
        const spentAmount = currentBalance - amount;
        transactionType = 'electricity_bill';
        balanceAfter = amount;
        description = '📊 ব্যালেন্স আপডেট (খরচ) - ' + spentAmount + ' টাকা - নতুন ব্যালেন্স: ' + amount + ' টাকা - ' + new Date(date).toLocaleDateString('bn-BD');
        
        const updatedMeterData = {
            ...meterData,
            currentBalance: amount,
            totalExpended: (meterData.totalExpended || 0) + spentAmount,
            transactions: [...(meterData.transactions || []), {
                id: 'balance_update_' + Date.now().toString(),
                meterId: APP.activeMeterId,
                type: 'electricity_bill',
                amount: spentAmount,
                units: 0,
                balanceAfter: amount,
                date: date,
                description: description,
                timestamp: new Date().toLocaleString('bn-BD')
            }]
        };
        updateActiveMeterData(updatedMeterData);
    }

        document.getElementById('quickBalanceAmount').value = '';
    document.getElementById('quickBalanceStatus').innerHTML = '✅ ব্যালেন্স আপডেট হয়েছে: ' + amount + ' টাকা, তারিখ: ' + new Date(date).toLocaleDateString('bn-BD');
    document.getElementById('quickBalanceStatus').style.color = '#1565c0';
    
    // Log balance update activity
    const diffAmount = Math.abs(amount - currentBalance);
    const logType = amount >= currentBalance ? 'recharge' : 'bill';
    const logAction = amount >= currentBalance ? 'ব্যালেন্স আপডেট (রিচার্জ)' : 'ব্যালেন্স আপডেট (খরচ)';
    logActivity(logType, logAction + ': ৳' + diffAmount.toFixed(2) + ' - নতুন ব্যালেন্স: ৳' + amount.toFixed(2) + ' - ' + new Date(date).toLocaleDateString('bn-BD'));
    
    showToast('✅ ব্যালেন্স সফলভাবে আপডেট হয়েছে', 'success');
    showTransactions();
    checkBadges();
}