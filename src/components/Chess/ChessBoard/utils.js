import axios from 'axios';
import { playCaptureSound, playDefeatSound } from '../../../utils/soundPieces';
import Swal from "sweetalert2";

export const messageAlertAndMovement = (backendURL, targetPiece, selectedPiece, board, selectedRow, selectedCol, row, col, 
  movePiece, setSelectedSquare, setSelectedPiece, setMovements, setValidMoves, setBoard, showMessage, selectedMove, movements, columns, startCombat, pieces) => {

  const token = localStorage.getItem('token');
  const request_config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
    
  if (targetPiece?.type === "king") {

    // Si la pieza seleccionada también es un rey
    if (selectedPiece?.type === "king") {
      console.log(`Rey a rey, condicional, TIPO DE PIZA: ${selectedPiece.type}`);
      Swal.fire({
        title: "¡Choque de titanes!",
        text: "El rey desafía al rey en un duelo épico. ¿Estás listo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "¡Sí, enfrentémonos!",
        cancelButtonText: "No, aún no"
      }).then(result => {
        if (result.isConfirmed) {
          // Llama al combate y espera el resultado antes de proceder
          startCombat(selectedPiece, targetPiece).then((winner) => {
            if (winner) {
              console.log(`${winner} es el ganador`);
              // Realiza acciones dependiendo del ganador
              if (winner.type === selectedPiece.type && winner.color === selectedPiece.color) {
                // Atacante ganó, realiza el movimiento
                ejecutarMovimiento(selectedRow, selectedCol, row, col);
              } else {
                derrotaronAtacante(selectedRow, selectedCol);
                deleteAttackerPiece(backendURL, selectedPiece, request_config)
                showMessage("¡Tu pieza ha sido capturada por el defensor!");
              }
            } else {
              console.log("El combate fue cancelado.");
              console.log("Ninguna pieza se movió.");
            }
          });
        }
      });
      return;                                                  // Salir de la función hasta que se confirme o cancele
    }

    // Si la pieza seleccionada también es un peón
    if (selectedPiece?.type === "pawn") {
      console.log(`Peón en acción, condicional, TIPO DE PIEZA: ${selectedPiece.type}`);
      Swal.fire({
        title: "¡Oh no, el peón está en problemas!",
        text: "¿El peón quiere desafiar al rey? ¿Estás seguro? ¡Esto no va a acabar bien!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "¡Sí, peón, vamos a hacerlo!",
        cancelButtonText: "No, me retiro antes de que sea demasiado tarde"
      }).then(result => {
        if (result.isConfirmed) {
          // Llama al combate y espera el resultado antes de proceder
          startCombat(selectedPiece, targetPiece).then((winner) => {
            if (winner) {
              // Realiza acciones dependiendo del ganador
              if (winner.type === selectedPiece.type && winner.color === selectedPiece.color) {
                // Atacante ganó, realiza el movimiento
                ejecutarMovimiento(selectedRow, selectedCol, row, col);
              } else {
                derrotaronAtacante(selectedRow, selectedCol);
                deleteAttackerPiece(backendURL, selectedPiece, request_config)
                showMessage("¡Tu pieza ha sido capturada por el defensor!");
              }
            } else {
              console.log("El combate fue cancelado.");
              console.log("Ninguna pieza se movió.");
            }
          });
        }
      });
      return;  // Salir de la función hasta que se confirme o cancele
    }

    // Si la pieza seleccionada es un caballo
    if (selectedPiece?.type === "knight") {
      console.log(`Caballo en acción, condicional, TIPO DE PIEZA: ${selectedPiece.type}`);
      Swal.fire({
        title: "¡El caballo está a punto de saltar!",
        text: "¿Un caballo enfrentándose al rey? ¡Esto va a ser un espectáculo! ¿Te atreves?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "¡Sí, saltemos hacia la victoria!",
        cancelButtonText: "No, el caballo necesita un descanso"
      }).then(result => {
        if (result.isConfirmed) {
          // Llama al combate y espera el resultado antes de proceder
          startCombat(selectedPiece, targetPiece).then((winner) => {
            if (winner) {
              console.log(`${winner} es el ganador`);
              // Realiza acciones dependiendo del ganador
              if (winner.type === selectedPiece.type && winner.color === selectedPiece.color) {
                // Atacante ganó, realiza el movimiento
                ejecutarMovimiento(selectedRow, selectedCol, row, col);
              } else {
                derrotaronAtacante(selectedRow, selectedCol);
                deleteAttackerPiece(backendURL, selectedPiece, request_config)
                showMessage("¡Tu pieza ha sido capturada por el defensor!");
              }
            } else {
              console.log("El combate fue cancelado.");
              console.log("Ninguna pieza se movió.");
            }
          });
        }
      });
      return;
    }

    // Si la pieza seleccionada es una torre
    if (selectedPiece?.type === "rook") {
      console.log(`Torre en acción, condicional, TIPO DE PIEZA: ${selectedPiece.type}`);
      Swal.fire({
        title: "¡La torre está lista para avanzar!",
        text: "¿Te atreves a mover la torre hacia el rey? ¡Una torre imparable!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "¡Sí, a la carga!",
        cancelButtonText: "No, la torre se queda en su lugar"
      }).then(result => {
        if (result.isConfirmed) {
          // Llama al combate y espera el resultado antes de proceder
          startCombat(selectedPiece, targetPiece).then((winner) => {
            if (winner) {
              console.log(`${winner} es el ganador`);
              // Realiza acciones dependiendo del ganador
              if (winner.type === selectedPiece.type && winner.color === selectedPiece.color) {
                // Atacante ganó, realiza el movimiento
                ejecutarMovimiento(selectedRow, selectedCol, row, col);
              } else {
                derrotaronAtacante(selectedRow, selectedCol);
                deleteAttackerPiece(backendURL, selectedPiece, request_config)
                showMessage("¡Tu pieza ha sido capturada por el defensor!");
              }
            } else {
              console.log("El combate fue cancelado.");
              console.log("Ninguna pieza se movió.");
            }
          });
        }
      });
      return;
    }

    // Si la pieza seleccionada es un alfil
    if (selectedPiece?.type === "bishop") {
      console.log(`Alfil en acción, condicional, TIPO DE PIEZA: ${selectedPiece.type}`);
      Swal.fire({
        title: "¡El alfil se prepara para su ataque diagonal!",
        text: "¿Un alfil atacando al rey por sus diagonales? ¡Esto sí que es estratégico!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "¡Sí, diagonales poderosas!",
        cancelButtonText: "No, el alfil se queda en su esquina"
      }).then(result => {
        if (result.isConfirmed) {
          // Llama al combate y espera el resultado antes de proceder
          startCombat(selectedPiece, targetPiece).then((winner) => {
            if (winner) {
              console.log(`${winner} es el ganador`);
              // Realiza acciones dependiendo del ganador
              if (winner.type === selectedPiece.type && winner.color === selectedPiece.color) {
                // Atacante ganó, realiza el movimiento
                ejecutarMovimiento(selectedRow, selectedCol, row, col);
              } else {
                derrotaronAtacante(selectedRow, selectedCol);
                deleteAttackerPiece(backendURL, selectedPiece, request_config)
                showMessage("¡Tu pieza ha sido capturada por el defensor!");
              }
            } else {
              console.log("El combate fue cancelado.");
              console.log("Ninguna pieza se movió.");
            }
          });
        }
      });
      return;
    }

    // Si la pieza seleccionada es la reina
    if (selectedPiece?.type === "queen") {
      console.log(`Reina en acción, condicional, TIPO DE PIEZA: ${selectedPiece.type}`);
      Swal.fire({
        title: "¡La reina está lista para dominar!",
        text: "¿La reina enfrentándose al rey? Esto es un poder absoluto, ¿te atreves?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "¡Sí, reina, vamos a por todo!",
        cancelButtonText: "No, la reina se retira"
      }).then(result => {
        if (result.isConfirmed) {
          // Llama al combate y espera el resultado antes de proceder
          startCombat(selectedPiece, targetPiece).then((winner) => {
            if (winner) {
              console.log(`${winner} es el ganador`);
              // Realiza acciones dependiendo del ganador
              if (winner.type === selectedPiece.type && winner.color === selectedPiece.color) {
                // Atacante ganó, realiza el movimiento
                ejecutarMovimiento(selectedRow, selectedCol, row, col);
              } else {
                derrotaronAtacante(selectedRow, selectedCol);
                deleteAttackerPiece(backendURL, selectedPiece, request_config)
                showMessage("¡Tu pieza ha sido capturada por el defensor!");
              }
            } else {
              console.log("El combate fue cancelado.");
              console.log("Ninguna pieza se movió.");
            }
          });
        }
      });
      return;
    }
  } else if (targetPiece) {
    // Llama al combate y espera el resultado antes de proceder
    console.log("Voy a llamar a iniciar combate")
    console.log(`SelectedPiece hp: ${selectedPiece.hp}`)
    console.log(`TargetPiece hp: ${targetPiece.hp}`)
    startCombat(selectedPiece, targetPiece).then((winner) => {
      if (winner) {
        console.log(`${winner.type} ${winner.color} es el ganador`);
        // Realiza acciones dependiendo del ganador
        if (winner.type === selectedPiece.type && winner.color === selectedPiece.color) {
          // Atacante ganó, realiza el movimiento
          ejecutarMovimiento(selectedRow, selectedCol, row, col);
        } else {
          derrotaronAtacante(selectedRow, selectedCol);
          deleteAttackerPiece(backendURL, selectedPiece, request_config)
          showMessage("¡Tu pieza ha sido capturada por el defensor!");
        }
      } else {
        console.log("El combate fue cancelado.");
        console.log("Ninguna pieza se movió.");
      }
    });
  } else {
    // No hay combate, realiza el movimiento directamente
    ejecutarMovimiento(selectedRow, selectedCol, row, col);
  }

  // Función para ejecutar el movimiento.
  function ejecutarMovimiento(fromRow, fromCol, toRow, toCol) {
    console.log(
      `Movimiento válido: (${columns[fromCol]}, ${Math.abs(8 - fromRow)}) -> (${columns[toCol]}, ${Math.abs(8 - toRow)})`
    );
    movePiece(fromRow, fromCol, toRow, toCol);                      // Realiza el movimiento
    if (selectedMove.isCapture) {
      deleteDefenderPiece(backendURL, targetPiece, request_config); // Eliminar la pieza en la base de datos
      playCaptureSound();                                           // Sonido de captura
    }
    setSelectedSquare(null);                                        // Limpiar la casilla seleccionada
    setSelectedPiece(null);                                         // Limpiar la pieza seleccionada
    console.log("Actualizando movimiento en utils. Movimientos antes de update:", movements);
    setMovements((prevMovements) => prevMovements + 1);             // Actualizar turno
    setValidMoves([]);                                              // Limpiar el resaltado después del movimiento
  }

  // Función para eliminar la pieza seleccionada cuando el defensor gana.
  function derrotaronAtacante(fromRow, fromCol) {
    console.log(`Pieza atacante derrotada: (${columns[fromCol]}, ${Math.abs(8 - fromRow)})`);
    // Actualizamos el estado del tablero.
    setBoard((prevBoard) => {
      const updatedBoard = prevBoard.map((row) => [...row]);
      updatedBoard[fromRow][fromCol] = null;
      return updatedBoard;
    });
    playDefeatSound();                                  // Sonido de derrota

    setSelectedSquare(null);                            // Limpiar la casilla seleccionada
    setSelectedPiece(null);                             // Limpiar la pieza seleccionada
    setMovements((prevMovements) => prevMovements + 1); // Actualizar turno
    setValidMoves([]);                                  // Limpiar el resaltado después del movimiento
  }

};


/*
* FUNCIONES PARA ACTUALIZAR LA BASE DE DATOS.
*/

// Función que elimina la pieza defensiva de la base de datos.
async function deleteDefenderPiece(backendURL, targetPiece, request_config) {
  axios.delete(`${backendURL}/pieces/${targetPiece.id}`, request_config)
    .then( response => {
      if (response.status === 204) {
        console.log(`Pieza eliminada: ${JSON.stringify(targetPiece)}`);
      }
    })
    .catch(error => {
      console.log(error);
    })
}

// Función que elimina la pieza atacante de la base de datos.
async function deleteAttackerPiece(backendURL, selectedPiece, request_config) {
  axios.delete(`${backendURL}/pieces/${selectedPiece.id}`, request_config)
    .then( response => {
      if (response.status === 204) {
        console.log(`Pieza eliminada: ${JSON.stringify(selectedPiece)}`);
      }
    })
    .catch(error => {
      console.log(error);
    })
}
