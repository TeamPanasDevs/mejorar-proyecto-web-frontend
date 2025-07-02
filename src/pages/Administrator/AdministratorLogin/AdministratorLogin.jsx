import React, { useContext, useEffect, useState } from "react";
import { PathsContext, SessionContext } from "../../../App";
import axios from "axios";
import { AuthContext } from "../../../../auth/AuthContext";
import '../AdministratorStyle.css'


const AdministratorLogin = () => {
  const {
    adminPanel,
    backendURL
  } = useContext(PathsContext);
  const { setUserConnected } = useContext(SessionContext);
  const {
    token, 
    setToken,
    logout
  } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Cerrar sesión al entrar al login
  useEffect(() => {
    logout();
    localStorage.removeItem("player_id");
    localStorage.removeItem("admin_id");
    setUserConnected(false);
  }, [])

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Apretaste el form");

    const button = document.getElementById('submit_button');
    button.disabled = true;

    try {
      const response = await axios.post(`${backendURL}/administrators/login`, {
        email,
        password
      });
      
      // Si el login fue exitoso
      if (response.status === 200) {
        setUserConnected(true);   // Cambiamos userConnected a true en el contexto
        
        console.log("bloque then")
        
        const access_token = response.data.access_token
        setToken(access_token);
        
        const admin_id = response.data.admin_id; // Obtener el player_id de la respuesta
        localStorage.setItem("admin_id", admin_id); // Guarda player_id en localStorage
        window.location.href = adminPanel; // Redirigimos a panel
      }
      else {
        button.disabled = false;
      }

      console.log(response)

    } catch (error) {
      console.log("Error al iniciar sesión:", error);
      button.disabled = false;
    }
  }

  return (
    <article className="vertical_container">
      <h1>Bienvenido Administrator</h1>
      <p>Por favor ingrese sus credenciales</p>

      <form className="vertical_container" onSubmit={handleSubmit}>
        <fieldset className="field">
          <input
            type="email"
            name='email'
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </fieldset>

        <fieldset className="field">
          <input
            type="password"
            name='password'
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </fieldset>

        <button id="submit_button" type="submit">Login</button>
      </form>
    </article>
  )
}

export default AdministratorLogin;