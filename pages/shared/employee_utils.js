/**
 * employee_utils.js
 * Utility functions for employee number formatting and validation.
 * No DOM or Firebase dependencies — pure logic module.
 */

/** Zero-pad seq to 4 digits and prepend "SG" → e.g. SG0001 */
export function formatSGNumber(seq) {
  return 'SG' + String(seq).padStart(4, '0');
}

/** Validate an employee number against its type ('SG' or 'Associate') */
export function isValidEmployeeNumber(empNo, type) {
  if (type === 'SG') {
    return /^SG\d{4}$/.test(empNo);
  }
  if (type === 'Associate') {
    return /^(?!SG)[A-Za-z0-9]{1,6}$/.test(empNo);
  }
  return false;
}
