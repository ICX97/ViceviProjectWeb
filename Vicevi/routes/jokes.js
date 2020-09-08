const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Joke = require('../models/jokes');


router.post('/newJoke', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (!req.body.title) {
    res.json({ success: false, message: 'Joke title is required.' }); 
  } else {
    if (!req.body.body) {
      res.json({ success: false, message: 'Joke body is required.' }); 
    } else {
      if (!req.body.createdBy) {
        res.json({ success: false, message: 'Joke user is required.' }); 
      } else {
        const joke = new Joke({
          title: req.body.title,
          body: req.body.body, 
          createdBy: req.body.createdBy
        });
        
        joke.save((err) => {
          if (err) {
            if (err.errors) {
              if (err.errors.title) {
                res.json({ success: false, message: err.errors.title.message });
              } else {
                if (err.errors.body) {
                  res.json({ success: false, message: err.errors.body.message }); 
                } else {
                  res.json({ success: false, message: err });
                }
              }
            } else {
              res.json({ success: false, message: err }); 
            }
          } else {
            res.json({ success: true, message: 'Joke saved!' }); 
          }
        });
      }
    }
  }
});
router.get('/allJokes',passport.authenticate('jwt', { session: false }), (req, res, next) => {
  Joke.find({}, (err, jokes) => {
    if (err) {
      res.json({ success: false, message: err }); 
    } else {
      if (!jokes) {
        res.json({ success: false, message: 'No jokes found.' }); 
      } else {
        res.json({ success: true, jokes: jokes }); 
      }
    }
  }).sort({ '_id': -1 });
});
router.get('/singleJoke/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (!req.params.id) {
    res.json({ success: false, message: 'No Joke ID was provided.' }); 
  } else {
    Joke.findOne({ _id: req.params.id }, (err, joke) => {
      if (err) {
        res.json({ success: false, message: 'Not a valid Joke id' }); 
      } else {
        if (!joke) {
          res.json({ success: false, message: 'Joke not found.' }); 
        } else {
          User.findOne({ _id: req.user._id }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); 
            } else {
              if (!user) {
                res.json({ success: false, message: 'Unable to authenticate user' }); 
              } else {
                if (user.username !== joke.createdBy) {
                  res.json({ success: false, message: 'You are not authorized to eidt this joke.' });
                } else {
                  res.json({ success: true, joke: joke });
                }
              }
            }
          });
        }
      }
    });
  }
});

router.put('/updateJoke', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (!req.body._id) {
    res.json({ success: false, message: 'No joke id provided' }); 
  } else {
    Joke.findOne({ _id: req.body._id }, (err, joke) => {
      if (err) {
        res.json({ success: false, message: 'Not a valid joke id' }); 
      } else {
        if (!joke) {
          res.json({ success: false, message: 'joke id was not found.' });
        } else {
          User.findOne({ _id: req.user._id }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); 
            } else {
              if (!user) {
                res.json({ success: false, message: 'Unable to authenticate user.' }); 
              } else {
                if (user.username !== joke.createdBy) {
                  res.json({ success: false, message: 'You are not authorized to edit this joke post.' });
                } else {
                  joke.title = req.body.title; 
                  joke.body = req.body.body;
                  joke.save((err) => {
                    if (err) {
                      if (err.errors) {
                        res.json({ success: false, message: 'Please ensure form is filled out properly' });
                      } else {
                        res.json({ success: false, message: err }); 
                      }
                    } else {
                      res.json({ success: true, message: 'Blog Updated!' });
                    }
                  });
                }
              }
            }
          });
        }
      }
    });
  }
});

