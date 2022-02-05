const { User } = require('../model/User');
const { checkIfUserExists } = require('../helpers/users');
const { omit } = require('lodash');
const { UserSession } = require('../model/UserSession');
const postcodes = require('node-postcodes.io');
const { getLatLongFromPostCode, getDifferenceBetween2Addresses } = require('../helpers/address');
const { Restaurant } = require('../model/Restaurant');

const createUser = async (input) => {
  try {
    const { email } = input;
    const userExists = await checkIfUserExists(email, User);
    if (userExists) {
      return;
    }
    const user = await User.create(input);
    return user;
  } catch (error) {
    return error;
  }
};

const getAllUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    return error;
  }
};

const validatePassword = async ({
  email,
  password,
  type
}) => {
  let user;
  console.log(type, 'type in validate');
  if (type === 'restaurant') {
    user = await Restaurant.findOne({ email });
  }
  else {

    user = await User.findOne({ email });
  }
  if (!user) {
    return false;
  }
  const isValid = await user.comparePassword(password);
  if (!isValid) {
    return false;
  }
  return omit(user.toJSON(), 'password');
};

const createUserSession = async (userId, userAgent, type) => {
  const session = await UserSession.create({ user: userId, userAgent, type });
  return session.toJSON();
};

const getRestaurantsInDistance = async (usersLatLong, restaurants, miles) => {

  const promises = restaurants.map(async (el) => {
    const restaurantLatLong = await getLatLongFromPostCode(el.addressPostcode);
    const milesBetweenUserAndRestaurant = getDifferenceBetween2Addresses(usersLatLong, restaurantLatLong);
    return milesBetweenUserAndRestaurant <= miles ? el : null;
  });
  // return Promise.all(promises);
  return (await Promise.all(promises)).filter((el) => el !== null);

};

module.exports = {
  createUser,
  getAllUsers,
  validatePassword,
  createUserSession,
  getRestaurantsInDistance
};