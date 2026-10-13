// OlympiadHub - Bidirectional Real-Time Sync Manager (Vercel ⇄ Localhost)
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

export const syncManager = {
  init() {
    if (typeof window === 'undefined') return;

    // Listen to messages from Vercel bridge iframe
    window.addEventListener('message', (event) => {
      const origin = event.origin || '';
      if (!origin.includes('vercel.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }

      const { type, data } = event.data || {};

      if (type === 'VERCEL_BRIDGE_LOADED' || type === 'RESPONSE_VERCEL_DATA') {
        isBridgeReady = true;
        if (data && typeof data === 'object') {
          let updatedCount = 0;
          Object.keys(data).forEach((key) => {
            const vercelVal = data[key];
            if (vercelVal !== null && vercelVal !== undefined) {
              // Apply keys to localhost
              const localVal = localStorage.getItem(key);
              if (!localVal || localVal !== vercelVal) {
                localStorage.setItem(key, vercelVal);
                updatedCount++;
              }
            }
          });

          if (updatedCount > 0) {
            console.log(`[SyncManager] Synchronized ${updatedCount} items from Vercel!`);
            window.dispatchEvent(new CustomEvent('olympiadhub-data-updated'));
            window.dispatchEvent(new Event('storage'));
          }
          notifyListeners({ status: 'synced', count: updatedCount });
        }
      }

      if (type === 'UPDATE_VERCEL_DATA_ACK') {
        notifyListeners({ status: 'pushed' });
      }
    });

    // If on localhost, embed bridge iframe to connect with live Vercel
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

        // Auto request after 2s in case iframe loaded quickly
        setTimeout(() => {
          this.pullFromVercel();
        }, 2000);
      } catch (e) {
        console.warn('[SyncManager] Bridge initialization error:', e);
      }
    }

    // Proactively listen to local storage writes to push to Vercel
    window.addEventListener('olympiadhub-data-updated', (e) => {
      if (e.detail && e.detail.table) {
        const key = `olympiadhub_db_${e.detail.table}`;
        const val = localStorage.getItem(key);
        if (val) {
          this.pushToVercel({ [key]: val });
          return;
        }
      }
      this.pushToVercel(this.getAllLocalData());
    });
  },

  getAllLocalData() {
    const data = {};
    if (typeof localStorage === 'undefined') return data;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('olympiadhub_') || k.startsWith('admin_') || k.startsWith('mock_') || k === 'token' || k === 'user')) {
        data[k] = localStorage.getItem(k);
      }
    }
    return data;
  },

  syncAll() {
    const localData = this.getAllLocalData();
    this.pushToVercel(localData);
    this.pullFromVercel();
  },

  pullFromVercel() {
    if (bridgeIframe && bridgeIframe.contentWindow) {
      try {
        bridgeIframe.contentWindow.postMessage({ type: 'REQUEST_VERCEL_DATA' }, '*');
      } catch (e) {}
    }
  },

  pushToVercel(payload) {
    if (bridgeIframe && bridgeIframe.contentWindow) {
      try {
        bridgeIframe.contentWindow.postMessage({ type: 'UPDATE_VERCEL_DATA', payload }, '*');
      } catch (e) {}
    }
  },

  exportAllData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('olympiadhub_') || k.startsWith('admin_') || k === 'token' || k === 'user')) {
        data[k] = localStorage.getItem(k);
      }
    }
    return JSON.stringify(data, null, 2);
  },

  importAllData(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      let count = 0;
      Object.keys(data).forEach((k) => {
        localStorage.setItem(k, data[k]);
        count++;
      });
      window.dispatchEvent(new CustomEvent('olympiadhub-data-updated'));
      window.dispatchEvent(new Event('storage'));
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
