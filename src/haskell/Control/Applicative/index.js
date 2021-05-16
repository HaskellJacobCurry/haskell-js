/**
 * class (Apply f) <= Applicative f where
 *  pure :: a -> f a
 * map :: Apply f => (a -> b) -> f a -> f b
 * 
 * map :: Apply f => f a ~> (a -> b) -> f b
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');

const Applicative = {};

/**
 * map :: Apply f => (a -> b) -> f a -> f b
 * 
 * deps :: [ap, pure]
 */
Applicative.map = curry((f, applicativeA) => (
  (Applicative => (
    Applicative.ap(Applicative.pure(f), applicativeA)
  ))(applicativeA.constructor)
));

Applicative.Functor = compose(
  A => (
    A['map'] = Applicative.map,
    A.prototype['map'] = function(f) {return A.map(f, this)},
    A
  ),
);

module.exports = {
  default: Applicative,
  Applicative,
};