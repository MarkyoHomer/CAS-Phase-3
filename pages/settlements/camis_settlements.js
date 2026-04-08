/**
 * camis_settlements.js
 * Module: CAMIS Settlement Setup + CAMIS Settlement Window (Features 5 & 7)
 * Firestore collections: settlement_profiles, bcas_settlements
 */

import {
  addDocument, updateDocument, setDocument, getDocuments,
  toDisplayDate, todayISO, fmtNum,
} from '../shared/db_service.js';
import { db, COLLECTIONS } from '../shared/firebase.js';
import { currentUser } from '../shared/auth_guard.js';
import {
  collection, query, where, orderBy, getDocs, doc, getDoc, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ══════════════════════════════════════════════════════════════════════════
// SETTLEMENT PROFILES (Setup)
// ══════════════════════════════════════════════════════════════════════════

export async function loadProfiles() {
  const snap = await getDocs(collection(db, COLLECTIONS.SETTLEMENT_PROFILES));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveProfile(profile) {
  if (profile.id) {
    await updateDocument(COLLECTIONS.SETTLEMENT_PROFILES, profile.id, profile);
    return profile.id;
  }
  return await addDocument(COLLECTIONS.SETTLEMENT_PROFILES, profile);
}

export async function renderProfilesTable() {
  const profiles = await loadProfiles();
  const tbody = document.getElementById('settlementProfilesTable')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;

  tbody.innerHTML = '';
  profiles.forEach(p => {
    const tr = tbody.insertRow();
    tr.dataset.id = p.id;

    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'custom-button-bcaseye';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    viewBtn.onclick = () => openProfileForm(p);
    tr.insertCell(0).appendChild(viewBtn);

    tr.insertCell(1).textContent = p.mainTemplate || '';
    tr.insertCell(2).textContent = p.isActive ? 'Active' : 'Inactive';
    tr.insertCell(3).textContent = p.requiresEmployee ? 'Yes' : 'No';
    tr.insertCell(4).textContent = p.branchClosingTemplate || '';
  });
}

export function openProfileForm(profile = null) {
  const form = document.getElementById('settlementProfileForm');
  if (!form) return;

  form.dataset.profileId = profile?.id || '';
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

  if (profile) {
    set('profileMainTemplate',    profile.mainTemplate || '');
    set('profileClosingTemplate', profile.branchClosingTemplate || '');
    const activeChk = document.getElementById('profileIsActive');
    const empChk    = document.getElementById('profileRequiresEmployee');
    if (activeChk) activeChk.checked = !!profile.isActive;
    if (empChk)    empChk.checked    = !!profile.requiresEmployee;

    // HO accounts
    _renderHOAccounts(profile.headOfficeAccounts || []);
  } else {
    form.reset();
    _renderHOAccounts([]);
  }

  form.style.display = 'block';
}

export async function submitProfileForm() {
  const form = document.getElementById('settlementProfileForm');
  if (!form) return;

  const profile = {
    id                  : form.dataset.profileId || null,
    mainTemplate        : document.getElementById('profileMainTemplate')?.value.trim()    || '',
    branchClosingTemplate: document.getElementById('profileClosingTemplate')?.value.trim() || '',
    isActive            : document.getElementById('profileIsActive')?.checked ?? true,
    requiresEmployee    : document.getElementById('profileRequiresEmployee')?.checked ?? false,
    headOfficeAccounts  : _collectHOAccounts(),
    updatedBy           : currentUser?.email || '',
  };

  if (!profile.mainTemplate) { alert('Main template is required.'); return; }

  await saveProfile(profile);
  form.style.display = 'none';
  renderProfilesTable();
}

function _renderHOAccounts(accounts) {
  const tbody = document.getElementById('hoAccountsTable')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;
  tbody.innerHTML = '';
  accounts.forEach(a => _addHOAccountRow(a.account, a.reverseNormality));
}

function _addHOAccountRow(account = '', reverseNormality = false) {
  const tbody = document.getElementById('hoAccountsTable')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;
  const tr = tbody.insertRow();
  tr.innerHTML = `
    <td><input type="text" value="${account}" placeholder="Account code" style="width:100%;"></td>
    <td style="text-align:center;">
      <input type="checkbox" ${reverseNormality ? 'checked' : ''}>
    </td>
    <td>
      <button type="button" onclick="this.closest('tr').remove()" style="color:red;border:none;background:none;cursor:pointer;">
        <i class="fas fa-trash"></i>
      </button>
    </td>`;
}

function _collectHOAccounts() {
  const rows = document.getElementById('hoAccountsTable')?.getElementsByTagName('tbody')[0]?.rows || [];
  return Array.from(rows).map(r => ({
    account         : r.cells[0].querySelector('input')?.value.trim() || '',
    reverseNormality: r.cells[1].querySelector('input')?.checked ?? false,
  })).filter(a => a.account);
}

// Expose for inline onclick
window.addHOAccountRow = () => _addHOAccountRow();

// ══════════════════════════════════════════════════════════════════════════
// CAMIS SETTLEMENT WINDOW (multi-branch view)
// ══════════════════════════════════════════════════════════════════════════

export async function loadCamisSettlements(filters = {}) {
  let constraints = [];

  if (filters.dateFrom) constraints.push(where('date', '>=', filters.dateFrom));
  if (filters.dateTo)   constraints.push(where('date', '<=', filters.dateTo));
  if (filters.area)     constraints.push(where('area',   '==', filters.area));
  if (filters.branch)   constraints.push(where('branchCode', '==', filters.branch));

  constraints.push(orderBy('date', 'desc'));

  const q = query(collection(db, COLLECTIONS.BCAS_SETTLEMENTS), ...constraints);
  const snap = await getDocs(q);
  let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Client-side status filter (multi-select)
  if (filters.statuses?.length) {
    rows = rows.filter(r => filters.statuses.includes(r.status));
  }
  if (filters.employeeNumber) {
    rows = rows.filter(r => r.employeeNumber?.toLowerCase().includes(filters.employeeNumber.toLowerCase()));
  }
  if (filters.report) {
    rows = rows.filter(r => r.template?.toLowerCase().includes(filters.report.toLowerCase()));
  }

  return rows;
}

export async function renderCamisSettlementTable(filters = {}) {
  const rows  = await loadCamisSettlements(filters);
  const tbody = document.getElementById('CAMISsettletable')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;

  tbody.innerHTML = '';

  rows.forEach(s => {
    const tr = tbody.insertRow();
    tr.dataset.id = s.id;

    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'custom-button-bcaseye';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    viewBtn.onclick = () => openCamisSettleRecord(s);
    tr.insertCell(0).appendChild(viewBtn);

    tr.insertCell(1).textContent = toDisplayDate(s.date);
    tr.insertCell(2).textContent = s.area         || '';
    tr.insertCell(3).textContent = s.branchCode   || '';
    tr.insertCell(4).textContent = s.template     || '';
    tr.insertCell(5).textContent = s.employeeNumber || '';
    tr.insertCell(6).textContent = s.employeeName   || '';
    tr.insertCell(7).textContent = s.amount;
    tr.insertCell(8).textContent = s.settledAmount;
    tr.insertCell(9).textContent = s.remaining;
    tr.insertCell(10).textContent = s.status;
  });
}

function openCamisSettleRecord(s) {
  // Reuse BCAS settle record UI if present, or open CAMIS-specific overlay
  const overlay = document.getElementById('camisSettleOverlay');
  if (!overlay) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('camisSetDate',   toDisplayDate(s.date));
  set('camisSetBranch', s.branchCode || '');
  set('camisSetArea',   s.area       || '');
  set('camisSetEmp',    `${s.employeeNumber || ''}: ${s.employeeName || ''}`);
  set('camisSetAmount', s.amount);
  set('camisSetSettled', s.settledAmount);
  set('camisSetRemaining', s.remaining);
  set('camisSetStatus', s.status);

  overlay.dataset.settlementId = s.id;
  overlay.classList.add('show');
}

// ── Excel export ──────────────────────────────────────────────────────────
export async function exportCamisSettlementsExcel(filters = {}) {
  const rows = await loadCamisSettlements(filters);
  if (!rows.length) { alert('No data to export.'); return; }

  const data = rows.map(r => ({
    Date            : toDisplayDate(r.date),
    Area            : r.area         || '',
    Branch          : r.branchCode   || '',
    Template        : r.template     || '',
    'Employee No'   : r.employeeNumber || '',
    'Employee Name' : r.employeeName   || '',
    Amount          : r.amount,
    'Settled Amount': r.settledAmount,
    Remaining       : r.remaining,
    Status          : r.status,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Settlements');
  XLSX.writeFile(wb, `CAMIS_Settlements_${todayISO()}.xlsx`);
}

// ── Init ──────────────────────────────────────────────────────────────────
export function initCamisSettlements() {
  renderProfilesTable();
  renderCamisSettlementTable();
}
