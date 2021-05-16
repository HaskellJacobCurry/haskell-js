/**
 * data List a = Nil | Cons a (List a)
 * 
 * (Show a) => Show (List a)
 * Foldable List
 * Semigroup (List a)
 * Monoid (List a)
 * Functor List
 * Apply List
 * Applicative List
 * Bind List
 * Monad List
 */

let {taggedSum} = require('../../daggy');
let {curry} = require('../../curry');
let {compose} = require('../../compose');
let {recurse} = require('../../trampoline');
let {Semigroup} = require('../Semigroup');
let {Ring} = require('../Ring');
let {Eq} = require('../Eq');
let {Functor} = require('../Functor');
let {Bifunctor} = require('../Bifunctor');
let {String} = require('../String');
let {Bool} = require('../Bool');
let {Ordering} = require('../Ordering');
let {Ord} = require('../Ord');
let {Maybe} = require('../Maybe');
let {Int} = require('../Int');
let {Function:F} = require('../Function');
let {Tuple} = require('../Tuple');
let {Array} = require('../Array');

/** data List a = Nil | Cons a (List a) */
const List = (a) => {
  /** data List a = Nil | Cons a (List a) */
  let List = {};
  /** Nil :: List a */
  List.Nil = undefined;
  /** Cons :: a -> List a -> List a */
  List.Cons = undefined;
  /** cata :: List a -> { [List]: (...as) -> b } -> b */
  List.cata = undefined;
  List = taggedSum('List', {
    Nil: [],
    Cons: ['a', 'as'],
  });
  List.Cons = (f => curry(f))(List.Cons);
  List.prototype.constructor = List;

  /** show :: (Show a) => Show (List a) => List a -> String */
  List.show = listA => (
    listA.cata({
      Nil: () => String.lift('Nil'),
      Cons: (a, as) => (
        F.pipeline(
          String.lift('(Cons '),
          Semigroup.append, a.show(),
          Semigroup.append, String.lift(' '),
          Semigroup.append, List.show(as),
          Semigroup.append, String.lift(')'),
        )
      ),
    })
  );
  List.show = listA => (
    recurse((s, listA, acc = String.lift('Nil'), cont = F.identity) => (
      listA.cata({
        Nil: () => cont(acc),
        Cons: (a, as) => (
          s(as, acc, acc => (
            s(List.Nil, (
              F.pipeline(
                String.lift('(Cons '),
                Semigroup.append, a.show(),
                Semigroup.append, String.lift(' '),
                Semigroup.append, acc,
                Semigroup.append, String.lift(')'),
              )
            ), cont)
          ))
        )
      })
    ))(listA)
  );
  /** show :: (Show a) => Show (List a) => List a ~> Unit -> String */
  List.prototype.show = function() {return List.show(this)};

  /** foldl :: Foldable List => (b -> a -> b) -> b -> List a -> b */
  List.foldl = curry((f, b, listA) => (
    (f => (
      listA.cata({
        Nil: () => b,
        Cons: (a, as) => List.foldl(f, f(b)(a), as),
      })
    ))(curry(f))
  ));
  List.foldl = curry((f, b, listA) => (
    (f => (
      recurse((s, listA, acc = b, cont = F.identity) => (
        listA.cata({
          Nil: () => cont(acc),
          Cons: (a, as) => (
            s(as, f(acc)(a), acc => s(List.Nil, acc, cont))
          ),
        })
      ))(listA)
    ))(curry(f))
  ));
  /** foldl :: Foldable List => List a ~> (b -> a -> b) -> b -> b */
  List.prototype.foldl = function(f, b) {return List.foldl(f, b, this)};

  /** foldr :: Foldable List => (a -> b -> b) -> b -> List a -> b */
  List.foldr = curry((f, b, listA) => (
    (f => (
      compose(List.foldl(F.flip(f), b), List.reverse)(listA)
    ))(curry(f))
  ));
  /** foldr :: Foldable List => List a ~> (a -> b -> b) -> b -> b */
  List.prototype.foldr = function(f, b) {return List.foldr(f, b, this)};

  /** foldMap :: Foldable List => Monoid f0 => typeof f0 -> (a -> f0) -> List a -> f0 */
  List.foldMap = (Monoid) => curry((f, listA) => (
    List.foldl(f0 => compose(Monoid.append(f0), f), Monoid.mempty(), listA)
  ));
  /** foldMap :: Foldable List => Monoid f0 => List a ~> (a -> f0) -> typeof f0 -> f0 */
  List.prototype.foldMap = function(f, Monoid) {return List.foldMap(Monoid)(f, this)};

  /** mempty :: Monoid (List a) => Unit -> List a */
  List.mempty = () => List.Nil;

  /** append :: Semigroup (List a) => List a -> List a -> List a */
  List.append = curry((list0, list1) => (
    List.foldr(List.Cons, list1, list0)
  ));
  /** append :: Semigroup (List a) => List a ~> List a -> List a */
  List.prototype.append = function(list) {return List.append(this, list)};

  /** map :: Functor List => (a -> b) -> List a -> List b */
  List.map = curry((f, listA) => (
    ((f, Cons) => (
      List.foldr(compose(Cons, f), List.Nil, listA)
    ))(curry(f), curry(List.Cons))
  ));
  /** map :: Functor List => List a ~> (a -> b) -> List b */
  List.prototype.map = function(f) {return List.map(f, this)};

  /** ap :: Apply List => List (a -> b) -> List a -> List b */
  List.ap = curry((listF, listA) => (
    listF.cata({
      Nil: () => List.Nil,
      Cons: (f, fs) => (
        (f => (
          List.append(List.map(f, listA), List.ap(fs, listA))
        ))(curry(f))
      ),
    })
  ));
  List.ap = curry((listF, listA) => (
    recurse((s, listF, acc = List.Nil, cont = F.identity) => (
      listF.cata({
        Nil: () => cont(acc),
        Cons: (f, fs) => (
          (f => (
            s(fs, acc, acc => (
              s(List.Nil, List.append(List.map(f, listA), acc), cont)
            ))
          ))(curry(f))
        ),
      })
    ))(listF)
  ));
  /** ap :: Apply List => List a ~> List (a -> b) -> List b */
  List.prototype.ap = function(listF) {return List.ap(listF, this)};

  /** pure :: Applicative List => a -> List a */
  List.pure = a => List.Cons(a, List.Nil);

  /** bind :: Bind List => List a -> (a -> List b) -> List b */
  List.bind = curry((listA, f) => (
    listA.cata({
      Nil: () => List.Nil,
      Cons: (a, as) => (
        Semigroup.append(f(a), List.bind(as, f))
      )
    })
  ));
  List.bind = curry((listA, f) => (
    recurse((s, acc, cont, listA = List.Nil) => (
      listA.cata({
        Nil: () => cont(acc),
        Cons: (a, as) => (
          s(acc, acc => (
            s(Semigroup.append(f(a), acc), cont)
          ), as)
        )
      })
    ))(List.Nil, F.identity, listA)
  ));
  /** bind :: Bind List => List a ~> (a -> List b) -> List b */
  List.prototype.bind = function(f) {return List.bind(this, f)};
  
  /** singleton :: a -> List a */
  List.singleton = a => List.Cons(a, List.Nil);

  /** range :: Int -> Int -> List Int */
  List.range = curry((i0, i1) => (
    recurse((s, i, acc) => (
      i.lt(i0).cata({
        True: () => acc,
        False: () => s(i.dec(), List.Cons(i, acc)),
      })
    ))(i1, List.Nil)
  ));
  
  /** null :: List a -> Bool */
  List.null = list => (
    list.cata({
      Nil: () => Bool.True,
      Cons: () => Bool.False,
    })
  );

  /** len :: List a -> Int */
  List.len = list => List.foldl((acc, _) => acc.add(Int.one()), Int.zero(), list);
  /** len :: List a ~> Unit -> Int */
  List.prototype.len = function() {return List.len(this)};

  /** snoc :: List a -> a -> List a */
  List.snoc = curry((listA, a) => (
    List.foldr(List.Cons, List.singleton(a), listA)
  ));

  /** head :: List ~> Maybe */
  List.head = listA => (
    listA.cata({
      Nil: () => Maybe().Nothing,
      Cons: (a, _) => Maybe().Just(a),
    })
  );
  /** head :: List a ~> Unit -> Maybe a */
  List.prototype.head = function() {return List.head(this)};

  /** last :: List ~> Maybe */
  List.last = listA => (
    listA.cata({
      Nil: () => Maybe().Nothing,
      Cons: (a, as) => as.cata({
        Nil: () => Maybe().Just(a),
        Cons: () => List.last(as),
      }),
    })
  );
  List.last = listA => (
    recurse((s, listA) => (
      listA.cata({
        Nil: () => Maybe().Nothing,
        Cons: (a, as) => as.cata({
          Nil: () => Maybe().Just(a),
          Cons: () => s(as),
        }),
      })
    ))(listA)
  );
  /** last :: List a ~> Unit -> Maybe a */
  List.prototype.last = function() {return List.last(this)};

  /** tail :: List a -> Maybe (List a) */
  List.tail = listA => (
    listA.cata({
      Nil: () => Maybe().Nothing,
      Cons: (_, as) => Maybe().Just(as),
    })
  );
  /** tail :: List a ~> Unit -> Maybe (List a) */
  List.prototype.tail = function() {return List.tail(this)};

  /** uncons :: List a -> Maybe (Tuple a (List a)) */
  List.uncons = listA => (
    listA.cata({
      Nil: () => Maybe().Nothing,
      Cons: (a, as) => Maybe().Just(Tuple().lift(a, as)),
    })
  );
  /** uncons :: List a ~> Unit -> Maybe (Tuple a (List a)) */
  List.prototype.uncons = function() {return List.uncons(this)};

  /** unsnoc :: List a -> Maybe (Tuple (List a) a) */
  List.unsnoc = listA => (
    listA.cata({
      Nil: () => Maybe().Nothing,
      Cons: (a, as) => as.cata({
        Nil: () => Maybe().Just(Tuple().lift(List.Nil, a)),
        Cons: () => (
          Functor.map(Bifunctor.lmap(List.Cons(a)))(List.unsnoc(as))
        ),
      }),
    })
  );
  List.unsnoc = listA => (
    recurse((s, listA, acc = Maybe().Nothing, cont = F.identity) => (
      listA.cata({
        Nil: () => cont(acc),
        Cons: (a, as) => as.cata({
          Nil: () => s(List.Nil, Maybe().Just(Tuple().lift(List.Nil, a)), cont),
          Cons: () => (
            s(as, acc, acc => (
              s(List.Nil, Functor.map(Bifunctor.lmap(List.Cons(a)))(acc), cont)
            ))
          ),
        }),
      })
    ))(listA)
  );
  /** unsnoc :: List a ~> Unit -> Maybe (Tuple (List a) a) */
  List.prototype.unsnoc = function() {return List.unsnoc(this)};

  /** shift :: List a -> Maybe (List a) */
  List.shift = List.tail;
  /** shift :: List a ~> Unit -> Maybe (List a) */
  List.prototype.shift = function() {return List.shift(this)};

  /** shiftN :: Int -> List a -> Maybe (List a) */
  List.shiftN = curry((n, listA) => (
    F.define((shiftN, n, listA) => (
      Eq.eq(n, Int.zero()).cata({
        True: () => Maybe().Just(listA),
        False: () => List.shift(listA).cata({
          Just: listA => shiftN(Int.dec(n), listA),
          Nothing: () => Maybe().Nothing,
        }),
      })
    ))(n, listA)
  ));
  /** shiftN :: List a ~> Int -> Maybe (List a) */
  List.prototype.shiftN = function(n) {return List.shiftN(n, this)};

  /** pop :: List a -> Maybe (List a) */
  List.pop = compose(Functor.map(Tuple().fst), List.unsnoc);
  /** pop :: List a ~> Unit -> Maybe (List a) */
  List.prototype.pop = function() {return List.pop(this)};

  /** popN :: Int -> List a -> Maybe (List a) */
  List.popN = curry((n, listA) => (
    F.define((popN, n, listA) => (
      Eq.eq(n, Int.zero()).cata({
        True: () => Maybe().Just(listA),
        False: () => List.pop(listA).cata({
          Just: listA => popN(Int.dec(n), listA),
          Nothing: () => Maybe().Nothing,
        }),
      })
    ))(n, listA)
  ));
  /** popN :: List a ~> Int -> Maybe (List a) */
  List.prototype.popN = function(n) {return List.popN(n, this)};

  /** index :: List a -> Int -> Maybe a */
  List.index = curry((listA, i) => (
    listA.cata({
      Nil: () => Maybe().Nothing,
      Cons: (a, as) => (
        i.eq(Int.zero()).cata({
          True: () => Maybe().Just(a),
          False: () => List.index(as, i.dec()),
        })
      ),
    })
  ));
  List.index = curry((listA, i) => (
    recurse((s, listA, i) => (
      listA.cata({
        Nil: () => Maybe().Nothing,
        Cons: (a, as) => (
          i.eq(Int.zero()).cata({
            True: () => Maybe().Just(a),
            False: () => s(as, i.dec()),
          })
        ),
      })
    ))(listA, i)
  ));
  /** index :: List a ~> Int -> Maybe a */
  List.prototype.index = function(i) {return List.index(this, i)};

  /** findIndex :: (a -> Bool) -> List a -> Maybe Int */
  List.findIndex = curry((f, listA) => (
    (x => x(x))(x => (listA, i) => (
      (s => (
        listA.cata({
          Nil: () => Maybe().Nothing,
          Cons: (a, as) => (
            f(a).cata({
              True: () => Maybe().Just(i),
              False: () => s(as, i.inc()),
            })
          ),
        })
      ))((...args) => x(x)(...args))
    ))(listA, Int.zero())
  ));
  List.findIndex = curry((f, listA) => (
    recurse((s, listA, i) => (
      listA.cata({
        Nil: () => Maybe().Nothing,
        Cons: (a, as) => (
          f(a).cata({
            True: () => Maybe().Just(i),
            False: () => s(as, i.inc()),
          })
        ),
      })
    ))(listA, Int.zero())
  ));
  /** findIndex :: List a ~> (a -> Bool) -> Maybe Int */
  List.prototype.findIndex = function(f) {return List.findIndex(f, this)};

  /** findLastIndex :: (a -> Bool) -> List a -> Maybe Int */
  List.findLastIndex = curry((f, listA) => (
    compose(
      Functor.map(Ring.sub(List.len(listA).sub(Int.one()))),
      List.findIndex(f), 
      List.reverse,
    )(listA)
  ));
  /** findLastIndex :: List a ~> (a -> Bool) -> Maybe Int */
  List.prototype.findLastIndex = function(f) {return List.findLastIndex(f, this)};

  /** indexOf :: Eq a => a -> List a -> Maybe Int */
  List.indexOf = curry((a, listA) => (
    List.findIndex(Eq.eq(a))(listA)
  ));
  /** indexOf :: Eq a => List a ~> a -> Maybe Int */
  List.prototype.indexOf = function(a) {return List.indexOf(a, this)};

  /** lastIndexOf :: Eq a => a -> List a -> Maybe Int */
  List.lastIndexOf = curry((a, listA) => (
    List.findLastIndex(Eq.eq(a))(listA)
  ));
  /** lastIndexOf :: Eq a => List a ~> a -> Maybe Int */
  List.prototype.lastIndexOf = function(a) {return List.lastIndexOf(a, this)};

  /** insertAt :: Int -> a -> List a -> Maybe (List a) */
  List.insertAt = curry((i, a, listA) => (
    (a0 => (
      i.eq(Int.zero()).cata({
        True: () => Maybe().Just(List.Cons(a0, listA)),
        False: () => (
          listA.cata({
            Nil: () => Maybe().Nothing,
            Cons: (a, as) => (
              Functor.map(List.Cons(a))(List.insertAt(i.dec(), a0, as))
            ),
          })
        )
      })
    ))(a)
  ));
  List.insertAt = curry((i, a, listA) => (
    recurse((s, i, listA, acc = Maybe().Nothing, cont = F.identity) => (
      i.eq(Int.zero()).cata({
        True: () => s(Int.one(), List.Nil, Maybe().Just(List.Cons(a, listA)), cont),
        False: () => (
          listA.cata({
            Nil: () => cont(acc),
            Cons: (a, as) => (
              s(i.dec(), as, acc, acc => (
                s(Int.one(), List.Nil, Functor.map(List.Cons(a))(acc), cont)
              ))
            ),
          })
        )
      })
    ))(i, listA)
  ));
  /** insertAt :: List a ~> Int -> a -> Maybe (List a) */
  List.prototype.insertAt = function(i, a) {return List.insertAt(i, a, this)};

  /** deleteAt :: Int -> List a -> Maybe (List a) */
  List.deleteAt = curry((i, listA) => (
    listA.cata({
      Nil: () => Maybe().Nothing,
      Cons: (a, as) => i.eq(Int.zero()).cata({
        True: () => Maybe().Just(as),
        False: () => (
          Functor.map(List.Cons(a))(List.deleteAt(i.dec(), as))
        ),
      }),
    })
  ));
  List.deleteAt = curry((i, listA) => (
    recurse((s, listA, i, acc = Maybe().Nothing, cont = F.identity) => (
      listA.cata({
        Nil: () => cont(acc),
        Cons: (a, as) => i.eq(Int.zero()).cata({
          True: () => s(List.Nil, Int.one(), Maybe().Just(as), cont),
          False: () => (
            s(as, i.dec(), acc, acc => (
              s(List.Nil, Int.one(), Functor.map(List.Cons(a))(acc), cont)
            ))
          ),
        }),
      })
    ))(listA, i)
  ));
  /** deleteAt :: List a ~> Int -> Maybe (List a) */
  List.prototype.deleteAt = function(i) {return List.deleteAt(i, this)};

  /** updateAt :: Int -> a -> List a -> Maybe (List a) */
  List.updateAt = curry((i, a, listA) => (
    (a0 => (
      listA.cata({
        Nil: () => Maybe().Nothing,
        Cons: (a, as) => i.eq(Int.zero()).cata({
          True: () => compose(Maybe().Just, List.Cons(a0))(as),
          False: () => (
            Functor.map(List.Cons(a))(List.updateAt(i.dec(), a0, as))
          ),
        }),
      })
    ))(a)
  ));
  /** updateAt :: List a ~> Int -> a -> Maybe (List a) */
  List.prototype.updateAt = function(i, a) {return List.updateAt(i, a, this)};

  /** alterAt :: Int -> (a -> Maybe a) -> List a -> Maybe (List a) */
  List.alterAt = curry((i, f, listA) => (
    listA.cata({
      Nil: () => Maybe().Nothing,
      Cons: (a, as) => i.eq(Int.zero()).cata({
        True: () => f(a).cata({
          Nothing: () => Maybe().Just(as),
          Just: a => compose(Maybe().Just, List.Cons(a))(as),
        }),
        False: () => (
          Functor.map(List.Cons(a))(List.alterAt(i.dec(), f, as))
        ),
      }),
    })
  ));
  List.alterAt = curry((i, f, listA) => (
    recurse((s, acc, cont, listA = List.Nil, i = Int.one()) => (
      listA.cata({
        Nil: () => cont(acc),
        Cons: (a, as) => i.eq(Int.zero()).cata({
          True: () => f(a).cata({
            Nothing: () => s(Maybe().Just(as), cont),
            Just: a => s(compose(Maybe().Just, List.Cons(a))(as), cont),
          }),
          False: () => (
            s(acc, acc => (
              s(Functor.map(List.Cons(a))(acc), cont)
            ), as, i.dec())
          ),
        }),
      })
    ))(Maybe().Nothing, F.identity, listA, i)
  ));
  /** alterAt :: List a -> Int -> (a -> Maybe a) -> Maybe (List a) */
  List.prototype.alterAt = function(i, f) {return List.alterAt(i, f, this)};

  /** modifyAt :: Int -> (a -> a) -> List a -> Maybe (List a) */
  List.modifyAt = curry((i, f, listA) => (
    List.alterAt(i, compose(Maybe().Just, f), listA)
  ));
  /** modifyAt :: List a ~> Int -> (a -> a) -> Maybe (List a) */
  List.prototype.modifyAt = function(i, f) {return List.modifyAt(i, f, this)};

  /** concat :: List (List a) -> List a */
  List.concat = F.flip(List.bind)(F.identity);
  /** concat :: List (List a) ~> Unit -> List a */
  List.prototype.concat = function() {return List.concat(this)};

  /** concatMap :: (a -> List b) -> List a -> List b */
  List.concatMap = F.flip(List.bind);
  /** concatMap :: List a ~> (a -> List b) -> List b */
  List.prototype.concatMap = function(f) {return List.concatMap(f, this)};

  /** filter :: (a -> Bool) -> List a -> List a */
  List.filter = curry((f, listA) => (
    (x => x(x))(x => (listA, acc) => (
      (s => (
        listA.cata({
          Nil: () => List.reverse(acc),
          Cons: (a, as) => f(a).cata({
            True: () => s(as, List.Cons(a, acc)),
            False: () => s(as, acc),
          }),
        })
      ))((...args) => x(x)(...args))
    ))(listA, List.Nil)
  ));
  List.filter = curry((f, listA) => (
    recurse((s, listA, acc) => (
      listA.cata({
        Nil: () => List.reverse(acc),
        Cons: (a, as) => f(a).cata({
          True: () => s(as, List.Cons(a, acc)),
          False: () => s(as, acc),
        }),
      })
    ))(listA, List.Nil)
  ));
  /** filter :: List a ~> (a -> Bool) -> List a */
  List.prototype.filter = function(f) {return List.filter(f, this)};

  /** fromFoldable :: Foldable f => f ~> List */
  List.fromFoldable = foldable => foldable.foldr(List.Cons, List.Nil);

  /** reverse :: List a -> List a */
  List.reverse = List.foldl(F.flip(List.Cons), List.Nil);
  /** reverse :: List a ~> Unit -> List a */
  List.prototype.reverse = function() {return List.reverse(this)};

  /** merge :: (a -> a -> Ordering) -> List a -> List a -> List a */
  List.merge = curry((f, list0, list1) => (
    (f0 => (
      list0.cata({
        Nil: () => list1,
        Cons: (a0, a0s) => list1.cata({
          Nil: () => list0,
          Cons: (a1, a1s) => f0(a0)(a1).eq(Ordering.LT).cata({
            True: () => List.Cons(a0, List.merge(f, a0s, list1)),
            False: () => List.Cons(a1, List.merge(f, list0, a1s)),
          }),
        }),
      })
    ))(curry(f))
  ));
  List.merge = curry((f, list0, list1) => (
    (f => (
      recurse((s, acc, cont, list0 = List.Nil, list1 = List.Nil) => (
        list0.cata({
          Nil: () => list1.cata({
            Nil: () => cont(acc),
            Cons: () => s(list1, cont),
          }),
          Cons: (a0, a0s) => list1.cata({
            Nil: () => s(list0, cont),
            Cons: (a1, a1s) => f(a0)(a1).eq(Ordering.LT).cata({
              True: () => (
                s(acc, acc => (
                  s(List.Cons(a0, acc), cont)
                ), a0s, list1)
              ),
              False: () => (
                s(acc, acc => (
                  s(List.Cons(a1, acc), cont)
                ), list0, a1s)
              ),
            }),
          }),
        })
      ))(List.Nil, F.identity, list0, list1)
    ))(curry(f))
  ));

  /** mergeAll :: (a -> a -> Ordering) -> List (List a) -> List a */
  List.mergeAll = curry((f, listAs) => (
    (({mergePairs}) => (
      listAs.cata({
        Nil: () => List.Nil,
        Cons: (listA0, listA0s) => listA0s.cata({
          Nil: () => listA0,
          Cons: () => compose(List.mergeAll(f), mergePairs)(listAs),
        }),
      })
    ))({
      /** mergePairs :: List (List a) -> List (List a) */
      mergePairs: F.define((s, listAs) => (
        listAs.cata({
          Nil: () => List.Nil,
          Cons: (listA0, listA0s) => listA0s.cata({
            Nil: () => listAs,
            Cons: (listA1, listA1s) => (
              List.Cons(List.merge(f)(listA0, listA1), s(listA1s))
            ),
          }),
        })
      )),
    })
  ));
  List.mergeAll = curry((f, listAs) => (
    (({mergePairs}) => (
      F.recurse((s, listAs) => (
        listAs.cata({
          Nil: () => List.Nil,
          Cons: (listA0, listA0s) => listA0s.cata({
            Nil: () => listA0,
            Cons: () => compose(s, mergePairs)(listAs),
          }),
        })
      ))(listAs)
    ))({
      /** mergePairs :: List (List a) -> List (List a) */
      mergePairs: F.recurse((s, listAs, acc = List.Nil, cont = F.identity) => (
        listAs.cata({
          Nil: () => cont(acc),
          Cons: (listA0, listA0s) => listA0s.cata({
            Nil: () => s(List.Nil, listAs, cont),
            Cons: (listA1, listA1s) => (
              s(listA1s, acc, acc => (
                s(List.Nil, List.Cons(List.merge(f)(listA0, listA1), acc), cont)
              ))
            ),
          }),
        })
      )),
    })
  ));
  /** mergeAll :: List (List a) ~> (a -> a -> Ordering) -> List a */
  List.prototype.mergeAll = function(f) {return List.mergeAll(f, this)};

  /** sortBy :: (a -> a -> Ordering) -> List a -> List a */
  List.sortBy = curry((f, listA) => (
    (f => (
      (({sequences}) => (
        compose(List.mergeAll(f), sequences)(listA)
      ))({
        /** sequences :: List a -> List (List a) */
        sequences: F.define((sequences, listA) => (
          (({descending, ascending}) => (
            listA.cata({
              Nil: () => List.Nil,
              Cons: (a0, a0s) => a0s.cata({
                Nil: () => List.singleton(listA),
                Cons: (a1, a1s) => (
                  f(a0)(a1).eq(Ordering.GT).cata({
                    True: () => descending(a1, List.singleton(a0), a1s),
                    False: () => ascending(a1, List.Cons(a0), a1s),
                  })
                ),
              }),
            })
          ))({
            /** descending :: a -> List a -> List a -> List (List a) */
            descending: F.define((descending, a, acc, listA) => (
              listA.cata({
                Nil: () => List.Cons(List.Cons(a, acc), sequences(listA)),
                Cons: (a0, a0s) => (
                  f(a)(a0).eq(Ordering.GT).cata({
                    True: () => descending(a0, List.Cons(a, acc), a0s),
                    False: () => List.Cons(List.Cons(a, acc), sequences(listA)),
                  })
                ),
              })
            )),
            /** ascending :: a -> (List a -> List a) -> List a -> List (List a) */
            ascending: F.define((ascending, a, acc, listA) => (
              listA.cata({
                Nil: () => List.Cons(acc(List.singleton(a)), sequences(listA)),
                Cons: (a0, a0s) => f(a)(a0).eq(Ordering.GT).cata({
                  False: () => ascending(a0, a1s => acc(List.Cons(a, a1s)), a0s),
                  True: () => List.Cons(acc(List.singleton(a)), sequences(listA)),
                }),
              })
            )),
          })
        )),
      })
    ))(curry(f))
  ));
  List.sortBy = curry((f, listA) => (
    (f => (
      (({sequences}) => (
        compose(List.mergeAll(f), sequences)(listA)
      ))({
        /** sequences :: List a -> List (List a) */
        sequences: F.recurse((sequences, listA, acc = List.Nil, cont = F.identity) => (
          (({descending, ascending}) => (
            listA.cata({
              Nil: () => cont(acc),
              Cons: (a0, a0s) => a0s.cata({
                Nil: () => sequences(List.Nil, List.singleton(listA), cont),
                Cons: (a1, a1s) => (
                  f(a0)(a1).eq(Ordering.GT).cata({
                    True: () => (
                      descending(a1, List.singleton(a0), a1s, acc, acc => (
                        sequences(List.Nil, acc, cont)
                      ))
                    ),
                    False: () => (
                      ascending(a1, List.Cons(a0), a1s, acc, acc => (
                        sequences(List.Nil, acc, cont)
                      ))
                    ),
                  })
                ),
              }),
            })
          ))({
            /** descending :: a -> List a -> List a -> List (List a) */
            descending: F.recurse((descending, a, acc0, listA, acc, cont) => (
              listA.cata({
                Nil: () => (
                  sequences(listA, acc, acc => (
                    sequences(List.Nil, List.Cons(List.Cons(a, acc0), acc), cont)
                  ))
                ),
                Cons: (a0, a0s) => (
                  f(a)(a0).eq(Ordering.GT).cata({
                    True: () => descending(a0, List.Cons(a, acc0), a0s, acc, cont),
                    False: () => (
                      sequences(listA, acc, acc => (
                        sequences(List.Nil, List.Cons(List.Cons(a, acc0), acc), cont)
                      ))
                    ),
                  })
                ),
              })
            )),
            /** ascending :: a -> (List a -> List a) -> List a -> List (List a) */
            ascending: F.recurse((ascending, a, acc0, listA, acc, cont) => (
              listA.cata({
                Nil: () => (
                  sequences(listA, acc, acc => (
                    sequences(List.Nil, List.Cons(acc0(List.singleton(a)), acc), cont)
                  ))
                ),
                Cons: (a0, a0s) => f(a)(a0).eq(Ordering.GT).cata({
                  False: () => ascending(a0, a1s => acc0(List.Cons(a, a1s)), a0s, acc, cont),
                  True: () => (
                    sequences(listA, acc, acc => (
                      sequences(List.Nil, List.Cons(acc0(List.singleton(a)), acc), cont)
                    ))
                  ),
                }),
              })
            )),
          })
        )),
      })
    ))(curry(f))
  ));
  /** sortBy :: List a ~> (a -> a -> Ordering) -> List a */
  List.prototype.sortBy = function(f) {return List.sortBy(f, this)};

  /** sort :: Ord a => List a -> List a */
  List.sort = List.sortBy(Ord.defaultCompare);
  /** sort :: Ord a => List a ~> Unit -> List a */
  List.prototype.sort = function() {return List.sort(this)};

  /** populateJS :: (...a) -> List a */
  List.populateJS = (...as) => List.fromFoldable(Array().lift(as));

  return List;
};

module.exports = {
  default: List,
  List,
};