const express = require('express');
const cors = require('cors');
const aws = require('aws-sdk');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { createUserHandler, getAllUsersHandler } = require('../controllers/users');

const router = express.Router();

router.post('/', createUserHandler);
router.get('/', getAllUsersHandler);

module.exports = router;