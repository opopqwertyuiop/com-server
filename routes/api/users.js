const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const { compare } = require('bcryptjs');

const {
   postCheck,
   postLogin,
   postRegister,
   getUserProfile,
} = require('../../controllers/userController');

const requireAuth = require('../../middleware/requireAuth');
const User = require('../../models/User');

const usersRouter = Router();


usersRouter.get('/:_id/profile', getUserProfile);

usersRouter.post('/check', requireAuth, postCheck);

//post /login
usersRouter.post(
   '/login',
   body('password')
      .isLength({ min: 4, max: 255 })
      .withMessage('Password length must be between 4 and 255 characters'),
   body('email')
      .trim()
      .isEmail()
      .withMessage('Provide correct email')
      .bail()
      .normalizeEmail(),
   async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         const errorsArray = errors.array();

         if (
            !(
               errorsArray.some((error) => error.param === 'password') &&
               errorsArray.every((error) => error.param !== 'email')
            )
         ) {
            // console.log('opa');
            return res.status(400).json(errorsArray);
         }
      }

      const { email } = req.body;
      // const user =;
      // console.log('qwe');
      req.user = await User.findOne({ email });
      next();
   },
   body('email').custom((value, { req }) => {
      if (!req.user) throw new Error('Email not found');
      return true;
   }),
   (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return res.status(400).json(errors.array());
      }
      next();
   },
   body('password').custom(async (value, { req }) => {
      if (!req.user) return true;
      const { password } = req.body;
      console.log(!(await compare(password, req.user.password)));
      if (!(await compare(password, req.user.password))) {
         throw new Error('Wrong password');
      }
      return true;
   }),
   postLogin
);

//post /register
usersRouter.post(
   '/register',
   body('password')
      .isLength({ min: 4, max: 255 })
      .withMessage('Password length must be between 4 and 255 characters')
      .bail()
      .custom((value, { req }) => {
         if (value !== req.body.passwordConfirmation) {
            console.log(value, req.body.passwordConfirmation);
            throw new Error('Password confirmation does not match password');
         }
         return true;
      }),
   body('email')
      .trim()
      .isEmail()
      .withMessage('Provide correct email')
      .bail()
      .normalizeEmail()
      .custom((value) =>
         User.findOne({ email: value }).then((user) => {
            if (user) return Promise.reject('Email already in use');
         })
      ),
   postRegister
);

module.exports = usersRouter;
// 9
