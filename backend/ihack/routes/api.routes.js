const router = require("express").Router();
const axios = require('axios');
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Post = require('../models/Post.model')


router.get("/translate", isAuthenticated, (req, res) => {
  let targetLang = req.user.preferredLang;

  var options = {
    method: 'GET',
    url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
    params: {text: 'Hello, world!!', to: targetLang, from: 'en'},
    headers: {
      'x-rapidapi-host': 'nlp-translation.p.rapidapi.com',
      'x-rapidapi-key': 'a460bb0bd0msh814d08d164cd76bp1b1451jsn09211e97f6aa'
    }
  };
  
  axios.request(options)
  .then(function (response) {
    console.log(response.data);
    res.json(response.data.translated_text)
  })
  .catch(function (error) {
    res.json(error.message)
    console.error(error);
  });
})

module.exports = router
