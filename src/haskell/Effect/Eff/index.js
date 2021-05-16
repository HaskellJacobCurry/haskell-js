/**
 * data Eff a = Eff a
 * 
 * Applicative Eff
 * Bind Eff
 * Apply Eff
 * Functor Eff
 * Semigroup a => Semigroup (Eff a)
 * Monoid a => Monoid (Eff a)
 */

let {Effect} = require('../../Effect');

let Eff = Effect;

module.exports = {
  default: Eff,
  Eff,
};