let {compose,pipe} = require('../compose');
let {
  Data: {
    Int: {default:Int},
    String: {default:String},
    Function: {default:F},
  },
  Control: {
    Bind:{default:Bind},
  },
  Effect: {
    default: Effect,
  },
} = require('../../haskell');
// node src/haskell/Effect/test
let thunks = [
  () => (
    Effect().for(Int.zero(), Int.lift(10))(i => (
      Effect().pure(console.log(`i = ${i.unlift()}`))
    ))
      .bind(() => Effect().pure(33))
      .map(e => String.lift(`${e}`))
      .append(Effect(String).mempty())
      .append(Effect().pure(String.lift('-66')))
      .bind(e => Effect().pure({e}))
      .ap(Effect().pure(f => ({f})))
      .map(console.log)
      .run()
  ),
  () => (
    Effect().recurse((s, n, acc = Int.zero()) => (
      n.eq(Int.zero()).cata({
        True: () => acc,
        False: () => s(n.sub(Int.one()), acc.add(n)),
      })
    ))(Int.lift(1e5))
      .bind(a => Effect().log(a))
      .run()
  ),
  () => (
    Effect().recurse((s, n, acc = Int.zero(), ret = a => a) => (
      n.eq(Int.zero()).cata({
        True: () => ret(acc),
        False: () => s(n.sub(Int.one()), acc.add(n), ret),
      })
    ))(Int.lift(1e5))
      .bind(Effect().log)
      .run()
  ),
  () => (// 3
    Effect().recurse((s, n, acc = Int.zero(), ret = a => a) => (
      n.eq(Int.lift(0)).cata({
        True: () => ret(acc),
        False: () => (
          n.eq(Int.lift(1)).cata({
            True: () => ret(acc.add(Int.lift(1))),
            False: () => s(n.sub(Int.lift(1)), acc, acc => (
              s(n.sub(Int.lift(2)), acc, ret)
            )),
          })
        ),
      })
    ))(Int.lift(12))
      .bind(Effect().log)
      .run()
  ),
  () => (// 4
    pipe(
      Effect().pure,
      Bind.bind, f => f(() => Effect().logJS('shit')),
      Bind.bind, f => f(() => Effect().lift(() => Int.lift(33))),
      Bind.bind, f => f(Effect().log),
      Effect().run
    )()
  ),
  () => (// 5
    F.mdo(
      Effect().pure(Int.lift(3).show()),
      Effect().pure(Int.lift(14).show()),
    )(a => b => a.append(b))()
      .bind(Effect().log)
      .run()
  ),
  () => (// 6
    (i => (
      Effect().while(
        Effect().lift(() => i.lt(Int.lift(1e1))),
        Effect().lift(() => i).bind(Effect().log).map(() => i = i.inc())
      )
        .bind(() => Effect().log(String.lift('end')))
        .run()
    ))(Int.zero())
  )
];
thunks[1]();