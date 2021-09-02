const { Router } = require('express');
const { body } = require('express-validator');

const {
   postCreate,
   getPosts,
   getPost,
} = require('../../controllers/postController');
const requireAuth = require('../../middleware/requireAuth');

const postsRouter = Router();

postsRouter.post(
   '/create',
   requireAuth,
   body('title')
      .trim()
      .toLowerCase()
      .isLength({ min: 4, max: 32 })
      .withMessage('Title length must be between 4 and 32 characters'),
   body('image').trim().isURL().withMessage('Provide correct URL to image'),
   postCreate
);

postsRouter.get('/qwe', (req, res) => {
   res.json({ text: 'qwee' });
});

postsRouter.get('/:_id', getPost);

module.exports = postsRouter;
