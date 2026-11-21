const fs = require("fs");
const path = require("path");

const targetDir = process.argv[2] || ".";
const pkgPath = path.join(targetDir, "package.json");

let depCount = 0;
let pkgStatus = "ok";

try {
  const raw = fs.readFileSync(pkgPath, "utf8");
  const pkg = JSON.parse(raw);
  const deps = Object.keys(pkg.dependencies || {});
  const devDeps = Object.keys(pkg.devDependencies || {});
  depCount = deps.length + devDeps.length;
} catch (err) {
  pkgStatus = fs.existsSync(pkgPath) ? "malformed-json" : "missing";
}

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (/\.(js|html|css)$/i.test(entry.name)) {
      files.push(path.relative(targetDir, fullPath));
    }
  }
}

try {
  walk(targetDir);
} catch (err) {
  // Ignore unreadable folders so scanning does not crash
}

const healthScore = Math.max(
  0,
  Math.min(100, 100 - (pkgStatus === "ok" ? 0 : 15) - Math.max(0, depCount - 20))
);

const report = {
  scannedAt: new Date().toISOString(),
  pkgStatus,
  depCount,
  fileCount: files.length,
  healthScore,
  files
};

fs.writeFileSync(path.join(targetDir, "report.json"), JSON.stringify(report, null, 2));
console.log("Scan complete. Health score:", healthScore);