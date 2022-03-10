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
  },
  commenterName: {
    type: String
  }
}, {
  timestamps: true
})

const Comment = model("Comment", commentSchema);

module.exports = Comment;