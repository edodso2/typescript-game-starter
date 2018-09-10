import * as firebase from 'firebase';

import { getRandomHexColor } from './utils';

interface PlayerPosition {
  top: number;
  left: number;
}

export class Player {
  id: string;
  element: HTMLElement;
  pos: PlayerPosition

  constructor(id: string, pos: PlayerPosition) {
    this.id = id;
    this.pos = pos;
    this.element = this.createHtmlElement();
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
   * Update Position
   * 
   * Updates the position in firebase.
   * TODO: possibly move all firebase realted code
   * to one file.
   */
  private updatePos(top, left) {
    firebase.database().ref('/' + this.id).set({
      top,
      left
    });
  }

  /**
   * Create HTML Element
   * 
   * Creates an html element for the player.
   */
  private createHtmlElement(): HTMLElement {
    const playerElem = document.createElement('div');
    playerElem.setAttribute('class', 'player');
    playerElem.style.backgroundColor = getRandomHexColor();
    document.body.appendChild(playerElem);

    return playerElem;
  }
}