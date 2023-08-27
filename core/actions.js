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