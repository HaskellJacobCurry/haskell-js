/**
 * data Number = Number
 * 
 * Show Number
 * Semiring Number
 * Semigroup (Additive Number)
 * Monoid (Additive Number)
 * Eq Number
 * Ord Number
 * Ring Number
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
let {Maybe} = require('../Maybe');

/** Number :: number -> Number */
let Number = {};
Number = tagged('Number', ['_']);
Number.prototype.constructor = Number;

/** lift :: number -> Number */
Number.lift = _ => Number(_);

/** unlift :: Number -> number */
Number.unlift = (number) => number._;
/** unlift :: Number ~> Unit -> number */
Number.prototype.unlift = function() {return Number.unlift(this)};

/** show :: Show Number => Number -> String */
Number.show = curry((number) => String.lift(`${number._}`));
/** show :: Show Number => Number ~> String */
Number.prototype.show = function() {return Number.show(this)};

/** add :: Semiring Number => Number -> Number -> Number */
Number.add = curry((number0, number1) => (
  Number.lift(number0._ + number1._)
));
/** add :: Semiring Number => Number ~> Number -> Number */
Number.prototype.add = function(number) {return Number.add(this, number)};

/** zero :: Semiring Number => Unit -> Number */
Number.zero = () => Number(0);

/** mul :: Semiring Number => Number -> Number -> Number */
Number.mul = curry((number0, number1) => (
  Number.lift(number0._ * number1._)
));
/** mul :: Semiring Number => Number ~> Number -> Number */
Number.prototype.mul = function(number) {return Number.mul(this, number)};

/** one :: Semiring Number => Unit -> Number */
Number.one = () => Number(1);

/** sub :: Ring Number => Number -> Number -> Number */
Number.sub = curry((number0, number1) => (
  Number.lift(number0._ - number1._)
));
/** sub :: Ring Number => Number ~> Number -> Number */
Number.prototype.sub = function(number) {return Number.sub(this, number)};

/** eq :: Eq Number => Number -> Number -> Bool */
Number.eq = curry((number0, number1) => (
  number0.compare(number1).eq(Ordering.EQ)
));
/** eq :: Eq Number => Number ~> Number -> Bool */
Number.prototype.eq = function(number) {return Number.eq(this, number)};

/** compare :: Ord Number => Number -> Number -> Ordering */
Number.compare = curry((number0, number1) => (
  Bool.lift(number0._ < number1._).cata({
    True: () => Ordering.LT,
    False: () => Bool.lift(number1._ < number0._).cata({
      True: () => Ordering.GT,
      False: () => Ordering.EQ,
    }),
  })
));
/** compare :: Ord Number => Number ~> Number -> Ordering */
Number.prototype.compare = function(number) {return Number.compare(this, number)};

/** fromString :: String -> Maybe Number */
Number.fromString = curry((str) => {
  let number = parseFloat(str.toString());
  return (
    Bool.fromBool(isNaN(number))
      .cata({
        True: Maybe.mempty,
        False: () => Maybe.pure(Number.lift(number)),
      })
  );
});

Number = compose(
  Ring.Ring,
  Ord.Ord,
  Eq.Eq,
  Additive.Monoid,
  Additive.Semigroup,
)(Number);

module.exports = {
  default: Number,
  Number,
};