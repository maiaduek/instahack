const router = require("express").Router();
const Post = require("../models/Post.model");
const User = require('../models/User.model')
const Comment = require('../models/Comment.model')
const { isAuthenticated } = require('../middleware/jwt.middleware');
const jwt = require("jsonwebtoken");

router.get("/profile", isAuthenticated, (req, res) => {
  // req.user.posts is array of logged in user's posts
  User.findById(req.user._id)
  .populate("posts")
  .then(foundUser => {
    res.json(foundUser)
  })
  .catch(err => res.json(err.message))
})

// router.get("/all-posts/:userId", isAuthenticated, (req, res) => {
//   // req.user.posts is array of logged in user's posts
//   console.log("Req params", req.params.userId)
//   Post.find({
//     poster: req.params.userId
//   })
//   // .populate("comments")
//   .then(foundPosts => {
//     console.log("FOUND POSTS", foundPosts)
//     res.json(foundPosts)
//   })
//   .catch(err => {
//     console.log("ERROR", err.message)
//     res.status(500).json(err.message)
//   })
// })

router.get("/all-posts", isAuthenticated, (req, res) => {
  // req.user.posts is array of logged in user's posts
  Post.find({
    poster: req.user._id
  })
  // .populate("comments")
  .then(foundPosts => {
    res.json(foundPosts)
  })
  .catch(err => {
    res.status(500).json(err.message)
  })
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

router.get("/:postId/comments", isAuthenticated, (req, res) => {
  Comment.find({ post: req.params.postId })
  .then(results => {
    res.json(results)
  })
  .catch(err => console.log("ERROR GETTING COMMENTS:", err))
})

router.post("/:postId/create-comment", isAuthenticated, (req, res) => {
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
      res.json(newComment)
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


module.exports = router;