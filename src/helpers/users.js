const { User } = require("../model/User");


const checkIfUserExists = async (user) => {
  const userFound = await User.findOne({ email: user });
  return userFound;
};

module.exports = {
  checkIfUserExists
};