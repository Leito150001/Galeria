const express = require("express");
const router = express.Router();
const pool = require('../database')
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const usersRouter = require('./users');

// Usar las rutas importadas
router.use('/users', usersRouter);


module.exports = router;


