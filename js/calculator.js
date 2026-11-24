// ==================== CALCULATOR ====================
function showCalculator() {
    var L = APP.language;
    document.getElementById('pageContent').innerHTML = [
        '<div class="card">',
            '<h2>&#x1F4B0; '+(L==='en'?'Electricity Cost Calculator':'ইলেকট্রিসিটি কস্ট ক্যালকুলেটর')+'</h2>',
            '<p>'+(L==='en'?'Enter units consumed or amount to calculate:':'ইউনিট বা টাকার পরিমাণ দিন হিসাব করতে:')+'</p>',
            
            '<div class="calc-inputs-grid" style="display: grid; gap: 20px; margin-top: 20px;">',
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
    
    var L = APP.language;
    var tariffRates = (APP.tariffRates && APP.tariffRates.length > 0) ? APP.tariffRates : [];
    var demandCharge = Number(APP.settings.demandCharge) || 0;
    var vatRate = (APP.settings.vatRate !== undefined && APP.settings.vatRate !== null) ? Number(APP.settings.vatRate) : 5.0;
    var rebateRate = (APP.settings.rebateRate !== undefined && APP.settings.rebateRate !== null) ? Number(APP.settings.rebateRate) : 0.6;
    
    // Calculate Energy Charge across slabs
    var energyCharge = 0;
    var remaining = units;
    var slabRows = [];
    
    for (var i = 0; i < tariffRates.length; i++) {
        if (remaining <= 0) break;
        var slab = tariffRates[i];
        var min = slab.range[0], max = slab.range[1];
        var slabUnits = (max === null || max === undefined) ? remaining : Math.min(remaining, max - min + 1);
        var cost = slabUnits * Number(slab.rate);
        energyCharge += cost;
        slabRows.push({
            name: slab.name,
            units: slabUnits,
            rate: slab.rate,
            cost: cost
        });
        remaining -= slabUnits;
    }
    
    var subtotal = energyCharge + demandCharge;
    var vat = Math.round(subtotal * (vatRate / 100) * 100) / 100;
    var rebate = Math.round(subtotal * (rebateRate / 100) * 100) / 100;
    var total = Math.round((subtotal + vat - rebate) * 100) / 100;
    
    document.getElementById('calcAmount').value = total.toFixed(2);
    
    var resultDiv = document.getElementById('calcResult');
    resultDiv.style.display = 'block';
    
    var slabTableHtml = '<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:13px;">' +
        '<thead><tr style="border-bottom:2px solid rgba(255,255,255,0.3);">' +
            '<th style="padding:6px;text-align:left;">'+(L==='en'?'Slab':'স্ল্যাব')+'</th>' +
            '<th style="padding:6px;text-align:center;">'+(L==='en'?'Rate':'রেট')+'</th>' +
            '<th style="padding:6px;text-align:center;">'+(L==='en'?'Units':'ইউনিট')+'</th>' +
            '<th style="padding:6px;text-align:right;">'+(L==='en'?'Cost':'টাকা')+'</th>' +
        '</tr></thead><tbody>' +
        slabRows.map(function(s) {
            return '<tr style="border-bottom:1px solid rgba(255,255,255,0.15);">' +
                '<td style="padding:6px 4px;">' + s.name + '</td>' +
                '<td style="padding:6px 4px;text-align:center;">৳ ' + Number(s.rate).toFixed(2) + '</td>' +
                '<td style="padding:6px 4px;text-align:center;">' + s.units.toFixed(2) + '</td>' +
                '<td style="padding:6px 4px;text-align:right;font-weight:600;">৳ ' + s.cost.toFixed(2) + '</td>' +
            '</tr>';
        }).join('') +
        '</tbody></table>';
    
    document.getElementById('calcDetails').innerHTML = [
        '<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; font-size: 13.5px;">',
            '<div><strong>'+(L==='en'?'Total Units':'মোট ইউনিট')+':</strong> '+units.toFixed(2)+' kWh</div>',
            '<div><strong>'+(L==='en'?'Energy Charge':'বিদ্যুৎ শক্তি খরচ')+':</strong> ৳ '+energyCharge.toFixed(2)+'</div>',
            '<div><strong>'+(L==='en'?'Demand Charge':'ডিমান্ড চার্জ')+':</strong> ৳ '+demandCharge.toFixed(2)+'</div>',
            '<div><strong>'+(L==='en'?'Subtotal':'উপমোট (চার্জ সহ)')+':</strong> ৳ '+subtotal.toFixed(2)+'</div>',
            '<div><strong>'+(L==='en'?'Govt VAT ('+vatRate+'%)':'সরকারি ভ্যাট ('+vatRate+'%)')+':</strong> +৳ '+vat.toFixed(2)+'</div>',
            '<div><strong>'+(L==='en'?'Rebate Discount ('+rebateRate+'%)':'রিবেট ছাড় ('+rebateRate+'%)')+':</strong> -৳ '+rebate.toFixed(2)+'</div>',
        '</div>',
        '<div style="margin-top: 12px;">',
            '<div style="font-weight:600;font-size:13px;margin-bottom:4px;">'+(L==='en'?'Slab-wise Breakdown':'স্ল্যাব ভিত্তিক হিসাব')+':</div>',
            slabTableHtml,
        '</div>',
        '<div style="margin-top: 15px; padding-top: 12px; border-top: 2px dashed rgba(255,255,255,0.3); font-size: 22px; font-weight: bold; text-align: center;">',
            (L==='en'?'Total Bill Payable:':'সর্বমোট প্রদেয় বিল:')+' ৳ '+total.toFixed(2),
        '</div>',
    ].join('');
}

function calcFromAmount() {
    var amount = parseFloat(document.getElementById('calcAmount').value);
    if (!amount || amount <= 0) {
        document.getElementById('calcResult').style.display = 'none';
        return;
    }
    
    var L = APP.language;
    var demandCharge = Number(APP.settings.demandCharge) || 0;
    var vatRate = (APP.settings.vatRate !== undefined && APP.settings.vatRate !== null) ? Number(APP.settings.vatRate) : 5.0;
    var rebateRate = (APP.settings.rebateRate !== undefined && APP.settings.rebateRate !== null) ? Number(APP.settings.rebateRate) : 0.6;
    var tariffRates = (APP.tariffRates && APP.tariffRates.length > 0) ? APP.tariffRates : [];
    
    // Net usable for electricity energy charge after demand charge and net VAT-rebate factor
    // Total = (EnergyCharge + DemandCharge) * (1 + (vatRate - rebateRate)/100)
    var taxFactor = 1 + ((vatRate - rebateRate) / 100);
    var subtotal = amount / taxFactor;
    var usableForEnergy = Math.max(0, subtotal - demandCharge);
    var estVat = Math.round(subtotal * (vatRate / 100) * 100) / 100;
    var estRebate = Math.round(subtotal * (rebateRate / 100) * 100) / 100;
    
    // Convert usableForEnergy to units across slabs
    var units = 0;
    var remainingMoney = usableForEnergy;
    var slabRows = [];
    
    for (var i = 0; i < tariffRates.length; i++) {
        if (remainingMoney <= 0) break;
        var slab = tariffRates[i];
        var min = slab.range[0], max = slab.range[1];
        var maxUnitsInSlab = (max === null || max === undefined) ? Infinity : max - min + 1;
        var costForFullSlab = maxUnitsInSlab === Infinity ? Infinity : maxUnitsInSlab * Number(slab.rate);
        
        var moneyInSlab = Math.min(remainingMoney, costForFullSlab);
        var unitsInSlab = moneyInSlab / Number(slab.rate);
        units += unitsInSlab;
        slabRows.push({
            name: slab.name,
            units: unitsInSlab,
            rate: slab.rate,
            cost: moneyInSlab
        });
        remainingMoney -= moneyInSlab;
    }
    
    document.getElementById('calcUnits').value = units.toFixed(2);
    
    var resultDiv = document.getElementById('calcResult');
    resultDiv.style.display = 'block';
    
    var slabTableHtml = '<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:13px;">' +
        '<thead><tr style="border-bottom:2px solid rgba(255,255,255,0.3);">' +
            '<th style="padding:6px;text-align:left;">'+(L==='en'?'Slab':'স্ল্যাব')+'</th>' +
            '<th style="padding:6px;text-align:center;">'+(L==='en'?'Rate':'রেট')+'</th>' +
            '<th style="padding:6px;text-align:center;">'+(L==='en'?'Units':'ইউনিট')+'</th>' +
            '<th style="padding:6px;text-align:right;">'+(L==='en'?'Amount':'টাকা')+'</th>' +
        '</tr></thead><tbody>' +
        slabRows.map(function(s) {
            return '<tr style="border-bottom:1px solid rgba(255,255,255,0.15);">' +
                '<td style="padding:6px 4px;">' + s.name + '</td>' +
                '<td style="padding:6px 4px;text-align:center;">৳ ' + Number(s.rate).toFixed(2) + '</td>' +
                '<td style="padding:6px 4px;text-align:center;">' + s.units.toFixed(2) + '</td>' +
                '<td style="padding:6px 4px;text-align:right;font-weight:600;">৳ ' + s.cost.toFixed(2) + '</td>' +
            '</tr>';
        }).join('') +
        '</tbody></table>';
    
    document.getElementById('calcDetails').innerHTML = [
        '<div style="display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; font-size: 13.5px;">',
            '<div><strong>'+(L==='en'?'Recharge Amount':'মোট রিচার্জ')+':</strong> ৳ '+amount.toFixed(2)+'</div>',
            '<div><strong>'+(L==='en'?'Demand Charge':'ডিমান্ড চার্জ')+':</strong> ৳ '+demandCharge.toFixed(2)+'</div>',
            '<div><strong>'+(L==='en'?'Est. Govt VAT ('+vatRate+'%)':'আনুমানিক ভ্যাট ('+vatRate+'%)')+':</strong> +৳ '+estVat.toFixed(2)+'</div>',
            '<div><strong>'+(L==='en'?'Est. Rebate ('+rebateRate+'%)':'আনুমানিক রিবেট ('+rebateRate+'%)')+':</strong> -৳ '+estRebate.toFixed(2)+'</div>',
            '<div style="grid-column: span 2;"><strong>'+(L==='en'?'Usable Balance for Units':'বিদ্যুৎ ব্যবহারের নিট ব্যালেন্স')+':</strong> ৳ '+usableForEnergy.toFixed(2)+'</div>',
        '</div>',
        '<div style="margin-top: 12px;">',
            '<div style="font-weight:600;font-size:13px;margin-bottom:4px;">'+(L==='en'?'Estimated Slab Breakdown':'স্ল্যাব অনুযায়ী সম্ভাব্য ইউনিট')+':</div>',
            slabTableHtml,
        '</div>',
        '<div style="margin-top: 15px; padding-top: 12px; border-top: 2px dashed rgba(255,255,255,0.3); font-size: 22px; font-weight: bold; text-align: center;">',
            (L==='en'?'Estimated Total Units:':'আনুমানিক মোট ইউনিট:')+' '+units.toFixed(2)+' kWh',
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
