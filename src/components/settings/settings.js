import gsap from 'gsap';

class Settings {
  constructor() {
    this.popupElement = /** @type {HTMLElement} */ (
      document.querySelector('[data-settings]')
    );
    this.boxElement = this.popupElement.querySelector('[data-settings-box]');
    this.settingsButton = document.querySelector('[data-settings-button]');
    this.closeButtons = document.querySelectorAll('[data-settings-close]');

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
}

new Settings();
