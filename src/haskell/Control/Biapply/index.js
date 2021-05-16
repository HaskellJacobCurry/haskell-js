/**
 * class Biapply f where
 *  biap :: f (a -> c) (b -> d) -> f a b -> f c d
 * 
 * biap :: Biapply f => f a b ~> f (a -> c) (b -> d) -> f c d
 */

let {curry} = require('../../curry');

const Biapply = {};

/* biap :: Biapply f => f (a -> c) (b -> d) -> f a b -> f c d */
Biapply['biap'] = curry((biapplyFG, biapply) => biapply.biap(biapplyFG));

module.exports = {
  default: Biapply,
  Biapply,
};