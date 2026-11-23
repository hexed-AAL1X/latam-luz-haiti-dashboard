/* Dashboard narrativo — lee latam_energy_clean.csv directamente */
const COLORS = {
  ink: "#264653",
  teal: "#2a9d8f",
  sand: "#e9c46a",
  coral: "#e76f51",
  muted: "#8a9a9d",
  grid: "rgba(38, 70, 83, 0.08)",
};

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCSVLine(line);
    const row = {};
    headers.forEach((h, i) => {
      const raw = cells[i] ?? "";
      row[h] = raw === "" ? null : isFinite(Number(raw)) && h !== "iso_code" && h !== "country" ? Number(raw) : raw;
    });
    return row;
  });
}

function splitCSVLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
      continue;
    }
    if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function latestByCountry(rows, metric) {
  const map = new Map();
  for (const r of rows) {
    if (r[metric] == null || r.country == null) continue;
    const prev = map.get(r.country);
    if (!prev || r.year > prev.year) map.set(r.country, r);
  }
  return [...map.values()];
}

function median(nums) {
  const a = [...nums].sort((x, y) => x - y);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

function fmtPct(v, d = 1) {
  return `${Number(v).toFixed(d)}%`;
}

async function main() {
  const status = document.getElementById("status");
  try {
    const res = await fetch("latam_energy_clean.csv", { cache: "no-store" });
    if (!res.ok) throw new Error(`No se pudo leer CSV (${res.status})`);
    const rows = parseCSV(await res.text());

    const accessLatest = latestByCountry(rows, "access_to_electricity")
      .sort((a, b) => a.access_to_electricity - b.access_to_electricity);

    const haiti = accessLatest.find((r) => r.country === "Haiti");
    const high = accessLatest.filter((r) => r.access_to_electricity >= 95).length;
    const med = median(accessLatest.map((r) => r.access_to_electricity));

    document.getElementById("kpi-high").textContent = String(high);
    document.getElementById("kpi-haiti").textContent = haiti ? fmtPct(haiti.access_to_electricity) : "—";
    document.getElementById("kpi-median").textContent = med != null ? fmtPct(med) : "—";

    buildRankChart(accessLatest, haiti);
    buildTrendChart(rows);
    buildScatterChart(rows);

    document.getElementById("sec1").hidden = false;
    document.getElementById("sec2").hidden = false;
    document.getElementById("sec3").hidden = false;
    status.remove();
  } catch (err) {
    status.className = "error";
    status.textContent = `Error cargando datos: ${err.message}`;
  }
}

function buildRankChart(accessLatest, haiti) {
  const labels = accessLatest.map((r) => r.country);
  const data = accessLatest.map((r) => r.access_to_electricity);
  const colors = accessLatest.map((r) => (r.country === "Haiti" ? COLORS.coral : COLORS.teal));

  new Chart(document.getElementById("chartRank"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Acceso a electricidad (%)",
        data,
        backgroundColor: colors,
        borderSkipped: false,
        borderRadius: 6,
        barPercentage: 0.85,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${fmtPct(ctx.raw)}`,
          },
        },
        annotation: haiti ? {
          annotations: {
            haitiNote: {
              type: "label",
              xValue: Math.min(haiti.access_to_electricity + 18, 92),
              yValue: "Haiti",
              backgroundColor: "rgba(231, 111, 81, 0.12)",
              borderColor: COLORS.coral,
              borderWidth: 1,
              borderRadius: 8,
              color: COLORS.ink,
              content: [
                `Haití: ${fmtPct(haiti.access_to_electricity)}`,
                "Casi la mitad de la población",
                "sigue sin acceso (2024)",
              ],
              font: { size: 12, weight: "600" },
              padding: 8,
            },
          },
        } : {},
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { color: COLORS.grid },
          ticks: { callback: (v) => `${v}%`, color: COLORS.muted },
          title: { display: true, text: "Porcentaje de población con acceso", color: COLORS.ink },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.ink, font: { size: 11 } },
        },
      },
    },
  });
}

function buildTrendChart(rows) {
  const focus = ["Haiti", "Nicaragua", "Guatemala", "Honduras"];
  const years = [...new Set(rows.map((r) => r.year))].sort((a, b) => a - b)
    .filter((y) => y >= 2000 && y <= 2024);

  const byCountryYear = new Map();
  for (const r of rows) {
    if (r.access_to_electricity == null) continue;
    byCountryYear.set(`${r.country}|${r.year}`, r.access_to_electricity);
  }

  const medianSeries = years.map((y) => {
    const vals = rows.filter((r) => r.year === y && r.access_to_electricity != null)
      .map((r) => r.access_to_electricity);
    return median(vals);
  });

  const datasets = [
    {
      label: "Mediana LatAm",
      data: medianSeries,
      borderColor: COLORS.muted,
      backgroundColor: "transparent",
      borderWidth: 2,
      borderDash: [6, 4],
      pointRadius: 0,
      tension: 0.25,
    },
    ...focus.map((country, i) => {
      const palette = [COLORS.coral, COLORS.ink, COLORS.teal, COLORS.sand];
      return {
        label: country,
        data: years.map((y) => byCountryYear.get(`${country}|${y}`) ?? null),
        borderColor: palette[i],
        backgroundColor: "transparent",
        borderWidth: country === "Haiti" ? 3 : 2,
        pointRadius: country === "Haiti" ? 2 : 0,
        tension: 0.25,
      };
    }),
  ];

  new Chart(document.getElementById("chartTrend"), {
    type: "line",
    data: { labels: years, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: COLORS.ink, usePointStyle: true, pointStyle: "line" },
        },
        tooltip: {
          callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw == null ? "s/d" : fmtPct(ctx.raw)}` },
        },
      },
      scales: {
        x: {
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, maxRotation: 0 },
        },
        y: {
          min: 20,
          max: 100,
          grid: { color: COLORS.grid },
          ticks: { callback: (v) => `${v}%`, color: COLORS.muted },
          title: { display: true, text: "Acceso a electricidad", color: COLORS.ink },
        },
      },
    },
  });
}

