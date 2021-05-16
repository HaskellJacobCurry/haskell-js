/**
 * class Foldable f where
 *  foldl :: (b -> a -> b) -> b -> f a -> b
 *  foldr :: (a -> b -> b) -> b -> f a -> b
 *  foldMap :: Monoid f0 => typeof f0 -> (a -> f0) -> f a -> f0
 * traverse_ :: Applicative f0 => typeof f0 -> (a -> f0 b) -> f a -> f0 Unit
 * 
 * foldl :: Foldable f => f a ~> (b -> a -> b) -> b -> b
 * foldr :: Foldable f => f a ~> (a -> b -> b) -> b -> b
 * foldMap :: Foldable f => Monoid f0 => f a ~> (a -> f0) -> typeof f0 -> f0
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {Apply} = require('../../Control/Apply');
let {Unit} = require('../Unit');

/** flip :: (a -> b -> c) -> b -> a -> c */
let flip = f => (
  curry((b, a) => (f => f(a)(b))(curry(f)))
);

const Foldable = {};

/** foldl :: Foldable f => (b -> a -> b) -> b -> f a -> b */
Foldable.foldl = curry((f, b, foldableA) => (
  (Foldable => (
    Foldable.foldl(f, b, foldableA)
  ))(foldableA.constructor)
));

/** foldr :: Foldable f => (a -> b -> b) -> b -> f a -> b */
Foldable.foldr = curry((f, b, foldableA) => (
  (Foldable => (
    Foldable.foldr(f, b, foldableA)
  ))(foldableA.constructor)
));

/** foldMap :: Foldable f => Monoid f0 => typeof f0 -> (a -> f0) -> f a -> f0 */
Foldable.foldMap = (Monoid) => curry((f, foldableA) => (
  (Foldable => (
    Foldable.foldMap(Monoid)(f, foldableA)
  ))(foldableA.constructor)
));

/** traverse_ :: Foldable f => Applicative f0 => typeof f0 -> (a -> f0 b) -> f a -> f0 Unit */
Foldable.traverse_ = (Applicative) => curry((f, foldableA) => (
  ((Foldable, f) => (
    Foldable.foldr(compose(Apply.apSecond, f), Applicative.pure(Unit.lift()), foldableA)
  ))(foldableA.constructor, curry(f))
));

/** for_ :: Foldable f => Applicative f0 => typeof f0 -> f a -> (a -> f0 b) -> f0 Unit */
Foldable.for_ = compose(flip, Foldable.traverse_);

/** 
 * foldMapDefaultL :: Foldable f => Monoid f0 => typeof f0 -> (a -> f0) -> f a -> f0
 * 
 * deps :: [foldl]
 */
Foldable.foldMapDefaultL = (Monoid) => curry((f, foldableA) => (
  ((Foldable, f) => (
    Foldable.foldl((f0, a) => f0.append(f(a)), Monoid.mempty(), foldableA)
  ))(foldableA.constructor, curry(f))
));

/** 
 * foldMapDefaultR :: Foldable f => Monoid f0 => typeof f0 -> (a -> f0) -> f a -> f0
 * 
 * deps :: [foldr]
 */
Foldable.foldMapDefaultR = (Monoid) => curry((f, foldableA) => (
  ((Foldable, f) => (
    Foldable.foldr((a, f0) => f(a).append(f0), Monoid.mempty(), foldableA)
  ))(foldableA.constructor, curry(f))
));

/** 
 * foldrDefaultL :: Foldable f => (a -> b -> b) -> b -> f a -> b
 * 
 * deps :: [foldl]
 */
Foldable.foldrDefaultL = curry((f, b, foldableA) => (
  ((Foldable, f) => (
    Foldable.foldl((f0, a) => (
      b => f0(f(a, b))
    ), b => b, foldableA)(b)
  ))(foldableA.constructor, curry(f))
));

module.exports = {
  default: Foldable,
  Foldable,
};