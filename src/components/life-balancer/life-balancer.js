import { getLearnItemValueFromStorage } from '../../js/utils/get-learn-item-value-from-storage';

import LearnItem from './learn-item';

import '../money/money';
import '../shop/shop';
import '../inventory/inventory';

class LifeBalancer {
  constructor() {
    this.learnItemsData =
      /** @type {Array<import('./learn-item-type').LearnItemType>} */ (
        // @ts-ignore
        // eslint-disable-next-line no-undef
        DATA.learn_items
      );
    this.learnItems = this.learnItemsData.map((item) => new LearnItem(item));

    const totalHours = this.learnItemsData.reduce(
      (acc, item) => acc + item.hours,
      0
    );
    const totalHoursElement = /** @type {HTMLElement} */ (
      document.querySelector('[data-total-hours]')
    );
    totalHoursElement.textContent = String(totalHours);
  }

  getLearnItemsWithValues() {
    return this.learnItemsData.map((item) => {
      return {
        ...item,
        value: getLearnItemValueFromStorage(item.id),
      };
    });
  }

  getWorstLearnItem() {
    return this.getLearnItemsWithValues().reduce((acc, item) => {
      if (item.value < acc.value) {
        return item;
      }
      return acc;
    });
  }
}

export default new LifeBalancer();
