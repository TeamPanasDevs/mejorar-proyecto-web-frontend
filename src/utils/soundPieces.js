
// Sonido al seleccionar una pieza.
export const playSelectionSound = (type, color) => {
    // Declaramos audioSelection fuera de los bloques if/else
    let audioSelection;

    if (type == "knight" && color == "black") {
        audioSelection = `../../../../sounds/${type}_${color}.mp3`;
    } else {
        audioSelection = `../../../../sounds/${type}_${color}.wav`;
    }
    const audio = new Audio(audioSelection);
    audio.volume = 0.5;

    // Empezar desde un tiempo en específico.
    if (type == "knight"){
        audio.currentTime = 500 / 1000; // Comienza a los 500ms
    } else if (type == "rook" && color == "white") {
        audio.currentTime = 300 / 1000; // Comienza a los 1000
    }

    // Cortar el audio en un tiempo específico.
    if (type == "knight" && color == "black" || 
        type == "queen" && color == "white" ||
        type == "bishop" && color == "black") {
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, 1000);
    }

    audio.play();
};

// Sonido al capturar una pieza.
export const playCaptureSound = () => {
    const audioSelection = `../../../../sounds/capture.mp3`;
    const audio = new Audio(audioSelection);
    audio.volume = 0.5;
    audio.play();
};

// Sonido cuando una pieza es derrotada.
export const playDefeatSound = () => {
    const audioSelection = `../../../../sounds/defeat.wav`
    const audio = new Audio(audioSelection);
    audio.volume = 0.5;
    audio.play();
}