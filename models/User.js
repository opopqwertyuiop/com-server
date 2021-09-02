const { Schema, model } = require('mongoose');

const userSchema = new Schema(
   {
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      postsCount: {
         type: Number,
         default: 0,
      },
      followersCount: {
         type: Number,
         default: 0,
      },
      followingCount: {
         type: Number,
         default: 0,
      },
   },
   { timestamps: true }
);

userSchema.virtual('posts', {
   ref: 'Post',
   localField: '_id',
   foreignField: 'author',
   justOne: false,
});

userSchema.methods.getPublicFields = function () {
   const privateFields = ['password'];
   return Object.keys(this._doc)
      .filter((key) => !privateFields.includes(key))
      .reduce((prev, key) => {
         prev[key] = this[key];
         return prev;
      }, {});
};

module.exports = model('User', userSchema);
