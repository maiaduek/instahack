const { Schema, model, Types } = require("mongoose");

const commentSchema = new Schema({
  commentBody: {
    type: String,
    required: true
  },
  commenter: {
    type: Types.ObjectId,
    ref: "User"
  },
  post: {
    type: Types.ObjectId,
    ref: "Post"
  }
}, {
  timestamps: true
})

const Comment = model("Comment", commentSchema);

module.exports = Comment;