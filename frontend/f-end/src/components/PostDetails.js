import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { get, post } from '../http/service';
import axios from 'axios';

function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const [userPost, setUserPost] = useState({});
  const [user, setUser] = useState({});
  // const [preferredLang, setPreferredLang] = useState('')
  const [translated, setTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [comment, setComment] = useState('');

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
      // setPreferredLang(user.preferredLang)
      // console.log("USER::: HERE", user)
    })
    .catch(err => console.log("IN AUTH ERROR", err))
  }, [])

  console.log("USER::", user)

  const deletePost = (id) => {
    post(`/post/delete-post/${id}`)
    .then(results => {
      navigate('/profile')
    })
    .catch(err => console.log(err))
  }
  
  const translate = () => {
      const languages = {
        spanish: 'es',
        hebrew: 'iw',
        french: 'fr',
        portuguese: 'pt',
        chinese: 'zh-CN'
      }
      let targetLang = languages[user.preferredLang]
      console.log("targetLANG", targetLang)
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
      .then(function (response) {
        console.log("RESPONSE", response.data)
        if (!translatedContent) {
          setTranslatedContent(response.data.translated_text[targetLang])
        } else {
          setTranslatedContent('')
        }
        console.log(response.data.translated_text[targetLang]);
        setTranslated(!translated)
      })
      .catch(function (error) {
        console.error("IN AXIOS ERROR", error);
      });
  }

  const addComment = (e) => {
    if (!addingComment) {
      setAddingComment(!addingComment)
    } else {
      e.preventDefault();
      post(`/post/${postId}/create-comment`, {
        comment,
        commenter: user._id,
        post: postId
      })
      .then(results => {
        setAddingComment(!addingComment)
        console.log("comment results::::", results)
      })
      .catch(err => console.log("error adding comment:::", err.response))
    }
  }

  return (
    <div>
      <h2>{userPost.caption}</h2>
      <p>{translatedContent ? translatedContent : userPost.content}</p>
      <p>{userPost.createdAt?.slice(0, 10)}</p>
      <button onClick={translate}>Translate Post</button>
      {/* <Link to={`/post/${userPost._id}/create-comment`}>Comment</Link> */}
      {
        addingComment ? 
        <div>
        <label htmlFor="comment-text">Comment:</label>
          <textarea name="comment-text" cols="50" rows="4" onChange={e => setComment(e.target.value)}></textarea>
        </div> : ''
      }
      <button onClick={addComment}>Add Comment</button>
      <button onClick={() => deletePost(userPost._id)}>Delete Post</button>
      <Link to="/profile">Back to Profile</Link>
    </div>
  )
}

export default PostDetails;
