import gsap, { Power1, Power2 } from 'gsap';

import { playSound } from '../../js/utils/play-sound';
import { emitter } from '../../js/emitter';

const DICE_ROLL_SOUND = '/dice-roll.mp3';
const diceRollAudio = new Audio(DICE_ROLL_SOUND);

const COINS_FALLING_SOUND = '/coins-falling.mp3';
const coinsFallingAudio = new Audio(COINS_FALLING_SOUND);

class DiceRoll {
  /** @param {number} percentageOfCompleted */
  constructor(percentageOfCompleted) {
    this.container = /** @type {HTMLElement} */ (
      document.querySelector('[data-dice-roll-container]')
    );
    this.boxElement = /** @type {HTMLElement} */ (
      this.container.querySelector('[data-dice-box]')
    );
    this.requiredNumberElement = /** @type {HTMLElement} */ (
      this.container.querySelector('[data-dice-required-number]')
    );
    this.numberElement = /** @type {HTMLElement} */ (
      this.container.querySelector('[data-dice-number]')
    );
    this.moneyContainerElement = /** @type {HTMLElement} */ (
      this.container.querySelector('[data-dice-money-container]')
    );
    this.closeButtonElement = /** @type {HTMLElement} */ (
      this.container.querySelector('[data-dice-close-button]')
    );
    this.noRewardElement = /** @type {HTMLElement} */ (
      this.container.querySelector('[data-dice-no-reward]')
    );
    this.buttonRoll = /** @type {HTMLButtonElement} */ (
      this.container.querySelector('[data-dice-button-roll]')
    );
    this.buttonOkay = /** @type {HTMLButtonElement} */ (
      this.container.querySelector('[data-dice-button-okay]')
    );
    this.moneyAmountElement = /** @type {HTMLElement} */ (
      this.container.querySelector('[data-dice-money-amount]')
    );

    this.percentageOfCompleted = percentageOfCompleted;

    this.handleRollClick = () => {
      this.roll();
    };
    this.handleCloseClick = () => {
      this.hide();
    };

    this.handleDocumentKeyDown =
      /** @param {KeyboardEvent} event */
      (event) => {
        if (event.key === 'Escape') {
          this.hide();
        }
      };

    this.requiredDiceRollNumber = 999;
    this.amountOfMoney = 0;

    this.addEvents();
  }

  addEvents() {
    this.buttonRoll.addEventListener('click', this.handleRollClick);
    this.closeButtonElement.addEventListener('click', this.handleCloseClick);
    this.buttonOkay.addEventListener('click', this.handleCloseClick);
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  removeEvents() {
    this.buttonRoll.removeEventListener('click', this.handleRollClick);
    this.closeButtonElement.removeEventListener('click', this.handleCloseClick);
    this.buttonOkay.removeEventListener('click', this.handleCloseClick);
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  playDiceRollSound() {
    playSound(diceRollAudio);
  }

  show() {
    this.requiredDiceRollNumber =
      20 - Math.round(this.percentageOfCompleted * 20) + 5;
    this.requiredNumberElement.innerHTML = String(this.requiredDiceRollNumber);

    gsap.fromTo(
      this.container,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.35, ease: Power1.easeOut }
    );
    gsap.fromTo(
      this.boxElement.children,
      { alpha: 0 },
      {
        alpha: 1,
        duration: 0.35,
        ease: Power1.easeOut,
        stagger: 0.1,
      }
    );
  }

  roll() {
    this.buttonRoll.disabled = true;
    gsap.to(this.buttonRoll, { duration: 0.35, autoAlpha: 0 });

    this.numberElement.classList.add('_rolling');

    this.playDiceRollSound();

    let shouldGiveReward = false;

    function getRandomD20Number() {
      return Math.round(Math.random() * 20 + 1);
    }

    const diceRollNumber = getRandomD20Number();

    if (diceRollNumber > 1 && diceRollNumber >= this.requiredDiceRollNumber) {
      shouldGiveReward = true;
    }

    if (shouldGiveReward) {
      this.amountOfMoney = Math.round(diceRollNumber * 10 + 130);
      this.moneyAmountElement.innerHTML = String(this.amountOfMoney);

      setTimeout(() => {
        playSound(coinsFallingAudio);
        gsap.fromTo(
          [this.moneyContainerElement, this.buttonOkay],
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.2,
            ease: Power1.easeOut,
            delay: 0.7,
            stagger: 0.1,
          }
        );
      }, 1000);
    } else {
      setTimeout(() => {
        gsap.fromTo(
          [this.noRewardElement, this.buttonOkay],
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.2,
            ease: Power1.easeOut,
            stagger: 0.1,
          }
        );
      }, 500);
    }

    const progress = {
      value: 0,
    };

    let prevProgress = 0;

    this.numberElement.innerHTML = String(getRandomD20Number());
    gsap.to(progress, {
      value: 1,
      duration: 2,
      ease: Power2.easeOut,
      onUpdate: () => {
        if (progress.value - prevProgress < 0.05) {
          return;
        }
        prevProgress = progress.value;
        if (progress.value >= 0.95) {
          this.numberElement.innerHTML = String(diceRollNumber);
          this.numberElement.classList.remove('_rolling');
        } else {
          this.numberElement.innerHTML = String(getRandomD20Number());
        }
      },
    });

    return shouldGiveReward;
  }

  hide() {
    gsap.to(this.container, {
      autoAlpha: 0,
      duration: 0.1,
      ease: Power1.easeOut,
    });

    this.destroy();
  }

  destroy() {
    emitter.emit('diceRoll:destroy');
    this.buttonRoll.disabled = false;
    gsap.set(this.buttonRoll, { visibility: 'visible', alpha: 0 });
    gsap.set(this.moneyContainerElement, { autoAlpha: 0 });
    gsap.set(this.noRewardElement, { autoAlpha: 0 });
    gsap.set(this.buttonOkay, { autoAlpha: 0 });
    this.removeEvents();

    if (this.amountOfMoney) {
      emitter.emit('addMoney', this.amountOfMoney);
    }
  }

  /** @param {() => void} callback */
  onDestroy(callback) {
    emitter.on('diceRoll:destroy', callback);
  }
}

export default DiceRoll;
