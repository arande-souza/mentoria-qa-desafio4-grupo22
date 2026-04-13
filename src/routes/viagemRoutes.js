const express = require('express');
const viagemController = require('../controllers/viagemController');

const router = express.Router();

router.get('/', viagemController.getApiInfo);
router.post('/viagens', viagemController.createTrip);
router.get('/viagens', viagemController.listTrips);

module.exports = router;
