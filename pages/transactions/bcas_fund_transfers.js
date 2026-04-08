/**
 * bcas_fund_transfers.js
 * Module: BCAS Fund Transfers
 * Handles save, fetch, update-status, void for fund transfer records.
 * Firestore collection: bcas_fund_transfers
 */

import {
  addDocument, updateDocument, getDocuments,
  toDisplayDate, toDisplayDateTime, todayISO, refDateStr, pad, fmtNum,
} from '../shared/db_service.js';
import { db, COLLECTIONS } from '../shared/firebase.js';
import { currentUser } from '../shared/auth_guard.js';
import {
  collection, query, where, orderBy, getDocs, doc, getDoc, updateDoc, serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── Save a new fund transfer record ──────────────────────────────────────
export async function saveFundTransfer(fields) {
  const branch = currentUser?.branch || document.getElementById('Bcasbranch')?.value || 'AAA';
  const date   = todayISO();

  // Count existing FTs for this branch+date to generate sequence
  const q = query(
    collection(db, COLLECTIONS.BCAS_FUND_TRANSFERS),
    where('branchCode', '==', branch),
    where('date', '==', date),
  );
  const snap = await getDocs(q);
  const seq  = String(snap.size + 1).padStart(3, '0');
  const refNo = `FT-${branch}${refDateStr(date)}-${seq}-Pending`;

  const ft = {
    branchCode   : branch,
    date,
    type         : fields.type,         // Send | Receive | Deposit | Withdraw
    transactionId: fields.transactionId,
    origin       : fields.origin,
    destination  : fields.destination,
    amount       : fields.amount,
    courier      : fields.courier,
    memo         : fields.memo,
    status       : 'Pending',
    updateStatus : 'Not Updated',
    referenceNo  : refNo,
    area         : fields.area || currentUser?.area || '',
    createdBy    : currentUser?.email || '',
  };

  const id = await addDocument(COLLECTIONS.BCAS_FUND_TRANSFERS, ft);
  return { id, ...ft };
}

// ── Fetch fund transfers for a branch+date ────────────────────────────────
export async function fetchFundTransfers(date) {
  const branch = currentUser?.branch || document.getElementById('Bcasbranch')?.value || 'AAA';
  const q = query(
    collection(db, COLLECTIONS.BCAS_FUND_TRANSFERS),
    where('branchCode', '==', branch),
    where('date', '==', date),
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0));
}

// ── Update fund transfer status (Active / Voided) ─────────────────────────
export async function updateFundTransferStatus(id, newStatus) {
  await updateDocument(COLLECTIONS.BCAS_FUND_TRANSFERS, id, {
    status      : newStatus,
    updateStatus: 'Updated',
    updatedAt   : serverTimestamp(),
    updatedBy   : currentUser?.email || '',
  });
}

// ── Fetch from CAMIS ft_records into BCAS table ───────────────────────────
export async function fetchFromCamisFT(date) {
  const branch = (currentUser?.branch || document.getElementById('Bcasbranch')?.value || '').toUpperCase();

  const q = query(
    collection(db, COLLECTIONS.FT_RECORDS),
    where('date', '==', date),
  );
  const snap = await getDocs(q);
  const records = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Filter: origin or destination matches this branch
  const relevant = records.filter(r =>
    r.origin?.toUpperCase() === branch || r.destination?.toUpperCase() === branch
  );

  // Get existing FT ids to avoid duplicates
  const existing = await fetchFundTransfers(date);
  const existingIds = new Set(existing.map(e => e.transactionId));

  let added = 0;
  for (const r of relevant) {
    if (r.status === 'Voided' && !existingIds.has(r.transactionId)) continue;

    // Update voided status on existing record
    if ((r.status === 'Voided' || r.status === 'Pending-Void') && existingIds.has(r.transactionId)) {
      const match = existing.find(e => e.transactionId === r.transactionId);
      if (match && (match.status === 'Pending' || match.status === 'Active')) {
        await updateDocument(COLLECTIONS.BCAS_FUND_TRANSFERS, match.id, { status: 'Voided', updateStatus: 'Updated' });
      }
      continue;
    }

    // New valid record
    if (!existingIds.has(r.transactionId) && (r.status === 'Pending' || r.status === 'In-Transit')) {
      let type = r.type;
      if (r.destination?.toUpperCase() === branch && r.type === 'Send') type = 'Receive';
      else if (r.origin?.toUpperCase() !== branch) type = 'Withdraw';

      await saveFundTransfer({
        type,
        transactionId: r.transactionId,
        origin       : r.origin,
        destination  : r.destination,
        amount       : r.amount,
        courier      : r.courier,
        memo         : r.memo,
        area         : r.area || '',
      });
      added++;
    }
  }

  return added;
}

