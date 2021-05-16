/**
 * data AsyncEffect a = AsyncEffect a
 *
 * Applicative AsyncEffect
 * Bind AsyncEffect
 * Apply AsyncEffect
 * Functor AsyncEffect
 * Semigroup a => Semigroup (AsyncEffect a)
 * Monoid a => Monoid (Effect a)
 */

let {tagged} = require('../../daggy');
let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {asyncTrampoline,affTrampoline} = require('../../trampoline');
let {Monad} = require('../../Control/Monad');
let {Applicative} = require('../../Control/Applicative');
let {Functor} = require('../../Data/Functor');
let {Show} = require('../../Data/Show');
let {String} = require('../../Data/String');
let {Unit} = require('../../Data/Unit');
let {Bool} = require('../../Data/Bool');
let {Ord} = require('../../Data/Ord');
let {Number} = require('../../Data/Number');
let {Int} = require('../../Data/Int');
let {Function:F} = require('../../Data/Function');
let {Deque} = require('../../Data/Deque');
let {Error} = require('../Error');

let makeQueuefyState = (
  (state = {
    limit: Int(4),
    n: Int(0),
  }) => state
);

/** data AsyncEffect a = AsyncEffect a */
const AsyncEffect = (a) => {
  /** AsyncEffect :: (Unit -> a | Promise a) -> AsyncEffect a */
  let AsyncEffect = {};
  AsyncEffect = tagged('AsyncEffect', ['thunkA']);
  AsyncEffect.prototype.constructor = AsyncEffect;

  /** lift :: (Unit -> a | Promise a) -> AsyncEffect a */
  AsyncEffect.lift = _ => AsyncEffect(_);

  /** unlift :: AsyncEffect a -> (Unit -> Promise a) */
  AsyncEffect.unlift = aff => () => Promise.resolve().then(aff.thunkA);
  /** unlift :: AsyncEffect a ~> Unit -> (Unit -> Promise a) */
  AsyncEffect.prototype.unlift = function() {return AsyncEffect.unlift(this)};

  /** run :: AsyncEffect a -> Promise a */
  AsyncEffect.run = aff => (
    Promise.resolve().then(() => aff.thunkA())
  );
  /** run :: AsyncEffect a ~> Unit -> Promise a */
  AsyncEffect.prototype.run = function() {return AsyncEffect.run(this)};

  /* throw :: String -> AsyncEffect a */
  AsyncEffect.throw = a => AsyncEffect.lift(() => {throw Error.lift(a)});

  /** catch :: (Error -> AsyncEffect a) -> AsyncEffect a -> AsyncEffect a */
  AsyncEffect.catch = curry((f, aff) => (
    AsyncEffect.lift(() => aff.run().catch(err => f(err).run()))
  ));
  /** catch :: AsyncEffect a ~> (Err -> AsyncEffect a) -> AsyncEffect a */
  AsyncEffect.prototype.catch = function(f) {return AsyncEffect.catch(f, this)};

  /** pure :: Applicative AsyncEffect => a -> AsyncEffect a */
  AsyncEffect.pure = (a = Unit) => AsyncEffect.lift(() => a);

  /** bind :: Bind AsyncEffect => AsyncEffect a -> (a -> AsyncEffect b) -> AsyncEffect b */
  AsyncEffect.bind = curry((affA, f) => (
    AsyncEffect.lift(() => affA.run().then(f).then(affB => affB.run()))
  ));
  /** bind :: Bind AsyncEffect => AsyncEffect a ~> (a -> AsyncEffect b) -> AsyncEffect b */
  AsyncEffect.prototype.bind = function(f) {return AsyncEffect.bind(this, f)};

  /** append :: Semigroup a => Semigroup (AsyncEffect a) => AsyncEffect a -> AsyncEffect a -> AsyncEffect a */
  AsyncEffect.append = curry((aff0, aff1) => (
    AsyncEffect.lift(() => aff0.run().then(a0 => aff1.run().then(a1 => a0.append(a1))))
  ));
  /** append :: Semigroup a => Semigroup (AsyncEffect a) => AsyncEffect a ~> AsyncEffect a -> AsyncEffect a */
  AsyncEffect.prototype.append = function(aff) {return AsyncEffect.append(this, aff)};

  /** mempty :: Monoid a => Monoid (AsyncEffect a) => Unit -> AsyncEffect a */
  AsyncEffect.mempty = () => AsyncEffect.lift(a.mempty);

  /** until :: AsyncEffect Bool -> AsyncEffect Unit */
  AsyncEffect.until = affP => (
    AsyncEffect.recurse_((s, affP) => (
      affP
        .bind(p => p.cata({
          True: compose(AsyncEffect.pure, Unit.lift),
          False: () => (
            AsyncEffect.waitFor(Number.lift(1e2))
              .bind(() => s(affP))
          ),
        }))
    ))(affP)
  );

  /** while :: AsyncEffect Bool -> AsyncEffect a -> AsyncEffect Unit */
  AsyncEffect.while = curry((affP, affA) => (
    AsyncEffect.recurse_(s => (
      affP
        .bind(p => p.cata({
          True: () => affA.bind(s),
          False: compose(AsyncEffect.pure, Unit.lift),
        }))
    ))()
  ))

  /** for :: Int -> Int -> (Int -> AsyncEffect a) -> AsyncEffect Unit */
  AsyncEffect.for = curry((i0, i1, f) => (
    AsyncEffect.recurse_((s, i) => (
      i.eq(i1).cata({
        True: compose(AsyncEffect.pure, Unit.lift),
        False: () => f(i).bind(() => s(i.inc())),
      })
    ))(i0)
  ));

  /** waitFor :: Number -> AsyncEffect Unit */
  AsyncEffect.waitFor = ms => (
    AsyncEffect.lift(() => new Promise(r => setTimeout(r, ms.unlift())))
  );
  /** waitFor :: AsyncEffect a ~> Number -> AsyncEffect a */
  AsyncEffect.prototype.waitFor = function(ms) {
    return this.bind(a => AsyncEffect.waitFor(ms).bind(() => AsyncEffect.pure(a)));
  };

  /** logJS :: String -> AsyncEffect Unit */
  AsyncEffect.logJS = compose(AsyncEffect.lift, (f => a => () => f(a))(console.log));

  /** log :: String -> AsyncEffect Unit */
  AsyncEffect.log = compose(AsyncEffect.logJS, String.unlift, Show.show);

  /** parallel :: Array (AsyncEffect a) -> AsyncEffect (Array a) */
  AsyncEffect.parallel = curry((affs) => (
    AsyncEffect.lift(() => (
      Promise.all(affs.map(AsyncEffect.run).unlift())
    ))
  ));

  /** recurse :: (((...a0) -> ?) X (...a0) -> a | Promise a) -> (...a0) -> AsyncEffect a */
  AsyncEffect.recurse = (f) => (...args) => (
    AsyncEffect.lift(() => asyncTrampoline(f)(...args))
  );

  /** recurse :: (((...a0) -> ?) X (...a0) -> a | Promise a) -> (...a0) -> AsyncEffect a */
  AsyncEffect.recurse_ = (f) => (...args) => (
    AsyncEffect.lift(() => affTrampoline(
      promise => AsyncEffect.lift(() => promise),
      AsyncEffect.run
    ))
      .map(trampoline => trampoline(f)(...args))
  );

  /** build :: ((Resolve a, Reject) -> b) -> AsyncEffect a */
  AsyncEffect.build = f => AsyncEffect.lift(() => new Promise(f));

  /**
   * queuefy :: State? -> AsyncEffect a -> AsyncEffect a where
   *  State :: { limit :: Int, n :: Int }
   */
  AsyncEffect.queuefy = (s = makeQueuefyState()) => curry((affA) => {
    let f = () => (
      s.n = s.n.inc(),
      affA.map(a => (s.n = s.n.dec(), a))
    );
    return (
      s.n.notGt(s.limit).cata({
        True: f,
        False: () => (
          AsyncEffect.until(AsyncEffect.lift(() => s.n.notGt(s.limit)))
            .bind(f)
        ),
      })
    );
  });
  let f0 = () => ({
    lim: Int(4),
    n: Int(0),
    i: Int(0),
  });
  AsyncEffect.q0 = (s = f0()) => (
    affA => (
      ((f, i = s.i) => (
        s.i = Int.inc(s.i),
        Bool.cata(Ord.notGt(s.n, s.lim), {
          True: f,
          False: () => (
            F.pipeline_(N => [
              F.composeN(
                AsyncEffect.until,
                AsyncEffect.pure,
              )(Bool.andJS(
                Ord.notGt(s.n, s.lim),
                Ord.notLt(s.i, i)
              ))
            ])
          )
        })
      ))(() => (
        s.n = Int.inc(s.n),
        Functor.map(a => (s.n = Int.dec(s.n), a))(affA)
      ))
    )
  )

  /** map :: Functor AsyncEffect => (a -> b) -> AsyncEffect a -> AsyncEffect b */
  AsyncEffect.map = undefined;
  /** ap :: Apply AsyncEffect => AsyncEffect (a -> b) -> AsyncEffect a -> AsyncEffect b */
  AsyncEffect.ap = undefined;

  AsyncEffect = compose(
    Applicative.Functor,
    Monad.Apply,
  )(AsyncEffect)

  return AsyncEffect;
};

module.exports = {
  default: AsyncEffect,
  AsyncEffect,
};