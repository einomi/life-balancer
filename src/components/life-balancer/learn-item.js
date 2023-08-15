import { playSound } from '../../js/utils/play-sound';
import DiceRoll from '../dice-roll/dice-roll';

const LOCAL_STORAGE_KEY = 'life-balancer.learn-item';
const CLICK_SOUND = '/click.wav';
const clickAudio = new Audio(CLICK_SOUND);

class LearnItem {
  /**
   * @param {import('./learn-item-type').LearnItemType} data
   */
  constructor(data) {
    this.id = data.id;
    this.value = 0;

    this.element = /** @type {HTMLElement} */ (
      document.querySelector(`[data-learn-item="${data.id}"]`)
    );
    if (!this.element) {
      throw new Error(`Element with data-learn-item="${data.id}" not found`);
    }
    this.valuesElement = /** @type {HTMLElement} */ (
      this.element.querySelector('[data-values]')
    );
    this.diceButton = /** @type {HTMLElement} */ (
      this.element.querySelector('[data-dice]')
    );

    this.buttonPlus = /** @type {HTMLButtonElement} */ (
      this.element.querySelector('[data-button-plus]')
    );
    this.buttonMinus = /** @type {HTMLButtonElement} */ (
      this.element.querySelector('[data-button-minus]')
    );

    // for each item id create a record in local storage if it doesn't exist
    this.localStorageKey = `${LOCAL_STORAGE_KEY}.${data.id}`;
    const localStorageValue = localStorage.getItem(this.localStorageKey);
    if (!localStorageValue) {
      this.saveStateToLocalStorage();
    } else {
      this.value = Number(localStorageValue);
    }

    if (this.valuesElement.children && this.valuesElement.children.length > 0) {
      this.onUpdate();
    }

    this.addEvents();
  }

  addEvents() {
    this.buttonPlus.addEventListener('click', () => {
      this.playClickSound();
      this.increment();
    });

    this.buttonMinus.addEventListener('click', () => {
      this.playClickSound();
      this.decrement();
    });

    this.diceButton.addEventListener('click', () => {
      const percentageOfCompleted =
        this.value / this.valuesElement.children.length;
      const diceRoll = new DiceRoll(percentageOfCompleted);
      diceRoll.show();
      this.diceButton.classList.add('_disabled');
      diceRoll.onDestroy(() => {
        this.diceButton.classList.remove('_disabled');
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

  increment() {
    if (this.value >= this.valuesElement.children.length) {
      return;
    }
    this.value += 1;
    this.saveStateToLocalStorage();

    this.onUpdate();
  }

  saveStateToLocalStorage() {
    localStorage.setItem(this.localStorageKey, String(this.value));
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
      this.buttonPlus.classList.add('_disabled');
    } else {
      this.buttonPlus.classList.remove('_disabled');
    }
    if (this.value <= 0) {
      this.buttonMinus.classList.add('_disabled');
    } else {
      this.buttonMinus.classList.remove('_disabled');
    }
    if (this.value > 0) {
      this.diceButton.classList.add('_active');
    } else {
      this.diceButton.classList.remove('_active');
    }
  }
}

export default LearnItem;