import * as firebase from 'firebase';

import { getRandomHexColor } from './utils';

export interface EntityPosition {
  top: number;
  left: number;
}

const DEFAULT_POSITION = {
  top: 0,
  left: 0
};

/**
 * The base entity class. Everything shown on the screen
 * is derived from this class in some way.
 */
export class Entity {
  element: HTMLElement;
  pos: EntityPosition;

  constructor(pos?: EntityPosition, elemClass?: string) {
    this.pos = pos || DEFAULT_POSITION;
    this.element = this.createHtmlElement(elemClass);

    this.setPosition(this.pos.top, this.pos.left);
  }

  /**
   * Set Position
   * Sets the position of an entity.
   * @param top distance of entity from the top of the screen
   * @param left distance of entity from the left of the screen
   */
  setPosition(top: number, left: number) {
    this.pos.top = top;
    this.pos.left = left;
    this.element.style.top = top + 'px';
    this.element.style.left = left + 'px';
  }

  /**
   * Destroy
   * 
   * Removes the object from the DOM and
   * the firebase DB
   */
  destroy() {
    document.body.removeChild(this.element);
  }

  /**
   * Create HTML Element
   * 
   * Creates an html element for the player.
   */
  private createHtmlElement(elemClass): HTMLElement {
    const playerElem = document.createElement('div');
    playerElem.setAttribute('class', elemClass);
    playerElem.style.backgroundColor = getRandomHexColor();
    document.body.appendChild(playerElem);

    return playerElem;
  }
}
