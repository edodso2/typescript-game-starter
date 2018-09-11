import * as firebase from 'firebase';
import { config } from './config';
import { Player } from './entities/player';
import { PlayerListener } from './playerListener';
import { Entity } from './entities/entity';

/**
 * Game Class
 * 
 * Core game logic goes here.
 */
export class Game {
  app: firebase.app.App;

  /**
   * The key of the current player
   */
  currentPlayer;

  /**
   * Array of all the players other then the current player
   */
  playerEntities: { key: string, player: Entity }[];

  constructor() {
    // init
    this.playerEntities = [];

    // try to get the app if it doesn't exist then
    // create it. This is needed to prevent errors on 
    // page refresh. Maybe firebase does some caching?
    try {
      this.app = firebase.app();
    } catch (err) {
      this.app = firebase.initializeApp(config);
    }

    const ref = firebase.database().ref();

    // create user's player
    this.createPlayer()

      // then set the current player value
      // to the key of the new player
      .then(key => {
        this.currentPlayer = key;
      })

      // then get current database value
      .then(() => ref.once('value'))

      // then load the other players
      .then(snapshot => this.addPlayers(snapshot.val()))

      // then sub to realtime updates of the other players
      // from the database
      .then(() => {
        ref.on('child_changed', snapshot => {
          this.updatePlayer(snapshot.key, snapshot.val());
        });
      });
  }

  /**
   * Create Player
   * 
   * Creates a player for the user
   */
  private createPlayer() {
    // Create a player for the user
    let newPlayer;
    const key = localStorage.getItem('PLAYER_KEY');
    const ref = firebase.database().ref(key);

    return this.getCurrentPlayer(ref, key)
      .then(player => {
        newPlayer = new Player(this.getPos(player), ref);
        return newPlayer.ref.key;
      })
      .catch(() => {
        newPlayer = new Player();
        localStorage.setItem('PLAYER_KEY', newPlayer.ref.key);
        return newPlayer.ref.key;
      })
      .finally(() => {
        new PlayerListener(newPlayer);
      });
  }

  /**
   * Get Current Player
   * Returns the existing player from localstorage if it exists
   */
  private getCurrentPlayer(ref, key) {
    return new Promise((resolve, reject) => {
      if (!key) reject();

      ref.once('value', (player: any) => {
        player = player.val();
        if (player) {
          resolve(player);
        } else {
          reject();
        }
      });
    });
  }

  /**
   * Add Players
   * 
   * Add players from the databse to the game.
   * @param playersValue all the players from the firebase datastore
   */
  private addPlayers(playersValue) {
    for (var key in playersValue) {
      // skip loop if the property is from prototype
      if (!playersValue.hasOwnProperty(key) || key === this.currentPlayer) continue;

      // Create an HTML element for the player
      // playersValue[key] returns the position
      // of the player since those are the only values
      // on the player object in the database
      // NOTE: extra code for pos constant needed since
      // I think firebase orders keys alphabetically
      const player = new Entity(this.getPos(playersValue[key]), 'player');

      // Push the player onto the players array
      this.playerEntities.push({ key, player });
    }
  }

  /**
   * Update Player
   * 
   * Updates a player.
   * @param key the key of the player to update
   * @param value the new value for the player
   */
  private updatePlayer(key, value) {
    if (key === this.currentPlayer) return;

    const playerEntity = this.playerEntities.find(entity => entity.key === key);
    playerEntity.player.setPosition(value.top, value.left);
  }

  /**
   * It seems firebase stores the position in alpha order so
   * left is before top. This function just re maps it so top is
   * first
   */
  private getPos(firebasePos) {
    return { top: firebasePos.top, left: firebasePos.left }
  }
}