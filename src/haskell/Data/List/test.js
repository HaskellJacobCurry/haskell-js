let {Effect} = require('../../Effect');
let {List} = require('../List');
let {Array} = require('../Array');
let {Int} = require('../Int');
let {Semiring} = require('../Semiring');
let {Semigroup} = require('../Semigroup');
let {Function:F} = require('../Function');
let {Functor} = require('../Functor');
let {Eq} = require('../Eq');
let {Ord} = require('../Ord');
let {Bool} = require('../Bool');
let {Maybe} = require('../Maybe');
let {compose} = require('../../compose');
// node src/haskell/Data/List/test
[
	() => (
    Effect().pure(
      List().fromFoldable(Array().range(Int.zero(), Int.lift(1e1)))
        .reverse()
        .append(List().fromFoldable(Array().range(Int.lift(2e1), Int.lift(3e1))))
        .map(Semiring.mul(Int.lift(2)))
        //.foldr(Semigroup.append, Int.zero())
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 1
    Effect().pure(
      List().fromFoldable(Array().range(Int.zero(), Int.lift(1e1)))
        .ap(List().fromFoldable(Array().lift([
          Semiring.mul(Int.lift(2)),
          Semiring.mul(Int.lift(1e1)),
          Semiring.mul(Int.lift(1e2)),
        ])))
    )
      .bind(Effect().log)
      .run()
  ),
  () => (
    Effect().pure(
      List().range(Int.lift(3), Int.lift(1e5))
        .foldr(Semigroup.append, Int.zero())
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 3
    Effect().pure(
      List().range(Int.lift(3), Int.lift(1e1))
        .pop()
        .bind(List().pop)
        .bind(List().pop)
    )
      .bind(Effect().log)
      .run()
  ),
  () => (
    Effect().pure(
      List().range(Int.lift(3), Int.lift(1e5))
        .index(Int.lift(1e5 - 4))
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 5
    Effect().pure(
      List().range(Int.lift(3), Int.lift(1e5))
        .findLastIndex(Eq.eq(Int.lift(1e5)))
    )
      .bind(Effect().log)
      .run()
  ),
  () => (
    Effect().pure(
      List().range(Int.lift(3), Int.lift(1e1))
        .alterAt(Int.lift(1), compose(Maybe().pure, Semiring.mul(Int.lift(1e1))))
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 7
    Effect().pure(
      List().range(Int.lift(3), Int.lift(1e1))
        .bind(a => List().range(a, Semiring.add(a, Int.lift(1))))
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 8
    Effect().pure(
      List().concat(
        List().populateJS(
          List().range(Int.lift(3), Int.lift(1e1)),
          List().range(Int.lift(4e1), Int.lift(5e1)),
          List().range(Int.lift(2e1), Int.lift(3e1))
        )
      )
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 9
    Effect().pure(
      List().range(Int.lift(3), Int.lift(2e1))
        .filter(Bool.not.compose(Int.odd))
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 10
    Effect().pure(
      List().merge(
        Ord.defaultCompare,
        List().range(Int.lift(3), Int.lift(2e1)),
        List().range(Int.lift(8), Int.lift(3e1))
      )
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 11
    Effect().pure(
      List().populateJS(
        List().range(Int.lift(4e1), Int.lift(5e1)),
        List().range(Int.lift(3), Int.lift(2e1)),
        List().range(Int.lift(15), Int.lift(4e1)),
        List().range(Int.lift(8), Int.lift(3e1)),
      )
        .mergeAll(Ord.defaultCompare)
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 12
    Effect().pure(
      List().populateJS(
        List().range(Int.lift(4e1), Int.lift(5e1)),
        List().range(Int.lift(3), Int.lift(2e1)),
        List().range(Int.lift(15), Int.lift(4e1)),
        List().populateJS(Int.lift(8), Int.lift(-1), Int.lift(-5), Int.lift(3e2), Int.lift(2e2)),
      )
        .concat()
        .sort()
    )
      .map(Array().fromFoldable)
      .bind(Effect().log)
      .run()
  ),
  () => (// 13
    F.pipeline_(N => [
      List().range(Int.lift(3), Int.lift(2e1)),
      N, List().shiftN(Int.lift(140)),
      N, Functor.map(list => (
        F.pipeline_(N => [
          list,
          N, Array().fromFoldable,
          N, Effect().pure,
          Effect().bind, Effect().log,
          N, Effect().run,
        ])
      ))
    ])
  ),
][0]();