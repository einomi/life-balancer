import { emitter } from '../../js/emitter';

const LOCAL_STORAGE_KEY = 'life-balancer.inventory';

class Inventory {
  constructor() {
    /** @type {string[]} */
    this.items = [];

    this.cellElements = /** @type {NodeListOf<HTMLElement>} */ (
      document.querySelectorAll('[data-inventory-cell]')
    );

    emitter.on('itemBought', (id) => {
      this.add(id);
    });

    this.init();

    this.maxItems = this.cellElements.length;

    this.cellElements.forEach((element) => {
      element.addEventListener('click', () => {
        if (!element.dataset.id) {
          return;
        }
        // eslint-disable-next-line no-alert
        const confirmed = confirm('Are you sure you want to remove this item?');

        if (confirmed) {
          this.remove(element.dataset.id);
        }
      });
    });
  }

  init() {
    const localStorageValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localStorageValue) {
      return;
    }
    this.items = JSON.parse(localStorageValue);
    this.updateCellElements();
  }

  /** @param {string} id */
  add(id) {
    this.items.push(id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.items));
    this.updateCellElements();
  }

  /** @param {string} id */
  remove(id) {
    this.items.splice(this.items.indexOf(id), 1);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.items));
    this.updateCellElements();
  }

  updateCellElements() {
    this.cellElements.forEach((element) => {
      const imgElement = element.querySelector('img');
      element.dataset.id = '';
      if (imgElement) {
        imgElement.remove();
      }
      const tooltipElement = /** @type {HTMLElement} */ (
        element.querySelector('[data-tooltip]')
      );
      tooltipElement.dataset.disabled = 'true';
      element.dataset.empty = 'true';
    });

    this.items.forEach((id, index) => {
      const element = this.cellElements[index];
      element.dataset.empty = 'false';
      const imgElement = document.createElement('img');
      imgElement.src = `/shop/${id}.png`;
      element.appendChild(imgElement);
      // eslint-disable-next-line no-undef
      const itemData = DATA.shop_items.find((item) => item.id === id);
      if (!itemData) {
        throw new Error(`Item with id ${id} not found`);
      }
      const tooltipElement = /** @type {HTMLElement} */ (
        element.querySelector('[data-tooltip]')
      );
      tooltipElement.dataset.disabled = 'false';
      const descriptionElement = /** @type {HTMLElement} */ (
        tooltipElement.querySelector('[data-tooltip-description]')
      );
      descriptionElement.innerHTML = itemData.description;
      const priceElement = /** @type {HTMLElement} */ (
        tooltipElement.querySelector('[data-tooltip-price]')
      );
      priceElement.textContent = String(itemData.price);

      element.dataset.id = id;
    });
  }

  getItems() {
    return this.items;
  }

  hasMaxItems() {
    return this.items.length >= this.maxItems;
  }
}

export default new Inventory();
