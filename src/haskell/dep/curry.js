// curry :: ((...a0) X (...a1) -> b) -> (...a0) -> (...a1) -> b
let curry = fn => {
  let _curry = (acc = []) => fn => (
    (...args) => (
      (args => {
        if (fn.length == 0)
          return fn(...args);
        if (args.length < fn.length)
          return _curry(args)(fn);
        if (fn.length < args.length)
          throw new Error('curry :: ((...a0) X (...a1) -> b) -> (...a0) -> (...a1) -> b');
        return fn(...args);
      })([...acc,...args])
    )
  );
  return _curry()(fn);
};
module.exports = {
  default: curry,
  curry
};