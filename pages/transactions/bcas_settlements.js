/**
 * bcas_settlements.js
 * Module: BCAS Settlement Window (Feature 6)
 * Handles settlement records, partial/full settlement, reversals.
 * Firestore collections: bcas_settlements, settlement_profiles
 */

import {
  addDocument, updateDocument, getDocuments,
  toDisplayDate, todayISO, refDateStr, pad, fmtNum,
} from '../shared/db_service.js';
import { db, COLLECTIONS } from '../shared/firebase.js';
import { currentUser } from '../shared/auth_guard.js';
import {
  collection, query, where, orderBy, getDocs, doc, getDoc, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── Load settlement profiles (from CAMIS setup) ───────────────────────────
export async function loadSettlementProfiles() {
  const snap = await getDocs(collection(db, COLLECTIONS.SETTLEMENT_PROFILES));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Populate settlement report dropdown ───────────────────────────────────
export async function populateSettlementReportDropdown(inputId, dropdownId) {
  const profiles = await loadSettlementProfiles();
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;
  dropdown.innerHTML = '';
  profiles.filter(p => p.isActive).forEach(p => {
    const div = document.createElement('div');
    div.textContent = p.mainTemplate;
    div.dataset.profileId = p.id;
    dropdown.appendChild(div);
  });
}

// ── Load settlements with filters ─────────────────────────────────────────
export async function loadSettlements(filters = {}) {
  const branch = currentUser?.branch || document.getElementById('Bcasbranch')?.value || 'AAA';
  let constraints = [where('branchCode', '==', branch)];

  if (filters.dateFrom) constraints.push(where('date', '>=', filters.dateFrom));
  if (filters.dateTo)   constraints.push(where('date', '<=', filters.dateTo));
  if (filters.status && filters.status !== 'All') {
    constraints.push(where('status', '==', filters.status));
  }

  const q = query(collection(db, COLLECTIONS.BCAS_SETTLEMENTS), ...constraints);
  const snap = await getDocs(q);
  let rows = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.date > a.date ? 1 : -1)); // sort by date desc client-side

  if (filters.report) {
    rows = rows.filter(r => r.template?.toLowerCase().includes(filters.report.toLowerCase()));
  }
  if (filters.employeeNumber) {
    rows = rows.filter(r => r.employeeNumber?.toLowerCase().includes(filters.employeeNumber.toLowerCase()));
  }

  return rows;
}

// ── Record a settlement payment ───────────────────────────────────────────
export async function recordSettlement(settlementId, amountToSettle, captchaVerified) {
  if (!captchaVerified) throw new Error('Captcha verification required.');

  const snap = await getDoc(doc(db, COLLECTIONS.BCAS_SETTLEMENTS, settlementId));
  if (!snap.exists()) throw new Error('Settlement record not found.');

  const data = snap.data();
  const remaining = parseFloat(String(data.remaining).replace(/,/g, '')) || 0;
  const amount    = parseFloat(String(amountToSettle).replace(/,/g, '')) || 0;

  if (amount <= 0 || amount > remaining) {
    throw new Error(`Amount must be > 0 and ≤ remaining (${fmtNum(remaining)}).`);
  }

  const newSettled   = (parseFloat(String(data.settledAmount).replace(/,/g, '')) || 0) + amount;
  const newRemaining = remaining - amount;
  const newStatus    = newRemaining === 0 ? 'Settled' : 'Partial';

  // Add history entry
  const history = data.settlementHistory || [];
  history.push({
    date           : todayISO(),
    amount         : fmtNum(amount),
    status         : 'Settlement',
    referenceNumber: await _genSettlementRef(),
    settledBy      : currentUser?.email || '',
  });

  await updateDocument(COLLECTIONS.BCAS_SETTLEMENTS, settlementId, {
    settledAmount     : fmtNum(newSettled),
    remaining         : fmtNum(newRemaining),
    status            : newStatus,
    settlementHistory : history,
  });

  return { newSettled, newRemaining, newStatus };
}

// ── Reverse a settlement ──────────────────────────────────────────────────
export async function reverseSettlement(settlementId, historyIndex) {
  const snap = await getDoc(doc(db, COLLECTIONS.BCAS_SETTLEMENTS, settlementId));
  if (!snap.exists()) throw new Error('Settlement record not found.');

  const data    = snap.data();
  const history = data.settlementHistory || [];
  const entry   = history[historyIndex];
  if (!entry || entry.status !== 'Settlement') throw new Error('Invalid history entry.');

  const reversalAmount = parseFloat(String(entry.amount).replace(/,/g, '')) || 0;
  const newSettled     = (parseFloat(String(data.settledAmount).replace(/,/g, '')) || 0) - reversalAmount;
  const newRemaining   = (parseFloat(String(data.remaining).replace(/,/g, ''))    || 0) + reversalAmount;
  const newStatus      = newSettled <= 0 ? 'Unsettled' : 'Partial';

  // Mark history entry as reversed
  history[historyIndex] = { ...entry, status: 'Reversal', reversedBy: currentUser?.email || '' };

  await updateDocument(COLLECTIONS.BCAS_SETTLEMENTS, settlementId, {
    settledAmount    : fmtNum(Math.max(0, newSettled)),
    remaining        : fmtNum(newRemaining),
    status           : newStatus,
    settlementHistory: history,
  });

  return { newSettled, newRemaining, newStatus };
}

