const express = require('express');
const swaggerUi = require('swagger-ui-express');
const viagemRoutes = require('./routes/viagemRoutes');
const swaggerSpec = require('../resources/swagger/swagger');

const app = express();

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

module.exports = app;
