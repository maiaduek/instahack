import { useState, useEffect } from 'react'
import { get, post, postFile } from '../http/service'
import { useNavigate } from 'react-router-dom'

function EditInfo(props) {
  const [username, setUsername] = useState('')
  // const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [image, setImage] = useState('');
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
      setImage(results.data.image);
      setId(results.data._id);
    })
  }, [])

  useEffect(() => {
    if (changedInfo) {
      navigate(`/profile/${id}`)
    }
  }, [changedInfo])

  const saveUserInfo = (e) => {
    e.preventDefault();
    post("/auth/edit-info", {
      username,
      firstName,
      lastName,
      preferredLang,
      image
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

  const handleFileUpload = (e) => {
    const uploadData = new FormData();

    uploadData.append('image', e.target.files[0]);
      postFile('/auth/upload-image', uploadData)
      .then(response => {
        console.log("response is::", response.data)
        setImage(response.data.path)
      })
      .catch(err => console.log("error uploading::", err));
  };


  return (
    <div>
      <nav className="navbar nav-pills bg-primary p-2 justify-content-end d-flex justify-content-between">
        <h1 className="text-white ms-3">InstaHack</h1>
        <ul className="nav">
          <li className="m-3">
          <button onClick={goBack} className="btn btn-primary">Back to Profile</button>
          </li>
        </ul>
      </nav>
      <h2 className="text-primary m-4 d-flex justify-content-start">Edit your Info:</h2>

      <form onSubmit={saveUserInfo}>
        <div className="m-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input placeholder="Insthacker1" id="username" className="form-control input-sm shadow" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="m-3">
          <label htmlFor="firstName" className="form-label">First Name:</label>
          <input placeholder="Insta" className="form-control shadow" id="firstName" onChange={e => setFirstName(e.target.value)} value={firstName}/>
        </div>
        <div className="m-3">
          <label htmlFor="lastName" className="form-label">Last Name:</label>
          <input placeholder="Hacker" className="form-control shadow" id="lastName" onChange={e => setLastName(e.target.value)} value={lastName}/>
        </div>
        <div className="m-3" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <label htmlFor="image" className="form-label" style={{marginRight: "10px"}}>Profile Photo:</label>
          <input name="image" type="file" onChange={(e) => handleFileUpload(e)} />
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
        <button onClick={changePassword} className="btn btn-primary m-3">Change Password</button>
        <button type="submit" className="btn btn-primary m-3">Save</button>
      </form>
    </div>
  )
}

export default EditInfo;