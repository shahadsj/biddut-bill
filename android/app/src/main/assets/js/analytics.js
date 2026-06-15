// ==================== ANALYTICS ====================
function showAnalytics() {
    var L = APP.language;
    if (!APP.activeMeterId || APP.meters.length === 0) {
        showToast(L==='en'?'Please add a meter first':'প্রথমে একটি মিটার যোগ করুন', 'warning');
        navigateTo('meters');
        return;
    }
    
    var meterData = getActiveMeterData();
    var transactions = meterData.transactions || [];
    var summary = getMonthlySummary(APP.activeMeterId);
    var keys = Object.keys(summary);
    
    var totalRecharge = meterData.totalRecharge || 0;
    var totalExpense = meterData.totalExpended || 0;
    var currentBalance = meterData.currentBalance || 0;
    var monthCount = keys.length || 1;
    var avgRecharge = totalRecharge / monthCount;
    var avgExpense = totalExpense / monthCount;
    
    document.getElementById('pageContent').innerHTML = [
        '<div class="card">',
            '<h2>&#x1F4CA; '+(L==='en'?'Analytics':'এনালিটিক্স')+'</h2>',
            
            '<div class="stats-grid">',
                '<div class="stat-card" style="background: linear-gradient(135deg, #667eea, #764ba2);"><div class="label">'+(L==='en'?'Avg Monthly Recharge':'গড় মাসিক রিচার্জ')+'</div><div class="value">৳ '+avgRecharge.toFixed(2)+'</div></div>',
                '<div class="stat-card" style="background: linear-gradient(135deg, #f093fb, #f5576c);"><div class="label">'+(L==='en'?'Avg Monthly Expense':'গড় মাসিক খরচ')+'</div><div class="value">৳ '+avgExpense.toFixed(2)+'</div></div>',
                '<div class="stat-card" style="background: linear-gradient(135deg, #4facfe, #00f2fe);"><div class="label">'+(L==='en'?'Total Months':'মোট মাস')+'</div><div class="value">'+monthCount+'</div></div>',
                '<div class="stat-card" style="background: linear-gradient(135deg, #43e97b, #38f9d7);"><div class="label">'+(L==='en'?'Current Balance':'বর্তমান ব্যালেন্স')+'</div><div class="value">৳ '+currentBalance.toFixed(2)+'</div></div>',
            '</div>',
            
            '<div style="margin-top: 25px;">',
                '<h3>&#x1F4C8; '+(L==='en'?'Monthly Overview':'মাসিক ওভারভিউ')+'</h3>',
                '<div class="table-container"><table><thead><tr>',
                    '<th>'+(L==='en'?'Month':'মাস')+'</th><th>'+(L==='en'?'Recharge':'রিচার্জ')+'</th><th>'+(L==='en'?'Expense':'খরচ')+'</th><th>'+(L==='en'?'Units':'ইউনিট')+'</th><th>'+(L==='en'?'Balance':'ব্যালেন্স')+'</th>',
                '</tr></thead><tbody>',
                keys.reverse().map(function(key) {
                    var m = summary[key];
                    return '<tr>'+
                        '<td><strong>'+m.displayMonth+'</strong></td>'+
                        '<td style="color:#2ecc71;">৳ '+m.recharge.toFixed(2)+'</td>'+
                        '<td style="color:#e74c3c;">৳ '+m.bill.toFixed(2)+'</td>'+
                        '<td>'+m.units.toFixed(2)+' kWh</td>'+
                        '<td style="font-weight:bold;">৳ '+m.balance.toFixed(2)+'</td>'+
                    '</tr>';
                }).join(''),
                (keys.length===0?'<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--text-light);">'+(L==='en'?'No data found':'কোন ডাটা নেই')+'</td></tr>':''),
                '</tbody></table></div>',
            '</div>',
            
            '<div style="margin-top: 25px;">',
                '<h3>&#x1F4CA; '+(L==='en'?'Statistics Summary':'পরিসংখ্যান সারাংশ')+'</h3>',
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">',
                    '<div class="card" style="background: #f0faf0; text-align: center;">',
                        '<div style="font-size: 13px; color: #666;">'+(L==='en'?'Total Recharge (All Time)':'সর্বমোট রিচার্জ')+'</div>',
                        '<div style="font-size: 28px; font-weight: bold; color: #2ecc71;">৳ '+totalRecharge.toFixed(2)+'</div>',
                    '</div>',
                    '<div class="card" style="background: #fce4ec; text-align: center;">',
                        '<div style="font-size: 13px; color: #666;">'+(L==='en'?'Total Expense (All Time)':'সর্বমোট খরচ')+'</div>',
                        '<div style="font-size: 28px; font-weight: bold; color: #e74c3c;">৳ '+totalExpense.toFixed(2)+'</div>',
                    '</div>',
                    '<div class="card" style="background: #fff8e1; text-align: center;">',
                        '<div style="font-size: 13px; color: #666;">'+(L==='en'?'Total Transactions':'মোট ট্রানজেকশন')+'</div>',
                        '<div style="font-size: 28px; font-weight: bold; color: #f39c12;">'+transactions.length+'</div>',
                    '</div>',
                    '<div class="card" style="background: #e3f2fd; text-align: center;">',
                        '<div style="font-size: 13px; color: #666;">'+(L==='en'?'Data Period':'ডাটা পিরিয়ড')+'</div>',
                        '<div style="font-size: 20px; font-weight: bold; color: #3498db;">'+monthCount+' '+(L==='en'?'months':'মাস')+'</div>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>',
    ].join('');
}
