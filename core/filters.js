export const setContextFilter = (index) => {
    const contextButtons = document.querySelectorAll('#contextFilters button');
    contextButtons.forEach(button => button.classList.remove('active'));
    contextButtons[index].classList.add('active');
    console.log('Context filter changed to: ' + index);
    return index;  // Devuelve el índice del filtro de contexto seleccionado
};

export const setTimeFilter = (days) => {
    const timeButtons = document.querySelectorAll('#timeFilters button');
    timeButtons.forEach(button => button.classList.remove('active'));
    const matchingButton = Array.from(timeButtons).find(button => button.dataset.value == days);
    if (matchingButton) {
        matchingButton.classList.add('active');
    }
    console.log('Time filter changed to: ' + days);
    return days;  // Devuelve el número de días del filtro de tiempo seleccionado
};
