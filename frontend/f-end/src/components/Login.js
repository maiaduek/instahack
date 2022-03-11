import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post, get } from '../http/service';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('')

  const navigate = useNavigate();

  const loginUser = (e) => {
    e.preventDefault();
    post("/auth/login", {
      username, 
      password
    })
    .then(results => {
      localStorage.setItem("token", results.data)
      setLoggedIn(true);
      
    })
    .catch(err => setError(err.response.data.errorMessage))
  }

  useEffect(() => {
    if (loggedIn) {
      get("/auth/loggedin")
      .then(results => {
        navigate(`/profile/${results.data._id}`)
      })
    }
  }, [loggedIn])

  return (
    <div>
      <nav className="navbar nav-pills bg-primary p-2 justify-content-end d-flex justify-content-between">
        <h1 className="text-white ms-3">InstaHack</h1>
        <ul className="nav">
          <li className="m-3">
            <Link className="text-white text-decoration-none" to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <h2 className="text-primary m-4 d-flex justify-content-start">Login:</h2>
      <div style={{display: "flex", justifyContent: "center"}}>
        
        <form onSubmit={loginUser} style={{width: "600px"}}>
          <div className="m-3" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
            <label htmlFor="username" className="form-label" style={{marginRight: "10px"}}>Username:</label>
            <input placeholder="Insthacker1" id="username" className="form-control input-sm shadow" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="m-3" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
            <label htmlFor="password" className="form-label" style={{marginRight: "10px"}}>Password:</label>
            <input placeholder="********" type="password" value={password} className="form-control shadow" id="password" onChange={e => setPassword(e.target.value)} />
          </div>
            <div id="emailHelp" className="form-text">Please choose a password with at least 8 characters.</div>
          <button type="submit" className="btn btn-primary" style={{marginTop: "50px", marginBottom: "30px"}}>Login</button>
          {error && <p style={{color: "red"}}>{error}</p>}
        </form>
        </div>
    </div>
  )
}

export default Login
