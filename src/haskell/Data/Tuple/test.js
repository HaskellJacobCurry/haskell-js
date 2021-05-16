let { compose, pipe } = require('../../compose');
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
    Tuple: { default: Tuple },
    Semigroup: {default:Semigroup},
    Show: {default:Show},
    Bifunctor: {default:Bifunctor},
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
    Effect().pure(
      F.pipeline(
        Tuple(String, Array(Int)).lift(String.lift('ref'), Array(Int).lift([1, 6, 9]).map(Int.lift)),
        Semigroup.append, Tuple(String, Array(Int)).mempty(),
      )
    )
      .map(Show.show)
      .bind(Effect().log)
      .run()
  ),
  () => (// 1
    Effect().pure(
      F.pipeline(
        Tuple().lift(String.lift('ref'), Tuple().lift(Int.lift(31), Array(Int).lift([1, 6, 9]).map(Int.lift))),
        Semigroup.append, Tuple(String, Tuple(Int, Array(Int))).mempty(),
        Semigroup.append, Tuple().lift(String.lift('a*'), Tuple().lift(Int.lift(21), Array(Int).lift([3]).map(Int.lift))),
      )
    )
      .map(Functor.map(
        Bifunctor.bimap(
          a => a.add(Int.lift(8)),
          F.flip(Semigroup.append)(Array().lift([Int.lift(999)]))
        )
      ))
      .map(Show.show)
      .bind(Effect().log)
      .run()
  )
][1]()