/**
 * class (Applicative f, Bind f) <= Monad f
 * ap :: Monad f => f (a -> b) -> f a -> f b
 * map :: Monad f => (a -> b) -> f a -> f b
 * 
 * ap :: Monad f => f a ~> f (a -> b) -> f b
 * map :: Monad f => f a ~> (a -> b) -> f b
 */

let {curry} = require('../../curry');
let {compose} = require('../../compose');

const Monad = {};

/**
 * ap :: Monad f => f (a -> b) -> f a -> f b
 *  deps :: [bind, pure]
 */
Monad['ap'] = curry((monadF, monadA) => (
  (Monad => (
    monadA.bind(a => (
      monadF.bind(f => (
        Monad.pure(f(a))
      ))
    ))
  ))(monadA.constructor)
));

/**
 * apDefault0 :: Monad f => f (a -> b) -> f a -> f b
 * 
 * deps :: [bind, map]
 */
Monad.apDefault0 = curry((monadF, monadA) => (
  monadA.bind(a => (
    monadF.map(f => f(a))
  ))
));

/**
 * map :: Monad f => (a -> b) -> f a -> f b
 * 
 * deps :: [bind, map]
 */
Monad.map = curry((f, monadA) => (
  (Monad => (
    monadA.bind(a => Monad.pure(f(a)))
  ))(monadA.constructor)
));

Monad.Apply = compose(
  M => (
    M['ap'] = Monad.ap,
    M.prototype['ap'] = function(monadF) {return M.ap(monadF, this)},
    M
  ),
  M => (
    M['map'] = Monad.map,
    M.prototype['map'] = function(f) {return Monad.map(f, this)},
    M
  ),
);
module.exports = {
  default: Monad,
  Monad,
};