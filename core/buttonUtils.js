/**
 * @function makeButtonActive
 * @description Makes a button active
 * @param {NodeList} buttons - List of buttons
 * @param {HTMLElement} clickedButton - Button that was clicked
 * @example
 * import { makeButtonActive } from './core/buttonUtils.js';
 * 
 * const buttons = document.querySelectorAll('.left-group .btn');
 * 
 * buttons.forEach(btn => {
 *    btn.addEventListener('click', function () {
 *       makeButtonActive(buttons, this);
 *   }
 * });
 */
export function makeButtonActive(buttons, clickedButton) {
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    clickedButton.classList.add('active');
}

/**
 * @function addButtonListeners
 * @description Adds listeners to a group of buttons
 * @param {string} buttonGroupSelector - Selector of the group of buttons
 * @param {function} onClickCallback - Callback to execute when a button is clicked
 * @example
 * import { addButtonListeners } from './core/buttonUtils.js';
 * 
 * addButtonListeners('.left-group .btn');
 * 
 * // The callback function will receive the value of the button
 * // as the first parameter.
 */
export function addButtonListeners(buttonGroupSelector, onClickCallback) {
    const buttons = document.querySelectorAll(buttonGroupSelector);

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            makeButtonActive(buttons, this);
            onClickCallback(this.dataset.value);
        });
    });
}