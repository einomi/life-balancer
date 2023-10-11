import gsap from 'gsap';

import { emitter } from '../../js/emitter';
import { getActivitiesData } from '../../js/utils/get-activities-data';

class Settings {
  constructor() {
    this.popupElement = /** @type {HTMLElement} */ (
      document.querySelector('[data-settings]')
    );
    this.boxElement = this.popupElement.querySelector('[data-settings-box]');
    this.settingsButton = document.querySelector('[data-settings-button]');
    this.closeButtons = document.querySelectorAll('[data-settings-close]');
    this.activitiesContainer = /** @type {HTMLElement} */ (
      this.popupElement.querySelector('[data-settings-activities]')
    );

    this.settingsButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      this.open();
    });

    this.closeButtons?.forEach((closeButton) => {
      closeButton?.addEventListener('click', (event) => {
        event.stopPropagation();
        this.close();
      });
    });

    document.addEventListener(
      'click',
      /** @param {MouseEvent} event */ (event) => {
        event.stopPropagation();
        // @ts-ignore
        if (this.isOpened && !this.boxElement.contains(event.target)) {
          this.close();
        }
      }
    );

    emitter.on('activitiesDataInitialized', () => {
      this.renderActivities();
    });

    emitter.on('activities:rerender', () => {
      this.renderActivities();
    });

    this.isOpened = false;

    this.open();
  }

  open() {
    if (this.isOpened) {
      return;
    }
    gsap.fromTo(
      this.popupElement,
      { y: 20 },
      {
        y: 0,
        duration: 0.35,
        autoAlpha: 1,
        ease: 'sine.out',
      }
    );
    this.isOpened = true;
  }

  close() {
    if (!this.isOpened) {
      return;
    }
    gsap.to(this.popupElement, {
      duration: 0.3,
      autoAlpha: 0,
      ease: 'power2.out',
      y: 35,
    });
    this.isOpened = false;
  }

  renderActivities() {
    this.activitiesContainer.innerHTML = '';
    const data = getActivitiesData();
    data.forEach((activity) => {
      const activityElement = document.createElement('div');
      activityElement.classList.add('settings__activity');
      activityElement.innerHTML = `
        <div class="settings__activity-inner flex space-x-5 items-center relative">
          <div class="settings__activity-cell"><span class="settings__activity-highlight">ID:</span> <span class="settings__activity-value">${activity.id}</span></div>
          <div class="settings__activity-cell"><span class="settings__activity-highlight">Title:</span> <span class="settings__activity-value">${activity.title}</span></div>
          <div class="settings__activity-cell"><span class="settings__activity-highlight">Sessions:</span> <span class="settings__activity-value">${activity.sessions}</span></div>
          <div class="settings__activity-buttons absolute right-0 flex items-center space-x-2">
            <button class="settings__button-activity square-button">
              <img width="16" src="/pen.svg" alt="">
            </button>
            <button class="settings__button-activity square-button _danger" data-settings-activity-remove>
              <img width="16" src="/cross.svg" alt="">
            </button>
          </div>
        </div>
      `;
      this.activitiesContainer.appendChild(activityElement);
      const buttonRemove = /** @type {HTMLButtonElement} */ (
        activityElement.querySelector('[data-settings-activity-remove]')
      );
      buttonRemove?.addEventListener(
        'click',
        /** @param {MouseEvent} event */ (event) => {
          event.preventDefault();
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
  }
}

new Settings();
