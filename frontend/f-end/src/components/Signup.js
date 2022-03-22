import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { post, get } from '../http/service';

function Signup() {
  const [ username, setUsername] = useState('');
  const [ password, setPassword] = useState('');
  const [ firstName, setFirstName] = useState('');
  const [ lastName, setLastName] = useState('');
  const [ image, setImage] = useState('');
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
      image,
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

  const handleFileUpload = (e) => {
    //console.log("file to be uploaded::", e.target.files[0])
    const uploadData = new FormData();

    //imageUrl => this name is to be the same as in the model since we pass req.body to .create() methos when creating a new thing in '/auth/upload-image' POST route
    uploadData.append('imageUrl', e.target.files[0]);
      post('/auth/upload-image', {
        image: uploadData
      })
      .then(response => {
        console.log("response is::", response.data)
        // setImage(response)
      })
      .catch(err => console.log("error uploading::", err));
  };

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
      <div style={{display: "flex", justifyContent: "center"}}>
        <form onSubmit={signupUser} style={{width: "600px"}} encType="multipart/form-data">
          <div className="m-3" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
            <label htmlFor="username" className="form-label" style={{marginRight: "10px"}}>Username:</label>
            <input placeholder="Instahacker1" id="username" className="form-control input-sm shadow" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="m-3" style={{display: "flex", flexDirection: "row", alignItems: "center"}}> 
            <label htmlFor="password" className="form-label" style={{marginRight: "10px"}}>Password:</label>
            <input placeholder="********" type="password" className="form-control shadow" id="password" onChange={e => setPassword(e.target.value)} value={password}/>
          </div>
            <div id="emailHelp" className="form-text">Please choose a password with at least 8 characters.</div>
          <div className="m-3" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "spaceBetween"}}>
            <label htmlFor="firstName" className="form-label" style={{marginRight: "10px"}}>First Name:</label>
            <input placeholder="Insta" className="form-control shadow" id="firstName" onChange={e => setFirstName(e.target.value)} value={firstName}/>
          </div>
          <div className="m-3" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <label htmlFor="lastName" className="form-label" style={{marginRight: "10px"}}>Last Name:</label>
            <input placeholder="Hacker" className="form-control shadow" id="lastName" onChange={e => setLastName(e.target.value)} value={lastName}/>
          </div>
          <div className="m-3" style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <label htmlFor="image" className="form-label" style={{marginRight: "10px"}}>Profile Photo:</label>
            <input name="image" type="file" onChange={handleFileUpload} />
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
          <button type="submit" className="btn btn-primary" style={{marginTop: "50px"}}>Create Account</button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Signup;
