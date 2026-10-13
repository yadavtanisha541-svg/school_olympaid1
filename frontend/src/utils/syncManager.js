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

    // Listen to messages from Vercel bridge iframe OR popup window
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
            window.dispatchEvent(new CustomEvent('olympiadhub-pricing-updated'));
            window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated'));
            window.dispatchEvent(new CustomEvent('role-permissions-updated'));
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
      if (!k) continue;
      if (k.startsWith('ally-') || k.startsWith('__')) continue;
      data[k] = localStorage.getItem(k);
    }
    return data;
  },

  syncAll() {
    const localData = this.getAllLocalData();
    this.pushToVercel(localData);
    this.pullFromVercel();
    // Also trigger popup pull to guarantee unpartitioned top-level sync
    if (IS_LOCAL) {
      this.pullFromVercelPopup();
    }
  },

  // Direct top-level popup pull (bypasses 3rd-party storage partitioning in modern Chrome/Edge)
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
      window.dispatchEvent(new CustomEvent('olympiadhub-data-updated'));
      window.dispatchEvent(new CustomEvent('olympiadhub-pricing-updated'));
      window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated'));
      window.dispatchEvent(new CustomEvent('role-permissions-updated'));
      window.dispatchEvent(new Event('storage'));
      notifyListeners({ status: 'synced', count });
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
