/**
 * class Semigroupoid f where
 *  compose :: f b c -> f a b -> f a c
 * 
 * compose :: Semigroupoid f => f b c -> f a b -> f a c
 */

let {curry} = require('../../curry');

const Semigroupoid = {};

/** compose :: Semigroupoid f => f b c -> f a b -> f a c */
Semigroupoid.compose = curry((semigroupoid0, semigroupoid1) => semigroupoid0.compose(semigroupoid1));

module.exports = {
  default: Semigroupoid,
  Semigroupoid,
};