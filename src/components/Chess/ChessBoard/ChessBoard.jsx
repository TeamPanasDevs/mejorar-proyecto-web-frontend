import { playSelectionSound, playCaptureSound } from '../../../utils/soundPieces';
import { messageAlertAndMovement } from './utilsAlerts';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useAsyncError, useNavigate } from "react-router-dom";
import CombatModal from '../ChessCombatModal/ChessCombatModal';
import ChessSquare from '../ChessSquare/ChessSquare';
import Piece from '../ChessPiece/ChessPiece';
import GameEndModal from '../ChessFinishModal/ChessFinishModal';
import initialLocations from '../../../data/initialLocations.json';
import './ChessBoard.css';
import axios from 'axios';
import { PathsContext } from '../../../App';
import { useParams } from 'react-router-dom';
import webSocketService from '../../../services/WebSocketService';


const ChessBoard = () => {

  /* 
  * UTILIDAD BACKEND
  */

  const {
    mainPagePath,
    backendURL
  } = useContext(PathsContext);

  const { id } = useParams();

  const token = localStorage.getItem('token');
  const request_config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const current_player_id = localStorage.getItem('player_id');

  /*
  * ESTADOS
  */
 
 // Estado para almacenar atributos temporales de las piezas.
 const [pieces, setPieces] = useState(() => {    
   const piecesAtribute = {
     "pawn":   { hp: 15,  attack: 5,  defense: 5,  specialAbility: true, type: "Peón" },
     "knight": { hp: 50,  attack: 25, defense: 30, specialAbility: true, type: "Caballo" },
     "rook":   { hp: 100, attack: 5,  defense: 80, specialAbility: true, type: "Torre" },
     "bishop": { hp: 30,  attack: 40, defense: 5,  specialAbility: true, type: "Alfíl" },
     "queen":  { hp: 80,  attack: 35, defense: 40, specialAbility: true, type: "Reina" },
     "king":   { hp: 70,  attack: 30, defense: 50, specialAbility: true, type: "Rey" }
   };
   return piecesAtribute;
 }) 
 const [player1ID, setPlayer1ID] = useState(null);
 const [player2ID, setPlayer2ID] = useState(null);

  // Estado para manejar las piezas en el tablero.
  const [board, setBoard] = useState(() => {
    const initialBoard = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    initialLocations.forEach(([color, piece, position]) => {
      const fullColor = color === 'w' ? 'white' : 'black';
      const colorShow = fullColor === 'white' ? 'blanco' : 'negro';
      const row = 8 - parseInt(position[1], 10);                  // Convertir fila al índice
      const col = position[0].charCodeAt(0) - 'a'.charCodeAt(0);  // Convertir columna al índice
      initialBoard[row][col] = { 
        colorShow: colorShow,
        color: fullColor,
        hp: pieces[piece].hp,
        attack: pieces[piece].attack,
        defense: pieces[piece].defense,
        typeShow: pieces[piece].type,
        type: piece,
        isWhite: () => fullColor === 'white',
        id: null,
        status_id: null,
      };

      /* Crear pieza en base de datos */
      async function initializePiece() {
        try {
          console.log("Checking for player");
          const session_response = await axios.get(`${backendURL}/sessions/${id}`, request_config);
          if (session_response.status === 200) {
            const room_response = await axios.get(`${backendURL}/rooms/${session_response.data.room_id}`, request_config);
            if (room_response.status === 200) {
              console.log("Room obtained");
              const room = room_response.data;
              setPlayer1ID(room.player1_id);
              setPlayer2ID(room.player2_id);
              if (current_player_id != room.player1_id) {
                console.log("Player not allowed to create pieces");
                return;
              }
            }
          }

          console.log("Creating pieces");
          // Ejecutar si jugador actual es player1
          axios.post(`${backendURL}/pieces`, {
            'session_id': id,
            'name': pieces[piece].type.replace('í', 'i').replace('ó', 'o'),
            'color': colorShow,
            'row': row,
            'column': col,
            'life': pieces[piece].hp,
            'atack': pieces[piece].attack,
            'defense': pieces[piece].defense,
            'atack_range': 1,  // Seteado de forma default por ahora. Por esto, no tiene utilidad
            'movement_range': 1 // Seteado de forma default por ahora. Por esto, no tiene utilidad
          }, request_config)
            .then( response => {
              if (response.status === 201) {
                initialBoard[row][col].id = response.data.id;
                console.log(`Pieza creada: ${JSON.stringify(response.data)}`);

                /* Crear estado de pieza en base de datos */
                axios.post(`${backendURL}/piecestatuses`, {
                  'piece_id': response.data.id,
                  'actual_life': response.data.life,
                  'actual_defense': response.data.defense,
                  'actual_atack': response.data.atack
                }, request_config)
                  .then( status_response => {
                    if (status_response.status === 201) {
                      console.log(`Estado de pieza creada: ${JSON.stringify(status_response.data)}`)
                      initialBoard[row][col].status_id = status_response.data.id;
                    }
                  })
                  .catch(error => {
                    console.log(error);
                  })
              }
            })
            .catch(error => {
              console.log(error);
            })
        }
        catch(error) {
          console.log(error);
        }
      }

      initializePiece();
    });
    
    return initialBoard;
  });

  useEffect(() => {
    if (board[0][0].id == null) {
      async function setDBPieces() {
        try {
          const response = await axios.get(`${backendURL}/sessions/${id}/pieces`, request_config);
          if (response.status === 200) {
            const pieces = response.data;
            console.log("piezas encontradas:", pieces);
            // Asignar datos por cada pieza
            pieces.forEach(async (piece) => {
              // Asignar id
              board[piece.row][piece.column].id = piece.id;
              // Obtener y asignar status
              const status_response = await axios.get(`${backendURL}/pieces/${piece.id}/status`, request_config);
              if (status_response.status === 200) {
                console.log("Status obtenido:", status_response.data);
                board[piece.row][piece.column].status_id = status_response.data.id;
              }
            });
          }
        }
        catch(error) {
          console.log(error);
        }
      }

      // async function setPlayers() {
      //   try {
      //     const response = await axios.get(`${backendURL}/sessions/${id}`, request_config);
      //     if (response.status === 200) {
      //       const room_response = await axios.get(`${backendURL}/rooms/${response.data.room_id}`, request_config);
      //       if (room_response === 200) {
      //         const room = room_response.data;
      //         setPlayer1ID(room.player1_id);
      //         setPlayer2ID(room.player2_id);
      //       }
      //     }
      //   }
      //   catch(error) {
      //     console.log(error);
      //   }
      // }
      
      // setPlayers();
      setDBPieces();
    }
  }, [])

  /* ESTADOS FLUJO DEL JUEGO. */
  const [combatModalVisible, setCombatModalVisible] = useState(false); // Estado para manejar el modal
  const [combatSummary, setCombatSummary] = useState(null);            // Estado para retroalimentación finalización partida
  const [gameOver, setGameOver] = useState(false);                     // Controla si el modal de retroalimentación está visible
  const [onCombatClose, setOnCombatClose] = useState(null);            // Estado para cerrar el modal
  const [attacker, setAttacker] = useState([null, null]);              // Estado para controlar el atacante
  const [defender, setDefender] = useState([null, null]);              // Estado para controlar el defensor
  const [highlightedSquares, setHighlightedSquares] = useState([]);    // Estado para manejar las casillas resaltadas
  const [selectedSquare, setSelectedSquare] = useState(null);          // Estado para la casilla seleccionada
  const [movements, setMovements] = useState(0);                       // Conteo de movimientos
  const [stageTurn, setStageTurn] = useState(0);                       // Etapa del turno
  const [validMoves, setValidMoves] = useState([]);                    // Casillas válidas para el movimiento
  const [message, setMessage] = useState(null);                        // Estado para el mensaje de alerta
  const [selectedPiece, setSelectedPiece] = useState(null);            // Variable de estado para guardar la pieza seleccionada

  /* ESTADOS DATA BACKEND */
  const [sessionData, setSessionData] = useState(null);  // Estado para manejar data de Sessión.


  /*
  * VARIABLES
  */

  // Lo usamos principalmente para dirigirnos a la MainPage.
  const navigate = useNavigate();

  // ...

  /*
  * FUNCIONES
  */

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500); // Borrar mensaje después de 2 segundos
  };

  // Si es turno de las blancas
  const isWhiteTurn= () => {
    return movements % 2 == 0 && current_player_id == player1ID;
  }

  // Si es turno de las negras
  const isBlackTurn = () => {
    return movements % 2 != 0 && current_player_id == player2ID;
  }

  // Saber si una casilla está vacía
  const isEmpty = (row, col) => {
    return !board[row][col];
  };

  // Obtener una pieza de una casilla
  const getPiece = (row, col) => {
    return board[row][col];
  };


  let combatModal = null;
  const startCombat = (attackerPiece, defenderPiece) => {
    return new Promise(async (resolve) => {
      const handleClose = async (winner) => {
        console.log(`${combatModal}`);
        try {
          console.log("CombatModal a eliminar:", combatModal);
          const response = await axios.delete(`${backendURL}/combats/${combatModal.id}`, request_config);
          if (response.status === 204) {
            console.log("Combate eliminado correctamente");
            // Notifica el fin del combate al backend
            console.log(`Notificando fin de combate al backend`);
            webSocketService.send('endCombat', {
              combatId: combatModal.id,
              winner,
            });
            
            combatModal = null;
          }
        }
        catch(error) {
          console.log("Error deleting combat modal", error);
        }

        setCombatModalVisible(false); // Cierra el modal
        console.log(`Ganador ${winner.type} ${winner.color}`)
        resolve(winner);              // Resuelve la promesa con el ganador
      };

      try {
        const response = await axios.post(`${backendURL}/combats`, {
          'session_id': id,
          'piece1_id': attackerPiece.id,
          'piece2_id': defenderPiece.id
        }, request_config);
        if (response.status === 201) {
          console.log("Combate creado:", response.data);
          console.log(`${combatModal}`);

          // Notifica el inicio del combate al backend
          console.log(`Notificando inicio de combate al backend`);
          webSocketService.send('startCombat', {
            combatId: response.data.id,
            attacker: attackerPiece,
            defender: defenderPiece,
          });

          combatModal = response.data;
          console.log("Combat modal:", combatModal);
        }
      }
      catch(error) {
        console.log("Error creating combat modal:", error);
      }

      setAttacker(attackerPiece);
      setDefender(defenderPiece);
      setCombatModalVisible(true);
      setOnCombatClose(() => handleClose);
    });
  };
  

  // Mover una pieza en el tablero
  // Mover una pieza en el tablero
  const movePiece = (fromRow, fromCol, toRow, toCol) => {
    async function updatePiecePosition() {
      try {
        const response = await axios.put(
          `${backendURL}/pieces/${board[fromRow][fromCol].id}`,
          {
            'row': toRow,
            'column': toCol,
          },
          request_config
        );
        if (response.status === 200) {
          console.log(`Pieza actualizada: ${JSON.stringify(response.data)}`);
          console.log(`Comenzando notificación al otro cliente: `)
          // Notificar a otros clientes del movimiento
          webSocketService.send('updateBoard', {
            fromRow,
            fromCol,
            toRow,
            toCol,
          });
        }
      } catch (error) {
        console.log('Error en movePiece haciendo el put de actualizar posicion de pieza')
        console.log(error);
      }
    }
  
    updatePiecePosition();
    
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]); // Copiar tablero
      newBoard[toRow][toCol] = newBoard[fromRow][fromCol]; // Mover pieza
      newBoard[fromRow][fromCol] = null; // Vaciar casilla de origen
      return newBoard;
    });
    console.log(`cambiando de turno`)
    // setMovements((prev) => prev + 1); // Incrementar turno
    
  };

  const getValidMoves = (piece, row, col) => {
    if (!piece) return [];
  
    const moves = [];
    const directions = {
      pawn: {
        white: [[-1, 0]], // Movimiento hacia adelante para peones blancos
        black: [[1, 0]],  // Movimiento hacia adelante para peones negros
      },
      rook: [
        [1, 0], [-1, 0], [0, 1], [0, -1] // Vertical y horizontal
      ],
      bishop: [
        [1, 1], [-1, -1], [1, -1], [-1, 1] // Diagonales
      ],
      knight: [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
      ],
      queen: [
        [1, 0], [-1, 0], [0, 1], [0, -1],  // Rook moves
        [1, 1], [-1, -1], [1, -1], [-1, 1] // Bishop moves
      ],
      king: [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [-1, -1], [1, -1], [-1, 1]
      ],
    };
  
    const pieceType = piece.type;
    const pieceColor = piece.color;
  
    // Obtener las direcciones específicas para peones (según el color)
    const pieceDirections =
      pieceType === 'pawn'
        ? directions.pawn[pieceColor]
        : directions[pieceType] || [];
  
    // Función auxiliar para validar límites del tablero
    const isWithinBoard = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  
    // Movimientos especiales para peones
    if (pieceType === 'pawn') {
      const isFirstMove =
        (pieceColor === 'white' && row === 6) || (pieceColor === 'black' && row === 1);
      const forwardDirection = pieceDirections[0]; // Dirección hacia adelante
      const captureDirections = pieceColor === 'white' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];

      // Movimiento hacia adelante (1 casilla)
      const [dRow, dCol] = forwardDirection;
      const forwardRow = row + dRow;
      const forwardCol = col + dCol;

      if (isWithinBoard(forwardRow, forwardCol) && isEmpty(forwardRow, forwardCol)) {
        moves.push({ row: forwardRow, col: forwardCol });

        // Movimiento inicial de 2 casillas
        if (isFirstMove) {
          const twoStepRow = forwardRow + dRow;
          if (isEmpty(twoStepRow, forwardCol)) {
            moves.push({ row: twoStepRow, col: forwardCol });
          }
        }
      }

      // Capturas en diagonal
      for (const [cRow, cCol] of captureDirections) {
        const captureRow = row + cRow;
        const captureCol = col + cCol;
        if (isWithinBoard(captureRow, captureCol)) {
          const targetPiece = getPiece(captureRow, captureCol);
          if (targetPiece && targetPiece.color !== pieceColor) {
            moves.push({ row: captureRow, col: captureCol, isCapture: true }); // Agregar isCapture
          }
        }
      }

      return moves;
    }

    // Recorrer todas las direcciones posibles de la pieza
    for (const [dRow, dCol] of pieceDirections) {
      let newRow = row + dRow;
      let newCol = col + dCol;
  
      // Mantenerse dentro de los límites del tablero
      while (isWithinBoard(newRow, newCol)) {
        if (pieceType === 'pawn') {
          // Regla especial para peones
          const isFirstMove =
            (pieceColor === 'white' && row === 6) || (pieceColor === 'black' && row === 1);
          const isMoveForward = dCol === 0 && isEmpty(newRow, newCol);
          const isCapture =
            dCol !== 0 && !isEmpty(newRow, newCol) && getPiece(newRow, newCol)?.color !== pieceColor;
  
          if (isMoveForward) {
            moves.push({ row: newRow, col: newCol });
            // Agregar el movimiento inicial de dos casillas
            if (isFirstMove && isEmpty(newRow + dRow, newCol)) {
              moves.push({ row: newRow + dRow, col: newCol });
            }
          } else if (isCapture) {
            moves.push({ row: newRow, col: newCol });
          }
          break; // Los peones no continúan en la misma dirección
        } else if (isEmpty(newRow, newCol)) {
          moves.push({ row: newRow, col: newCol });
        } else {
          // Si hay una pieza, solo puede capturar si es enemiga
          const targetPiece = getPiece(newRow, newCol);
          if (targetPiece && targetPiece.color !== pieceColor) {
            moves.push({ row: newRow, col: newCol, isCapture: true });
          }
          break; // Terminar en caso de bloqueo
        }
  
        // Solo piezas como la reina, torre y alfil pueden moverse más de una casilla
        if (['queen', 'rook', 'bishop'].includes(pieceType)) {
          newRow += dRow;
          newCol += dCol;
        } else {
          break; // Otras piezas (rey, caballo, peón) solo se mueven una casilla
        }
      }
    }
  
    return moves;
  };
  

  // Alternar el resaltado de una casilla
  const toggleHighlight = (row, col) => {
    const position = `${row}-${col}`;
    setHighlightedSquares((prev) =>
      prev.includes(position)
        ? prev.filter((p) => p !== position) // Eliminar si ya está resaltada
        : [...prev, position]                // Agregar si no está resaltada
    );
  };

  const handleSquareClick = (row, col) => {
    const piece = getPiece(row, col); // Obtener la pieza en la casilla actual
    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
    // Si ya hay una casilla seleccionada
    if (selectedSquare) {
      const { row: selectedRow, col: selectedCol } = selectedSquare;
  
      // Si se selecciona la misma casilla, deseleccionarla
      if (selectedRow === row && selectedCol === col) {
        console.log(`Casilla deseleccionada (${columns[col]}, ${Math.abs(8 - row)})`);
        setSelectedSquare(null);
        setValidMoves([]); // Limpiar el resaltado
        setSelectedPiece(null); // Limpiar la pieza seleccionada
        return;
      }
  
      // Si la casilla destino está en los movimientos válidos, mover la pieza
      if (validMoves.some(move => move.row === row && move.col === col)) {
        const selectedMove = validMoves.find(move => move.row === row && move.col === col);
  
        // Verifica si la casilla destino tiene un rey
        const targetPiece = board[row][col];
        console.log("Pieza seleccionada:", selectedPiece);
        console.log(`Ataque pieza seleccionada: ${selectedPiece.attack}`);
        console.log(`Defensa pieza seleccionada: ${selectedPiece.defense}`);
        console.log("Pieza objetivo:", targetPiece);

        // Función que se encarga de mostrar alertas especiales de acuerdo al movimiento, 
        // como captura de pieza, movimiento especial, etc.
        messageAlertAndMovement(backendURL, targetPiece, selectedPiece, board, selectedRow, selectedCol, row, col, 
                     movePiece, setSelectedSquare, setSelectedPiece, setMovements, setValidMoves, setBoard, showMessage, 
                     selectedMove, movements, columns, startCombat, pieces);
  
      }
  
      // Si no es un movimiento válido pero contiene una pieza válida, actualizar selección
      if (piece && piece.color === (isWhiteTurn() ? 'white' : 'black')) {
        console.log(`Nueva pieza seleccionada (${columns[col]}, ${Math.abs(8 - row)}): ${piece.type} (${piece.color})`);
        playSelectionSound(piece.type, piece.color);
        setSelectedSquare({ row, col });
        setSelectedPiece(piece); // Guardamos la pieza seleccionada
        setValidMoves(getValidMoves(piece, row, col)); // Calcular movimientos válidos
        return;
      }
  
      return; // Si ninguna condición se cumple, salir
    }
  
    // Si no hay una casilla seleccionada, seleccionar la actual si contiene una pieza válida
    if (piece) {
      const isCorrectWhitePiece = isWhiteTurn() && piece.isWhite();
      const isCorrectBlackPiece = isBlackTurn() && !piece.isWhite();
      const isValidPiece = isCorrectWhitePiece || isCorrectBlackPiece;
  
      if (isValidPiece) {
        console.log(`Casilla seleccionada (${columns[col]}, ${Math.abs(8 - row)}): ${piece.type} (${piece.color})`);
        playSelectionSound(piece.type, piece.color);
        setSelectedSquare({ row, col });
        setSelectedPiece(piece); // Guardamos la pieza seleccionada
        setValidMoves(getValidMoves(piece, row, col)); // Mostrar los movimientos válidos
      } else {
        console.log(
          `Casilla seleccionada (${columns[col]}, ${Math.abs(8 - row)}): Pieza inválida para el turno actual (${piece.color})`
        );
        showMessage("No puedes seleccionar la pieza del otro jugador");
      }
    } else {
      console.log(`Casilla seleccionada (${columns[col]}, ${Math.abs(8 - row)}): Vacía`);
    }
  };

  // Condiciones para finalizar la partida durante cada turno.
  useEffect(() => {
    const checkGameOver = () => {
      let whitePiecesRemaining = false;
      let blackPiecesRemaining = false;
  
      // Verificar si ambos jugadores tienen piezas
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece) {
            if (piece.color === 'white') whitePiecesRemaining = true;
            if (piece.color === 'black') blackPiecesRemaining = true;
          }
          if (whitePiecesRemaining && blackPiecesRemaining) {
            return; // Continuar el juego si ambos tienen piezas
          }
        }
      }
  
      // Finalizar la partida si no hay piezas de un color
      if (!whitePiecesRemaining) {
        setCombatSummary({
          winner: 'Negras',
          loser: 'Blancas',
          stats: { turns: movements },
        });
        setGameOver(true); // Mostrar el modal
        // Notificar a otros clientes del termino
        console.log(`Avisando al backend del termino del game...`)
        webSocketService.send('endGame', {
          winner: 'Negras',
          loser: 'Blancas',
          stats: { turns: movements},
        });
      } else if (!blackPiecesRemaining) {
        setCombatSummary({
          winner: 'Blancas',
          loser: 'Negras',
          stats: { turns: movements},
        });
        setGameOver(true); // Mostrar el modal
         // Notificar a otros clientes del termino
         console.log(`Avisando al backend del termino del game...`)
         webSocketService.send('endGame', {
          winner: 'Blancas',
          loser: 'Negras',
          stats: { turns: movements},
        });
      }
    };
    checkGameOver();

    const handleWebSocketMessage = (message) => {
    try {
      // Verificar si el mensaje es un string que necesita ser parseado
      const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
      console.log('Mensaje recibido:', parsedMessage);
      const { type, fromRow, fromCol, toRow, toCol } = parsedMessage;    
      console.log(`datos del mensaje recibido por el backend en el frontend:`);
      console.log(type, fromRow, fromCol, toRow, toCol);

      switch (type) {
        case 'updateBoard':
          console.log(`updateBoard case`)
          setBoard((prevBoard) => {
            const newBoard = prevBoard.map((row) => [...row]); // Copiar el tablero
            newBoard[toRow][toCol] = newBoard[fromRow][fromCol]; // Mover pieza
            newBoard[fromRow][fromCol] = null; // Vaciar casilla original
            return newBoard;
          });
          console.log("Movement before update:", movements);
          setMovements((prev) => prev + 1); // Actualizar turno
          console.log("Movement after update:", movements);
          break;
        default:
          console.warn(`Evento no reconocido: ${type}`);
      }
    } catch (error) {
      console.error('Error al procesar el mensaje:', error);
    }
    };    

    const handleStartCombat = ({ combatId, attacker, defender }) => {
      console.log("Combat started:", combatId);
      setAttacker(attacker);
      setDefender(defender);
      combatModal = { id: combatId, attacker, defender };
      setCombatModalVisible(true); // Abre el modal
    };
  
    const handleEndCombat = ({ combatId, winner }) => {
      console.log("Combat ended:", combatId, "Winner:", winner);
      setCombatModalVisible(false); // Cierra el modal
      combatModal = null;
    };

    const handleEndGame = ({ winner, loser, stats }) => {
      console.log(`datos recibidos en el frontend:`, winner, loser, stats);
      setCombatSummary({
          winner,
          loser,
          stats
      });
      setGameOver(true);  // Marcar que el juego ha terminado
  };

    // Suscribirse a los mensajes WebSocket
    webSocketService.addListener('updateBoard', handleWebSocketMessage);
    webSocketService.addListener('startCombat', handleStartCombat);
    webSocketService.addListener('endCombat', handleEndCombat);
    webSocketService.addListener('endGame', handleEndGame);

    return () => {
        webSocketService.removeListener('updateBoard', handleWebSocketMessage);
        webSocketService.removeListener('startCombat', handleStartCombat);
        webSocketService.removeListener('endCombat', handleEndCombat);
        webSocketService.removeListener('endGame', handleEndGame);
    };
  }, [board]);
  
  

  // Renderizar una casilla
  const renderSquare = (row, col) => {
    const piece = getPiece(row, col); // Obtener la pieza en la casilla actual
    const isSelected = selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
    const validMove = validMoves.find(move => move.row === row && move.col === col);
  
    // Determinar clases según el tipo de movimiento y casilla
    const squareClass = (row + col) % 2 === 0 ? 'light' : 'dark';
    const additionalClass = validMove
      ? validMove.isCapture
        ? 'capture-highlighted' // Resaltar en rojo para capturas
        : 'highlighted'         // Resaltar en verde para movimientos válidos
      : isSelected
      ? 'selected'              // Resaltar en azul si está seleccionada
      : '';
  
    return (
      <ChessSquare
        key={`${row}-${col}`}
        row={row}
        col={col}
        isHighlighted={!!validMove}
        onClick={() => handleSquareClick(row, col)}     // Pasar el manejador
        className={`${squareClass} ${additionalClass}`} // Agregar las clases dinámicamente
      >
        {piece && (
          <Piece
          color={piece.color}
          piece={piece.type}
          row={row}
          col={col}
          spriteRow={1}
          spriteCol={1}
          className="piece" // Clase específica para el tablero
          />
        )}
      </ChessSquare>
    );
  };
  

  // Renderizar el tablero completo
  const renderBoard = () => {
    return board.map((row, rowIndex) =>
      row.map((_, colIndex) => renderSquare(rowIndex, colIndex))
    );
  };

  return (
    <div className="frame">
      <div className="end top">a b c d e f g h</div>
      <div className="end left">8 7 6 5 4 3 2 1</div>
      <section className="chessboard">
        {renderBoard()}
        {message && <div className="popup-message">{message}</div>}
        {combatModalVisible && (
          <CombatModal 
            attackerPiece={attacker} 
            defenderPiece={defender}
            onClose={onCombatClose}
            player1ID={player1ID}
            player2ID={player2ID}
            currentPlayerID={current_player_id}
          />
        )}
        {/* Mostrar GameEndModal si el juego ha terminado */}
        {gameOver && combatSummary && (
          <GameEndModal
            winner={combatSummary.winner}
            loser={combatSummary.loser}
            stats={combatSummary.stats}
            onExit={() => {
              setGameOver(false);
              setCombatSummary(null);
              deleteRoom(backendURL, id, request_config, sessionData, setSessionData);
              navigate(mainPagePath);
            }}
          />
        )}
      </section>
      <div className="end right">8 7 6 5 4 3 2 1</div>
      <div className="end bottom">a b c d e f g h</div>
    </div>
  );
};

export default ChessBoard;

// Función de prueba.
async function deleteRoom(backendURL, id_session, request_config, sessionData, setSessionData) {
  let responseSessionData;
  
  try {
    const responseSession = await axios.get(
      `${backendURL}/sessions/${id_session}`,
      request_config
    );
    if (responseSession.status === 200) {
      responseSessionData = responseSession.data
      setSessionData(responseSessionData);
    }
  } catch (error) {
    console.log("Error al obtener sessión:", error);
  }

  axios.delete(`${backendURL}/rooms/${responseSessionData.room_id}`, request_config)
    .then( response => {
      if (response.status === 204) {
        console.log(`Sesión eliminada`);
      }
    })
    .catch(error => {
      console.log("Ha ocurrido un error en la eliminación de Room", error);
    })
}
