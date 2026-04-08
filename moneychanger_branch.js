/**
 * moneychanger_branch.js
 * Branch-level money-changing: Buy/Sell FX transactions + inventory.
 * All data via Firestore through moneychanger_db.js.
 */

import {
  addTransaction, reverseTransaction, getTransactions,
  getInventory, setInventoryOpening,
  getLatestRates, getBranches, seedIfEmpty, todayDate,
} from './moneychanger_db.js';
import { currentUser } from './auth_guard.js';
import { toDisplayDate, toDisplayDateTime } from './db_service.js';

let mcBranchCode = sessionStorage.getItem('mc_branchCode') || 'BR01';
let mcBranchArea = sessionStorage.getItem('mc_branchArea') || 'A1';
let mcBranchUser = () => currentUser?.email || sessionStorage.getItem('userEmail') || 'Teller01';

// ── Notification ──────────────────────────────────────────────────────────
function mcNotify(msg, color = 'orange') {
  const box = document.getElementById('mc-notification');
  if (!box) return;
  box.innerHTML = `<span style="margin-right:8px;">${color==='red'?'❌':color==='green'?'✅':'⚠️'}</span>${msg}`;
  box.style.background = color;
  box.style.display = 'flex';
  setTimeout(() => { box.style.display = 'none'; }, 3500);
}

// ── Populate dropdowns ────────────────────────────────────────────────────
async function mcBranchPopulateCurrencies(selectId) {
  const rates = await getLatestRates();
  const sel   = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Select Currency --</option>';
  rates.forEach(r => {
    sel.innerHTML += `<option value="${r.currency}">${r.currency}</option>`;
  });
}

async function mcBranchPopulateBranches() {
  const sel = document.getElementById('mc-branch-select');
  if (!sel) return;
  const branches = await getBranches();
  sel.innerHTML = '<option value="">-- Select Branch --</option>';
  branches.forEach(b => {
    sel.innerHTML += `<option value="${b.code}" data-area="${b.area}">${b.name}</option>`;
  });
  sel.value = mcBranchCode;
}

// ── Rate display ──────────────────────────────────────────────────────────
async function mcBranchUpdateRateDisplay() {
  const currency = document.getElementById('mc-txn-currency')?.value;
  const type     = document.getElementById('mc-txn-type')?.value;
  if (!currency || !type) return;
  const rates = await getLatestRates();
  const rate  = rates.find(r => r.currency === currency);
  if (!rate) return;
  const appliedRate = type === 'Buy' ? rate.buyRate : rate.sellRate;
  const display = document.getElementById('mc-rate-display');
  if (display) display.textContent = `Rate: 1 ${currency} = ${Number(appliedRate).toFixed(4)} PHP (${type})`;
  mcBranchComputePHP(rates);
}

async function mcBranchComputePHP(rates) {
  const currency = document.getElementById('mc-txn-currency')?.value;
  const type     = document.getElementById('mc-txn-type')?.value;
  const fxAmount = parseFloat(document.getElementById('mc-txn-fx-amount')?.value) || 0;
  if (!currency || !type || fxAmount <= 0) return;
  const rateList = rates || await getLatestRates();
  const rate     = rateList.find(r => r.currency === currency);
  if (!rate) return;
  const appliedRate = type === 'Buy' ? rate.buyRate : rate.sellRate;
  const phpEl = document.getElementById('mc-txn-php-amount');
  if (phpEl) phpEl.value = (fxAmount * appliedRate).toFixed(2);
}

