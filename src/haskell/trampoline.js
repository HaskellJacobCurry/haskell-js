let trampoline = fn => {
  let rec = (fn, ...args) => ({ rec, thunk: () => fn(...args) });
  return (
    (fn => (...args) => {
      let s = (x => x(x))(
        x => (...args) => (
          rec(() => fn((...args) => x(x)(...args), ...args))
        )
      )(...args);
      while (s && s.rec === rec) {
        s = s.thunk();
      }
      return s;
    })(fn)
  );
};
trampoline = fn => {
  let rec = (fn, ...args) => ({ rec, thunk: () => fn(...args) });
  return (...args) => (
    (s => {
      while (s && s.rec === rec) {
        s = s.thunk();
      }
      return s;
    })((x => x(x))(x => (...args) => (
      rec(() => fn((...args) => x(x)(...args), ...args))
    ))(...args))
  );
};

let asyncTrampoline = fn => {
  let rec = (fn, ...args) => ({ rec, thunk: () => fn(...args) });
  return (
    (fn => (...args) => (
      (x => x(x))(
        x => (...args) => (
          Promise.resolve(() => fn((...args) => x(x)(...args), ...args))
            .then(rec)
        )
      )(...args)
        .then(async (s) => {
          while (s && s.rec === rec) {
            s = await s.thunk();
          }
          return s;
        })
    ))(fn)
  );
};

/**
 * lift :: Promise a -> Aff a
 * unlift :: Aff a -> Promise a
 */
let affTrampoline = (lift, unlift) => fn => {
  let rec = (fn, ...args) => ({ rec, thunk: () => fn(...args) });
  return (
    (fn => (...args) => (
      (x => x(x))(
        x => (...args) => (
          Promise.resolve(() => (
            fn((s => (...args) => lift(s(...args)))(
              (...args) => x(x)(...args)
            ), ...args)
          ))
            .then(rec)
        )
      )(...args)
        .then(async (s) => {
          while (s && s.rec === rec) {
            s = await unlift(s.thunk());
          }
          return s;
        })
    ))(fn)
  );
};

/** recurse :: ((S,...a[i]) -> b) -> (...a[i]) -> b */
let recurse = trampoline;

module.exports = {
  recurse,
  trampoline,
  asyncTrampoline,
  affTrampoline,
};