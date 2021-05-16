let {Deque} = require('../Deque');
let {Eff} = require('../../Effect/Eff');
let {Int} = require('../Int');
let {String} = require('../String');
let {Array} = require('../Array');
let {Function:F} = require('../Function');
let {Functor} = require('../Functor');
let {Bind} = require('../../Control/Bind');
// node src/haskell/Data/Deque/test
({
  0: () => (
    F.assign(() => (
      F.pipeline_(N => [
        Deque().singleton(Int(33)),
        Deque().snoc, Int(34),
        N, Deque().cons(Int(2)),
        //N, Deque().foldr(Array().push, Array().mempty()),
        N, Deque().foldl(F.flip(Array().push), Array().mempty()),
      ])
    ))(a => (
      F.pipeline_(N => [
        Eff().pure(a),
        Bind.bind, Eff().log,
        N, Eff().run,
      ])
    ))
  ),
  1: () => (
    F.assign(() => (
      F.pipeline_(N => [
        Deque().fromFoldable(
          F.pipeline_(N => [
            Array()([1, 5, 2, 10, 8, 6]),
            N, Functor.map(Int)
          ])
        ),
        N, Deque().foldl(F.flip(Array().push), Array().mempty()),
      ])
    ))(a => (
      F.pipeline_(N => [
        Eff().pure(a),
        Bind.bind, Eff().log,
        N, Eff().run,
      ])
    ))
  ),
})[1]();