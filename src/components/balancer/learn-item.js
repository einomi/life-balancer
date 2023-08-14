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
    const key = `${LOCAL_STORAGE_KEY}.${data.id}`;
    const localStorageValue = localStorage.getItem(key);
    if (!localStorageValue) {
      localStorage.setItem(key, String(this.value));
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
      this.playClickSound();
      this.rollDice();
    });
  }

  playClickSound() {
    clickAudio.pause();
    clickAudio.currentTime = 0;
    clickAudio.play();
  }

  increment() {
    if (this.value >= this.valuesElement.children.length) {
      return;
    }
    this.value += 1;
    localStorage.setItem(`${LOCAL_STORAGE_KEY}.${this.id}`, String(this.value));

    this.onUpdate();
  }

  decrement() {
    if (this.value <= 0) {
      return;
    }
    this.value -= 1;
    localStorage.setItem(`${LOCAL_STORAGE_KEY}.${this.id}`, String(this.value));

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

  rollDice() {
    // to implement
  }
}

export default LearnItem;
