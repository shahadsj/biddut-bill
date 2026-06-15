// ==================== CALCULATOR ====================
function showCalculator() {
    var L = APP.language;
    document.getElementById('pageContent').innerHTML = [
        '<div class="card">',
            '<h2>&#x1F4B0; '+(L==='en'?'Electricity Cost Calculator':'ইলেকট্রিসিটি কস্ট ক্যালকুলেটর')+'</h2>',
            '<p>'+(L==='en'?'Enter units consumed or amount to calculate:':'ইউনিট বা টাকার পরিমাণ দিন হিসাব করতে:')+'</p>',
            
            '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">',
                '<div class="form-group">',
                    '<label>'+(L==='en'?'Units (kWh)':'ইউনিট (kWh)')+'</label>',
                    '<input type="number" class="form-control" id="calcUnits" placeholder="'+(L==='en'?'e.g. 200':'যেমন: ২০০')+'" step="0.01" oninput="calcFromUnits()">',
                '</div>',
                '<div class="form-group">',
                    '<label>'+(L==='en'?'Amount (Taka)':'পরিমাণ (টাকা)')+'</label>',
                    '<input type="number" class="form-control" id="calcAmount" placeholder="'+(L==='en'?'e.g. 1000':'যেমন: ১০০০')+'" step="0.01" oninput="calcFromAmount()">',
                '</div>',
            '</div>',
            
            '<div id="calcResult" style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; color: white; display: none;">',
                '<h3 style="margin-bottom: 15px;">&#x1F4CA; '+(L==='en'?'Calculation Result':'হিসাবের ফলাফল')+'</h3>',
                '<div id="calcDetails"></div>',
            '</div>',
            
            '<div class="card" style="margin-top: 20px; background: #f8f9fa;">',
                '<h3>&#x1F4CB; '+(L==='en'?'Tariff Rates (Current)':'ট্যারিফ রেট (বর্তমান)')+'</h3>',
                '<div class="table-container"><table><thead><tr>',
                    '<th>'+(L==='en'?'Slab Name':'স্ল্যাব নাম')+'</th>',
                    '<th>'+(L==='en'?'Range (kWh)':'রেঞ্জ (kWh)')+'</th>',
                    '<th>'+(L==='en'?'Rate (Taka)':'রেট (টাকা)')+'</th>',
                '</tr></thead><tbody>',
                (APP.tariffRates||[]).map(function(r) {
                    var rangeStr = r.range[1] === null || r.range[1] === undefined ? (r.range[0]+'+') : (r.range[0]+' - '+r.range[1]);
                    return '<tr><td>'+r.name+'</td><td>'+rangeStr+'</td><td>৳ '+r.rate+'</td></tr>';
                }).join(''),
                '</tbody></table></div>',
            '</div>',
        '</div>',
    ].join('');
}

function calcFromUnits() {
    var units = parseFloat(document.getElementById('calcUnits').value);
    if (!units || units <= 0) {
        document.getElementById('calcResult').style.display = 'none';
        return;
    }
    
    var total = calculateBillFromUnits(units);
    document.getElementById('calcAmount').value = total.toFixed(2);
    
    var resultDiv = document.getElementById('calcResult');
    resultDiv.style.display = 'block';
    
    var L = APP.language;
    var demandCharge = APP.settings.demandCharge || 0;
    
    document.getElementById('calcDetails').innerHTML = [
        '<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px;">',
            '<div><strong>'+(L==='en'?'Total Units':'মোট ইউনিট')+':</strong> '+units.toFixed(2)+' kWh</div>',
            '<div><strong>'+(L==='en'?'Demand Charge':'ডিমান্ড চার্জ')+':</strong> ৳ '+demandCharge.toFixed(2)+'</div>',
            '<div style="grid-column: span 2;"><strong>'+(L==='en'?'Slab-wise Breakdown':'স্ল্যাব ভিত্তিক ব্রেকডাউন')+':</strong></div>',
        '</div>',
        '<div style="margin-top: 10px;">',
            getSlabBreakdownHTML(units, L),
        '</div>',
        '<div style="margin-top: 15px; font-size: 24px; font-weight: bold; text-align: center;">',
            (L==='en'?'Total Bill:':'মোট বিল:')+' ৳ '+total.toFixed(2),
        '</div>',
    ].join('');
}

function calcFromAmount() {
    var amount = parseFloat(document.getElementById('calcAmount').value);
    if (!amount || amount <= 0) {
        document.getElementById('calcResult').style.display = 'none';
        return;
    }
    
    var units = calculateUnitsFromTaka(amount);
    document.getElementById('calcUnits').value = units.toFixed(2);
    
    var resultDiv = document.getElementById('calcResult');
    resultDiv.style.display = 'block';
    
    var L = APP.language;
    var demandCharge = APP.settings.demandCharge || 0;
    var usableAmount = Math.max(0, amount - demandCharge);
    
    document.getElementById('calcDetails').innerHTML = [
        '<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px;">',
            '<div><strong>'+(L==='en'?'Total Amount':'মোট পরিমাণ')+':</strong> ৳ '+amount.toFixed(2)+'</div>',
            '<div><strong>'+(L==='en'?'Demand Charge':'ডিমান্ড চার্জ')+':</strong> ৳ '+demandCharge.toFixed(2)+'</div>',
            '<div><strong>'+(L==='en'?'Usable Amount':'ব্যবহারযোগ্য পরিমাণ')+':</strong> ৳ '+usableAmount.toFixed(2)+'</div>',
            '<div><strong>'+(L==='en'?'Estimated Units':'আনুমানিক ইউনিট')+':</strong> '+units.toFixed(2)+' kWh</div>',
        '</div>',
        '<div style="margin-top: 15px; font-size: 24px; font-weight: bold; text-align: center;">',
            (L==='en'?'You can use approx.':'আপনি প্রায় ব্যবহার করতে পারবেন')+' '+units.toFixed(2)+' kWh',
        '</div>',
    ].join('');
}

function getSlabBreakdownHTML(units, L) {
    var tariffRates = APP.tariffRates || [];
    var remaining = units;
    var html = '<table style="width:100%;border-collapse:collapse;"><tr><th style="padding:8px;text-align:left;border-bottom:2px solid rgba(255,255,255,0.3);">'+(L==='en'?'Slab':'স্ল্যাব')+'</th><th style="padding:8px;text-align:center;border-bottom:2px solid rgba(255,255,255,0.3);">'+(L==='en'?'Units':'ইউনিট')+'</th><th style="padding:8px;text-align:right;border-bottom:2px solid rgba(255,255,255,0.3);">'+(L==='en'?'Cost':'খরচ')+'</th></tr>';
    
    for (var i = 0; i < tariffRates.length; i++) {
        if (remaining <= 0) break;
        var slab = tariffRates[i];
        var min = slab.range[0], max = slab.range[1];
        var slabUnits = (max === null || max === undefined) ? remaining : Math.min(remaining, max - min + 1);
        var cost = slabUnits * slab.rate;
        html += '<tr><td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.15);">'+slab.name+'</td><td style="padding:8px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.15);">'+slabUnits.toFixed(2)+'</td><td style="padding:8px;text-align:right;border-bottom:1px solid rgba(255,255,255,0.15);">৳ '+cost.toFixed(2)+'</td></tr>';
        remaining -= slabUnits;
    }
    
    html += '</table>';
    return html;
}
