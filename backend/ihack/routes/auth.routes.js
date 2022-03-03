const router = require("express").Router();
const jwt = require("jsonwebtoken");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const { isAuthenticated } = require('../middleware/jwt.middleware');

router.get("/", (req, res) => {
  res.json("AUTH");
})

router.get("/loggedin", isAuthenticated, (req, res) => {
  res.json(req.user);
});

router.post("/signup", (req, res) => {
  const { username, password, firstName, lastName, preferredLang } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your username." });
  }

  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).json( {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res.status(400).json({ errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          username,
          password: hashedPassword,
          firstName,
          lastName,
          preferredLang
        });
      })
      .then((user) => {
        // Bind the user to the session object
        // req.session.user = user;
        res.status(201).json(user);
        console.log("NEW USER CREATED:::", user)
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your username." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).json({ errorMessage: "Wrong credentials." });
      }
      // console.log("USER LOGIN:::",user)
      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: "Wrong credentials." });
        }
        
        // const payload = {_id: user._id, username: user.username}

        const authToken = jwt.sign({user}, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        })


        // Send token as the response
        return res.status(200).json(authToken);
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/logout", isAuthenticated, (req, res) => {
  res.json("You've successfully logged out.")
});

router.post("/edit-user", isAuthenticated, (req, res) => {
  const {username, password, firstName, lastName, preferredLang} = req.body;

  if (password?.length < 8) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  if (password) {
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        User.findByIdAndUpdate(req.user._id, {
          ...req.body,
          password: hashedPassword
        }, {
          new: true
        })
  
        .then(results => {
        // console.log("RESULTS FROM EDITING:::", results)
  
        const authToken = jwt.sign({user: results}, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        })
  
        res.json(authToken)
        })
        .catch(err => {
        res.json(err.message)
      })
    })
  } else {
    User.findByIdAndUpdate(req.user._id, {
      ...req.body
    }, {
      new: true
    })

    .then(results => {
    // console.log("RESULTS FROM EDITING:::", results)

    const authToken = jwt.sign({user: results}, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    })

    res.json(authToken)
    })
    .catch(err => {
    res.json(err.message)
  })
  }
})

router.post("/delete", isAuthenticated, (req, res) => {
  User.findByIdAndRemove(req.user._id)
  .then(results => {
    res.json(results)
  })
  .catch(err => res.json(err.message))
})

module.exports = router;