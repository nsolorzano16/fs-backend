const { Router } = require('express');
const router = Router();
const {
  createUser,
  login,
  renewToken,
  getUsers,
  editUser,
  deleteUser,
} = require('../controllers/authController');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

//login
router.post(
  '/',
  [
    check('email', 'Email is required').exists(),
    check('password', 'Password is required').exists(),
    check('email', 'Email format is not valid').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
    validateFields,
  ],
  login
);

router.use(validateJWT);

//new user
router.post(
  '/new',
  [
    //middlewares
    check('firstName', 'firstName is required').exists(),
    check('lastName', 'lastName is required').exists(),
    check('email', 'Email is required').exists(),
    check('password', 'Password is required').exists(),
    check('role', 'Role is required').exists(),
    check('firstName', 'First name must be at least 3 characters').isLength({
      min: 3,
    }),
    check('lastName', 'Last name must be at least 3 characters').isLength({
      min: 3,
    }),
    check('email', 'Email format is not valid').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
    validateFields,
  ],
  createUser
);

//renew token
router.get('/renew', renewToken);

// get users
router.get('/', getUsers);

//edit users
router.put(
  '/:id',
  [
    check('firstName', 'firstName is required').exists(),
    check('lastName', 'lastName is required').exists(),
    check('email', 'Email is required').exists(),
    check('role', 'Role is required').exists(),
    check('firstName', 'First name must be at least 3 characters').isLength({
      min: 3,
    }),
    check('lastName', 'Last name must be at least 3 characters').isLength({
      min: 3,
    }),
    check('email', 'Email format is not valid').isEmail(),
    validateFields,
  ],
  editUser
);

router.delete('/:id', deleteUser);

module.exports = router;
