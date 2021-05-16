/**
 * class Functor f where
 *  map :: (a -> b) -> f a -> f b
 * 
 * map :: Functor f => f a ~> (a -> b) -> f b
 */

let {curry} = require('../../curry');

const Functor = {};

/** map :: Functor f => (a -> b) -> f a -> f b */
Functor.map = curry((f, functorA) => (
  (Functor => (
    Functor.map(f, functorA)
  ))(functorA.constructor)
));

module.exports = {
  default: Functor,
  Functor,
};