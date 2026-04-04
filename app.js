const express = require('express');
const { validateTripPayload } = require('./validation');

const app = express();
const PORT = 3000;

app.use(express.json());

const viagens = [];
const nextId = { value: 1 };

app.get('/', (req, res) => {
  return res.json({
    message: 'API de viagens dos sonhos',
    version: '1.0.0',
    routes: {
      'GET /': 'Informacoes da API',
      'GET /viagens': 'Listar todas as viagens',
      'POST /viagens': 'Criar uma nova viagem',
    },
  });
});

function findTripByDestination(destino) {
  return viagens.find((viagem) => viagem.destino.toLowerCase() === destino.toLowerCase());
}

app.post('/viagens', (req, res) => {
  const validation = validateTripPayload(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      errors: validation.errors,
    });
  }

  const { sanitizedData } = validation;

  if (findTripByDestination(sanitizedData.destino)) {
    return res.status(409).json({
      error: 'Ja existe uma viagem cadastrada para esse destino.',
    });
  }

  const novaViagem = {
    id: nextId.value++,
    ...sanitizedData,
  };

  viagens.push(novaViagem);

  return res.status(201).json(novaViagem);
});

app.get('/viagens', (req, res) => {
  const { sortBy = 'id', order = 'asc' } = req.query;
  const allowedSortFields = ['id', 'destino', 'orcamento', 'dias', 'status'];

  if (!allowedSortFields.includes(sortBy)) {
    return res.status(400).json({
      error: `Campo sortBy invalido. Valores aceitos: ${allowedSortFields.join(', ')}`,
    });
  }

  const normalizedOrder = order.toLowerCase() === 'desc' ? 'desc' : 'asc';

  const sortedViagens = [...viagens].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return normalizedOrder === 'asc' ? valueA.localeCompare(valueB, 'pt-BR') : valueB.localeCompare(valueA, 'pt-BR');
    }

    if (valueA < valueB) return normalizedOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return normalizedOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return res.json(sortedViagens);
});

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

module.exports = { app, viagens, nextId };
