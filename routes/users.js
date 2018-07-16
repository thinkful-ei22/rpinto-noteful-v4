'use strict';

const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');


const router = express.Router();

//----validate and cleanup the values supplied for username and password----
// //all fields must exist
// const requiredFields = ['fullname', 'username', 'password'];
// const missingField = requiredFields.find(field => !(field in req.body));

// if (missingField) {
//   return res.status(422).json({
//     code: 422,
//     reason: 'ValidationError',
//     message: 'Missing field',
//     location: missingField
//   });
// };

// //all fields must be a string
// const stringFields = ['fullname', 'username', 'password'];
// const nonStringField = stringFields.find(
//   field => field in req.body && typeof req.body[field] !== 'string'
// );

// if (nonStringField) {
//   return res.status(422).json({
//     code: 422,
//     reason: 'ValidationError',
//     message: 'Incorrect field type: expected string',
//     location: nonStringField
//   });
// }
//Create User ------ POST ENDPOINT ------

router.post('/users', (req, res) => {
  const { fullname, username, password } = req.body;
  User
    .create({
      fullname,
      username,
      password
    })
    .then(user => {
      return res.status(201).location(`/api/users/${user.id}`).json(user.serialize());
    });
})

module.exports = router;