import React, { createContext, useState, useEffect } from "react";
import './App.css'
import Navbar from './components/navbar/Navbar'
import Router from './Router'
import AuthProvider from '../auth/AuthProvider'
import webSocketService from './services/WebSocketService'; // Asegúrate de importar tu WebSocketService
import { WebSocketProvider } from "./hooks/WebSocketContext";

export const SessionContext = createContext(null);
export const PathsContext = createContext(null);
export const DisplayNavContext = createContext(null);

const adminPanel = '/akingdrez/administrator'
const adminLogin = '/akingdrez/administrator/login'
const aboutUsPath = '/nosotros';
const rulesPath = '/rules';
const guidePath = '/guide';
const mainPagePath = '/';
const loginPath = '/login';
const registerPath = '/register';
const gamePath = '/games/:id';
const roomPath = '/rooms/:id';
// const backendURL = 'https://www.stoncks.me';
const backendURL = 'http://localhost:3000';

function App() {
  const [userConnected, setUserConnected] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [displayNavbar, setDisplayNavbar] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token en useEffect:", token);
    
    if (token !== null && typeof token === 'string' && token.trim() !== '' && token !== "null") {
      setUserConnected(true);
      console.log("Usuario conectado");
    } else {
      setUserConnected(false); 
      console.log("Usuario no conectado");
    }
  }, []);
  
  // Nueva lógica para conectar WebSocket
  useEffect(() => {
    const backendWebSocketURL = "ws://localhost:3000";
    // const backendWebSocketURL = "wss://y-backend-24-2.onrender.com";
    // const backendWebSocketURL = `wss://www.stoncks.me`;
    
    if (!webSocketService.socket || webSocketService.socket.readyState === WebSocket.CLOSED) {
      webSocketService.connect(backendWebSocketURL);
    }
  
    return () => {
      if (webSocketService.socket && webSocketService.socket.readyState !== WebSocket.CLOSED) {
        webSocketService.disconnect();
      }
    };
  }, []);

  const openRegisterModal = () => {
    setRegisterOpen(true);
    setLoginOpen(false); 
  };

  const closeRegisterModal = () => setRegisterOpen(false);

  const openLoginModal = () => {
    setLoginOpen(true);
    setRegisterOpen(false); 
  };

  const closeLoginModal = () => setLoginOpen(false);

  return (
    <AuthProvider>
      <SessionContext.Provider value={{ userConnected, setUserConnected, isRegisterOpen, openRegisterModal, closeRegisterModal, isLoginOpen, openLoginModal, closeLoginModal }}>
        <PathsContext.Provider value={{ 
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
          backendURL
        }}>
          <DisplayNavContext.Provider value={{ displayNavbar, setDisplayNavbar }}>
            <>
              <Navbar />
              <WebSocketProvider>
                <Router />
              </WebSocketProvider>
            </>
          </DisplayNavContext.Provider>
        </PathsContext.Provider>
      </SessionContext.Provider>
    </AuthProvider>
  );
}

export default App;