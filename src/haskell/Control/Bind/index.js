/**
 * class (Apply f) <= Bind f where
 *  bind :: f a -> (a -> f b) -> f b
 * 
 * bind :: Bind f => f a ~> (a -> f b) -> f b
 */

let {curry} = require('../../curry');

const Bind = {};

/** bind :: Bind f => f a -> (a -> f b) -> f b */
Bind.bind = curry((bindA, f) => (
  (Bind => (
    Bind.bind(bindA, f)
  ))(bindA.constructor)
));

module.exports = {
  default: Bind,
  Bind,
};