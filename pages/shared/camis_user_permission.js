/**
 * camis_user_permission.js
 * UI overlay helpers and field references for the CAMIS FT overlay forms.
 * Role-based permissions are handled by auth_guard.js (ES module).
 */

// ── Guard: redirect if not logged in ─────────────────────────────────────
(function checkUserLogin() {
  if (!sessionStorage.getItem('userRole') && window.location.protocol !== 'file:') {
    window.location.href = 'index.html';
  }
})();

// ── Shared element references ─────────────────────────────────────────────
const toggleButton      = document.getElementById('toggleButton');
const modalwidth        = document.getElementById('modalwidth');
const fieldsetcontainer = document.getElementById('fieldset-container');
const userRole          = sessionStorage.getItem('userRole') || '';

// FT Add-New form field references (used by camis_ft_add_new.js)
const ttypef       = document.getElementById('ttypef');
const nobf         = document.getElementById('nobf');
const ndbf         = document.getElementById('ndbf');
const nbank        = document.getElementById('nbank');
const ncorf        = document.getElementById('ncorf');
const notherf      = document.getElementById('notherf');
const namtf        = document.getElementById('namtf');
const savenew      = document.getElementById('FT-btn-save-overlay1');
const tnstype      = document.getElementById('tnstype');
const newftamt     = document.getElementById('newftamt');
const neworigin    = document.getElementById('neworigin');
const newdest      = document.getElementById('newdest');
const nwbnk        = document.getElementById('nwbnk');
const newftcourier = document.getElementById('newftcourier');
const newftother   = document.getElementById('newftother');
const newftmemo    = document.getElementById('newftmemo');
const newfttnxid   = document.getElementById('newfttnxid');
const xMessage     = document.getElementById('xmessage');
const cby          = document.getElementById('cby');

// ── Overlay helpers ───────────────────────────────────────────────────────
function closeOverlay(overlayId) {
  document.getElementById(overlayId)?.classList.remove('show');
  if (modalwidth)        modalwidth.style.width = '470px';
  if (fieldsetcontainer) fieldsetcontainer.style.gap = '20px';
  if (toggleButton)      toggleButton.innerHTML = '<i class="fas fa-circle-arrow-right"></i>';
}

function expandview() {
  if (!modalwidth) return;
  const wide = parseInt(getComputedStyle(modalwidth).width) >= 800;
  modalwidth.style.width = wide ? '470px' : '915px';
  if (fieldsetcontainer) fieldsetcontainer.style.gap = wide ? '20px' : '5px';
  if (toggleButton) toggleButton.innerHTML = wide
    ? '<i class="fas fa-circle-arrow-right"></i>'
    : '<i class="fas fa-circle-arrow-left"></i>';
}

function getCurrentDateTime() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${pad(now.getMonth()+1)}/${pad(now.getDate())}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

// ── Open Add-New overlay (overlay1) ──────────────────────────────────────
function opennewOverlay(overlayId, event, tableId, rowIndex, colIndex) {
  event.preventDefault();

  if (overlayId !== 'overlay1') {
    const table = document.getElementById(tableId);
    const row   = table?.rows[rowIndex];
    if (row) {
      const cellValue = row.cells[colIndex]?.innerText || '';
      if (fieldsetcontainer) fieldsetcontainer.style.gap = '20px';
      const ns = document.getElementById('NStatus-overlay2');
      if (ns) { ns.value = cellValue; ns.textContent = cellValue; }
      sessionStorage.setItem('Newrow', rowIndex);
    }
  }

  document.getElementById(overlayId)?.classList.add('show');

  if (overlayId === 'overlay1') {
    if (cby) cby.value = userRole;
    if (ttypef)  ttypef.style.border  = '1px solid red';
    if (namtf)   namtf.style.border   = '1px solid #ccc';
    if (ncorf)   ncorf.style.border   = '1px solid #ccc';
    if (ndbf)    ndbf.style.border    = '1px solid #ccc';
    if (nobf)    nobf.style.border    = '1px solid #ccc';
    if (notherf) notherf.style.border = '1px solid #ccc';
    if (nbank)   nbank.style.color    = '#ccc';
    if (nwbnk)   nwbnk.style.border   = '1px solid #ccc';
    if (savenew) { savenew.style.backgroundColor = 'gray'; savenew.disabled = true; savenew.style.cursor = 'not-allowed'; }
    [newftamt, neworigin, newdest, nwbnk, newftcourier, newftother].forEach(el => {
      if (el) { el.disabled = true; el.value = ''; }
    });
    [tnstype, newfttnxid, newftmemo].forEach(el => { if (el) el.value = ''; });
  }
}

