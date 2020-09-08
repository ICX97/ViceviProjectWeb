var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var user = require('../models/user');
var config = require('../config/database');

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    passport.use(new jwtStrategy(opts,(jwt_payload,done)=>{
        console.log(jwt_payload);
        user.getUserById(jwt_payload.data._id,(err,user)=>{
            if(err){
                return done(err,false);
            }
            if(user){
                return done(null,user);

            }
            else{
                return done(null,false)
            }
        });
    }));

}
