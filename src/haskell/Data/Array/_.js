/**
 * data Array a = Array a
 * 
 * Show (Array a)
 * Monoid (Array a)
 * Semigroup (Array a)
 * Applicative Array
 * Functor Array
 * Apply Array
 * Bind Array
 * Monad Array
 * Foldable Array
 * Traversable Array
 */

let {tagged} = require('../../daggy');
let {curry} = require('../../curry');
let {String} = require('../String');
let {Foldable} = require('../Foldable');

/** data Array a = Array a */
const Array = (a) => {
  /** Array :: a[] -> Array a */
  let Array = {};
  Array = tagged('Array', ['_']);
  Array.prototype.constructor = Array;

  /** lift :: a[] -> Array a */
  Array.lift = _ => Array(_);

  /** unlift :: Array a -> a[] */
  Array.unlift = array => array._;
  /** unlift :: Array a ~> Unit -> a[] */
  Array.prototype.unlift = function() {return Array.unlift(this)};

  /** show :: Show a => Show (Array a) => Array a -> String */
  Array.show = arrayA => (
    arrayA.foldl((b, a) => (
      b.append(a.show()).append(String.lift(','))
    ), String.lift('['))
  );
  /** show :: Show a => Show (Array a) => Array a ~> Unit -> String */
  Array.prototype.show = function() {return Array.show(this)};

  /** mempty :: Monoid (Array a) => Unit -> Array a */
  Array.mempty = () => Array([]);

  /** append :: Semigroup (Array a) => Array a -> Array a -> Array a */
  Array.append = curry((array0, array1) => (
    Array.concat(Array.lift([array0, array1]))
  ));
  /** append :: Semigroup (Array a) => Array a ~> Array a -> Array a */
  Array.prototype.append = function(arrayA) {return Array.append(this, arrayA)};

  /** pure :: Applicative Array => a -> Array a */
  Array.pure = (a) => Array([a]);

  /** foldl :: Foldable Array => (b -> a -> b) -> b -> Array a -> b */
  Array.foldl = curry((f, b, arrayA) => (
    ((acc, f) => {
      for (let a of arrayA._) {
        acc = f(acc)(a);
      }
      return acc;
    })(b, curry(f))
  ));
  /** foldl :: Foldable Array => Array a ~> (b -> a -> b) -> b -> b */
  Array.prototype.foldl = function(f, b) {return Array.foldl(f, b, this)};

  /** foldr :: Foldable Array => (a -> b -> b) -> b -> Array a -> b */
  Array.foldr = curry((f, b, arrayA) => (
    ((acc, f, arrayA) => {
      for (let i = arrayA.length - 1; !(i < 0); i--) {
        acc = f(arrayA[i])(acc);
      }
      return acc;
    })(b, curry(f), arrayA._)
  ));
  /** foldr :: Foldable Array => Array a ~> (a -> b -> b) -> b -> b */
  Array.prototype.foldr = function(f, b) {return Array.foldr(f, b, this)};

  /** foldMap :: Foldable Array => Monoid f0 => typeof f0 -> (a -> f0) -> Array a -> f0 */
  Array.foldMap = Foldable.foldMapDefaultL;
  /** foldMap :: Foldable Array => Monoid f0 => Array a ~> (a -> f0) -> typeof f0 -> f0 */
  Array.prototype.foldMap = function(f, Monoid) {return Array.foldMap(Monoid)(f, this)};

  /** map :: Functor Array => (a -> b) -> Array a -> Array b */
  Array.map = curry((f, arrayA) => (
    Array.foldl((acc, a) => Array.push(f(a))(acc))(Array.mempty())(arrayA)
  ));
  /** map :: Functor Array => Array a ~> (a -> b) -> Array b */
  Array.prototype.map = function(f) {return Array.map(f, this)};

  /** ap :: Apply Array => Array (a -> b) -> Array a -> Array b */
  Array.ap = curry((arrayF, arrayA) => (
    Array.concat(
      Array.map(a => Array.map(f => f(a), arrayF), arrayA)
    )
  ));
  /** ap :: Apply Array => Array a ~> Array (a -> b) -> Array b */
  Array.prototype.ap = function(arrayF) {return Array.ap(arrayF, this)};

  /** bind :: Bind Array => Array a -> (a -> Array b) -> Array b */
  Array.bind = curry((arrayA, f) => (
    arrayA.foldl((acc, a) => (
      acc.append(f(a))
    ), Array.mempty())
  ));
  /** bind :: Bind Array => Array a ~> (a -> Array b) -> Array b */
  Array.prototype.bind = function(f) {return Array.bind(this, f)};

  /** traverse :: Traversable Array => Applicative f0 => typeof f0 -> (a -> f0 b) -> Array a -> f0 (Array b) */
  Array.traverse = (Applicative) => curry((f, arrayA) => (
    Array.foldl((acc, a) => (
      acc.ap(f(a).map(b => arrayB => arrayB.push(b)))
    ), Applicative.pure(Array.mempty()), arrayA)
  ));
  /** traverse :: Traversable Array => Applicative f0 => Array a ~> (a -> f0 b) -> typeof f0 -> f0 (Array b) */
  Array.prototype.traverse = function(f, Applicative) {return Array.traverse(Applicative)(f, this)};

  /** push :: a -> Array a -> Array a */
  Array.push = curry((a, arrayA) => (
    (array => array[array.length] = a)(arrayA._), arrayA
  ));
  /** push :: Array a ~> a -> Array a */
  Array.prototype.push = function(a) {return Array.push(a, this)};

  /** concat :: Array (Array a) -> Array a */
  Array.concat = (arrayAs) => (
    arrayAs.foldl((acc, arrayA) => (
      arrayA.foldl((acc, a) => (
        acc.push(a)
      ), acc)
    ), Array.mempty())
  );
  /** concat :: Array a ~> Array (Array a) -> Array a */
  Array.prototype.concat = function(arrays) {return Array.concat(arrays.push(this))};

  /** concatMap :: Array (a -> b) -> Array a -> Array b */
  Array.concatMap = Array.ap;
  /** concatMap :: Array a ~> Array (a -> b) -> Array b */
  Array.prototype.concatMap = function(arrayF) {return Array.concatMap(arrayF, this)};

  /** clone :: Array a -> Array a */
  Array.clone = curry((arrayA) => (
    arrayA.foldl((acc, a) => acc.push(a), Array.mempty())
  ));
  /** clone :: Array a ~> Unit -> Array a */
  Array.prototype.clone = function() {return Array.clone(this)};

  /** fromFoldable :: Foldable f => f ~> List */
  Array.fromFoldable = foldable => foldable.foldl((b, a) => Array.push(a, b), Array.mempty());

  /** pushJS :: (...a) -> Array a -> Array a */
  Array.pushJS = (...vals) => array => (
    Array.concat(Array.lift([array, Array.lift(vals)]))
  );
  /** pushJS :: Array a ~> (...a) -> Array a */
  Array.prototype.pushJS = function(...vals) {return Array.pushJS(...vals)(this)};

  /** foldlWithIndex :: FoldableWithIndex Int Array => (i -> b -> a -> b) -> b -> FoldableWithIndex a -> b */
  Array.foldlWithIndex = undefined;
  /** foldrWithIndex :: FoldableWithIndex Int Array => (i -> a -> b -> b) -> b -> FoldableWithIndex a -> b */
  Array.foldrWithIndex = undefined;
  /** foldMap :: Foldable Int Array => Monoid f0 => (Int -> a -> f0) -> Array a -> f0 */
  Array.foldMapWithIndex = undefined;
  /** mapWithIndex :: FunctorWithIndex Int Array => (Int -> a -> b) -> Array a -> Array b */
  Array.mapWithIndex = undefined;
  /** len :: Array a -> Int */
  Array.len = undefined;
  /** at :: Int -> Array a -> a */
  Array.at = undefined;
  /** replicate :: Int -> a -> Array a */
  Array.replicate = undefined;
  /** range :: Int -> Int -> Array Int */
  Array.range = undefined;

  return Array;
};

module.exports = {
  default: Array,
  Array,
};