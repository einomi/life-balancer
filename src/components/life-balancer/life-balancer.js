import { getActivityValueFromStorage } from '../../js/utils/get-activity-value-from-storage';
import { LOCAL_STORAGE_ACTIVITIES_KEY } from '../../js/utils/constants';

import Activity from './activity';

import '../money/money';
import '../shop/shop';
import '../inventory/inventory';

class LifeBalancer {
  constructor() {
    this.handleActivitiesData();

    this.activitiesData =
      /** @type {Array<import('./activity-type').ActivityType>} */ (
        this.getActivitiesData()
      );

    this.activities = this.activitiesData.map((item) => new Activity(item));

    const totalHours = this.activitiesData.reduce(
      (acc, item) => acc + item.sessions,
      0
    );
    const totalHoursElement = /** @type {HTMLElement} */ (
      document.querySelector('[data-total-sessions]')
    );
    totalHoursElement.textContent = String(totalHours);
  }

  handleActivitiesData() {
    const localStorageData = localStorage.getItem(LOCAL_STORAGE_ACTIVITIES_KEY);
    if (!localStorageData) {
      localStorage.setItem(
        LOCAL_STORAGE_ACTIVITIES_KEY,
        JSON.stringify(this.getDefaultActivitiesData())
      );
    }
  }

  getDefaultActivitiesData() {
    return /** @type {Array<import('./activity-type').ActivityType>} */ (
      // @ts-ignore
      // eslint-disable-next-line no-undef
      DATA.activities
    );
  }

  getActivitiesData() {
    return localStorage.getItem(LOCAL_STORAGE_ACTIVITIES_KEY) || [];
  }

  getActivitiesWithValues() {
    return this.activitiesData.map((item) => {
      return {
        ...item,
        value: getActivityValueFromStorage(item.id),
      };
    });
  }

  getWorstActivity() {
    return this.getActivitiesWithValues().reduce((acc, item) => {
      if (item.value < acc.value) {
        return item;
      }
      return acc;
    });
  }
}

export default new LifeBalancer();
