import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { get, post } from '../http/service';
import axios from 'axios';

function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const [userPost, setUserPost] = useState({});
  const [user, setUser] = useState({});
  const [translated, setTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [comment, setComment] = useState('');
  const [postComments, setPostComments] = useState([]);
  const [currentProfile, setCurrentProfile] = useState({});

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
    .catch(err => console.log("IN AUTH ERROR", err))
  }, [])

  useEffect(() => {
    get(`/post/profile/${userPost.poster}`)
    .then(results => {
      setCurrentProfile(results.data)
    })
    .catch(err => console.log("error getting profile::", err))
  }, [userPost])

  useEffect(() => {
    get(`/post/${postId}/comments`)
    .then((results) => {
      setPostComments(results.data)
    })
    .catch(err => console.log("ERR GETTING COMMENTS:::", err))
  }, [])

  const deletePost = (id) => {
    post(`/post/delete-post/${id}`)
    .then(results => {
      navigate(`/profile/${user._id}`)
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
      // console.log("targetLANG", targetLang)
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
        // console.log("RESPONSE", response.data)
        if (!translatedContent) {
          setTranslatedContent(response.data.translated_text[targetLang])
        } else {
          setTranslatedContent('')
        }
        // console.log(response.data.translated_text[targetLang]);
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
        commentBody: comment,
        commenter: user._id,
        post: postId,
        commenterName: user.username
      })
      .then((res) => {
        // console.log("POST COMMENTS", res)
        setPostComments(postComments.concat(res.data))
      })
      .then(results => {
        setAddingComment(!addingComment)
      })
      .catch(err => console.log("error adding comment::", err))
    }
  }

  const deleteComment = (cmt) => {
    post(`/post/${postId}/delete-comment/${cmt}`)
    .then(deletedComment => {
      let filteredComments = postComments.filter(comment => {
        return comment._id !== cmt
      })
      setPostComments(filteredComments)
    })
    .catch(err => console.log("ERR DELETING COMMENT", err))
  }

  return (
    <div>
      <h2>{userPost.caption}</h2>
      <p>{translatedContent ? translatedContent : userPost.content}</p>
      <p>{userPost.createdAt?.slice(0, 10)}</p>
      <button onClick={translate}>Translate Post</button>
      {
          postComments.map((cmt, i) => {
          return (
            <div key={i}>
              <p>By: <a href={`/profile/${cmt.commenter}`}>{cmt.commenterName}</a></p>
              <p>{cmt.commentBody}</p>
              <button onClick={() => deleteComment(cmt._id)}>Delete</button>
            </div>
          )
        })
      }
      {
        addingComment ? 
        <div>
        <label htmlFor="comment-text">Comment:</label>
          <textarea name="comment-text" cols="50" rows="4" onChange={e => setComment(e.target.value)}></textarea>
        </div> : ''
      }
      <button onClick={addComment}>Add Comment</button>
      <button onClick={() => deletePost(userPost._id)}>Delete Post</button>
      <p>{currentProfile._id}</p>
      <Link to={`/profile/${currentProfile._id}`}>Back to Profile</Link>
    </div>
  )
}

export default PostDetails;