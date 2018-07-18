'use strict';

const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');

const router = express.Router();


//----validate and cleanup the values supplied for username and password----

//Create User ------ POST ENDPOINT ------

router.post('/users', (req, res, next) => {
  console.log(req.body, 'req.body')

  let { fullname, username, password } = req.body;
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

//The username and password should not have leading or trailing whitespace. 
  //And the endpoint should not automatically trim the values
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  fullname = fullname.trim();

  //The username is a minimum of 1 character, The password is a minimum of 8 and max of 72 characters
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  console.log(tooSmallField, "too small field")
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  //each username needs to be unique
  User.findOne({ 'username': username }).count().then(cnt => {
    if (cnt > 0) {
      const err = new Error('username already exists');
      err.status = 422;
      return next(err);
    } else { //else if no validation errors, create user
      return User.hashPassword(password)
        .then(digest => {
          const newUser = {
            username,
            password: digest,
            fullname
          };
          return User.create(newUser);
        })
        .then(user => {
          return res.status(201).location(`/api/users/${user.id}`).json(user.serialize());
        })
        .catch(err => {
          if (err.code === 11000) {
            err = new Error('The username already exists');
            err.status = 400;
          }
          next(err);
        });
    };
  });
});

module.exports = router;