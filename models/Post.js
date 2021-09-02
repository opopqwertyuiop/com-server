const { Schema, model } = require('mongoose');

const postSchema = new Schema(
   {
      title: {
         type: String,
         required: true,
      },
      image: {
         type: String,
         required: true,
      },
      likes: {
         type: Number,
         default: 0,
      },
      author: { type: Schema.Types.ObjectId, ref: 'User' },
   },
   { timestamps: true }
);

module.exports = model('Post', postSchema);
