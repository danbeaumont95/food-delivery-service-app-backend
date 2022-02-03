const express = require('express');
const { getAllRestaurantsHandler, createRestaurantHandler, getRestaurantHandler } = require('../controllers/restaurants');
const { requiresUser } = require('../middleware/requiresUser');

const router = express.Router();

router.get('/', getAllRestaurantsHandler);
router.post('/', createRestaurantHandler);
router.get('/:_id', getRestaurantHandler);

module.exports = router;