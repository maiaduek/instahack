import './App.css';
import { Route, Routes } from 'ract-router-dom'
import Home from './components/Home'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  )
}

export default App;
