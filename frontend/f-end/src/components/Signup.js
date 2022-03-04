import { useState } from 'react';
import {Link} from 'react-router-dom'
import { get, post } from '../http/service';

function Signup() {
  const [ username, setUsername] = useState('');
  const [ password, setPassword] = useState('');
  const [ firstName, setFirstName] = useState('');
  const [ lastName, setLastName] = useState('');
  const [ preferredLang, setPreferredLang] = useState('');

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
      console.log("NEW USER::", newUser)
      localStorage.setItem("token", newUser.data)
    })
    .catch(err => console.log("ERROR CREATING USER::", err))
  }


  return (
    <div>
      <h1>Creat an account:</h1>
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
          <option value="portguese">Portuguese</option>          
          <option value="chinese">Chinese</option>          
        </select>
        <Link to="/profile"><button type="submit">Create Account</button></Link>
      </form>
    </div>
  )
}

export default Signup;
