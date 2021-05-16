/**
 * data Maybe a = Just a | Nothing
 * 
 * Show (Maybe a)
 * Monoid (Maybe a)
 * Semigroup (Maybe a)
 * Applicative Maybe
 * Functor Maybe
 * Apply Maybe
 * Bind Maybe
 * Monad Maybe
 */

let {taggedSum} = require('../../daggy');
let {curry} = require('../../curry');
let {String} = require('../String');
let {Bool} = require('../Bool');

/** data Maybe a = Just a | Nothing */
const Maybe = (a) => {
  /** Maybe :: Type -> Type */
  let Maybe = {};
  /** Just :: a -> Maybe a */
  Maybe.Just = undefined;
  /** Nothing :: Maybe a */
  Maybe.Nothing = undefined;
  /** cata :: Maybe -> { [Maybe]: (...as) -> b } -> b */
  Maybe.cata = undefined;
  Maybe = taggedSum('Maybe', {
    Just: ['a'],
    Nothing: [],
  });
  Maybe.Just = (f => _ => f(_))(Maybe.Just);
  Maybe.prototype.constructor = Maybe;

  /** show :: Show a => Show (Maybe a) => Maybe a -> String */
  Maybe.show = maybe => (
    maybe.cata({
      Just: a => String.lift('(Just ').append(a.show()).append(String.lift(')')),
      Nothing: () => String.lift('Nothing'),
    })
  );
  /** show :: Show a => Show (Maybe a) => Maybe a ~> Unit -> String */
  Maybe.prototype.show = function() {return Maybe.show(this)};

  /** mempty :: Monoid (Maybe a) => Unit -> Maybe a */
  Maybe.mempty = () => Maybe.Nothing;

  /** pure :: Applicative Maybe => a -> Maybe a */
  Maybe.pure = _ => Maybe.Just(_);

  /** map :: Functor Maybe => (a -> b) -> Maybe a -> Maybe b */
  Maybe.map = curry((f, maybe) => (
    maybe.cata({
      Just: a => Maybe.Just(f(a)),
      Nothing: () => Maybe.Nothing,
    })
  ));
  /** map :: Functor Maybe => Maybe a ~> (a -> b) -> Maybe b */
  Maybe.prototype.map = function(f) {return Maybe.map(f, this)};

  /** ap :: Apply Maybe => Maybe (a -> b) -> Maybe a -> Maybe b */
  Maybe.ap = curry((maybeF, maybe) => (
    maybe.cata({
      Just: a => maybeF.map(f => f(a)),
      Nothing: () => Maybe.Nothing,
    })
  ));
  /** ap :: Apply Maybe => Maybe a ~> Maybe (a -> b) -> Maybe b */
  Maybe.prototype.ap = function(maybeF) {return Maybe.ap(maybeF, this)};

  /** bind :: Bind Maybe => Maybe a -> (a -> Maybe b) -> Maybe b */
  Maybe.bind = curry((maybe, f) => (
    maybe.cata({
      Just: f,
      Nothing: () => Maybe.Nothing,
    })
  ));
  /** bind :: Bind Maybe => Maybe a ~> (a -> Maybe b) -> Maybe b */
  Maybe.prototype.bind = function(f) {return Maybe.bind(this, f)};

  /** append :: Semigroup a => Semigroup (Maybe a) => a -> a -> a */
  Maybe.append = curry((maybe0, maybe1) => (
    maybe0.cata({
      Just: a0 => maybe1.cata({
        Just: a1 => Maybe.Just(a0.append(a1)),
        Nothing: () => Maybe.Just(a0),
      }),
      Nothing: () => maybe1.cata({
        Just: a1 => Maybe.Just(a1),
        Nothing: () => Maybe.Nothing,
      }),
    })
  ));
  /** append :: Semigroup a => Semigroup (Maybe a) => Maybe a ~> Maybe a -> Maybe a */
  Maybe.prototype.append = function(maybe) {return Maybe.append(this, maybe)};

  /** isJust :: Maybe a -> Bool */
  Maybe.isJust = curry((maybe) => (
    maybe.cata({
      Just: () => Bool.True,
      Nothing: () => Bool.False,
    })
  ));
  /** isJust :: Maybe a ~> Unit -> Bool */
  Maybe.prototype.isJust = function() {return Maybe.isJust(this)};

  /** isNothing :: Maybe a -> Bool */
  Maybe.isNothing = curry((maybe) => (
    maybe.isJust().not()
  ));
  /** isNothing :: Maybe a ~> Unit -> Bool */
  Maybe.prototype.isNothing = function() {return Maybe.isNothing(this)};

  return Maybe;
};

module.exports = {
  default: Maybe,
  Maybe,
};