// ── Save transaction ──────────────────────────────────────────────────────
async function mcBranchSaveTxn() {
  const currency  = document.getElementById('mc-txn-currency').value;
  const type      = document.getElementById('mc-txn-type').value;
  const fxAmount  = parseFloat(document.getElementById('mc-txn-fx-amount').value)  || 0;
  const phpAmount = parseFloat(document.getElementById('mc-txn-php-amount').value) || 0;
  const customer  = document.getElementById('mc-txn-customer').value.trim();
  const idType    = document.getElementById('mc-txn-idtype').value.trim();
  const idNo      = document.getElementById('mc-txn-idno').value.trim();
  const remarks   = document.getElementById('mc-txn-remarks').value.trim();
  const date      = document.getElementById('mc-txn-date').value;

  if (!currency || !type || fxAmount <= 0 || phpAmount <= 0 || !customer || !idType || !idNo) {
    mcNotify('Please fill in all required fields.', 'orange'); return;
  }

  if (type === 'Sell') {
    const inv   = await getInventory({ branchCode: mcBranchCode, currency });
    const stock = inv.length ? (inv[0].fxBalance || 0) : 0;
    if (stock < fxAmount) {
      mcNotify(`Insufficient ${currency} inventory. Available: ${stock.toFixed(2)}`, 'red'); return;
    }
  }

  const saved = await addTransaction({
    branchCode: mcBranchCode, area: mcBranchArea,
    date, currency, type, fxAmount, phpAmount,
    customer, idType, idNo, remarks,
    teller: mcBranchUser(),
  });

  mcNotify(`Transaction saved. Ref: ${saved.refNo}`, 'green');
  mcBranchClearForm();
  await mcBranchLoadTable();
  await mcBranchLoadInventory();
}

