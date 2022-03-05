import { useState, useEffect } from 'react'
import { get, post } from '../http/service'

function EditInfo(props) {
  const [username, setUsername] = useState(props.user.username)
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState(props.user.firstName)
  const [lastName, setLastName] = useState(props.user.lastName)
  const [preferredLang, setPreferredLang] = useState(props.user.preferredLang)

  // useEffect(() => {
  //   get("/auth/loggedin")
  //   .then(results => {
  //     console.log("LOGGED IN INFO::", results)
  //   })
  // }, [])

  const saveUserInfo = (e) => {
    e.preventDefault();
    post("/auth/edit-info", {
      username,
      password,
      firstName,
      lastName,
      preferredLang
    })
    .then(updatedUser => {
      console.log("UPDATED USER::", updatedUser.data)
    })
    .catch(err => console.log(err))
  }

  return (
    <div>
      <form onSubmit={saveUserInfo}>
        <input value={username} onChange={e => setUsername(e.target.value)}/>
        <input placeholder="Password" onChange={e => setPassword(e.target.value)}/>
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