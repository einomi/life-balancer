import gsap from 'gsap';

class Settings {
  constructor() {
    this.popupElement = document.querySelector('[data-settings]');
    this.settingsButton = document.querySelector('[data-settings-button]');
    this.closeButton = document.querySelector('[data-settings-close]');

    this.settingsButton?.addEventListener('click', () => {
      this.open();
    });

    this.closeButton?.addEventListener('click', () => {
      this.close();
    });

    this.isOpened = false;
  }

  open() {
    gsap.to(this.popupElement, {
      duration: 0.5,
      autoAlpha: 1,
      ease: 'power1.out',
    });
  }

  close() {
    gsap.to(this.popupElement, {
      duration: 0.35,
      autoAlpha: 0,
      ease: 'power2.out',
    });
  }
}

new Settings();
