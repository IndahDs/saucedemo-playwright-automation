const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const mode = process.argv[2] || 'generate'; // 'generate' or 'serve'
const resultsBaseDir = path.resolve(__dirname, '../allure-results');
const reportDir = path.resolve(__dirname, '../allure-report');

let targetDirs = [];

if (fs.existsSync(resultsBaseDir)) {
  const subdirs = fs.readdirSync(resultsBaseDir, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => path.join(resultsBaseDir, item.name));

  if (subdirs.length > 0) {
    targetDirs = subdirs;
  } else {
    targetDirs = [resultsBaseDir];
  }
} else {
  targetDirs = [resultsBaseDir];
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const quotedDirs = targetDirs.map(d => `"${path.relative(process.cwd(), d)}"`);
const quotedReportDir = `"${path.relative(process.cwd(), reportDir)}"`;

if (mode === 'generate') {
  console.log(`Generating Allure Report from directories:`);
  targetDirs.forEach(d => console.log(` - ${path.relative(process.cwd(), d)}`));
  const res = spawnSync(npx, ['allure', 'generate', ...quotedDirs, '--clean', '-o', quotedReportDir], {
    stdio: 'inherit',
    shell: true
  });
  process.exit(res.status || 0);
} else if (mode === 'serve') {
  console.log(`Serving Allure Report from directories:`);
  targetDirs.forEach(d => console.log(` - ${path.relative(process.cwd(), d)}`));
  const res = spawnSync(npx, ['allure', 'serve', ...quotedDirs], {
    stdio: 'inherit',
    shell: true
  });
  process.exit(res.status || 0);
}
