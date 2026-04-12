const fs = require('fs');
const path = require('path');

const historyPath = path.join(__dirname, '..', 'reports', 'history.json');
const dashboardPath = path.join(__dirname, '..', 'reports', 'dashboard.html');
const scenariosPath = path.join(__dirname, '..', 'reports', 'scenarios.html');
const latestRunPath = path.join(__dirname, '..', 'reports', 'latest-run.json');

if (!fs.existsSync(historyPath)) {
  console.error('Arquivo history.json não encontrado.');
  process.exit(1);
}

const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));

// Para gráficos: mais antiga -> mais recente (ordem cronológica)
const orderedHistory = [...history];

// Para tabela: mais recente -> mais antiga (últimas execuções primeiro)
const tableHistory = [...history].reverse();

const formatDatePtBr = (isoDate) =>
  new Date(isoDate).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'short',
    timeStyle: 'medium'
  });

const formatDuration = (ms) => {
  if (!ms || ms < 1000) return `${ms || 0} ms`;

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;

  return `${minutes}min ${seconds}s`;
};

const executions = orderedHistory.length;

const avgSuccessRate =
  executions > 0
    ? (
        orderedHistory.reduce((acc, run) => acc + (run.successRate || 0), 0) /
        executions
      ).toFixed(2)
    : '0.00';

const avgDurationMs =
  executions > 0
    ? Math.round(
        orderedHistory.reduce((acc, run) => acc + (run.durationMs || 0), 0) /
          executions
      )
    : 0;

const labels = orderedHistory.map((_, index) => `Execução ${index + 1}`);
const durations = orderedHistory.map((run) => run.durationMs || 0);
const successRates = orderedHistory.map((run) => run.successRate || 0);
const executionDates = orderedHistory.map((run) =>
  formatDatePtBr(run.executedAt)
);

const latestExecution = tableHistory[0] || null;
const firstExecution = history[0] || null;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const getScenarioGroupTitle = (title, ancestorTitles) => {
  const normalizedTitle = normalizeText(title);
  const normalizedAncestors = ancestorTitles.map(normalizeText).join(' ');

  if (normalizedTitle.includes('duplicado')) {
    return 'Validação de Destino Duplicado';
  }

  if (normalizedTitle.includes('caracter')) {
    return 'Validação de Campo Destino (Caracteres)';
  }

  if (normalizedTitle.includes('orcamento')) {
    return 'Validação de Orçamento';
  }

  if (normalizedTitle.includes('dias')) {
    return 'Validação de Duração da Viagem (Dias)';
  }

  if (normalizedTitle.includes('status')) {
    return 'Validação de Status (Realizada)';
  }

  if (normalizedTitle.includes('atividades')) {
    return 'Validação da Lista de Atividades';
  }

  if (
    normalizedTitle.includes('campos vazios') ||
    normalizedTitle.includes('campos obrigatorios') ||
    normalizedTitle.includes('nao preenchidos')
  ) {
    return 'Validação de Campos Obrigatórios';
  }

  if (normalizedAncestors.includes('post /viagens')) {
    return 'Cenários Gerais da API';
  }

  return ancestorTitles[ancestorTitles.length - 1] || 'Outros Cenários';
};

const extractScenarioGroups = () => {
  if (!fs.existsSync(latestRunPath)) {
    return [];
  }

  const latestRun = JSON.parse(fs.readFileSync(latestRunPath, 'utf8'));
  const groupedScenarios = new Map();
  const assertionResults = latestRun.testResults.flatMap(
    (suite) => suite.assertionResults || []
  );

  assertionResults
    .filter((assertion) => /^CT\d+\s-/.test(assertion.title || ''))
    .forEach((assertion) => {
      const groupTitle = getScenarioGroupTitle(
        assertion.title,
        assertion.ancestorTitles || []
      );

      if (!groupedScenarios.has(groupTitle)) {
        groupedScenarios.set(groupTitle, []);
      }

      groupedScenarios.get(groupTitle).push(assertion.title);
    });

  return Array.from(groupedScenarios.entries()).map(([title, scenarios]) => ({
    title,
    scenarios: scenarios.sort((left, right) => {
      const leftNumber = Number((left.match(/^CT(\d+)/) || [])[1] || 0);
      const rightNumber = Number((right.match(/^CT(\d+)/) || [])[1] || 0);
      return leftNumber - rightNumber;
    })
  }));
};

