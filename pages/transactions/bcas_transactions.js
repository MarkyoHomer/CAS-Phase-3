/**
 * bcas_transactions.js
 * Module: BCAS Transactions
 * Handles save, view, reverse, filter for the BCAStransactions table.
 * All data persisted to Firestore collection: bcas_transactions
 */

import {
  addDocument, updateDocument, getDocuments,
  toDisplayDate, todayISO, todayDisplay, refDateStr, pad, fmtNum,
} from '../shared/db_service.js';
import { COLLECTIONS } from '../shared/firebase.js';
import { currentUser } from '../shared/auth_guard.js';
import {
  query, collection, where, getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { db } from '../shared/firebase.js';

// ── State ─────────────────────────────────────────────────────────────────
let _selectedDate = todayISO();   // yyyy-mm-dd
let _transactions = [];           // cached for current date

// ── Cash Shortage reason options ─────────────────────────────────────────
export const REASON_OPTIONS = {
  '9999_group' : ['Counting Error', 'PEPP Transaction', 'Bank Transaction', 'Others'],
  '5999_group' : ['Counting Error', 'Others'],
};

/** Determine which reason group an account code belongs to */
export function getShortageGroup(accountCode) {
  if (['9999', 'MNL-9999'].includes(accountCode)) return '9999_group';
  if (['5999', 'MNL-5999'].includes(accountCode)) return '5999_group';
  return null;
}

/**
 * Build auto-remarks for a cash shortage tag.
 * Same date  → "Cash shortage incurred on {date} by {empName}: {reason}"
 * Diff date  → "Cash shortage from {dateIncurred} recorded on {transactionDate} by {empName}: {reason}"
 */
export function buildAutoRemarks(tag, transactionDate) {
  const { dateIncurred, employeeName, reason, otherReason } = tag;
  const reasonText = ['Others', 'PEPP Transaction', 'Bank Transaction'].includes(reason) && otherReason
    ? `${reason} - ${otherReason}`
    : reason;

  if (dateIncurred === transactionDate) {
    return `Cash shortage incurred on ${dateIncurred} by ${employeeName || '—'}: ${reasonText || '—'}`;
  }
  return `Cash shortage from ${dateIncurred} recorded on ${transactionDate} by ${employeeName || '—'}: ${reasonText || '—'}`;
}

/**
 * Validate a cash shortage tag.
 * Returns an array of error strings; empty = valid.
 */
export function validateShortageTag(tag) {
  const errors = [];
  const today = todayISO();

  if (!tag.dateIncurred) {
    errors.push('Date Incurred is required.');
  } else if (tag.dateIncurred > today) {
    errors.push('Date Incurred cannot be a future date.');
  }

  if (!tag.employeeNumber) errors.push('Employee Number is required.');
  if (!tag.reason)         errors.push('Reason is required.');

  const needsOther = ['Others', 'PEPP Transaction', 'Bank Transaction'].includes(tag.reason);
  if (needsOther && !tag.otherReason) {
    errors.push('Other Reason is required for the selected reason.');
  }

  return errors;
}

// ── Reference number generator ────────────────────────────────────────────
async function generateRefNumber(branchCode, date) {
  // Count existing transactions for this branch+date
  const q = query(
    collection(db, COLLECTIONS.BCAS_TRANSACTIONS),
    where('branchCode', '==', branchCode),
    where('date', '==', date),
  );
  const snap = await getDocs(q);
  const nextSeq = snap.size + 1;
  return `${branchCode}-${pad(nextSeq, 6)}-${refDateStr(date)}`;
}

// ── Save new transaction ──────────────────────────────────────────────────
export async function saveBcasTransaction(data) {
  const branch = currentUser?.branch || document.getElementById('Bcasbranch')?.value || 'AAA';
  const refNum = await generateRefNumber(branch, data.date);

  const txn = {
    branchCode    : branch,
    date          : data.date,
    transactionNo : data.transactionNo,
    status        : 'Active',
    accountCode   : data.accountCode,
    template      : data.template,
    debit         : data.debit   || '0.00',
    credit        : data.credit  || '0.00',
    balance       : data.balance || '0.00',
    remarks       : data.remarks,
    uploadStatus  : 'Not Uploaded',
    referenceNumber: refNum,
    transactionId : data.transactionId || '',
    ftReferenceId : data.ftReferenceId || '',
    createdBy     : currentUser?.email || '',
  };

  const id = await addDocument(COLLECTIONS.BCAS_TRANSACTIONS, txn);
  return { id, ...txn };
}

// ── Reverse a transaction ─────────────────────────────────────────────────
export async function reverseBcasTransaction(originalId, originalData) {
  // Mark original as Reversed
  await updateDocument(COLLECTIONS.BCAS_TRANSACTIONS, originalId, { status: 'Reversed' });

  // Insert correction row (flip debit/credit)
  const branch = currentUser?.branch || document.getElementById('Bcasbranch')?.value || 'AAA';
  const date   = todayISO();
  const refNum = await generateRefNumber(branch, date);

  const correction = {
    branchCode    : branch,
    date,
    transactionNo : originalData.transactionNo,
    status        : 'Correction',
    accountCode   : originalData.accountCode,
    template      : originalData.template,
    debit         : originalData.credit,   // flipped
    credit        : originalData.debit,    // flipped
    balance       : originalData.balance,
    remarks       : originalData.remarks,
    uploadStatus  : 'Not Uploaded',
    referenceNumber: refNum,
    transactionId : originalData.transactionId || '',
    ftReferenceId : originalData.ftReferenceId || '',
    reversalOf    : originalId,
    createdBy     : currentUser?.email || '',
  };

  const id = await addDocument(COLLECTIONS.BCAS_TRANSACTIONS, correction);
  return { id, ...correction };
}

// ── Load transactions for a date ──────────────────────────────────────────
export async function loadBcasTransactions(date) {
  _selectedDate = date;
  const branch = currentUser?.branch || document.getElementById('Bcasbranch')?.value || 'AAA';

  const q = query(
    collection(db, COLLECTIONS.BCAS_TRANSACTIONS),
    where('branchCode', '==', branch),
    where('date', '==', date),
  );
  const snap = await getDocs(q);
  _transactions = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const ta = a.createdAt?.toMillis?.() ?? 0;
      const tb = b.createdAt?.toMillis?.() ?? 0;
      return ta - tb;
    });
  return _transactions;
}

