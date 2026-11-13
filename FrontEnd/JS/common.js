/* Shared helpers for every page */

const NAV = {
  admin: [
    { key: "dashboard", label: "Dashboard", href: "dashboard.html" },
    { key: "farmers", label: "Farmers", href: "farmers.html" },
    { key: "collection", label: "Milk Collection", href: "milk-collection.html" },
    { key: "rates", label: "Rate Chart", href: "rate-chart.html" },
    { key: "payments", label: "Payments", href: "payments.html" },
  ],
  farmer: [
    { key: "dashboard", label: "Dashboard", href: "dashboard.html" },
    { key: "collections", label: "My Collections", href: "my-collections.html" },
    { key: "payments", label: "My Payments", href: "my-payments.html" },
  ],
};

/* Temporary session. Replaced by Django login in js/api.js (last file). */
const Session = {
  get() {
    try { return JSON.parse(sessionStorage.getItem("dairy_user")); }
    catch (e) { return null; }
  },
  set(user) { sessionStorage.setItem("dairy_user", JSON.stringify(user)); },
  clear() { sessionStorage.removeItem("dairy_user"); },
};

/* Put at the top of every protected page: requireRole("admin") */
function requireRole(role) {
  const user = Session.get();
  if (!user || user.role !== role) {
    window.location.href = "../index.html";
    return null;
  }
  return user;
}

function logout() {
  Session.clear();
  window.location.href = "../index.html";
}

/* Builds sidebar + top bar. Page needs <aside id="sidebar"> and <header id="topbar"> */
function renderLayout(role, activeKey) {
  const user = Session.get();
  const sidebar = document.getElementById("sidebar");
  const topbar = document.getElementById("topbar");

  sidebar.className =
    "no-print fixed inset-y-0 left-0 z-40 w-64 -translate-x-full bg-brand-900 transition-transform lg:translate-x-0";

  const links = NAV[role]
    .map((n) => {
      const cls = n.key === activeKey ? "nav-link nav-link-active" : "nav-link";
      return `<a href="${n.href}" class="${cls}">${n.label}</a>`;
    })
    .join("");

  sidebar.innerHTML = `
    <div class="border-b border-brand-800 px-6 py-5">
      <h1 class="text-lg font-bold text-white">Dairy System</h1>
      <p class="text-xs capitalize text-brand-100">${role} panel</p>
    </div>
    <nav class="space-y-1 p-4">${links}</nav>`;

  topbar.className =
    "no-print flex h-16 items-center border-b border-slate-200 bg-white px-6";
  topbar.innerHTML = `
    <button id="menuBtn" class="mr-3 text-2xl text-slate-600 lg:hidden" aria-label="Menu">&#9776;</button>
    <div class="ml-auto flex items-center gap-4">
      <span class="text-sm text-slate-600">${user ? user.name : ""}</span>
      <button id="logoutBtn" class="text-sm font-medium text-red-600 hover:underline">Logout</button>
    </div>`;

  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("menuBtn").addEventListener("click", () => {
    sidebar.classList.toggle("-translate-x-full");
  });
}

/* Small popup message */
function showToast(message, type) {
  const colors = { success: "bg-green-600", error: "bg-red-600", info: "bg-slate-800" };
  const el = document.createElement("div");
  el.className =
    "fixed right-5 top-5 z-50 rounded-lg px-4 py-3 text-sm text-white shadow-lg " +
    (colors[type] || colors.info);
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

/* Formatters */
function formatNPR(n) {
  return "Rs. " + Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function formatDate(d) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}