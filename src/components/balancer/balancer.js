/** @typedef LearnItemType
 * @property {string} id
 * @property {string} title
 * @property {number} hours
 * */

const LOCAL_STORAGE_KEY = 'life-balancer.learn-item';

class LearnItem {
  /**
   * @param {LearnItemType} data
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
    this.diceElement = /** @type {HTMLElement} */ (
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
      this.increment();
    });

    this.buttonMinus.addEventListener('click', () => {
      this.decrement();
    });
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
      this.diceElement.classList.add('_active');
    } else {
      this.buttonPlus.classList.remove('_disabled');
      this.diceElement.classList.remove('_active');
    }
    if (this.value <= 0) {
      this.buttonMinus.classList.add('_disabled');
    } else {
      this.buttonMinus.classList.remove('_disabled');
    }
  }
}

class Balancer {
  constructor() {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    const learnItems = /** @type {Array<LearnItemType>} */ (DATA.learn_items);
    this.learnItems = learnItems.map((item) => new LearnItem(item));

    const totalHours = learnItems.reduce((acc, item) => acc + item.hours, 0);
    const totalHoursElement = /** @type {HTMLElement} */ (
      document.querySelector('[data-total-hours]')
    );
    totalHoursElement.textContent = String(totalHours);
  }
}

export default new Balancer();
