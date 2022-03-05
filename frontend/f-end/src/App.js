import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import EditInfo from './components/EditInfo';

function App() {
  const [user, setUser] = useState('')

  return (
    <div className="App">
      <h1>APPJS</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/login" element={<Login user={user} setUser={setUser} />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/edit-info" element={<EditInfo user={user} setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;
