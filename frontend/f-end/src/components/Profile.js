import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { get, post } from '../http/service'

function Profile(props) {
  const [userInfo, setUserInfo] = useState({})
  const [logUserOut, setLogUserOut] = useState(false);

  const navigate = useNavigate()
  const { userId } = useParams();

  useEffect(() => {
    get(`/post/profile/${userId}`)
    .then(results => {
      setUserInfo(results.data)
    })
    .catch(err => console.log(err.response.data))
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

  const deleteUser = () => {
    post('/auth/delete')
    .then(results => {
      navigate('/')
    })
    .catch(err => console.log(err))
  }

  return (
    <div>
      <h1>{userInfo.firstName}'s Profile</h1>
      <button onClick={() => navigate('/auth/edit-info')}>Edit Info</button>
      <button onClick={() => navigate('/post/create-post')}>Create Post</button>
      <button onClick={logout}>Logout </button>
      <button onClick={deleteUser}>Delete User</button>
      {
        userInfo?.posts?.length ? 
        userInfo.posts.map((post, i) => {
            return (
              <div key={i}>
                <Link to={`/post/${post._id}`}>{post.caption}</Link>
              </div>
            )
          }) : ''
      }
    </div>
  )
}

export default Profile;