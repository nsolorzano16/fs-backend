const jwt = require('jsonwebtoken');

const generateJWT = (uid, email, firstName, lastName, role) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, email, firstName, lastName, role };
    jwt.sign(
      payload,
      process.env.SECRET_JWT,
      {
        expiresIn: '2h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('Token can not be created');
        }

        resolve(token);
      }
    );
  });
};

module.exports = {
  generateJWT,
};
