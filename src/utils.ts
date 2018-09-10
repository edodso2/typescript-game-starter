/**
 * Utilities
 * 
 * Helpful utility functions to be shared across
 * the app.
 */

/**
* Get Random Hex Color
* 
* Returns a random hex color to be used in style
* or css.
*/
export function getRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
