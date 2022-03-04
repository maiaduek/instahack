const router = require("express").Router();
const axios = require('axios');
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Post = require('../models/Post.model')


router.get("/translate", isAuthenticated, (req, res) => {
  const languages = {
    spanish: 'es',
    hebrew: 'iw',
    french: 'fr',
    portuguese: 'pt',
    chinese: 'zh-CN'
  }
  let targetLang = languages[req.user.preferredLang]
  // console.log("USER P.LANG::", req.user.preferredLang)
  var options = {
    method: 'GET',
    url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
    params: {text: 'Hi everyone!', to: targetLang, from: 'en'},
    headers: {
      'x-rapidapi-host': 'nlp-translation.p.rapidapi.com',
      'x-rapidapi-key': 'a460bb0bd0msh814d08d164cd76bp1b1451jsn09211e97f6aa'
    }
  };
  // console.log("REQ USER;::::",req.user)
  axios.request(options)
  .then(function (response) {
    console.log(response.data);
    res.json(response.data.translated_text[targetLang])
  })
  .catch(function (error) {
    res.json(error.message)
    console.error(error);
  });
})

module.exports = router
