const { getAllRestaurants, createRestaurant, getRestaurant } = require('../service/restaurants.service');
const { omit } = require('lodash');

const getAllRestaurantsHandler = async (req, res) => {
  const respBody = {
    success: false,
    message: '',
    data: {},
  };
  try {
    const restaurants = await getAllRestaurants();

    if (!restaurants || !restaurants.length) {
      respBody.message = '[BadRequest] No restaurants found';
      return res.status(200).json(respBody);
    }

    respBody.success = true;
    respBody.data = restaurants;

  } catch (error) {
    return res.send({ error: error.message });
  }
  return res.status(200).json(respBody);
};

const createRestaurantHandler = async (req, res) => {
  const respBody = {
    success: false,
    message: '',
    data: {},
  };
  try {
    const { body } = req;
    const restaurant = await createRestaurant(body);
    if (!restaurant) {
      respBody.message = '[BadRequest] Restaurant already exists';
      respBody.data = {};
      return res.status(200).json(respBody);
    }
    if (restaurant.errors) {
      respBody.message = '[BadRequest] Invalid Input';
      const { message } = restaurant;
      respBody.data = { error: message };
      return res.status(200).json(respBody);
    }
    respBody.success = true;
    respBody.data = omit(restaurant.toJSON(), 'password');

  } catch (error) {
    return res.send({ error: error.message });
  }
  return res.status(200).json(respBody);
};

const getRestaurantHandler = async (req, res) => {
  const respBody = {
    success: false,
    message: '',
    data: {},
  };
  try {
    const { _id } = req.params;
    const restaurant = await getRestaurant(_id);
    if (!restaurant || restaurant.reason) {
      respBody.message = '[BadRequest] Restaurant not found';
      respBody.data = {};
      return res.status(200).json(respBody);
    }
    respBody.success = true;
    respBody.data = restaurant;
  } catch (error) {
    respBody.data = error;
  }

  return res.status(200).json(respBody);
};

module.exports = {
  getAllRestaurantsHandler,
  createRestaurantHandler,
  getRestaurantHandler
};