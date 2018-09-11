import * as firebase from 'firebase';

import { Entity, EntityPosition } from "./entity";

/**
 * A persisted entity is updated in the database
 * as well as displayed on the screen.
 */
export class PersistedEntity extends Entity {
  ref: firebase.database.Reference;

  constructor(pos?: EntityPosition, elemClass?: string, ref?: firebase.database.Reference) {
    super(pos, elemClass);
    // does not actually modify database. just returns a ref
    // to a firebase database object with a generated key.
    this.ref = ref || firebase.database().ref().push();
    this.setPersistedPosition(this.pos.top, this.pos.left);
  }

  /**
   * Set Persisted Position
   * Sets the position of an entity and persists the position
   * in the DB.
   * @param top distance of entity from the top of the screen
   * @param left distance of entity from the left of the screen
   */
  setPersistedPosition(top: number, left: number) {
    super.setPosition(top, left);
    this.persistPos(top, left);
  }

  /**
   * Destroy
   * 
   * Removes the object from the DOM and
   * the firebase DB
   */
  destroy() {
    super.destroy();
    this.ref.remove();
  }

  /**
  * Persist Position
  * 
  * Persists the position in firebase.
  * TODO: possibly move all firebase realted code
  * to one file.
  */
  private persistPos(top, left) {
    this.ref.set({
      top,
      left
    });
  }
}
