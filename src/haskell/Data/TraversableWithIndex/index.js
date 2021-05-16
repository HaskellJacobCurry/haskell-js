/**
 * class (FunctorWithIndex i f, FoldableWithIndex i f, Traversable f) <= TraversableWithIndex i f | f -> i where
 *  traverseWithIndex :: Applicative f0 => typeof f0 -> (i -> a -> f0 b) -> f a -> f0 (f b)
 * 
 * TraversableWithIndex i f =>
 *  traverseWithIndex :: Applicative f0 => f a ~> (i -> a -> f0 b) -> typeof f0 -> f0 (f b)
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');

const TraversableWithIndex = {};

/** traverseWithIndex :: TraversableWithIndex i f => Applicative f0 => typeof f0 -> (i -> a -> f0 b) -> f a -> f0 (f b) */
TraversableWithIndex.traverseWithIndex = (Applicative) => curry((f, traversableA) => (
  (TraversableWithIndex => (
    TraversableWithIndex.traverseWithIndex(Applicative)(f, traversableA)
  ))(traversableA.constructor)
));

module.exports = {
  default: TraversableWithIndex,
  TraversableWithIndex,
};