export function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().slice(0, 10);
}

// Función para generar un valor aleatorio entre min y max
export function randomValue(min, max) {
    return Math.random() * (max - min) + min;
}