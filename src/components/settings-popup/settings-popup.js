import { emitter } from '../../js/emitter';
import { getActivitiesData } from '../../js/utils/get-activities-data';

class SettingsPopup {
  constructor() {
    this.element = /** @type {HTMLElement} */ (
      document.querySelector('[data-popup="settings"]')
    );
    this.activitiesContainer = /** @type {HTMLElement} */ (
      this.element.querySelector('[data-settings-activities]')
    );
    this.buttonAddActivity = /** @type {HTMLButtonElement} */ (
      this.element.querySelector('[data-settings-activities-add]')
    );

    this.buttonAddActivity?.addEventListener(
      'click',
      /** @param {MouseEvent} event */ (event) => {
        event.preventDefault();
        emitter.emit('activity:add');
      }
    );

    emitter.on('activitiesDataInitialized', () => {
      this.renderActivities();
    });

    emitter.on('activities:rerender', () => {
      this.renderActivities();
    });
  }

  renderActivities() {
    this.activitiesContainer.innerHTML = '';
    const data = getActivitiesData();
    data.forEach((activity) => {
      const activityElement = document.createElement('div');
      activityElement.classList.add('settings__activity');
      activityElement.innerHTML = `
        <div class="popup__activity-inner flex flex-col sm:flex-row sm:space-x-5 items-center relative justify-center sm:flex-wrap">
          <div class="popup__activity-cell"><span class="popup__activity-highlight">ID:</span> <span class="popup__activity-value">${activity.id}</span></div>
          <div class="popup__activity-cell"><span class="popup__activity-highlight">Title:</span> <span class="popup__activity-value">${activity.name}</span></div>
          <div class="popup__activity-cell"><span class="popup__activity-highlight">Sessions:</span> <span class="popup__activity-value">${activity.sessions}</span></div>
          <div class="popup__activity-buttons sm:absolute right-0 flex items-center space-x-2">
            <button class="popup__button-activity square-button" data-popup-open="activity-edit" data-activity-id="${activity.id}">
              <img width="16" src="/pen.svg" alt="">
            </button>
            <button class="popup__button-activity square-button _danger" data-settings-activity-remove>
              <img width="16" src="/cross.svg" alt="">
            </button>
          </div>
        </div>
      `;

      this.activitiesContainer.appendChild(activityElement);

      const buttonEdit = /** @type {HTMLButtonElement} */ (
        activityElement.querySelector('[data-popup-open="activity-edit"]')
      );

      buttonEdit?.addEventListener(
        'click',
        /** @param {MouseEvent} event */ (event) => {
          event.preventDefault();
          emitter.emit('activity:edit', activity.id);
        }
      );

      const buttonRemove = /** @type {HTMLButtonElement} */ (
        activityElement.querySelector('[data-settings-activity-remove]')
      );

      buttonRemove?.addEventListener(
        'click',
        /** @param {MouseEvent} event */ (event) => {
          event.preventDefault();
          event.stopPropagation();
          // TODO: refactor, remove confirm
          // eslint-disable-next-line no-alert
          const confirmed = confirm(
            'Are you sure you want to remove this activity?'
          );

          if (confirmed) {
            emitter.emit('activity:remove', activity.id);
            emitter.emit('activities:rerender');
          }
        }
      );
    });

    emitter.emit('activities:rerendered');
  }
}

new SettingsPopup();
