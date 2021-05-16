/**
 * class Semiring f where
 *  add :: f -> f -> f
 *  zero :: Unit -> f
 *  mul :: f -> f -> f
 *  one :: Unit -> f
 * 
 * add :: Semiring f => f ~> f -> f
 * mul :: Semiring f => f ~> f -> f
 */

let {curry} = require('../../curry');

const Semiring = {};

/** add :: Semiring f => f -> f -> f */
Semiring.add = curry((semiring0, semiring1) => (
  semiring0.add(semiring1)
));

/** mul :: Semiring f => f -> f -> f */
Semiring.mul = curry((semiring0, semiring1) => (
  semiring0.mul(semiring1)
));

module.exports = {
  default: Semiring,
  Semiring,
};