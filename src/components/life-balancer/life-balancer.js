import { getActivityValueFromStorage } from '../../js/utils/get-activity-value-from-storage';
import { LOCAL_STORAGE_ACTIVITIES_KEY } from '../../js/utils/constants';
import '../money/money';
import '../shop/shop';
import '../inventory/inventory';
import '../settings/settings';
import { emitter } from '../../js/emitter';
import { getActivitiesData } from '../../js/utils/get-activities-data';

import Activity from './activity';

class LifeBalancer {
  constructor() {
    this.initActivitiesData();
    this.activitiesContainer = /** @type {HTMLElement} */ (
      document.querySelector('[data-activities]')
    );

    this.activitiesData =
      /** @type {Array<import('./activity-type').ActivityType>} */ (
        getActivitiesData()
      );

    const totalHours = this.activitiesData.reduce(
      (acc, item) => acc + item.sessions,
      0
    );
    const totalHoursElement = /** @type {HTMLElement} */ (
      document.querySelector('[data-total-sessions]')
    );
    totalHoursElement.textContent = Number.isNaN(totalHours)
      ? '0'
      : String(totalHours);

    this.activityTemplate = /** @type {HTMLTemplateElement} */ (
      document.querySelector('#activity-template')
    );
    this.valueTemplate = /** @type {HTMLTemplateElement} */ (
      document.querySelector('#value-template')
    );

    this.renderActivities();
  }

  initActivitiesData() {
    const localStorageData = localStorage.getItem(LOCAL_STORAGE_ACTIVITIES_KEY);
    if (!localStorageData) {
      localStorage.setItem(
        LOCAL_STORAGE_ACTIVITIES_KEY,
        JSON.stringify(this.getDefaultActivitiesData())
      );
    }

    emitter.emit('activitiesDataInitialized');
  }

  getDefaultActivitiesData() {
    return /** @type {Array<import('./activity-type').ActivityType>} */ (
      // @ts-ignore
      // eslint-disable-next-line no-undef
      DATA.activities
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
    this.activitiesData.forEach((activity) => {
      // clone template
      const activityElement = /** @type {HTMLElement} */ (
        this.activityTemplate.content.cloneNode(true)
      );

      // set activity name
      const activityNameElement = /** @type {HTMLElement} */ (
        activityElement.querySelector('[data-title]')
      );
      activityNameElement.textContent = activity.title;

      const valuesContainer = /** @type HTMLElement */ (
        activityElement.querySelector('[data-values]')
      );

      new Array(activity.sessions).fill(null).forEach(() => {
        const valueElement = this.valueTemplate.content.cloneNode(true);
        valuesContainer.appendChild(valueElement);
      });

      new Activity(activity, activityElement);

      this.activitiesContainer.appendChild(activityElement);
    });
  }
}

export default new LifeBalancer();
