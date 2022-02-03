const { checkIfUserExists } = require('../helpers/users');
const { Restaurant } = require('../model/Restaurant');

const getAllRestaurants = async () => {
  try {
    const restaurants = await Restaurant.find({}).select('-password, -__v');
    return restaurants;
  } catch (error) {
    return error;
  }
};

const createRestaurant = async (input) => {
  const { email } = input;
  const restaurantExists = await checkIfUserExists(email, Restaurant);
  if (restaurantExists) {
    return;
  }
  const restaurant = await Restaurant.create(input);
  return restaurant;
};

const getRestaurant = async (_id) => {
  try {
    const restaurant = await Restaurant.findById({ _id });
    return restaurant;
  } catch (error) {
    return error;
  }

};

module.exports = {
  getAllRestaurants,
  createRestaurant,
  getRestaurant
};