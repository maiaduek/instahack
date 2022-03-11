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
      <form onSubmit={loginUser}>
        <div className="m-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input placeholder="Insthacker1" id="username" className="form-control input-sm" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="m-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input placeholder="********" type="password" value={password} className="form-control" id="password" onChange={e => setPassword(e.target.value)} />
          <div id="emailHelp" className="form-text">Please choose a password with at least 8 characters.</div>
        </div>
        {/* <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /> */}
        {/* <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /> */}
        <button type="submit" className="btn btn-primary">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

export default Login
