/**
 * data Int = Int
 * 
 * Show Int
 * Semiring Int
 * Semigroup (Additive Int)
 * Monoid (Additive Int)
 * Eq Int
 * Ord Int
 * Ring Int
 */

let {tagged} = require('../../daggy');
let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {Eq} = require('../Eq');
let {Ord} = require('../Ord');
let {Ring} = require('../Ring');
let {Additive} = require('../Monoid/Additive');
let {String} = require('../String');
let {Bool} = require('../Bool');
let {Ordering} = require('../Ordering');
let {Number} = require('../Number');

/** Int :: number -> Int */
let Int = {};
Int = tagged('Int', ['_']);
Int = Object.assign((f => _ => f(Math.floor(_)))(Int), Int);
Int.prototype.constructor = Int;

/** lift :: number -> Int */
Int.lift = _ => Int(_);

/** unlift :: Int -> number */
Int.unlift = (int) => int._;
/** unlift :: Int ~> Unit -> number */
Int.prototype.unlift = function() {return Int.unlift(this)};

/** show :: Show Int => Int -> String */
Int.show = (int) => String.lift(`${int._}`);
/** show :: Show Int => Int ~> String */
Int.prototype.show = function() {return Int.show(this)};

/** add :: Semiring Int => Int -> Int -> Int */
Int.add = curry((int0, int1) => (
  Int.lift(int0._ + int1._)
));
/** add :: Semiring Int => Int ~> Int -> Int */
Int.prototype.add = function(int) {return Int.add(this, int)};

/** zero :: Semiring Int => Unit -> Int */
Int.zero = () => Int(0);

/** mul :: Semiring Int => Int -> Int -> Int */
Int.mul = curry((int0, int1) => (
  Int.lift(int0._ * int1._)
));
/** mul :: Semiring Int => Int ~> Int -> Int */
Int.prototype.mul = function(int) {return Int.mul(this, int)};

/** one :: Semiring Int => Unit -> Int */
Int.one = () => Int(1);

/** sub :: Ring Int => Int -> Int -> Int */
Int.sub = curry((int0, int1) => (
  Int.lift(int0._ - int1._)
));
/** sub :: Ring Int => Int ~> Int -> Int */
Int.prototype.sub = function(int) {return Int.sub(this, int)};

/** eq :: Eq Int => Int -> Int -> Bool */
Int.eq = curry((int0, int1) => (
  Bool.lift(int0._ == int1._)
));
/** eq :: Eq Int => Int ~> Int -> Bool */
Int.prototype.eq = function(int) {return Int.eq(this, int)};

/** compare :: Ord Int => Int -> Int -> Ordering */
Int.compare = curry((int0, int1) => (
  Bool.lift(int0._ < int1._).cata({
    True: () => Ordering.LT,
    False: () => Bool.lift(int1._ < int0._).cata({
      True: () => Ordering.GT,
      False: () => Ordering.EQ,
    }),
  })
));
/** compare :: Ord Int => Int ~> Int -> Ordering */
Int.prototype.compare = function(int) {return Int.compare(this, int)};

/** fromNumber :: Number -> Int */
Int.fromNumber = curry((number) => Int.lift(number.unlift()));

/** toNumber :: Int -> Number */
Int.toNumber = curry((int) => Number.lift(int.unlift()));
/** toNumber :: Int ~> Unit -> Number */
Int.prototype.toNumber = function() {return Int.toNumber(this)};

/** inc :: Int -> Int */
Int.inc = (int) => int.add(Int.lift(1));
/** inc :: Int ~> Unit -> Int */
Int.prototype.inc = function() {return Int.inc(this)};

/** dec :: Int -> Int */
Int.dec = (int) => int.sub(Int.lift(1));
/** dec :: Int ~> Unit -> Int */
Int.prototype.dec = function() {return Int.dec(this)};

/** even :: Int -> Bool */
Int.even = int => Bool.lift(int._ % 2 == 0);
/** even :: Int ~> Unit -> Bool */
Int.prototype.even = function() {return Int.even(this)};

/** odd :: Int -> Bool */
Int.odd = int => Int.even(int).not();
/** odd :: Int ~> Unit -> Bool */
Int.prototype.odd = function() {return Int.odd(this)};

Int = compose(
  Ring.Ring,
  Ord.Ord,
  Eq.Eq,
  Additive.Monoid,
  Additive.Semigroup,
)(Int);

module.exports = {
  default: Int,
  Int,
};