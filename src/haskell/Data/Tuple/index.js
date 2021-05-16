/**
 * data Tuple a b = Tuple a b
 * 
 * (Show a, Show b) => Show (Tuple a b)
 * (Eq a, Eq b) => Eq (Tuple a b)
 * (Ord a, Ord b) => Ord (Tuple a b)
 * Semigroupoid Tuple
 * (Semigroup a, Semigroup b) => Semigroup (Tuple a b)
 * (Monoid a, Monoid b) => Monoid (Tuple a b)
 * (Semiring a, Semiring b) => Semiring (Tuple a b)
 * (Ring a, Ring b) => Ring (Tuple a b)
 * Functor (Tuple a)
 * Bifunctor Tuple
 * (Semigroup a) => Apply (Tuple a)
 * Biapply Tuple
 * (Monoid a) => Applicative (Tuple a)
 * Biapplicative Tuple
 * (Semigroup a) => Bind (Tuple a)
 * (Monoid a) => Monad (Tuple a)
 * Foldable (Tuple a)
 */

let {tagged} = require('../../daggy');
let {compose} = require('../../compose');
let {curry} = require('../../curry');
let {Semigroup} = require('../Semigroup');
let {Eq} = require('../Eq');
let {Foldable} = require('../Foldable');
let {Bifunctor} = require('../Bifunctor');
let {Show} = require('../Show');
let {String} = require('../String');
let {Bool} = require('../Bool');
let {Ordering} = require('../Ordering');
let {Ord} = require('../Ord');
let {Function:F} = require('../Function');

