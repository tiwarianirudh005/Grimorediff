const state = {
  report: null,
  filter: "all",
  search: ""
};

function addLog(message) {
  const log = document.getElementById("event-log");
  if (!log) return;
  const item = document.createElement("li");
  item.textContent = message;
  log.appendChild(item);
}

function renderReport(data) {
  state.report = data;
  const scoreEl = document.getElementById("health-score");
  const totalEl = document.getElementById("total-nodes");
  const dormantEl = document.getElementById("dormant-count");
  const riskEl = document.getElementById("risk-count");
  const gridEl = document.getElementById("tombstone-grid");
  const nodeLayer = document.getElementById("node-layer");

  if (scoreEl) scoreEl.innerHTML = `${data.healthScore ?? "--"}<span>/100</span>`;
  if (totalEl) totalEl.textContent = String((data.files || []).length);
  if (dormantEl) dormantEl.textContent = String((data.files || []).length);
  if (riskEl) riskEl.textContent = String(data.depCount ?? 0);

  const query = state.search.trim().toLowerCase();
  const filteredFiles = (data.files || []).filter((f) =>
    f.toLowerCase().includes(query)
  );

  if (gridEl) {
    gridEl.innerHTML = filteredFiles
      .map(
        (file) =>
          `<article class="tombstone-card"><strong>${file}</strong><span>Status: ${data.pkgStatus}</span></article>`
      )
      .join("");
  }

  if (nodeLayer) {
    nodeLayer.innerHTML = filteredFiles
      .map(
        (file, idx) =>
          `<div class="graph-node" style="left:${40 + (idx % 3) * 180}px;top:${40 + Math.floor(idx / 3) * 90}px;">${file}</div>`
      )
      .join("");
  }
}

async function loadScannerReport() {
  try {
    const res = await fetch("../scanner/report.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderReport(data);
    addLog(`[LOADED] scanner/report.json (Score: ${data.healthScore})`);
  } catch (err) {
    addLog(`[WARN] Could not auto-load report.json: ${err.message}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadScannerReport();

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const view = btn.dataset.view;
      const graphView = document.getElementById("view-constellation");
      const tombView = document.getElementById("view-tombstones");
      if (graphView && tombView) {
        const isGraph = view === "constellation";
        graphView.hidden = !isGraph;
        tombView.hidden = isGraph;
      }
    });
  });

  const searchInput = document.getElementById("entity-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.search = e.target.value;
      if (state.report) renderReport(state.report);
    });
  }

  const uploadInput = document.getElementById("report-upload");
  if (uploadInput) {
    uploadInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          renderReport(parsed);
          addLog(`[LOADED] Uploaded ${file.name}`);
        } catch (err) {
          addLog(`[ERROR] Invalid JSON in ${file.name}`);
        }
      };
      reader.readAsText(file);
    });
  }
});