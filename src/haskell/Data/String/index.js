/**
 * data String = String
 * 
 * Show String
 * Semigroup String
 * Monoid String
 * Eq String
 */

let {tagged} = require('../../daggy');
let {curry} = require('../../curry');

/** data String = String */
let String = {};
String = tagged('String', ['_']);
String.prototype.constructor = String;

/** lift :: string -> String */
String.lift = _ => String(_);

/** unlift :: String -> string */
String.unlift = str => str._.toString();
/** unlift :: String ~> Unit -> string */
String.prototype.unlift = function() {return String.unlift(this)};

/** show :: Show String => String -> String */
String.show = str => str;
/** show :: Show String => String ~> Unit -> String */
String.prototype.show = function() {return String.show(this)};

/** append :: Semigroup String => String -> String -> String */
String.append = curry((str0, str1) => (
  String.lift(`${str0._}${str1._}`)
));
/** append :: Semigroup String => String ~> String -> String */
String.prototype.append = function(str) {return String.append(this, str)};

/** mempty :: Monoid String => Unit -> String */
String.mempty = () => String.lift('');

/** eq :: Eq String => String -> String -> Bool */
String.eq = undefined;

module.exports = {
  default: String,
  String,
};