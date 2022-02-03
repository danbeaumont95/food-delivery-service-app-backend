const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const restaurantSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: false },
    addressTownCity: { type: String, required: true },
    addressPostcode: { type: String, required: true },
    addressCountry: { type: String, required: true },
    contactNumber: { type: String, required: true },
    rating: { type: Number, default: null },
    menu: { type: Object, required: true, default: {} },
    daysOpen: { type: Array, default: [] },
    openOrders: { type: Array, default: [] }
  }
);

restaurantSchema.pre('save', async function (next) {
  const restaurant = this;
  if (!restaurant.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(+process.env.saltWorkFactor);
  const hash = await bcrypt.hashSync(restaurant.password, salt);

  restaurant.password = hash;
  return next();
});

restaurantSchema.methods.comparePassword = async function (candidatePassword) {
  const restaurant = this;
  return bcrypt.compare(candidatePassword, restaurant.password).catch((e) => false);
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = {
  Restaurant
};