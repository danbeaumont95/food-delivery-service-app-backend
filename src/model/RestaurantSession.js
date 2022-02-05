const mongoose = require('mongoose');

const RestaurantSessionSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true },
);

const RestaurantSession = mongoose.model('RestaurantSession', RestaurantSessionSchema);

module.exports = { RestaurantSession };
