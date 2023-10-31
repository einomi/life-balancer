import { playSound } from '../../js/utils/play-sound';
import DiceRoll from '../dice-roll/dice-roll';
import {
  getActivityValueFromStorage,
  setActivityValueToStorage,
} from '../../js/utils/get-activity-value-from-storage';

const CLICK_SOUND = '/click.wav';
const clickAudio = new Audio(CLICK_SOUND);

/**
 * @typedef {object} ActivityType
 * @property {string} id - The ID of the activity.
 * @property {string} name - The name of the activity.
 * @property {number} sessions - The sessions of the activity.
 * @property {number} value - The value associated with the activity.
 * @property {HTMLElement} element - The HTML element associated with the activity.
 * @property {HTMLElement} valuesElement - The HTML element containing values for the activity.
 * @property {HTMLElement} buttonIncrement - The HTML button for incrementing the activity value.
 * @property {HTMLElement} buttonDecremenet - The HTML button for decrementing the activity value.
 * @property {HTMLElement} buttonDice - The HTML button for rolling a dice.
 * @method {Function} addEvents - Add event listeners for buttons.
 * @method {Function} playClickSound - Play a click sound.
 * @method {Function} increment - Increment the activity value.
 * @method {Function} saveStateToLocalStorage - Save the activity state to local storage.
 * @method {Function} decrement - Decrement the activity value.
 * @method {Function} onUpdate - Update the UI based on the activity value.
 * @param {ActivityType} data - The data for the activity.
 */

/** @type {ActivityType} */
class Activity {
  /**
   * @param {import('./activity-type').ActivityType} data
   * @param {HTMLElement} element
   */
  constructor(data, element) {
    this.id = data.id;
    this.name = data.name;
    this.sessions = data.sessions;
    this.value = 0;

    this.element = element;
    if (!this.element) {
      console.error(`Element with data-activity="${data.id}" not found`);
      return;
    }
    this.valuesElement = /** @type {HTMLElement} */ (
      this.element.querySelector('[data-values]')
    );
    this.buttonDice = /** @type {HTMLElement} */ (
      this.element.querySelector('[data-button-dice]')
    );

    this.buttonIncrement = /** @type {HTMLButtonElement} */ (
      this.element.querySelector('[data-button-increment]')
    );
    this.buttonDecremenet = /** @type {HTMLButtonElement} */ (
      this.element.querySelector('[data-button-decrement]')
    );

    // for each item id create a record in local storage if it doesn't exist
    const localStorageValue = getActivityValueFromStorage(data.id);
    if (!localStorageValue) {
      this.saveStateToLocalStorage();
    } else {
      this.value = localStorageValue;
    }

    if (this.valuesElement.children && this.valuesElement.children.length > 0) {
      this.onUpdate();
    }

    this.addEvents();
  }

  addEvents() {
    this.buttonIncrement.addEventListener('click', () => {
      this.playClickSound();
      this.increment();
    });

    this.buttonDecremenet.addEventListener('click', () => {
      this.playClickSound();
      this.decrement();
    });

    this.buttonDice.addEventListener('click', () => {
      const percentageOfCompleted =
        this.value / this.valuesElement.children.length;
      const diceRoll = new DiceRoll(percentageOfCompleted);
      diceRoll.show();
      this.buttonDice.classList.add('_disabled');
      diceRoll.onDestroy(() => {
        this.buttonDice.classList.remove('_disabled');
      });
      diceRoll.onRollEnd(() => {
        this.value = 0;
        this.saveStateToLocalStorage();
        this.onUpdate();
      });
    });
  }

  playClickSound() {
    playSound(clickAudio);
  }

  saveStateToLocalStorage() {
    setActivityValueToStorage(this.id, this.value);
  }

  increment() {
    if (this.value >= this.valuesElement.children.length) {
      return;
    }
    this.value += 1;
    this.saveStateToLocalStorage();

    this.onUpdate();
  }

  decrement() {
    if (this.value <= 0) {
      return;
    }
    this.value -= 1;
    this.saveStateToLocalStorage();

    this.onUpdate();
  }

  onUpdate() {
    Array.from(this.valuesElement.children).forEach((child, index) => {
      if (index < this.value) {
        child.classList.add('_active');
      } else {
        child.classList.remove('_active');
      }
    });

    if (this.value >= this.valuesElement.children.length) {
      this.buttonIncrement.classList.add('_disabled');
    } else {
      this.buttonIncrement.classList.remove('_disabled');
    }
    if (this.value <= 0) {
      this.buttonDecremenet.classList.add('_disabled');
    } else {
      this.buttonDecremenet.classList.remove('_disabled');
    }
    if (this.value > 0) {
      this.buttonDice.classList.add('_active');
    } else {
      this.buttonDice.classList.remove('_active');
    }
  }
}

export default Activity;
