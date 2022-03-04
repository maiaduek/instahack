import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {


  return (
    <div>
      <Link to="/auth/signup">Create an account</Link>
      <Link to="/auth/login">Login</Link>
    </div>
  )
}


export default Home;