import './App.css';
import {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import EditInfo from './components/EditInfo';
import CreatePost from './components/CreatePost';
import ChangePassword from './components/ChangePassword';
import PostDetails from './components/PostDetails';

function App() {
  const [user, setUser] = useState('')
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login user={user} setUser={setUser} />} />
        <Route path="/profile/:userId" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/auth/edit-info" element={<EditInfo user={user} setUser={setUser}/>} />
        <Route path="/post/create-post" element={<CreatePost />} />
        <Route path="/auth/change-password" element={<ChangePassword />} />
        <Route path="/post/:postId" element={<PostDetails />} />
      </Routes>
    </div>
  );
}

export default App;
