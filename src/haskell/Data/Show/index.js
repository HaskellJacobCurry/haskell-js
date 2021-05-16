/**
 * class Show f where
 *  show :: f -> String
 * show :: Show f => f ~> Unit -> String
 */

let {curry} = require('../../curry');

const Show = {};

/** show :: Show f => f -> String */
Show.show = (show) => show.show();

module.exports = {
  default: Show,
  Show,
};