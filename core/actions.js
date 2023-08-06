// crear proyeccion de estimacion del precio de una moneda
// se necesitan 4 valores de entrada
// 1. precio maximo de la estimacion
// 2. precio minimo de la estimacion
// 3. fecha de inicio de la estimacion
// 4. fecha de fin de la estimacion
// extra: id usuario y id moneda. obtenidos por contexto? token? bubble.io?
export function createProjection(minPrice, maxPrice, startTime, endTime, userId, coinId) {

    if (minPrice > maxPrice) {
        throw new Error("minPrice debe ser menor que maxPrice");
    }

    if (startTime > endTime) {
        throw new Error("startTime debe ser menor que endTime");
    }

    var data = {
        minPrice: parseInt(minPrice),
        maxPrice: parseInt(maxPrice),
        startTime: Date.parse(startTime),
        endTime: Date.parse(endTime),
        userId: parseInt(userId),
        coinId: parseInt(coinId)
    };

    return data;
}


// eliminar proyeccion de estimacion del precio de una moneda
// se necesita el id de la proyeccion

// editar proyeccion de estimacion del precio de una moneda
// se necesita el id de la proyeccion y los 4 valores de entrada
// 1. precio maximo de la estimacion
// 2. precio minimo de la estimacion
// 3. fecha de inicio de la estimacion
// 4. fecha de fin de la estimacion