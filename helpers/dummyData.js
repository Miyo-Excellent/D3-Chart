import { randomDate, randomValue } from './index.js';

export function generateProjections() {
    var projections = [];
    for (var i = 0; i < 10; i++) {
        var year = 2023 + i; // Año en el que se genera la proyección
        var minPrice = randomValue(0, 80000); // Entre 0 y 80000
        var maxPrice = randomValue(minPrice, minPrice + 20000); // Entre minPrice y minPrice + 20000
        projections.push({
            minPrice: minPrice,
            maxPrice: maxPrice,
            startTime: new Date(year, 0, 1), // Comienza en el inicio del año
            endTime: new Date(year, 11, 31), // Termina al final del año
            //random name generator
            userName: 'Usuario ' + (i + 1),
            userAvatar: 'https://via.placeholder.com/32',
            userRole: 'Asesor de marketing digital',
            // random true or false
            userOne: Math.random() >= 0.5,
        });
    }
    return projections;
}


// Genera una fecha a partir de un número de días
export function generateDate(days) {
    var date = new Date(2021, 9, 1); // Comienza en 2021-10-01
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10); // Retorna la fecha en formato YYYY-MM-DD
}

// Genera un valor aleatorio entre min y max
export function generateValue(min, max) {
    return Math.random() * (max - min) + min;
}

// Genera la data dummy
export function generateDummyData() {
    var data = { x: [], y: [] };
    for (var i = 0; i < 200; i++) {
        data.x.push(generateDate(i));
        data.y.push(generateValue(10000, 60000));
    }
    return data;
}