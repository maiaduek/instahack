import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { get, post } from '../http/service';
import axios from 'axios';

function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const [userPost, setUserPost] = useState({});
  const [user, setUser] = useState({});
  const [translated, setTranslated] = useState(false)
  const [translatedContent, setTranslatedContent] = useState('')

  useEffect(() => {
    get(`/post/${postId}`)
    .then(results => {
      setUserPost(results.data)
    })
    .catch(err => {
      console.log("Error finding post: ", err.response)
    })
  }, [])

  useEffect(() => {
    get('/auth/loggedin')
    .then(results => {
      setUser(results.data)
    })
    .catch(err => console.log(err))
  }, [])

  const deletePost = (id) => {
    post(`/post/delete-post/${id}`)
    .then(results => {
      navigate('/profile')
    })
    .catch(err => console.log(err))
  }

  const translate = () => {
    get("/translate")
      const languages = {
        spanish: 'es',
        hebrew: 'iw',
        french: 'fr',
        portuguese: 'pt',
        chinese: 'zh-CN'
      }
      let targetLang = languages[user.preferredLang]
      // console.log("USER P.LANG::", req.user.preferredLang)
      if (!translated) {
        var options = {
          method: 'GET',
          url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
          params: {text: `${userPost.content}`, to: targetLang, from: 'en'},
          headers: {
            'x-rapidapi-host': 'nlp-translation.p.rapidapi.com',
            'x-rapidapi-key': 'a460bb0bd0msh814d08d164cd76bp1b1451jsn09211e97f6aa'
          }
        }
      } else {
        var options = {
          method: 'GET',
          url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
          params: {text: `${translatedContent}`, to: 'en', from: targetLang},
          headers: {
            'x-rapidapi-host': 'nlp-translation.p.rapidapi.com',
            'x-rapidapi-key': 'a460bb0bd0msh814d08d164cd76bp1b1451jsn09211e97f6aa'
          }
        }
      } 
      axios.request(options)
      .then(async function (response) {
        if (!translatedContent) {
          setTranslatedContent(response.data.translated_text[targetLang])
        } else {
          setTranslatedContent('')
        }
        await console.log(response.data.translated_text[targetLang]);
        setTranslated(!translated)
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <div>
      <h2>{userPost.caption}</h2>
      <p>{translatedContent ? translatedContent : userPost.content}</p>
      <p>{userPost.createdAt?.slice(0, 10)}</p>
      <button onClick={() => deletePost(userPost._id)}>Delete Post</button>
      <button onClick={translate}>Translate Post</button>
      <Link to={`/post/${userPost._id}/create-comment`}>Comment</Link>
      <Link to="/profile">Back to Profile</Link>
    </div>
  )
}

export default PostDetails;
