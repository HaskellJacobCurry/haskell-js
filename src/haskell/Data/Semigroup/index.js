/**
 * class Semigroup f where
 *  append :: f -> f -> f
 * 
 * append :: Semigroup f => f ~> f -> f
 */

let {curry} = require('../../curry');

const Semigroup = {};

/** append :: Semigroup f => f -> f -> f */
Semigroup.append = curry((semigroup0, semigroup1) => (
  semigroup0.append(semigroup1)
));

module.exports = {
  default: Semigroup,
  Semigroup,
};