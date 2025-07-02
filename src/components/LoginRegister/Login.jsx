import './LoginRegister.css';
import { FaUser, FaLock } from "react-icons/fa";
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { PathsContext, SessionContext } from "../../App";
import { AuthContext } from '../../../auth/AuthContext';

const LoginModal = ({ isOpen, closeModal, openRegisterModal }) => {
  const {
    mainPagePath,
    backendURL
  } = useContext(PathsContext);

  const {token, setToken} = useContext(AuthContext);
  const { setUserConnected } = useContext(SessionContext);

  if (!isOpen) return null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMSG] = useState("");    

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Apretaste el form");

    try {
      const response = await axios.post(`${backendURL}/login`, {
        email,
        password
      });
      
      // Si el login fue exitoso
      if (response.status === 200) {
        setUserConnected(true);   // Cambiamos userConnected a true en el contexto
        closeModal();             // Cerramos el modal de login
        window.location.href = mainPagePath; // Redirigimos a /mainpage

        console.log("bloque then")
        setError(false);
        setMSG("Logueaste correctamente")

        const access_token = response.data.access_token
        setToken(access_token);

        const player_id = response.data.player_id; // Obtener el player_id de la respuesta
        localStorage.setItem("player_id", player_id); // Guarda player_id en localStorage
      }

      console.log(response)

    } catch (error) {
      console.log("Error al iniciar sesión:", error);
    }
  }

  return (
    <div className="modal-overlay">
      <section className="wrapper" id="login">
        <button className="close-button" onClick={closeModal}>X</button>
        <article className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <fieldset className="input-box">
              <input
                type="email"
                name='email'
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <FaUser className="icon" />
            </fieldset>

            <fieldset className="input-box">
              <input
                type="password"
                name='password'
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <FaLock className="icon" />
            </fieldset>

            <button type="submit">Login</button>

            <footer className="register-link">
              <p>Don't have an account? 
                <a onClick={openRegisterModal}>Register</a>
              </p>
            </footer>
          </form>
        </article>
      </section>
    </div>
  );
};

export default LoginModal;
