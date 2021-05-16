/**
 * newtype Function a b = a -> b
 * Show (Function a b)
 * Semigroupoid Function
 * Category Function
 * 
 * flip :: (a -> b -> c) -> b -> a -> c
 * const :: a -> b -> a
 * apply :: (a -> b) -> a -> b
 * on :: (b -> b -> c) -> (a -> b) -> a -> a -> c
 * pipeline :: (...[n](a[i] -> (a[i] -> a[i+1] -> a[i+2]) -> a[i+1])) -> a[n+2]
 * pipeline_ :: (next -> [n](a[i] -> (a[i] -> a[i+1] -> a[i+2]) -> a[i+1])) -> a[n+2] where 
 *  next :: a -> (a -> b) -> b
 * applicativeDo :: Applicative f => (...[n](f a[i])) -> (...[n-1](a[i] -> a[i+1]) -> b) -> Unit -> f b
 * ado :: typeof applicativeDo
 * monadDo :: Monad f => (...[1,n](f a[i])) -> (...[1,n-1](a[i] -> a[i+1]) -> b) -> Unit -> f b
 * mdo :: typeof monadDo
 * compose :: (b -> c) -> (a -> b) -> a -> c
 * identity :: a -> a
 */

let {tagged,taggedSum} = require('../../daggy');
let {curry,define} = require('../../curry');
let {pipe,compose} = require('../../compose');
let {recurse} = require('../../trampoline');
let {Functor} = require('../Functor');
let {Apply} = require('../../Control/Apply');
let {Bind} = require('../../Control/Bind');
let {String} = require('../String');
let {Foldable} = require('../Foldable');
let {Array} = require('../Array/_');
let {Int} = require('../Int');

let Function = {};
Function = globalThis.Function;

/** show :: Show (Function a b) => Function a b -> String */
Function.show = f => String.lift(f.toString());
/** show :: Show (Function a b) => Function a b ~> Unit -> String */
Function.prototype.show = function() {return Function.show(this)};

/** compose :: Semigroupoid Function => Function b c -> Function a b -> Function a c */
Function.compose = curry((f0, f1) => (
  a => f0(f1(a))
));
/** compose :: Semigroupoid Function => Function b c ~> Function a b -> Function a c */
Function.prototype.compose = function(f) { return Function.compose(this, f); };
Function.prototype['*'] = Function.prototype.compose;

/** identity :: Category Function => Function a a */
Function.identity = a => a;

/** flip :: (a -> b -> c) -> b -> a -> c */
Function.flip = f => (
  curry((b, a) => (f => f(a)(b))(curry(f)))
);

/** const :: a -> b -> a */
Function.const = curry((a, _) => a);

/** apply :: (a -> b) -> a -> b */
Function.apply = f => a => f(a);

/** on :: (b -> b -> c) -> (a -> b) -> a -> a -> c */
Function.on = curry((f0, f1, a0, a1) => (
  f0(f1(a0), f1(a1))
));

/** pipeline :: (...[n](a[i] -> (a[i] -> a[i+1] -> a[i+2]) -> a[i+1])) -> a[n+2] */
Function.pipeline = (...filters) => (
  (i => (
    pipe(...(
      pipe(
        () => Array().lift(filters),
        Foldable.foldl((acc, filter) => (
          i = i.inc(),
          i.eq(Int.lift(0)).cata({
            True: () => acc.push(() => filter),
            False: () => i.even().cata({
              True: () => acc.push(f => f(filter)),
              False: () => acc.push(curry(filter)),
            }),
          })
        ), Array().mempty()),
        Array().unlift,
      )()
    ))()
  ))(Int.lift(-1))
);

/** 
 * pipeline_ :: (next -> [n](a[i] -> (a[i] -> a[i+1] -> a[i+2]) -> a[i+1])) -> a[n+2] where 
 *  next :: a -> (a -> b) -> b
 */
Function.pipeline_ = (filters) => Function.pipeline(...filters((a, f) => f(a)));

/** applicativeDo :: Applicative f => (...[n](f a[i])) -> (...[n-1](a[i] -> a[i+1]) -> b) -> Unit -> f b */
Function.applicativeDo = (...applicatives) => f => () => {
  f = curry(f);
  let i = Int.lift(-1);
  return (
    Array().lift(applicatives)
      .foldl((acc, applicative) => (
        i = i.inc(),
        i.eq(Int.lift(0)).cata({
          True: () => Functor.map(acc, applicative),
          False: () => Apply.ap(acc, applicative),
        })
      ), f)
  );
};
Function.ado = Function.applicativeDo;

/** monadDo :: Monad f => (...[1,n](f a[i])) -> (...[1,n-1](a[i] -> a[i+1]) -> b) -> Unit -> f b */
Function.monadDo = (...monads) => f => () => {
  let Monad = monads[0].constructor;
  monads = Array().lift(monads);
  f = curry(f);
  return (
    monads
      .foldl((acc, monad) => (
        Bind.bind(monad, a => (
          Bind.bind(acc, f => (
            Monad.pure(f(a))
          ))
        ))
      ), Monad.pure(f))
  );
};
Function.mdo = Function.monadDo;

/** monadDo_ :: Monad f => (...[1,n]((...[i-1](a[j])) -> f a[i])) -> (...[1,n-1](a[i] -> a[i+1]) -> b) -> Unit -> f b */
Function.monadDo_ = (...fMonads) => f => () => {
  let Monad = fMonads[0]().constructor;
  fMonads = Array().lift(fMonads);
  f = curry(f);
  return (
    fMonads
      .foldl((acc, fMonad) => (
        Bind.bind(acc, ([f, as]) => (
          Bind.bind(fMonad(...as.unlift()), a => (
            Monad.pure([f(a), as.push(a)])
          ))
        ))
      ), Monad.pure([f, Array().mempty()]))
      .map(acc => acc[0])
  );
};
Function.mdo_ = Function.monadDo_;

/** define :: ((S,...a[i]) -> b) -> (...a[i]) -> b */
Function.define = define;

/** defineR :: ((S,...a[i]) -> b) -> (...a[i]) -> b */
Function.defineR = recurse;

/** recurse :: ((S,...a[i]) -> b) -> (...a[i]) -> b */
Function.recurse = recurse;

/** composeN :: (...(a[i] -> a[i+1])) -> a[n-1] -> a[0] */
Function.composeN = compose;

/** pipeN :: (...(a[i] -> a[i+1])) -> a[0] -> a[n] */
Function.pipeN = pipe;

/** curry :: ((...a0) X (...a1) -> b) -> (...a0) -> (...a1) -> b */
Function.curry = curry;

Function.tagged = tagged;
Function.taggedSum = taggedSum;

/** static :: ((...a[i]) -> b) -> (...a[i]) -> this -> b */
Function.static = f => (...as) => ins => f.apply(ins, as);

/** assign :: (Unit -> a) -> (a -> b) -> b */
Function.assign = thunk => f => f(thunk());

module.exports = {
  default: Function,
  Function,
};