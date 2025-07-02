import React, { useContext, useState } from "react";
import gameLogo from '../../../assets/Logo.jpg';
import './Navbar.css'
import RegisterModal from "../LoginRegister/Register";
import LoginModal from "../LoginRegister/Login";
import { DisplayNavContext, PathsContext, SessionContext } from "../../App";
import { AuthContext } from "../../../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {
  const {
    userConnected,
    setUserConnected,
    isRegisterOpen,
    openRegisterModal,
    closeRegisterModal,
    isLoginOpen,
    openLoginModal,
    closeLoginModal
  } = useContext(SessionContext)
  const {
    displayNavbar
  } = useContext(DisplayNavContext);

  const {
    mainPagePath,
    aboutUsPath,
    rulesPath,
    guidePath,
  } = useContext(PathsContext);

  const navigate = useNavigate();

  const [showMenuContent, setShowMenuContent] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const {logout} = useContext(AuthContext);
  const [msg, setMsg] = useState("");

  function toggleMenu() {
    if (!showMenuContent) setSelectedClass('selected');
    else setSelectedClass(null);
    setShowMenuContent(!showMenuContent);
  }

  const handleLogout = () => {
    logout();
    setUserConnected(false);

    localStorage.removeItem("player_id");
    localStorage.removeItem("admin_id");

    setMsg("Has hecho logout con éxito");
    navigate(mainPagePath);
  }

  return (
    displayNavbar ? (
      <nav className="navbar">

        <Link to={mainPagePath} className="logo">
          <img className="icon" src={gameLogo} />
          <p className="title">AKingDrez</p>
        </Link>

          <ul className="links">
            <li className="link-item"><Link to={aboutUsPath} className="page-link">Nosotros</Link></li>
            <li className="link-item dropdown">
              <a className="page-link">Documentación</a>
              <div className="dropdown_content">
                <Link to={rulesPath} className="page-link">Reglas</Link>
                <Link to={guidePath} className="page-link">Guia</Link>
              </div>
            </li>
            <li className="link-item"><Link to={mainPagePath} className="page-link">Página principal</Link></li>
            { !userConnected ? (
              <>
                <li className="link-item"><button onClick={openRegisterModal} className="page-link">Registrarse</button></li>
                <li className="link-item"><button onClick={openLoginModal} className="page-link">Iniciar sesión</button></li>
              </>
              ) : 
              <>
                <li className="link-item"><button onClick={handleLogout} className="page-link">Desconectarse</button></li>
              </>
            }
          </ul>
          
          {/* Menu button for tablets and mobiles */}
          <div className="dropdown_menu">
            {showMenuContent ? (
              <div className="dropdown_menu_content">
                <Link to={aboutUsPath} className="page-link">Nosotros</Link>
                <Link to={rulesPath} className="page-link">Reglas</Link>
                <Link to={guidePath} className="page-link">Guia</Link>
                <Link to={mainPagePath} className="page-link">Página principal</Link>
                { !userConnected ? (
                  <>
                    <button onClick={openRegisterModal} className="page-link">Registrarse</button>
                    <button onClick={openLoginModal} className="page-link">Iniciar sesión</button>
                  </>
                  ) : 
                  <>
                    <a onClick={handleLogout} className="page-link">Desconectarse</a>
                  </>
                }
              </div>
            ) : null}
            <button className={`menu_button ${selectedClass}`} onClick={toggleMenu}></button>
          </div>


        <div>
          <RegisterModal 
            isOpen={isRegisterOpen} 
            closeModal={closeRegisterModal} 
            openLoginModal={openLoginModal} 
          />
          <LoginModal 
            isOpen={isLoginOpen} 
            closeModal={closeLoginModal} 
            openRegisterModal={openRegisterModal} 
          />
        </div>

      </nav>
    ) : null
  );
}

export default Navbar;