
const pieces_description = [
    [0, <p>
    {/* Peon */}
    <li>
        <h3>Peón</h3>
        <p>
        Es la pieza más débil del juego, pero también a la que más provecho 
        se le puede sacar.
        </p>
        <ul>
        <li><h4>Puntos de vida:</h4><br/>15</li>
        <li><h4>Puntos de defensa:</h4><br/>5</li>
        <li><h4>Puntos de ataque:</h4><br/>5</li>
        <li><h4>Habilidad única:</h4><br/>Escape furtivo</li>
        <ul>
            <li>
            <h4>Descripción:</h4>
            <p>
            El peón escapa del combate, moviéndose a la siguiente casilla 
            disponible dentro del perímetro en 1 unidad. Prioriza las casillas 
            en dirección al campo enemigo. Si una casilla está ocupada, busca 
            en la siguiente disponible. Si las 8 casillas alrededor están ocupadas, 
            el peón no puede activar la habilidad.
            </p>
            </li>
        </ul>
        </ul>
    </li>
    </p>],

    [100, <p>
    {/* Alfil */}
    <li>
        <h3>Alfíl</h3>
        <p>
        Es la pieza con más daño del juego, pero no cuenta con mucha puntos de vida 
        y puntos de defensa.
        </p>
        <ul>
        <li><h4>Puntos de vida:</h4><br/>30</li>
        <li><h4>Puntos de defensa:</h4><br/>5</li>
        <li><h4>Puntos de ataque:</h4><br/>40</li>
        <li><h4>Habilidad única:</h4><br/>Filo imparable</li>
        <ul>
            <li>
            <h4>Descripción:</h4>
            <p>
            El alfíl con su gran velocidad y destreza ataca con su lanza a la pieza 
            oponente directo en un punto vital, acertándole un golpe crítico potenciado 
            equivalente a un aumento del 100% de sus puntos de ataque actuales.
            </p>
            </li>
        </ul>
        </ul>
    </li>
    </p>],

    [200, <p>
    {/* Caballo */}
    <li>
        <h3>Caballo</h3>
        <p>
        Es la pieza más ágil del juego, además de contar con un gran daño y movilidad.
        </p>
        <ul>
        <li><h4>Puntos de vida:</h4><br/>50</li>
        <li><h4>Puntos de defensa:</h4><br/>30</li>
        <li><h4>Puntos de ataque:</h4><br/>25</li>
        <li><h4>Habilidad única:</h4><br/>Carga con alabarda</li>
        <ul>
            <li>
            <h4>Descripción:</h4>
            <p>
            El jinete carga con su alabarda y con una gran embestida ataca a la 
            pieza oponente, ignorando el 50% de su defensa en el <strong>turno actual</strong>. 
            Además reduce en un 30% su defensa de <strong>forma permanente</strong> durante 
            el resto del juego.
            </p>
            </li>
        </ul>
        </ul>
    </li>
    </p>],

    [300, <p>
    {/* Rey */}
    <li>
        <h3>Rey</h3>
        <p>
        Es la pieza más importante del juego, siendo el estratega y líder de todas las piezas. 
        Cuenta con estadísticas balanceadas y apoyo moral para sus aliados.
        </p>
        <ul>
        <li><h4>Puntos de vida:</h4><br/>70</li>
        <li><h4>Puntos de defensa:</h4><br/>50</li>
        <li><h4>Puntos de ataque:</h4><br/>30</li>
        <li><h4>Habilidad única:</h4><br/>Grito de batalla</li>
        <ul>
            <li>
            <h4>Descripción:</h4>
            <p>
            El rey realiza un grito alentador de batalla, el cual otorga un aumento en las 
            estadísticas de las piezas que se encuentren alrededor de este en el perímetro 
            de 1 casilla. Se aumenta los puntos de vida, puntos de defensa y puntos ataque en 
            un 30% de las <strong>estadísticas base</strong> de la pieza aliada durante el resto del juego.
            </p>
            </li>
        </ul>
        </ul>
    </li>
    </p>],

    [400, <p>
    {/* Reina */}
    <li>
        <h3>Reina</h3>
        <p>
        Es la pieza protectora del rey, y al igual que el mítico ajedrez, impone con solo mirarla.
        </p>
        <ul>
        <li><h4>Puntos de vida:</h4><br/>80</li>
        <li><h4>Puntos de defensa:</h4><br/>40</li>
        <li><h4>Puntos de ataque:</h4><br/>35</li>
        <li><h4>Habilidad única:</h4><br/>Dominancia bruta</li>
        <ul>
            <li>
            <h4>Descripción:</h4>
            <p>
            La reina se aprovecha del momento de vulnerabilidad de la pieza oponente, 
            que es cuando este tiene menos puntos de vida, y lo amenaza por convertirlo en su 
            aliado. Este tiene una probabilidd de <strong>((Puntos de vida máximos del 
                enemigo - Puntos de vida actual del enemigo) / Puntos de vida máximos del 
                enemigo) * 100</strong> de ser dominado.
            </p>
            </li>
        </ul>
        </ul>
    </li>
    </p>],

    [500, <p>
    {/* Torre */}
    <li>
        <h3>Torre</h3>
        <p>
        Es la pieza con mayor puntos de vida y puntos de defensa del juego, ninguna pieza 
        puede traspasar sus grandes muros e imponente defensa.
        </p>
        <ul>
        <li><h4>Puntos de vida:</h4><br/>100</li>
        <li><h4>Puntos de defensa:</h4><br/>80</li>
        <li><h4>Puntos de ataque:</h4><br/>5</li>
        <li><h4>Habilidad única:</h4><br/>Torre de Babel</li>
        <ul>
            <li>
            <h4>Descripción:</h4>
            <p>
            Los puntos de vida y puntos de defensa de la torre aumentan en un 70% de sus 
            estadísticas base durante 3 turnos del combate actual. Además, se aumenta los 
            puntos de defensa de las piezas que se encuentren alrededor de esta en el 
            perímetro de 1 casilla en un 30% de la defensa base de la pieza aliada durante 
            los siguientes 3 turnos del jugador de la partida actual.
            </p>
            </li>
        </ul>
        </ul>
    </li>
    </p>],
];

export default pieces_description;