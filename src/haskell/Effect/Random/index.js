let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {Number} = require('../../Data/Number');
let {Effect} = require('../../Effect');

const Random = {};

/** random :: Effect Number */
Random.random = Effect().lift(compose(Number.lift, Math.random));

/** randomRange :: Number -> Number -> Effect Number */
Random.randomRange = curry((min, max) => (
  Random.random.map(rand => min.add(max.sub(min).mul(rand)))
));

module.exports = {
  default: Random,
  Random,
};