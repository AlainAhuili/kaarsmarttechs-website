// Category filter for /projects/. Served as a file because the CSP is script-src 'self'.
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-filter]");
  const rows = document.querySelectorAll("#project-list > li");
  const count = document.getElementById("count");

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      let shown = 0;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      rows.forEach((row) => {
        const match = filter === "all" || row.dataset.categories.split(" ").includes(filter);
        row.hidden = !match;
        if (match) shown++;
      });
      count.textContent = `${shown} ${shown === 1 ? "project" : "projects"}`;
    }),
  );
});
