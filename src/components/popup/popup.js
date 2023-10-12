import gsap from 'gsap';

import { emitter } from '../../js/emitter';

class Popup {
  /**
   * @param {HTMLElement} element
   * @param {string} id
   * @param {NodeListOf<HTMLElement>} popupElements
   */
  constructor(element, id, popupElements) {
    this.element = element;
    this.id = id;
    this.boxElement = this.element.querySelector('[data-popup-box]');
    this.closeButtons = this.element.querySelectorAll('[data-popup-close]');
    this.popupElements = popupElements;
    this.popupElementsExceptThis = Array.from(this.popupElements).filter(
      (popupElement) => popupElement !== this.element
    );

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
        if (
          this.isOpened &&
          event.target &&
          !this.boxElement?.contains(event.target) &&
          !this.popupElementsExceptThis.some((popupElement) =>
            popupElement.contains(event.target)
          )
        ) {
          this.close();
        }
      }
    );

    emitter.on('activities:rerendered', () => {
      this.initOpenButtons();
    });

    this.initOpenButtons();

    this.isOpened = false;

    this.open();
  }

  initOpenButtons() {
    delete this.openButtons;
    this.openButtons = document.querySelectorAll(
      `[data-popup-open="${this.id}"]`
    );
    this.openButtons?.forEach((openButton) => {
      openButton?.addEventListener('click', (event) => {
        event.stopPropagation();
        this.open();
      });
    });
  }

  open() {
    if (this.isOpened) {
      return;
    }
    gsap.fromTo(
      this.element,
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
    gsap.to(this.element, {
      duration: 0.3,
      autoAlpha: 0,
      ease: 'power2.out',
      y: 35,
    });
    this.isOpened = false;
  }
}

class Popups {
  constructor() {
    this.elements = /** @type {NodeListOf<HTMLElement>} */ (
      document.querySelectorAll('[data-popup]')
    );

    this.elements.forEach((element) => {
      const id = element.dataset.popup;
      if (!id) {
        throw new Error('Popup id is not defined');
      }
      new Popup(element, id, this.elements);
    });
  }
}

new Popups();
