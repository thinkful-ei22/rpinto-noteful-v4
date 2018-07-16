'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const { Strategy: LocalStrategy } = require('passport-local');

const Note = require('../models/note');
const Folder = require('../models/folder');
const User = require('../models/user');

const router = express.Router();


//Create protected login route
const options = {session: false, failWithError: true};

const localAuth = passport.authenticate('local', options);

router.post('/login', localAuth, function (req, res) {
  return res.json(req.user);
});

module.exports = router;