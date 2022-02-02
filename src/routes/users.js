const express = require('express');
const cors = require('cors');
const aws = require('aws-sdk');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { createUserHandler } = require('../controllers/users');

const router = express.Router();

router.post('/', createUserHandler);
// router.get('/', allUsers);

module.exports = router;