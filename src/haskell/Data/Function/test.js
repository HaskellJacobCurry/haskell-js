let {compose,pipe} = require('../../compose');
let {
  Data: {
    String: { default: String, },
    Foldable: { default: Foldable, },
    Array: { default: Array, },
    Number: { default: Number, },
    Maybe: { default: Maybe, },
    Int: { default: Int, },
    Function: { default: F, },
    Functor: { default: Functor, },
  },
  Control: {
    Apply: {
      default: Apply,
    },
  },
  Effect: {
    default: Effect,
  }
} = require('../../../haskell');
[
  () => (
    F.mdo_(
      () => Effect.pure(3),
      (...as) => Effect.pure(5 * as[0]),
      (...as) => Effect.pure([as[0], 11, as[1]]),
    )(a => b => c => (
      Array(Int).lift([Int.lift(a), Int.lift(b), (
        Array().lift(c)
          .map(Int.lift)
      )])
    ))()
      .bind(Effect.log)
      .run()
  ),
  () => (
    Effect.pure(
      (b => [b]).compose(a => a * 2)
    )
      .map(f => f(33))
      .map(Functor.map(Int.lift)['*'](Array().lift))
      .bind(Effect.log)
      .run()
  )
][1]();