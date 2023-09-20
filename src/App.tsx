import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { routesConstant } from "./constants/appRoutesConstants.ts";

// admin panel flow
import SideBar from "./components/SideBar/index.tsx";
import Header from "./components/Header/index.tsx";

import Availability from "./pages/Availability/index.tsx";
import Games from "./pages/Games/index.tsx";
import Roles from "./pages/Roles/index.tsx";

// mobile flow
import SignIn from "./pages/SignIn/index.tsx";
import Welcome from "./pages/Welcome/index.tsx";
import SignUp from "./pages/SignUp/index.tsx";
import GetStarted from "./pages/GetStarted/index.tsx";
import JoinTeam from "./pages/JoinTeam/index.tsx";
import Success from "./pages/Success/index.tsx";

import "./App.css";
import MobileLogo from "./assets/svg/MobileLogo.tsx";
import { useAppSelector } from "./hooks/redux.ts";
import { getIsAuthUserSelector } from "./store/reducers/users.ts";

function App() {
  const isSignInFlow = false;

  const isAuth = useAppSelector(getIsAuthUserSelector);

  return (
    <div className={`application_container ${!isAuth ? "mobile" : ""}`}>
      {isSignInFlow ? (
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
      ) : (
        <div className="signup_flow_container">
          <div className="signup_flow_logo">
            <MobileLogo />
          </div>

          <Router>
            <Routes>
              <Route path={routesConstant.signIn} element={<SignIn />} />

              {!isAuth ? (
                <Route
                  path="/"
                  element={<Navigate to={routesConstant.signIn} />}
                />
              ) : (
                <>
                  <Route path={routesConstant.signUp} element={<SignUp />} />
                  <Route path={routesConstant.welcome} element={<Welcome />} />
                  <Route
                    path={routesConstant.started}
                    element={<GetStarted />}
                  />
                  <Route
                    path={routesConstant.joinTeam}
                    element={<JoinTeam />}
                  />
                  <Route path={routesConstant.success} element={<Success />} />
                </>
              )}
            </Routes>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
