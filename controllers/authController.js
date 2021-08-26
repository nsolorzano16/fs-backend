const { response } = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'User already exists',
      });
    }
    user = new User(req.body);

    //encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // generate token
    const token = await generateJWT(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
      user.role
    );

    return res.status(201).json({
      ok: true,
      uid: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error contact your administrator' });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'User does not exists',
      });
    }

    //confirm password
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Invalid password',
      });
    }

    // generate token
    const token = await generateJWT(
      user.id,
      user.email,
      user.firstName,
      user.lastName,
      user.role
    );

    return res.status(200).json({
      ok: true,
      uid: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error contact your administrator' });
  }
};

const renewToken = async (req, res = response) => {
  const { uid, firstName, lastName, email, role } = req;

  //generate new jwt

  const token = await generateJWT(uid, email, firstName, lastName, role);

  return res.status(200).json({
    ok: true,
    token,
  });
};

const getUsers = async (req, res = response) => {
  try {
    const { role } = req;

    if (role !== 'admin') {
      return res.status(401).json({
        ok: false,
        msg: "unauthorized, you don't have permissions",
      });
    }

    const users = await User.find();
    return res.status(200).json({
      ok: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error! contact your administrator' });
  }
};

const editUser = async (req, res = response) => {
  try {
    const { role } = req;
    if (role !== 'admin') {
      return res.status(401).json({
        ok: false,
        msg: "authorized you don't have permissions",
      });
    }

    const userId = req.params.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'User does not exists',
      });
    }

    const { firstName, lastName, email, role: roleEdit } = req.body;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.role = roleEdit;

    const userEdit = await User.findByIdAndUpdate(userId, user, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      ok: true,
      user: userEdit,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error! contact your administrator' });
  }
};

const deleteUser = async (req, res = response) => {
  try {
    const { role } = req;

    if (role !== 'admin') {
      return res.status(401).json({
        ok: false,
        msg: "authorized you don't have permissions",
      });
    }

    const userId = req.params.id;
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      ok: true,
      msg: 'User has been deleted',
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error! contact your administrator' });
  }
};

module.exports = {
  createUser,
  login,
  renewToken,
  getUsers,
  editUser,
  deleteUser,
};
