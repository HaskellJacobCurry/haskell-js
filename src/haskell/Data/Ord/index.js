/**
 * class (Eq f) <= Ord f where
 *  compare :: f -> f -> Ordering
 * lt :: f -> f -> Bool
 * notLt :: f -> f -> Bool
 * gt :: f -> f -> Bool
 * notGt :: f -> f -> Bool
 * min :: f -> f -> f
 * max :: f -> f -> f
 * clamp :: f -> f -> f -> f
 * between :: f -> f -> f -> Bool
 * abs :: Ring f => f -> f
 * 
 * compare :: Ord f => f ~> f -> Ordering
 * lt :: Ord f => f ~> f -> Bool
 * notLt :: Ord f => f ~> f -> Bool
 * gt :: Ord f => f ~> f -> Bool
 * notGt :: Ord f => f ~> f -> Bool
 * min :: Ord f => f ~> f -> f
 * max :: Ord f => f ~> f -> f
 * clamp :: Ord f => f ~> f -> f -> f
 * between :: Ord f => f ~> f -> f -> Bool
 * abs :: Ord f => Ring f => f ~> Unit -> f
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {Bool} = require('../Bool');
let {Ordering} = require('../Ordering');

const Ord = {};

/** lt :: f -> f -> Bool */
Ord.lt = curry((ord0, ord1) => (
  ord0.compare(ord1).eq(Ordering.LT)
));

/** notLt :: Ord f => f -> f -> Bool */
Ord.notLt = curry((ord0, ord1) => (
  Ord.lt(ord0, ord1).not()
));

/** gt :: Ord f => f -> f -> Bool */
Ord.gt = curry((ord0, ord1) => (
  ord0.compare(ord1).eq(Ordering.GT)
));

/** notGt :: Ord f => f -> f -> Bool */
Ord.notGt = curry((ord0, ord1) => (
  Ord.gt(ord0, ord1).not()
));

/** min :: Ord f => f -> f -> f */
Ord.min = curry((ord0, ord1) => (
  Ord.lt(ord0, ord1).cata({
    True: () => ord0,
    False: () => Ord.lt(ord1, ord0).cata({
      True: () => ord1,
      False: () => ord0,
    }),
  })
));

/** max :: Ord f => f -> f -> f */
Ord.max = curry((ord0, ord1) => (
  Ord.gt(ord0, ord1).cata({
    True: () => ord0,
    False: () => Ord.gt(ord1, ord0).cata({
      True: () => ord1,
      False: () => ord0,
    }),
  })
));

/** clamp :: Ord f => f -> f -> f -> f */
Ord.clamp = curry((ord0, ord1, ord2) => (
  Ord.lt(ord2, ord0).cata({
    True: () => ord0,
    False: () => Ord.gt(ord2, ord1).cata({
      True: () => ord1,
      False: () => ord2,
    }),
  })
));

/** between :: Ord f => f -> f -> f -> Bool */
Ord.between = curry((ord0, ord1, ord2) => (
  Ord.lt(ord2, ord0).cata({
    True: () => Bool.False,
    False: () => Ord.gt(ord2, ord1).cata({
      True: () => Bool.False,
      False: () => Bool.True,
    }),
  })
));

/** abs :: Ord f => Ring f => f -> f */
Ord.abs = ring => (
  (Ring => (
    Ord.lt(ring, Ring.zero()).cata({
      True: () => ring.negate(),
      False: () => ring,
    })
  ))(ring.constructor)
);

/** defaultCompare :: Ord -> Ord -> Ordering */
Ord.defaultCompare = curry((ord0, ord1) => (
  ord0.lt(ord1).cata({
    True: () => Ordering.LT,
    False: () => ord1.lt(ord0).cata({
      True: () => Ordering.GT,
      False: () => Ordering.EQ,
    }),
  })
));

Ord.Ord = compose(
  O => (
    O.lt = Ord.lt,
    O.prototype.lt = function(ord) {return O.lt(this, ord)},
    O
  ),
  O => (
    O.notLt = Ord.notLt,
    O.prototype.notLt = function(ord) {return O.notLt(this, ord)},
    O
  ),
  O => (
    O.gt = Ord.gt,
    O.prototype.gt = function(ord) {return O.gt(this, ord)},
    O
  ),
  O => (
    O.notGt = Ord.notGt,
    O.prototype.notGt = function(ord) {return O.notGt(this, ord)},
    O
  ),
  O => (
    O.min = Ord.min,
    O.prototype.min = function(ord) {return O.min(this, ord)},
    O
  ),
  O => (
    O.max = Ord.max,
    O.prototype.max = function(ord) {return O.max(this, ord)},
    O
  ),
  O => (
    O.clamp = Ord.clamp,
    O.prototype.clamp = function(ord0, ord1) {return O.clamp(ord0, ord1, this)},
    O
  ),
  O => (
    O.between = Ord.between,
    O.prototype.between = function(ord0, ord1) {return O.between(ord0, ord1, this)},
    O
  ),
  O => (
    O.abs = Ord.abs,
    O.prototype.abs = function() {return O.abs(this)},
    O
  ),
);

module.exports = {
  default: Ord,
  Ord,
};