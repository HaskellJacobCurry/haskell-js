/**
 * data Unit = Unit
 * 
 * Show Unit
 */

let {tagged} = require('../../daggy');
let {String} = require('../String');

/** Unit :: Type */
let Unit = {};
Unit = tagged('Unit', []);
Unit.prototype.constructor = Unit;

/** lift :: () -> Unit */
Unit.lift = () => Unit;

/** show :: Show Unit => Unit -> String */
Unit.show = unit => String.lift('Unit');
/** show :: Show Unit => Unit ~> () -> String */
Unit.prototype.show = function() {return Unit.show(this)};

module.exports = {
  default: Unit,
  Unit
};