// ── Open View overlay (overlay0 / overlay2) ───────────────────────────────
function openOverlay(overlayId, event, tableId, rowIndex, colIndex, button) {
  event.preventDefault();
  const table = document.getElementById(tableId);
  if (!table) return;

  const buttonrow   = button.closest('tr');
  const newrowIndex = Array.from(table.rows).indexOf(buttonrow);
  const row         = buttonrow;
  const cellValue   = row.cells[colIndex]?.innerText || '';
  const hcell       = row.cells[2]?.innerText || '';

  if (fieldsetcontainer) fieldsetcontainer.style.gap = '20px';

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
  set('headr',          hcell + ' Transaction');
  set('viewtrnxtype',   row.cells[2]?.innerText);
  set('viewamount',     row.cells[4]?.innerText);
  set('vieworigin',     row.cells[5]?.innerText);
  set('viewdest',       row.cells[6]?.innerText);
  set('viewcftcourier', row.cells[7]?.innerText);
  set('viewcftmemo',    row.cells[8]?.innerText);
  set('viewtrnxid',     row.cells[3]?.innerText);
  set('viewcftremarks', row.cells[16]?.innerText);
  set('viewcftcby',     row.cells[9]?.innerText);
  set('viewcftcdate',   row.cells[1]?.innerText);
  set('viewcftrby',     row.cells[12]?.innerText);
  set('viewcftrdate',   row.cells[13]?.innerText);
  set('viewcftclby',    row.cells[14]?.innerText);
  set('viewcftcldate',  row.cells[15]?.innerText);
  const type = row.cells[2]?.innerText;
  set('viewcftbank', (type === 'Withdraw' || type === 'Deposit') ? row.cells[8]?.innerText : '');

  const ns = document.getElementById('NStatus-overlay2');
  if (ns) { ns.value = cellValue; ns.textContent = cellValue; }
  sessionStorage.setItem('Newrow', newrowIndex);

  const btnIds = ['flag','ack','deny','cancel-denied','cancel-new','cancel-ack','save','cancel-flag'];
  const btns = {};
  btnIds.forEach(k => {
    const el = document.getElementById(`FT-btn-${k}-${overlayId}`);
    if (el) { el.style.display = 'none'; btns[k] = el; }
  });

  switch (userRole) {
    case 'zaa-aas': case 'zab-aas': case 'admin':
      if (btns.save) btns.save.style.display = 'block';
      if ((cellValue === 'Pending' || cellValue === 'In-Transit') && btns['cancel-new'])
        btns['cancel-new'].style.display = 'block';
      break;
    case 'cru':
      if (cellValue === 'Under Review' && btns['cancel-flag']) btns['cancel-flag'].style.display = 'block';
      else if (btns.flag) btns.flag.style.display = 'block';
      break;
    case 'cmd':
      if (cellValue === 'In-Transit' && hcell !== 'Send') {
        if (btns.ack)  btns.ack.style.display  = 'block';
        if (btns.deny) btns.deny.style.display = 'block';
      }
      if (cellValue === 'Acknowledged' && btns['cancel-ack'])    btns['cancel-ack'].style.display    = 'block';
      if (cellValue === 'Denied'       && btns['cancel-denied']) btns['cancel-denied'].style.display = 'block';
      break;
  }

  document.getElementById(overlayId)?.classList.add('show');
  const statusEl = document.getElementById(`NStatus-${overlayId}`);
  if (statusEl) statusEl.textContent = cellValue;
}

