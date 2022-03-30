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
        <div className="card bg-light border text-center" style={{display: "flex", flexDirection: "column"}}>
        <div className="card-img-overlay">
            {/* <h3 className="card-title">About</h3> */}
            <h4 style={{fontWeight: "bold"}}>This nook of the social media world is dedicated to coders. </h4>
            <h5 className="card-text text-center mt-0 mx-5" style={{paddingLeft: "50px", paddingRight: "50px"}}>Create an account and post your thoughts, read other coder's thoughts, and comment your thoughts about their thoughts. No need to keep things DRY here, leave that for your code and post as much as you like, run wild with repetition, post about current events or fiction, oh, and thoughts.</h5>
          </div>
          <img src="https://media.istockphoto.com/vectors/happy-clients-giving-positive-feedback-to-product-quality-vector-id1250666724?k=20&m=1250666724&s=612x612&w=0&h=8OA4X0GxasHOl08QMa31odKbsTX3HlAtiN1j8YuYuEg=" className="card-img mt-5" style={{marginTop: "100px", marginLeft: "50px", width: "85%"}}/>
          
        </div>
      </div>
    </div>
  )
}


export default Home;