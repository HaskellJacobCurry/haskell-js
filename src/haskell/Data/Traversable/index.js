/**
 * class (Functor f, Foldable f) <= Traversable f where
 *  traverse :: Applicative f0 => typeof f0 -> (a -> f0 b) -> f a -> f0 (f b)
 *  sequence :: Applicative f0 => typeof f0 -> f (f0 a) -> f0 (f a)
 * for :: Applicative f0 => typeof f0 -> f a -> (a -> f0 b) -> f0 (f b)
 * traverse_ :: Applicative f0 => typeof f0 -> (a -> f0 b) -> f a -> f0 Unit
 * for_ :: Applicative f0 => typeof f0 -> f a -> (a -> f0 b) -> f0 Unit
 * 
 * traverse :: Traversable f => Applicative f0 => f a ~> (a -> f0 b) -> typeof f0 -> f0 (f b)
 * sequence :: Traversable f => Applicative f0 => f (f0 a) ~> typeof f0 -> f0 (f a)
 * for :: Traversable f => Applicative f0 => f a ~> (a -> f0 b) -> typeof f0 -> f0 (f b)
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {Functor} = require('../Functor');
let {Foldable} = require('../Foldable');

/* flip :: (a -> b -> c) -> b -> a -> c */
let flip = f => (
  curry((b, a) => (f => f(a)(b))(curry(f)))
);

const Traversable = {};

/** traverse :: Traversable f => Applicative f0 => typeof f0 -> (a -> f0 b) -> f a -> f0 (f b) */
Traversable.traverse = (Applicative) => curry((f, traversableA) => (
  (Traversable => (
    Traversable.traverse(Applicative)(f, traversableA)
  ))(traversableA.constructor)
));

/** sequence :: Traversable f => Applicative f0 => typeof f0 -> f (f0 a) -> f0 (f a) */
Traversable.sequence = (Applicative) => traversable => (
  (Traversable => (
    Traversable.sequence(Applicative)(traversable)
  ))(traversable.constructor)
);

/** for :: Traversable f => Applicative f0 => typeof f0 -> f a -> (a -> f0 b) -> f0 (f b) */
Traversable.for = compose(flip, Traversable.traverse);

/** traverse_ :: Traversable f => Applicative f0 => typeof f0 -> (a -> f0 b) -> f a -> f0 Unit */
Traversable.traverse_ = Foldable.traverse_;

/** for_ :: Traversable f => Applicative f0 => typeof f0 -> f a -> (a -> f0 b) -> f0 Unit */
Traversable.for_ = Foldable.for_;

/**
 * traverseDefault :: Traversable f => Applicative f0 => typeof f0 -> (a -> f0 b) -> f a -> f0 (f b)
 * 
 * deps :: [sequence]
 */
Traversable.traverseDefault = (Applicative) => curry((f, traversableA) => (
  compose(
    Traversable.sequence(Applicative),
    Functor.map(f),
  )(traversableA)
));

/**
 * sequenceDefault :: Traversable f => Applicative f0 => typeof f0 -> f (f0 a) -> f0 (f a)
 * 
 * deps :: [traverse]
 */
Traversable.sequenceDefault = (Applicative) => traversable => (
  (Traversable => (
    Traversable.traverse(Applicative)(a => a, traversable)
  ))(traversable.constructor)
);

Traversable.Traversable = compose(
  T => (
    T.for = Traversable.for,
    T.prototype.for = function(f, Applicative) {return T.for(Applicative)(this, f)},
    T
  ),
);

module.exports = {
  default: Traversable,
  Traversable,
};