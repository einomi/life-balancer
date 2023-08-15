// TODO: get rid of alerts and confirms

import { emitter } from '../../js/emitter';
import { playCoinsFallingSound } from '../../js/utils/play-sound';

class Shop {
  constructor() {
    this.shopItems = /** @type {NodeListOf<HTMLElement>} */ (
      document.querySelectorAll('[data-shop-item]')
    );

    this.shopItems.forEach((element) => {
      element.addEventListener('click', () => {
        this.buyItem(element);
      });
    });
  }

  /** @param {HTMLElement} element */
  buyItem(element) {
    const price = Number(element.dataset.price);
    const id = element.dataset.id;
    if (isNaN(price)) {
      // eslint-disable-next-line no-alert
      alert('Error. No price for this item');
      return;
    }

    // eslint-disable-next-line no-alert
    const confirmed = confirm('Are you sure you want to buy this item?');

    if (confirmed) {
      emitter.emit('removeMoney', price);
      emitter.emit('itemBought', id);
      playCoinsFallingSound();
    }
  }
}

export default new Shop();
