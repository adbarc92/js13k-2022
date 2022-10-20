/* Timer */

/**
 * @param {number} x1 the x coord of the first point
 * @param {number} y1 the y coord of the first point
 * @param {number} x2 the x coord of the second point
 * @param {number} y2 the y coord of the second point
 *  @returns {number}
 */
export const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1) + Math.pow(y2 - y1));
};
