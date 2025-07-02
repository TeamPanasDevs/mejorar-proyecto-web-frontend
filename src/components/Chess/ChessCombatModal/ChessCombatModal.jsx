import React, { useState, useEffect, useContext } from 'react';
import Piece from '../ChessPiece/ChessPiece';
import { getPieceStatus, updatePieceStatus } from '../utilsPieceStatus';
import './ChessCombatModal.css';
import { PathsContext } from '../../../App';
import webSocketService from '../../../services/WebSocketService';

const ANIMATION_TIME = 0.6 // Tiempo en segundos

const CombatModal = ({ attackerPiece, defenderPiece, onClose, player1ID, player2ID, currentPlayerID }) => {
  /* 
  * UTILIDAD BACKEND
  */

  const {
    backendURL
  } = useContext(PathsContext);

  const token = localStorage.getItem('token');
  const request_config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const [firstTurn, setFirstTurn] = useState(true);
  const [loading, setLoading] = useState(true);
  const isP1Attacker = (attackerPiece.color == 'white' && currentPlayerID == player1ID);
  const isP2Attacker = (attackerPiece.color == 'black' && currentPlayerID == player2ID);

  const [message, setMessage] = useState(`${attackerPiece.typeShow} ${attackerPiece.colorShow} inició el combate con un golpe sorpresa 🎯`);
  const [turn, setTurn] = useState('attacker');                                        // Determina de quién es el turno
  const [turnCount, setTurnCount] = useState(1)                                        // Contador de turnos
  const [attackerHealth, setAttackerHealth] = useState(attackerPiece.hp);              // Controla vida del atacante
  const [defenderHealth, setDefenderHealth] = useState(defenderPiece.hp);              // Controla vida del defensor
  const [attackerDefense, setAttackerDefense] = useState(attackerPiece.defense)        // Controla la defensa del atacante
  const [defenderDefense, setDefenderDefense] = useState(defenderPiece.defense)        // Controla la defensa del defensor
  const [attackerResilienceUsed, setAttackerResilienceUsed] = useState([false, null]); // Controla uso de Resiliencia
  const [defenderResilienceUsed, setDefenderResilienceUsed] = useState([false, null]); // Controla uso de Resiliencia
  const [attackerBreakerUsed, setAttackerBreakerUsed] = useState([false, null]);       // Controla uso de Quebranta hombres
  const [defenderBreakerUsed, setDefenderBreakerUsed] = useState([false, null]);       // Controla uso de Quebranta hombres

  // Calcula daño basado en la fórmula proporcionada
  const calculateDamage = (attacker, defenderDefense, isCritical) => {
    const baseDamage = Math.round(attacker.attack * (1 - defenderDefense / (defenderDefense + 100)));
    return isCritical ? Math.round(baseDamage * 1.7) : baseDamage;
  };
  

  // Setear estados según la info en la base de datos
  useEffect(() => {
    if (!loading) return;

    async function initializeStatus() {
      const attackerPieceStatus = await getPieceStatus(backendURL, request_config, attackerPiece.status_id);
      const defenderPieceStatus = await getPieceStatus(backendURL, request_config, defenderPiece.status_id);
      console.log(`AttackerStatus: ${attackerPieceStatus}`);
      if (attackerPieceStatus != null) {
        setAttackerHealth(attackerPieceStatus.actual_life);
        setAttackerDefense(attackerPieceStatus.actual_defense);
        console.log(`AttackerHealth: ${attackerHealth}`);
      }
      if (defenderPieceStatus != null) {
        setDefenderHealth(defenderPieceStatus.actual_life);
        setDefenderDefense(defenderPieceStatus.actual_defense);
      }
      setLoading(false);
    }
    initializeStatus();
  }, [])

  // Golpe inicial del atacante
  useEffect(() => {
    if (loading) return;

    // Ocultar acciones
    const actions = document.getElementsByClassName('actions')[0];
    actions.style.display = 'none';
    // Ejecutar animación
    const piece_element = document.getElementById(`${attackerPiece.type}_${attackerPiece.color}`);
    const hitted_piece_element = document.getElementById(`${defenderPiece.type}_${defenderPiece.color}`);

    // Ejecutar animación de ataque
    piece_element.classList.add(`${attackerPiece.type}_${attackerPiece.color}_attack_animation`);
    // Ejecutar animación de hit después de (ANIMATION_TIME / 2) segundos
    setTimeout(() => {
      hitted_piece_element.classList.add(`${defenderPiece.type}_${defenderPiece.color}_hit_animation`, 'hit_animation');
    }, (ANIMATION_TIME / 2) * 1000)

    // Procesar ataque después de ANIMATION_TIME segundos
    setTimeout(() => {
      // Remover animación de ataque
      piece_element.classList.remove(`${attackerPiece.type}_${attackerPiece.color}_attack_animation`);
      // Remover animación de hit después de (ANIMATION_TIME / 2) segundos
      setTimeout(() => {
        hitted_piece_element.classList.remove(`${defenderPiece.type}_${defenderPiece.color}_hit_animation`, 'hit_animation');
        // ACtivar acciones
        // if (isP1Attacker || isP2Attacker) {
          actions.style.display = 'flex';
        // }
      }, (ANIMATION_TIME / 2) * 1000)
      /* Ejecutar accion */
      // if (isP1Attacker || isP2Attacker) {
        const initialDamage = calculateDamage(attackerPiece, defenderDefense);
        setDefenderHealth((prev) => {
          const new_life = Math.max(prev - initialDamage, 0);
          updatePieceStatus(backendURL, request_config, defenderPiece.status_id, { 'actual_life': new_life });
          // webSocketService.send('updatePieceStatus', {
          //   target: 'defender',
          //   next_turn: 'attacker',
          //   turn_count: turnCount,
          //   life: new_life,
          //   defense: defenderDefense,
          // });
          return new_life;
        }); // Aplica daño al defensor
        setFirstTurn(false);
        setMessage(`${attackerPiece.typeShow} ${attackerPiece.colorShow} causó ${initialDamage} de daño con un golpe inicial ⚡`);
      // }
    }, ANIMATION_TIME * 1000)
  }, [loading]);

  // Verifica si hay un ganador y cierra el modal con el resultado
  useEffect(() => {
    if (attackerHealth <= 0 || defenderHealth <= 0) {
      let winner_piece;
      let dead_piece;
      if (attackerHealth > 0) {
        winner_piece = attackerPiece;
        dead_piece = defenderPiece;
      } else {
        winner_piece = defenderPiece;
        dead_piece = attackerPiece;  
      }  
      const dead_piece_element = document.getElementById(`${dead_piece.type}_${dead_piece.color}`);
      dead_piece_element.classList.add(`${dead_piece.type}_${dead_piece.color}_dead_animation`, 'dead_animation');

      // Restaurar defensa
      updatePieceStatus(backendURL, request_config, winner_piece.status_id, { 'actual_defense': winner_piece.defense });
  
      // Pasar la pieza ganadora completa
      setTimeout(() => onClose(winner_piece), 1500);
    }
  }, [attackerHealth, defenderHealth, onClose, attackerPiece, defenderPiece]);
  

  // Manejo del ataque
  const handleAttack = () => {
    const actions = document.getElementsByClassName('actions')[0];
    actions.style.display = 'none';
    
    let defensePiece;
    let piece, hitted_piece;
    let keepActionsHidden = false;
    if (turn === 'attacker') {
      defensePiece = defenderDefense;
      piece = attackerPiece;
      hitted_piece = defenderPiece;
      // if (isP1Attacker || isP2Attacker) {
      //   keepActionsHidden = true;
      // }
    } else {
      defensePiece = attackerDefense;
      piece = defenderPiece;
      hitted_piece = attackerPiece;
      // if (!isP1Attacker || !isP2Attacker) {
      //   keepActionsHidden = true;
      // }
    }
  
    const piece_element = document.getElementById(`${piece.type}_${piece.color}`);
    const hitted_piece_element = document.getElementById(`${hitted_piece.type}_${hitted_piece.color}`);
  
    // Determinar si el ataque falla o es crítico
    const random = Math.random();
    const isMiss = random < 0.3; // 30% probabilidad de fallar
    const isCritical = random >= 0.7; // 30% probabilidad de crítico

    // Animación ataque
    const attack_animation = isCritical ? 'crit_animation' : 'attack_animation';
    piece_element.classList.add(`${piece.type}_${piece.color}_${attack_animation}`);
    // Remover después de ANIMATION_TIME segundo
    setTimeout(() => {
      piece_element.classList.remove(`${piece.type}_${piece.color}_${attack_animation}`);
    }, ANIMATION_TIME * 1000);

    // Procesar ataque después de (ANIMATION_TIME / 2) segundos
    setTimeout(() => {
      if (isMiss) {
        if (turn === 'attacker') {
          showMessage(`${piece.typeShow} ${piece.colorShow} falló su ataque ❌`);
          setTurn('defender');
        } else {
          showMessage(`${piece.typeShow} ${piece.colorShow} falló su ataque ❌`);
          setTurn('attacker');
        }
        setTimeout(() => {
          // if (!keepActionsHidden) {
            actions.style.display = 'flex';
          // }
        }, (ANIMATION_TIME / 2) * 1000)
      } else {
        // Animación hit
        hitted_piece_element.classList.add(`${hitted_piece.type}_${hitted_piece.color}_hit_animation`, 'hit_animation');
        // Remover después de ANIMATION_TIME segundos
        setTimeout(() => {
          hitted_piece_element.classList.remove(`${hitted_piece.type}_${hitted_piece.color}_hit_animation`, 'hit_animation');
          // if (!keepActionsHidden) {
            actions.style.display = 'flex';
          // }
        }, ANIMATION_TIME * 1000);

        const damage = calculateDamage(piece, defensePiece, isCritical);
        if (turn === 'attacker') {
          setDefenderHealth((prev) => {
            const new_life = Math.max(prev - damage, 0);
            updatePieceStatus(backendURL, request_config, defenderPiece.status_id, { 'actual_life': new_life });
            // webSocketService.send('updatePieceStatus', {
            //   target: 'defender',
            //   next_turn: 'defender',
            //   turn_count: turnCount + 1,
            //   life: new_life,
            //   defense: defenderDefense,
            // });
            return new_life;
          });
          showMessage(
            `${attackerPiece.typeShow} ${attackerPiece.colorShow} ${isCritical ? "hizo un golpe crítico 💥 y" : ""} causó ${damage} de daño ⚔️`
          );
          setTurn('defender');
        } else {
          setAttackerHealth((prev) => {
            const new_life = Math.max(prev - damage, 0);
            updatePieceStatus(backendURL, request_config, attackerPiece.status_id, { 'actual_life': new_life });
            // webSocketService.send('updatePieceStatus', {
            //   target: 'attacker',
            //   next_turn: 'attacker',
            //   turn_count: turnCount + 1,
            //   life: new_life,
            //   defense: attackerDefense,
            // });
            return new_life;
          });
          showMessage(
            `${defenderPiece.typeShow} ${defenderPiece.colorShow} ${isCritical ? "hizo un golpe crítico 💥 y" : ""} causó ${damage} de daño 🛡️`
          );
          setTurn('attacker');
        }
      }
  
      setTurnCount((prev) => prev + 1);
    }, (ANIMATION_TIME / 2) * 1000)
  };
  

  // Manejo de Resiliencia
  const handleResilience = () => {
    const actions = document.getElementsByClassName('actions')[0];
    actions.style.display = 'none';

    let keepActionsHidden = false;
    if (turn == 'attacker') {
      // if (isP1Attacker || isP2Attacker) {
      //   keepActionsHidden = true;
      // }
    }
    else {
      // if (!isP1Attacker || !isP2Attacker) {
      //   keepActionsHidden = true;
      // }
    }

    if (turn === 'attacker' && !attackerResilienceUsed[0]) {
      const new_defense = Math.ceil(attackerDefense * 1.30); // Aumenta defensa 30%
      updatePieceStatus(backendURL, request_config, attackerPiece.status_id, { 'actual_defense': new_defense });
      // webSocketService.send('updatePieceStatus', {
      //   target: 'attacker',
      //   next_turn: 'defender',
      //   turn_count: turnCount + 1,
      //   life: attackerHealth,
      //   defense: new_defense,
      // });
      setAttackerDefense(new_defense);
      setAttackerResilienceUsed([true, turnCount]);            // Habilidad es activada, y guarda el turno de activación.
      showMessage(`${attackerPiece.typeShow} ${attackerPiece.colorShow} usó Resiliencia y aumentó su defensa 🛡️`);
      setTurn('defender');
    } else if (turn === 'defender' && !defenderResilienceUsed[0]) {
      const new_defense = Math.ceil(defenderDefense * 1.30); // Aumenta defensa 30%
      updatePieceStatus(backendURL, request_config, defenderPiece.status_id, { 'actual_defense': new_defense });
      // webSocketService.send('updatePieceStatus', {
      //   target: 'defender',
      //   next_turn: 'attacker',
      //   turn_count: turnCount + 1,
      //   life: defenderHealth,
      //   defense: new_defense,
      // });
      setDefenderDefense(new_defense);
      setDefenderResilienceUsed([true, turnCount]);            // Habilidad es activada, y guarda el turno de activación.
      showMessage(`${defenderPiece.typeShow} ${defenderPiece.colorShow} usó Resiliencia y aumentó su defensa 🛡️`);
      setTurn('attacker');
    }

    // if (!keepActionsHidden) {
      actions.style.display = 'flex';
    // }
    setTurnCount((prev) => prev + 1);
  };

  // Manejo de Quebranta hombres
  const handleBreaker = () => {
    const actions = document.getElementsByClassName('actions')[0];
    actions.style.display = 'none';

    // let keepActionsHidden = false;
    // if (turn == 'attacker') {
    //   if (isP1Attacker || isP2Attacker) {
    //     keepActionsHidden = true;
    //   }
    // }
    // else {
    //   if (!isP1Attacker || !isP2Attacker) {
    //     keepActionsHidden = true;
    //   }
    // }

    if (turn === 'attacker' && !attackerBreakerUsed[0]) {
      const new_defense = Math.floor(defenderDefense * 0.80); // Reduce defensa del defensor 20%
      updatePieceStatus(backendURL, request_config, defenderPiece.status_id, { 'actual_defense': new_defense });
      // webSocketService.send('updatePieceStatus', {
      //   target: 'defender',
      //   next_turn: 'defender',
      //   turn_count: turnCount + 1,
      //   life: defenderHealth,
      //   defense: new_defense,
      // });
      setDefenderDefense(new_defense);
      setAttackerBreakerUsed([true, turnCount]);               // Habilidad es activada, y guarda el turno de activación.
      showMessage(`${attackerPiece.typeShow} ${attackerPiece.colorShow} usó Quebranta hombres y redujo la defensa del enemigo 🪓`);
      setTurn('defender');
    } else if (turn === 'defender' && !defenderBreakerUsed[0]) {
      const new_defense = Math.floor(attackerDefense * 0.80); // Reduce defensa del atacante 20%
      updatePieceStatus(backendURL, request_config, attackerPiece.status_id, { 'actual_defense': new_defense });
      // webSocketService.send('updatePieceStatus', {
      //   target: 'attacker',
      //   next_turn: 'attacker',
      //   turn_count: turnCount + 1,
      //   life: attackerHealth,
      //   defense: new_defense,
      // });
      setAttackerDefense(new_defense);
      setDefenderBreakerUsed([true, turnCount]);               // Habilidad es activada, y guarda el turno de activación.
      showMessage(`${defenderPiece.typeShow} ${defenderPiece.colorShow} usó Quebranta hombres y redujo la defensa del enemigo 🪓`);
      setTurn('attacker');
    }

    // if (!keepActionsHidden) {
      actions.style.display = 'flex';
    // }
    setTurnCount((prev) => prev + 1);
  };

  // Resetea los efectos de las habilidades temporales.
  useEffect(() => {
    // if (!isP1Attacker || !isP2Attacker) return;

    if (turnCount - attackerResilienceUsed[1] > 4) {
      // Si el Quebranta Hombres del defensor está activa, y fue activada turnos después.
      // if (!defenderBreakerUsed[0] && (defenderBreakerUsed[1] > attackerResilienceUsed[1])){
      // }
      console.log("Restaurando estado");
      updatePieceStatus(backendURL, request_config, attackerPiece.status_id, { 'actual_defense': attackerPiece.defense });
      // webSocketService.send('updatePieceStatus', {
      //   target: 'attacker',
      //   next_turn: 'attacker',
      //   turn_count: turnCount + 1,
      //   life: attackerHealth,
      //   defense: attackerPiece.defense,
      // });
      setAttackerDefense(attackerPiece.defense);
    }
    if (turnCount - defenderResilienceUsed[1] > 4) {
      console.log("Restaurando estado");
      updatePieceStatus(backendURL, request_config, defenderPiece.status_id, { 'actual_defense': defenderPiece.defense });
      // webSocketService.send('updatePieceStatus', {
      //   target: 'defender',
      //   next_turn: 'defender',
      //   turn_count: turnCount + 1,
      //   life: defenderHealth,
      //   defense: defenderPiece.defense,
      // });
      setDefenderDefense(defenderPiece.defense);
    }
    if (turnCount - attackerBreakerUsed[1] > 4) {
      // Si la Resiliencia del defensor está activa, y fue activada turnos después.}
      if (!defenderResilienceUsed[0] && (defenderResilienceUsed[1] > attackerBreakerUsed[1])) {
        console.log("Restaurando estado");
        updatePieceStatus(backendURL, request_config, defenderPiece.status_id, { 'actual_defense': defenderPiece.defense });
        // webSocketService.send('updatePieceStatus', {
        //   target: 'defender',
        //   next_turn: 'defender',
        //   turn_count: turnCount + 1,
        //   life: defenderHealth,
        //   defense: defenderPiece.defense,
        // });
        setDefenderDefense(defenderPiece.defense);
      }
    }
    if (turnCount - defenderBreakerUsed[1] > 4) {
      // Si la Resiliencia del atacante está activa, y fue activada turnos después.
      if (!attackerResilienceUsed[0] && (attackerResilienceUsed[1] >defenderBreakerUsed[1])) {
        console.log("Restaurando estado");
        updatePieceStatus(backendURL, request_config, attackerPiece.status_id, { 'actual_defense': attackerPiece.defense });
        // webSocketService.send('updatePieceStatus', {
        //   target: 'attacker',
        //   next_turn: 'attacker',
        //   turn_count: turnCount + 1,
        //   life: attackerHealth,
        //   defense: attackerPiece.defense,
        // });
        setAttackerDefense(attackerPiece.defense);
      }
    }

    // // Recibir actualizaciones de estado de ws
    // const handleWebSocketMessage = (message) => {
    //   try {
    //     // Verificar si el mensaje es un string que necesita ser parseado
    //     const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;
    //     console.log('Mensaje recibido:', parsedMessage);
    //     const { type, target, next_target, turn_count, life, defense } = parsedMessage;    
    //     console.log(`datos del mensaje recibido por el backend en el frontend:`);
    //     console.log(type, target, next_target, turn_count, life, defense);

    //     switch (type) {
    //       case 'updatePieceStatus':
    //         console.log(`updatePieceStatus case`)
    //         if (target == 'attacker') {
    //           setAttackerDefense(defense);
    //           setAttackerHealth(life);
    //           // if (isP1Attacker || isP2Attacker) {
    //           //   const actions = document.getElementsByClassName('actions')[0];
    //           //   actions.style.display = 'flex';
    //           // }
    //         }
    //         else if (target == 'defender') {
    //           setDefenderDefense(defense);
    //           setDefenderHealth(life);
    //           // if (!isP1Attacker || !isP2Attacker) {
    //           //   const actions = document.getElementsByClassName('actions')[0];
    //           //   actions.style.display = 'flex';
    //           // }
    //         }
    //         setTurn(next_target);
    //         setTurnCount(turn_count);
    //         console.log("TurnCount:", turn_count);
    //         // const actions = document.getElementsByClassName('actions')[0];
    //         // actions.style.display = 'flex';
    //         break;
    //       default:
    //         console.warn(`Evento no reconocido: ${type}`);
    //     }
    //   } catch (error) {
    //     console.error('Error al procesar el mensaje:', error);
    //   }
    // };    
  
    // // Suscribirse a los mensajes WebSocket
    // webSocketService.addListener('updatePieceStatus', handleWebSocketMessage);

    // return () => {
    //     webSocketService.removeListener('updatePieceStatus', handleWebSocketMessage);
    // };
  }, [turnCount]);

  // Función para escribir un mensaje en pantalla.
  const showMessage = (text) => {
    setMessage(text);
  };


  return (
    <div className="combat-modal-overlay">
      <div className="initial-message-container">
        <h2>⚔️ ¡Batalla épica! ⚔️</h2>
      </div>

      {message && (
        <div className="combat-message-temp">
          <p>{message}</p>
        </div>
      )}

      <div className="grid-combat-modal">
        { loading ? (
          <></>
        ) : (
          <>
            <div className="grid-item attacker">
              <div className='life'>
                <p><b>{attackerPiece.hp} HP</b></p>
                <span className='life_bar'>
                  <span className='life_bar_content' style={{height: `${(attackerHealth / attackerPiece.hp) * 100}%`}}></span>
                </span>
                <p><b>{attackerHealth} HP</b></p>
              </div>
              {/* <h3>Atacante: {attackerPiece.typeShow} {attackerPiece.colorShow}</h3> */}
              <div className="piece-container">
                <Piece
                  id={`${attackerPiece.type}_${attackerPiece.color}`}
                  color={attackerPiece.color}
                  piece={attackerPiece.type}
                  className="piece-attacker idle"
                />
                <table className="combat-stats-tooltip">
                  <tr>
                    <td>Vida:</td>
                    <td>{attackerHealth} / {attackerPiece.hp}</td>
                  </tr>
                  <tr>
                    <td>Defensa:</td>
                    <td>{attackerDefense} / {attackerPiece.defense}</td>
                  </tr>
                  <tr>
                    <td>Daño:</td>
                    <td>{attackerPiece.attack} / {attackerPiece.attack}</td>
                  </tr>
                </table>
              </div>
            </div>
            
            <div className="grid-item defender">
            <div id='defender_life_container' className='life'>
                <p><b>{defenderPiece.hp} HP</b></p>
                <span className='life_bar'>
                  <span className='life_bar_content' style={{height: `${(defenderHealth / defenderPiece.hp) * 100}%`}}></span>
                </span>
                <p><b>{defenderHealth} HP</b></p>
              </div>
              {/* <h3>Defensor: {defenderPiece.typeShow} {defenderPiece.colorShow}</h3> */}
              <div className="piece-container">
                <Piece
                  id={`${defenderPiece.type}_${defenderPiece.color}`}
                  color={defenderPiece.color}
                  piece={defenderPiece.type}
                  className="piece-defender idle"
                />
                <table className="combat-stats-tooltip">
                  <tr>
                    <td>Vida:</td>
                    <td>{defenderHealth} / {defenderPiece.hp}</td>
                  </tr>
                  <tr>
                    <td>Defensa:</td>
                    <td>{defenderDefense} / {defenderPiece.defense}</td>
                  </tr>
                  <tr>
                    <td>Daño:</td>
                    <td>{defenderPiece.attack} / {defenderPiece.attack}</td>
                  </tr>
                </table>
              </div>
            </div>
              {attackerHealth > 0 && defenderHealth > 0 ? (
                <div className="grid-item actions">
                  <button className="combat-button attack-button" onClick={handleAttack}>
                    {turn === 'attacker' ? '⚔️ Atacar' : '🛡️ Defender'}
                  </button>
                  <button
                    className="combat-button resilience-button"
                    onClick={handleResilience}
                    disabled={
                      (turn === 'attacker' && attackerResilienceUsed[0]) ||
                      (turn === 'defender' && defenderResilienceUsed[0])
                    }
                  >
                    🛡️ Resiliencia
                  </button>
                  <button
                    className="combat-button breaker-button"
                    onClick={handleBreaker}
                    disabled={
                      (turn === 'attacker' && attackerBreakerUsed[0]) ||
                      (turn === 'defender' && defenderBreakerUsed[0])
                    }
                  >
                    ⚒️ Quebranta hombres
                  </button>
                  {/* <button className="combat-button exit-button" onClick={() => onClose(null)}>
                    💀 Huir
                  </button> */}
                </div>
              ) : (
                <div className="combat-result">
                  {/* <h3>
                {attackerHealth <= 0
                  ? `${defenderPiece.typeShow} ${defenderPiece.colorShow} ganó 🏆`
                  : `${attackerPiece.typeShow} ${attackerPiece.colorShow} ganó 🏆`}
              </h3> */}
                </div>
              )}
          </>
        )}

      </div>
    </div>
  );
};

export default CombatModal;
