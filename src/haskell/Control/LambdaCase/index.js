/**
 * data LambdaCase = LambdaCase
 */

let {tagged} = require('../../daggy');
let {Function:F} = require('../../Data/Function');

/** LambdaCase :: a -> Any[] -> LambdaCase */
let LambdaCase = {};
LambdaCase = tagged('LambdaCase', ['a', 'args']);
LambdaCase = Object.assign((f => F.curry(f))(LambdaCase), LambdaCase);

/** lift :: a -> Any[] -> LambdaCase */
LambdaCase.lift = F.curry((a, args) => LambdaCase(a, args));

/** cata :: LambdaCase -> { [LambdaCase]: (...as) -> b } -> b */
LambdaCase.cata = F.curry((lambdaCase, fs) => (
  fs[lambdaCase.a](...lambdaCase.args)
));

module.exports = {
  default: LambdaCase,
  LambdaCase,
};