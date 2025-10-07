const DEFAULTS = {
  stopAutoCentering: true,
  moveInlineButtons: true,
  highlightNonInteractive: true,
  highlightColumnIndex: 1,
  highlightColor: '#fff8d6',
  hideStudentIds: true,
  forceLastFirst: true,
  hideNameToggle: false,
  gutterEnabled: true,
  gutterRem: 2.5
};

const ids = Object.keys(DEFAULTS);
const $ = id => document.getElementById(id);

// minimal storage adapter with safe fallbacks
const store = (() => {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const area = chrome.storage.sync || chrome.storage.local;
      return {
        get: (defaults, cb) => area.get(defaults, r => cb(r || defaults)),
        set: (obj) => area.set(obj)
      };
    }
  } catch (_) {}
  // in-memory fallback (not persistent)
  let mem = {};
  return {
    get: (defaults, cb) => cb(Object.assign({}, defaults, mem)),
    set: (obj) => Object.assign(mem, obj)
  };
})();

function load() {
  store.get(DEFAULTS, st => {
    ids.forEach(k => {
      const el = $(k); if (!el) return;
      if (typeof DEFAULTS[k] === 'boolean') el.checked = !!st[k];
      else el.value = st[k];
    });
    const hc = $('highlightColor'); if (hc) document.getElementById('hex')?.textContent = hc.value.toLowerCase();
    const gr = $('gutterRem'); if (gr) document.getElementById('gutterVal')?.textContent = gr.value + ' rem';
  });
}

function saveOne(key, value) { store.set({ [key]: value }); }

ids.forEach(k => {
  const el = $(k); if (!el) return;
  el.addEventListener('input', () => {
    let val = (typeof DEFAULTS[k] === 'boolean') ? el.checked : el.value;
    if (k === 'highlightColumnIndex') val = Math.max(0, parseInt(val || '0', 10));
    if (k === 'gutterRem') { val = parseFloat(val || '0'); document.getElementById('gutterVal').textContent = val + ' rem'; }
    if (k === 'highlightColor') document.getElementById('hex').textContent = val.toLowerCase();
    saveOne(k, val);
  });
});

document.addEventListener('DOMContentLoaded', load);
