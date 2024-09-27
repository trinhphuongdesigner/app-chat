const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
// const { BasicStrategy } = require('passport-http');

const jwtSettings = require('../constants/jwtSetting');
const { User } = require('../models');

const passportVerifyToken = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: jwtSettings.JWT_SECRET,
  },
  async (payload, done) => {
    console.log('🔥🔥🔥««««« payload »»»»»🚀🚀🚀', payload);
    try {
      const user = await User.findOne({
        _id: payload._id,
        isActive: true,
      }).select('-password');
      console.log('🔥🔥🔥««««« user »»»»»🚀🚀🚀', user);

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      console.log('««««« error »»»»»', error);
      done(error, false);
    }
  },
);

const passportVerifyAccount = new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({
        isActive: true,
        email,
      });

      if (!user) return done(null, false);

      const isCorrectPass = await user.isValidPass(password);

      user.password = undefined;

      if (!isCorrectPass) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  });

module.exports = {
  passportVerifyToken,
  passportVerifyAccount,
};
