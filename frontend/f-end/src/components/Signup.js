import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
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
      <nav className="navbar nav-pills bg-primary p-2 justify-content-end d-flex justify-content-between">
        <h1 className="text-white ms-3">InstaHack</h1>
        <ul className="nav">
          <li className="m-3">
            <Link className="text-white text-decoration-none" to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <h2 className="text-primary m-4 d-flex justify-content-start">Join us:</h2>
      <form onSubmit={signupUser}>
        <div className="m-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input placeholder="Insthacker1" id="username" className="form-control input-sm" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="m-3"> 
          <label htmlFor="password" className="form-label">Password:</label>
          <input placeholder="********" type="password" className="form-control" id="password" onChange={e => setPassword(e.target.value)} value={password}/>
          <div id="emailHelp" className="form-text">Please choose a password with at least 8 characters.</div>
        </div>
        <div className="m-3">
          <label htmlFor="firstName" className="form-label">First Name:</label>
          <input placeholder="Insta" className="form-control" id="firstName" onChange={e => setFirstName(e.target.value)} value={firstName}/>
        </div>
        <div className="m-3">
          <label htmlFor="lastName" className="form-label">Last Name:</label>
          <input placeholder="Hacker" className="form-control" id="lastName" onChange={e => setLastName(e.target.value)} value={lastName}/>
        </div>
        <div className="m-3">
          <label htmlFor="preferredLang">Preferred Language:</label>
          <select id="preferredLang" className="form-select form-select mb-3" aria-label=".form-select-lg example" onChange={e => setPreferredLang(e.target.value)}>
            <option defaultValue>Choose a language</option>
            <option value="spanish">Spanish</option>
            <option value="hebrew">Hebrew</option>
            <option value="french">French</option>
            <option value="portuguese">Portuguese</option>
            <option value="chinese">Chinese</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Account</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  )
}

export default Signup;
