var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config/database');
//Reg
router.post('/register', (req, res, next) => {
    console.log(req.body);
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err,user) => {
        

        if(err){
            res.json({success: false, msg:'Failed to register user'});
        }else {
            res.json({success: true, msg:'User registred'});
        }

    });
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    User.getUserByUsername(username,(err,user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success:false, msg:'User not found'});
        }
        User.comparePassword(password,user.password, (err,isMatch)=>{
            if(err) throw err;
            if(isMatch){
                var token = jwt.sign({data:user}, config.secret , {
                    expiresIn: 604800
                });
                res.json({
                    success:true,
                    token:'Bearer '+token,
                    user:{
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        username: user.username
                    }
                });
            }else {
                return res.json({success:false , msg:'Wrong password'});
            }
        });
    });
}); 

// profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
  });

  router.get('/publicProfile/:username', (req, res) => {

    if (!req.params.username) {
      res.json({ success: false, message: 'No username was provided' }); 
    } else {

      User.findOne({ username: req.params.username }).select('username email').exec((err, user) => {
 
        if (err) {
          res.json({ success: false, message: 'Something went wrong.' }); 
        } else {
        
          if (!user) {
            res.json({ success: false, message: 'Username not found.' }); 
          } else {
            res.json({ success: true, user: user }); 
          }
        }
      });
    }
  });

module.exports = router;