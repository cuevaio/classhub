/**
 * Groups an array of objects by a specified key.
 *
 * @param {Object[]} xs - The array of objects to group.
 * @param {string} key - The key to group the objects by.
 * @returns {Object} An object where the keys are the values of the specified key,
 *                   and the values are arrays of objects that have the same key value.
 */

export const groupBy = (xs: object[], key: string) => {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
