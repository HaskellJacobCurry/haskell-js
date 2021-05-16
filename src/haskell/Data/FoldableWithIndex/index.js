/**
 * class (Foldable f) <= FoldableWithIndex i f | f -> i where
 *  foldlWithIndex :: (i -> b -> a -> b) -> b -> f a -> b
 *  foldrWithIndex :: (i -> a -> b -> b) -> b -> f a -> b
 *  foldMapWithIndex :: Monoid f0 => typeof f0 -> (i -> a -> f0) -> f a -> f0
 * 
 * FoldableWithIndex i f | f -> i => 
 *  foldlWithIndex :: f a ~> (i -> b -> a -> b) -> b -> b
 *  foldrWithIndex :: f a ~> (i -> a -> b -> b) -> b -> b
 *  foldMapWithIndex :: Monoid f0 => f a ~> (i -> a -> f0) -> typeof f0 -> f0
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');

const FoldableWithIndex = {};

/** foldlWithIndex :: FoldableWithIndex i f | f -> i => (i -> b -> a -> b) -> b -> f a -> b */
FoldableWithIndex.foldlWithIndex = curry((f, b, foldableA) => (
  ((FoldableWithIndex) => (
    FoldableWithIndex.foldlWithIndex(f, b, foldableA)
  ))(foldableA.constructor)
));

/** foldrWithIndex :: FoldableWithIndex i f | f -> i => ((i -> a -> b -> b) -> b -> f a -> b */
FoldableWithIndex.foldrWithIndex = curry((f, b, foldableA) => (
  ((FoldableWithIndex) => (
    FoldableWithIndex.foldrWithIndex(f, b, foldableA)
  ))(foldableA.constructor)
));

/** foldMapWithIndex :: FoldableWithIndex i f | f -> i => Monoid f0 => typeof f0 -> (i -> a -> f0) -> f a -> f0 */
FoldableWithIndex.foldMapWithIndex = (Monoid) => curry((f, foldableA) => (
  ((FoldableWithIndex) => (
    FoldableWithIndex.foldMapWithIndex(Monoid)(f, foldableA)
  ))(foldableA.constructor)
));

/** 
 * foldMapWithIndexDefaultL :: FoldableWithIndex i f | f -> i => Monoid f0 => typeof f0 -> (i -> a -> f0) -> f a -> f0
 * 
 * deps :: [foldlWithIndex]
 */
FoldableWithIndex.foldMapWithIndexDefaultL = (Monoid) => curry((f, foldableA) => (
  ((FoldableWithIndex, f) => (
    FoldableWithIndex.foldlWithIndex((i, f0, a) => f0.append(f(i, a)), Monoid.mempty(), foldableA)
  ))(foldableA.constructor, curry(f))
));

/** 
 * foldMapWithIndexDefaultR :: FoldableWithIndex i f | f -> i => Monoid f0 => typeof f0 -> (i -> a -> f0) -> f a -> f0
 * 
 * deps :: [foldrWithIndex]
 */
FoldableWithIndex.foldMapWithIndexDefaultR = (Monoid) => curry((f, foldableA) => (
  ((FoldableWithIndex, f) => (
    FoldableWithIndex.foldrWithIndex((i, a, f0) => f(i, a).append(f0), Monoid.mempty(), foldableA)
  ))(foldableA.constructor, curry(f))
));

/** 
 * foldrDefaultL :: FoldableWithIndex i f | f -> i => (i -> a -> b -> b) -> b -> f a -> b
 * 
 * deps :: [foldlWithIndex]
 */
FoldableWithIndex.foldrDefaultL = curry((f, b, foldableA) => (
  ((FoldableWithIndex, f) => (
    FoldableWithIndex.foldlWithIndex((i, f0, a) => (
      b => f0(f(i, a, b))
    ), b => b, foldableA)(b)
  ))(foldableA.constructor, curry(f))
));

module.exports = {
  default: FoldableWithIndex,
  FoldableWithIndex,
};