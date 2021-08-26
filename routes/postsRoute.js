const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

const {
  addPost,
  editPost,
  getPosts,
  deletePost,
} = require('../controllers/postsController');

//get posts
router.get('/', getPosts);

//api/post
router.use(validateJWT);

//add post
router.post(
  '/',
  [
    check('title', 'Title is required').exists(),
    check('description', 'Description is required').exists(),
    check('category', 'Category is required').exists(),
    check('title', 'Title must be at least 3 characters').isLength({ min: 3 }),
    check('description', 'Description must be at least 50 characters').isLength(
      { min: 50 }
    ),
    validateFields,
  ],
  addPost
);

//edit post
router.put(
  '/:id',
  [
    check('title', 'Title is required').exists(),
    check('description', 'Description is required').exists(),
    check('category', 'Category is required').exists(),
    check('title', 'Title must be at least 3 characters').isLength({ min: 3 }),
    check('description', 'Description must be at least 50 characters').isLength(
      { min: 50 }
    ),
    validateFields,
  ],
  editPost
);

//delete post
router.delete('/:id', deletePost);

module.exports = router;
