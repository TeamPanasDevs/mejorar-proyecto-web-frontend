import { createContext, useContext, useEffect } from "react";
import socket from '../services/WebSocketManager';

/* createContext y useContext.
   Componente padre con datos que deben ser usados por muchos componentes hijos o incluso
   nietos, pasar props se vuelve insostenible. A eso se le llama prop drilling.
   Aquí entra el context API, que permite crear un "canal global" donde se pueden compartir 
   datos entre componentes sin necesidad de pasar props manualmente a través de cada nivel 
   del árbol de componentes, pudiendo acceder a ellos directamente desde cualquier parte del 
   árbol de componentes. */

/* useEffect.
   React no tiene ciclos de vida como una clase en componentes funcionales. useEffect existe 
   para cubrir ese vacio. Permite ejecutar efectos secundarios: operaciones que ocurren fuera 
   del flujo de renderizado normal, como: llamados a APIs, suscripciones a sockets o eventos, 
   manipulación directa del DOM (como hacer animaciones) y guardar cosas en localStorage, etc. 
   
   useEffect(() => {
    console.log(`El usuario cambió: ${user.name}`);
   }, [user]);

   En el arreglo van todas las dependencias que el efecto necesita. Si el arreglo está vacío, 
   el efecto se ejecuta una sola vez al montar el componente, y si no hay arreglo, el efecto 
   se ejecuta en cada renderizado del componente. Generalmente, en el arreglo se colocan 
   variables que forman parte del flujo reactivo, como props o estados. */

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  // Solos nos conectamos una vez montado el componente.
  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      { children }
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);