/**
 * data Aff a = Aff a
 * 
 * Applicative Aff
 * Bind Aff
 * Apply Aff
 * Functor Aff
 * Semigroup a => Semigroup (Aff a)
 * Monoid a => Monoid (Aff a)
 */

let {AsyncEffect} = require('../AsyncEffect');

let Aff = AsyncEffect;

module.exports = {
  default: Aff,
  Aff,
};