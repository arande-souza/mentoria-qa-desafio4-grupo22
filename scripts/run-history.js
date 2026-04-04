const { spawnSync } = require('child_process');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const isWindows = process.platform === 'win32';

function runScript(scriptName) {
  if (isWindows) {
    return spawnSync('cmd.exe', ['/c', 'npm', 'run', scriptName], {
      cwd: rootDir,
      stdio: 'inherit'
    });
  }

  return spawnSync('npm', ['run', scriptName], {
    cwd: rootDir,
    stdio: 'inherit'
  });
}

const testResult = runScript('test:json');

runScript('history:save');
runScript('history:dashboard');

process.exit(testResult.status ?? 1);
