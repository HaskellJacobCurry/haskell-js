/**
 * data Json = Json
 * 
 * Show Json
 */

let {taggedSum} = require('../../daggy');
let {curry} = require('../../curry');
let {String} = require('../String');

/** Json :: Type */
let Json = {};
Json = taggedSum('Json', {
  /** _ :: JSON -> Json */
  _: ['raw'],
});
Json.prototype.constructor = Json;

/** lift :: JSON -> Json */
Json.lift = _ => JSON._(_);

/** unlift :: Json -> JSON */
Json.unlift = json => json.raw;
/** unlift :: Json ~> Unit -> JSON */
Json.prototype.unlift = function() {return Json.unlift(this)};

/** stringify :: Json -> String */
Json.stringify = json => String.lift(JSON.stringify(json.unlift(), null, 2));
/** stringify :: Json ~> Unit -> String */ 
Json.prototype.stringify = function() {return Json.stringify(this)};

/** show :: Show Json => Json -> String */
Json.show = Json.stringify;
/** show :: Show Json => Json ~> Unit -> String */
Json.prototype.show = function() {return Json.show(this)};

module.exports = {
  default: Json,
  Json,
};