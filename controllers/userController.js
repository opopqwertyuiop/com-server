const { validationResult } = require('express-validator');
const { sign } = require('jsonwebtoken');
const { hash } = require('bcryptjs');

const User = require('../models/User');

module.exports.getUserProfile = async (req, res) => {
   const { _id } = req.params;

   User.findById(_id)
      .populate({
         path: 'posts',
         options: { sort: { createdAt: -1 }, limit: 15 },
      })
      .then((data) => {
         data.posts = data.posts;
         res.json({ ...data.getPublicFields(), posts: data.posts });
      })
      .catch((e) => res.status(404).json({ msg: 'User not found' }));
};

module.exports.postCheck = async (req, res) => {
   res.json(req.user.getPublicFields());
};

module.exports.postLogin = async (req, res) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(403).json(errors.array());
   }

   const publicUser = req.user.getPublicFields();
   const jwt = await sign(publicUser, process.env.JWT_SECRET);
   res.json({ jwt, user: publicUser });
};

module.exports.postRegister = async (req, res) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
   }

   const { email, password } = req.body;

   try {
      const hashPassword = await hash(password, 10);
      const user = await User.create({ email, password: hashPassword });
      res.json(user.getPublicFields());
   } catch (e) {
      res.status(400).json(e);
   }
};
