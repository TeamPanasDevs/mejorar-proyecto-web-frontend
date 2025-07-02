import React, { useContext, useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { AuthContext } from '../../../auth/AuthContext';
import { PathsContext, SessionContext } from "../../App"; 
import axios from 'axios';

const RegisterModal = ({ isOpen, closeModal, openLoginModal }) => {
  const {
    mainPagePath,
    backendURL
  } = useContext(PathsContext);

  const { setToken } = useContext(AuthContext);
  const { setUserConnected } = useContext(SessionContext);

  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setMSG] = useState("");

  if (!isOpen) return null; // No renderiza el modal si no está abierto

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Registro del nuevo usuario
      const registerResponse = await axios.post(`${backendURL}/signup`, {
        username,
        description,
        email,
        password
      });

      if (registerResponse.status === 201) {
        const player_id = registerResponse.data.player_id; // Obtener el player_id de la respuesta
        localStorage.setItem("player_id", player_id); // Guarda player_id en localStorage
        setMSG("Cuenta creada exitosamente. Iniciando sesión...");

        // Iniciar sesión automáticamente
        const loginResponse = await axios.post(`${backendURL}/login`, {
          email,
          password
        });

        // Manejo de respuesta de inicio de sesión exitoso
        if (loginResponse.status === 200) {
          const access_token = loginResponse.data.access_token;
          setToken(access_token); // Guarda el token en el contexto
          localStorage.setItem("token", access_token); // Guarda el token en localStorage
          setUserConnected(true); // Cambia el estado a conectado
          closeModal(); // Cierra el modal de registro
          window.location.href = mainPagePath; // Redirige a la página principal
        }
      }

    } catch (error) {
      console.error("Error al registrarse:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Error en el registro. Verifica los datos e intenta nuevamente.");
      } else {
        setError("Error en el registro. Verifica los datos e intenta nuevamente.");
      }
    }
  }

  return (
    <div className="modal-overlay">
      <section className="wrapper" id="register">
        <button className="close-button" onClick={closeModal}>X</button>
        <article className="form-box register">
          <form onSubmit={handleSubmit}>
            <h1>Registration</h1>
            
            <fieldset className="input-box">
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
              <FaUser className="icon" />
            </fieldset>

            <fieldset className="input-box">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <FaEnvelope className="icon" />
            </fieldset>

            <fieldset className="input-box">
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              <FaLock className="icon" />
            </fieldset>

            <section className="remember-forgot">
              <label>
                <input type="checkbox" required />
                I agree to the terms and conditions
              </label>
            </section>

            <button type="submit">Register</button>

            <footer className="register-link">
              <p>Already have an account? 
                <a onClick={openLoginModal}>Login</a>
              </p>
            </footer>
          </form>
          {error && <p className="error-message">{error}</p>} {/* Muestra el mensaje de error si existe */}
          {msg && <p className="success-message">{msg}</p>} {/* Muestra el mensaje de éxito si existe */}
        </article>
      </section>
    </div>
  );
};

export default RegisterModal;
