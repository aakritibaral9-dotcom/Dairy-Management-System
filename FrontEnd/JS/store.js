/* Temporary browser storage + demo data.
   Replaced by Django API calls in js/api.js (last step). */

const Store = {
  load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  },
};

/* Escape text before putting it into HTML (prevents broken pages / script injection) */
function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

const SEED_FARMERS = [
  { code: "F001", name: "Ram Bahadur Gurung", phone: "9846000001", address: "Lekhnath-12", status: "active" },
  { code: "F002", name: "Sita Thapa", phone: "9856000002", address: "Pokhara-17, Hemja", status: "active" },
  { code: "F003", name: "Hari Prasad Adhikari", phone: "9806000003", address: "Lekhnath-8", status: "active" },
  { code: "F004", name: "Maya Pun", phone: "9816000004", address: "Pokhara-25, Simalchaur", status: "inactive" },
  { code: "F005", name: "Krishna KC", phone: "9866000005", address: "Lekhnath-3", status: "active" },
];

const Farmers = {
  KEY: "dairy_farmers",
  all() {
    let list = Store.load(this.KEY, null);
    if (!list) {
      list = SEED_FARMERS;
      Store.save(this.KEY, list);
    }
    return list;
  },
  save(list) { Store.save(this.KEY, list); },
  nextCode(list) {
    const max = list.reduce((m, f) => Math.max(m, parseInt(f.code.slice(1), 10) || 0), 0);
    return "F" + String(max + 1).padStart(3, "0");
  },
};