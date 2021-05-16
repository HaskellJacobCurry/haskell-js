/**
 * data Error = Error
 * 
 * Show Error
 */

let { taggedSum } = require('../../daggy');

/** data Error = Error */
let Error = {};
/** Error :: String -> Error */
Error._ = undefined;
Error = taggedSum('Error', {
  _: ['str'],
});

/** lift :: String -> Error */
Error.lift = _ => Error._(_);

/** unlift :: Error -> String */
Error.unlift = err => err.str;
/** unlift :: Error ~> Unit -> String */
Error.prototype.unlift = function() {return Error.unlift(this)};

/** show :: Show Error => Error -> String */
Error.show = err => err.str;
/** show :: Show Error => Error ~> Unit -> String */
Error.prototype.show = function() {return Error.show(this)};

module.exports = {
  default: Error,
  Error,
};