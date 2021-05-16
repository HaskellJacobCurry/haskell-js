let {compose,pipe} = require('../../compose');
let {
  Data: {
    Int: {default:Int},
    String: {default:String},
    Function: {default:F},
    Number: {default:Number},
    Array: {default:Array},
    Either: {default:Either},
  },
  Control: {
    Bind:{default:Bind},
  },
  Effect: {
    default: Effect,
    AsyncEffect: {default:AsyncEffect},
  },
} = require('../../../haskell');
let thunks = [
  () => (
    Effect().lift(() => (
      Either().Left(Int.lift(331))
        .notEq(Either().Left(Int.lift(33)))
    ))
      .bind(Effect().log)
      .run()
  ),
  () => (
    Effect().lift(() => (
      Either().Right(Int.lift(331))
        .ap(Either().Left(a => a.add(Int.lift(541))))
        .ap(Either().Right(Int.mul(Int.lift(2))))
        .map(Int.inc)
    ))
      .bind(Effect().log)
      .run()
  ),
  () => (// 2
    Effect().lift(() => (
      Either().Right(Int.lift(331))
        .ap(
          Either().Right(Int.lift(2))
            .map(a => b => a.inc().mul(b))
        )
    ))
      .bind(Effect().log)
      .run()
  ),
  () => (
    Effect().lift(() => (
      pipe(
        () => a => b => a.inc().mul(b),
        Either().map,
        f => f(Either().Right(Int.lift(2))),
        Either().ap,
        f => f(Either().Right(Int.lift(331))),
      )()
    ))
      .bind(Effect().log)
      .run()
  ),
  () => (// 4
    Effect().lift(
      F.ado(
        Either().pure(Int.lift(45)),
        Either().pure(String.lift('xxx')),
        Either().pure(Int.lift(3333)),
        Either().pure(String.lift('sss')),
      )(a => b => c => d => b.append(a.show()).append(d))
    )
      .bind(Effect().log)
      .run()
  )
];
thunks[0]();