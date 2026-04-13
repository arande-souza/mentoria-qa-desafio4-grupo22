const viagemService = require('../services/viagemService');
const { validateTripPayload } = require('../validations/tripValidation');

function getApiInfo(req, res) {
  return res.json({
    message: 'API de viagens dos sonhos',
    version: '1.0.0',
    routes: {
      'GET /': 'Informacoes da API',
      'GET /viagens': 'Listar todas as viagens',
      'POST /viagens': 'Criar uma nova viagem',
    },
  });
}

function createTrip(req, res) {
  const validation = validateTripPayload(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      errors: validation.errors,
    });
  }

  const tripCreation = viagemService.createTrip(validation.sanitizedData);

  if (!tripCreation.success) {
    return res.status(409).json({
      error: 'Ja existe uma viagem cadastrada para esse destino.',
    });
  }

  return res.status(201).json(tripCreation.trip);
}

function listTrips(req, res) {
  const { sortBy = 'id', order = 'asc' } = req.query;
  const result = viagemService.listTrips({ sortBy, order });

  if (!result.success) {
    return res.status(400).json({
      error: result.error,
    });
  }

  return res.json(result.data);
}

module.exports = {
  getApiInfo,
  createTrip,
  listTrips,
};
