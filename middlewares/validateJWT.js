const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
  //x-token headers
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'Unauthorized',
    });
  }

  try {
    const { uid, email, firstName, lastName, role } = jwt.verify(
      token,
      process.env.SECRET_JWT
    );

    req.uid = uid;
    req.email = email;
    req.firstName = firstName;
    req.lastName = lastName;
    req.role = role;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Invalid token',
    });
  }

  next();
};

module.exports = {
  validateJWT,
};
