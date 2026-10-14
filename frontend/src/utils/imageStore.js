// OlympiadHub - Persistent IndexedDB & In-Memory Media Store
// Allows unlimited storage of question diagrams, illustrations, and figures without 5MB localStorage quota limits.

const DB_NAME = 'olympiadhub_media_db';
const STORE_NAME = 'diagram_images';
const DB_VERSION = 1;

let dbInstance = null;

// Initialize global in-memory cache
if (typeof window !== 'undefined') {
  if (!window._olympiadhub_img_cache) {
    window._olympiadhub_img_cache = {};
  }
}

/**
 * Open or retrieve IndexedDB instance
 */
function getDb() {
  if (typeof window === 'undefined' || !window.indexedDB) return Promise.resolve(null);
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = (e) => {
        dbInstance = e.target.result;
        resolve(dbInstance);
      };
      req.onerror = () => {
        console.warn('[ImageStore] IndexedDB open error, using memory fallback');
        resolve(null);
      };
    } catch (e) {
      resolve(null);
    }
  });
}

/**
 * Normalizes question statement string for fuzzy key lookup
 */
export function normalizeTextKey(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/^(\d+[\.\)\s]+)/, '') // remove leading question numbers like "1. ", "(1) "
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Save an image to both memory cache and IndexedDB
 */
export async function saveImageToStore(key, dataUrl) {
  if (!key || !dataUrl) return;

  // 1. In-memory fast cache
  if (typeof window !== 'undefined') {
    window._olympiadhub_img_cache[key] = dataUrl;
  }

  // 2. Persist to IndexedDB
  try {
    const db = await getDb();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(dataUrl, key);
  } catch (err) {
    console.warn('[ImageStore] Save error:', err);
  }
}

/**
 * Save multiple images in batch
 */
export async function saveMultipleImages(imgMap = {}) {
  if (!imgMap || typeof imgMap !== 'object') return;
  const entries = Object.entries(imgMap);
  if (entries.length === 0) return;

  // 1. In-memory
  if (typeof window !== 'undefined') {
    Object.assign(window._olympiadhub_img_cache, imgMap);
  }

  // 2. IndexedDB batch
  try {
    const db = await getDb();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const [k, v] of entries) {
      if (k && v) store.put(v, k);
    }
  } catch (err) {
    console.warn('[ImageStore] Batch save error:', err);
  }
}

/**
 * Retrieve image synchronously from memory cache
 */
export function getCachedImageSync(key) {
  if (!key) return null;
  if (typeof window !== 'undefined' && window._olympiadhub_img_cache) {
    if (window._olympiadhub_img_cache[key]) return window._olympiadhub_img_cache[key];
    const norm = normalizeTextKey(key);
    if (norm && window._olympiadhub_img_cache[norm]) return window._olympiadhub_img_cache[norm];
  }
  return null;
}

/**
 * Retrieve image asynchronously from IndexedDB
 */
export async function getImageFromStore(key) {
  if (!key) return null;
  const cached = getCachedImageSync(key);
  if (cached) return cached;

  try {
    const db = await getDb();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        const res = req.result;
        if (res && typeof window !== 'undefined') {
          window._olympiadhub_img_cache[key] = res;
        }
        resolve(res || null);
      };
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

/**
 * Auto-preload entire IndexedDB image cache into window memory on page load
 */
export async function preloadAllImages() {
  try {
    const db = await getDb();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (typeof window !== 'undefined' && cursor.key && cursor.value) {
          window._olympiadhub_img_cache[cursor.key] = cursor.value;
        }
        cursor.continue();
      }
    };
  } catch (e) {
    console.warn('[ImageStore] Preload error:', e);
  }
}

// Auto-run preload on import
if (typeof window !== 'undefined') {
  preloadAllImages().catch(() => null);
}

export default {
  saveImageToStore,
  saveMultipleImages,
  getCachedImageSync,
  getImageFromStore,
  normalizeTextKey,
  preloadAllImages
};
