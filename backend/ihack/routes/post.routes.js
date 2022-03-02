const router = require("express").Router();
const Post = require("../models/Post.model");
const User = require('../models/User.model')
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

module.exports = router