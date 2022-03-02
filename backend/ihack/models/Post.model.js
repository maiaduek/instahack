const { Schema, model, Types } = require('mongoose');

const postSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  caption: String, 
  poster: {
    type: Types.ObjectId,
    ref: "User"
  }
},
{
  timestamps: true
});

const Post = model("Post", postSchema);

module.exports = Post;