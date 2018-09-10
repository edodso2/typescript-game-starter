import { Player } from './player';
import { Particle } from './particle';

const ARROW_KEYS = {
  UP: '38',
  DOWN: '40',
  LEFT: '37',
  RIGHT: '39'
};

export class PlayerListener {
  player: Player;

  // the interval for moving the player as long as the
  // a key is pressed
  movingInterval;

  // the keys currently pressed
  pressedKeys = new Set();

  constructor(player) {
    this.player = player;
    document.addEventListener('keydown', this.startMoving.bind(this));
    document.addEventListener('keyup', this.stopMoving.bind(this));
  }

  private startMoving(e) {
    e = e || window.event;

    let top = this.player.pos.top;
    let left = this.player.pos.left;

    const key = e.keyCode.toString();

    // add the key to the array if its a directional key
    if (
      ARROW_KEYS.UP === key ||
      ARROW_KEYS.DOWN === key ||
      ARROW_KEYS.LEFT === key ||
      ARROW_KEYS.RIGHT === key
    ) {
      this.pressedKeys.add(key);
    }

    // needed to prevent memory leaks when multiple
    // intervals are set
    clearInterval(this.movingInterval);

    this.movingInterval = setInterval(() => {
      ({ top, left } = this.updateCoords(this.pressedKeys, top, left));
      this.player.setPosition(top, left);
    }, 5);

    // space bar click
    if(e.keyCode == 32){
     this.shootParticle();
    }
  }

  private stopMoving(e) {
    // remove the key that was released from the array if it 
    // is in the array
    this.pressedKeys.delete(e.keyCode.toString());
    
    // if no keys in array clear the interval
    if (this.pressedKeys.size === 0) {
      clearInterval(this.movingInterval);
    }
  }

  private shootParticle() {
    // get starting position of particle
    let top = this.player.pos.top + 2.5;
    let left = this.player.pos.left + 2.5;

    // create particle
    const particleElem = new Particle({ top, left});

    // get current keys pressed when particle fired
    const currentKeys = new Set(this.pressedKeys);

    // just shoot up for now if not moving
    if (currentKeys.size === 0) {
      currentKeys.add('38');
    }

    const particleInterval = setInterval(() => {
      ({ top, left } = this.updateCoords(currentKeys, top, left));
      particleElem.setPosition(top, left); 
    }, 2);

    // the timeout is effectivly the distance the particle can be shot
    setTimeout(() => {
      clearInterval(particleInterval);
      particleElem.destroy();
    }, 1000);
  }

  private updateCoords(keys, top, left) {
    // up arrow
    if (keys.has(ARROW_KEYS.UP)) {
      top -= .5;
    }
    // down arrow
    if (keys.has(ARROW_KEYS.DOWN)) {
      top += .5;
    }
    // left arrow
    if (keys.has(ARROW_KEYS.LEFT)) {
      left -= .5;
    }
    // right arrow
    if (keys.has(ARROW_KEYS.RIGHT)) {
      left += .5;
    }

    return {
      top,
      left
    };
  }
}