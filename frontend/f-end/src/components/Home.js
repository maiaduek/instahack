import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {


  return (
    <div>
      <nav className="navbar nav-pills bg-primary p-2 justify-content-end d-flex justify-content-between">
        <h1 className="text-white ms-3">InstaHack</h1>
        <ul className="nav">
          <li className="m-3">
            <Link className="text-white text-decoration-none" to="/auth/signup">Create an account</Link>
          </li>
          <li className="m-3">
            <Link className="text-white text-decoration-none" to="/auth/login">Login</Link>
          </li>
        </ul>
      </nav>
      <div className="row">
        <div className="card bg-light border text-center">
          <img src="https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX6005989.jpg" className="card-img" />
          <div className="card-img-overlay">
            {/* <h3 className="card-title">About</h3> */}
            <h5 className="card-text text-center mt-5 pt-5">This nook of the social media world is dedicated to coders. Create an account and post your thoughts, read other coder's thoughts, and comment your thoughts about their thoughts. No need to keep things DRY here, leave that for your code and post as much as you like, run wild with repetition, post about current events or fiction, oh, and thoughts.</h5>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Home;