import React from 'react'
import { get } from '../http/service'

function Profile() {
  const getPosts = () => {
    get("/post/profile")
    .then(foundUser => {
      console.log("FOUND USER::", foundUser.data)
    })
    .catch(err => console.log(err))
  }

  return (
    <div>
      <button onClick={getPosts}>Get posts</button>
    </div>
  )
}

export default Profile;