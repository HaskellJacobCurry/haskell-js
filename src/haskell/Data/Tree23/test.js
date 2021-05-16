let {Tree23} = require('../Tree23');
let {Effect} = require('../../Effect');
let {Int} = require('../Int');
let {String} = require('../String');
let {Array} = require('../Array');
let {Function:F} = require('../Function');
let {Functor} = require('../Functor');
let {Bind} = require('../../Control/Bind');
// node src/haskell/Data/Tree23/test
({
  0: () => (
    Effect().pure(
      F.pipeN(
        Tree23().insert(Int.lift(3), String.lift('three0')),
        Tree23().insert(Int.lift(0), String.lift('zero')),
        Tree23().insert(Int.lift(3), String.lift('three1')),
        Tree23().insert(Int.lift(2), String.lift('two')),
        Tree23().insert(Int.lift(8), String.lift('eight')),
        Tree23().insert(Int.lift(10), String.lift('ten')),
        Tree23().lookup(Int.lift(10)),
        //Tree23().findMax,
      )(Tree23().Leaf)
    )
      .bind(Effect().log)
      .run()
  ),
  1: () => (
    Effect().pure(
      F.pipeline_(N => [
        Tree23().fromFoldable(
          F.pipeline(
            Array().lift([1, 5, 2, 44, 22, 11, 33, 21, 43, -1]),
            F.flip(Functor.map), Int.lift,
          )
        ),
        N, Tree23().keys,
        N, Array().fromFoldable,
      ])
    )
      .bind(Effect().log)
      .run()
  ),
  2: () => (
    F.assign(() => (
      F.pipeline_(N => [
        Tree23().fromFoldable(
          F.pipeline(
            //Array().lift([1, 5, 2]),
            Array().lift([1, 5, 2, 44, 22, 11, 33, 21, 43, -1, 200, 100, 55]),
            F.flip(Functor.map), Int.lift,
          )
        ),
        N, Tree23().delete(Int.lift(5)),
        N, Tree23().delete(Int.lift(22)),
        N, Tree23().delete(Int.lift(43)),
        N, Tree23().delete(Int.lift(-2)),
        N, Tree23().delete(Int.lift(200)),
        N, Tree23().delete(Int.lift(-1)),
        N, Tree23().keys,
        N, Array().fromFoldable,
      ])
    ))(F.pipeN(
      Effect().pure,
      F.flip(Bind.bind)(Effect().log),
      Effect().run,
    ))
  ),
})[2]();