const Tuple = (a, b) => {
  /** Tuple :: a -> b -> Tuple a b */
  let Tuple = {};
  Tuple = tagged('Tuple', ['a', 'b']);
  Tuple = Object.assign((f => curry(f))(Tuple), Tuple);
  Tuple.prototype.constructor = Tuple;

  /** lift :: a -> b -> Tuple a b */
  Tuple.lift = curry((a, b) => Tuple(a, b));

  /** unlift :: Tuple a b -> [a, b] */
  Tuple.unlift = tuple => [tuple.a, tuple.b];
  /** unlift :: Tuple a b ~> Unit -> [a, b] */
  Tuple.prototype.unlift = function() {return Tuple.unlift(this)};

  /** useType :: c -> d -> Tuple a b -> Tuple c d */
  Tuple.useType = curry((c, d, tuple) => (
    Tuple(c, d).lift(...tuple.unlift())
  ));
  /** useType :: Tuple a b ~> c -> d -> Tuple c d */
  Tuple.prototype.useType = function(c, d) {return Tuple.useType(c, d, this)};

  /** fst :: Tuple a b -> a */
  Tuple.fst = tuple => tuple.a;
  /** fst :: Tuple a b ~> Unit -> a */
  Tuple.prototype.fst = function() {return Tuple.fst(this)};

  /** snd :: Tuple a b -> b */
  Tuple.snd = tuple => tuple.b;
  /** snd :: Tuple a b ~> Unit -> b */
  Tuple.prototype.snd = function() {return Tuple.snd(this)};

  /** show :: (Show a, Show b) => Show (Tuple a b) => Tuple a b -> String */
  Tuple.show = tuple => (
    F.pipeline(
      String.lift('(Tuple '),
      Semigroup.append, tuple.a.show().append(String.lift(' ')),
      Semigroup.append, tuple.b.show(),
      Semigroup.append, String.lift(')'),
    )
  );
  /** show :: (Show a, Show b) => Show (Tuple a b) => Tuple a b ~> Unit -> String */
  Tuple.prototype.show = function() {return Tuple.show(this)};

  /** eq :: (Eq a, Eq b) => Eq (Tuple a b) => Tuple a b -> Tuple a b -> Bool */
  Tuple.eq = curry((tuple0, tuple1) => (
    Bool.and(tuple0.a.eq(tuple1.a), tuple0.b.eq(tuple1.b))
  ));
  /** eq :: (Eq a, Eq b) => Eq (Tuple a b) => Tuple a b ~> Tuple a b -> Bool */
  Tuple.prototype.eq = function(tuple) {return Tuple.eq(this, tuple)};

  /** compare :: (Ord a, Ord b) => Ord (Tuple a b) => Tuple a b -> Tuple a b -> Ordering */
  Tuple.compare = curry((tuple0, tuple1) => (
    tuple0.a.compare(tuple1.a).append(tuple0.b.compare(tuple1.b))
  ));
  Tuple.prototype.compare = function(tuple) {return Tuple.compare(this, tuple)};

  /** compose :: Semigroupoid Tuple => Tuple _ b -> Tuple a _ -> Tuple a b */
  Tuple.compose = curry((tuple0, tuple1) => (
    Tuple.lift(tuple1.a, tuple0.b)
  ));
  /** compose :: Semigroupoid Tuple => Tuple _ b ~> Tuple a _ -> Tuple a b */
  Tuple.prototype.compose = function(tuple) {return Tuple.compose(this, tuple)};

  /**
   * append :: (Semigroup a, Semigroup b) => Semigroup (Tuple a b) =>
   * Tuple a b -> Tuple a b -> Tuple a b
   */
  Tuple.append = curry((tuple0, tuple1) => (
    Tuple.lift(tuple0.a.append(tuple1.a), tuple0.b.append(tuple1.b))
  ));
  /**
   * append :: (Semigroup a, Semigroup b) => Semigroup (Tuple a b) =>
   * Tuple a b ~> Tuple a b -> Tuple a b
   */
  Tuple.prototype.append = function(tuple) {return Tuple.append(this, tuple)};

  /** mempty :: (Monoid a, Monoid b) => Monoid (Tuple a b) => Unit -> Tuple a b */
  Tuple.mempty = () => Tuple.lift(a.mempty(), b.mempty());

  /**
   * add :: (Semiring a, Semiring b) => Semiring (Tuple a b) =>
   * Tuple a b -> Tuple a b -> Tuple a b
   */
  Tuple.add = curry((tuple0, tuple1) => (
    Tuple.lift(tuple0.a.add(tuple1.a), tuple0.b.add(tuple1.b))
  ));
  /**
   * add :: (Semiring a, Semiring b) => Semiring (Tuple a b) =>
   * Tuple a b ~> Tuple a b -> Tuple a b
   */
  Tuple.prototype.add = function(tuple) {return Tuple.add(this, tuple)};
  
  /**
   * one :: (Semiring a, Semiring b) => Semiring (Tuple a b) =>
   * Unit -> Tuple a b
   */
  Tuple.one = () => Tuple.lift(a.one(), b.one());

  /**
   * mul :: (Semiring a, Semiring b) => Semiring (Tuple a b) =>
   * Tuple a b -> Tuple a b -> Tuple a b
   */
  Tuple.mul = curry((tuple0, tuple1) => (
    Tuple.lift(tuple0.a.mul(tuple1.a), tuple0.b.mul(tuple1.b))
  ));
  /**
   * mul :: (Semiring a, Semiring b) => Semiring (Tuple a b) =>
   * Tuple a b ~> Tuple a b -> Tuple a b
   */
  Tuple.prototype.mul = function(tuple) {return Tuple.mul(this, tuple)};

  /**
   * zero :: (Semiring a, Semiring b) => Semiring (Tuple a b) =>
   * Unit -> Tuple a b
   */
  Tuple.zero = () => Tuple.lift(a.zero(), b.zero());

  /** map :: Functor (Tuple a) => (b -> c) -> Tuple a b -> Tuple a c */
  Tuple.map = curry((f, tupleAB) => (
    Tuple.lift(tupleAB.a, f(tupleAB.b))
  ));
  /** map :: Functor (Tuple a) => Tuple a b ~> (b -> c) -> Tuple a c */
  Tuple.prototype.map = function(f) {return Tuple.map(f, this)};

  /** bimap :: Bifunctor Tuple => (a -> c) -> (b -> d) -> Tuple a b -> Tuple c d */
  Tuple.bimap = curry((f0, f1, tupleAB) => (
    Tuple.lift(f0(tupleAB.a), f1(tupleAB.b))
  ));
  /* bimap :: Bifunctor Tuple => Tuple a b ~> (a -> c) -> (b -> d) -> Tuple c d */
  Tuple.prototype.bimap = function(f0, f1) {return Tuple.bimap(f0, f1, this)};

  /** ap :: (Semigroup a) => Apply (Tuple a) => Tuple a (b -> c) -> Tuple a b -> Tuple a c */
  Tuple.ap = curry((tupleAF, tupleAB) => (
    Tuple.lift(tupleAF.a.append(tupleAB.a), tupleAF.b(tupleAB.b))
  ));
  /** ap :: (Semigroup a) => Apply (Tuple a) => Tuple a b ~> Tuple a (b -> c) -> Tuple a c */
  Tuple.prototype.ap = function(tupleAF) {return Tuple.ap(tupleAF, this)};

  /** biap :: Biapply Tuple => Tuple (a -> c) (b -> d) -> Tuple a b -> Tuple c d */
  Tuple.biap = curry((tupleFG, tupleAB) => (
    Tuple.lift(tupleFG.a(tupleAB.a), tupleFG.b(tupleAB.b))
  ));
  /** biap :: Biapply Tuple => Tuple a b ~> Tuple (a -> c) (b -> d) -> Tuple c d */
  Tuple.prototype.biap = function(tupleFG) {return Tuple.biap(tupleFG, this)};

  /**
   * pure :: (Monoid a) => Applicative (Tuple a) =>
   * b -> Tuple a b
   */
  Tuple.pure = _ => Tuple.lift(a.mempty())(_);

  /**
   * bipure :: Biapplicative Tuple =>
   * a -> b -> Tuple a b
   */
  Tuple.bipure = Tuple.lift;

  /**
   * bind :: (Semigroup a) => Bind (Tuple a) =>
   * Tuple a b -> (b -> Tuple a c) -> Tuple a c
   */
  Tuple.bind = curry((tupleAB, f) => (
    f(tupleAB.b).cata({
      _: (a, c) => Tuple.lift(tupleAB.a.append(a), c),
    })
  ));
  /**
   * bind :: (Semigroup a) => Bind (Tuple a) =>
   * Tuple a b ~> (b -> Tuple a c) -> Tuple a c
   */
  Tuple.prototype.bind = function(f) {return Tuple.bind(this, f)};

  /** foldl :: Foldable (Tuple a) => (c -> b -> c) -> c -> Tuple a b -> c */
  Tuple.foldl = curry((f, c, tupleAB) => f(c)(tupleAB.b));
  /** foldl :: Foldable (Tuple a) => Tuple a b ~> (c -> b -> c) -> c -> c */
  Tuple.prototype.foldl = function(f, c) {return Tuple.foldl(f, c, this)};

  /** foldr :: Foldable (Tuple a) => (b -> c -> c) -> c -> Tuple a b -> c */
  Tuple.foldr = curry((f, c, tupleAB) => f(tupleAB.b)(c));
  /** foldr :: Foldable (Tuple a) => Tuple a b ~> (b -> c -> c) -> c -> c */
  Tuple.foldr = function(f, c) {return Tuple.foldr(f, c, this)};

  /** foldMap :: Foldable (Tuple a) => Monoid f => typeof f -> (b -> f) -> Tuple a b -> f */
  Tuple.foldMap = Foldable.foldMapDefaultL(Tuple);
  /** foldMap :: Foldable (Tuple a) => Monoid f => Tuple a b ~> (b -> f) -> typeof f -> f */
  Tuple.foldMap = function(f, Monoid) {return Tuple.foldMap(Monoid, f, this)};

  /** lmap :: Bifunctor Tuple => (a -> c) -> Tuple a b -> Tuple c b */
  Tuple.lmap = undefined;
  /** rmap :: Bifunctor Tuple => (b -> d) -> Tuple a b -> Tuple a d */
  Tuple.rmap = undefined;

  Tuple = compose(
    Eq.Eq,
    Ord.Ord,
    Bifunctor.Bifunctor,
  )(Tuple);

  return Tuple;
};

module.exports = {
  default: Tuple,
  Tuple,
};