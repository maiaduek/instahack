import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { get, post } from '../http/service'

function Profile(props) {
  const [name, setName] = useState('')
  const [posts, setPosts] = useState([])
  const [logUserOut, setLogUserOut] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    get(`/auth/loggedin`)
    .then(results => {
      setPosts(results.data.posts)
      setName(results.data.firstName)
    })
    .catch(err => console.log(err))
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    setLogUserOut(true)
  }

  useEffect(() => {
    if(logUserOut) {
      navigate('/')
    }
  }, [logUserOut])

  const deletePost = (id) => {
    post(`/post/delete-post/${id}`)
    .then(results => {
      get(`/auth/loggedin`)
      .then(results => {
      setPosts(results.data.posts)
      navigate('/profile')
      })
    })
    .catch(err => console.log(err))
  }

  const deleteUser = () => {
    post('/auth/delete')
    .then(results => {
      navigate('/')
    })
    .catch(err => console.log(err))
  }

  return (
    <div>
      <h1>Welcome, {name}</h1>
      <button onClick={() => navigate('/auth/edit-info')}>Edit Info</button>
      <button onClick={() => navigate('/post/create-post')}>Create Post</button>
      <button onClick={logout}>Logout </button>
      <button onClick={deleteUser}>Delete User</button>
      {
        posts.length ? 
        posts.map((post, i) => {
            return (
              <div key={i}>
                <p>{post.caption}</p>
                <p>{post.content}</p>
                <button onClick={() => deletePost(post._id)}>Delete Post</button>
              </div>
            )
          }) : ''
      }
    </div>
  )
}

export default Profile;