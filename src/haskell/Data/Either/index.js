/**
 * data Either a b = Left a | Right b
 * 
 * (Show a, Show b) => Show (Either a b)
 * (Eq a, Eq b) => Eq (Either a b)
 * 
 * Functor (Either a)
 * Apply (Either a)
 * Applicative (Either a)
 * Bind (Either a)
 * Monad (Either a)
 */

let {taggedSum} = require('../../daggy');
let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {Eq} = require('../Eq');
let {Monad} = require('../../Control/Monad');
let {Applicative} = require('../../Control/Applicative');
let {String} = require('../String');
let {Bool} = require('../Bool');
let {Maybe} = require('../Maybe');

/** data Either a b = Left a | Right b */
const Either = (a, b) => {
  /** data Either a b = Left a | Right b */
  let Either = {};
  /** Left :: a -> Either a b */
  Either.Left = undefined;
  /** Right :: b -> Either a b */
  Either.Right = undefined;
  /** cata :: Either -> { [Either]: (...as) -> b } -> b */
  Either.cata = undefined;
  Either = taggedSum('Either', {
    Left: ['a'],
    Right: ['b'],
  });
  Either.prototype.constructor = Either;

  /** show :: (Show a, Show b) => Show (Either a b) => Either a b -> String */
  Either.show = curry((show) => (
    show.cata({
      Left: a => String.lift('Left(').append(a.show()).append(String.lift(')')),
      Right: b => String.lift('Right(').append(b.show()).append(String.lift(')')),
    })
  ));
  /** show :: (Show a, Show b) => Show (Either a b) => Either a b ~> Unit -> String */
  Either.prototype.show = function() {return Either.show(this)};

  /** eq :: (Eq a, Eq b) => Eq (Either a b) => Either a b -> Either a b -> Bool */
  Either.eq = curry((eq0, eq1) => (
    eq0.cata({
      Left: (a0) => eq1.cata({
        Left: (a1) => a0.eq(a1),
        Right: () => Bool.False,
      }),
      Right: (b0) => eq1.cata({
        Left: () => Bool.False,
        Right: (b1) => b0.eq(b1),
      }),
    })
  ));
  /** eq :: (Eq a, Eq b) => Eq (Either a b) => Either a b ~> Either a b -> Bool */
  Either.prototype.eq = function(eq) {return Either.eq(this, eq)};

  /** pure :: Applicative (Either a) => b => Either a b */
  Either.pure = b => Either.Right(b);

  /** bind :: Bind (Either a) => Either a b -> (b -> Either a c) -> Either a c */
  Either.bind = curry((either, f) => {
    return either.cata({
      Left: a => _ => Either.Left(a),
      Right: b => f => f(b),
    })(f);
    return either.cata({
      Left: Either.Left,
      Right: f,
    });
  });
  /** bind :: Bind (Either a) => Either a b ~> (b -> Either a c) -> Either a c */
  Either.prototype.bind = function(f) {return Either.bind(this, f)};

  /** isLeft :: Either a b -> Bool */
  Either.isLeft = either => (
    either.cata({
      Left: () => Bool.True,
      Right: () => Bool.False,
    })
  );
  /** isLeft :: Either a b ~> Unit -> Bool */
  Either.prototype.isLeft = function() {return Either.isLeft(this)};

  /** isRight :: Either a b -> Bool */
  Either.isRight = either => either.isLeft().not();
  /** isRight :: Either a b ~> Unit -> Bool */
  Either.prototype.isRight = function() {return Either.isRight(this)};

  /** fromLeft :: Either a b -> Maybe a */
  Either.fromLeft = either => (
    either.cata({
      Left: Maybe.pure,
      Right: Maybe.mempty,
    })
  );
  /** fromLeft :: Either a b ~> Unit -> Maybe a */
  Either.prototype.fromLeft = function() {return Either.fromLeft(this)};

  /* fromRight :: Either a b -> Maybe b */
  Either.fromRight = either => (
    either.cata({
      Left: Maybe.mempty,
      Right: Maybe.pure,
    })
  );
  /** fromRight :: Either a b ~> Unit -> Maybe b */
  Either.prototype.fromRight = function() {return Either.fromRight(this)};

  Either = compose(
    Eq.Eq,
    Monad.Apply,
  )(Either);

  return Either;
};

module.exports = {
  default: Either,
  Either,
};