let {String} = require('../String');
let {Effect} = require('../../Effect');
Effect().pure(String.lift(String.lift('lol')))
  .bind(Effect().log)
  .run();