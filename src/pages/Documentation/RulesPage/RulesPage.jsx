import React from 'react';
import './RulesPage.css'
import '../Documentation.css'
import { themeClicked } from '../Functions';

const RulesPage = () => {

  return (
    <section className='docs_div'>

      <h1 className='docs_title'>Reglas</h1>

      {/* General */}
      <article className="main_theme_box">

        <header id='head_caracteristicas_generales' className="head" onClick={() => themeClicked('caracteristicas_generales')}>
          <h2>Características generales</h2>
          <button id='button_caracteristicas_generales' className='head_button'></button>
        </header>

        <div id='caracteristicas_generales' className="content collapsed">

          <div id='head_flujo_partida' className='head' onClick={() => themeClicked('flujo_partida')}>
            <h3>Flujo de partida</h3>
            <button id='button_flujo_partida' className='head_button'></button>
          </div>

          <div id='flujo_partida' className='content collapsed'>

            <div className='text'>

              <p>
              El juego se desarrollará en un tablero de 8x8, con las piezas bases del 
              Ajedrez clásico, con la diferencia de que las casillas afectarán en el 
              desarrollo y el desempeño de una partida. Cada pieza tiene atributos únicos 
              como puntos de vida (HP), puntos de ataque (DMG) y puntos de defensa (DFS), 
              lo que permite que los enfrentamientos y ataque entre piezas no se resuelvan 
              instantáneamente.<br />
              Al estar en el rango de ataque al inicio del turno, el jugador que posee el 
              turno puede decidir si iniciar el combate o no, en donde si decide iniciar 
              el combate los jugadores entrarán en un sistema de combate por turnos, el cual, 
              solo involucra una pieza contra contra. En este combate, la pieza atacante iniciará 
              con ventaja sobre la pieza atacada, pero esto no significa que su victoria este 
              asegurada, puesto que a diferencia de el Ajedrez clásico, los enfrentamientos no 
              se resuelven instantáneamente, y aunque la pieza atacante tenga la ventaja, la 
              otra pieza perfectamente puede poseer mejores atributos u otros factores decisivos 
              que causen que esta salga victoriosa y elimine a la pieza atacante.<br />
              Ahondando más en el sistema de combate por turnos, este sistema involucra el 
              combate entre unicamente dos piezas del tablero como se mencionó anteriormente, 
              en donde estas piezas pueden ser de un mismo tipo o diferente, ya sea un peón, 
              torre, alfíl, entre otras. En el combate las piezas pueden únicamente atacar, 
              aumentar sus puntos de defensa, dismunuir los puntos de denfensa de la pieza enemiga 
              y lanzar una habilidad única correspondiente al tipo de pieza, pero esta última 
              solo puede ser lanzada una vez por pieza durante toda la sesión.<br />
              Además, en relación al tablero, este contiene diferentes tipos de casillas. Estas 
              casillas atribuyen ciertas características a la primera pieza que se pare sobre ella.<br />
              Finalmente, es importante mencionar el como finalizará una partida. Una partida 
              se dará por finalizada cuando la pieza Rey de alguno de los dos jugadores sea 
              eliminada, es decir, a diferencia de el Ajedrez clásico en donde basta con realizar 
              un jaque mate para terminar el juego, en AkingDrez la pieza Rey se comporta igual 
              que todas las demás, lo que quiere decir, que para eliminarla se debe iniciar un 
              combate contra esta y ganarle. Cabe recalcar, que para iniciar un combate basta con 
              que una pieza se encuentre en el rango de ataque de otra al inicio de un turno. 
              Además, cuando se ingrese a un combate este únicamente finalizará cuando una pieza 
              pierda todos sus puntos de vida, o con la única excepción de que una pieza en el 
              combate sea un peón y utilice su habilidad única para escapar del combate.<br />
              </p>

            </div>


          </div>

          <div id='head_caracteristicas' className='head' onClick={() => themeClicked('caracteristicas')}>
            <h3>Características</h3>
            <button id='button_caracteristicas' className='head_button'></button>
          </div>

          <div id='caracteristicas' className='content collapsed'>

            <div className='text'>

              <p>
                El rango de movimiento, rango de ataque y la regla de transformación
                de los peones al llegar a la casilla inicial del oponente, se mantienen 
                sin cambios con respecto al Ajedrez casual, por lo que no se indagará 
                sobre ello en las características siguientes. <br />
                Además, en el juego existe la mecánica para acertar golpes críticos 
                y fallar ataques. Estos golpes críticos equivalen a un aumento del 70% 
                de los puntos de ataque actual de la pieza, y la probabilidad de fallar 
                ataques equivale a un 30%. <br />
              </p>

            </div>

          </div>

        </div>

      </article>

      {/* Piezas */}
      <article className='main_theme_box'>

        <header id='head_caracteristicas_piezas' className='head' onClick={() => themeClicked('caracteristicas_piezas')}>
          <h2>Características de las piezas</h2>
          <button id='button_caracteristicas_piezas' className='head_button'></button>
        </header>

        <div id='caracteristicas_piezas' className='content collapsed'>

          <ul>

            {/* Peon */}
            <li>
              <div id='head_peon_description' className='head' onClick={() => themeClicked('peon_description')}>
                <h3>Peón</h3>
                <button id='button_peon_description' className='head_button'></button>
              </div>

              <div id='peon_description' className='content collapsed'>

                <div className='text piece_details'>

                  <p>
                    Es la pieza más débil del juego, pero también a la que más provecho 
                    se le puede sacar.
                  </p>
                  <ul>
                    <div className='stats'>
                      <li><h4>Puntos de vida</h4> 15</li>
                      <li><h4>Puntos de defensa</h4> 5</li>
                      <li><h4>Puntos de ataque</h4> 5</li>
                    </div>

                    <div className='unique_skill'>

                      <li className='skill_title'><h4>Habilidad única:</h4> &nbsp; <em>Escape furtivo</em></li>
                      <ul>
                        <li>
                          <div className='skill_description'>

                            <h5>Descripción:</h5>
                            <p>
                            El peón escapa del combate, moviéndose a la siguiente casilla 
                            disponible dentro del perímetro en 1 unidad. Prioriza las casillas 
                            en dirección al campo enemigo. Si una casilla está ocupada, busca 
                            en la siguiente disponible. Si las 8 casillas alrededor están ocupadas, 
                            el peón no puede activar la habilidad.
                            </p>

                          </div>
                        </li>
                      </ul>

                    </div>
                  </ul>

                </div>

              </div>
            </li>

            {/* Alfil */}
            <li>
              <header id='head_alfil_description' className='head' onClick={() => themeClicked('alfil_description')}>
                <h3>Alfíl</h3>
                <button id='button_alfil_description' className='head_button'></button>
              </header>

              <div id='alfil_description' className='content collapsed'>

                <div className='text piece_details'>

                  <p>
                  Es la pieza con más daño del juego, pero no cuenta con mucha puntos de vida 
                  y puntos de defensa.
                  </p>
                  <ul>
                    <div className='stats'>
                      <li><h4>Puntos de vida</h4> 30</li>
                      <li><h4>Puntos de defensa</h4> 5</li>
                      <li><h4>Puntos de ataque</h4> 40</li>
                    </div>

                    <div className='unique_skill'>

                      <li className='skill_title'><h4>Habilidad única:</h4> &nbsp; <em>Filo imparable</em></li>
                      <ul>
                        <li>
                          <div className='skill_description'>

                            <h5>Descripción:</h5>
                            <p>
                              El alfíl con su gran velocidad y destreza ataca con su lanza a la pieza 
                              oponente directo en un punto vital, acertándole un golpe crítico potenciado 
                              equivalente a un aumento del 100% de sus puntos de ataque actuales.
                            </p>

                          </div>
                        </li>
                      </ul>

                    </div>
                  </ul>

                </div>

              </div>
            </li>

            {/* Caballo */}
            <li>
              <header id='head_horse_description' className='head' onClick={() => themeClicked('horse_description')}>
                <h3>Caballo</h3>
                <button id='button_horse_description' className='head_button'></button>
              </header>
              
              <div id='horse_description' className='content collapsed'>

                <div className='text piece_details'>

                  <p>
                  Es la pieza más ágil del juego, además de contar con un gran daño y movilidad.
                  </p>
                  <ul>
                    <div className='stats'>
                      <li><h4>Puntos de vida</h4> 50</li>
                      <li><h4>Puntos de defensa</h4> 30</li>
                      <li><h4>Puntos de ataque</h4> 25</li>
                    </div>

                    <div className='unique_skill'>

                      <li className='skill_title'><h4>Habilidad única:</h4> &nbsp; <em>Carga con alabarda</em></li>
                      <ul>
                        <li>
                          <div className='skill_description'>

                            <h5>Descripción:</h5>
                            <p>
                              El jinete carga con su alabarda y con una gran embestida ataca a la 
                              pieza oponente, ignorando el 50% de su defensa en el <strong>turno actual</strong>. 
                              Además reduce en un 30% su defensa de <strong>forma permanente</strong> durante 
                              el resto del juego.
                            </p>

                          </div>
                        </li>
                      </ul>

                    </div>
                  </ul>

                </div>

              </div>
            </li>

            {/* Rey */}
            <li>
              <header id='head_king_description' className='head' onClick={() => themeClicked('king_description')}>
                <h3>Rey</h3>
                <button id='button_king_description' className='head_button'></button>
              </header>

              <div id='king_description' className='content collapsed'>

                <div className='text piece_details'>

                  <p>
                  Es la pieza más importante del juego, siendo el estratega y líder de todas las piezas. 
                  Cuenta con estadísticas balanceadas y apoyo moral para sus aliados.
                  </p>
                  <ul>
                    <div className='stats'>  
                      <li><h4>Puntos de vida</h4> 70</li>
                      <li><h4>Puntos de defensa</h4> 50</li>
                      <li><h4>Puntos de ataque</h4> 30</li>
                    </div>

                    <div className='unique_skill'>

                      <li className='skill_title'><h4>Habilidad única:</h4> &nbsp; <em>Grito de batalla</em></li>
                      <ul>
                        <li>
                          <div className='skill_description'>

                            <h5>Descripción:</h5>
                            <p>
                              El rey realiza un grito alentador de batalla, el cual otorga un aumento en las 
                              estadísticas de las piezas que se encuentren alrededor de este en el perímetro 
                              de 1 casilla. Se aumenta los puntos de vida, puntos de defensa y puntos ataque en 
                              un 30% de las <strong>estadísticas base</strong> de la pieza aliada durante el resto del juego.
                            </p>

                          </div>
                        </li>
                      </ul>

                    </div>
                  </ul>

                </div>

              </div>
            </li>

            {/* Reina */}
            <li>
              <header id='head_queen_description' className='head' onClick={() => themeClicked('queen_description')}>
                <h3>Reina</h3>
                <button id='button_queen_description' className='head_button'></button>
              </header>

              <div id='queen_description' className='content collapsed'>

                <div className='text piece_details'>

                  <p>
                  Es la pieza protectora del rey, y al igual que el mítico ajedrez, impone con solo mirarla.
                  </p>
                  <ul>
                    <div className='stats'>
                      <li><h4>Puntos de vida</h4> 80</li>
                      <li><h4>Puntos de defensa</h4> 40</li>
                      <li><h4>Puntos de ataque</h4> 35</li>
                    </div>

                    <div className='unique_skill'>

                      <li className='skill_title'><h4>Habilidad única:</h4> &nbsp; <em>Dominancia bruta</em></li>
                      <ul>
                        <li>
                          <div className='skill_description'>

                            <h5>Descripción:</h5>
                            <p>
                              La reina se aprovecha del momento de vulnerabilidad de la pieza oponente, 
                              que es cuando este tiene menos puntos de vida, y lo amenaza por convertirlo en su 
                              aliado. Este tiene una probabilidd de <strong>((Puntos de vida máximos del 
                              enemigo - Puntos de vida actual del enemigo) / Puntos de vida máximos del 
                              enemigo) * 100</strong> de ser dominado.
                            </p>

                          </div>
                        </li>
                      </ul>

                    </div>
                  </ul>

                </div>

              </div>
            </li>

            {/* Torre */}
            <li>
              <header id='head_tower_description' className='head' onClick={() => themeClicked('tower_description')}>
                <h3>Torre</h3>
                <button id='button_tower_description' className='head_button'></button>
              </header>

              <div id='tower_description' className='content collapsed'>

                <div className='text piece_details'>
                  
                  <p>
                  Es la pieza con mayor puntos de vida y puntos de defensa del juego, ninguna pieza 
                  puede traspasar sus grandes muros e imponente defensa.
                  </p>
                  <ul>
                    <div className='stats'>
                      <li><h4>Puntos de vida</h4> 100</li>
                      <li><h4>Puntos de defensa</h4> 80</li>
                      <li><h4>Puntos de ataque</h4> 5</li>
                    </div>

                    <div className='unique_skill'>

                      <li className='skill_title'><h4>Habilidad única:</h4> &nbsp; <em>Torre de Babel</em></li>
                      <ul>
                        <li>
                          <div className='skill_description'>

                            <h5>Descripción:</h5>
                            <p>
                              Los puntos de vida y puntos de defensa de la torre aumentan en un 70% de sus 
                              estadísticas base durante 3 turnos del combate actual. Además, se aumenta los 
                              puntos de defensa de las piezas que se encuentren alrededor de esta en el 
                              perímetro de 1 casilla en un 30% de la defensa base de la pieza aliada durante 
                              los siguientes 3 turnos del jugador de la partida actual.
                            </p>

                          </div>
                        </li>
                      </ul>

                    </div>
                  </ul>

                </div>

              </div>
            </li>

          </ul>
          
        </div>

      </article>

      {/* Casillas */}
      <article className='main_theme_box'>

        <header id='head_caracteristicas_casillas' className='head' onClick={() => themeClicked('caracteristicas_casillas')}>
          <h2>Caraterísticas de las casillas</h2>
          <button id='button_caracteristicas_casillas' className='head_button'></button>
        </header>

        <div id='caracteristicas_casillas' className='content collapsed'>

          <div className='text'>
            
            <p>
            Las casillas en AKingDrez a diferencia de el Ajedrez clásico pueden tener diferentes 
            carácterísticas y cualidades, pudiendo estas aumentar los puntos de vida, puntos de 
            defensa y puntos de daño de una pieza, pero nunca disminuir algun atributo.<br />
            Estas casillas aparecerán en las coordenadas correspondientes solo si no existe 
            ninguna pieza antes en esta.<br />
            Para describir este tipo de casillas únicas usaremos un sistema de coordenadas 
            alfanuméricas, identificando primero una letra (columna) y un número (fila):<br />
            </p>
            <ul>
              <li>Columnas (verticales): Se identifican con letras, desde la a hasta la h.</li>
              <li>Fila (horizontales): Se identifican con números, desde el 1 al 8.</li>
            </ul>

          </div>

          {/* Casillas de vida */}
          <ul>
            <li>
              <header id='head_life_square_description' className='head' onClick={() => themeClicked('life_square_description')}>
                <h3>Casillas de vida</h3>
                <button id='button_life_square_description' className='head_button'></button>
              </header>

              <div id='life_square_description' className='content collapsed'>

                <div className='text'>
              
                  <p>
                  La pieza que se encuentra en la casilla recupera puntos de vida equivalente 
                  al 20% de su vida base, si ya tiene sus puntos de vida máximos, esta 
                  casilla no causa efecto.<br />
                  Esta casilla luego de ser utilizada por la pieza se consume y se convierte 
                  en una casilla común.<br />
                  </p>
                  <ul>
                    <li>
                      <h4>Aparición:</h4>
                      <p>
                      Estas casillas aparecerán en los turnos múltiples de 8, es decir, 
                      el turno 8, turno 16, etc.
                      </p>
                    </li>
                    <li><h4>Coordenadas:</h4> (d4, e5)</li>
                  </ul>

                </div>

              </div>
            </li>
          </ul>

          {/* Casillas de defensa */}
          <ul>
            <li>
              <header id='head_defense_square_description' className='head' onClick={() => themeClicked('defense_square_description')}>
                <h3>Casilllas de defensa</h3>
                <button id='button_defense_square_description' className='head_button'></button>
              </header>

              <div id='defense_square_description' className='content collapsed'>

                <div className='text'>
              
                  <p>
                  La pieza que se encuentra en la casilla aumenta un 20% sus puntos 
                  de defensa base.<br />
                  Esta casilla luego de ser utilizada por la pieza se consume y se 
                  convierte en una casilla común.<br />
                  </p>
                  <ul>
                    <li>
                      <h4>Aparición:</h4>
                      <p>
                      Estas casillas aparecerán en los turnos múltiples de 8, 
                      es decir, el turno 8, turno 16, etc.
                      </p>
                    </li>
                    <li><h4>Coordenadas:</h4> (d5, e4)</li>
                  </ul>

                </div>

              </div>
            </li>
          </ul>

          {/* Casillas de ataque */}
          <ul>
            <li>
              <header id='head_attack_square_description' className='head' onClick={() => themeClicked('attack_square_description')}>
                <h3>Casilllas de ataque</h3>
                <button id='button_attack_square_description' className='head_button'></button>
              </header>

              <div id='attack_square_description' className='content collapsed'>

                <div className='text'>
              
                  <p>
                  La pieza que se encuentra en la casilla aumenta 
                  un 20% sus puntos de ataque base.<br />
                  Esta casilla luego de ser utilizada por la pieza se consume y 
                  se convierte en una casilla común.<br />
                  </p>
                  <ul>
                    <li>
                      <h4>Aparición:</h4>
                      <p>
                      Estas casillas aparecerán en los turnos múltiples de 8, 
                      es decir, el turno 8, turno 16, etc.
                      </p>
                    </li>
                    <li><h4>Coordenadas:</h4> (b4, g5)</li>
                  </ul>

                </div>

              </div>
            </li>
          </ul>

        </div>

      </article>

      {/* Fórmulas */}
      <article className='main_theme_box'>

        <header id='head_formulas' className='head' onClick={() => themeClicked('formulas')}>
          <h2>Fórmulas</h2>
          <button id='button_formulas' className='head_button'></button>
        </header>

        <div id='formulas' className='content collapsed'>

          <div className='text'>
            
            <ul>
              <li>
                <h3>Consumo de vida:</h3>
                <p>
                Daño recibido = Daño del atacante * 
                (1 - (Puntos de defensa del defensor / (Puntos de defensa 
                del defensor + 100)))
                </p>
              </li>
              <li>
                <h3>Dominación del enemigo (habilidad única de la reina):</h3>
                <p>
                Probabilidad de dominación (%) = ((Vida máxima del 
                enemigo - Vida actual del enemigo) / Vida máxima del enemigo) * 100
                </p>
              </li>
            </ul>

          </div>
          
        </div>

      </article>

      {/* Habilidades */}
      <article className='main_theme_box'>

        <header id='head_habilidades' className='head' onClick={() => themeClicked('habilidades')}>
          <h2>Habilidades disponibles en combate</h2>
          <button id='button_habilidades' className='head_button'></button>
        </header>

        <div id='habilidades' className='content collapsed'>

          <div className='text'>
            
            <ul>
              <li>
                <h3>Ataque básico:</h3> (Puntos de ataque pieza)
              </li>
              <li>
                <h3>Resiliencia:</h3>
                <p>
                Aumenta un 15% la defensa actual de la pieza durante 2 turnos del 
                combate actual. Solo se puede utilizar una vez por combate.
                </p>
              </li>
              <li>
                <h3>Quebranta hombres:</h3>
                <p>
                Disminuye un 15% la defensa actual de la pieza oponente durante 
                2 turnos del combate actual. Solo se puede utilizar una vez por combate.
                </p>
              </li>
              <li>
                <h3>Habilidad única:</h3> (Habilidad única de la pieza)
              </li>
            </ul>

          </div>
          
        </div>

      </article>

    </section>
  );
}

export default RulesPage;