import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SideBar from './components/SideBar/index.tsx';
import Header from './components/Header/index.tsx';

import Availability from './pages/Availability/index.tsx';
import Games from './pages/Games/index.tsx';

import './App.css'


function App() {
  return (
    <div className='application_container'>
      <Router>
        <SideBar />
        
        <div className='main_section_container'>
          <Header />
          <Routes>
            <Route path="/" element={null} />
            <Route path="/teams" element={null} />
            <Route path="/games" element={<Games />} />
            <Route path="/availability" element={<Availability />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
