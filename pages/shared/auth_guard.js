/**
 * auth_guard.js
 * Import as a module at the top of any protected page.
 * Redirects to index.html if the user is not authenticated.
 * Exposes window.currentUser = { uid, email, role }
 */

import { auth, db, COLLECTIONS } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export let currentUser = null;

// ── Resolve root path ─────────────────────────────────────────────────────
function _rootPath() {
  const href = window.location.href;
  const pagesIdx = href.indexOf('/pages/');
  if (pagesIdx !== -1) return href.substring(0, pagesIdx + 1);
  return window.location.origin + '/';
}

const _ROOT = _rootPath();
const DEV_USER = window.location.protocol === 'file:' ? {
  uid   : 'dev-uid',
  email : 'dev@local',
  role  : 'admin',
  name  : 'Dev User',
  branch: 'AAA',
  area  : 'ZAA',
} : null;

export function initAuthGuard(onReady) {
  // Use mock user when running over file:// (no server available)
  if (DEV_USER) {
    currentUser = DEV_USER;
    sessionStorage.setItem('userRole',  currentUser.role);
    sessionStorage.setItem('userEmail', currentUser.email);
    sessionStorage.setItem('uid',       currentUser.uid);
    const roleEl = document.getElementById('userRole');
    if (roleEl) roleEl.innerText = currentUser.role;
    if (typeof onReady === 'function') onReady(currentUser);
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = _ROOT + 'index.html';
      return;
    }

    // Load role from Firestore users collection
    const snap = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
    if (!snap.exists()) {
      await signOut(auth);
      window.location.href = _ROOT + 'index.html';
      return;
    }

    const data = snap.data();
    currentUser = {
      uid  : user.uid,
      email: user.email,
      role : data.role  || '',
      name : data.name  || user.email,
      branch: data.branch || '',
      area  : data.area   || '',
    };

    // Expose globally for legacy scripts that read sessionStorage
    sessionStorage.setItem('userRole',  currentUser.role);
    sessionStorage.setItem('userEmail', currentUser.email);
    sessionStorage.setItem('uid',       currentUser.uid);

    // Show role in header
    const roleEl = document.getElementById('userRole');
    if (roleEl) roleEl.innerText = currentUser.role;

    if (typeof onReady === 'function') onReady(currentUser);
  });
}

/** Call from logout button */
export async function logout() {
  if (!DEV_USER) await signOut(auth);
  sessionStorage.clear();
  window.location.href = _ROOT + 'index.html';
}

// Expose logout globally so inline onclick="logout()" still works
window.logout = logout;
