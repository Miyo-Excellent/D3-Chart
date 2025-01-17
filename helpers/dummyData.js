import { randomValue } from './index.js';

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

export const generateDummyProjectionsData = (startDate, endDate, valorActual) => {
    const proyecciones = [];
    const meses = [];

    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        meses.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Desordenar el array de meses para elegir aleatoriamente
    meses.sort(() => 0.5 - Math.random());

    for (let i = 0; i < 20 && meses[i]; i++) {
        let min, max, inicioPeriodo, finPeriodo;

        if (i < 15) {
            // Proyecciones con periodos y valores aleatorios
            max = valorActual + Math.random() * (87.9 * 1000 - valorActual);
            min = Math.random() * max;
            inicioPeriodo = new Date(meses[i].getFullYear(), meses[i].getMonth(), 1);
            finPeriodo = new Date(meses[i].getFullYear(), meses[i].getMonth() + 1, 0);
        } else {

            // con i = 20 1 normal, 1 doble overflow, 2 top overflow y 1 right overflow
            // Proyecciones con fechas y valores fijos
            min = max = valorActual + Math.random() * (87.9 * 1000 - valorActual)
            inicioPeriodo = finPeriodo = new Date(meses[i]);

            // testing purposes, uncomment for overflows
            if (i > 15) {
                if (i % 2 === 0) {
                    min = max = 900000;
                } else {
                    inicioPeriodo.setFullYear(inicioPeriodo.getFullYear() + 10);
                    finPeriodo.setFullYear(finPeriodo.getFullYear() + 10);
                }

                if (i > 18) {
                    min = max = 400000;
                    inicioPeriodo.setFullYear(inicioPeriodo.getFullYear() + 10);
                    finPeriodo.setFullYear(finPeriodo.getFullYear() + 10);
                }
            }
        }

        proyecciones.push({
            min_value: min,
            max_value: max,
            start_date: inicioPeriodo.toISOString().split('T')[0],
            end_date: finPeriodo.toISOString().split('T')[0]
        });
    }

    // Ordenar por fecha de inicio
    proyecciones.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    return proyecciones;
};
