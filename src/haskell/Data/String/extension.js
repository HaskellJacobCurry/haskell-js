let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {Eq} = require('../Eq');
let {String} = require('../String');
let {Bool} = require('../Bool');

String.eq = curry((str0, str1) => (
  ((str0, str1) => Bool.lift(str0 === str1))(String.unlift(str0), String.unlift(str1))
));
String.prototype.eq = function(str) {return String.eq(this, str)};

String = compose(
  Eq.Eq,
)(String);

module.exports = {
  default: String,
  String,
};