const express = require('express');
const swaggerUi = require('swagger-ui-express');
const viagemRoutes = require('./routes/viagemRoutes');
const swaggerSpec = require('../resources/swagger/swagger');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(viagemRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'JSON invalido no corpo da requisicao.',
    });
  }

  return next(err);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API de viagens rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
