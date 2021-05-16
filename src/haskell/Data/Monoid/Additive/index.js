/**
 * newtype Additive a = Additive a
 * Semiring a => Semigroup (Additive a)
 * Semiring a => Monoid (Additive a)
 */

const Additive = {};

/** Semigroup :: Semiring f => Semigroup (Additive f) */
Additive['Semigroup'] = (Semiring) => (
  Semiring['append'] = Semiring['add'],
  Semiring.prototype['append'] = function(semiring) {
    return Semiring['append'](this, semiring);
  },
  Semiring
);

/** Monoid :: Semiring f => Monoid (Additive f) */
Additive['Monoid'] = (Semiring) => (
  Semiring['mempty'] = Semiring['zero'],
  Semiring
);

module.exports = {
  default: Additive,
  Additive,
};