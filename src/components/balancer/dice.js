import gsap, { Power1, Power3 } from 'gsap';

import { playSound } from '../../js/utils/play-sound';

const DICE_ROLL_SOUND = '/dice-roll.mp3';
const diceRollAudio = new Audio(DICE_ROLL_SOUND);

class Dice {
  constructor() {
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
    this.closeButtonElement.addEventListener('click', () => {
      this.hide();
    });
  }

  playDiceRollSound() {
    playSound(diceRollAudio);
  }

  /** @param {number} percentageOfCompleted */
  roll(percentageOfCompleted) {
    gsap.fromTo(
      this.container,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.35, ease: Power1.easeOut }
    );
    gsap.fromTo(
      this.boxElement.children,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.35,
        ease: Power1.easeOut,
        stagger: 0.1,
      }
    );

    this.playDiceRollSound();

    const requiredDiceRollNumber =
      20 - Math.round(percentageOfCompleted * 20) + 5;

    this.requiredNumberElement.innerHTML = String(requiredDiceRollNumber);

    let shouldGiveMoney = false;

    function getRandomD20Number() {
      return Math.round(Math.random() * 20 + 1);
    }

    const diceRollNumber = getRandomD20Number();

    if (diceRollNumber > 1 && diceRollNumber >= requiredDiceRollNumber) {
      shouldGiveMoney = true;
    }

    // const amountOfMoney = Math.round(diceRollNumber * 10 + 130);

    const progress = {
      value: 0,
    };

    let prevProgress = 0;

    this.numberElement.innerHTML = String(getRandomD20Number());
    gsap.to(progress, {
      value: 1,
      duration: 2,
      ease: Power3.easeOut,
      onUpdate: () => {
        if (progress.value - prevProgress < 0.05) {
          return;
        }
        prevProgress = progress.value;
        if (progress.value >= 0.95) {
          this.numberElement.innerHTML = String(diceRollNumber);
        } else {
          this.numberElement.innerHTML = String(getRandomD20Number());
        }
      },
    });

    return shouldGiveMoney;
  }

  hide() {
    gsap.to(this.container, {
      autoAlpha: 0,
      duration: 0.1,
      ease: Power1.easeOut,
    });
  }
}

export default new Dice();
