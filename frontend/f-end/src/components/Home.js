import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {


  return (
    <div>
      <nav className="navbar nav-pills bg-secondary p-2">
        <ul className="nav justify-content-end">
          <li className="m-3">
            <Link className="text-white text-decoration-none" to="/auth/signup">Create an account</Link>
          </li>
          <li className="m-3">
            <Link className="text-white text-decoration-none" to="/auth/login">Login</Link>
          </li>
        </ul>
      </nav>
      <div>
        This nook of the social media world is dedicated to coders. Create an account and post your thoughts, read other coder's thoughts, and comment your thoughts about their thoughts. No need to keep things DRY here, leave that for your code and post as much as you like, run wild with repetition, post about current events or fiction, oh, and thoughts.
      </div>
    </div>
  )
}


export default Home;