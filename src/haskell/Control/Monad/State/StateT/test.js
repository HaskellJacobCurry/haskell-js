let {StateT} = require('.');
let {Effect} = require('../../../../Effect');
let {Maybe} = require('../../../../Data/Maybe');
let {Tuple} = require('../../../../Data/Tuple');
let {Int} = require('../../../../Data/Int');
let {Object} = require('../../../../Data/Object');
let {Traversable} = require('../../../../Data/Traversable');
let {Unit} = require('../../../../Data/Unit');
let {Array} = require('../../../../Data/Array');
let {Function:F} = require('../../../../Data/Function');
// node src/haskell/Control/Monad/State/StateT/test
[
  () => (
    Effect().pure(
      StateT().lift(s => Maybe().pure(Tuple().lift(12, s)))
        .map(Int.lift)
        .map(Int.add(Int.lift(21)))
        .bind(a => StateT().lift(s => (
          Maybe().pure(Tuple().lift(a.mul(Int.lift(3)), s))
        )))
        .run(Object().lift({}))
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 1
    Effect().pure(
      StateT().lift(s => Maybe().pure(Tuple().lift(12, s)))
        .map(Int.lift)
        .map(Int.add(Int.lift(21)))
        .ap(StateT().lift(
          s => Maybe().pure(Tuple().lift(Int.mul(Int.lift(3)), s))
        ))
        .run(Object().lift({}))
    )
      .bind(Effect().log)
      .run()
  ),
  () => (
    Effect().pure(
      StateT(0, Maybe()).modify_(Int.mul(Int.lift(4)))
        .run(Int.lift(3))
    )
      .bind(Effect().log)
      .run()
  ),
  () => (// 3
    (({sumFoldable}) => (
      Effect().lift(
        F.mdo(
          sumFoldable(Array().lift([1, 2, 3]).map(Int.lift))
            .exec(Int.lift(0)),
          sumFoldable(Array().lift([10, 20]).map(Int.lift))
            .exec(Int.lift(3)),
          sumFoldable(Array().lift([10, 100]).map(Int.lift))
            .exec(Int.lift(-1))
        )(a => b => c => a.add(b).add(c))
      )
        .bind(Effect().log)
        .run()
    ))({
      /** sumArray :: Traversable f => f Int -> StateT Int (Maybe Int) Unit */
      sumFoldable: (
        (Applicative => (
          Traversable.traverse_(Applicative)(n => (
            Applicative.modify(sum => sum.add(n))
          ))
        ))(StateT(Int, Maybe(Int), Unit))
      )
    })
  )
][3]();