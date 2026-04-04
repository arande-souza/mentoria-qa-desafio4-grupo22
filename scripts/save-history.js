const fs = require('fs');
const path = require('path');

const latestRunPath = path.join(__dirname, '..', 'reports', 'latest-run.json');
const historyPath = path.join(__dirname, '..', 'reports', 'history.json');

if (!fs.existsSync(latestRunPath)) {
  console.error('Arquivo latest-run.json não encontrado.');
  process.exit(1);
}

const latestRun = JSON.parse(fs.readFileSync(latestRunPath, 'utf8'));
const latestRunStats = fs.statSync(latestRunPath);

const startTime = latestRun.startTime || Date.now();
const endTime = latestRunStats.mtimeMs || Date.now();
const durationMs = Math.max(0, Math.round(endTime - startTime));

const summary = {
  executionId: Date.now(),
  executedAt: new Date().toISOString(),
  totalTests: latestRun.numTotalTests ?? 0,
  passedTests: latestRun.numPassedTests ?? 0,
  failedTests: latestRun.numFailedTests ?? 0,
  pendingTests: latestRun.numPendingTests ?? 0,
  totalSuites: latestRun.numTotalTestSuites ?? 0,
  passedSuites: latestRun.numPassedTestSuites ?? 0,
  failedSuites: latestRun.numFailedTestSuites ?? 0,
  durationMs
};

summary.successRate =
  summary.totalTests > 0
    ? Number(((summary.passedTests / summary.totalTests) * 100).toFixed(2))
    : 0;

let history = [];

if (fs.existsSync(historyPath)) {
  history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
}

history.push(summary);

fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

console.log('Histórico atualizado com sucesso.');
console.log(`Duração registrada: ${durationMs} ms`);