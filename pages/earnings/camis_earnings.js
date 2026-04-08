/**
 * camis_earnings.js
 * Module: CAMIS Earnings (Features 8, 9, 10)
 * - Manage Earning Setup (withActivation flag)
 * - Record Manual Incentives
 * - Earnings Report with employee type filter
 * Firestore collections: earning_setup, employee_earnings
 */

import {
  addDocument, updateDocument, getDocuments,
  toDisplayDate, todayISO, fmtNum,
} from '../shared/db_service.js';
import { db, COLLECTIONS } from '../shared/firebase.js';
import { currentUser } from '../shared/auth_guard.js';
import {
  collection, query, where, orderBy, getDocs, doc, getDoc, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ══════════════════════════════════════════════════════════════════════════
// EARNING SETUP
// ══════════════════════════════════════════════════════════════════════════

export async function loadEarningSetup() {
  const snap = await getDocs(collection(db, COLLECTIONS.EARNING_SETUP));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveEarningSetup(profile) {
  if (profile.id) {
    await updateDocument(COLLECTIONS.EARNING_SETUP, profile.id, profile);
    return profile.id;
  }
  return await addDocument(COLLECTIONS.EARNING_SETUP, profile);
}

export async function renderEarningSetupTable() {
  const items = await loadEarningSetup();
  const tbody = document.getElementById('earningSetupTable')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;

  tbody.innerHTML = '';
  items.forEach(item => {
    const tr = tbody.insertRow();
    tr.dataset.id = item.id;

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'custom-button-bcaseye';
    editBtn.innerHTML = '<i class="fas fa-pen"></i>';
    editBtn.onclick = () => openEarningSetupForm(item);
    tr.insertCell(0).appendChild(editBtn);

    tr.insertCell(1).textContent = item.name || '';
    tr.insertCell(2).textContent = item.withActivation ? 'Yes' : 'No';
    tr.insertCell(3).textContent = item.isActive ? 'Active' : 'Inactive';
  });
}

export function openEarningSetupForm(item = null) {
  const form = document.getElementById('earningSetupForm');
  if (!form) return;

  form.dataset.itemId = item?.id || '';
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

  if (item) {
    set('earningItemName', item.name || '');
    const actChk = document.getElementById('earningWithActivation');
    const activeChk = document.getElementById('earningIsActive');
    if (actChk)    actChk.checked    = !!item.withActivation;
    if (activeChk) activeChk.checked = !!item.isActive;
  } else {
    form.reset();
  }

  form.style.display = 'block';
}

export async function submitEarningSetupForm() {
  const form = document.getElementById('earningSetupForm');
  if (!form) return;

  const item = {
    id             : form.dataset.itemId || null,
    name           : document.getElementById('earningItemName')?.value.trim() || '',
    withActivation : document.getElementById('earningWithActivation')?.checked ?? false,
    isActive       : document.getElementById('earningIsActive')?.checked ?? true,
    updatedBy      : currentUser?.email || '',
  };

  if (!item.name) { alert('Earning item name is required.'); return; }

  await saveEarningSetup(item);
  form.style.display = 'none';
  renderEarningSetupTable();
}

// ══════════════════════════════════════════════════════════════════════════
// EMPLOYEE EARNINGS (Manual Incentives)
// ══════════════════════════════════════════════════════════════════════════

export async function saveEmployeeEarnings(entry) {
  // entry: { date, item, itemId, employees: [{employeeNumber, employeeName, amount}], remarks }
  if (!entry.employees?.length) throw new Error('At least one employee is required.');
  if ((entry.remarks || '').length > 50) throw new Error('Remarks must be 50 characters or less.');

  // Check if activation is required
  const itemSnap = await getDoc(doc(db, COLLECTIONS.EARNING_SETUP, entry.itemId));
  const withActivation = itemSnap.exists() ? itemSnap.data().withActivation : false;

  const total = entry.employees.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

  const record = {
    date           : entry.date,
    item           : entry.item,
    itemId         : entry.itemId,
    employees      : entry.employees,
    totalAmount    : total,
    remarks        : entry.remarks || '',
    status         : withActivation ? 'Pending Activation' : 'Approved',
    withActivation,
    createdBy      : currentUser?.email || '',
  };

  if (withActivation) {
    // Create activation request — save as pending
    record.activationRequest = {
      requestedBy : currentUser?.email || '',
      requestedAt : new Date().toISOString(),
      status      : 'Pending',
    };
  }

  const id = await addDocument(COLLECTIONS.EMPLOYEE_EARNINGS, record);
  return { id, ...record };
}

export async function approveEarningActivation(earningId) {
  await updateDocument(COLLECTIONS.EMPLOYEE_EARNINGS, earningId, {
    status: 'Approved',
    'activationRequest.status'    : 'Approved',
    'activationRequest.approvedBy': currentUser?.email || '',
    'activationRequest.approvedAt': new Date().toISOString(),
  });
}

export async function rejectEarningActivation(earningId, reason = '') {
  await updateDocument(COLLECTIONS.EMPLOYEE_EARNINGS, earningId, {
    status: 'Rejected',
    'activationRequest.status'    : 'Rejected',
    'activationRequest.rejectedBy': currentUser?.email || '',
    'activationRequest.rejectedAt': new Date().toISOString(),
    'activationRequest.reason'    : reason,
  });
}

// ── Render employee earnings entry form ───────────────────────────────────
export function renderEarningEmployeeRows(employees = []) {
  const tbody = document.getElementById('earningEmployeeTable')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;

  tbody.innerHTML = '';
  employees.forEach((e, idx) => {
    const tr = tbody.insertRow();
    tr.innerHTML = `
      <td>${e.employeeNumber}</td>
      <td>${e.employeeName}</td>
      <td>
        <input type="number" step="0.01" min="0" value="${e.amount || ''}"
          oninput="updateEarningTotal()" data-idx="${idx}"
          style="width:100px;text-align:right;">
      </td>
      <td>
        <button type="button" onclick="removeEarningEmployee(${idx})"
          style="color:red;border:none;background:none;cursor:pointer;">
          <i class="fas fa-trash"></i>
        </button>
      </td>`;
  });

  updateEarningTotal();
}

window.updateEarningTotal = function () {
  const inputs = document.querySelectorAll('#earningEmployeeTable tbody input[type="number"]');
  let total = 0;
  inputs.forEach(inp => { total += parseFloat(inp.value) || 0; });
  const totalEl = document.getElementById('earningTotalAmount');
  if (totalEl) totalEl.value = fmtNum(total);
};

// ══════════════════════════════════════════════════════════════════════════
// EARNINGS REPORT (Feature 10)
// ══════════════════════════════════════════════════════════════════════════

export async function loadEarningsReport(filters = {}) {
  let constraints = [];

  if (filters.dateFrom) constraints.push(where('date', '>=', filters.dateFrom));
  if (filters.dateTo)   constraints.push(where('date', '<=', filters.dateTo));
  if (filters.itemId)   constraints.push(where('itemId', '==', filters.itemId));
  if (filters.status && filters.status !== 'All') {
    constraints.push(where('status', '==', filters.status));
  }

  constraints.push(orderBy('date', 'desc'));

  const q = query(collection(db, COLLECTIONS.EMPLOYEE_EARNINGS), ...constraints);
  const snap = await getDocs(q);
  const records = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Flatten to per-employee rows
  let rows = [];
  records.forEach(r => {
    (r.employees || []).forEach(e => {
      rows.push({
        date          : r.date,
        item          : r.item,
        employeeNumber: e.employeeNumber,
        employeeName  : e.employeeName,
        employeeType  : e.employeeType || 'Associate',
        amount        : e.amount,
        status        : r.status,
        remarks       : r.remarks,
      });
    });
  });

  // Employee type filter
  if (filters.employeeType && filters.employeeType !== 'Both') {
    if (filters.employeeType === 'Security Guard') {
      rows = rows.filter(r => r.employeeType === 'Security Guard');
    } else if (filters.employeeType === 'Associate and Regular SG') {
      rows = rows.filter(r => r.employeeType !== 'Security Guard' || r.employeeType === 'Regular SG');
    }
  }

  return rows;
}

export async function renderEarningsReport(filters = {}) {
  const rows  = await loadEarningsReport(filters);
  const tbody = document.getElementById('earningsReportTable')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;

  tbody.innerHTML = '';

  // Columns are always the same regardless of status filter
  rows.forEach(r => {
    const tr = tbody.insertRow();
    tr.insertCell(0).textContent = toDisplayDate(r.date);
    tr.insertCell(1).textContent = r.item;
    tr.insertCell(2).textContent = r.employeeNumber;
    tr.insertCell(3).textContent = r.employeeName;
    tr.insertCell(4).textContent = r.employeeType;
    tr.insertCell(5).textContent = fmtNum(r.amount);
    tr.insertCell(6).textContent = r.status;
    tr.insertCell(7).textContent = r.remarks;
  });
}

export async function exportEarningsReportExcel(filters = {}) {
  const rows = await loadEarningsReport(filters);
  if (!rows.length) { alert('No data to export.'); return; }

  const data = rows.map(r => ({
    Date            : toDisplayDate(r.date),
    Item            : r.item,
    'Employee No'   : r.employeeNumber,
    'Employee Name' : r.employeeName,
    'Employee Type' : r.employeeType,
    Amount          : r.amount,
    Status          : r.status,
    Remarks         : r.remarks,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Earnings Report');
  XLSX.writeFile(wb, `Earnings_Report_${todayISO()}.xlsx`);
}

// ── Init ──────────────────────────────────────────────────────────────────
export function initCamisEarnings() {
  renderEarningSetupTable();

  const today = todayISO();
  const fromEl = document.getElementById('earningsReportFrom');
  const toEl   = document.getElementById('earningsReportTo');
  if (fromEl) fromEl.value = today;
  if (toEl)   toEl.value   = today;

  const filterBtn = document.getElementById('earningsReportFilter');
  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      renderEarningsReport({
        dateFrom    : fromEl?.value || '',
        dateTo      : toEl?.value   || '',
        employeeType: document.getElementById('earningsEmpTypeFilter')?.value || 'Both',
        status      : document.getElementById('earningsStatusFilter')?.value  || 'All',
      });
    });
  }

  const exportBtn = document.getElementById('earningsReportExport');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportEarningsReportExcel({
        dateFrom    : fromEl?.value || '',
        dateTo      : toEl?.value   || '',
        employeeType: document.getElementById('earningsEmpTypeFilter')?.value || 'Both',
        status      : document.getElementById('earningsStatusFilter')?.value  || 'All',
      });
    });
  }
}
