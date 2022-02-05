const { createUser, getAllUsers, createUserSession, validatePassword, getRestaurantsInDistance } = require('../service/user.service');
const { omit } = require('lodash');
const { get } = require('lodash');
const { signJwt, decode } = require('../utils/jwt.utils');
const { getAllRestaurants } = require('../service/restaurants.service');
const { getLatLongFromPostCode, getDifferenceBetween2Addresses } = require('../helpers/address');

const createUserHandler = async (req, res) => {
  const respBody = {
    success: false,
    message: '',
    data: {},
  };
  try {
    const user = await createUser(req.body);
    if (!user) {
      respBody.message = '[BadRequest] User already exists';
      respBody.data = {};
      return res.status(200).json(respBody);
    }
    if (user.errors) {
      respBody.message = '[BadRequest] Invalid Input';
      const { message } = user;
      respBody.data = { error: message };
      return res.status(200).json(respBody);
    }


    respBody.success = true;
    respBody.data = omit(user.toJSON(), 'password');
  } catch (error) {
    return res.send({ error: error.message });
  }
  return res.status(200).json(respBody);
};

const getAllUsersHandler = async (req, res) => {
  const respBody = {
    success: false,
    message: '',
    data: {},
  };
  try {
    const users = await getAllUsers();
    if (!users) {
      respBody.message = '[BadRequest] No users found';
      return res.status(200).json(respBody);
    }
    respBody.success = true;
    respBody.data = users;
  } catch (error) {
    return res.send({ error: error.message });
  }
  return res.status(200).json(respBody);
};

const getRestaurantsInMyTownHandler = async (req, res) => {
  const respBody = {
    success: false,
    message: '',
    data: {},
  };
  try {
    const user = get(req, 'user');
    const { addressTownCity } = user;
    const restaurants = await getAllRestaurants();

    const restaurantsInTownCity = restaurants.filter((el) => el.addressTownCity.toLowerCase() === addressTownCity.toLowerCase());

    if (!restaurantsInTownCity || !restaurantsInTownCity.length) {
      respBody.message = '[BadRequest] No restaurants found in your town/city';
      return res.status(200).json(respBody);
    }

    respBody.success = true;
    respBody.data = restaurantsInTownCity;
  } catch (error) {
    return res.send({ error: error.message });
  }
  return res.status(200).json(respBody);
};

const createUserSessionHandler = async (req, res) => {
  const respBody = {
    success: false,
    message: '',
    data: {},
  };

  const { body: { type } } = req;

  // Validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    respBody.message = 'Invalid email or password';
    return res.status(200).json(respBody);
  }


  // create a session

  const session = await createUserSession(user._id, req.get('user-agent') || '', type);

  // create an access token

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: process.env.accessTokenTtl }, // 15 minutes
  );


  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: process.env.refreshTokenTtl }, // 1 year
  );

  // return access & refresh tokens
  const { _id } = user;

  respBody.success = true;
  respBody.data = { accessToken, refreshToken, _id };
  return res.status(200).json(respBody);
};

const getRestaurantsInDistanceHandler = async (req, res) => {
  const respBody = {
    success: false,
    message: '',
    data: {},
  };
  try {
    const { body: { miles } } = req;

    const user = get(req, 'user');
    const { addressPostcode } = user;
    const usersLatLong = await getLatLongFromPostCode(addressPostcode);

    const restaurants = await getAllRestaurants();

    const restaurantsInDistance = await getRestaurantsInDistance(usersLatLong, restaurants, miles);

    if (!restaurantsInDistance || !restaurantsInDistance.length) {
      respBody.message = '[BadRequest] No restaurants found in given distance';
      return res.status(200).json(respBody);
    }
    respBody.success = true;
    respBody.data = restaurantsInDistance;
  } catch (error) {
    return res.send({ error: error.message });
  }
  return res.status(200).json(respBody);
};

module.exports = {
  createUserHandler,
  getAllUsersHandler,
  createUserSessionHandler,
  getRestaurantsInMyTownHandler,
  getRestaurantsInDistanceHandler
};