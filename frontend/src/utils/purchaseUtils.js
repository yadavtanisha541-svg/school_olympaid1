// src/utils/purchaseUtils.js
// Universal utility to manage Olympiad subject purchases, mock test unlocks & dashboard visibility

export const normalizeClassNumber = (cls) => {
  if (!cls) return null;
  const str = String(cls).trim().toLowerCase();
  if (str === 'all' || str === 'all classes' || str === 'all class') return null;
  const match = str.match(/\d+/);
  return match ? match[0] : null;
};

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

// Reset and sanitize legacy / unscoped purchases so subjects are strictly scoped to their specific class
if (typeof window !== 'undefined') {
  try {
    const lockResetKey = 'olympiadhub_lock_reset_v5';
    if (!localStorage.getItem(lockResetKey)) {
      const existing = JSON.parse(localStorage.getItem('olympiadhub_purchased_tests') || '[]');
      if (Array.isArray(existing)) {
        // Keep ONLY items that have an explicit class number (e.g. class_6_imo)
        const cleaned = existing.filter(item => {
          const s = String(item).toLowerCase().trim();
          if (s === 'all' || s === 'all_mock_tests' || s === 'all_practice_tests') return false;
          return /\d+/.test(s);
        });
        localStorage.setItem('olympiadhub_purchased_tests', JSON.stringify(cleaned));
      }
      localStorage.setItem(lockResetKey, 'true');
    }
  } catch (e) {}
}

export const getPurchasedTests = () => {
  try {
    return JSON.parse(localStorage.getItem('olympiadhub_purchased_tests') || '[]');
  } catch (e) {
    return [];
  }
};

export const lockSubject = (subCodeOrKey, studentClass = null) => {
  try {
    const list = getPurchasedTests();
    const rawKey = String(subCodeOrKey).toLowerCase().trim();
    const classNum = normalizeClassNumber(studentClass);
    const aliases = SUBJECT_ALIAS_MAP[rawKey] || [rawKey];

    const updated = list.filter(item => {
      const s = String(item).toLowerCase().trim();
      const itemClassNum = normalizeClassNumber(s);

      // Check if this item relates to this subject
      const matchesSubject = aliases.some(alias => s === alias || s.includes(alias));
      if (!matchesSubject) return true; // keep unrelated subjects

      // If classNum is specified, only remove items belonging to THIS class (or un-scoped)
      if (classNum) {
        if (!itemClassNum || itemClassNum === classNum) {
          return false; // remove it
        }
        return true; // keep it for other classes
      }

      // If no classNum specified, remove all matches for this subject
      return false;
    });

    localStorage.setItem('olympiadhub_purchased_tests', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('olympiadhub-package-purchased', { detail: { locked: true, subject: subCodeOrKey, studentClass } }));
      window.dispatchEvent(new Event('storage'));
    }
    return updated;
  } catch (e) {
    return [];
  }
};

