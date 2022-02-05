const express = require('express');
const { createUserHandler, getAllUsersHandler, createUserSessionHandler, getRestaurantsInMyTownHandler, getRestaurantsInDistanceHandler } = require('../controllers/users');
const { requiresUser } = require('../middleware/requiresUser');
const { validateRequest } = require('../middleware/validateRequest');
const { createUserSessionSchema } = require('../schema/user.schema');

const router = express.Router();

router.post('/', createUserHandler);
router.get('/', getAllUsersHandler);
router.post('/session', validateRequest(createUserSessionSchema), createUserSessionHandler);
router.get('/restaurantsInMyTown', [requiresUser], getRestaurantsInMyTownHandler);
router.post('/restaurantsInDistance', [requiresUser], getRestaurantsInDistanceHandler);

module.exports = router;