/**
 * class (Functor f) <= Apply f where
 *  ap :: f (a -> b) -> f a -> f b
 * apFirst :: f a -> f b -> f a
 * apSecond :: f a -> f b -> f b
 * lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c
 * 
 * ap :: Apply f => f a ~> f (a -> b) -> f b
 * lift2 :: Apply f => f a ~> (a -> b -> c) -> f b -> f c
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');

/** const_ :: a -> b -> a */
let const_ = curry((a, b) => a);

const Apply = {};

/** ap :: Apply f => f (a -> b) -> f a -> f b */
Apply.ap = curry((applyF, applyA) => (
  (Apply => (
    Apply.ap(applyF, applyA)
  ))(applyA.constructor)
));

/**
 * apFirst :: Apply f => f a -> f b -> f a
 * 
 * deps :: [ap, map]
 */
Apply.apFirst = curry((applyA, applyB) => (
  applyB.ap(applyA.map(const_))
));

/**
 * apSecond :: Apply f => f a -> f b -> f b
 * 
 * deps :: [ap, map]
 */
Apply.apSecond = curry((applyA, applyB) => (
  applyB.ap(applyA.map(const_(a => a)))
));

/** 
 * lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c
 * 
 * deps :: [ap, map]
 */
Apply.lift2 = curry((f, applyA, applyB) => (
  applyB.ap(applyA.map(f))
));

Apply.Apply = compose(
  A => (
    A.lift2 = Apply.lift2,
    A.prototype.lift2 = function(f, applyB) {return A.lift2(f, this, applyB)},
    A
  ),
);

module.exports = {
  default: Apply,
  Apply,
};