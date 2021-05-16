/**
 * class (Semiring f) <= Ring f where
 *  sub :: f -> f -> f
 * negate :: Ring f => f -> f
 * 
 * sub :: Ring f => f ~> f -> f
 * negate :: Ring f => f ~> Unit -> f
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');

const Ring = {};

/** sub :: Ring f => f -> f -> f */
Ring.sub = curry((ring0, ring1) => (
  ring0.sub(ring1)
));

/** negate :: Ring f => f -> f */
Ring.negate = curry((ring) => (
  (Ring => (
    Ring.zero().sub(ring)
  ))(ring.constructor)
));

Ring.Ring = compose(
  (R) => (
    R.negate = Ring.negate,
    R.prototype.negate = function() {return R.negate(this)},
    R
  ),
);

module.exports = {
  default: Ring,
  Ring,
};