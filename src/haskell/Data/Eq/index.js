/**
 * class Eq f where
 *  eq :: f -> f -> Bool
 * notEq :: Eq f => f -> f -> Bool
 * 
 * eq :: Eq f => f ~> f -> Bool
 * notEq :: Eq f => f ~> f -> Bool
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');

const Eq = {};

/** eq :: Eq f => f -> f -> Bool */
Eq.eq = curry((eq0, eq1) => eq0.eq(eq1));

/** 
 * notEq :: Eq f => f -> f -> Bool
 * 
 * deps :: [eq]
 */
Eq.notEq = curry((eq0, eq1) => eq0.eq(eq1).not());

Eq['Eq'] = compose(
  (E) => (
    E.notEq = Eq.notEq,
    E.prototype.notEq = function(eq) {return E.notEq(this, eq)},
    E
  ),
);

module.exports = {
  default: Eq,
  Eq
};