function mcBranchClearForm() {
  ['mc-txn-currency','mc-txn-type','mc-txn-fx-amount','mc-txn-php-amount',
   'mc-txn-customer','mc-txn-idtype','mc-txn-idno','mc-txn-remarks'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const rd = document.getElementById('mc-rate-display');
  if (rd) rd.textContent = '';
  const dateEl = document.getElementById('mc-txn-date');
  if (dateEl) dateEl.value = todayDate();
}

// ── Reverse transaction ───────────────────────────────────────────────────
async function mcBranchReverse(refNo) {
  if (!confirm(`Reverse transaction ${refNo}?`)) return;
  const result = await reverseTransaction(refNo, mcBranchUser());
  if (!result) { mcNotify('Transaction not found or already reversed.', 'red'); return; }
  mcNotify(`Reversed. Ref: ${result.refNo}`, 'green');
  await mcBranchLoadTable();
  await mcBranchLoadInventory();
}

// ── Load transaction table ────────────────────────────────────────────────
async function mcBranchLoadTable() {
  const dateFrom = document.getElementById('mc-filter-from')?.value || '';
  const dateTo   = document.getElementById('mc-filter-to')?.value   || '';
  const currency = document.getElementById('mc-filter-currency')?.value || '';
  const type     = document.getElementById('mc-filter-type')?.value     || '';

  const txns = await getTransactions({
    branchCode: mcBranchCode,
    dateFrom  : dateFrom || undefined,
    dateTo    : dateTo   || undefined,
    currency  : currency || undefined,
    type      : type     || undefined,
  });

  const tbody = document.getElementById('mc-branch-txn-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!txns.length) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:#888;">No transactions found.</td></tr>';
    return;
  }

  [...txns].reverse().forEach(t => {
    const isActive = t.status === 'Active';
    tbody.innerHTML += `
      <tr class="${t.status==='Reversal'?'mc-row-reversal':t.status==='Reversed'?'mc-row-reversed':''}">
        <td>${toDisplayDate(t.date)}</td>
        <td>${t.refNo}</td>
        <td><span class="mc-badge mc-badge-${t.type?.toLowerCase()}">${t.type}</span></td>
        <td>${t.currency}</td>
        <td class="mc-num">${Number(t.fxAmount).toFixed(2)}</td>
        <td class="mc-num">${Number(t.phpAmount).toFixed(2)}</td>
        <td>${t.customer}</td>
        <td>${t.teller}</td>
        <td><span class="mc-status mc-status-${t.status?.toLowerCase()}">${t.status}</span></td>
        <td>${isActive
          ? `<button class="mc-btn mc-btn-sm mc-btn-danger" onclick="mcBranchReverse('${t.refNo}')">Reverse</button>`
          : '—'}</td>
      </tr>`;
  });
}

// ── Load inventory table ──────────────────────────────────────────────────
async function mcBranchLoadInventory() {
  const inv   = await getInventory({ branchCode: mcBranchCode });
  const tbody = document.getElementById('mc-branch-inv-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!inv.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;">No inventory records.</td></tr>';
    return;
  }

  inv.forEach(i => {
    const fxClass  = i.fxBalance  < 0 ? 'mc-neg' : '';
    const phpClass = i.phpBalance < 0 ? 'mc-neg' : '';
    tbody.innerHTML += `
      <tr>
        <td>${i.currency}</td>
        <td class="mc-num ${fxClass}">${Number(i.fxBalance).toFixed(2)}</td>
        <td class="mc-num ${phpClass}">${Number(i.phpBalance).toFixed(2)}</td>
        <td>${i.lastUpdated || '—'}</td>
        <td><button class="mc-btn mc-btn-sm" onclick="mcBranchOpenAdjust('${i.currency}')">Adjust</button></td>
      </tr>`;
  });
}

// ── Opening balance adjustment ────────────────────────────────────────────
async function mcBranchOpenAdjust(currency) {
  document.getElementById('mc-adjust-currency').value = currency;
  const inv = await getInventory({ branchCode: mcBranchCode, currency });
  document.getElementById('mc-adjust-fx').value  = inv.length ? inv[0].fxBalance  : 0;
  document.getElementById('mc-adjust-php').value = inv.length ? inv[0].phpBalance : 0;
  document.getElementById('mc-adjust-modal').style.display = 'flex';
}

async function mcBranchSaveAdjust() {
  const currency = document.getElementById('mc-adjust-currency').value;
  const fx  = parseFloat(document.getElementById('mc-adjust-fx').value)  || 0;
  const php = parseFloat(document.getElementById('mc-adjust-php').value) || 0;
  await setInventoryOpening(mcBranchCode, mcBranchArea, currency, php, fx);
  mcNotify('Inventory adjusted.', 'green');
  document.getElementById('mc-adjust-modal').style.display = 'none';
  await mcBranchLoadInventory();
}

// ── Rate board ────────────────────────────────────────────────────────────
async function mcBranchLoadRates() {
  const rates = await getLatestRates();
  const tbody = document.getElementById('mc-rates-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  rates.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.currency}</td>
        <td class="mc-num">${Number(r.buyRate).toFixed(4)}</td>
        <td class="mc-num">${Number(r.sellRate).toFixed(4)}</td>
        <td>${r.effectiveDate}</td>
        <td>${r.setBy}</td>
      </tr>`;
  });
}

// ── Init ──────────────────────────────────────────────────────────────────
export async function mcBranchInit() {
  await seedIfEmpty();
  await mcBranchPopulateBranches();
  await mcBranchPopulateCurrencies('mc-txn-currency');
  await mcBranchPopulateCurrencies('mc-filter-currency');

  const dateEl = document.getElementById('mc-txn-date');
  if (dateEl) dateEl.value = todayDate();

  const fromEl = document.getElementById('mc-filter-from');
  const toEl   = document.getElementById('mc-filter-to');
  if (fromEl) fromEl.value = todayDate();
  if (toEl)   toEl.value   = todayDate();

  const branchSel = document.getElementById('mc-branch-select');
  if (branchSel) {
    branchSel.addEventListener('change', async () => {
      const opt = branchSel.options[branchSel.selectedIndex];
      mcBranchCode = branchSel.value;
      mcBranchArea = opt.dataset.area || '';
      sessionStorage.setItem('mc_branchCode', mcBranchCode);
      sessionStorage.setItem('mc_branchArea', mcBranchArea);
      await mcBranchLoadTable();
      await mcBranchLoadInventory();
    });
  }

  document.getElementById('mc-txn-currency')?.addEventListener('change', mcBranchUpdateRateDisplay);
  document.getElementById('mc-txn-type')?.addEventListener('change', mcBranchUpdateRateDisplay);
  document.getElementById('mc-txn-fx-amount')?.addEventListener('input', () => mcBranchComputePHP());

  await mcBranchLoadTable();
  await mcBranchLoadInventory();
  await mcBranchLoadRates();

  // Expose to HTML onclick handlers
  window.mcBranchSaveTxn    = mcBranchSaveTxn;
  window.mcBranchClearForm  = mcBranchClearForm;
  window.mcBranchReverse    = mcBranchReverse;
  window.mcBranchOpenAdjust = mcBranchOpenAdjust;
  window.mcBranchSaveAdjust = mcBranchSaveAdjust;
  window.mcBranchLoadTable  = mcBranchLoadTable;
}
