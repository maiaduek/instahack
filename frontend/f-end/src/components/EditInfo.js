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

  const navigate = useNavigate();

  useEffect(() => {
    get("/auth/loggedin")
    .then(results => {
      setUsername(results.data.user.username)
      setFirstName(results.data.user.firstName);;
      setLastName(results.data.user.lastName);
      setPreferredLang(results.data.user.preferredLang);
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
      localStorage.setItem("token", updatedUser.data)
      props.setUser(updatedUser.data)
      setChangedInfo(true);
    })
    .catch(err => console.log(err))
  }

  return (
    <div>
      <form onSubmit={saveUserInfo}>
        <input value={username} onChange={e => setUsername(e.target.value)}/>
        {/* <input placeholder="Password" onChange={e => setPassword(e.target.value)}/> */}
        <input value={firstName} onChange={e => setFirstName(e.target.value)}/>
        <input value={lastName} onChange={e => setLastName(e.target.value)}/>
        <select id="preferredLang" onChange={e => setPreferredLang(e.target.value)} defaultValue={preferredLang}>
          <option value="spanish">Spanish</option>          
          <option value="hebrew">Hebrew</option>          
          <option value="french">French</option>          
          <option value="portguese">Portuguese</option>          
          <option value="chinese">Chinese</option>          
        </select>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default EditInfo;