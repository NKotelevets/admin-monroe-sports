import SideBar from './components/SideBar/index.tsx';
import Header from './components/Header/index.tsx';

import './App.css'

function App() {
  return (
    <div className='application_container'>
      <SideBar />
      <div className='main_section_container'>
        <Header />
      </div>
    </div>
  )
}

export default App
