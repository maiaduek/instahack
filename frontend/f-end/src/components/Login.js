import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../http/service';

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
      props.setUser(results.data)
    })
    .catch(err => setError(err.response.data.errorMessage))
  }

  useEffect(() => {
    if (loggedIn) {
      navigate('/profile')
    }
  }, [loggedIn])

  return (
    <div>
      <form onSubmit={loginUser}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

export default Login
