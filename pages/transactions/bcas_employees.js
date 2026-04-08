/**
 * bcas_employees.js
 * Module: BCAS Employee Management (Feature 3)
 * Handles employee queries, SG number assignment, validation, and save.
 * Firestore collection: bcas_employees
 */

import {
  addDocument, getDocuments,
} from '../shared/db_service.js';
import { db, COLLECTIONS } from '../shared/firebase.js';
import { currentUser } from '../shared/auth_guard.js';
import { formatSGNumber, isValidEmployeeNumber } from '../shared/employee_utils.js';
import {
  collection, query, where, orderBy, limit, getDocs,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Roles that use the SG employee number format
const SG_ROLES = ['SG', 'Security Guard'];

// Roles subject to the one-fulltime-per-branch rule
const RESTRICTED_ROLES = ['BH', 'Cashier', 'SG', 'Security Guard', 'PSB'];

function _isSGRole(role) {
  return SG_ROLES.some(r => role?.includes(r));
}

// ── Get latest employee on duty for a given role ──────────────────────────
/**
 * Returns the most recently created employee document for the given role,
 * or null if none exists.
 */
export async function getLatestEmployeeOnDuty(role) {
  const q = query(
    collection(db, COLLECTIONS.BCAS_EMPLOYEES),
    where('role', '==', role),
    orderBy('createdAt', 'desc'),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

// ── Get next available SG number ──────────────────────────────────────────
/**
 * Queries all SG employees, finds the highest sequence number,
 * and returns the next formatted SG number (e.g. "SG0005").
 * Returns "SG0001" if no SG employees exist yet.
 */
export async function getNextAvailableSGNumber() {
  const q = query(
    collection(db, COLLECTIONS.BCAS_EMPLOYEES),
    where('employeeType', '==', 'SG'),
  );
  const snap = await getDocs(q);

  if (snap.empty) return formatSGNumber(1);

  let maxSeq = 0;
  snap.docs.forEach(d => {
    const empNo = d.data().employeeNumber || '';
    if (/^SG\d{4}$/.test(empNo)) {
      const seq = parseInt(empNo.slice(2), 10);
      if (seq > maxSeq) maxSeq = seq;
    }
  });

  return formatSGNumber(maxSeq + 1);
}

// ── Resolve default employee number for a role ────────────────────────────
/**
 * For SG roles: returns the latest SG employee number, or "SG0000" if none.
 * For other roles: returns the latest employee number for that role, or empty string.
 */
export async function resolveDefaultEmployeeNumber(role) {
  const latest = await getLatestEmployeeOnDuty(role);

  if (_isSGRole(role)) {
    return latest?.employeeNumber || 'SG0000';
  }

  return latest?.employeeNumber || '';
}

// ── Validate editing rules ────────────────────────────────────────────────
/**
 * For BH, Cashier, SG/Security Guard, and PSB roles with fulltime schedule:
 * blocks adding a second active fulltime employee of the same role in the branch.
 * Returns { valid: true } if allowed, or { valid: false, message: string } if blocked.
 */
export async function validateEditingRules(role, schedule) {
  const isRestricted = RESTRICTED_ROLES.some(r => role?.includes(r));
  if (!isRestricted || schedule !== 'fulltime') {
    return { valid: true };
  }

  const branch = currentUser?.branch || '';

  const q = query(
    collection(db, COLLECTIONS.BCAS_EMPLOYEES),
    where('branchCode', '==', branch),
    where('role', '==', role),
    where('schedule', '==', 'fulltime'),
    where('status', '==', 'Active'),
  );
  const snap = await getDocs(q);

  if (snap.size >= 1) {
    return {
      valid  : false,
      message: `A fulltime ${role} is already assigned to this branch. Only one fulltime ${role} is allowed per branch.`,
    };
  }

  return { valid: true };
}

// ── Save employee ─────────────────────────────────────────────────────────
/**
 * Saves an employee record to bcas_employees.
 * If employeeNumber is "SG0000", replaces it with the next available SG number first.
 */
export async function saveEmployee(data) {
  let employeeData = { ...data };

  if (employeeData.employeeNumber === 'SG0000') {
    employeeData.employeeNumber = await getNextAvailableSGNumber();
  }

  const id = await addDocument(COLLECTIONS.BCAS_EMPLOYEES, employeeData);
  return { id, ...employeeData };
}
