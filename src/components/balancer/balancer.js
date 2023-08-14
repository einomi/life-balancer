import LearnItem from './learn-item';
import './money';

class Balancer {
  constructor() {
    const learnItems =
      /** @type {Array<import('./learn-item-type').LearnItemType>} */ (
        // @ts-ignore
        // eslint-disable-next-line no-undef
        DATA.learn_items
      );
    this.learnItems = learnItems.map((item) => new LearnItem(item));

    const totalHours = learnItems.reduce((acc, item) => acc + item.hours, 0);
    const totalHoursElement = /** @type {HTMLElement} */ (
      document.querySelector('[data-total-hours]')
    );
    totalHoursElement.textContent = String(totalHours);
  }
}

export default new Balancer();