// ── Render fund transfers table ───────────────────────────────────────────
export async function renderFundTransfers(date) {
  const rows  = await fetchFundTransfers(date);
  const tbody = document.getElementById('BCASfttable')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;

  tbody.innerHTML = '';

  rows.forEach(ft => {
    const tr = tbody.insertRow();
    tr.dataset.id = ft.id;

    // Upload button
    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'custom-button-bcaseye';
    uploadBtn.style.width = '40px';
    uploadBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i>';
    uploadBtn.disabled = ft.status !== 'Pending';
    if (ft.status !== 'Pending') {
      uploadBtn.style.backgroundColor = 'gray';
      uploadBtn.style.cursor = 'not-allowed';
    }
    uploadBtn.onclick = () => confirmUploadFT(ft.id, ft);
    tr.insertCell(0).appendChild(uploadBtn);

    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'custom-button-bcaseye';
    copyBtn.style.width = '40px';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.onclick = () => copyFTOfflineCode(ft);
    tr.insertCell(1).appendChild(copyBtn);

    tr.insertCell(2).textContent  = toDisplayDate(ft.date);
    tr.insertCell(3).textContent  = ft.type;
    tr.insertCell(4).textContent  = ft.transactionId;
    tr.insertCell(5).textContent  = ft.origin;
    tr.insertCell(6).textContent  = ft.destination;
    tr.insertCell(7).textContent  = ft.amount;
    tr.insertCell(8).textContent  = ft.courier;
    tr.insertCell(9).textContent  = ft.memo;
    tr.insertCell(10).textContent = ft.status;
    tr.insertCell(11).textContent = ft.updateStatus;
    tr.insertCell(12).textContent = ft.updatedAt ? toDisplayDateTime(ft.updatedAt) : '--';

    const refCell = tr.insertCell(13);
    refCell.textContent = ft.referenceNo || '';
    refCell.style.display = 'none';

    const noCell = tr.insertCell(14);
    noCell.textContent = String(tbody.rows.length).padStart(3, '0');
    noCell.style.display = 'none';

    const areaCell = tr.insertCell(15);
    areaCell.textContent = ft.area || '';
    areaCell.style.display = 'none';
  });
}

// ── Copy offline update code ──────────────────────────────────────────────
function copyFTOfflineCode(ft) {
  const rowData = [
    ft.date, ft.type, ft.transactionId, ft.origin, ft.destination,
    ft.amount, ft.courier, ft.memo, ft.status, ft.updateStatus,
    ft.referenceNo || '', ft.area || '',
  ].join('|');

  const encoded = btoa(rowData);
  const text = `Offline update code of: ${ft.branchCode} | ${ft.type} | ${ft.transactionId} | ${ft.date}\n\n${encoded}`;

  navigator.clipboard.writeText(text).then(() => {
    showBcasNotification('Offline update code copied to clipboard.', 'blue');
  });
}

// ── Confirm upload (status update) ───────────────────────────────────────
function confirmUploadFT(id, ft) {
  const msg = document.getElementById('bcasretrymessage');
  if (msg) msg.textContent = `You are uploading ${ft.type} Transaction. Do you want to proceed?`;
  const modal = document.getElementById('bcasftretryconfirmation');
  if (modal) {
    modal.classList.add('show');
    // Store id for confirm handler
    modal.dataset.ftId = id;
  }
}

// ── Notification helper ───────────────────────────────────────────────────
function showBcasNotification(msg, color = 'green') {
  const box  = document.getElementById('xnotification');
  const text = document.getElementById('xnotify');
  if (!box || !text) return;
  box.style.bottom = '75px';
  box.style.right  = '75px';
  box.style.width  = '300px';
  box.style.backgroundColor = color;
  text.innerHTML = `<i class="fa-solid fa-circle-info" style="margin-right:10px;font-size:20px;color:white"></i>${msg}`;
  box.style.display = 'flex';
  setTimeout(() => { box.style.display = 'none'; }, 3500);
}

// ── Init ──────────────────────────────────────────────────────────────────
export function initBcasFundTransfers() {
  const datePicker = document.getElementById('bcasftDate');
  if (!datePicker) return;

  datePicker.value = todayISO();
  renderFundTransfers(todayISO());

  datePicker.addEventListener('change', () => {
    renderFundTransfers(datePicker.value);
  });
}
