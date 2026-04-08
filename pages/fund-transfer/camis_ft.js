/**
 * camis_ft.js
 * Module: CAMIS Fund Transfer List & Recon
 * Handles add, update-status, filter, download for ft_records collection.
 * Firestore collection: ft_records
 */

import {
  addDocument, updateDocument,
  toDisplayDate, todayISO,
} from '../shared/db_service.js';
import { db, COLLECTIONS } from '../shared/firebase.js';
import { currentUser } from '../shared/auth_guard.js';
import {
  collection, query, where, getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── Load FT records with filters ──────────────────────────────────────────
export async function loadFTRecords(filters = {}) {
  let constraints = [];

  // Only use date range in Firestore query (same field = no composite index needed)
  if (filters.dateFrom) constraints.push(where('date', '>=', filters.dateFrom));
  if (filters.dateTo)   constraints.push(where('date', '<=', filters.dateTo));

  const q = query(collection(db, COLLECTIONS.FT_RECORDS), ...constraints);
  const snap = await getDocs(q);
  let rows = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));

  // All other filters applied client-side
  if (filters.area && filters.area !== 'All Area') {
    rows = rows.filter(r => r.area?.toLowerCase() === filters.area.toLowerCase());
  }
  if (filters.status && filters.status !== 'All Status') {
    rows = rows.filter(r => r.status?.toLowerCase() === filters.status.toLowerCase());
  }
  if (filters.branch && filters.branch !== 'All Branch') {
    const b = filters.branch.toLowerCase();
    rows = rows.filter(r =>
      r.origin?.toLowerCase().includes(b) || r.destination?.toLowerCase().includes(b)
    );
  }
  if (filters.type && filters.type !== 'All Transfers') {
    if (filters.type === 'All Bank Transfers') {
      rows = rows.filter(r => r.type === 'Deposit' || r.type === 'Withdraw');
    } else {
      rows = rows.filter(r => r.type?.toLowerCase() === filters.type.toLowerCase());
    }
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    rows = rows.filter(r =>
      r.transactionId?.toLowerCase().includes(s) ||
      r.amount?.toString().includes(s) ||
      r.memo?.toLowerCase().includes(s) ||
      r.courier?.toLowerCase().includes(s)
    );
  }

  return rows;
}

// ── Add new FT record (CAMIS side) ────────────────────────────────────────
export async function addFTRecord(data) {
  const ft = {
    date         : data.date,
    type         : data.type,
    transactionId: data.transactionId || _generateTxnId(),
    origin       : data.origin,
    destination  : data.destination,
    amount       : data.amount,
    courier      : data.courier,
    memo         : data.memo,
    bank         : data.bank || '',
    status       : 'Pending',
    area         : data.area || currentUser?.area || '',
    createdBy    : currentUser?.email || '',
    reviewedBy   : '',
    reviewedDate : '',
    clearedBy    : '',
    clearedDate  : '',
    remarks      : '',
  };

  const id = await addDocument(COLLECTIONS.FT_RECORDS, ft);
  return { id, ...ft };
}

// ── Update FT record status ───────────────────────────────────────────────
export async function updateFTStatus(id, newStatus, remarks = '') {
  const fields = {
    status   : newStatus,
    remarks,
    updatedBy: currentUser?.email || '',
  };

  // Track who reviewed/cleared
  if (newStatus === 'In-Transit' || newStatus === 'Received') {
    fields.reviewedBy   = currentUser?.email || '';
    fields.reviewedDate = todayISO();
  }
  if (newStatus === 'Acknowledged' || newStatus === 'Denied') {
    fields.clearedBy   = currentUser?.email || '';
    fields.clearedDate = todayISO();
  }

  await updateDocument(COLLECTIONS.FT_RECORDS, id, fields);
}

