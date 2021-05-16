/**
 * class Bifunctor f where
 *  bimap :: (a -> c) -> (b -> d) -> f a b -> f c d
 * lmap :: (a -> c) -> f a b -> f c b
 * rmap :: (b -> d) -> f a b -> f a d
 * 
 * bimap :: Bifunctor f => f a b ~> (a -> c) -> (b -> d) -> f c d
 * lmap :: Bifunctor f => f a b ~> (a -> c) -> f c b
 * rmap :: Bifunctor f => f a b ~> (b -> d) -> f a d
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');

const Bifunctor = {};

/** bimap :: Bifunctor f => (a -> c) -> (b -> d) -> f a b -> f c d */
Bifunctor.bimap = curry((f0, f1, bifunctor) => (
  bifunctor.bimap(f0, f1)
));

/** lmap :: Bifunctor f => (a -> c) -> f a b -> f c b */
Bifunctor.lmap = curry((f, bifunctor) => (
  bifunctor.bimap(f, a => a)
));

/** rmap :: Bifunctor f => (b -> d) -> f a b -> f a d */
Bifunctor.rmap = curry((f, bifunctor) => (
  bifunctor.bimap(a => a, f)
));

Bifunctor.Bifunctor = compose(
  (B) => (
    B['lmap'] = Bifunctor.lmap,
    B.prototype['lmap'] = function(f) {return B.lmap(f, this)},
    B
  ),
  (B) => (
    B['rmap'] = Bifunctor.rmap,
    B.prototype['rmap'] = function(f) {return B.rmap(f, this)},
    B
  ),
);

module.exports = {
  default: Bifunctor,
  Bifunctor,
};