const { validationResult } = require('express-validator');

const Post = require('../models/Post');
const User = require('../models/User');

// 3

module.exports.getPost = async (req, res) => {
   const { _id } = req.params;
   // console.log('qwe');
   const post = Post.findById(_id)
      .populate('author', '_id email')
      .exec()
      .then((data) => {
         res.json(data);
      })
      .catch((error) => {
         res.status(404).json({ msg: 'Post not found' });
      });

   if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
   }
};

module.exports.getPosts = async (req, res) => {
   const { skip } = req.query;
   const { _id } = req.params;

   const user = await User.findById(_id);

   if (!user) res.status(404).json({ msg: 'User not found' });

   user
      .populate({
         path: 'posts',
         options: { sort: { createdAt: -1 }, skip: parseInt(skip), limit: 15 },
      })
      .execPopulate()
      .then((result) => {
         res.json(result.posts);
      });
};

module.exports.postCreate = async (req, res) => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
   }

   try {
      const { title, image } = req.body;
      const post = await Post.create({ title, image, author: req.user._id });
      req.user.postsCount++;
      await req.user.save();
      res.json(post);
   } catch (e) {
      res.status(500).json({ msg: 'Server error' });
   }
};