const scenarioGroups = extractScenarioGroups();

const totalScenarios = scenarioGroups.reduce(
  (acc, group) => acc + group.scenarios.length,
  0
);

const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard Histórico de Testes</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root {
      --bg: #120f1f;
      --bg-accent-1: rgba(124, 58, 237, 0.20);
      --bg-accent-2: rgba(168, 85, 247, 0.12);
      --panel: #1c1730;
      --panel-2: #241d3e;
      --border: #34285a;
      --text: #f5f7ff;
      --muted: #b8b4d6;
      --primary: #7c3aed;
      --primary-soft: #a855f7;
      --success: #22c55e;
      --danger: #ef4444;
      --shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      --badge-bg: rgba(255, 255, 255, 0.04);
      --header-bg: linear-gradient(135deg, rgba(124, 58, 237, 0.22), rgba(28, 23, 48, 0.96));
      --thead-bg: rgba(124, 58, 237, 0.32);
      --hover-bg: rgba(168, 85, 247, 0.12);
      --table-divider: rgba(255, 255, 255, 0.12);
      --table-row-bg: rgba(255, 255, 255, 0.02);
      --table-header-text: #f3e8ff;
      --chart-grid: rgba(255, 255, 255, 0.06);
      --chart-ticks: #b8b4d6;
      --chart-legend: #f5f7ff;
      --tooltip-bg: #1c1730;
      --tooltip-title: #ffffff;
      --tooltip-body: #ffffff;
      --toggle-bg: rgba(255, 255, 255, 0.08);
      --toggle-hover: rgba(255, 255, 255, 0.14);
      --heading-accent: #ddd6fe;
      --font-size-title: 34px;
      --font-size-section-title: 28px;
      --font-size-panel-title: 22px;
      --font-size-body: 18px;
      --font-size-body-sm: 17px;
      --font-size-label: 15px;
      --font-size-caption: 14px;
      --font-size-metric: 18px;
      --font-size-card-value: 30px;
      --font-size-table: 18px;
      --font-size-table-head: 15px;
      --font-size-toggle: 15px;
      --font-size-toggle-icon: 18px;
    }

    body[data-theme="light"] {
      --bg: #f3efff;
      --bg-accent-1: rgba(124, 58, 237, 0.14);
      --bg-accent-2: rgba(168, 85, 247, 0.10);
      --panel: #ffffff;
      --panel-2: #ede7ff;
      --border: #beaef7;
      --text: #1e1446;
      --muted: #53428e;
      --primary: #6d28d9;
      --primary-soft: #8b5cf6;
      --success: #15803d;
      --danger: #dc2626;
      --shadow: 0 12px 32px rgba(64, 36, 133, 0.14);
      --badge-bg: rgba(109, 40, 217, 0.07);
      --header-bg: linear-gradient(135deg, rgba(139, 92, 246, 0.22), rgba(255, 255, 255, 0.98));
      --thead-bg: rgba(109, 40, 217, 0.18);
      --hover-bg: rgba(109, 40, 217, 0.12);
      --table-divider: rgba(30, 20, 70, 0.16);
      --table-row-bg: rgba(109, 40, 217, 0.03);
      --table-header-text: #3b1b7a;
      --chart-grid: rgba(30, 20, 70, 0.10);
      --chart-ticks: #53428e;
      --chart-legend: #1e1446;
      --tooltip-bg: #ffffff;
      --tooltip-title: #1e1446;
      --tooltip-body: #35266e;
      --toggle-bg: rgba(109, 40, 217, 0.08);
      --toggle-hover: rgba(109, 40, 217, 0.14);
      --heading-accent: #4c1d95;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 32px;
      font-family: Arial, sans-serif;
      background:
        radial-gradient(circle at top right, var(--bg-accent-1), transparent 30%),
        radial-gradient(circle at top left, var(--bg-accent-2), transparent 25%),
        var(--bg);
      color: var(--text);
      transition: background 0.25s ease, color 0.25s ease;
    }

    h1, h2, h3 {
      margin-top: 0;
      color: var(--text);
    }

    h1 {
      font-size: var(--font-size-title);
    }

    h2 {
      font-size: var(--font-size-section-title);
    }

    h3 {
      font-size: var(--font-size-panel-title);
    }

    .header {
      margin-bottom: 24px;
      padding: 24px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: var(--header-bg);
      box-shadow: var(--shadow);
    }

    .header-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .header p {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: var(--font-size-body-sm);
    }

    .theme-toggle {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--toggle-bg);
      color: var(--text);
      cursor: pointer;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .theme-toggle:hover {
      background: var(--toggle-hover);
      transform: translateY(-1px);
    }

    .theme-icon {
      font-size: var(--font-size-toggle-icon);
      line-height: 1;
    }

    .theme-label {
      font-size: var(--font-size-toggle);
      font-weight: bold;
      color: var(--muted);
    }

    .execution-meta {
      margin-top: 18px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .meta-badge {
      background: var(--badge-bg);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 12px;
      padding: 12px 14px;
      min-width: 220px;
    }

    .meta-label {
      display: block;
      font-size: var(--font-size-caption);
      color: var(--muted);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .meta-value {
      font-size: var(--font-size-metric);
      font-weight: bold;
    }

    .meta-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      color: var(--heading-accent);
      font-weight: bold;
      text-decoration: none;
    }

    .meta-link:hover {
      text-decoration: underline;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .card {
      background: linear-gradient(180deg, var(--panel), var(--panel-2));
      padding: 18px 20px;
      border-radius: 16px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
    }

    .card-title {
      font-size: var(--font-size-label);
      color: var(--muted);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .card-value {
      font-size: var(--font-size-card-value);
      font-weight: bold;
      color: var(--text);
    }

    .card-sub {
      margin-top: 8px;
      font-size: var(--font-size-label);
      color: var(--muted);
    }

    .charts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    .panel {
      background: linear-gradient(180deg, var(--panel), var(--panel-2));
      padding: 20px;
      border-radius: 16px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
    }

    .panel h3 {
      margin-bottom: 18px;
    }

    table {
      width: 100%;
      font-size: var(--font-size-table);
      border-collapse: collapse;
      overflow: hidden;
      border-radius: 16px;
      background: linear-gradient(180deg, var(--panel), var(--panel-2));
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
    }

    thead {
      background: var(--thead-bg);
    }

    th,
    td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--table-divider);
      text-align: left;
      color: var(--text);
    }

    tbody tr {
      background: var(--table-row-bg);
    }

    th {
      font-size: var(--font-size-table-head);
      color: var(--table-header-text);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: bold;
    }

    tbody tr:hover {
      background: var(--hover-bg);
    }

    .success {
      color: var(--success);
      font-weight: bold;
    }

    .danger {
      color: var(--danger);
      font-weight: bold;
    }

    @media (max-width: 980px) {
      .charts {
        grid-template-columns: 1fr;
      }

      body {
        padding: 16px;
      }

      .header-top {
        flex-direction: column;
        align-items: stretch;
      }

      .execution-meta {
        gap: 12px;
      }

      .meta-badge {
        min-width: 180px;
        padding: 10px 12px;
      }

      .cards {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
      }

      .card {
        padding: 16px 18px;
      }

      .card-value {
        font-size: 26px;
      }
    }

    @media (max-width: 768px) {
      body {
        padding: 12px;
      }

      .header {
        padding: 16px;
        margin-bottom: 16px;
      }

      .header-top {
        gap: 12px;
      }

      h1 {
        font-size: 28px;
      }

      .header p {
        font-size: 16px;
      }

      .execution-meta {
        flex-direction: column;
        gap: 8px;
      }

      .meta-badge {
        min-width: unset;
        width: 100%;
        padding: 12px 16px;
      }

      .cards {
        grid-template-columns: 1fr;
        gap: 12px;
        margin-bottom: 16px;
      }

      .card {
        padding: 16px;
        text-align: center;
      }

      .card-value {
        font-size: 34px;
      }

      .charts {
        gap: 16px;
      }

      .panel {
        padding: 16px;
      }

      .panel h3 {
        font-size: 20px;
        margin-bottom: 12px;
      }

      table {
        font-size: 16px;
      }

      th,
      td {
        padding: 10px 8px;
      }

      .theme-toggle {
        padding: 8px 12px;
        font-size: 16px;
      }

      .theme-icon {
        font-size: 16px;
      }

      .theme-label {
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      body {
        padding: 8px;
      }

      .header {
        padding: 12px;
        border-radius: 12px;
      }

      h1 {
        font-size: 24px;
      }

      .header p {
        font-size: 15px;
      }

      .execution-meta {
        gap: 6px;
      }

      .meta-badge {
        padding: 10px 12px;
      }

      .meta-label {
        font-size: 13px;
      }

      .meta-value {
        font-size: 16px;
      }

      .cards {
        gap: 8px;
      }

      .card {
        padding: 12px;
        border-radius: 12px;
      }

      .card-title {
        font-size: 14px;
      }

      .card-value {
        font-size: 30px;
      }

      .card-sub {
        font-size: 14px;
      }

      .charts {
        gap: 12px;
      }

      .panel {
        padding: 12px;
        border-radius: 12px;
      }

      .panel h3 {
        font-size: 18px;
        margin-bottom: 8px;
      }

      table {
        font-size: 14px;
        overflow-x: auto;
        display: block;
        white-space: nowrap;
      }

      th,
      td {
        padding: 8px 6px;
        min-width: 80px;
      }

      .theme-toggle {
        padding: 6px 10px;
      }

      .theme-icon {
        font-size: 14px;
      }

      .theme-label {
        font-size: 13px;
      }
    }
  </style>
</head>
<body>
  <section class="header">
    <div class="header-top">
      <div>
        <h1>Dashboard Histórico de Testes</h1>
        <p>Acompanhamento consolidado das execuções de testes automatizados da API de Viagens.</p>
      </div>
      <button id="themeToggle" class="theme-toggle" type="button" aria-label="Alternar tema">
        <span id="themeIcon" class="theme-icon">🌙</span>
        <span id="themeLabel" class="theme-label">Modo escuro</span>
      </button>
    </div>

    <div class="execution-meta">
      <div class="meta-badge">
        <span class="meta-label">Iniciado em</span>
        <span class="meta-value">${
          firstExecution ? formatDatePtBr(firstExecution.executedAt) : '-'
        }</span>
      </div>
      <div class="meta-badge">
        <span class="meta-label">Data da Última Execução</span>
        <span class="meta-value">${
          latestExecution ? formatDatePtBr(latestExecution.executedAt) : '-'
        }</span>
      </div>
      <div class="meta-badge">
        <span class="meta-label">Tempo da Última Execução</span>
        <span class="meta-value">${
          latestExecution ? formatDuration(latestExecution.durationMs) : '-'
        }</span>
      </div>
      <div class="meta-badge">
        <span class="meta-label">Quantidade de Testes Atual</span>
        <span class="meta-value">${
          latestExecution ? `${latestExecution.totalTests} testes` : '-'
        }</span>
      </div>
      <div class="meta-badge">
        <span class="meta-label">Acesse os Cenários Atuais</span>
        <span class="meta-value">${totalScenarios} cenários</span>
        <a class="meta-link" href="./scenarios.html">Abrir página de cenários →</a>
      </div>
    </div>
  </section>

  <section class="cards">
    <div class="card">
      <div class="card-title">Total de Execuções</div>
      <div class="card-value">${executions}</div>
      <div class="card-sub">Quantidade acumulada de runs</div>
    </div>

    <div class="card">
      <div class="card-title">Média de Sucesso</div>
      <div class="card-value">${avgSuccessRate}%</div>
      <div class="card-sub">Percentual médio de testes aprovados</div>
    </div>

    <div class="card">
      <div class="card-title">Tempo Médio</div>
      <div class="card-value">${formatDuration(avgDurationMs)}</div>
      <div class="card-sub">Duração média por execução</div>
    </div>

    <div class="card">
      <div class="card-title">Última Taxa de Sucesso</div>
      <div class="card-value">${
        latestExecution ? latestExecution.successRate : 0
      }%</div>
      <div class="card-sub">Resultado da execução mais recente</div>
    </div>
  </section>

  <section class="charts">
    <div class="panel">
      <h3>Tempo por execução</h3>
      <canvas id="durationChart"></canvas>
    </div>

    <div class="panel">
      <h3>Taxa de sucesso por execução</h3>
      <canvas id="successChart"></canvas>
    </div>
  </section>

  <section>
    <h2>Histórico de Execuções</h2>
    <table>
      <thead>
        <tr>
          <th>Execução</th>
          <th>Data de Execução</th>
          <th>Total</th>
          <th>Sucesso</th>
          <th>Falha</th>
          <th>Taxa de Sucesso</th>
          <th>Tempo</th>
        </tr>
      </thead>
      <tbody>
        ${tableHistory
          .map(
            (run, index) => `
        <tr>
          <td>${executions - index}</td>
          <td>${formatDatePtBr(run.executedAt)}</td>
          <td>${run.totalTests}</td>
          <td class="success">${run.passedTests}</td>
          <td class="danger">${run.failedTests}</td>
          <td>${run.successRate}%</td>
          <td>${formatDuration(run.durationMs)}</td>
        </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </section>

  <script>
    const labels = ${JSON.stringify(labels)};
    const durations = ${JSON.stringify(durations)};
    const successRates = ${JSON.stringify(successRates)};
    const executionDates = ${JSON.stringify(executionDates)};

    const root = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const savedTheme = localStorage.getItem('dashboard-theme') || 'dark';

    function getCssVar(name) {
      return getComputedStyle(document.body).getPropertyValue(name).trim();
    }

    function updateThemeButton(theme) {
      if (theme === 'light') {
        themeIcon.textContent = '☀️';
        themeLabel.textContent = 'Modo claro';
      } else {
        themeIcon.textContent = '🌙';
        themeLabel.textContent = 'Modo escuro';
      }
    }

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('dashboard-theme', theme);
      updateThemeButton(theme);
    }

    function createCommonOptions() {
      return {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: getCssVar('--chart-legend')
            }
          },
          tooltip: {
            backgroundColor: getCssVar('--tooltip-bg'),
            titleColor: getCssVar('--tooltip-title'),
            bodyColor: getCssVar('--tooltip-body'),
            borderColor: getCssVar('--primary'),
            borderWidth: 1,
            callbacks: {
              afterLabel: function(context) {
                return 'Data: ' + executionDates[context.dataIndex];
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: getCssVar('--chart-ticks') },
            grid: { color: getCssVar('--chart-grid') }
          },
          y: {
            ticks: { color: getCssVar('--chart-ticks') },
            grid: { color: getCssVar('--chart-grid') }
          }
        }
      };
    }

    function createSuccessOptions() {
      const options = createCommonOptions();

      options.scales = {
        ...options.scales,
        y: {
          ...options.scales.y,
          min: 0,
          max: 110,
          ticks: {
            ...options.scales.y.ticks,
            stepSize: 10,
            callback: function(value) {
              return value === 110 ? '' : value;
            }
          }
        }
      };

      return options;
    }

    applyTheme(savedTheme);

    const durationChart = new Chart(document.getElementById('durationChart'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Duração (ms)',
          data: durations,
          backgroundColor: 'rgba(124, 58, 237, 0.75)',
          borderColor: 'rgba(168, 85, 247, 1)',
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: createCommonOptions()
    });

    const successChart = new Chart(document.getElementById('successChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Sucesso (%)',
          data: successRates,
          borderColor: 'rgba(168, 85, 247, 1)',
          backgroundColor: 'rgba(168, 85, 247, 0.18)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: 'rgba(168, 85, 247, 1)',
          pointRadius: 4
        }]
      },
      options: createSuccessOptions()
    });

    function refreshChartsTheme() {
      durationChart.options = createCommonOptions();
      successChart.options = createSuccessOptions();
      durationChart.update();
      successChart.update();
    }

    themeToggle.addEventListener('click', () => {
      const nextTheme =
        root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      refreshChartsTheme();
    });
  </script>
</body>
</html>
`;

const scenariosHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cenários Atuais de Teste</title>
  <style>
    :root {
      --bg: #120f1f;
      --bg-accent-1: rgba(124, 58, 237, 0.20);
      --bg-accent-2: rgba(168, 85, 247, 0.12);
      --panel: #1c1730;
      --panel-2: #241d3e;
      --border: #34285a;
      --text: #f5f7ff;
      --muted: #b8b4d6;
      --primary: #7c3aed;
      --shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      --badge-bg: rgba(255, 255, 255, 0.04);
      --header-bg: linear-gradient(135deg, rgba(124, 58, 237, 0.22), rgba(28, 23, 48, 0.96));
      --toggle-bg: rgba(255, 255, 255, 0.08);
      --toggle-hover: rgba(255, 255, 255, 0.14);
      --heading-accent: #ddd6fe;
    }

    body[data-theme="light"] {
      --bg: #f3efff;
      --bg-accent-1: rgba(124, 58, 237, 0.14);
      --bg-accent-2: rgba(168, 85, 247, 0.10);
      --panel: #ffffff;
      --panel-2: #ede7ff;
      --border: #beaef7;
      --text: #1e1446;
      --muted: #53428e;
      --primary: #6d28d9;
      --shadow: 0 12px 32px rgba(64, 36, 133, 0.14);
      --badge-bg: rgba(109, 40, 217, 0.07);
      --header-bg: linear-gradient(135deg, rgba(139, 92, 246, 0.22), rgba(255, 255, 255, 0.98));
      --toggle-bg: rgba(109, 40, 217, 0.08);
      --toggle-hover: rgba(109, 40, 217, 0.14);
      --heading-accent: #4c1d95;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 32px;
      font-family: Arial, sans-serif;
      background:
        radial-gradient(circle at top right, var(--bg-accent-1), transparent 30%),
        radial-gradient(circle at top left, var(--bg-accent-2), transparent 25%),
        var(--bg);
      color: var(--text);
      transition: background 0.25s ease, color 0.25s ease;
    }

    .header,
    .group {
      background: linear-gradient(180deg, var(--panel), var(--panel-2));
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: var(--shadow);
    }

    .header {
      padding: 24px;
      margin-bottom: 24px;
    }

    .header-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    h1, h2 {
      margin-top: 0;
    }

    h1 {
      font-size: 34px;
      margin-bottom: 8px;
    }

    h2 {
      font-size: 24px;
      margin-bottom: 16px;
    }

    p {
      margin: 0;
      color: var(--muted);
      font-size: 17px;
    }

    .theme-toggle {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--toggle-bg);
      color: var(--text);
      cursor: pointer;
      transition: background 0.2s ease, transform 0.2s ease;
    }

    .theme-toggle:hover {
      background: var(--toggle-hover);
      transform: translateY(-1px);
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 18px;
    }

    .action-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: var(--badge-bg);
      color: var(--heading-accent);
      text-decoration: none;
      font-weight: bold;
    }

    .action-link:hover {
      text-decoration: underline;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }

    .summary-card {
      padding: 18px 20px;
      background: linear-gradient(180deg, var(--panel), var(--panel-2));
      border-radius: 16px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
    }

    .summary-label {
      display: block;
      margin-bottom: 8px;
      color: var(--muted);
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .summary-value {
      font-size: 28px;
      font-weight: bold;
    }

    .groups {
      display: grid;
      gap: 20px;
    }

    .group {
      padding: 20px;
    }

    .scenario-list {
      margin: 0;
      padding-left: 22px;
    }

    .scenario-list li {
      margin-bottom: 12px;
      line-height: 1.5;
      font-size: 17px;
    }

    .scenario-code {
      color: var(--heading-accent);
      font-weight: bold;
    }

    @media (max-width: 768px) {
      body {
        padding: 16px;
      }

      .header {
        padding: 16px;
      }

      .header-top {
        flex-direction: column;
        align-items: stretch;
      }

      h1 {
        font-size: 28px;
      }
    }
  </style>
</head>
<body>
  <section class="header">
    <div class="header-top">
      <div>
        <h1>Cenários Atuais de Teste</h1>
        <p>Lista de casos de teste funcionais cobertos atualmente no fluxo automatizado.</p>
      </div>
      <button id="themeToggle" class="theme-toggle" type="button" aria-label="Alternar tema">
        <span id="themeIcon">🌙</span>
        <span id="themeLabel">Modo escuro</span>
      </button>
    </div>

    <div class="actions">
      <a class="action-link" href="./dashboard.html">← Voltar para o dashboard</a>
    </div>
  </section>

  <section class="summary">
    <div class="summary-card">
      <span class="summary-label">Total de cenários</span>
      <span class="summary-value">${totalScenarios}</span>
    </div>
    <div class="summary-card">
      <span class="summary-label">Grupos de validação</span>
      <span class="summary-value">${scenarioGroups.length}</span>
    </div>
  </section>

  <section class="groups">
    ${
      scenarioGroups.length > 0
        ? scenarioGroups
            .map(
              (group) => `
      <article class="group">
        <h2>${escapeHtml(group.title)}</h2>
        <ol class="scenario-list">
          ${group.scenarios
            .map((scenario) => {
              const [code, ...rest] = scenario.split(' - ');
              return `<li><span class="scenario-code">${escapeHtml(code)}</span> - ${escapeHtml(rest.join(' - '))}</li>`;
            })
            .join('')}
        </ol>
      </article>
    `
            )
            .join('')
        : `
      <article class="group">
        <h2>Nenhum cenário CT encontrado</h2>
        <p>Execute o fluxo de testes que gera o arquivo <code>reports/latest-run.json</code> para atualizar esta página automaticamente.</p>
      </article>
    `
    }
  </section>

  <script>
    const root = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const savedTheme = localStorage.getItem('dashboard-theme') || 'dark';

    function updateThemeButton(theme) {
      if (theme === 'light') {
        themeIcon.textContent = '☀️';
        themeLabel.textContent = 'Modo claro';
      } else {
        themeIcon.textContent = '🌙';
        themeLabel.textContent = 'Modo escuro';
      }
    }

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      localStorage.setItem('dashboard-theme', theme);
      updateThemeButton(theme);
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
      const nextTheme =
        root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(dashboardPath, html);
fs.writeFileSync(scenariosPath, scenariosHtml);
console.log('Dashboard gerado com sucesso.');