// ── Render FT list table ──────────────────────────────────────────────────
export async function renderFTTable(filters = {}) {
  const rows  = await loadFTRecords(filters);
  const tbody = document.getElementById('ft-data-table')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;

  tbody.innerHTML = '';

  rows.forEach((ft, idx) => {
    const tr = tbody.insertRow();
    tr.dataset.id = ft.id;

    // Action cell: View + Copy buttons
    const actionCell = tr.insertCell(0);

    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'custom-button-bcaseye';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    viewBtn.onclick = (e) => openFTOverlay(e, ft);
    actionCell.appendChild(viewBtn);

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'custom-button-copy';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.onclick = (e) => {
      if (typeof encryptRow === 'function') {
        encryptRow('ft-data-table', idx + 1, e, 1, 2, 5, 6);
      }
    };
    actionCell.appendChild(copyBtn);

    tr.insertCell(1).textContent  = toDisplayDate(ft.date);
    tr.insertCell(2).textContent  = ft.type;
    tr.insertCell(3).textContent  = ft.transactionId;
    tr.insertCell(4).textContent  = ft.amount;
    tr.insertCell(5).textContent  = ft.origin;
    tr.insertCell(6).textContent  = ft.destination;
    tr.insertCell(7).textContent  = ft.courier;
    tr.insertCell(8).textContent  = ft.memo;
    tr.insertCell(9).textContent  = ft.createdBy;
    tr.insertCell(10).textContent = ft.status;
    tr.insertCell(11).textContent = ft.area;

    // Hidden cells for recon
    const hiddenRemarks = tr.insertCell(12);
    hiddenRemarks.textContent = ft.remarks || '';
    hiddenRemarks.style.display = 'none';

    const hiddenRby = tr.insertCell(13);
    hiddenRby.textContent = ft.reviewedBy || '';
    hiddenRby.style.display = 'none';

    const hiddenRdate = tr.insertCell(14);
    hiddenRdate.textContent = ft.reviewedDate || '';
    hiddenRdate.style.display = 'none';

    const hiddenCby = tr.insertCell(15);
    hiddenCby.textContent = ft.clearedBy || '';
    hiddenCby.style.display = 'none';

    const hiddenCdate = tr.insertCell(16);
    hiddenCdate.textContent = ft.clearedDate || '';
    hiddenCdate.style.display = 'none';
  });
}

// ── Open FT overlay (view/update) ────────────────────────────────────────
function openFTOverlay(event, ft) {
  event.preventDefault();
  const overlayId = 'overlay2';
  const overlay = document.getElementById(overlayId);
  if (!overlay) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
  set('viewtrnxtype',   ft.type);
  set('viewamount',     ft.amount);
  set('vieworigin',     ft.origin);
  set('viewdest',       ft.destination);
  set('viewcftcourier', ft.courier);
  set('viewcftmemo',    ft.memo);
  set('viewtrnxid',     ft.transactionId);
  set('viewcftremarks', ft.remarks || '');
  set('viewcftcby',     ft.createdBy);
  set('viewcftcdate',   toDisplayDate(ft.date));
  set('viewcftrby',     ft.reviewedBy || '');
  set('viewcftrdate',   ft.reviewedDate || '');
  set('viewcftclby',    ft.clearedBy || '');
  set('viewcftcldate',  ft.clearedDate || '');
  set('viewcftbank',    (ft.type === 'Withdraw' || ft.type === 'Deposit') ? (ft.bank || ft.memo) : '');

  // Header title
  const headr = document.getElementById('headr');
  if (headr) headr.value = `${ft.type} Transaction`;

  // Status badge — keep heading status
  const statusEl = document.getElementById(`NStatus-${overlayId}`);
  if (statusEl) statusEl.textContent = ft.status;

  // Store id for status update actions
  overlay.dataset.ftId     = ft.id;
  overlay.dataset.ftStatus = ft.status;

  // Role-based buttons
  _applyRoleButtons(overlayId, ft.status, ft.type);

  overlay.classList.add('show');
}