function buildScatterChart(rows) {
  const renew = latestByCountry(rows, "renewables_share_elec");
  const accessMap = new Map(latestByCountry(rows, "access_to_electricity").map((r) => [r.country, r.access_to_electricity]));

  const points = renew.map((r) => ({
    x: accessMap.get(r.country),
    y: r.renewables_share_elec,
    country: r.country,
  })).filter((p) => p.x != null && p.y != null);

  new Chart(document.getElementById("chartScatter"), {
    type: "scatter",
    data: {
      datasets: [{
        label: "Países LatAm",
        data: points,
        parsing: false,
        pointRadius: (ctx) => (ctx.raw.country === "Haiti" ? 9 : 6),
        backgroundColor: (ctx) => (ctx.raw.country === "Haiti" ? COLORS.coral : COLORS.teal),
        borderColor: COLORS.ink,
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const p = ctx.raw;
              return ` ${p.country}: acceso ${fmtPct(p.x)} · renovables elec. ${fmtPct(p.y)}`;
            },
          },
        },
        annotation: {
          annotations: {
            haiti: {
              type: "label",
              xValue: points.find((p) => p.country === "Haiti")?.x ?? 54,
              yValue: (points.find((p) => p.country === "Haiti")?.y ?? 19) + 12,
              content: ["Haití: rezago doble", "acceso + matriz limpia"],
              color: COLORS.ink,
              backgroundColor: "rgba(231, 111, 81, 0.12)",
              borderColor: COLORS.coral,
              borderWidth: 1,
              borderRadius: 8,
              font: { size: 12, weight: "600" },
              padding: 8,
            },
          },
        },
      },
      scales: {
        x: {
          min: 40,
          max: 100,
          title: { display: true, text: "Acceso a electricidad (%)", color: COLORS.ink },
          grid: { color: COLORS.grid },
          ticks: { callback: (v) => `${v}%`, color: COLORS.muted },
        },
        y: {
          min: 0,
          max: 105,
          title: { display: true, text: "Electricidad renovable (%)", color: COLORS.ink },
          grid: { color: COLORS.grid },
          ticks: { callback: (v) => `${v}%`, color: COLORS.muted },
        },
      },
    },
  });
}

main();
