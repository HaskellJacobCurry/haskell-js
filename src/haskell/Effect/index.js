/**
 * data Effect a = Effect a
 * 
 * Applicative Effect
 * Bind Effect
 * Apply Effect
 * Functor Effect
 * Semigroup a => Semigroup (Effect a)
 * Monoid a => Monoid (Effect a)
 */

let {tagged} = require('../daggy');
let {curry} = require('../curry');
let {compose,pipe} = require('../compose');
let {trampoline} = require('../trampoline');
let {Monad} = require('../Control/Monad');
let {Applicative} = require('../Control/Applicative');
let {Show} = require('../Data/Show');
let {String} = require('../Data/String');
let {Unit} = require('../Data/Unit');
let {AsyncEffect} = require('../Effect/AsyncEffect');
let {Error} = require('./Error');

/** data Effect a = Effect a */
const Effect = (a) => {
  /** Effect :: (Unit -> a) -> Effect a */
  let Effect = {};
  Effect = tagged('Effect', ['thunkA']);
  Effect.prototype.constructor = Effect;

  /** lift :: (Unit -> a) -> Effect a */
  Effect.lift = _ => Effect(_);

  /** unlift :: Effect a -> Unit -> a */
  Effect.unlift = eff => eff.thunkA;
  /** unlift :: Effect a ~> Unit -> Unit -> a */
  Effect.prototype.unlift = function() { return Effect.unlift(this); };

  /** run :: Effect a -> a */
  Effect.run = eff => eff.thunkA();
  /** run :: Effect a ~> Unit -> a */
  Effect.prototype.run = function() { return Effect.run(this); };

  /** throw :: String -> Effect a */
  Effect.throw = msg => Effect.lift(() => { throw Error.lift(msg); });

  /** catch :: (Error -> Effect a) -> Effect a -> Effect a */
  Effect.catch = curry((f, eff) => (
    Effect.lift(() => {
      try {
        return eff.run();
      } catch (err) {
        return f(err).run();
      }
    })
  ));
  /** catch :: Effect a ~> (Error -> Effect a) -> Effect a */
  Effect.prototype.catch = function(f) {return Effect.catch(f, this)};

  /** pure :: Applicative Effect => a -> Effect a */
  Effect.pure = (a = Unit) => Effect.lift(() => a);

  /** bind :: Bind Effect => Effect a -> (a -> Effect b) -> Effect b */
  Effect.bind = curry((effA, f) => (
    // just changed
    Effect.lift(pipe(Effect.unlift(effA), f, Effect.run))
  ));
  /** bind :: Bind Effect => Effect a ~> (a -> Effect b) -> Effect b */
  Effect.prototype.bind = function(f) {return Effect.bind(this, f)};

  /** append :: Semigroup a => Semigroup (Effect a) => Effect a -> Effect a -> Effect a */
  Effect.append = curry((eff0, eff1) => (
    Effect.lift(() => eff0.run().append(eff1.run()))
  ));
  /** append :: Semigroup a => Semigroup (Effect a) => Effect a ~> Effect a -> Effect a */
  Effect.prototype.append = function(eff) {return Effect.append(this, eff)};

  /** mempty :: Monoid a => Monoid (Effect a) => Unit -> Effect a */
  Effect.mempty = () => Effect.lift(a.mempty);

  /** until :: Effect Bool -> Effect Unit */
  Effect.until = effB => (
    Effect.recurse(s => (
      effB.run().cata({
        True: () => Unit.lift(),
        False: s,
      })
    ))()
  );

  /** while :: Effect Bool -> Effect a -> Effect Unit */
  Effect.while = curry((effP, effA) => (
    Effect.recurse((s) => (
      effP.run().cata({
        True: () => (effA.run(), s()),
        False: () => Unit.lift(),
      })
    ))()
  ));

  /** for :: Int -> Int -> (Int -> Effect a) -> Effect Unit */
  Effect.for = curry((i0, i1, f) => (
    Effect.recurse((s, i) => (
      i.eq(i1).cata({
        True: () => Unit.lift(),
        False: () => (Effect.run(f(i)), s(i.inc()))
      })
    ))(i0)
  ))

  /** logJS :: String -> Effect Unit */
  Effect.logJS = compose(Effect.lift, (f => a => () => f(a))(console.log));

  /** log :: String -> Effect Unit */
  Effect.log = compose(Effect.logJS, String.unlift, Show.show);

  /** recurse :: (((...a0) -> ?) X (...a0) -> a) -> (...a0) -> Effect a */
  Effect.recurse = (f) => (...args) => (
    Effect.lift(() => trampoline(f)(...args))
  );

  /** toAsync :: Effect a -> AsyncEffect a */
  Effect.toAsync = curry((effA) => (
    AsyncEffect.lift(Effect.unlift(effA))
  ));
  /** toAsync :: Effect a ~> Unit -> AsyncEffect a */
  Effect.prototype.toAsync = function() {return Effect.toAsync(this)};

  /** map :: Functor Effect => (a -> b) -> Effect a -> Effect b */
  Effect.map = undefined;
  /** ap :: Apply Effect => Effect (a -> b) -> Effect a -> Effect b */
  Effect.ap = undefined;

  Effect = compose(
    Applicative.Functor,
    Monad.Apply,
  )(Effect);

  return Effect;
};

module.exports = {
  default: Effect,
  Effect,
};