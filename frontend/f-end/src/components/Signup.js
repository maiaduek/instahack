import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { post, get } from '../http/service';

function Signup() {
  const [ username, setUsername] = useState('');
  const [ password, setPassword] = useState('');
  const [ firstName, setFirstName] = useState('');
  const [ lastName, setLastName] = useState('');
  const [ preferredLang, setPreferredLang] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setloggedIn] = useState(false)

  const navigate = useNavigate();

  const signupUser = (e) => {
    e.preventDefault();
    post("/auth/signup", {
      username,
      password,
      firstName,
      lastName,
      preferredLang
    })
    .then(newUser => {
      localStorage.setItem("token", newUser.data)
      setloggedIn(true)
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
      <h1>Creat an account:</h1>
      <button onClick={()=> navigate('/')}>home</button>
      <form onSubmit={signupUser}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
        <label htmlFor="preferredLang">Preferred Language:</label>
        <select id="preferredLang" onChange={e => setPreferredLang(e.target.value)}>
          <option value="spanish">Spanish</option>          
          <option value="hebrew">Hebrew</option>          
          <option value="french">French</option>          
          <option value="portuguese">Portuguese</option>          
          <option value="chinese">Chinese</option>          
        </select>
        <button type="submit">Create Account</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

export default Signup;
