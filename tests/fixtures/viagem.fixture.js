function makeViagem(overrides = {}) {
  return {
    destino: 'Paris, Franca',
    orcamento: 5000,
    atividades: ['Visitar a Torre Eiffel', 'Passear pelo Louvre'],
    dias: 7,
    status: true,
    ...overrides,
  };
}

function makeAtividades(qtd) {
  return Array.from({ length: qtd }, (_, i) => `Atividade ${i + 1}`);
}

module.exports = {
  makeViagem,
  makeAtividades,
};
