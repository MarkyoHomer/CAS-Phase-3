/**
 * ft_overlay.js
 * Overlay open/close, filter apply, and number format helpers
 * for the Fund Transfer transaction-list page.
 */

// ── Overlay helpers ───────────────────────────────────────────────────────
function openOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

function closeOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

// Close overlay when clicking the backdrop
document.addEventListener('click', function (e) {
  ['overlay0', 'overlay1', 'overlay2'].forEach(id => {
    const el = document.getElementById(id);
    if (el && e.target === el) el.classList.remove('show');
  });
});

// ── Number formatter ──────────────────────────────────────────────────────
function formatNumber(val) {
  const n = parseFloat(String(val).replace(/,/g, '')) || 0;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── Apply filter — calls Firestore via renderFTTable ──────────────────────
function applyFTFilter() {
  if (typeof window.renderFTTable !== 'function') return;
  window.renderFTTable({
    dateFrom: document.getElementById('datefromFTlist')?.value || '',
    dateTo  : document.getElementById('datetoFTlist')?.value   || '',
    area    : document.getElementById('ft-Area-drop')?.value   || '',
    branch  : document.getElementById('ft-branch-drop')?.value || '',
    status  : document.getElementById('ft-status-drop')?.value || '',
    type    : document.getElementById('ft-trns-drop')?.value   || '',
    search  : document.getElementById('searchftall')?.value    || '',
  });
}

// ── Notification helper (used by copy encrypt & save) ────────────────────
function showNotification() {
  const el = document.getElementById('xnotification');
  if (!el) return;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

// ── Globals expected by camis_ft_offline_update.js ────────────────────────
// userRole and formattedDateTime are used in the confirmupdate log cell
var userRole = sessionStorage.getItem('userRole') || '';
var formattedDateTime = new Date().toLocaleString();

// openSubOverlay — shows the void sub-confirmation (reuse ftupdateconfirmation)
function openSubOverlay() {
  const msg = document.getElementById('updatemessage');
  if (msg) msg.textContent = 'Are you sure you want to VOID this transaction?';
  document.getElementById('ftupdateconfirmation').classList.add('show');
}
