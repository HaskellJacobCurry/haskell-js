/**
 * data Object a = Object a
 * 
 * (Show a) => Show (Object a)
 * Functor Object
 * Foldable Object
 * Monoid (Object a)
 * FunctorWithIndex String Object
 * TraversableWithIndex String Object
 */

let {taggedSum} = require('../../daggy');
let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {Bind} = require('../../Control/Bind');
let {Foldable} = require('../Foldable');
let {Semigroup} = require('../Semigroup');
let {String} = require('../String');
let {Traversable} = require('../Traversable');
let {Bool} = require('../Bool');
let {Maybe} = require('../Maybe');
let {Function:F} = require('../Function');
let {Array} = require('../Array');
let {Tuple} = require('../Tuple');

/** data Object a = Object a */
const Object = (a) => {
  /** data Object a = Object a */
  let Object = {};
  /** Object :: Record String a -> Object a */
  Object._ = undefined;
  Object = taggedSum('Object', {
    _: ['objA'],
  });
  Object.prototype.constructor = Object;

  /** lift :: Record String a -> Object a */
  Object.lift = objA => Object._(objA);

  /** unlift :: Object a -> Record String a */
  Object.unlift = objA => objA.objA;
  /** unlift :: Object a ~> Unit -> Record String a */
  Object.prototype.unlift = function() {return Object.unlift(this)};

  /** show :: Show a => Show (Object a) => Object a -> String */
  Object.show = objA => (
    F.pipeline(
      String.lift('(fromFoldable '),
      Semigroup.append, objA.toArray().show(),
      Semigroup.append, String.lift(')')
    )
  );
  /** show :: Show a => Show (Object a) => Object a ~> Unit -> String */
  Object.prototype.show = function() {return Object.show(this)};

  /** foldM_ :: (m -> (b -> m) -> m) -> (b -> String -> a -> m) -> m -> Object a -> m */
  Object.foldM_ = curry((bind, f, m, objA) => (
    ((bind, f, objA) => (
      (g => {
        let acc = m;
        for (let k in objA) {
          if (objA.hasOwnProperty(k)) {
            acc = bind(acc)(g(k));
          }
        }
        return acc;
      })(k => b => f(b)(String.lift(k))(objA[k]))
    ))(curry(bind), curry(f), objA.objA)
  ));
  /** foldM_ :: Object a ~> (m -> (b -> m) -> m) -> (b -> String -> a -> m) -> m -> m */
  Object.prototype.foldM_ = function(bind, f, m) {return Object.foldM_(bind, f, m, this)};

  /** foldM :: Monad m => typeof m -> (b -> String -> a -> m b) -> b -> Object a -> m b */
  Object.foldM = (Monad) => curry((f, b, objA) => (
    Object.foldM_(Bind.bind, f, Monad.pure(b), objA)
  ));
  /** foldM :: Monad m => Object a ~> (b -> String -> a -> m b) -> b -> typeof m -> m b */
  Object.prototype.foldM = function(f, b, Monad) {return Object.foldM(Monad)(f, b, this)};

  /** fold :: (b -> String -> a -> b) -> b -> Object a -> b */
  Object.fold = Object.foldM_(b => f => f(b));
  /** fold :: Object a ~> (b -> String -> a -> b) -> b -> b */
  Object.prototype.fold = function(f, b) {return Object.fold(f, b, this)};

  /** foldl :: Foldable Object => (b -> a -> b) -> b -> Object a -> b */
  Object.foldl = curry((f, b, objA) => (
    (f => (
      Object.fold((b, _) => f(b))(b, objA)
    ))(curry(f))
  ));
  /** foldl :: Foldable Object => Object a ~> (b -> a -> b) -> b -> b */
  Object.prototype.foldl = function(f, b) {return Object.foldl(f, b, this)};

  /** foldr :: Foldable Object => (a -> b -> b) -> b -> Object a -> b */
  Object.foldr = Foldable.foldrDefaultL;
  /** foldr :: Foldable Object => Object a ~> (a -> b -> b) -> b -> b */
  Object.prototype.foldr = function(f, b) {return Object.foldr(f, b, this)};

  /** foldMap :: Foldable Object => Monoid f0 => typeof f0 -> (a -> f0) -> Object a -> f0 */
  Object.foldMap = Foldable.foldMapDefaultL(Object);
  /** foldMap :: Foldable Object => Monoid f0 => Object a ~> (a -> f0) -> typeof f0 -> f0 */
  Object.prototype.foldMap = function(f, Monoid) {return Object.foldMap(Monoid)(f, this)};

  /** mapWithIndex :: FunctorWithIndex String Object => (String -> a -> b) -> Object a -> Object b */
  Object.mapWithIndex = Object.mapWithKey;
  /** mapWithIndex :: FunctorWithIndex String Object => Object a ~> (String -> a -> b) -> Object b */
  Object.prototype.mapWithIndex = function(f) {return Object.mapWithIndex(f, this)};

  /** traverseWithIndex :: TraversableWithIndex String Object => Applicative f0 => typeof f0 -> (String -> a -> f0 b) -> Object a -> f0 (Object b) */
  Object.traverseWithIndex = (Applicative) => curry((f, objA) => (
    (f => (
      Object.fold((f0, k, a) => (
        F.ado(
          f0, f(k)(a)
        )(F.flip(Object.set(k)))()
      ), Applicative.pure(Object.mempty()), objA)
    ))(curry(f))
  ));
  /** traverseWithIndex :: TraversableWithIndex String Object => Applicative f0 => Object a ~> (String -> a -> f0 b) -> typeof f0 -> f0 (Object b) */
  Object.prototype.traverseWithIndex = function(f, Applicative) {return Object.traverseWithIndex(Applicative)(f, this)};

  /** traverse :: Traversable Object => Applicative f => typeof f -> (a -> f b) -> Object a -> f (Object b) */
  Object.traverse = (Applicative) => curry((f, objA) => (
    compose(Object.traverseWithIndex(Applicative), F.const)(f)(objA)
  ));

  /** sequence :: Traversable Object => Applicative f0 => typeof f0 -> Object (f0 a) -> f0 (Object a) */
  Object.sequence = Traversable.sequenceDefault;

  /** mempty :: Monoid (Object a) => Unit -> Object a */
  Object.mempty = () => Object.lift({});

  /** set :: String -> a -> Object a -> Object a */
  Object.set = curry((k, a, objA) => (
    ((k, objA) => objA[k] = a)(k.unlift(), objA.objA), objA
  ));
  /** set :: Object a ~> String -> a -> Object a */
  Object.prototype.set = function(k, a) {return Object.set(k, a, this)};

  /** unset :: String -> Object a -> Object a */
  Object.unset = curry((k, objA) => (
    ((k, objA) => delete objA[k])(k.unlift(), objA.objA), objA
  ));
  /** unset :: Object a ~> String -> Object a */
  Object.prototype.unset = function(k) {return Object.unset(k, this)};

  /** insert :: String -> a -> Object a -> Object a */
  Object.insert = Object.set;
  /** insert :: Object a ~> String -> a -> Object a */
  Object.prototype.insert = Object.prototype.set;

  /** delete :: String -> Object a -> Object a */
  Object.delete = Object.unset;
  /** delete :: Object a ~> String -> Object a */
  Object.prototype.delete = Object.prototype.unset;

  /** pop :: String -> Object a -> Maybe (Tuple a (Object a)) */
  Object.pop = curry((k, objA) => (
    objA.lookup(k).map(a => (objA.unset(k), a)).map(Tuple().lift).map(f => f(objA))
  ));
  /** pop :: Object a ~> String -> Maybe (Tuple a (Object a)) */
  Object.prototype.pop = function(k) {return Object.pop(k, this)};

  /** map :: Functor Object => (a -> b) -> Object a -> Object b */
  Object.map = curry((f, objA) => (
    Object.mapWithKey(() => f, objA)
  ));
  /** map :: Functor Object => Object a ~> (a -> b) -> Object b */
  Object.prototype.map = function(f) {return Object.map(f, this)};

  /** mapWithKey :: (String -> a -> b) -> Object a -> Object b */
  Object.mapWithKey = curry((f, objA) => (
    ((f) => (
      objA.fold((objB, k, a) => objB.set(k, f(k)(a)), Object.mempty())
    ))(curry(f))
  ));
  /** mapWithKey :: Object a ~> (String -> a -> b) -> Object b */
  Object.prototype.mapWithKey = function(f) {return Object.mapWithKey(f, this)};

  /* filter :: (a -> Bool) -> Object a -> Object a */
  Object.filter = curry((f, objA) => (
    Object.filterWithKey(() => f, objA)
  ));
  /** filter :: Object a ~> (a -> Bool) -> Object a */
  Object.prototype.filter = function(f) {return Object.filter(f, this)};

  /** filterWithKey :: (String -> a -> Bool) -> Object a -> Object a */
  Object.filterWithKey = curry((f, objA) => (
    ((f) => (
      objA.fold((objA, k, a) => (
        f(k)(a).cata({
          True: () => objA.set(k, a),
          False: () => objA,
        })
      ), Object.mempty())
    ))(curry(f))
  ));
  /** filterWithKey :: Object a ~> (String -> a -> Bool) -> Object a */
  Object.prototype.filterWithKey = function(f) {return Object.filterWithKey(f, this)};

  /** lookup :: String -> Object a -> Maybe a */
  Object.lookup = curry((k, objA) => (
    ((k, objA) => (
      Bool.lift(k in objA).cata({
        True: () => Maybe().pure(objA[k]),
        False: Maybe().mempty,
      })
    ))(k.unlift(), objA.unlift())
  ));
  /** lookup :: Object a ~> String -> Maybe a */
  Object.prototype.lookup = function(k) {return Object.lookup(k, this)};

  /** union :: Object a -> Object a -> Object a */
  Object.union = curry((obj0, obj1) => (
    obj0.fold((obj, k, a) => (
      obj.set(k, a)
    ), obj1.clone())
  ));
  /** union :: Object a ~> Object a -> Object a */
  Object.prototype.union = function(obj) {return Object.union(this, obj)};

  /** unions :: Foldable f => f (Object a) -> Object a */
  Object.unions = objs => (
    objs.foldl((acc, obj) => acc.union(obj), Object.mempty())
  );

  /** clone :: Object a -> Object a */
  Object.clone = Object.map(F.identity);
  /** clone :: Object a ~> Unit -> Object a */
  Object.prototype.clone = function() {return Object.clone(this)};
  
  /** toArrayWithKey :: (String -> a -> b) -> Object a -> Array b */
  Object.toArrayWithKey = curry((f, objA) => (
    (f => (
      objA.fold((arrayB, k, a) => arrayB.push(f(k, a)), Array().mempty())
    ))(curry(f))
  ));
  /** toArrayWithKey :: Object a ~> (String -> a -> b) -> Array b */
  Object.prototype.toArrayWithKey = function(f) {return Object.toArrayWithKey(f, this)};

  /** toArray :: Object a -> Array (Tuple String a) */
  Object.toArray = Object.toArrayWithKey(Tuple().lift);
  /** toArray :: Object a ~> Unit -> Array (Tuple String a) */
  Object.prototype.toArray = function() {return Object.toArray(this)};

  /** fromFoldable :: Foldable f => f (Tuple String a) -> Object a */
  Object.fromFoldable = foldable => (
    foldable.foldl((objA, tuple) => objA.set(tuple.fst(), tuple.snd()), Object.mempty())
  );

  return Object;
};

module.exports = {
  default: Object,
  Object,
};