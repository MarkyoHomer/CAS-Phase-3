/**
 * db_service.js
 * Shared Firestore CRUD helpers used by all modules.
 * All functions are async and return plain JS objects.
 */

import { db, COLLECTIONS } from './firebase.js';
import {
  collection, doc,
  addDoc, setDoc, updateDoc, deleteDoc,
  getDoc, getDocs,
  query, where, orderBy, limit,
  serverTimestamp, Timestamp,
  runTransaction, writeBatch,
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export { serverTimestamp, Timestamp, runTransaction, writeBatch, doc, collection, query, where, orderBy, limit, getDocs, getDoc };

// ── Generic helpers ───────────────────────────────────────────────────────

/** Add a document; returns the new doc id */
export async function addDocument(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

/** Set (overwrite) a document by id */
export async function setDocument(collectionName, id, data) {
  await setDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

/** Update specific fields of a document */
export async function updateDocument(collectionName, id, fields) {
  await updateDoc(doc(db, collectionName, id), {
    ...fields,
    updatedAt: serverTimestamp(),
  });
}

/** Delete a document */
export async function deleteDocument(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}

/** Get a single document by id; returns data object or null */
export async function getDocument(collectionName, id) {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Get all documents in a collection (optionally with constraints) */
export async function getDocuments(collectionName, constraints = []) {
  const q = constraints.length
    ? query(collection(db, collectionName), ...constraints)
    : collection(db, collectionName);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── Date helpers ──────────────────────────────────────────────────────────

/** Convert Firestore Timestamp or string to mm/dd/yyyy */
export function toDisplayDate(val) {
  if (!val) return '';
  const d = val?.toDate ? val.toDate() : new Date(val);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}/${day}/${d.getFullYear()}`;
}

/** Convert Firestore Timestamp or string to mm/dd/yyyy hh:mm:ss */
export function toDisplayDateTime(val) {
  if (!val) return '';
  const d = val?.toDate ? val.toDate() : new Date(val);
  const m   = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h   = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const s   = String(d.getSeconds()).padStart(2, '0');
  return `${m}/${day}/${d.getFullYear()} ${h}:${min}:${s}`;
}

/** Today as yyyy-mm-dd (for date inputs) */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Today as mm/dd/yyyy */
export function todayDisplay() {
  return toDisplayDate(new Date());
}

/** ddmmyyyy string for reference numbers */
export function refDateStr(dateISO) {
  const [y, m, d] = dateISO.split('-');
  return `${d}${m}${y}`;
}

/** Zero-pad a number */
export function pad(n, len) {
  return String(n).padStart(len, '0');
}

/** Format number with 2 decimal places and commas */
export function fmtNum(val) {
  const n = parseFloat(String(val).replace(/,/g, '')) || 0;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
