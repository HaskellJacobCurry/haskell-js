let {compose,pipe} = require('../../compose');
let {
  Data: {
    Int: {default:Int},
    String: {default:String},
    Function: {default:F},
    Number: {default:Number},
    Array: {default:Array},
  },
  Control: {
    Bind:{default:Bind},
  },
  Effect: {
    default: Effect,
    AsyncEffect: {default:AsyncEffect},
  },
} = require('../../../haskell');
// node src/haskell/Effect/AsyncEffect/test
let thunks = [
  () => (
    (i => (
      AsyncEffect().while(
        AsyncEffect().lift(() => i.lt(Int.lift(1e1))),
        AsyncEffect().lift(() => i).bind(AsyncEffect().log).map(() => i = i.inc())
          .bind(() => AsyncEffect().waitFor(Number.lift(1e3)))
      )
        .bind(() => AsyncEffect().log(String.lift('end')))
        .run()
    ))(Int.zero())
  ),
  () => (
    AsyncEffect().for(Int.zero(), Int.lift(10))(i => (
      AsyncEffect().lift(() => console.log(`i = ${i.unlift()}`))
        .waitFor(Number(1e2))
    ))
      .bind(() => AsyncEffect().pure(33))
      .map(e => String.lift(`${e}`))
      .append(AsyncEffect(String).mempty())
      .append(AsyncEffect().pure(String.lift('-66')))
      .bind(e => AsyncEffect().pure({e}))
      .ap(AsyncEffect().pure(f => ({f})))
      .map(console.log)
      .bind(() => (
        AsyncEffect().parallel(Array().lift([
          AsyncEffect().pure(123),
          AsyncEffect().pure(321),
          AsyncEffect().pure(111).waitFor(Number(3e3)),
        ]))
      ))
      .bind(a => AsyncEffect().lift(() => console.log(a)))
      .run()
  ),
  () => (
    AsyncEffect().recurse((s, n, acc = Int.zero(), ret = a => a) => (
      n.eq(Int.zero()).cata({
        True: () => ret(acc),
        False: () => s(n.sub(Int.one()), acc.add(n), ret),
      })
    ))(Int.lift(1e5))
      .bind(AsyncEffect().log)
      .run()
  ),
  () => (// 3
    AsyncEffect().recurse((s, n, acc = Int.zero(), ret = a => a) => (
      n.eq(Int.zero()).cata({
        True: () => ret(acc),
        False: () => (
          AsyncEffect().lift(() => `n: ${n}`)
            .bind(AsyncEffect().logJS)
            .bind(() => AsyncEffect().waitFor(Number(1e2)))
            .bind(() => AsyncEffect().lift(() => s(n.sub(Int.one()), acc.add(n), ret)))
            .run()
        ),
      })
    ))(Int.lift(1e1))
      .bind(AsyncEffect().log)
      .run()
  ),
  () => (// 4
    AsyncEffect().recurse_((s, n, acc = Int.zero(), ret = a => a) => (
      AsyncEffect().lift(() => (
        n.eq(Int.zero()).cata({
          True: () => ret(acc),
          False: () => (
            AsyncEffect().lift(() => n)
              .bind(AsyncEffect().log)
              .bind(() => AsyncEffect().waitFor(Number(1e2)))
              .bind(() => s(n.sub(Int.one()), acc.add(n), ret))
              .run()
          ),
        })
      ))
    ))(Int.lift(1e1))
      .bind(AsyncEffect().log)
      .run()
  ),
  () => (// 5
    ((state = { i: Int.lift(0) }) => (
      AsyncEffect().parallel(Array().lift([
        AsyncEffect().recurse_((s, aff) => (
          aff
            .bind(bool => (
              bool.cata({
                True: () => AsyncEffect().pure(),
                False: () => AsyncEffect().pure().bind(() => s(aff))
              })
            ))
        ))(
          AsyncEffect().waitFor(Number.lift(1e3))
            .bind(() => AsyncEffect().logJS(`i: ${state.i.unlift()}`))
            .map(() => ((state.i = state.i.inc()).eq(Int.lift(10))))
        ),
        AsyncEffect().logJS('01')
          .bind(() => AsyncEffect().until(AsyncEffect().lift(() => state.i.eq(Int.lift(6)))))
          .map(() => console.log('02'))
      ]))
        .bind(() => AsyncEffect().logJS('end'))
        .run()
    ))()
  ),
  () => (// 6
    ((g = {
      queuefy: AsyncEffect().queuefy(),
    }) => (
      AsyncEffect().parallel(
        Array().range(Int.lift(1), Int.lift(20))
          .map(i => g.queuefy(
            AsyncEffect().log(i)
              .bind(() => AsyncEffect().waitFor(Int.lift(1e3)))
          ))
      )
        .bind(() => AsyncEffect().log(String.lift('end')))
        .run()
    ))()
  ),
  () => (// 7
    AsyncEffect().lift(() => {throw String.lift('shi')})
      .bind(AsyncEffect().log)
      .catch(a => (
        AsyncEffect().lift(() => a.append(String.lift('-err')))
          .bind(AsyncEffect().log)
      ))
      .run()
  )
];
thunks[6]();