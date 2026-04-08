/**
 * camis_ft_add_new.js
 * CAMIS — New Fund Transfer entry form UI logic.
 * Dropdown filtering, field validation, memo auto-fill.
 * On confirm, calls addFTRecord() from camis_ft.js (Firestore).
 */

// ── Dropdown references ───────────────────────────────────────────────────
const searchInput5  = document.getElementById("neworigin");
const dropdownList5 = document.getElementById("dropdownList-neworig");
const searchInput6  = document.getElementById("newdest");
const dropdownList6 = document.getElementById("dropdownList-newdest");
const searchInput7  = document.getElementById("nwbnk");
const dropdownList7 = document.getElementById("dropdownList-newbank");
const searchInput8  = document.getElementById("tnstype");
const dropdownList8 = document.getElementById("dropdownList-newtype");

// ── Helpers ───────────────────────────────────────────────────────────────
function _allDropdownsClose(except) {
  [dropdownList5, dropdownList6, dropdownList7, dropdownList8].forEach(d => {
    if (d !== except) d.style.display = "none";
  });
}

function _checkSaveEnabled() {
  const ok = ttypef.style.border !== '1px solid red'
    && ndbf.style.border  !== '1px solid red'
    && namtf.style.border !== '1px solid red'
    && nobf.style.border  !== '1px solid red'
    && nwbnk.style.border !== '1px solid red'
    && ncorf.style.border !== '1px solid red';
  savenew.style.backgroundColor = ok ? '#3f61b8' : 'gray';
  savenew.disabled   = !ok;
  savenew.style.cursor = ok ? 'pointer' : 'not-allowed';
}

function _genTxnId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 14; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

function _refreshTxnId() {
  const trnxid = document.getElementById('newfttnxid');
  const type   = tnstype.value;
  const id     = _genTxnId();
  if (type === 'Send' || type === 'Deposit') {
    trnxid.value = neworigin.value ? `${neworigin.value}-13-${id}` : '';
  } else if (type === 'Withdraw') {
    trnxid.value = newdest.value ? `${newdest.value}-13-${id}` : '';
  }
}

function _refreshMemo() {
  if (!newftcourier.value) return;
  if (tnstype.value !== 'Send') {
    newftmemo.value = newftother.value
      ? `${nwbnk.value} / ${newftother.value}`
      : nwbnk.value;
  } else {
    newftmemo.value = newftother.value
      ? `${newfttnxid.value} / ${newftcourier.value} / ${newftother.value}`
      : `${newfttnxid.value} / ${newftcourier.value}`;
  }
}

// ── Origin dropdown ───────────────────────────────────────────────────────
function filterDropdownneworig() {
  const f = searchInput5.value.toUpperCase();
  dropdownList5.style.display = f ? "block" : "none";
  Array.from(dropdownList5.getElementsByTagName("div")).forEach(item => {
    item.style.display = item.textContent.toUpperCase().includes(f) ? "" : "none";
  });
  if (!searchInput5.value) { nobf.style.border = "1px solid red"; _checkSaveEnabled(); }
}

dropdownList5.addEventListener("click", function(event) {
  if (event.target.tagName !== "DIV") return;
  const selected = event.target.textContent.trim();
  searchInput5.value = selected;
  dropdownList5.style.display = "none";

  // Disable same branch in destination
  Array.from(dropdownList6.getElementsByTagName("div")).forEach(item => {
    const same = item.textContent.trim() === selected;
    item.classList.toggle("disabled-option", same);
    same ? item.setAttribute("data-disabled","true") : item.removeAttribute("data-disabled");
  });
  if (searchInput6.value.trim() === selected) searchInput6.value = "";

  nobf.style.border = "1px solid #ccc";
  _refreshTxnId();
  _refreshMemo();
  _checkSaveEnabled();
});

window.addEventListener("click", e => { if (!e.target.closest('.dropdown')) dropdownList5.style.display = "none"; });

// ── Destination dropdown ──────────────────────────────────────────────────
function filterDropdownnewdest() {
  const f = searchInput6.value.toUpperCase();
  dropdownList6.style.display = f ? "block" : "none";
  Array.from(dropdownList6.getElementsByTagName("div")).forEach(item => {
    item.style.display = item.textContent.toUpperCase().includes(f) ? "" : "none";
  });
  if (!searchInput6.value) { ndbf.style.border = "1px solid red"; _checkSaveEnabled(); }
}

dropdownList6.addEventListener("click", function(event) {
  if (event.target.tagName !== "DIV") return;
  if (event.target.getAttribute("data-disabled") === "true") {
    alert("Origin and Destination cannot be the same branch."); return;
  }
  const selected = event.target.textContent.trim();
  searchInput6.value = selected;
  dropdownList6.style.display = "none";

  Array.from(dropdownList5.getElementsByTagName("div")).forEach(item => {
    const same = item.textContent.trim() === selected;
    item.classList.toggle("disabled-option", same);
    same ? item.setAttribute("data-disabled","true") : item.removeAttribute("data-disabled");
  });
  if (searchInput5.value.trim() === selected) searchInput5.value = "";

  ndbf.style.border = "1px solid #ccc";
  _refreshTxnId();
  _refreshMemo();
  _checkSaveEnabled();
});

window.addEventListener("click", e => { if (!e.target.closest('.dropdown')) dropdownList6.style.display = "none"; });

