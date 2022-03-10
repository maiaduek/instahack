import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
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
      <form onSubmit={submitNewPassword}>
        <input placeholder="Old password" onChange={(e) => setOldPassword(e.target.value)}/>
        <input placeholder="New password" onChange={(e) => setNewPassword(e.target.value)}/>
        <button type="submit">Save</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  )
}

export default ChangePassword
