import { useNavigate } from 'react-router-dom';

class WebSocketService {
  constructor() {
      this.socket = null;
      this.listeners = {};
      this.reconnectAttempts = 0;
  }

  connect(url) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          console.log("WebSocket already connected.");
          return;
      }

      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
          console.log("WebSocket connected");
          this.reconnectAttempts = 0; // Reset reconnection attempts
      };

      this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
      };

      this.socket.onmessage = (event) => {
          try {
              console.log('Message received (Raw data):', event.data);
              const { type, payload } = JSON.parse(event.data);
              console.log('Message received:', type, payload);
              if (this.listeners[type]) {
                  this.listeners[type].forEach((callback) => callback(payload));
              }

              if (type === 'startgame_ack') {
                // Primero, intentamos parsear el JSON para ver qué contiene
                const parsedData = JSON.parse(event.data);
                console.log('Parsed message data:', parsedData);

                // Ahora intentamos desestructurar con cuidado
                const { type, message, gameId, initiator } = parsedData;
                
                // Verificamos si las propiedades existen
                console.log('type:', type);
                console.log('message:', message);
                console.log('gameId:', gameId);
                console.log('initiator:', initiator);

                if (gameId) {
                    // Crear el fondo semitransparente
                    const overlay = document.createElement('div');
                    overlay.style.position = 'fixed';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Blanco con opacidad
                    overlay.style.zIndex = '999'; // Asegura que esté por encima de otros elementos
            
                    // Crear el mensaje de carga
                    const loadingMessage = document.createElement('div');
                    loadingMessage.textContent = 'Cargando partida...';
                    loadingMessage.style.position = 'fixed';
                    loadingMessage.style.top = '50%';
                    loadingMessage.style.left = '50%';
                    loadingMessage.style.transform = 'translate(-50%, -50%)';
                    loadingMessage.style.fontSize = '3rem';
                    loadingMessage.style.fontWeight = 'bold';
                    loadingMessage.style.color = '#333'; // Color del texto (oscuro)
                    loadingMessage.style.backgroundColor = '#fff'; // Fondo blanco para el cuadro
                    loadingMessage.style.padding = '20px';
                    loadingMessage.style.borderRadius = '10px'; // Bordes redondeados
                    loadingMessage.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Sombra suave
                    loadingMessage.style.zIndex = '1000'; // Asegura que el mensaje esté encima del fondo
            
                    // Agregar el fondo y el mensaje a la pantalla
                    document.body.appendChild(overlay);
                    document.body.appendChild(loadingMessage);
            
                    // Agregar un retraso de 3 segundos antes de redirigir
                    setTimeout(() => {
                        // Eliminar el mensaje de carga y el fondo
                        document.body.removeChild(loadingMessage);
                        document.body.removeChild(overlay);
                        
                        // Redirigir al juego
                        window.location.href = `/games/${gameId}`;
                    }, 3000); // 3000 milisegundos = 3 segundos
                }

              }

          } catch (error) {
              console.error("Error parsing WebSocket message:", error);
          }
      };

      this.socket.onclose = (event) => {
          console.log("WebSocket closed", event);
          if (!event.wasClean && this.reconnectAttempts < 5) {
              console.log("Reconnecting in 1 second...");
              setTimeout(() => this.connect(url), 1000);
              this.reconnectAttempts += 1; // Limit reconnect attempts to avoid infinite loops
          }
      };
  }

  send(type, payload) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify({ type, payload }));
      } else {
          console.error("WebSocket is not open. Message not sent.");
      }
  }

  addListener(type, callback) {
    console.log('Adding listener for type:', type);
      if (!this.listeners[type]) {
          this.listeners[type] = [];
      }
      this.listeners[type].push(callback);
  }

  removeListener(type, callback) {
      if (this.listeners[type]) {
          this.listeners[type] = this.listeners[type].filter((cb) => cb !== callback);
      }
  }

  disconnect() {
      if (this.socket) {
          this.socket.close();
          this.socket = null;
      }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
