'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRY } = require('../config'); 
const { Strategy: LocalStrategy } = require('passport-local');

const router = express.Router();

//return a JWT which returns user information
function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

//Create protected login route
const options = {session: false, failWithError: true};

const localAuth = passport.authenticate('local', options);

router.post('/login', localAuth, function (req, res) {
  const authToken = createAuthToken(req.user)
  return res.json({authToken});
});

//Add /refresh endpoint
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});
module.exports = router;