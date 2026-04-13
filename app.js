const app = require('./src/app');
const { viagens, nextId } = require('./src/services/viagemService');

const PORT = 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API de viagens rodando em http://localhost:${PORT}`);
  });
}

module.exports = {
  app,
  viagens,
  nextId,
};
