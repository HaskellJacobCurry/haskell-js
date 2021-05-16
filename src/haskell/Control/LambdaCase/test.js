let {LambdaCase} = require('../LambdaCase');
let {Eff} = require('../../Effect/Eff');
let {Function:F} = require('../../Data/Function');
let {Unit} = require('../../Data/Unit');
let {Bind} = require('../../Control/Bind');
let {List} = require('../../Data/List');
let {Int} = require('../../Data/Int');
// node src/haskell/Control/LambdaCase/test
({
  0: () => (
    F.assign(() => (
      List().cata(List().Cons(undefined, List().Nil), {
        Nil: () => LambdaCase(0)([]),
        Cons: () => LambdaCase(2)([3, 11]),
      })
    ))(a => (
      F.assign(() => (
        LambdaCase.cata(a, {
          0: () => List().Nil,
          2: (a, b) => List().Cons(Int.lift(a + b), List().Nil),
          1: () => List().Cons(Int.lift(12), List().Nil),
        })
      ))
    ))(a => (
      F.pipeline_(N => [
        Eff().pure(a),
        Bind.bind, Eff().log,
        N, Eff().run,
      ])
    ))
  ),
})[0]();