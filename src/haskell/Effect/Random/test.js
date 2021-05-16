let {Random} = require('../Random');
let {Effect} = require('../../Effect');
let {Number} = require('../../Data/Number');
Random.randomRange(Number.lift(3.5), Number.lift(7))
  .bind(Effect.log)
  .run()