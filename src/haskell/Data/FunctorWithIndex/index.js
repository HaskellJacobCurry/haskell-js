/**
 * class (Functor f) <= FunctorWithIndex i f | f -> i where
 *  mapWithIndex :: (i -> a -> b) -> f a -> f b
 * 
 * mapWithIndex :: FunctorWithIndex i f | f -> i => f a ~> (i -> a -> b) -> f b
 */

let {curry} = require('../../curry');

const FunctorWithIndex = {};

FunctorWithIndex.mapWithIndex = curry((f, functorA) => (
  functorA.mapWithIndex(f)
));

module.exports = {
  default: FunctorWithIndex,
  FunctorWithIndex,
};