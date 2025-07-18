const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;


/* Patrón Singleton, para evitar múltiples instanciaciones
   y de esta forma mantener una buena práctica. */
class WebSocketManager {
	constructor() {
		this.url = `${WEBSOCKET_URL}`;
		this.socket = null;
		this.listeners = {};
		this.reconnectAttempts = 0;
	}

	connect() {
		
		/* Evita la connexión si ya está abierta. Esto 
		   previene múltiples conexiones WebSocket, pero 
		   no el reinstanciamiento del WebSocketManager. */
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			console.log("WebSocketManager ya está conectado:", this.url);
			return;
		}

		// Creamos la conexión WebSocket.
		this.socket = new WebSocket(this.url);

		// Abrimos la conexión.
		this.socket.onopen = () => {
			console.log("WebSocketManager conectado:", this.url);
			this.reconnectAttempts = 0;
		};

		// Escuchamos los mensajes entrantes.
		this.socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			const { type, payload } = message;
			(this.listeners[type] || []).forEach((cb) => cb(payload));
		};

		// Manejamos el cierre de la conexión.
		this.socket.onclose = () => {
			console.log("WebSocketManager cerrado:", this.url);
			this.socket = null;
		};
	}

	// Enviamos mensajes a través del WebSocket.
	send(type, payload) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify({ type, payload }));
		} else {
			console.warn("WebSocketManager no está abierto. No se puede enviar el mensaje:", type, payload);
		}
	}

	// Registra funciones de callback para tipos específicos de mensajes.
	on(type, callback) {
		this.listeners[type] = this.listeners[type] || [];
		this.listeners[type].push(callback);
	}

	// Elimina funciones de callback para tipos específicos de mensajes.
	off(type, callback) {
		this.listeners[type] = (this.listeners[type] || []).filter(cb => cb !== callback);
	}
}

const socketInstance = new WebSocketManager();
export default socketInstance;