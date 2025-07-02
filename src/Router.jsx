import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute';
import AdministratorPage from './pages/Administrator/AdministratorPage/AdministratorPage';
import MainPage from './pages/MainPage/MainPage';
import Login from './components/LoginRegister/Login';
import Register from './components/LoginRegister/Register';
import GamePage from './pages/GamePage/GamePage';
import RoomPage from './pages/RoomPage/RoomPage';
import RulesPage from './pages/Documentation/RulesPage/RulesPage';
import AboutUsPage from './pages/AboutUsPage/AboutUsPage';
import GuidePage from './pages/Documentation/GuidePage/GuidePage';
import { useContext } from 'react';
import { PathsContext } from './App';
import AdministratorLogin from './pages/Administrator/AdministratorLogin/AdministratorLogin';

function Router(){

  const {
    adminPanel,
    adminLogin,
    mainPagePath,
    loginPath,
    registerPath,
    gamePath,
    roomPath,
    rulesPath,
    guidePath,
    aboutUsPath,
  } = useContext(PathsContext);

  return (
    <Routes>
      {/* Ruta de las vistas */}
      <Route path={adminPanel}    element={ <PrivateRoute component={<AdministratorPage />} /> }    />
      <Route path={adminLogin}    element={ <AdministratorLogin /> }    />
      <Route path={mainPagePath}  element={ <MainPage /> }    />
      <Route path={loginPath}     element={ <Login /> }       />
      <Route path={registerPath}  element={ <Register /> }    />
      <Route path={gamePath}      element={ <GamePage /> }    />
      <Route path={roomPath}      element={ <RoomPage /> }    />
      <Route path={rulesPath}     element={ <RulesPage /> }   />
      <Route path={guidePath}     element={ <GuidePage /> }   />
      <Route path={aboutUsPath}   element={ <AboutUsPage /> } />
    </Routes>
  )
}

export default Router;