// ── Role-based button visibility ─────────────────────────────────────────
function _applyRoleButtons(overlayId, status, type) {
  const role = currentUser?.role || sessionStorage.getItem('userRole') || '';
  const ids  = ['flag','ack','deny','cancel-denied','cancel-new','cancel-ack','save','cancel-flag'];
  const btns = {};
  ids.forEach(k => {
    const el = document.getElementById(`FT-btn-${k}-${overlayId}`);
    if (el) { el.style.display = 'none'; btns[k] = el; }
  });

  switch (role) {
    case 'zaa-aas': case 'zab-aas': case 'admin':
      if (btns.save) btns.save.style.display = 'block';
      if ((status === 'Pending' || status === 'In-Transit') && btns['cancel-new'])
        btns['cancel-new'].style.display = 'block';
      break;
    case 'cru':
      if (status === 'Under Review' && btns['cancel-flag']) btns['cancel-flag'].style.display = 'block';
      else if (btns.flag) btns.flag.style.display = 'block';
      break;
    case 'cmd':
      if (status === 'In-Transit' && type !== 'Send') {
        if (btns.ack) btns.ack.style.display = 'block';
        if (btns.deny) btns.deny.style.display = 'block';
      }
      if (status === 'Acknowledged' && btns['cancel-ack']) btns['cancel-ack'].style.display = 'block';
      if (status === 'Denied' && btns['cancel-denied']) btns['cancel-denied'].style.display = 'block';
      break;
  }
}

// ── Confirm status update from overlay ───────────────────────────────────
export async function confirmFTStatusUpdate(overlayId, newStatus) {
  const overlay = document.getElementById(overlayId || 'overlay2');
  if (!overlay) return;
  const id = overlay.dataset.ftId;
  if (!id) return;

  await updateFTStatus(id, newStatus);
  overlay.classList.remove('show');
  renderFTTable(_getCurrentFilters());
}

// ── Excel download ────────────────────────────────────────────────────────
export async function downloadFTExcel(filters = {}) {
  const rows = await loadFTRecords(filters);
  if (!rows.length) { alert('No data to export.'); return; }

  const data = rows.map(r => ({
    Date         : toDisplayDate(r.date),
    Type         : r.type,
    'Txn ID'     : r.transactionId,
    Amount       : r.amount,
    Origin       : r.origin,
    Destination  : r.destination,
    Courier      : r.courier,
    Memo         : r.memo,
    Status       : r.status,
    Area         : r.area,
    'Created By' : r.createdBy,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'FT List');
  XLSX.writeFile(wb, `FT_List_${todayISO()}.xlsx`);
}

// ── Get current filter values ─────────────────────────────────────────────
function _getCurrentFilters() {
  return {
    dateFrom: document.getElementById('datefromFTlist')?.value || '',
    dateTo  : document.getElementById('datetoFTlist')?.value   || '',
    area    : document.getElementById('ft-Area-drop')?.value   || '',
    branch  : document.getElementById('ft-branch-drop')?.value || '',
    status  : document.getElementById('ft-status-drop')?.value || '',
    type    : document.getElementById('ft-trns-drop')?.value   || '',
    search  : document.getElementById('searchftall')?.value    || '',
  };
}

// ── Generate transaction ID ───────────────────────────────────────────────
function _generateTxnId() {
  return 'TXN-' + Date.now().toString(36).toUpperCase();
}

// ── Init ──────────────────────────────────────────────────────────────────
export function initCamisFT() {
  const today = todayISO();
  const fromEl = document.getElementById('datefromFTlist');
  const toEl   = document.getElementById('datetoFTlist');
  if (fromEl) fromEl.value = today;
  if (toEl)   toEl.value   = today;

  renderFTTable({ dateFrom: today, dateTo: today });

  // Search input — re-query Firestore with current filters + search term
  const searchEl = document.getElementById('searchftall');
  if (searchEl) searchEl.addEventListener('input', () => renderFTTable(_getCurrentFilters()));

  // Download button
  const dlBtn = document.getElementById('downloadftbtn');
  if (dlBtn) dlBtn.addEventListener('click', () => downloadFTExcel(_getCurrentFilters()));
}
