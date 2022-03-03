const router = require("express").Router();
const Post = require("../models/Post.model");
const User = require('../models/User.model')
const Comment = require('../models/Comment.model')
const { isAuthenticated } = require('../middleware/jwt.middleware');
const jwt = require("jsonwebtoken");



router.get("/all-posts/:userId", isAuthenticated, (req, res) => {
  // req.user.posts is array of logged in user's posts
  Post.find({
    poster: req.params.userId
  })
  .populate("comments")
  .then(foundPosts => {
    res.json(foundPosts)
  })
  .catch(err => res.json(err.message))
})

router.get("/:id", isAuthenticated, (req, res) => {
  Post.findById(req.params.id)
  .then(foundPost => {
    res.json(foundPost)
  })
  .catch(err => res.json(err.message))
})

router.post("/create-post", isAuthenticated, (req, res) => {

  Post.create({
    content: req.body.content,
    caption: req.body.caption,
    poster: req.user._id
  })
  .then(newPost => {
    User.findByIdAndUpdate(req.user._id, {
      $push: {posts: newPost._id}
    }, {
      new: true
    })
    .then(updatedUser => {
      // ADDED
      // console.log("UPDATED USER FROM CREATE::::", updatedUser)

      res.json(updatedUser)
    })
  })
  .catch(err => {
    res.json(err.message)
    console.log("ERROR CREATING",err)
  })
})

router.post("/delete-post/:id", isAuthenticated, (req, res) => {
  Post.findByIdAndRemove(req.params.id)
  .then(results => {

    res.json(results.data)
  })
  .catch(err => res.json(err.message))
})

router.post("/:postId/create-comment", isAuthenticated, (req, res) => {
  // console.log("REQ FROM CREATE COMMENT:::", req)
  Comment.create({
    commentBody: req.body.commentBody,
    commenter: req.user._id,
    post: req.params.postId
  })
  .then(newComment => {
    Post.findByIdAndUpdate(req.params.postId, {
      $push: {comments: newComment._id}
    }, {
      new: true
    })
    .then(updatedPost => {
      console.log("UPDATED POST", updatedPost)
      res.json(updatedPost)
    })
  })
})

router.post("/:postId/delete-comment/:commentId", isAuthenticated, (req, res) => {
  Comment.findByIdAndRemove(req.params.commentId)
  .then(results => {
    res.json(results)
  })
  .catch(err => res.json(err.message))
})


module.exports = router