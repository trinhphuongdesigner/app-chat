const JWT = require('jsonwebtoken');

const jwtSettings = require('../constants/jwtSetting');

const generateToken = (user) => {
  const expiresIn = '24h';
  // const algorithm = 'HS25s6';

  return JWT.sign(
    {
      iat: Math.floor(Date.now() / 1000),
      ...user,
      // _id: user._id,
      // email: user.email,
      // name: user.firstName,
      // algorithm,
    },
    jwtSettings.SECRET,
    // "$2a$10$UGya/ViKIX9aJ5aN0NARhe2yl5bYtjZ4N5l.lVM9VW4dL8NgtcTeq",
    {
      expiresIn,
    },
  );
};

const generateRefreshToken = (id) => {
  const expiresIn = '30d';

  return JWT.sign({ id }, jwtSettings.SECRET, { expiresIn });
};

module.exports = {
  generateToken,
  generateRefreshToken,
};
