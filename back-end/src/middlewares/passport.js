const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
// const { BasicStrategy } = require('passport-http');

const jwtSettings = require('../constants/jwtSetting.js');
const { Employee } = require('../models');

const passportVerifyToken = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'), // Vị trí kiểm tra token
    secretOrKey: jwtSettings.SECRET, // Chuỗi khóa bí mật để mã hóa
  },
  async (payload, done) => {
    try {
      const user = await Employee.findOne({
        _id: payload._id,
        isDeleted: false,
      }).select('-password');

      if (!user) return done(null, false);

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);

const passportVerifyAccount = new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await Employee.findOne({
        isDeleted: false,
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

// const passportConfigBasic = new BasicStrategy((async (username, password, done) => {
//   try {
//     const user = await Employee.findOne({ email: username, isDeleted: false });

//     if (!user) return done(null, false);

//     const isCorrectPass = await user.isValidPass(password);

//     if (!isCorrectPass) return done(null, false);

//     user.password = undefined;

//     return done(null, user);
//   } catch (error) {
//     done(error, false);
//   }
// }));

module.exports = {
  passportVerifyToken,
  passportVerifyAccount,
  // passportConfigBasic,
};
