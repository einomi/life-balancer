import { getActivityValueFromStorage } from '../../js/utils/get-activity-value-from-storage';
import { LOCAL_STORAGE_ACTIVITIES_KEY } from '../../js/utils/constants';

import Activity from './activity';

import '../money/money';
import '../shop/shop';
import '../inventory/inventory';
import '../settings/settings';

class LifeBalancer {
  constructor() {
    this.handleActivitiesData();
    this.activitiesContainer = /** @type {HTMLElement} */ (
      document.querySelector('[data-activities]')
    );

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
    totalHoursElement.textContent = Number.isNaN(totalHours)
      ? 0
      : String(totalHours);

    this.activityTemplate = /** @type {HTMLTemplateElement} */ (
      document.querySelector('#activity-template')
    );

    this.renderActivities();
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
    return JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_ACTIVITIES_KEY) || '[]'
    );
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

  renderActivities() {
    this.activities.forEach((activity) => {
      // clone template
      const activityElement = this.activityTemplate.content.cloneNode(true);

      // set activity name
      const activityNameElement = activityElement.querySelector('[data-title]');
      activityNameElement.textContent = activity.title;

      this.activitiesContainer.appendChild(activityElement);
    });
  }
}

export default new LifeBalancer();
