const { response } = require('express');
const Category = require('../models/categoryModel');

const addCategory = async (req, res = response) => {
  try {
    const { uid, role } = req;

    if (role === 'viewer') {
      return res.status(401).json({
        ok: false,
        msg: "You don't have permissions to create",
      });
    }

    let category = new Category(req.body);
    category.user = uid;
    await category.save();

    return res.status(201).json({
      ok: true,
      category,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error! contact your administrator' });
  }
};

const editCategory = async (req, res = response) => {
  try {
    const { uid, role } = req;

    if (role === 'viewer') {
      return res.status(401).json({
        ok: false,
        msg: "You don't have permissions to edit",
      });
    }

    const categoryId = req.params.id;
    let category = await Category.findById(categoryId);

    if (!category) {
      return res.status(400).json({
        ok: false,
        msg: 'Category does not exists',
      });
    }

    const { description } = req.body;
    category.description = description;
    category.user = uid;

    const categoryEdit = await Category.findByIdAndUpdate(
      categoryId,
      category,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      ok: true,
      category: categoryEdit,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error! contact your administrator' });
  }
};

const getCategories = async (req, res = response) => {
  try {
    const { role } = req;

    if (role === 'viewer') {
      return res.status(401).json({
        ok: false,
        msg: "You don't have permissions to view",
      });
    }

    const categories = await Category.find().populate('user', [
      'firstName',
      'lastName',
    ]);

    return res.status(200).json({
      ok: true,
      categories,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error! contact your administrator' });
  }
};
const deleteCategory = async (req, res = response) => {
  try {
    const { role } = req;

    if (role === 'viewer') {
      return res.status(401).json({
        ok: false,
        msg: "You don't have permissions to delete",
      });
    }

    const categoryId = req.params.id;
    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      ok: true,
      msg: 'Category has been deleted',
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error! contact your administrator' });
  }
};

module.exports = {
  addCategory,
  editCategory,
  getCategories,
  deleteCategory,
};
