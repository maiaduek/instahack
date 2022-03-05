import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { get } from '../http/service'

function Profile(props) {
  const [name, setName] = useState('')
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({})
  const [logUserOut, setLogUserOut] = useState(false);

  const navigate = useNavigate()

  // const getPosts = () => {
  //   get("/post/profile")
  //   .then(foundUser => {
  //     console.log("FOUND USER::", foundUser.data)
  //   })
  //   .catch(err => console.log(err))
  // }

  useEffect(() => {
    get('/auth/loggedin')
    .then(results => {
      setName(results.data.user.firstName)
      setPosts(results.data.user.posts)
      setUser(results.data.user)
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
      <button onClick={() => navigate('/edit-info')}>Edit Info</button>
      <button onClick={() => navigate('/create-post')}>Create Post</button>
      <button onClick={logout}>Logout </button>
      {
        posts.map((post) => {
          return (
            <div>
              <p>{post.content}</p>
              <p>{post.caption}</p>
            </div>
          )
        })
      }
    </div>
  )
}

export default Profile;