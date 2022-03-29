import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { get, post } from '../http/service'

function Profile(props) {
  const [userInfo, setUserInfo] = useState({})
  const [logUserOut, setLogUserOut] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});
  // const [bio, setBio] = useState(userInfo.bio);

  const navigate = useNavigate()
  const { userId } = useParams();

  useEffect(() => {
    get('/auth/loggedin')
    .then(results => {
      setLoggedInUser(results.data)
    })
    .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    get(`/post/profile/${userId}`)
    .then(results => {
      setUserInfo(results.data)
    })
    .catch(err => console.log(err.response.data))
  }, [])

  useEffect(() => {
    if(logUserOut) {
      navigate('/')
    }
  }, [logUserOut])

  const logout = () => {
    localStorage.removeItem("token")
    setLogUserOut(true)
  }

  const deleteUser = () => {
    window.confirm('Are you sure you wish to delete your account?') ?
    post('/auth/delete')
    .then(results => {
      navigate('/')
    })
    .catch(err => console.log(err))
    : navigate(`/profile/${userInfo._id}`)
  }

  const setUpdatedBio = (e) => {
    if (!editing) {
      setEditing(true)
    } else {
      e.preventDefault();
      post('/auth/edit-info', {
        bio: userInfo.bio
      })
      .then(results => {
        setEditing(false)
      })
      .catch(err => console.log(err))
    }
  }

  const changeBio = (bioText) => {
    setUserInfo({...userInfo, bio: bioText})
  }
  console.log("IMGA::", userInfo)
  return (
    <div>
      <nav className="navbar nav-pills bg-primary p-2 justify-content-end d-flex justify-content-between">
        <h1 className="text-white ms-3">InstaHack</h1>
        <ul className="nav">
          <li className="m-3">
            <button onClick={() => navigate('/auth/edit-info')} className="btn btn-primary">Edit Info</button>
            <button onClick={logout} className="btn btn-primary">Logout </button>
            <button onClick={deleteUser} className="btn btn-outline-danger">Delete My Account</button>
          </li>
        </ul>
      </nav>
      
      <div className="row">
        <img src={userInfo.image} className="col-3 mt-5 ms-5" style={{borderRadius: "200px"}}/>
        <div className="col-6">
          <h2 className="mt-5">{userInfo.firstName} {userInfo.lastName}</h2>
          <h3 style={{color: "grey"}} className="mt-4">{userInfo.username}</h3>
          <h4 className="mt-4" style={{color: "grey"}}>Member since: {userInfo.createdAt?.slice(0,10)}</h4>
          <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", width: "400px"}}>
            { editing ? <textarea className="shadow" value={userInfo.bio} onChange={(e) => changeBio(e.target.value)}/> : <p>{userInfo.bio}</p> }
            {loggedInUser._id === userInfo._id ? 
            <svg xmlns="http://www.w3.org/2000/svg"  onClick={setUpdatedBio} width="16" height="16" fill="currentColor" className="bi bi-pencil-square ms-3 mt-1" viewBox="0 0 16 16" >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
            </svg> : ''}
          </div>
        </div>
      </div>
      { loggedInUser._id === userInfo._id ? 
      <button onClick={() => navigate('/post/create-post')} className="btn btn-primary col-9 mt-5 shadow">New Post</button> : ''
      }
      {
        userInfo?.posts?.length ? 
        userInfo.posts.map((post, i) => {
          return (
          <div className="card w-76 ms-5 mt-3 shadow" key={i}>
            <div className="card-body">
              <h5 className="card-title">{post.caption}</h5>
              <p className="card-text">{post.comments.length} Comments</p>
              <a href={`/post/${post._id}`} className="btn btn-primary">Check Out Post</a>
            </div>
          </div>
          )
          }) : ''
      }
    </div>
  )
}

export default Profile;