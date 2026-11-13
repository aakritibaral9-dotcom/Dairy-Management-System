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
const RATE_FATS = [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5];
const RATE_SNFS = [7.5, 8.0, 8.5, 9.0];

const RateChart = {
  KEY: "dairy_rate_chart",
  keyOf(fat, snf) { return fat.toFixed(1) + "|" + snf.toFixed(1); },
  seed() {
    const map = {};
    RATE_FATS.forEach((f) => {
      RATE_SNFS.forEach((s) => {
        map[this.keyOf(f, s)] = Math.round(20 + f * 8 + (s - 7.5) * 4);
      });
    });
    return map;
  },
  all() {
    let map = Store.load(this.KEY, null);
    if (!map) {
      map = this.seed();
      Store.save(this.KEY, map);
    }
    return map;
  },
  save(map) { Store.save(this.KEY, map); },
  reset() { localStorage.removeItem(this.KEY); },

  /* Returns the rate per liter, or null if Fat/SNF is below the chart.
     Values between steps use the step below (e.g. Fat 4.3 uses 4.0). */
  lookup(fat, snf) {
    const f = [...RATE_FATS].reverse().find((x) => x <= fat);
    const s = [...RATE_SNFS].reverse().find((x) => x <= snf);
    if (f === undefined || s === undefined) return null;
    const v = this.all()[this.keyOf(f, s)];
    return v === undefined ? null : Number(v);
  },
};
const Collections = {
  KEY: "dairy_collections",
  all() { return Store.load(this.KEY, []); },
  save(list) { Store.save(this.KEY, list); },
  add(entry) {
    const list = this.all();
    entry.id = Date.now();
    list.push(entry);
    this.save(list);
    return entry;
  },
  remove(id) { this.save(this.all().filter((e) => e.id !== id)); },
};