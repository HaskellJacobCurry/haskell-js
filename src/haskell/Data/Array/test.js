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
// node src/haskell/Data/Array/test
let thunks = [
  () => {
    let array = Array().lift([1, 5, 7, 2]);
    console.log(
      Foldable.foldMap(String)(e => String.lift(`(${e})`))(
        Array().concat(Array().lift([
          array.map(e => e * 2),
          Array().lift([1, 5, 7, 2]),
          Array().lift([111, 222]).concatMap(Array().lift([e => e * 3, e => e * 10])),
        ]))
          //.foldMap(e => String.lift(`(${e})`), String)
      )
        
        .toString()
    )
  },
  () => {
    console.log(
      Array().concat(Array().lift([
        Array().lift([1, 5, 7, 2]).map(Number.lift).map(Number.mul(Number.lift(3))),
        Array().lift([1, 5, 7, 2]).map(Number.lift),
      ]))
        .bind(e => (
          Array().lift([e, e.add(Number.one())])
        ))
        .traverse(Maybe().pure, Maybe())
        .show()
        .toString()
    )
  },
  () => (// 2
    Effect().lift(() => (
      pipe(
        () => a => b => c => a.add(c).sub(b),
        Array().map,
        f => f(Array().range(Int.lift(1), Int.lift(3))),
        Array().ap,
        f => f(Array().lift([Int.lift(4)])),
        Array().ap,
        f => f(Array().lift([Int.lift(10), Int.lift(20)])),
      )()
    ))
      .bind(Effect().log)
      .run()
  ),
  () => (
    Effect().lift(() => (
      F.pipeline(
        a => b => c => a.add(c).sub(b),
        Functor.map, Array().range(Int.lift(1), Int.lift(3)),
        Apply.ap, Array().lift([Int.lift(4)]),
        Apply.ap, Array().lift([Int.lift(10), Int.lift(20)])
      )
    ))
      .bind(Effect().log)
      .run()
  ),
  () => (// 4
    Effect().lift(
      F.ado(
        Array().range(Int.lift(1), Int.lift(3)),
        Array().lift([Int.lift(4)]),
        Array().lift([Int.lift(10), Int.lift(20)])
      )(a => b => c => a.add(c).sub(b))
    )
      .bind(Effect().log)
      .run()
  ),
];
thunks[4]();