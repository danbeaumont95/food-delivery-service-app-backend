const { createUser, getAllUsers } = require('../service/user.service');
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
module.exports = {
  createUserHandler,
  getAllUsersHandler
};