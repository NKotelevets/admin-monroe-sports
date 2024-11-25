/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Compares two objects and returns an object containing the keys
 * with value true if there's any difference.
 *
 * @param {Record<string, any>} obj1 - The first object to compare.
 * @param {Record<string, any>} obj2 - The second object to compare.
 * @returns {Record<string, boolean>} An object with each key.
 * The value is `true` for each differing property. If a property
 * exists in `obj1` but not in `obj2`, it will also be included in
 * the result.
 *
 * Note: This function performs a shallow comparison for non-array values
 * and checks the contents of arrays for equality.
 */
export const compareObjects = (obj1: Record<string, any>, obj2: Record<string, any>): Record<string, boolean> => {
  const differences: Record<string, boolean> = {}

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        // Compare arrays by their contents
        if (obj1[key].length !== obj2[key].length || !obj1[key].every((val: any, index: number) => val === obj2[key][index])) {
          differences[key] = true
        }
      } else if (obj1[key] !== obj2[key]) {
        differences[key] = true
      }
    } else {
      differences[key] = true
    }
  }

  return differences
}
