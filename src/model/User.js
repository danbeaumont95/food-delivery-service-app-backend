const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: false },
    addressTownCity: { type: String, required: true },
    addressPostcode: { type: String, required: true },
    addressCountry: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    onMailingList: { type: Boolean, required: true, default: false },
    mobileNumber: { type: String, required: true },
    favourites: { type: Object, required: false, default: {} }
  },
  {
    timestamps: true
  }
);
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(process.env.saltWorkFactor);
  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User
};