/** define :: ((S,...a[i]) -> b) -> (...a[i]) -> b */
let define = f => (...as) => (
  (x => x(x))(x => (...as) => (
    (s => (
      f(s,...as)
    ))((...as) => x(x)(...as))
  ))(...as)
);

/** curry :: ((...a0) X (...a1) -> b) -> (...a0) -> (...a1) -> b */
let curry = fn => {
  let _curry = (acc = []) => fn => (
    (...args) => (
      (args => {
        if (fn.length == 0)
          return fn(...args);
        if (args.length < fn.length)
          return _curry(args)(fn);
        if (fn.length < args.length)
          throw new Error();
        return fn(...args);
      })([...acc,...args])
    )
  );
  return _curry()(fn);
};
curry = f => (
  define((curry, acc, f) => (
    (...as) => (
      (as => {
        if (f.length == 0)
          return f(...as);
        if (as.length < f.length)
          return curry(as, f);
        if (f.length < as.length)
          throw new Error();
        return f(...as);
      })([...acc,...as])
    )
  ))([], f)
);

module.exports = {
  default: curry,
  curry,
  define,
};