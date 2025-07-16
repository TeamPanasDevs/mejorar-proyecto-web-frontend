import React, { useContext, useState } from "react";
import gameLogo from '../../../assets/Logo.jpg';
import './Navbar.css'
import RegisterModal from "../LoginRegister/Register";
import LoginModal from "../LoginRegister/Login";
import { DisplayNavContext, PathsContext, SessionContext } from "../../App";
import { AuthContext } from "../../../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";



const Navbar = ({ effect }) => {
  return (
    <nav className={`${effect}-nav`}>

      {/* Logo */}
      <div className="logoContainer">
        <img className="logoImage" />
        <p className="gameTitle">AKingDrez</p>
      </div>

      {/* Central Button */}
      <div className="buttonsContainer">
        <Link className="styleHover" to={'/rooms'}>Salas</Link>
        <Link className="styleHover" to={'/docs/rules'}>¿Cómo Jugar?</Link>
      </div>

      {/* User */}
      <div className="userContainer">
        <p className="userName">Usuario</p>
        <LuUserRound />
      </div>

    </nav>
  )
}

export default Navbar;