// ── Render transactions table ─────────────────────────────────────────────
export async function renderBcasTransactions(date) {
  const rows = await loadBcasTransactions(date);
  const tbody = document.getElementById('BCAStransactions')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;

  tbody.innerHTML = '';

  rows.forEach((txn, idx) => {
    const tr = tbody.insertRow();
    tr.dataset.id = txn.id;
    if (txn.status === 'Reversed')   tr.style.color = 'red';
    if (txn.status === 'Correction') tr.style.color = 'green';
    if (txn.status === 'Finalized')  tr.style.color = 'orange';

    // View button
    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'custom-button-bcaseye';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    viewBtn.style.cursor = 'pointer';
    viewBtn.onclick = () => openBcasTransactionView(txn);
    tr.insertCell(0).appendChild(viewBtn);

    tr.insertCell(1).textContent = idx + 1;
    tr.insertCell(2).textContent = txn.status;
    tr.insertCell(3).textContent = txn.template;
    tr.insertCell(4).textContent = txn.debit;
    tr.insertCell(5).textContent = txn.credit;
    tr.insertCell(6).textContent = txn.balance;
    tr.insertCell(7).textContent = txn.remarks;
    tr.insertCell(8).textContent = txn.uploadStatus;

    // Hidden cells
    const hiddenDate = tr.insertCell(9);
    hiddenDate.textContent = toDisplayDate(txn.date);
    hiddenDate.style.display = 'none';

    const hiddenRef = tr.insertCell(10);
    hiddenRef.textContent = txn.referenceNumber;
    hiddenRef.style.display = 'none';

    const hiddenCode = tr.insertCell(11);
    hiddenCode.textContent = txn.accountCode;
    hiddenCode.style.display = 'none';

    const hiddenTrid = tr.insertCell(12);
    hiddenTrid.textContent = txn.transactionId;
    hiddenTrid.style.display = 'none';

    const hiddenFtid = tr.insertCell(13);
    hiddenFtid.textContent = txn.ftReferenceId;
    hiddenFtid.style.display = 'none';
  });

  // Update beginning/ending balance display
  _updateBalanceDisplay(date);
}

