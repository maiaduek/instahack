import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post, get } from '../http/service';


function CreatePost() {
  const [content, setContent] = useState('')
  const [caption, setCaption] = useState('')
  const [finishedPost, setFinishedPost] = useState(false);
  const [poster, setPoster] = useState('')

  const navigate = useNavigate();

  useEffect(() => {
    if (finishedPost) {
      // console.log("FINISHED POST", poster)
      navigate(`/profile/${poster}`)
    }
  }, [finishedPost])

  useEffect(() => {
    get('/auth/loggedin')
    .then(results => {
      setPoster(results.data._id)
    })
    .catch(err => console.log(err))
  }, [])

  const submitPost = (e) => {
    e.preventDefault();
    post("/post/create-post", {
      content,
      caption,
      poster
    })
    .then(post => {
      setFinishedPost(true)
    })
    .catch(err => console.log(err))
  }

  return (
    <div>
      <nav className="navbar nav-pills bg-primary p-2 justify-content-end d-flex justify-content-between">
        <h1 className="text-white ms-3">InstaHack</h1>
        <ul className="nav">
          <li className="m-3">
          <Link to={`/profile/${poster}`} className="btn btn-primary">Back to Profile</Link>
          </li>
        </ul>
      </nav>
      <h1>Create your post:</h1>
      <form onSubmit={submitPost}>
        <div>
          <label htmlFor="post">Compose your post:</label>
          <textarea name="post" rows="4" cols="50" onChange={e => setContent(e.target.value)}></textarea>
        </div>
        <div>
          <label htmlFor="caption">Caption:</label>
          <textarea name="caption" rows="1" cols="50" onChange={e => setCaption(e.target.value)}></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default CreatePost
