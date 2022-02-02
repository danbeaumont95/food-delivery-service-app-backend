const { User } = require('../model/User');
const { checkIfUserExists } = require('../helpers/users');

const createUser = async (input) => {
  try {
    const { email } = input;
    const userExists = await checkIfUserExists(email);
    if (userExists) {
      return;
    }
    const user = await User.create(input);
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = {
  createUser
};