// ── Input helpers ─────────────────────────────────────────────────────────
function toUpperCaseOnly(event) {
  event.target.value = event.target.value.toUpperCase();
}

function formatNumber(event) {
  let value = event.target.value.replace(/[^0-9.]/g, '');
  if (!value) return;
  let number = parseFloat(value).toFixed(2);
  number = number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  event.target.value = number;
}

function validateInput(event) {
  const el = event.target;
  el.value = el.value.replace(/[^0-9.,]/g, '');
  if (namtf) namtf.style.border = el.value.trim() ? '1px solid #ccc' : '1px solid red';
  _updateSaveBtn();
}

function updateDropdowns() {
  if (typeof _refreshTxnId === 'function') _refreshTxnId();
  if (typeof _refreshMemo  === 'function') _refreshMemo();
  _updateSaveBtn();
}

function handleEnterKey(e, id) {
  if (e.key === 'Enter') { e.preventDefault(); document.getElementById(id)?.blur(); }
}

// ── Amount / courier validation ───────────────────────────────────────────
if (newftamt) {
  newftamt.addEventListener('input', function(event) {
    event.target.value = event.target.value.replace(/[^0-9.,]/g, '');
    if (namtf) namtf.style.border = newftamt.value.trim() ? '1px solid #ccc' : '1px solid red';
    _updateSaveBtn();
  });
}

if (newftcourier) {
  newftcourier.addEventListener('input', function() {
    if (ncorf) ncorf.style.border = newftcourier.value.trim() ? '1px solid #ccc' : '1px solid red';
    _updateSaveBtn();
  });
}

function _updateSaveBtn() {
  if (!savenew) return;
  const invalid = [ttypef, ndbf, namtf, nobf, ncorf].some(el => el?.style.border === '1px solid red')
    || nwbnk?.style.border === '1px solid red';
  savenew.style.backgroundColor = invalid ? 'gray' : '#3f61b8';
  savenew.disabled = invalid;
  savenew.style.cursor = invalid ? 'not-allowed' : 'pointer';
}

// ── Type dropdown filter ──────────────────────────────────────────────────
const dropdownListTrans = document.getElementById('dropdownList-trans');
if (dropdownListTrans) {
  dropdownListTrans.addEventListener('click', function(event) {
    if (!event.target.matches('div')) return;
    const val = event.target.innerText.trim().toLowerCase();
    const dropstat = document.getElementById('ft-status-drop');
    document.querySelectorAll('#dropdownList-stat .cmd').forEach(el => {
      el.style.display = val === 'send' ? 'none' : '';
    });
    document.querySelectorAll('#dropdownList-stat .noncmd').forEach(el => {
      el.style.display = val === 'send' ? '' : 'none';
    });
    if (dropstat) {
      if (val === 'send' && (dropstat.value === 'Acknowledged' || dropstat.value === 'Denied')) dropstat.value = '';
      if (val !== 'send' && dropstat.value === 'Received') dropstat.value = '';
    }
  });
}

// ── FT filter button ──────────────────────────────────────────────────────
function applyFTFilter() {
  if (typeof window.renderFTTable !== 'function') {
    alert('Table not ready yet. Please wait a moment and try again.');
    return;
  }

  const get = id => {
    const el = document.getElementById(id);
    const val = (el?.value || '').trim();
    return val === (el?.placeholder || '') ? '' : val;
  };

  const filters = {
    dateFrom: get('datefromFTlist'),
    dateTo  : get('datetoFTlist'),
    area    : get('ft-Area-drop'),
    branch  : get('ft-branch-drop'),
    status  : get('ft-status-drop'),
    type    : get('ft-trns-drop'),
    search  : get('searchftall'),
  };

  window.renderFTTable(filters);
}
