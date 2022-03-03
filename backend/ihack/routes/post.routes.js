const router = require("express").Router();
const Post = require("../models/Post.model");
const User = require('../models/User.model')
const Comment = require('../models/Comment.model')
const { isAuthenticated } = require('../middleware/jwt.middleware');



router.get("/all-posts", isAuthenticated, (req, res) => {
  console.log("REQ:::", req)
  // req.user.posts is array of logged in user's posts
  Post.find()
  .then(foundPosts => {
    res.json(foundPosts)
  })
  .catch(err => console.log('ERROR FINDING POSTS:::', err))
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
      res.json(updatedUser)
    })
  })
  .catch(err => res.json(err.message))
})

router.post("/delete-post/:id", isAuthenticated, (req, res) => {
  Post.findByIdAndRemove(req.params.id)
  .then(results => {
    res.json(results.data)
  })
  .catch(err => res.json(err.message))
})

router.post("/create-comment", isAuthenticated, (req, res) => {
  console.log("REQ FROM CREATE COMMENT:::", req)
  Comment.create({
    commentBody: req.body.commentBody,
    commenter: req.user._id,
  })
  .then(newComment => {

  })
})

module.exports = router