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
      <nav className="navbar nav-pills bg-primary p-2 justify-content-end d-flex justify-content-between">
        <h1 className="text-white ms-3">InstaHack</h1>
        <ul className="nav">
          <li className="m-3">
            <button onClick={() => navigate('/auth/edit-info')} className="btn btn-primary">Edit Info</button>
            <button onClick={logout} className="btn btn-primary">Logout </button>
            <button onClick={deleteUser} className="btn btn-outline-danger">Delete User</button>
          </li>
        </ul>
      </nav>
      
      <div className="row">
        <img src="https://thumbs.dreamstime.com/b/man-hipster-avatar-cartoon-guy-black-hair-man-hipster-avatar-cartoon-guy-black-hair-flat-icon-blue-background-user-223717055.jpg" className="col-3 mt-5 ms-5" style={{borderRadius: "200px"}}/>
        <div className="col-6">
          <h2 className="mt-5">{userInfo.firstName} {userInfo.lastName}</h2>
          <h3 style={{color: "grey"}} className="mt-4">{userInfo.username}</h3>
          <h4 className="mt-4" style={{color: "grey"}}>Member since: {userInfo.createdAt?.slice(0,10)}</h4>
        </div>
      </div>

      <button onClick={() => navigate('/post/create-post')} className="btn btn-primary col-9 mt-5">Create New Post</button>

      {
        userInfo?.posts?.length ? 
        userInfo.posts.map((post, i) => {
          return (
          <div className="card w-76 ms-5 mt-3" key={i}>
            <div className="card-body">
              <h5 className="card-title">{post.caption}</h5>
              <p className="card-text">{post.comments.length} Comments</p>
              <a href={`/post/${post._id}`} className="btn btn-primary">Check It out</a>
            </div>
          </div>
          )
          }) : ''
      }
    </div>
  )
}

export default Profile;