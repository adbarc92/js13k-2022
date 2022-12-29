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

export const boxesOverlap = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  if (isBetween(x3, x1, x2) || isBetween(x4, x1, x2)) {
    if (isBetween(y3, y1, y2) || isBetween(y4, y1, y2)) {
      return true;
    }
  }
  return false;
};

const isBetween = (num, min, max) => {
  return num >= min && num <= max;
};
