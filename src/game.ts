import * as firebase from 'firebase';
import { config } from './config';
import { Player } from './player';
import { PlayerListener } from './playerListener';

const CURRENT_PLAYER = 0;

/**
 * Game Class
 * 
 * Core game logic goes here.
 */
export class Game {
  app: firebase.app.App;
  players: Player[];
  currentPlayer: Player;
  playerListener: PlayerListener;

  constructor() {
    // init
    this.players = [];

    // try to get the app if it doesn't exist then
    // create it. This is needed to prevent errors on 
    // page refresh. Maybe firebase does some caching?
    try {
      this.app = firebase.app();
    } catch (err) {
      this.app = firebase.initializeApp(config);
    }

    // get realtime updates of player value changes
    // from the database
    firebase
      .database()
      .ref()
      .on('value', snapshot => {
        // The on function runs on page load so it will call this function.
        // Checking the players.length so that this code only runs if
        // the players array is not initialized
        if (!this.players.length) {
          this.addPlayers(snapshot.val());

          // TODO: pause the loading and 
          // ask the user for current player here.
          // maybe in a lightbox?
          // Could also get the cuurent player in main before
          // creating the game.
          this.currentPlayer = this.players[CURRENT_PLAYER];
          this.playerListener = new PlayerListener(this.currentPlayer);
        }

        this.updatePlayers(snapshot.val());
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
      if (!playersValue.hasOwnProperty(key)) continue;

      // Create an HTML element for the player
      // playersValue[key] returns the position
      // of the player since those are the only values
      // on the player object in the database
      const player = new Player(key, playersValue[key]);

      // Push the player onto the players array
      this.players.push(player);
    }
  }

  /**
   * Update Players
   * 
   * Updates all the players on the screen.
   * @param playerValues all the players from the firebase datastore
   */
  private updatePlayers(playerValues) {
    this.players.forEach(player => {
      player.setPosition(
        playerValues[player.id].top,
        playerValues[player.id].left
      )
    });
  }
}