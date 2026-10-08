// src/utils/purchaseUtils.js
// Universal utility to manage Olympiad subject purchases, mock test unlocks & dashboard visibility

export const SUBJECT_ALIAS_MAP = {
  imo: ['imo', 'ieom', 'math', 'maths', 'mathematics'],
  ieom: ['imo', 'ieom', 'math', 'maths', 'mathematics'],
  iso: ['iso', 'ieos', 'science'],
  ieos: ['iso', 'ieos', 'science'],
  idlo: ['idlo', 'ieod', 'icso', 'cyber', 'digital', 'digital literacy'],
  ieod: ['idlo', 'ieod', 'icso', 'cyber', 'digital', 'digital literacy'],
  ieo: ['ieo', 'ieoe', 'english'],
  ieoe: ['ieo', 'ieoe', 'english'],
  igko: ['igko', 'ieog', 'gk', 'general knowledge'],
  ieog: ['igko', 'ieog', 'gk', 'general knowledge'],
  iho: ['iho', 'ieoh', 'hindi'],
  ieoh: ['iho', 'ieoh', 'hindi']
};

export const getPurchasedTests = () => {
  try {
    return JSON.parse(localStorage.getItem('olympiadhub_purchased_tests') || '[]');
  } catch (e) {
    return [];
  }
};

export const isSubjectPurchased = (subCodeOrKey, studentClass = null, purchasedList = null) => {
  if (!subCodeOrKey) return false;
  const list = purchasedList !== null ? purchasedList : getPurchasedTests();
  if (!Array.isArray(list) || list.length === 0) return false;

  const rawKey = String(subCodeOrKey).toLowerCase().trim();
  const rawClass = studentClass ? String(studentClass).toLowerCase().trim() : '';

  // Universal unlock flag
  if (list.some(k => {
    const s = String(k).toLowerCase().trim();
    return s === 'all' || s === 'all_mock_tests' || s === 'all_practice_tests';
  })) {
    return true;
  }

  const aliases = SUBJECT_ALIAS_MAP[rawKey] || [rawKey];

  return list.some(item => {
    const s = String(item).toLowerCase().trim();
    for (const alias of aliases) {
      if (s === alias) return true;
      if (rawClass && (s === `${rawClass}_${alias}` || s === `${rawClass} ${alias}`)) return true;
      if (rawClass && s === `${rawClass}_all`) return true;
      const parts = s.split(/[_\s-]+/);
      if (parts.includes(alias)) return true;
    }
    return false;
  });
};

export const savePurchasedSubject = (subCode, altCode, studentClass, orderDetails = {}) => {
  const current = getPurchasedTests();
  const rawSub = String(subCode).toLowerCase().trim();
  const rawAlt = altCode ? String(altCode).toLowerCase().trim() : '';
  const rawClass = studentClass ? String(studentClass).toLowerCase().trim() : '';

  const newKeys = [rawSub];
  if (rawAlt) newKeys.push(rawAlt);
  if (rawClass) {
    newKeys.push(`${rawClass}_${rawSub}`);
    if (rawAlt) newKeys.push(`${rawClass}_${rawAlt}`);
  }

  const updated = Array.from(new Set([...current, ...newKeys]));
  try {
    localStorage.setItem('olympiadhub_purchased_tests', JSON.stringify(updated));
  } catch (e) {}

  const orderPayload = {
    order_id: orderDetails.order_id || `ORD-MOCK-${Date.now().toString().slice(-6)}`,
    grade: studentClass || 'All Classes',
    subject: subCode,
    subject_name: orderDetails.subject_name || subCode,
    amount: orderDetails.amount || 99,
    payment_method: orderDetails.payment_method || 'upi_qr',
    utr_number: orderDetails.utr_number || `UPI-TXN-${Date.now().toString().slice(-8)}`,
    status: 'completed',
    date: new Date().toISOString()
  };

  try {
    const existingOrders = JSON.parse(localStorage.getItem('olympiadhub_db_orders') || '[]');
    localStorage.setItem('olympiadhub_db_orders', JSON.stringify([orderPayload, ...existingOrders]));
  } catch (e) {}

  try {
    window.dispatchEvent(new CustomEvent('olympiadhub-package-purchased', { detail: orderPayload }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}

  return updated;
};