router.delete('/deleteJoke/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (!req.params.id) {
    res.json({ success: false, message: 'No id provided' });
  } else {
    Joke.findOne({ _id: req.params.id }, (err, joke) => {
      if (err) {
        res.json({ success: false, message: 'Invalid id' }); 
      } else {
        if (!joke) {
          res.json({ success: false, messasge: 'joke was not found' }); 
        } else {
          User.findOne({ _id: req.user._id }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); 
            } else {
              if (!user) {
                res.json({ success: false, message: 'Unable to authenticate user.' }); 
              } else {
                if (user.username !== joke.createdBy) {
                  res.json({ success: false, message: 'You are not authorized to delete this joke post' }); 
                } else {
                  joke.remove((err) => {
                    if (err) {
                      res.json({ success: false, message: err });
                    } else {
                      res.json({ success: true, message: 'joke deleted!' }); 
                    }
                  });
                }
              }
            }
          });
        }
      }
    });
  }
});
router.put('/likeJoke', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (!req.body.id) {
    res.json({ success: false, message: 'No id was provided.' }); 
  } else {
    Joke.findOne({ _id: req.body.id }, (err, joke) => {
      if (err) {
        res.json({ success: false, message: 'Invalid joke id' }); 
      } else {
        if (!joke) {
          res.json({ success: false, message: 'That joke was not found.' }); 
        } else {
          User.findOne({ _id: req.user._id }, (err, user) => {
            if (err) {
              res.json({ success: false, message: 'Something went wrong.' }); 
            } else {
              if (!user) {
                res.json({ success: false, message: 'Could not authenticate user.' }); 
              } else {
                if (user.username === joke.createdBy) {
                  res.json({ success: false, messagse: 'Cannot like your own post.' }); 
                } else {
                  if (joke.likedBy.includes(user.username)) {
                    res.json({ success: false, message: 'You already liked this post.' });
                  } else {
                    if (joke.dislikedBy.includes(user.username)) {
                      joke.dislikes--;
                      const arrayIndex = joke.dislikedBy.indexOf(user.username); 
                      joke.dislikedBy.splice(arrayIndex, 1); 
                      joke.likes++; 
                      joke.likedBy.push(user.username);
                      joke.save((err) => {
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); 
                        } else {
                          res.json({ success: true, message: 'joke liked!' }); 
                        }
                      });
                    } else {
                      joke.likes++; 
                      joke.likedBy.push(user.username); 
                      joke.save((err) => {
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); 
                        } else {
                          res.json({ success: true, message: 'joke liked!' }); 
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }
});

router.put('/dislikeJoke', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  // Check if id was provided inside the request body
  if (!req.body.id) {
    res.json({ success: false, message: 'No id was provided.' }); // Return error message
  } else {
    // Search database for joke post using the id
    Joke.findOne({ _id: req.body.id }, (err, joke) => {
      // Check if error was found
      if (err) {
        res.json({ success: false, message: 'Invalid joke id' }); // Return error message
      } else {
        // Check if joke post with the id was found in the database
        if (!joke) {
          res.json({ success: false, message: 'That joke was not found.' }); // Return error message
        } else {
          // Get data of user who is logged in
          User.findOne({ _id: req.user._id }, (err, user) => {
            // Check if error was found
            if (err) {
              res.json({ success: false, message: 'Something went wrong.' }); // Return error message
            } else {
              // Check if user was found in the database
              if (!user) {
                res.json({ success: false, message: 'Could not authenticate user.' }); // Return error message
              } else {
                // Check if user who disliekd post is the same person who originated the joke post
                if (user.username === joke.createdBy) {
                  res.json({ success: false, messagse: 'Cannot dislike your own post.' }); // Return error message
                } else {
                  // Check if user who disliked post has already disliked it before
                  if (joke.dislikedBy.includes(user.username)) {
                    res.json({ success: false, message: 'You already disliked this post.' }); // Return error message
                  } else {
                    // Check if user has previous disliked this post
                    if (joke.likedBy.includes(user.username)) {
                      joke.likes--; // Decrease likes by one
                      const arrayIndex = joke.likedBy.indexOf(user.username); // Check where username is inside of the array
                      joke.likedBy.splice(arrayIndex, 1); // Remove username from index
                      joke.dislikes++; // Increase dislikeds by one
                      joke.dislikedBy.push(user.username); // Add username to list of dislikers
                      // Save joke data
                      joke.save((err) => {
                        // Check if error was found
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                          res.json({ success: true, message: 'joke disliked!' }); // Return success message
                        }
                      });
                    } else {
                      joke.dislikes++; // Increase likes by one
                      joke.dislikedBy.push(user.username); // Add username to list of likers
                      // Save joke data
                      joke.save((err) => {
                        // Check if error was found
                        if (err) {
                          res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                        } else {
                          res.json({ success: true, message: 'joke disliked!' }); // Return success message
                        }
                      });
                    }
                  }
                }
              }
            }
          });
        }
      }
    });
  }
});


router.post('/comment', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  if (!req.body.comment) {
    res.json({ success: false, message: 'No comment provided' }); 
  } else {
    if (!req.body.id) {
      res.json({ success: false, message: 'No id was provided' }); 
    } else {
      Joke.findOne({ _id: req.body.id }, (err, joke) => {
        if (err) {
          res.json({ success: false, message: 'Invalid joke id' });
        } else {
          if (!joke) {
            res.json({ success: false, message: 'joke not found.' }); 
          } else {
            User.findOne({  _id: req.user._id }, (err, user) => {
              if (err) {
                res.json({ success: false, message: 'Something went wrong' }); 
              } else {
                if (!user) {
                  res.json({ success: false, message: 'User not found.' }); 
                } else {
                  joke.comments.push({
                    comment: req.body.comment, 
                    commentator: user.username 
                  });
                  joke.save((err) => {
                    if (err) {
                      res.json({ success: false, message: 'Something went wrong.' }); 
                    } else {
                      res.json({ success: true, message: 'Comment saved' }); 
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }
});
module.exports = router;

