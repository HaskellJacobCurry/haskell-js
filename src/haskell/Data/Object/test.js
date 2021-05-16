let {
  Control: {
    Bind: {default:Bind},
  },
  Data: {
    Object: {default:Object},
    String: {default:String},
    Number: {default:Number},
    Array: {default:Array},
    Maybe: {default:Maybe},
  },
  Effect: {
    default: Effect,
  },
} = require('../../../haskell');
let {compose} = require('../../compose');
// node src/haskell/Data/Object/test
[
  () => (
    Effect().lift(() => (
      Object().lift({
        a: 35,
        b: 101,
      })
        .foldM_(
          (m, g) => m.append(g(44)),
          (b, k, a) => String.lift(`${k}: ${a + b},`),
          String.mempty()
        )
    ))
      .bind(Effect().log)
      .run()
  ),
  () => (
    Effect().pure()
      .bind(() => (
        Object().lift({
          a: 35,
          b: 101,
        })
          .foldM(
            (b, k, a) => Effect().pure(b.append(String.lift(`${k}: ${a}`)).append(String.lift(', '))),
            String.mempty(),
            Effect()
          )
      ))
      .bind(Effect().log)
      .run()
  ),
  () => (
    Effect().pure()
      .map(() => (
        Object().lift({
          a: 35,
          b: 102,
          c: 22,
        })
          .fold(
            (b, k, a) => b.append(String.lift(`${k}: ${a}`)).append(String.lift(', ')),
            String.mempty()
          )
      ))
      .bind(Effect().log)
      .run()
  ),
  () => (
    Effect().pure()
      .map(() => (
        Object().lift({
          a: 35,
          b: 102,
          c: 22,
          d: 1222,
        })
          .foldr(
            (a, b) => b.append(String.lift(`key: ${a}`)).append(String.lift(', ')),
            String.mempty()
          )
      ))
      .bind(Effect().log)
      .run()
  ),
  () => (// 4
    Effect().pure()
      .map(() => (
        Object().lift({
          a: 35,
          b: 102,
          c: 22,
          d: 1222,
        })
          .map(a => `${a * 2}`)
          .map(String.lift)
          .toArray()
      ))
      .bind(Effect().log)
      .run()
  ),
  () => (// 5
    Effect().pure()
      .map(() => (
        Object().unions(Array().lift([
          Object().lift({
            a: Number.lift(35),
            b: Number.lift(102),
          }),
          Object().lift({
            a: String.lift('ewf'),
            b: Number.lift(22),
          }),
          Object().lift({
            c: Number.lift(312),
            d: Number.lift(2),
          })
        ]))
          .pop(String.lift('b'))
      ))
      .bind(Effect().log)
      .run()
  ),
  () => (// 6
    Effect().pure()
      .map(() => (
        (Applicative => (
          Object().traverse(Applicative)(
            Applicative.pure,
            Object().lift({
              a: 35,
              b: 102,
              c: 22,
              d: 1222,
            }).map(Number.lift)
          )
        ))(Maybe())
      ))
      .bind(Effect().log)
      .run()
  ),
  () => (// 7
    Effect().pure()
      .map(() => (
        (Applicative => (
          Object().sequence(Applicative)(
            Object().lift({
              a: 35,
              b: 102,
              c: 22,
              d: 1222,
            }).map(compose(Applicative.pure, Number.lift))
          )
        ))(Maybe())
      ))
      .bind(Effect().log)
      .run()
  ),
][7]();