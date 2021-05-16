/**
 * data Ordering = LT | GT | EQ
 * 
 * Eq Ordering
 * Show Ordering
 * Semigroup Ordering
 */

let {taggedSum} = require('../../daggy');
let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {Eq} = require('../Eq');
let {String} = require('../String');
let {Bool} = require('../Bool');

/** data Ordering = LT | GT | EQ */
let Ordering = {};
/** LT :: Ordering */
Ordering.LT = undefined;
/** GT :: Ordering */
Ordering.GT = undefined;
/** EQ :: Ordering */
Ordering.EQ = undefined;
/** cata :: Ordering -> { [Ordering]: (...as) -> b } -> b */
Ordering.cata = undefined;
Ordering = taggedSum('Ordering', {
  LT: [],
  GT: [],
  EQ: [],
});
Ordering.prototype.constructor = Ordering;

/** eq :: Eq Ordering => Ordering -> Ordering -> Bool */
Ordering.eq = curry((ordering0, ordering1) => (
  ordering0.cata({
    LT: () => ordering1.cata({
      LT: () => Bool.True,
      GT: () => Bool.False,
      EQ: () => Bool.False,
    }),
    GT: () => ordering1.cata({
      LT: () => Bool.False,
      GT: () => Bool.True,
      EQ: () => Bool.False,
    }),
    EQ: () => ordering1.cata({
      LT: () => Bool.False,
      GT: () => Bool.False,
      EQ: () => Bool.True,
    }),
  })
));
/** eq :: Eq Ordering => Ordering ~> Ordering -> Bool */
Ordering.prototype.eq = function(ordering) {return Ordering.eq(this, ordering)};

/** show :: Show Ordering => Ordering -> String */
Ordering.show = curry((ordering) => (
  ordering.cata({
    LT: () => String.lift('LT'),
    GT: () => String.lift('GT'),
    EQ: () => String.lift('EQ'),
  })
));
/** show :: Show Ordering => Ordering ~> String */
Ordering.prototype.show = function() {return Ordering.show(this)};

/** append :: Semigroup Ordering => Ordering -> Ordering -> Ordering */
Ordering.append = curry((ordering0, ordering1) => (
  ordering0.cata({
    LT: () => Ordering.LT,
    GT: () => Ordering.GT,
    EQ: () => ordering1,
  })
));
/** append :: Semigroup Ordering => Ordering ~> Ordering -> Ordering */
Ordering.prototype.append = function(ordering) {return Ordering.append(this, ordering)};

/** invert :: Ordering -> Ordering */
Ordering.invert = curry((ordering) => (
  ordering.cata({
    LT: () => Ordering.GT,
    GT: () => Ordering.LT,
    EQ: () => Ordering.EQ,
  })
));
/** invert :: Ordering ~> Ordering */
Ordering.prototype.invert = function() {return Ordering.invert(this)};

/** notEq :: Eq Ordering => Ordering -> Ordering -> Bool */
Ordering.notEq = undefined;

Ordering = compose(
  Eq.Eq,
)(Ordering),

module.exports = {
  default: Ordering,
  Ordering,
};