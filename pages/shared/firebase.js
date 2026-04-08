/**
 * firebase.js
 * Central Firebase v9+ modular SDK initializer.
 * Import this in every module that needs Firestore or Auth.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth }       from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getAnalytics }  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js';

const firebaseConfig = {
  apiKey           : 'AIzaSyCPtDO6p3Hb38pixecoeXmzOF5prruUcwk',
  authDomain       : 'camis-base.firebaseapp.com',
  projectId        : 'camis-base',
  storageBucket    : 'camis-base.firebasestorage.app',
  messagingSenderId: '292084067423',
  appId            : '1:292084067423:web:42e091a6b71da10d88ffea',
  measurementId    : 'G-D5R57YVVJL',
};

const app       = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
export const auth = getAuth(app);
getAnalytics(app);

// ── Firestore collection names ────────────────────────────────────────────
export const COLLECTIONS = {
  // BCAS
  BCAS_TRANSACTIONS  : 'bcas_transactions',
  BCAS_FUND_TRANSFERS: 'bcas_fund_transfers',
  BCAS_SETTLEMENTS   : 'bcas_settlements',
  BCAS_EMPLOYEES     : 'bcas_employees',
  BCAS_BALANCES      : 'bcas_balances',

  // CAMIS
  FT_RECORDS         : 'ft_records',
  SETTLEMENT_PROFILES: 'settlement_profiles',
  EARNING_SETUP      : 'earning_setup',
  EMPLOYEE_EARNINGS  : 'employee_earnings',

  // Money Changer
  MC_TRANSACTIONS    : 'mc_transactions',
  MC_INVENTORY       : 'mc_inventory',
  MC_RATES           : 'mc_rates',
  MC_BRANCHES        : 'mc_branches',
  MC_AREAS           : 'mc_areas',

  // Auth / Users
  USERS              : 'users',
};
