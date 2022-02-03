const { User } = require("../model/User");


const checkIfUserExists = async (email, model) => {
  // const userFound = await User.findOne({ email: user });
  const userFound = await model.findOne({ email });
  return userFound;
};

module.exports = {
  checkIfUserExists
};