/**
 * Show (Array a)
 * Monoid (Array a)
 * Semigroup (Array a)
 * Applicative Array
 * FunctorWithIndex Int Array
 * Functor Array
 * Apply Array
 * Bind Array
 * Monad Array
 * FoldableWithIndex Int Array
 * Foldable Array
 * Traversable Array
 */

let {curry} = require('../../curry');
let {String} = require('../String');
let {Array} = require('./_');
let {Int} = require('../Int');
let {FoldableWithIndex} = require('../FoldableWithIndex');
let {Function:F} = require('../Function');
let {Semigroup} = require('../Semigroup');

const Array_ = (a) => ((Array) => {
  Array.show = curry((arrayA) => {
    let iEnd = arrayA.len().sub(Int.one());
    return (
      arrayA.foldlWithIndex((i, b, a) => (
        F.pipeline(
          b,
          Semigroup.append, a.show(),
          Semigroup.append, (
            i.notEq(iEnd).cata({
              True: () => String.lift(' '),
              False: () => String.lift(')'),
            })
          )
        )
      ), (
        iEnd.eq(Int.lift(-1)).cata({
          True: () => String.lift('(Array)'),
          False: () => String.lift('(Array '),
        })
      ))
    );
  });
  /** show :: Show a => Show (Array a) => Array a ~> Unit -> String */
  Array.prototype.show = function() {return Array.show(this)};

  Array.foldlWithIndex = curry((f, b, arrayA) => (
    ((f, acc, arrayA) => {
      for (let i = 0, iEnd = arrayA.length; i < iEnd; i++) {
        acc  = f(Int.lift(i))(acc)(arrayA[i]);
      }
      return acc;
    })(curry(f), b, arrayA._)
  ));
  /** foldlWithIndex :: FoldableWithIndex Int Array => FoldableWithIndex a ~> (i -> b -> a -> b) -> b -> b */
  Array.prototype.foldlWithIndex = function(f, b) {return Array.foldlWithIndex(f, b, this)};

  Array.foldrWithIndex = curry((f, b, arrayA) => (
    ((f, acc, arrayA) => {
      for (let i = arrayA.length - 1; !(i < 0); i--) {
        acc  = f(Int.lift(i))(arrayA[i])(acc);
      }
      return acc;
    })(curry(f), b, arrayA._)
  ));
  /** foldrWithIndex :: FoldableWithIndex Int Array => FoldableWithIndex a ~> (i -> a -> b -> b) -> b -> b */
  Array.prototype.foldrWithIndex = function(f, b) {return Array.foldrWithIndex(f, b, this)};

  Array.foldMapWithIndex = FoldableWithIndex.foldMapWithIndexDefaultL;
  /** foldMap :: Foldable Int Array => Monoid f0 => Array a ~> (Int -> a -> f0) -> f0 */
  Array.prototype.foldMapWithIndex = function(f) {return Array.foldMapWithIndex(f, this)};

  Array.mapWithIndex = curry((f, arrayA) => (
    (f => (
      arrayA.foldlWithIndex((i, arrayB, a) => (
        arrayB.push(f(i)(a))
      ), Array.mempty())
    ))(curry(f))
  ));
  /** mapWithIndex :: FunctorWithIndex Int Array => Array a ~> (Int -> a -> b) -> Array b */
  Array.prototype.mapWithIndex = function(f) {return Array.mapWithIndex(f, this)}

  Array.len = curry((arrayA) => (
    Int.lift(arrayA._.length)
  ));
  /** len :: Array a ~> Int */
  Array.prototype.len = function() {return Array.len(this)};

  Array.at = curry((i, arrayA) => (
    arrayA._[i.unlift()]
  ));
  /** at :: Array a ~> Int -> a */
  Array.prototype.at = function(i) {return Array.at(i, this)};

  Array.replicate = curry((n, a) => {
    let arrayA = Array.mempty();
    let i = Int.lift(0);
    while (i.notEq(n)) {
      arrayA = arrayA.push(a);
      i = i.inc();
    }
    return arrayA;
  });

  Array.range = curry((min, max) => {
    let arrayA = Array.mempty();
    let i = min;
    while (i.notGt(max).unlift()) {
      arrayA = arrayA.push(i);
      i = i.inc();
    }
    return arrayA;
  });

  return Array;
})(Array(a));

module.exports = {
  default: Array_,
  Array: Array_,
};