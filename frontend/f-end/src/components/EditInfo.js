import { useState, useEffect } from 'react'
import { get, post } from '../http/service'
import { useNavigate } from 'react-router-dom'

function EditInfo(props) {
  const [username, setUsername] = useState('')
  // const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [preferredLang, setPreferredLang] = useState('')
  const [changedInfo, setChangedInfo] = useState(false)
  const [id, setId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    get("/auth/loggedin")
    .then(results => {
      setUsername(results.data.username);
      setFirstName(results.data.firstName);
      setLastName(results.data.lastName);
      setPreferredLang(results.data.preferredLang);
      setId(results.data._id);
    })
  }, [])

  useEffect(() => {
    if (changedInfo) {
      navigate('/profile')
    }
  }, [changedInfo])

  const saveUserInfo = (e) => {
    e.preventDefault();
    post("/auth/edit-info", {
      username,
      // password,
      firstName,
      lastName,
      preferredLang
    })
    .then(updatedUser => {
      props.setUser(updatedUser.data)
      setChangedInfo(true);
    })
    .catch(err => console.log(err))
  }

  const goBack = () => {
    navigate(`/profile/${id}`)
  }

  function changePassword() {
    navigate('/auth/change-password')
  }

  return (
    <div>
      <form onSubmit={saveUserInfo}>
        <label htmlFor="username">Username:</label>
        <input name="username" value={username} onChange={e => setUsername(e.target.value)}/><br></br>
        <label htmlFor="firstName">First Name:</label>
        <input name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)}/><br></br>
        <label htmlFor="lastName">Last Name:</label>
        <input name="lastName" value={lastName} onChange={e => setLastName(e.target.value)}/><br></br>
        <label htmlFor="preferredLang">Select Preferred Language:</label>
        <select name="preferredLang" id="preferredLang" onChange={e => setPreferredLang(e.target.value)} defaultValue={preferredLang}>
          <option value="spanish">Spanish</option>          
          <option value="hebrew">Hebrew</option>          
          <option value="french">French</option>          
          <option value="portguese">Portuguese</option>          
          <option value="chinese">Chinese</option>          
        </select><br></br>
        <button onClick={changePassword}>Change Password</button>
        <button type="submit">Save</button>
      </form>
      <button onClick={goBack}>Back to Profile</button>
    </div>
  )
}

export default EditInfo;