// ── Open transaction view/entry form ─────────────────────────────────────
function openBcasTransactionView(txn) {
  // Navigate to entry tab
  document.querySelectorAll('.bcastab').forEach(t => t.classList.remove('active'));
  document.getElementById('sub-tab100-tab14')?.classList.add('active');
  document.getElementById('subcon-tab100-tab14')?.classList.add('active');
  document.getElementById('subcon-tab100-tab1')?.classList.remove('active');
  document.getElementById('sub-tab100-tab14-1')?.classList.add('active');
  document.getElementById('subcon-tab100-tab14-1')?.classList.add('active');
  document.getElementById('sub-tab100-tab14-2')?.classList.remove('active');
  document.getElementById('subcon-tab100-tab14-2')?.classList.remove('active');

  // Populate form fields
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('viewbcasdate',    toDisplayDate(txn.date));
  set('viewbcastn',      txn.transactionNo);
  set('viewbcasacode',   txn.accountCode);
  set('viewbcastemp',    txn.template);
  set('viewbcasdesc',    'To record ' + txn.template);
  set('viewbcasremarks', txn.remarks);
  set('viewbcasamount',  txn.debit !== '0.00' ? txn.debit : txn.credit);
  set('viewbcasref',     txn.referenceNumber);
  set('tnsdebit',        txn.debit);
  set('tnscredit',       txn.credit);

  // Store current txn id for reverse
  document.getElementById('viewbcasref').dataset.txnId = txn.id;

  // Show/hide action buttons
  const canReverse = ['MNL-FTOB','MNL-FTHO','MNL-FTAREA','MNL-5015'].includes(txn.accountCode)
    && (txn.status === 'Active' || txn.status === 'Finalized');

  const trev    = document.getElementById('trev');
  const tsave   = document.getElementById('tsave');
  const tsavenew = document.getElementById('tsavenew');
  if (trev)     trev.style.display     = canReverse ? 'block' : 'none';
  if (tsave)    tsave.style.display    = 'none';
  if (tsavenew) tsavenew.style.display = 'none';

  // Make fields read-only
  ['viewbcasdate','viewbcastn','viewbcastemp','viewbcasdesc','viewbcasamount','viewbcasremarks',
   'tnsdebit','tnscredit'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.readOnly = true;
  });
  const acode = document.getElementById('viewbcasacode');
  if (acode) acode.style.pointerEvents = 'none';
}

// ── Balance display ───────────────────────────────────────────────────────
async function _updateBalanceDisplay(date) {
  const branch = currentUser?.branch || document.getElementById('Bcasbranch')?.value || 'AAA';
  const q = query(
    collection(db, COLLECTIONS.BCAS_BALANCES),
    where('branchCode', '==', branch),
    where('date', '==', date),
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    const bal = snap.docs[0].data();
    const bb = document.getElementById('amtbb');
    const eb = document.getElementById('amteb');
    if (bb) bb.value = fmtNum(bal.beginningBalance || 0);
    if (eb) eb.value = fmtNum(bal.endingBalance    || 0);
  }
}

// ── Backfill missing reference numbers ───────────────────────────────────
export async function backfillRefNumbers(branchCode) {
  // Fetch all docs for this branch ordered by createdAt asc
  const q = query(
    collection(db, COLLECTIONS.BCAS_TRANSACTIONS),
    where('branchCode', '==', branchCode),
  );
  const snap = await getDocs(q);
  const allDocs = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0));

  // Filter to only docs missing a referenceNumber
  const missing = allDocs.filter(d => !d.referenceNumber);
  if (!missing.length) return;

  // Group missing docs by date
  const byDate = {};
  for (const doc of missing) {
    const date = doc.date || '';
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(doc);
  }

  for (const [date, docs] of Object.entries(byDate)) {
    // Count existing docs that already have a referenceNumber for this date
    const existingCount = allDocs.filter(
      d => d.date === date && d.referenceNumber,
    ).length;

    let seq = existingCount + 1;
    for (const txn of docs) {
      // Skip if somehow already has a ref (safety guard)
      if (txn.referenceNumber) continue;
      const referenceNumber = `${branchCode}-${pad(seq, 6)}-${refDateStr(date)}`;
      await updateDocument(COLLECTIONS.BCAS_TRANSACTIONS, txn.id, { referenceNumber });
      seq++;
    }
  }
}

// ── Init: wire date picker ────────────────────────────────────────────────
export function initBcasTransactions() {
  const datePicker = document.getElementById('trnxDate');
  if (!datePicker) return;

  datePicker.value = todayISO();
  renderBcasTransactions(todayISO());

  datePicker.addEventListener('change', () => {
    renderBcasTransactions(datePicker.value);
  });

  const branch = currentUser?.branch || document.getElementById('Bcasbranch')?.value;
  if (branch) backfillRefNumbers(branch);
}