// ── Bank dropdown ─────────────────────────────────────────────────────────
function toggleDropdownnewbank() {
  const open = dropdownList7.style.display === "block";
  _allDropdownsClose(null);
  dropdownList7.style.display = open ? "none" : "block";
}

function filterDropdownnewbank() {
  const f = searchInput7.value.toUpperCase();
  dropdownList7.style.display = f ? "block" : "none";
  Array.from(dropdownList7.getElementsByTagName("div")).forEach(item => {
    item.style.display = item.textContent.toUpperCase().includes(f) ? "" : "none";
  });
  if (!searchInput7.value) { nwbnk.style.border = "1px solid red"; _checkSaveEnabled(); }
}

dropdownList7.addEventListener("click", function(event) {
  if (event.target.tagName !== "DIV") return;
  searchInput7.value = event.target.textContent;
  dropdownList7.style.display = "none";
  nwbnk.style.border = "1px solid #ccc";
  newftmemo.value = nwbnk.value;
  _checkSaveEnabled();
});

window.addEventListener("click", e => { if (!e.target.closest('.dropdown')) dropdownList7.style.display = "none"; });

// ── Type dropdown ─────────────────────────────────────────────────────────
function toggleDropdownnewtype() {
  const open = dropdownList8.style.display === "block";
  _allDropdownsClose(null);
  dropdownList8.style.display = open ? "none" : "block";
}

function filterDropdownnewtype() {
  const f = searchInput8.value.toUpperCase();
  dropdownList8.style.display = f ? "block" : "none";
  Array.from(dropdownList8.getElementsByTagName("div")).forEach(item => {
    item.style.display = item.textContent.toUpperCase().includes(f) ? "" : "none";
  });
}

dropdownList8.addEventListener("click", function(event) {
  if (event.target.tagName !== "DIV") return;
  searchInput8.value = event.target.textContent;
  dropdownList8.style.display = "none";
  _onTypeChange();
});

function _onTypeChange() {
  const type = tnstype.value;
  ttypef.style.border = "1px solid #ccc";
  _refreshTxnId();

  // Reset field states
  newftamt.disabled = newftcourier.disabled = newftother.disabled = false;

  if (type === 'Send') {
    neworigin.disabled = newdest.disabled = false;
    nwbnk.disabled = true; nwbnk.value = "";
    nobf.style.border  = neworigin.value  ? "1px solid #ccc" : "1px solid red";
    ndbf.style.border  = newdest.value    ? "1px solid #ccc" : "1px solid red";
    ncorf.style.border = newftcourier.value ? "1px solid #ccc" : "1px solid red";
    namtf.style.border = newftamt.value   ? "1px solid #ccc" : "1px solid red";
    nwbnk.style.border = "1px solid #ccc";
  } else if (type === 'Deposit') {
    neworigin.disabled = false; newdest.disabled = true; newdest.value = "";
    nwbnk.disabled = false;
    nobf.style.border  = neworigin.value  ? "1px solid #ccc" : "1px solid red";
    ndbf.style.border  = "1px solid #ccc";
    nwbnk.style.border = nwbnk.value      ? "1px solid #ccc" : "1px solid red";
    ncorf.style.border = newftcourier.value ? "1px solid #ccc" : "1px solid red";
    namtf.style.border = newftamt.value   ? "1px solid #ccc" : "1px solid red";
  } else if (type === 'Withdraw') {
    newdest.disabled = false; neworigin.disabled = true; neworigin.value = "";
    nwbnk.disabled = false;
    ndbf.style.border  = newdest.value    ? "1px solid #ccc" : "1px solid red";
    nobf.style.border  = "1px solid #ccc";
    nwbnk.style.border = nwbnk.value      ? "1px solid #ccc" : "1px solid red";
    ncorf.style.border = newftcourier.value ? "1px solid #ccc" : "1px solid red";
    namtf.style.border = newftamt.value   ? "1px solid #ccc" : "1px solid red";
  } else {
    ttypef.style.border = "1px solid red";
  }
  _checkSaveEnabled();
}

window.addEventListener("click", e => { if (!e.target.closest('.dropdown')) dropdownList8.style.display = "none"; });

// ── Memo auto-fill ────────────────────────────────────────────────────────
function AutoMemo(event) {
  if (event.key === 'Enter') { event.preventDefault(); _refreshMemo(); }
}
function AutoMemoleavefocus() { _refreshMemo(); }

// ── Save / confirm ────────────────────────────────────────────────────────
function saveftnew() {
  document.getElementById('ftconfirmation').classList.add('show');
  const xMsg = document.getElementById('xmessage');
  if (xMsg) xMsg.textContent = `Are you sure you want to save this ${tnstype.value} transaction amounting to ${newftamt.value}?`;
}

function closeftnew() {
  document.getElementById('ftconfirmation')?.classList.remove('show');
}

// NOTE: confirmed() is defined in the <script type="module"> block in camis.html
// so it has direct access to addFTRecord from camis_ft.js

function checkEnter(event) {
  if (event.target.value !== '' && event.key === 'Enter') {
    event.target.value = formatNumber(event.target.value);
    event.preventDefault();
  } else if (event.key === 'Enter') {
    event.preventDefault();
  }
}

document.getElementById('neworigin').addEventListener('keydown', e => handleEnterKey(e, 'neworigin'));
document.getElementById('newdest').addEventListener('keydown',   e => handleEnterKey(e, 'newdest'));
