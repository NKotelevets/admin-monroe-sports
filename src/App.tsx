import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { routesConstant } from "./constants/appRoutesConstants.ts";

import SideBar from "./components/SideBar/index.tsx";
import Header from "./components/Header/index.tsx";

import Availability from "./pages/Availability/index.tsx";
import Games from "./pages/Games/index.tsx";
import Roles from "./pages/Roles/index.tsx";

import "./App.css";

function App() {
  return (
    <div className="application_container">
      <Router>
        <SideBar />

        <div className="main_section_container">
          <Header />
          <Routes>
            <Route path={routesConstant.rootPage} element={null} />
            <Route path={routesConstant.team} element={null} />
            <Route path={routesConstant.game} element={<Games />} />
            <Route
              path={routesConstant.availability}
              element={<Availability />}
            />
            <Route path={routesConstant.role} element={<Roles />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
