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
        commenterName: user.username,
        commenterImage: user.image
      })
      .then((res) => {
        // console.log("POST COMMENTS", res)
        setPostComments(postComments.concat(res.data))
      })
      .then(results => {
        setAddingComment(!addingComment)
      })
      .then(res => {
        setComment('')
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
console.log(postComments)
  return (
    <div>
      <nav className="navbar nav-pills bg-primary p-2 justify-content-end d-flex justify-content-between">
        <h1 className="text-white ms-3">InstaHack</h1>
        <ul className="nav">
          <li className="m-3">
          <Link to={`/profile/${currentProfile._id}`} className="btn btn-primary">Back to Profile</Link>
          </li>
        </ul>
      </nav>

      <div style={{margin: "auto", width: "75%"}}>
        <div className="card mb-3 mt-5 ms-5 shadow" style={{maxWidth: "800px", margin: "auto"}}>
          <div className="row g-0">
            <div className="col-md-4">
              <img src={currentProfile.image} className="img-fluid rounded-start"/>
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h3 className="card-title">{userPost.caption}</h3>
                <p className="card-text mt-5">{translatedContent ? translatedContent : userPost.content}</p>
                <p className="card-text"><small className="text-muted">By: <a href={`/profile/${currentProfile._id}`}>{currentProfile.username}</a></small></p>
                <p className="card-text"><small className="text-muted">Published: {userPost.createdAt?.slice(0,10)}</small></p>
                <button onClick={translate} className="btn btn-outline-primary">Translate</button>
                {user._id === currentProfile._id ? 
                <button onClick={() => deletePost(userPost._id)} className="btn btn-outline-primary ms-2">Delete Post</button> : ''}
              </div>
            </div>
          </div>
        </div>
        {/* {
          addingComment ? 
          <div className="d-flex justify-content-center align-items-center">
          <label htmlFor="comment-text mr-5">Comment:</label>
            <textarea className="ms-5 mb-2" name="comment-text" cols="50" rows="4" onChange={e => setComment(e.target.value)}></textarea>
          </div> : ''
        }
        <button onClick={addComment} className="btn btn-outline-primary mb-3 w-40">Add Comment</button> */}
          {
            postComments.map((cmt, i) => {
              return (
                <div className="card ms-5 mb-1 shadow" style={{maxWidth: "800px", display:"flex", flexDirection: "row", justifyContent: "space-between"}} key={i}>
                  <div className="card-body" style={{display: "flex", flexDirection: "row"}}>
                    <img src={cmt.commenterImage} style={{width:"100px", borderRadius: "50px"}}/>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: "20px"}}>
                      <h5 className="card-title"><a href={`/profile/${cmt.commenter}`}>{cmt.commenterName}</a></h5>
                      <p className="card-text">{cmt.commentBody}</p>
                      <p style={{color: "lightgray"}}>{cmt.updatedAt?.slice(0,10)}</p>
                    </div>
                  </div>
                  {user._id === currentProfile._id ? 
                  <button onClick={() => deleteComment(cmt._id)} className="btn btn-outline-primary" style={{height: "40px", marginTop: "45px", marginRight: "30px"}}>Delete</button> : ''}
                </div>
            )
          })
        }
        <div style={{margin: "auto", float: "right", width: "75%"}}>
          <div className="d-flex justify-content-center align-items-center mt-3">
            {/* <label htmlFor="comment-text">Comment:</label> */}
            <textarea className="ms-5 mb-2 shadow" name="comment-text" cols="50" rows="4" style={{borderRadius: "5px", marginRight: "300px"}} onChange={e => setComment(e.target.value)} value={comment}></textarea>
          </div>
          <button onClick={addComment} className="btn btn-outline-primary mb-3 w-40" style={{marginRight: "250px"}}>Add Comment</button>
        </div>
      </div>
    </div>
  )
}

export default PostDetails;