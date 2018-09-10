import * as firebase from 'firebase';

import { getRandomHexColor } from './utils';

interface EntityPosition {
  top: number;
  left: number;
}

const DEFAULT_POSITION = {
  top: 0,
  left: 0
};

export class Entity {
  ref: firebase.database.Reference;
  element: HTMLElement;
  pos: EntityPosition;

  constructor(pos?: EntityPosition, elemClass?: string) {
    // does not actually modify database. just returns a ref
    // to a firebase database object with a generated key.
    this.ref = firebase.database().ref().push();
    this.pos = pos || DEFAULT_POSITION;
    this.element = this.createHtmlElement(elemClass);
  }

  /**
   * Set Position
   * 
   * Sets the position of the player
   */
  setPosition(top: number, left: number) {
    this.pos.top = top;
    this.pos.left = left;
    this.element.style.top = top + 'px';
    this.element.style.left = left + 'px';
    this.updatePos(top, left);
  }

  /**
   * Destroy
   * 
   * Removes the object from the DOM and
   * the firebase DB
   */
  destroy() {
    document.body.removeChild(this.element);
    this.ref.remove();
  }

  /**
   * Update Position
   * 
   * Updates the position in firebase.
   * TODO: possibly move all firebase realted code
   * to one file.
   */
  private updatePos(top, left) {
    this.ref.set({
      top,
      left
    });
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
