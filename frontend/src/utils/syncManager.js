// OlympiadHub - Bidirectional Real-Time Cloud Sync Engine (Vercel ⇄ Localhost)
// Provides 100% zero-click, automatic real-time sync across Localhost and Vercel.

const CLOUD_SYNC_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a1349d43f752db';
const VERCEL_DOMAIN = 'https://school-olympaid1.vercel.app';
const IS_LOCAL = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.') ||
  window.location.hostname.startsWith('10.') ||
  window.location.hostname.startsWith('172.')
);

let bridgeIframe = null;
let isBridgeReady = false;
let listeners = [];
let pushDebounceTimer = null;
let pollInterval = null;
let isPushing = false;
let isPulling = false;

export const syncManager = {
  lastSyncTime: null,

  init() {
    if (typeof window === 'undefined') return;

    // 1. Immediate initial pull from the central cloud database
    setTimeout(() => {
      this.pullFromCloud();
    }, 400);

    // 2. Continuous real-time background polling (every 12 seconds)
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(() => {
      this.pullFromCloud();
    }, 12000);

    // 3. Tab focus & visibility change: Pull immediately when user switches to this tab
    window.addEventListener('focus', () => {
      this.pullFromCloud();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.pullFromCloud();
      }
    });

    // 4. Proactive write listeners: Automatically schedule push to Cloud on ANY local edit
    window.addEventListener('olympiadhub-data-updated', () => this.schedulePush());
    window.addEventListener('olympiadhub-pricing-updated', () => this.schedulePush());
    window.addEventListener('olympiadhub-admin-papers-updated', () => this.schedulePush());
    window.addEventListener('role-permissions-updated', () => this.schedulePush());
    window.addEventListener('storage', (e) => {
      if (e && e.key && (e.key.startsWith('olympiadhub_') || e.key.includes('paper'))) {
        this.schedulePush();
      }
    });

    // 5. Fallback iframe bridge listener (for secondary browser messaging)
    window.addEventListener('message', (event) => {
      const origin = event.origin || '';
      if (!origin.includes('vercel.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }

      const { type, data } = event.data || {};

      if (type === 'VERCEL_BRIDGE_LOADED' || type === 'RESPONSE_VERCEL_DATA') {
        isBridgeReady = true;
        if (data && typeof data === 'object') {
          this.importAllData(data);
        }
      }
    });

    // Connect fallback iframe on localhost
    if (IS_LOCAL && !bridgeIframe) {
      try {
        const iframe = document.createElement('iframe');
        iframe.src = `${VERCEL_DOMAIN}/sync-bridge.html`;
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none';
        iframe.setAttribute('title', 'OlympiadHub Sync Bridge');
        document.body.appendChild(iframe);
        bridgeIframe = iframe;
      } catch (e) {
        console.warn('[SyncManager] Bridge initialization error:', e);
      }
    }
  },

  // Pull latest global data from Central Cloud DB
  async pullFromCloud() {
    if (isPulling) return false;
    isPulling = true;
    try {
      const res = await fetch(CLOUD_SYNC_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) {
        isPulling = false;
        return false;
      }

      const payload = await res.json();
      const cloudData = payload?.data;

      // If cloud has no data yet, initialize cloud with local data!
      if (!cloudData || typeof cloudData !== 'object' || Object.keys(cloudData).length === 0) {
        const localData = this.getAllLocalData();
        if (Object.keys(localData).length > 0) {
          await this.pushToCloud(localData);
        }
        isPulling = false;
        return true;
      }

      let updatedCount = 0;
      const localData = this.getAllLocalData();

      // Merge Cloud Data into Local Storage
      Object.keys(cloudData).forEach((key) => {
        const cloudVal = cloudData[key];
        if (cloudVal !== null && cloudVal !== undefined) {
          const currentLocalVal = localStorage.getItem(key);
          const normalizedCloudVal = typeof cloudVal === 'string' ? cloudVal : JSON.stringify(cloudVal);

          if (!currentLocalVal || currentLocalVal !== normalizedCloudVal) {
            localStorage.setItem(key, normalizedCloudVal);
            updatedCount++;
          }
        }
      });

      // If local had items not yet in cloud, sync them up
      let missingFromCloudCount = 0;
      Object.keys(localData).forEach((key) => {
        if (!cloudData[key] && localData[key]) {
          missingFromCloudCount++;
        }
      });
      if (missingFromCloudCount > 0) {
        this.schedulePush();
      }

      if (updatedCount > 0) {
        console.log(`[SyncManager] Real-time cloud sync: Updated ${updatedCount} items!`);
        this.dispatchUpdateEvents();
      }

      this.lastSyncTime = Date.now();
      notifyListeners({ status: 'synced', count: updatedCount, lastSyncTime: this.lastSyncTime });
      isPulling = false;
      return true;
    } catch (err) {
      console.warn('[SyncManager] Cloud pull error:', err);
      isPulling = false;
      return false;
    }
  },

  // Push current local data to Central Cloud DB
  async pushToCloud(customData = null) {
    if (isPushing) return false;
    isPushing = true;
    try {
      const dataToSend = customData || this.getAllLocalData();
      if (Object.keys(dataToSend).length === 0) {
        isPushing = false;
        return false;
      }

      const res = await fetch(CLOUD_SYNC_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: 'olympiadhub_global_sync',
          data: dataToSend
        })
      });

      if (res.ok) {
        this.lastSyncTime = Date.now();
        notifyListeners({ status: 'pushed', lastSyncTime: this.lastSyncTime });
        isPushing = false;
        return true;
      }
      isPushing = false;
      return false;
    } catch (err) {
      console.warn('[SyncManager] Cloud push error:', err);
      isPushing = false;
      return false;
    }
  },

  // Debounced push to avoid hammering server on rapid keystrokes/clicks
  schedulePush() {
    if (pushDebounceTimer) clearTimeout(pushDebounceTimer);
    pushDebounceTimer = setTimeout(() => {
      this.pushToCloud();
    }, 800);
  },

  // Broadcast events across UI components to trigger live state refreshes
  dispatchUpdateEvents() {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('olympiadhub-data-updated'));
    window.dispatchEvent(new CustomEvent('olympiadhub-pricing-updated'));
    window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated'));
    window.dispatchEvent(new CustomEvent('role-permissions-updated'));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('results-updated'));
    window.dispatchEvent(new Event('exam-submitted'));
    window.dispatchEvent(new CustomEvent('students-updated'));
  },

  getAllLocalData() {
    const data = {};
    if (typeof localStorage === 'undefined') return data;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('ally-') || k.startsWith('__')) continue;
      if (k === 'token' || k === 'olympiadhub_token') continue;
      data[k] = localStorage.getItem(k);
    }
    return data;
  },

  syncAll() {
    this.pullFromCloud();
    this.schedulePush();
    if (IS_LOCAL) {
      this.pullFromVercelPopup();
    }
  },

  pullFromVercelPopup() {
    if (typeof window === 'undefined') return null;
    const target = encodeURIComponent(window.location.origin);
    const url = `${VERCEL_DOMAIN}/sync-bridge.html?mode=pull&target=${target}&t=${Date.now()}`;
    const popup = window.open(url, 'vercel_sync_window', 'width=520,height=440,left=300,top=200');
    return popup;
  },

  pullFromVercel() {
    if (bridgeIframe && bridgeIframe.contentWindow) {
      try {
        bridgeIframe.contentWindow.postMessage({ type: 'REQUEST_VERCEL_DATA' }, '*');
      } catch (e) {}
    }
  },

  pushToVercel(payload) {
    this.schedulePush();
    if (bridgeIframe && bridgeIframe.contentWindow) {
      try {
        bridgeIframe.contentWindow.postMessage({ type: 'UPDATE_VERCEL_DATA', payload }, '*');
      } catch (e) {}
    }
  },

  exportAllData() {
    const data = this.getAllLocalData();
    return JSON.stringify(data, null, 2);
  },

  copyAllToClipboard() {
    const jsonStr = this.exportAllData();
    if (navigator && navigator.clipboard) {
      return navigator.clipboard.writeText(jsonStr);
    }
    return Promise.reject(new Error('Clipboard not available'));
  },

  importAllData(jsonStr) {
    try {
      const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON format');
      }
      let count = 0;
      Object.keys(data).forEach((k) => {
        if (data[k] === null) {
          localStorage.removeItem(k);
        } else {
          localStorage.setItem(k, typeof data[k] === 'string' ? data[k] : JSON.stringify(data[k]));
        }
        count++;
      });
      this.dispatchUpdateEvents();
      this.schedulePush();
      notifyListeners({ status: 'synced', count, lastSyncTime: Date.now() });
      return { success: true, count };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }
};

function notifyListeners(state) {
  listeners.forEach((l) => {
    try {
      l(state);
    } catch (e) {}
  });
}

export default syncManager;
