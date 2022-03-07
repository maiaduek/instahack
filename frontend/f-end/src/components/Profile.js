import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { get } from '../http/service'

function Profile(props) {
  const [name, setName] = useState('')
  const [posts, setPosts] = useState([])
  const [logUserOut, setLogUserOut] = useState(false);

  const navigate = useNavigate()
  
  // useEffect(() => {
  //   get('/auth/loggedin')
  //   .then(results => {
  //     setName(results.data.user.firstName)
  //     setId(results.data.user._id)
  //     setUser(results.data.user)
  //     // setPostsIds(results.data.user.posts)
  //   })
  //   .catch(err => console.log(err))
  // }, [])

  // useEffect(() => {
  //   console.log("ID", id)
  //   get(`/post/all-posts/${id}`)
  //   .then(results => {
  //     console.log("POSTS::", results.data)
  //     setPosts(results.data)
  //   })
  //   .catch(err => console.log(err))
  // }, [id])

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

  return (
    <div>
      <h1>Welcome, {name}</h1>
      <button onClick={() => navigate('/auth/edit-info')}>Edit Info</button>
      <button onClick={() => navigate('/post/create-post')}>Create Post</button>
      <button onClick={logout}>Logout </button>
      {
        posts.length ? 
        posts.map((post, i) => {
            return (
              <div key={i}>
                <p>{post.content}</p>
                <p>{post.caption}</p>
              </div>
            )
          }) : ''
      }
    </div>
  )
}

export default Profile;