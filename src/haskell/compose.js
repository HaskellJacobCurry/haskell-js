let {Array} = require('./dep/Data/Array');

/** compose :: (...(a[i] -> a[i+1])) -> a[n-1] -> a[0] */
let compose = (...fns) => (
  arg => Array.lift(fns).foldr((fn, acc) => fn(acc), arg)
);

/** pipe :: (...(a[i] -> a[i+1])) -> a[0] -> a[n] */
let pipe = (...fns) => (
  arg => Array.lift(fns).foldl((acc, fn) => fn(acc), arg)
);

module.exports = {
  compose,
  pipe,
};