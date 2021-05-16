/**
 * data Deque a = Deque (List a) (List a)
 * 
 * Show a => Show (Deque a)
 * Foldable Deque
 * Monoid (Deque a)
 * Semigroup (Deque a)
 */

let {Semiring} = require('../Semiring');
let {Semigroup} = require('../Semigroup');
let {Show} = require('../Show');
let {String} = require('../String');
let {Foldable} = require('../Foldable');
let {Bool} = require('../Bool');
let {Maybe} = require('../Maybe');
let {Int} = require('../Int');
let {Function:F} = require('../Function');
let {Tuple} = require('../Tuple');
let {List} = require('../List');

/** data Deque a = Deque (List a) (List a) */
let Deque = (a) => {
  /** data Deque a = Deque (List a) (List a) */
  let Deque = {};
  /** cata :: Deque a -> { [Deque]: (...as) -> b } -> b */
  Deque.cata = undefined;
  Deque = F.tagged('Deque', ['listL', 'listR']);
  Deque = Object.assign((f => F.curry(f))(Deque), Deque);
  Deque.prototype.constructor = Deque;

  /** empty :: Unit -> Deque a */
  Deque.empty = () => Deque(List().Nil, List().Nil);

  /** cons :: a -> Deque a -> Deque a */
  Deque.cons = F.curry((a, dequeA) => (
    Deque.cata(dequeA, (listL, listR) => Deque(List().Cons(a, listL), listR))
  ));
  /** cons :: Deque a ~> a -> Deque a */
  Deque.prototype.cons = function(a) {return Deque.cons(a, this)};

  /** snoc :: Deque a -> a -> Deque a */
  Deque.snoc = F.curry((dequeA, a) => (
    Deque.cata(dequeA, (listL, listR) => Deque(listL, List().Cons(a, listR)))
  ));
  /** snoc :: Deque a ~> a -> Deque a */
  Deque.prototype.snoc = function(a) {return Deque.snoc(this, a)};

  /** singleton :: a -> Deque a */
  Deque.singleton = Deque.snoc(Deque.empty());

  /** null :: Deque a -> Bool */
  Deque.null = dequeA => (
    Deque.cata(dequeA, (listL, listR) => (
      List().cata(listL, {
        Nil: () => (
          List().cata(listR, {
            Nil: () => Bool.True,
            Cons: () => Bool.False,
          })
        ),
        Cons: () => Bool.False,
      })
    ))
  );
  /** null :: Deque a ~> Unit -> Bool */
  Deque.prototype.null = function() {return Deque.null(this)};

  /** len :: Deque a -> Int */
  Deque.len = dequeA => (
    Deque.cata(dequeA, (listL, listR) => (
      Semiring.add(List().len(listL), List().len(listR))
    ))
  );
  /** len :: Deque a ~> Unit -> Int */
  Deque.prototype.len = function() {return Deque.len(this)};

  /** show :: Show a => Show (Deque a) => Deque a -> String */
  Deque.show = dequeA => (
    Deque.cata(dequeA, (listL, listR) => (
      F.pipeline(
        String('(Deque '),
        Semigroup.append, Show.show(listL),
        Semigroup.append, String(' '),
        Semigroup.append, Show.show(listR),
        Semigroup.append, String(')'),
      )
    ))
  );
  /** show :: Show a => Show (Deque a) => Deque a ~> Unit -> String */
  Deque.prototype.show = function() {return Deque.show(this)};

  /** uncons :: Deque a -> Maybe (Tuple a (Deque a)) */
  Deque.uncons = dequeA => (
    F.defineR((uncons, dequeA) => (
      Deque.cata(dequeA, (listL, listR) => (
        List().cata(listL, {
          Nil: () => (
            List().cata(listR, {
              Nil: () => Maybe().Nothing,
              Cons: () => uncons(Deque(List().reverse(listR), List().Nil)),
            })
          ),
          Cons: (a, as) => Maybe().Just(Tuple()(a, Deque(as, listR))),
        })
      ))
    ))(dequeA)
  );
  /** uncons :: Deque a ~> Unit -> Maybe (Tuple a (Deque a)) */
  Deque.prototype.uncons = function() {return Deque.uncons(this)};

  /** unsnoc :: Deque a -> Maybe (Tuple a (Deque a)) */
  Deque.unsnoc = dequeA => (
    F.defineR((unsnoc, dequeA) => (
      Deque.cata(dequeA, (listL, listR) => (
        List().cata(listR, {
          Nil: () => (
            List().cata(listL, {
              Nil: () => Maybe().Nothing,
              Cons: () => unsnoc(Deque(List().Nil, List().reverse(listL))),
            })
          ),
          Cons: (a, as) => Maybe().Just(Tuple()(a, Deque(listL, as))),
        })
      ))
    ))(dequeA)
  );

  /** foldl :: Foldable Deque => (b -> a -> b) -> b -> Deque a -> b */
  Deque.foldl = F.curry((f, b, dequeA) => (
    (f => (
      F.defineR((foldl, b, dequeA) => (
        Maybe().cata(Deque.uncons(dequeA), {
          Just: tuple => (
            ((a, dequeA) => (
              foldl(f(b)(a), dequeA)
            ))(Tuple().fst(tuple), Tuple().snd(tuple))
          ),
          Nothing: () => b,
        })
      ))(b, dequeA)
    ))(F.curry(f))
  ));
  /** foldl :: Foldable Deque => Deque a ~> (b -> a -> b) -> b -> b */
  Deque.prototype.foldl = function(f, b) {return Deque.foldl(f, b, this)};

  /** foldr :: Foldable Deque => (a -> b -> b) -> b -> Deque a -> b */
  Deque.foldr = Foldable.foldrDefaultL;
  /** foldr :: Foldable Deque => Deque a ~> (a -> b -> b) -> b -> b */
  Deque.prototype.foldr = function(f, b) {return Deque.foldr(f, b, this)};

  /** Foldable Deque => Monoid f => typeof f -> (a -> f) -> Deque a -> f */
  Deque.foldMap = Foldable.foldMapDefaultL;
  /** Foldable Deque => Monoid f => Deque a ~> (a -> f) -> typeof f -> f */
  Deque.prototype.foldMap = function(f, Monoid) {return Deque.foldMap(Monoid)(f, this)};

  /** mempty :: Monoid (Deque a) => Unit -> Deque a */
  Deque.mempty = Deque.empty;

  /** append :: Semigroup (Deque a) => Deque a -> Deque a -> Deque a */    
  Deque.append = Deque.foldl(Deque.snoc);
  /** append :: Semigroup (Deque a) => Deque a ~> Deque a -> Deque a */ 
  Deque.prototype.append = function(deque) {return Deque.append(this, deque)};

  /** fromFoldable :: Foldable f => f ~> Deque */
  Deque.fromFoldable = Deque.foldMap(Deque)(Deque.singleton);

  return Deque;
};

module.exports = {
  default: Deque,
  Deque,
};