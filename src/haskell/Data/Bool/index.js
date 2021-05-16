/**
 * data Bool = True | False
 * 
 * Show Bool
 */

let {taggedSum} = require('../../daggy');
let {curry} = require('../../curry');
let {String} = require('../String');
let {Foldable} = require('../Foldable');
let {Array} = require('../Array/_');

/** data Bool = True | False */
let Bool = {};
/** True :: Bool */
Bool.True = undefined;
/** False :: Bool */
Bool.False = undefined;
/** cata :: Bool -> { [Bool]: (...as) -> b } -> b */
Bool.cata = undefined;
Bool = taggedSum('Bool', {
  True: [],
  False: [],
});
Bool.prototype.constructor = Bool;

/** lift :: boolean -> Bool */
Bool.lift = _ => _ ? Bool.True : Bool.False;

/** unlift :: Bool -> boolean */
Bool.unlift = bool => (
  bool.cata({
    True: () => true,
    False: () => false,
  })
);
/** unlift :: Bool ~> boolean */
Bool.prototype.unlift = function() {return Bool.unlift(this)};

/** show :: Show Bool => Bool -> String */
Bool.show = bool => (
  bool.cata({
    True: () => String.lift('True'),
    False: () => String.lift('False'),
  })
);
/** show :: Show Bool => Bool ~> Unit -> String */
Bool.prototype.show = function() {return Bool.show(this)};

/** bool :: (Unit -> a) -> (Unit -> a) -> Bool -> a */
Bool.bool = curry((thunk0, thunk1, bool) => (
  bool.cata({
    True: thunk1,
    False: thunk0,
  })
));

/** not :: Bool -> Bool */
Bool.not = curry((bool) => (
  bool.cata({
    True: () => Bool.False,
    False: () => Bool.True,
  })
));
/** not :: Bool ~> Unit -> Bool */
Bool.prototype.not = function() {return Bool.not(this)};

/** and :: Bool -> Bool -> Bool */
Bool.and = curry((bool0, bool1) => (
  bool0.cata({
    True: () => bool1,
    False: () => Bool.False,
  })
));
/** and :: Bool ~> Bool -> Bool */
Bool.prototype.and = function(bool) {return Bool.and(this, bool)};

/** or :: Bool -> Bool -> Bool */
Bool.or = curry((bool0, bool1) => (
  bool0.cata({
    True: () => Bool.True,
    False: () => bool1,
  })
));
/** or :: Bool ~> Bool -> Bool */
Bool.prototype.or = function(bool) {return Bool.or(this, bool)};

/** fromBool :: boolean -> Bool */
Bool.fromBool = _ => _ ? Bool.True : Bool.False;

/** andJS :: (...Bool) -> Bool */
Bool.andJS = (...bools) => (
  Foldable.foldl((b, a) => b.and(a), Bool.True, Array().lift(bools))
);

/** orJS :: (...Bool) -> Bool */
Bool.orJS = (...bools) => (
  Foldable.foldl((b, a) => b.or(a), Bool.False, Array().lift(bools))
);

module.exports = {
  default: Bool,
  Bool,
};