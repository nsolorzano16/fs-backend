const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const {
  addCategory,
  editCategory,
  getCategories,
  deleteCategory,
} = require('../controllers/categoriesController');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

/**api/category */

router.use(validateJWT);

//add category
router.post(
  '/',
  [
    check('description', 'Description is required').exists(),
    check('description', 'Description must be at least 3 characters').isLength({
      min: 3,
    }),
    validateFields,
  ],
  addCategory
);

//edit category
router.put(
  '/:id',
  [
    check('description', 'Description is required').exists(),
    check('description', 'Description must be at least 3 characters').isLength({
      min: 3,
    }),
    validateFields,
  ],
  editCategory
);

//get categories
router.get('/', getCategories);

//delete categories
router.delete('/:id', deleteCategory);

module.exports = router;
