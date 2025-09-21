// Small client-side script:
// - toggles light/dark theme (saved in localStorage)
// - calls /api/health and /api/random-verse
// - copies the current verse to clipboard

const $ = (s) => document.querySelector(s);

/* Theme toggle */
const root = document.documentElement;
const toggleBtn = $("#theme-toggle");
function setTheme(mode) {
  root.classList.toggle("theme-dark", mode === "dark");
  localStorage.setItem("theme", mode);
  toggleBtn.textContent = mode === "dark" ? "☀︎" : "☾";
}
setTheme(localStorage.getItem("theme") ?? "dark");
toggleBtn.addEventListener("click", () => {
  setTheme(root.classList.contains("theme-dark") ? "light" : "dark");
});

/* Health check */
$("#btn-health").addEventListener("click", async () => {
  try {
    const r = await fetch("/api/health");
    $("#out-health").textContent = JSON.stringify(await r.json(), null, 2);
  } catch {
    $("#out-health").textContent = "Health check failed.";
  }
});

/* Random verse */
$("#btn-verse").addEventListener("click", async () => {
  try {
    const r = await fetch("/api/random-verse");
    const v = await r.json();
    $("#ar").textContent = v.arabic ?? "";
    $("#en").textContent = v.english ?? "";
    $("#ref").textContent = v.reference ? `Reference: ${v.reference}` : "";
    $("#src").textContent = v.source ? `Source: ${v.source}` : "";
  } catch {
    $("#ar").textContent = "";
    $("#en").textContent = "Could not load verse. Try again.";
    $("#ref").textContent = "";
    $("#src").textContent = "";
  }
});

/* Copy verse */
$("#btn-copy").addEventListener("click", async () => {
  const ar = $("#ar").textContent.trim();
  const en = $("#en").textContent.trim();
  const ref = $("#ref").textContent.replace(/^Reference:\s*/i, "").trim();
  const text = [ar, en, ref && `(${ref})`].filter(Boolean).join("\n");
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    const btn = $("#btn-copy");
    const old = btn.textContent;
    btn.textContent = "Copied ✓";
    setTimeout(() => (btn.textContent = old), 1000);
  } catch {
    alert("Copy failed. You can select and copy manually.");
  }
});
