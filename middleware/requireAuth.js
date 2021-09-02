const { verify } = require('jsonwebtoken');

const User = require('../models/User');

module.exports = async (req, res, next) => {
   try {
      const token = req.headers['authorization'];
      if (!token) return res.status(401).json({ msg: 'No token' });

      const decoded = await verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id);
      if (!decoded || !user) {
         return res.status(401).json({ msg: 'Invalid token' });
      }
      
      req.user = user;
      next();
   } catch (e) {
      res.status(401).json({ msg: 'Auth Error' });
   }
};
//
