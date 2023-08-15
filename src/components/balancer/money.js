import gsap, { Power3 } from 'gsap';

import { emitter } from '../../js/emitter';

const LOCAL_STORAGE_KEY = 'life-balancer.money';

// money is kept as an array of integers
// the last element is the current value
// the rest are the history of changes

class Money {
  constructor() {
    this.value = this.getValue();
    if (this.value == null) {
      this.value = 0;
      this.setValue(this.value);
    }

    this.balanceElement = /** @type {HTMLElement} */ (
      document.querySelector('[data-money-balance]')
    );
    this.balanceElement.textContent = String(this.value);

    emitter.on(
      'addMoney',
      /** @param {number} amount */ (amount) => {
        this.addMoney(amount);
      }
    );
  }

  getValue() {
    const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localStorageValue) {
      return undefined;
    }
    const array = JSON.parse(localStorageValue);
    return array[array.length - 1];
  }

  /** @param {number} value */
  setValue(value, updateElement = true) {
    const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localStorageValue) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([value]));
      return;
    }
    const array = JSON.parse(localStorageValue);
    array.push(this.value);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(array));
    if (updateElement) {
      this.balanceElement.textContent = String(this.value);
    }
  }

  /** @param {number} amount */
  addMoney(amount) {
    const animationObj = {
      value: this.value,
    };

    this.value += amount;
    this.setValue(this.value, false);

    gsap.to(animationObj, {
      value: this.value,
      duration: 1,
      ease: Power3.easeInOut,
      onUpdate: () => {
        this.balanceElement.textContent = String(
          Math.round(animationObj.value)
        );
      },
    });
  }

  /** @param {number} amount */
  removeMoney(amount) {
    this.value -= amount;
    this.setValue(this.value);
  }
}

export default new Money();