export const resetPurchasedTests = () => {
  try {
    localStorage.removeItem('olympiadhub_purchased_tests');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('olympiadhub-package-purchased', { detail: { reset: true } }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {}
};

export const isSubjectPurchased = (subCodeOrKey, studentClass = null, purchasedList = null) => {
  if (!subCodeOrKey) return false;
  const list = purchasedList !== null ? purchasedList : getPurchasedTests();
  if (!Array.isArray(list) || list.length === 0) return false;

  const rawKey = String(subCodeOrKey).toLowerCase().trim();
  const classNum = normalizeClassNumber(studentClass);
  const aliases = SUBJECT_ALIAS_MAP[rawKey] || [rawKey];

  if (classNum) {
    // STRICT CLASS CHECK:
    // Only return true if the purchased list contains an entry specifically matching THIS class number and subject!
    return list.some(item => {
      const s = String(item).toLowerCase().trim();
      const itemClassNum = normalizeClassNumber(s);

      // Must explicitly match the target class number!
      // If item is for Class 6, a Class 7 student CANNOT match it!
      if (!itemClassNum || itemClassNum !== classNum) {
        return false;
      }

      // Same class number: check if any subject alias is present in the item
      return aliases.some(alias => {
        return s === `class_${classNum}_${alias}` ||
               s === `class ${classNum}_${alias}` ||
               s === `${classNum}_${alias}` ||
               s === `${alias}_${classNum}` ||
               s.includes(alias);
      });
    });
  }

  // If no class number provided, return false (purchases must be tied to a class)
  return false;
};

export const DEFAULT_TEST_PRICING = {
  mock_test_price: 99,
  practice_test_price: 99,
  original_price: 299,
  test_pack_price: 99
};

export const getTestPricing = () => {
  try {
    const saved = localStorage.getItem('olympiadhub_test_pricing');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        mock_test_price: Number(parsed.mock_test_price) || 99,
        practice_test_price: Number(parsed.practice_test_price) || 99,
        original_price: Number(parsed.original_price) || 299,
        test_pack_price: Number(parsed.mock_test_price) || Number(parsed.test_pack_price) || 99
      };
    }
  } catch (e) {}
  return { ...DEFAULT_TEST_PRICING };
};

export const saveTestPricing = (newPricing) => {
  try {
    const current = getTestPricing();
    const mockPrice = Number(newPricing.mock_test_price !== undefined ? newPricing.mock_test_price : current.mock_test_price) || 99;
    const practicePrice = Number(newPricing.practice_test_price !== undefined ? newPricing.practice_test_price : current.practice_test_price) || 99;
    const origPrice = Number(newPricing.original_price !== undefined ? newPricing.original_price : current.original_price) || 299;

    const updated = {
      mock_test_price: mockPrice,
      practice_test_price: practicePrice,
      original_price: origPrice,
      test_pack_price: mockPrice
    };

    localStorage.setItem('olympiadhub_test_pricing', JSON.stringify(updated));

    // Also sync to mock db bank_settings if stored
    try {
      const dbSettings = JSON.parse(localStorage.getItem('olympiadhub_db_bank_settings') || '{}');
      localStorage.setItem('olympiadhub_db_bank_settings', JSON.stringify({
        ...dbSettings,
        test_pack_price: mockPrice,
        mock_test_price: mockPrice,
        practice_test_price: practicePrice,
        original_price: origPrice
      }));
    } catch (e) {}

    // Dispatch global event for instantaneous reactive updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('olympiadhub-pricing-updated', { detail: updated }));
      window.dispatchEvent(new Event('storage'));
    }

    return updated;
  } catch (e) {
    console.error('Failed to save test pricing:', e);
    return getTestPricing();
  }
};

export const savePurchasedSubject = (subCode, altCode, studentClass, orderDetails = {}) => {
  const current = getPurchasedTests();
  const rawSub = String(subCode).toLowerCase().trim();
  const rawAlt = altCode ? String(altCode).toLowerCase().trim() : '';
  const classNum = normalizeClassNumber(studentClass) || '6';

  // Strictly store class-scoped keys so that ONLY this specific class is unlocked!
  const newKeys = [
    `class_${classNum}_${rawSub}`,
    `class ${classNum}_${rawSub}`
  ];
  if (rawAlt) {
    newKeys.push(`class_${classNum}_${rawAlt}`);
    newKeys.push(`class ${classNum}_${rawAlt}`);
  }

  const updated = Array.from(new Set([...current, ...newKeys]));
  try {
    localStorage.setItem('olympiadhub_purchased_tests', JSON.stringify(updated));
  } catch (e) {}

  const pricing = getTestPricing();
  const defaultAmount = pricing.mock_test_price || 99;

  const orderPayload = {
    order_id: orderDetails.order_id || `ORD-MOCK-${Date.now().toString().slice(-6)}`,
    grade: `Class ${classNum}`,
    subject: subCode,
    subject_name: orderDetails.subject_name || subCode,
    amount: orderDetails.amount || defaultAmount,
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
