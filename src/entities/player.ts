import * as firebase from 'firebase';

import { PersistedEntity } from './persistedEntity';
import { EntityPosition } from './entity';

export class Player extends PersistedEntity {

  constructor(pos?: EntityPosition, ref?: firebase.database.Reference) {
    super(pos, 'player', ref);
  }
}