// ── Generate settlement reference number ──────────────────────────────────
async function _genSettlementRef() {
  const branch = currentUser?.branch || 'AAA';
  const date   = todayISO();
  const q = query(
    collection(db, COLLECTIONS.BCAS_SETTLEMENTS),
    where('branchCode', '==', branch),
    where('date', '==', date),
  );
  const snap = await getDocs(q);
  return `SET-${branch}-${refDateStr(date)}-${pad(snap.size + 1, 4)}`;
}

// ── Render settlement table ───────────────────────────────────────────────
export async function renderSettlementTable(filters = {}) {
  const rows  = await loadSettlements(filters);
  const tbody = document.getElementById('BCASsettletable')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;

  tbody.innerHTML = '';

  rows.forEach(s => {
    const tr = tbody.insertRow();
    tr.dataset.id = s.id;

    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'custom-button-bcaseye';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    viewBtn.onclick = () => openSettleRecord(s);
    tr.insertCell(0).appendChild(viewBtn);

    tr.insertCell(1).textContent = toDisplayDate(s.date);
    tr.insertCell(2).textContent = s.template;
    tr.insertCell(3).textContent = s.status;
    tr.insertCell(4).textContent = s.employeeNumber || '';
    tr.insertCell(5).textContent = s.employeeName   || '';
    tr.insertCell(6).textContent = s.amount;
    tr.insertCell(7).textContent = s.settledAmount;
    tr.insertCell(8).textContent = s.remaining;

    const refCell = tr.insertCell(9);
    refCell.textContent = s.referenceNumber || '';
    refCell.style.display = 'none';

    const remCell = tr.insertCell(10);
    remCell.textContent = s.remarks || '';
    remCell.style.display = 'none';
  });
}

// ── Open settle record window ─────────────────────────────────────────────
function openSettleRecord(s) {
  document.getElementById('subcon-tab100-tab16')?.classList.add('active');
  document.getElementById('subcon-tab100-tab15')?.classList.remove('active');

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('setdate',    toDisplayDate(s.date));
  set('setemp',     `${s.employeeNumber || ''}: ${s.employeeName || ''}`);
  set('setamount',  s.amount);
  set('setremarks', s.remarks || '');
  set('setref',     s.referenceNumber || '');
  set('amttoset',   s.remaining);

  // Store id for settle action
  const settleBtn = document.getElementById('settle');
  if (settleBtn) {
    settleBtn.dataset.settlementId = s.id;
    const rem = parseFloat(String(s.remaining).replace(/,/g, '')) || 0;
    const isSettled = rem === 0;
    settleBtn.disabled = isSettled;
    settleBtn.style.backgroundColor = isSettled ? 'gray' : '';
    settleBtn.style.cursor = isSettled ? 'not-allowed' : 'pointer';
  }

  // Render history
  _renderSettlementHistory(s.settlementHistory || [], s.id);
}

function _renderSettlementHistory(history, settlementId) {
  const tbody = document.getElementById('BCASsettletable-individual')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;

  history.forEach((h, idx) => {
    // Show only rows matching this settlement
    Array.from(tbody.rows).forEach(r => {
      r.style.display = r.dataset.settlementId === settlementId ? '' : 'none';
    });
  });

  // Re-render
  tbody.innerHTML = '';
  history.forEach((h, idx) => {
    const tr = tbody.insertRow();
    tr.dataset.settlementId = settlementId;
    tr.insertCell(0).textContent = toDisplayDate(h.date);
    tr.insertCell(1).textContent = h.amount;
    tr.insertCell(2).textContent = h.status;
    tr.insertCell(3).textContent = h.referenceNumber || '';

    if (h.status === 'Settlement') {
      const revBtn = document.createElement('button');
      revBtn.type = 'button';
      revBtn.className = 'custom-button-bcaseye';
      revBtn.innerHTML = '<i class="fas fa-rotate-left"></i>';
      revBtn.onclick = async () => {
        if (!confirm('Reverse this settlement entry?')) return;
        await reverseSettlement(settlementId, idx);
        openSettleRecord(await _reloadSettlement(settlementId));
      };
      tr.insertCell(4).appendChild(revBtn);
    } else {
      tr.insertCell(4).textContent = '—';
    }
  });
}

async function _reloadSettlement(id) {
  const snap = await getDoc(doc(db, COLLECTIONS.BCAS_SETTLEMENTS, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ── Determine transaction date ────────────────────────────────────────────
/**
 * Returns the finalized date if the settlement is finalized,
 * otherwise returns today's date.
 */
export function determineTransactionDate(settlementDate, isFinalized) {
  return isFinalized ? settlementDate : todayISO();
}

// ── Init ──────────────────────────────────────────────────────────────────
export function initBcasSettlements() {
  populateSettlementReportDropdown('settlereporttype', 'settledropdownList');

  const filterBtn = document.getElementById('bcasSETfilter');
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      const filters = {
        dateFrom      : document.getElementById('bcasSETDatefr')?.value || '',
        dateTo        : document.getElementById('bcasSETDateto')?.value  || '',
        report        : document.getElementById('settlereporttype')?.value || '',
        status        : document.getElementById('settledstatus')?.value   || 'All',
        employeeNumber: document.getElementById('settleEmp')?.value       || '',
      };
      renderSettlementTable(filters);
    });
  }

  renderSettlementTable();
}
