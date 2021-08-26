const { response } = require('express');
const Post = require('../models/postModel');

const addPost = async (req, res = response) => {
  try {
    const { uid, role } = req;

    if (role === 'viewer') {
      return res.status(401).json({
        ok: false,
        msg: "You don't have permissions to create",
      });
    }

    let post = new Post(req.body);
    post.user = uid;
    await post.save();

    return res.status(201).json({
      ok: true,
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error! contact your administrator',
    });
  }
};

const editPost = async (req, res = response) => {
  try {
    const { uid, role } = req;

    if (role === 'viewer') {
      return res
        .status(401)
        .json({ ok: false, msg: "You don't have permissions to edit" });
    }

    const postId = req.params.id;
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        ok: false,
        msg: 'Post does not exists',
      });
    }

    const { title, description, category } = req.body;
    post.title = title;
    post.description = description;
    post.category = category;
    post.user = uid;

    const postEdit = await Post.findByIdAndUpdate(postId, post, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      ok: true,
      post: postEdit,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error! contact your administrator' });
  }
};

const getPosts = async (req, res = response) => {
  try {
    const posts = await Post.find()
      .populate('user', ['firstName', 'lastName', 'email', 'role'])
      .populate('category', 'description');

    return res.status(200).json({
      ok: true,
      posts,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error! contact your administrator' });
  }
};

const deletePost = async (req, res = response) => {
  try {
    const { role } = req;
    if (role === 'viewer') {
      return res
        .status(401)
        .json({ ok: false, msg: "You don't have permissions to delete" });
    }

    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ ok: true, msg: 'Post has been deleted' });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: 'Error! contact your administrator' });
  }
};

module.exports = {
  addPost,
  editPost,
  getPosts,
  deletePost,
};
