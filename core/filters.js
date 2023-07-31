// Filtrar por usuario
function filterByUser(projections, userName) {
    return projections.filter(projection => projection.userName === userName);
}

// Filtrar por proyecciones positivas
function filterPositiveProjections(projections, lastPrice) {
    return projections.filter(projection => projection.minPrice > lastPrice);
}

// Filtrar por proyecciones negativas
function filterNegativeProjections(projections, lastPrice) {
    return projections.filter(projection => projection.maxPrice < lastPrice);
}

// Filtrar por fecha, solo se muestran proyecciones que finalizan antes de la fecha dada
function filterByEndDate(projections, endDate) {
    return projections.filter(projection => new Date(projection.endTime) <= new Date(endDate));
}

// Filtrar proyecciones que comienzan después de una fecha dada
function filterByStartDate(projections, startDate) {
    return projections.filter(projection => new Date(projection.startTime) >= new Date(startDate));
}

// Filtrar proyecciones que tienen un precio mínimo mayor que un valor dado
function filterByMinPrice(projections, minPrice) {
    return projections.filter(projection => projection.minPrice > minPrice);
}

// Filtrar proyecciones que tienen un precio máximo menor que un valor dado
function filterByMaxPrice(projections, maxPrice) {
    return projections.filter(projection => projection.maxPrice < maxPrice);
}

// Filtrar proyecciones cuya duración es menor que un número dado de días
function filterByDuration(projections, maxDays) {
    return projections.filter(projection => (new Date(projection.endTime) - new Date(projection.startTime)) / (1000 * 60 * 60 * 24) < maxDays);
}

// Filtrar proyecciones cuyo rango de precios (maxPrice - minPrice) es mayor que un valor dado
function filterByPriceRange(projections, minRange) {
    return projections.filter(projection => (projection.maxPrice - projection.minPrice) > minRange);
}

// Filtrar proyecciones que se solapan con un periodo de tiempo dado
function filterByOverlap(projections, periodStart, periodEnd) {
    return projections.filter(projection => new Date(projection.startTime) < new Date(periodEnd) && new Date(projection.endTime) > new Date(periodStart));
}
