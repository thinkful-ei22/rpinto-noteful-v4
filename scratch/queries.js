'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

mongoose.connect(MONGODB_URI)
  .then(() => {

    /**
     * Find/Search for notes using Note.find
     */
    const searchTerm = 'gaga';
    let filter = {};

    if (searchTerm) {
      // Using the `$regex` operator (case-sensitive by default)
      filter.title = { $regex: searchTerm };

      // Using the `$regex` operator with case-insensitive `i` option
      // filter.title = { $regex: searchTerm, $options: 'i' };

      // Alternative using regex `/pattern/i` but not recommended
      // filter.title = /ways/i;
    }

    return Note.find(filter).sort({ updatedAt: 'desc' })
      .then(results => {
       
      });



  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
