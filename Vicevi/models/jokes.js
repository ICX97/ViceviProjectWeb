var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var config = require('../config/database');


var jokeSchrema = mongoose.Schema({
    title: { type: String, required: true},
    body: { type: String, required: true},
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    likedBy: { type: Array },
    dislikes: { type: Number, default: 0 },
    dislikedBy: { type: Array },
    comments: [{
      comment: { type: String},
      commentator: { type: String }
    }]
  });

  let titleLengthChecker = (title) => {
    if (!title) {
      return false;
    } else {
      if (title.length < 5 || title.length > 50) {
        return false; 
      } else {
        return true;
      }
    }
  };
  let alphaNumericTitleChecker = (title) => {
    if (!title) {
      return false; 
    } else {
      const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
      return regExp.test(title); // Return regular expression test results (true or false)
    }
  };
  const titleValidators = [
    // First Title Validator
    {
      validator: titleLengthChecker,
      message: 'Title must be more than 5 characters but no more than 50'
    },
    // Second Title Validator
    {
      validator: alphaNumericTitleChecker,
      message: 'Title must be alphanumeric'
    }
  ];
  
  // Validate Function to check body length
  let bodyLengthChecker = (body) => {
    // Check if body exists
    if (!body) {
      return false; // Return error
    } else {
      // Check length of body
      if (body.length < 5 || body.length > 500) {
        return false; // Return error if does not meet length requirement
      } else {
        return true; // Return as valid body
      }
    }
  };
  
  // Array of Body validators
  const bodyValidators = [
    // First Body validator
    {
      validator: bodyLengthChecker,
      message: 'Body must be more than 5 characters but no more than 500.'
    }
  ];
  
  // Validate Function to check comment length
  let commentLengthChecker = (comment) => {
    // Check if comment exists
    if (!comment[0]) {
      return false; // Return error
    } else {
      // Check comment length
      if (comment[0].length < 1 || comment[0].length > 200) {
        return false; // Return error if comment length requirement is not met
      } else {
        return true; // Return comment as valid
      }
    }
  };
  
  // Array of Comment validators
  const commentValidators = [
    // First comment validator
    {
      validator: commentLengthChecker,
      message: 'Comments may not exceed 200 characters.'
    }
  ];
var Joke=module.exports=mongoose.model('joke',jokeSchrema);

module.exports.getJokeById=function(id,callback){
    Joke.findById(id,callback);
}
module.exports.findUserJokes=function(id,callback){
    Joke.find({"user":id}).populate().exec(callback);
}
module.exports.addJoke=function(joke,callback){
    joke.save(callback);
}