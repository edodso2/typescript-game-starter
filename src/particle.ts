import { getRandomHexColor } from './utils';

export class Particle {
  pos = {
    top: 0,
    left: 0
  }
  element: HTMLElement;

  constructor() {
    this.element = this.createElement();
  }

  // TODO: repeated code in player and particle needs
  // refactoring into a class both can inherit
  createElement() {
    const particleElem = document.createElement('div');
    particleElem.setAttribute('class', 'particle');
    particleElem.style.backgroundColor = getRandomHexColor();
    document.body.appendChild(particleElem);

    return particleElem;
  }

  setPosition(top: number, left: number) {
    this.pos.top = top;
    this.pos.left = left;
    this.element.style.top = top + 'px';
    this.element.style.left = left + 'px';
  }

  destroy() {
    document.body.removeChild(this.element);
  }
}
