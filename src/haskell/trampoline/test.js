let {trampoline,asyncTrampoline} = require('../trampoline');
let thunks = [
  () => (
    console.log(
      trampoline((s, n, acc = 0) => (
        n == 0 ?
        acc :
        s(n - 1, acc + n)
      ))(1e5)
    )
  ),
  () => (
    asyncTrampoline((s, n, acc = 0, ret = a => [a]) => (
      n == 0 ?
      Promise.resolve(ret(acc)) :
      Promise.resolve()
        .then(() => console.log(`n = ${n}`))
        .then(() => new Promise(r => setTimeout(r, 1e2)))
        .then(() => s(n - 1, acc + n))
    ))(1e1)
      .then(console.log)
  )
];
thunks[1]();