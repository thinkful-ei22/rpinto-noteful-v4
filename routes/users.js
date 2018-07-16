'use strict';

const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');


const router = express.Router();

//----validate and cleanup the values supplied for username and password----

//Create User ------ POST ENDPOINT ------

router.post('/users', (req, res, next) => {
  const { fullname, username, password } = req.body;
  //all fields must exist
  const requiredFields = ['fullname', 'username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  };

  //all fields must be a string
  const stringFields = ['fullname', 'username', 'password'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  //each username needs to be unique
  User.findOne({ 'username': username }).count().then(cnt => {
    if (cnt > 0) {
      const err = new Error('username already exists');
      err.status = 422;
      return next(err);
    } else {
      User
        .create({
          fullname,
          username,
          password
        })
        .then(user => {
          return res.status(201).location(`/api/users/${user.id}`).json(user.serialize());
        })
        .catch(err => next(err));
    }
  });
});

module.exports = router;