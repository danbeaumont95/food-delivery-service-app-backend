const { createUser } = require('../service/user.service');
const { omit } = require('lodash');

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
module.exports = {
  createUserHandler
};