import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { get, post } from '../http/service';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    get('/auth/loggedin')
    .then(results => {
      setId(results.data._id)
    })
    .catch(err => console.log(err))
  }, [])

  const submitNewPassword = (e) => {
    e.preventDefault();
    post('/auth/change-password', {
      oldPassword,
      newPassword
    })
    .then(results => {
      console.log("IN THEN, RESULTS", results)
      navigate(`/profile/${id}`)
    })
    .catch(err => {
      console.log("ERROR::", err.message)
      setError(err.response.data.errorMessage)
    })
  }

  return (
    <div>
      <nav className="navbar nav-pills bg-primary p-2 justify-content-end d-flex justify-content-between">
        <h1 className="text-white ms-3">InstaHack</h1>
        <ul className="nav">
          <li className="m-3">
          <Link to={`/profile/${id}`} className="btn btn-primary">Back to Profile</Link>
          </li>
        </ul>
      </nav>
      <h2 className="text-primary m-4 d-flex justify-content-start">Change your Password:</h2>
      <div className="m-3"> 
        <label htmlFor="oldPassword" className="form-label">Old Password:</label>
        <input placeholder="********" type="password" className="form-control" id="oldPassword" onChange={e => setOldPassword(e.target.value)} value={oldPassword}/>
      </div>
      <div className="m-3"> 
        <label htmlFor="newPassword" className="form-label">New Password:</label>
        <input placeholder="********" type="password" className="form-control" id="newPassword" onChange={e => setNewPassword(e.target.value)} value={newPassword}/>
        <div id="emailHelp" className="form-text">Please choose a password with at least 8 characters.</div>
      </div>
        <button type="submit" className="btn btn-primary">Save</button>
      {error && <p>{error}</p>}
    </div>
  )
}

export default ChangePassword
