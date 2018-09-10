import { getRandomHexColor } from './utils';
import { Entity } from './entity';

export class Particle extends Entity {
  constructor(pos) {
    super(pos, 'particle');
  }
}
