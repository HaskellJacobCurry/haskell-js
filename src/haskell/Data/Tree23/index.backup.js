/**
 * data Tree23 k v
 *  = Leaf
 *  | Two (Tree23 k v) k v (Tree23 k v)
 *  | Three (Tree23 k v) k v (Tree23 k v) k v (Tree23 k v)
 * 
 * (Show k, Show v) => Show (Tree23 k v)
 */

let { Semigroup } = require('../Semigroup');
let { Show } = require('../Show');
let {Functor} = require('../Functor');
let { Foldable } = require('../Foldable');
let { String } = require('../String');
let { Maybe } = require('../Maybe');
let { Ordering } = require('../Ordering');
let { Ord } = require('../Ord');
let { Function: F } = require('../Function');
let { Tuple } = require('../Tuple');
let { List } = require('../List');

/**
 * data Tree23 k v
 *  = Leaf
 *  | Two (Tree23 k v) k v (Tree23 k v)
 *  | Three (Tree23 k v) k v (Tree23 k v) k v (Tree23 k v)
 */
let Tree23 = (k, v) => {
  let Tree23 = {};
  /** Leaf :: Tree23 k v */
  Tree23.Leaf = undefined;
  /** Two :: Tree23 k v -> k -> v -> Tree23 k v -> Tree23 k v */
  Tree23.Two = undefined;
  /** Three :: Tree23 k v -> k -> v -> Tree23 k v -> k -> v -> Tree23 k v -> Tree23 k v */
  Tree23.Three = undefined;
  /** cata :: Tree23 k v -> { [Tree23]: (...as) -> b } -> b */
  Tree23.cata = undefined;
  Tree23 = F.taggedSum('Tree23', {
    Leaf: [],
    Two: ['treeL', 'k', 'v', 'treeR'],
    Three: ['treeL', 'k0', 'v0', 'treeM', 'k1', 'v1', 'treeR'],
  });
  Tree23.Two = (f => F.curry(f))(Tree23.Two);
  Tree23.Three = (f => F.curry(f))(Tree23.Three);
  Tree23.prototype.constructor = Tree23;

  /** show :: (Show k, Show v) => Show (Tree23 k v) => Tree23 k v -> String */
  Tree23.show = tree => (
    F.define((show, tree) => (
      tree.cata({
        Leaf: () => String.lift('Leaf'),
        Two: (treeL, k, v, treeR) => (
          F.pipeline(
            String.lift('Two ('),
            Semigroup.append, show(treeL),
            Semigroup.append, String.lift(') ('),
            Semigroup.append, Show.show(k),
            Semigroup.append, String.lift(') ('),
            Semigroup.append, Show.show(v),
            Semigroup.append, String.lift(') ('),
            Semigroup.append, show(treeR),
            Semigroup.append, String.lift(')'),
          )
        ),
        Three: (treeL, k0, v0, treeM, k1, v1, treeR) => (
          F.pipeline(
            String.lift('Three ('),
            Semigroup.append, show(treeL),
            Semigroup.append, String.lift(') ('),
            Semigroup.append, Show.show(k0),
            Semigroup.append, String.lift(') ('),
            Semigroup.append, Show.show(v0),
            Semigroup.append, String.lift(') ('),
            Semigroup.append, show(treeM),
            Semigroup.append, String.lift(') ('),
            Semigroup.append, Show.show(k1),
            Semigroup.append, String.lift(') ('),
            Semigroup.append, Show.show(v1),
            Semigroup.append, String.lift(') ('),
            Semigroup.append, show(treeR),
            Semigroup.append, String.lift(')'),
          )
        ),
      })
    ))(tree)
  );
  Tree23.show = tree => (
    (seed => (
      F.recurse((show, tree, acc = seed, cont = F.identity) => (
        tree.cata({
          Leaf: () => cont(acc),
          Two: (treeL, k, v, treeR) => (
            show(treeL, seed, accL => (
              show(treeR, seed, accR => (
                show(Tree23.Leaf, (
                  F.pipeline(
                    String.lift('Two ('),
                    Semigroup.append, accL,
                    Semigroup.append, String.lift(') ('),
                    Semigroup.append, Show.show(k),
                    Semigroup.append, String.lift(') ('),
                    Semigroup.append, Show.show(v),
                    Semigroup.append, String.lift(') ('),
                    Semigroup.append, accR,
                    Semigroup.append, String.lift(')'),
                  )
                ), cont)
              ))
            ))
          ),
          Three: (treeL, k0, v0, treeM, k1, v1, treeR) => (
            show(treeL, seed, accL => (
              show(treeM, seed, accM => (
                show(treeR, seed, accR => (
                  show(Tree23.Leaf, (
                    F.pipeline(
                      String.lift('Three ('),
                      Semigroup.append, accL,
                      Semigroup.append, String.lift(') ('),
                      Semigroup.append, Show.show(k0),
                      Semigroup.append, String.lift(') ('),
                      Semigroup.append, Show.show(v0),
                      Semigroup.append, String.lift(') ('),
                      Semigroup.append, accM,
                      Semigroup.append, String.lift(') ('),
                      Semigroup.append, Show.show(k1),
                      Semigroup.append, String.lift(') ('),
                      Semigroup.append, Show.show(v1),
                      Semigroup.append, String.lift(') ('),
                      Semigroup.append, accR,
                      Semigroup.append, String.lift(')'),
                    )
                  ), cont)
                ))
              ))
            ))
          ),
        })
      ))(tree)
    ))(String.lift('Leaf'))
  );
  /** show :: (Show k, Show v) => Show (Tree23 k v) => Tree23 k v ~> Unit -> String */
  Tree23.prototype.show = function () { return Tree23.show(this) };

  /** lookup :: Ord k => k -> Tree23 k v -> Maybe v */
  Tree23.lookup = F.curry((k, tree) => (
    (cmp => (
      F.define((lookup, tree) => (
        tree.cata({
          Leaf: () => Maybe().Nothing,
          Two: (treeL, k0, v0, treeR) => cmp(k, k0).cata({
            EQ: () => Maybe().Just(v0),
            LT: () => lookup(treeL),
            GT: () => lookup(treeR),
          }),
          Three: (treeL, k0, v0, treeM, k1, v1, treeR) => cmp(k, k0).cata({
            EQ: () => Maybe().Just(v0),
            LT: () => cmp(k, k1).cata({
              EQ: () => Maybe().Just(v1),
              LT: () => lookup(treeL),
              GT: () => lookup(treeL),
            }),
            GT: () => cmp(k, k1).cata({
              EQ: () => Maybe().Just(v1),
              LT: () => lookup(treeM),
              GT: () => lookup(treeR),
            }),
          }),
        })
      ))(tree)
    ))(Ord.defaultCompare)
  ));
  Tree23.lookup = F.curry((k, tree) => (
    (cmp => (
      F.recurse((lookup, tree) => (
        tree.cata({
          Leaf: () => Maybe().Nothing,
          Two: (treeL, k0, v0, treeR) => cmp(k, k0).cata({
            EQ: () => Maybe().Just(v0),
            LT: () => lookup(treeL),
            GT: () => lookup(treeR),
          }),
          Three: (treeL, k0, v0, treeM, k1, v1, treeR) => cmp(k, k0).cata({
            EQ: () => Maybe().Just(v0),
            LT: () => cmp(k, k1).cata({
              EQ: () => Maybe().Just(v1),
              LT: () => lookup(treeL),
              GT: () => lookup(treeL),
            }),
            GT: () => cmp(k, k1).cata({
              EQ: () => Maybe().Just(v1),
              LT: () => lookup(treeM),
              GT: () => lookup(treeR),
            }),
          }),
        })
      ))(tree)
    ))(Ord.defaultCompare)
  ));
  /** lookup :: Ord k => Tree23 k v ~> k -> Maybe v */
  Tree23.prototype.lookup = function (k) { return Tree23.lookup(k, this) };

  /**
   * data Context k v
   *  = TwoLeft k v (Tree23 k v)
   *  | TwoRight (Tree23 k v) k v
   *  | ThreeLeft k v (Tree23 k v) k v (Tree23 k v)
   *  | ThreeMiddle (Tree23 k v) k v k v (Tree23 k v)
   *  | ThreeRight (Tree23 k v) k v (Tree23 k v) k v
   */
  let Context = {};
  /** TwoLeft :: k -> v -> (Tree23 k v) -> Context k v */
  Context.TwoLeft = undefined;
  /** TwoRight :: (Tree23 k v) -> k -> v -> Context k v */
  Context.TwoRight = undefined;
  /** ThreeLeft :: k -> v -> (Tree23 k v) -> k -> v -> (Tree23 k v) -> Context k v */
  Context.ThreeLeft = undefined;
  /** ThreeMiddle :: (Tree23 k v) -> k -> v -> k -> v -> (Tree23 k v) -> Context k v */
  Context.ThreeMiddle = undefined;
  /** ThreeRight :: (Tree23 k v) -> k -> v -> (Tree23 k v) -> k -> v -> Context k v */
  Context.ThreeRight = undefined;
  /** cata :: Context k v -> { [Context]: (...as) -> b } -> b */
  Context.cata = undefined;
  Context = F.taggedSum('Context', {
    TwoLeft: ['k', 'v', 'treeR'],
    TwoRight: ['treeL', 'k', 'v'],
    ThreeLeft: ['k0', 'v0', 'treeM', 'k1', 'v1', 'treeR'],
    ThreeMiddle: ['treeL', 'k0', 'v0', 'k1', 'v1', 'treeR'],
    ThreeRight: ['treeL', 'k0', 'v0', 'treeM', 'k1', 'v1'],
  });
  Context.TwoLeft = (f => F.curry(f))(Context.TwoLeft);
  Context.TwoRight = (f => F.curry(f))(Context.TwoRight);
  Context.ThreeLeft = (f => F.curry(f))(Context.ThreeLeft);
  Context.ThreeMiddle = (f => F.curry(f))(Context.ThreeMiddle);
  Context.ThreeRight = (f => F.curry(f))(Context.ThreeRight);
  Context.prototype.constructor = Context;

  /** prevZipper :: Ord k => List (Context k v) -> Tree23 k v -> Tree23 k v */
  let prevZipper = F.curry((ctxs, tree) => (
    F.define((prevZipper, ctxs, tree) => (
      ctxs.cata({
        Nil: () => tree,
        Cons: (ctx, ctxs) => (
          ctx.cata({
            TwoLeft: (k, v, treeR) => prevZipper(ctxs, Tree23.Two(tree, k, v, treeR)),
            TwoRight: (treeL, k, v) => prevZipper(ctxs, Tree23.Two(treeL, k, v, tree)),
            ThreeLeft: (k0, v0, treeM, k1, v1, treeR) => prevZipper(ctxs, Tree23.Three(tree, k0, v0, treeM, k1, v1, treeR)),
            ThreeMiddle: (treeL, k0, v0, k1, v1, treeR) => prevZipper(ctxs, Tree23.Three(treeL, k0, v0, tree, k1, v1, treeR)),
            ThreeRight: (treeL, k0, v0, treeM, k1, v1) => prevZipper(ctxs, Tree23.Three(treeL, k0, v0, treeM, k1, v1, tree)),
          })
        ),
      })
    ))(ctxs, tree)
  ));

  /** data KickUp k v = KickUp (Tree23 k v) k v (Tree23 k v) */
  let KickUp = {};
  /** KickUp :: (Tree23 k v) -> k -> v -> (Tree23 k v) -> KickUp k v */
  KickUp._ = undefined;
  KickUp = F.taggedSum('KickUp', {
    _: ['tree0', 'k', 'v', 'tree1'],
  });
  KickUp._ = (f => F.curry(f))(KickUp._);
  KickUp.prototype.constructor = KickUp;

  /** insert :: Ord k => k -> v -> Tree23 k v -> Tree23 k v */
  Tree23.insert = F.curry((k, v, tree) => (
    (cmp => (
      (({ down }) => (
        down(List().Nil, tree)
      ))({
        /** down :: List (Context k v) -> Tree23 k v -> Tree23 k v */
        down: F.define((down, ctxs, tree) => (
          (({ up }) => (
            tree.cata({
              Leaf: () => up(ctxs, KickUp._(Tree23.Leaf, k, v, Tree23.Leaf)),
              Two: (treeL, k0, v0, treeR) => cmp(k)(k0).cata({
                EQ: () => prevZipper(ctxs, Tree23.Two(treeL, k, v, treeR)),
                LT: () => down(List().Cons(Context.TwoLeft(k0, v0, treeR), ctxs), treeL),
                GT: () => down(List().Cons(Context.TwoRight(treeL, k0, v0), ctxs), treeR),
              }),
              Three: (treeL, k0, v0, treeM, k1, v1, treeR) => cmp(k)(k0).cata({
                EQ: () => prevZipper(ctxs, Tree23.Three(treeL, k, v, treeM, k1, v1, treeR)),
                LT: () => cmp(k)(k1).cata({
                  EQ: () => prevZipper(ctxs, Tree23.Three(treeL, k0, v0, treeM, k, v, treeR)),
                  LT: () => down(List().Cons(Context.ThreeLeft(k0, v0, treeM, k1, v1, treeR), ctxs), treeL),
                  GT: () => down(List().Cons(Context.ThreeLeft(k0, v0, treeM, k1, v1, treeR), ctxs), treeL),
                }),
                GT: () => cmp(k)(k1).cata({
                  EQ: () => prevZipper(ctxs, Tree23.Three(treeL, k0, v0, treeM, k, v, treeR)),
                  LT: () => down(List().Cons(Context.ThreeMiddle(treeL, k0, v0, k1, v1, treeR), ctxs), treeM),
                  GT: () => down(List().Cons(Context.ThreeRight(treeL, k0, v0, treeM, k1, v1), ctxs), treeR),
                }),
              }),
            })
          ))({
            /** up :: List (Context k v) -> KickUp k v -> Tree23 k v */
            up: F.define((up, ctxs, kickup) => (
              ctxs.cata({
                Nil: () => kickup.cata({
                  _: (treeL, k0, v0, treeR) => Tree23.Two(treeL, k0, v0, treeR),
                }),
                Cons: (ctx, ctxs) => ctx.cata({
                  TwoLeft: (k0, v0, treeR) => kickup.cata({
                    _: (treeL, k1, v1, treeM) => prevZipper(ctxs, Tree23.Three(treeL, k1, v1, treeM, k0, v0, treeR)),
                  }),
                  TwoRight: (treeL, k0, v0) => kickup.cata({
                    _: (treeM, k1, v1, treeR) => prevZipper(ctxs, Tree23.Three(treeL, k0, v0, treeM, k1, v1, treeR)),
                  }),
                  ThreeLeft: (k1, v1, tree2, k2, v2, tree3) => kickup.cata({
                    _: (tree0, k0, v0, tree1) => up(ctxs, KickUp._(Tree23.Two(tree0, k0, v0, tree1), k1, v1, Tree23.Two(tree2, k2, v2, tree3))),
                  }),
                  ThreeMiddle: (tree0, k0, v0, k2, v2, tree3) => kickup.cata({
                    _: (tree1, k1, v1, tree2) => up(ctxs, KickUp._(Tree23.Two(tree0, k0, v0, tree1), k1, v1, Tree23.Two(tree2, k2, v2, tree3))),
                  }),
                  ThreeRight: (tree0, k0, v0, tree1, k1, v1) => kickup.cata({
                    _: (tree2, k2, v2, tree3) => up(ctxs, KickUp._(Tree23.Two(tree0, k0, v0, tree1), k1, v1, Tree23.Two(tree2, k2, v2, tree3))),
                  }),
                }),
              })
            )),
          })
        )),
      })
    ))(Ord.defaultCompare)
  ));
  /** insert :: Ord k => Tree23 k v ~> k -> v -> Tree23 k v */
  Tree23.prototype.insert = function (k, v) { return Tree23.insert(k, v, this) };

  /** findMax :: Ord k => Tree23 k v -> Maybe (Tuple k v) */
  Tree23.findMax = tree => (
    (seed => (
      F.define((findMax, tree, acc = seed) => (
        tree.cata({
          Leaf: () => acc,
          Two: (_, k, v, treeR) => findMax(treeR, Maybe().Just(Tuple().lift(k, v))),
          Three: (_0, _1, _2, _3, k, v, treeR) => findMax(treeR, Maybe().Just(Tuple().lift(k, v))),
        })
      ))(tree)
    ))(Maybe().Nothing)
  );
  Tree23.findMax = tree => (
    (seed => (
      F.recurse((findMax, tree, acc = seed) => (
        tree.cata({
          Leaf: () => acc,
          Two: (_, k, v, treeR) => findMax(treeR, Maybe().Just(Tuple().lift(k, v))),
          Three: (_0, _1, _2, _3, k, v, treeR) => findMax(treeR, Maybe().Just(Tuple().lift(k, v))),
        })
      ))(tree)
    ))(Maybe().Nothing)
  );
  /** findMax :: Ord k => Tree23 k v ~> Unit -> Maybe (Tuple k v) */
  Tree23.prototype.findMax = function () { return Tree23.findMax(this) };

  /** findMin :: Ord k => Tree23 k v -> Maybe (Tuple k v) */
  Tree23.findMin = tree => (
    (seed => (
      F.define((findMin, tree, acc = seed) => (
        tree.cata({
          Leaf: () => acc,
          Two: (treeL, k, v, _) => findMin(treeL, Maybe().Just(Tuple().lift(k, v))),
          Three: (treeL, k, v, _0, _1, _2, _3) => findMin(treeL, Maybe().Just(Tuple().lift(k, v))),
        })
      ))(tree)
    ))(Maybe().Nothing)
  );
  Tree23.findMin = tree => (
    (seed => (
      F.recurse((findMin, tree, acc = seed) => (
        tree.cata({
          Leaf: () => acc,
          Two: (treeL, k, v, _) => findMin(treeL, Maybe().Just(Tuple().lift(k, v))),
          Three: (treeL, k, v, _0, _1, _2, _3) => findMin(treeL, Maybe().Just(Tuple().lift(k, v))),
        })
      ))(tree)
    ))(Maybe().Nothing)
  );
  /** findMin :: Ord k => Tree23 k v ~> Unit -> Maybe (Tuple k v) */
  Tree23.prototype.findMin = function () { return Tree23.findMin(this) };

  /** keys :: Tree23 k v -> List k */
  Tree23.keys = tree => (
    F.define((keys, tree) => (
      tree.cata({
        Leaf: () => List().Nil,
        Two: (treeL, k, _, treeR) => (
          F.pipeline(
            keys(treeL),
            Semigroup.append, List().pure(k),
            Semigroup.append, keys(treeR),
          )
        ),
        Three: (treeL, k0, _0, treeM, k1, _1, treeR) => (
          F.pipeline(
            keys(treeL),
            Semigroup.append, List().pure(k0),
            Semigroup.append, keys(treeM),
            Semigroup.append, List().pure(k1),
            Semigroup.append, keys(treeR),
          )
        ),
      })
    ))(tree)
  );
  Tree23.keys = tree => (
    ((base, seed) => (
      F.recurse((keys, tree, acc, cont) => (
        tree.cata({
          Leaf: () => cont(acc),
          Two: (treeL, k, _, treeR) => (
            keys(treeL, seed, accL => (
              keys(treeR, seed, accR => (
                keys(base, (
                  F.pipeline(
                    accL,
                    Semigroup.append, List().pure(k),
                    Semigroup.append, accR,
                  )
                ), cont)
              ))
            ))
          ),
          Three: (treeL, k0, _0, treeM, k1, _1, treeR) => (
            keys(treeL, seed, accL => (
              keys(treeM, seed, accM => (
                keys(treeR, seed, accR => (
                  keys(base, (
                    F.pipeline(
                      accL,
                      Semigroup.append, List().pure(k0),
                      Semigroup.append, accM,
                      Semigroup.append, List().pure(k1),
                      Semigroup.append, accR,
                    )
                  ), cont)
                ))
              ))
            ))
          ),
        })
      ))(tree, seed, F.identity)
    ))(Tree23.Leaf, List().Nil)
  );

  /** pop :: Ord k => k -> Tree23 k v -> Maybe (Tuple v (Tree23 k v)) */
  Tree23.pop = F.curry((k, tree) => (
    (cmp => (
      (({down}) => (
        down(List().Nil, tree)
      ))({
        /** down :: List (Context k v) -> Tree23 k v -> Maybe (Tuple v (Tree23 k v)) */
        down: F.define((down, ctxs, tree) => (
          (({up, maxNode}) => (
            (({removeMaxNode}) => (
              Tree23.cata(tree, {
                Leaf: () => Maybe().Nothing,
                Two: (treeL, k0, v0, treeR) => Tree23.cata(treeR, {
                  Leaf: () => Ordering.cata(cmp(k, k0), {
                    EQ: () => Maybe().Just(Tuple().lift(v0, up(ctxs, Tree23.Leaf))),
                    LT: () => down(List().Cons(Context.TwoLeft(k0, v0, treeR), ctxs), treeL),
                    GT: () => down(List().Cons(Context.TwoRight(treeL, k0, v0), ctxs), treeR),
                  }),
                  Two: () => Ordering.cata(cmp(k, k0), {
                    EQ: () => (
                      (max => (
                        ((kMax, vMax) => (
                          Maybe().Just(Tuple().lift(v0, removeMaxNode(List().Cons(Context.TwoLeft(kMax, vMax, treeR), ctxs), treeL)))
                        ))(Tuple().fst(max), Tuple().snd(max))
                      ))(maxNode(treeL))
                    ),
                    LT: () => down(List().Cons(Context.TwoLeft(k0, v0, treeR), ctxs), treeL),
                    GT: () => down(List().Cons(Context.TwoRight(treeL, k0, v0), ctxs), treeR),
                  }),
                  Three: () => Ordering.cata(cmp(k, k0), {
                    EQ: () => (
                      (max => (
                        ((kMax, vMax) => (
                          Maybe().Just(Tuple().lift(v0, removeMaxNode(List().Cons(Context.TwoLeft(kMax, vMax, treeR), ctxs), treeL)))
                        ))(Tuple().fst(max), Tuple().snd(max))
                      ))(maxNode(treeL))
                    ),
                    LT: () => down(List().Cons(Context.TwoLeft(k0, v0, treeR), ctxs), treeL),
                    GT: () => down(List().Cons(Context.TwoRight(treeL, k0, v0), ctxs), treeR),
                  }),
                }),
                Three: (treeL, k0, v0, treeM, k1, v1, treeR) => Tree23.cata(treeL, {
                  Leaf: () => Tree23.cata(treeM, {
                    Leaf: () => Tree23.cata(treeR, {
                      Leaf: () => Ordering.cata(cmp(k, k0), {
                        EQ: () => Maybe().Just(Tuple().lift(v0, prevZipper(ctxs, Tree23.Two(Tree23.Leaf, k1, v1, Tree23.Leaf)))),
                        LT: () => Ordering.cata(cmp(k, k1), {
                          EQ: () => undefined,
                          LT: () => down(List().Cons(Context.ThreeLeft(k0, v0, treeM, k1, v1, treeR), ctxs), treeL),
                          GT: () => undefined,
                        }),
                        GT: () => Ordering.cata(cmp(k, k1), {
                          EQ: () => Maybe().Just(Tuple().lift(v1, prevZipper(ctxs, Tree23.Two(Tree23.Leaf, k0, v0, Tree23.Leaf)))),
                          LT: () => down(List().Cons(Context.ThreeMiddle(treeL, k0, v0, k1, v1, treeR), ctxs), treeM),
                          GT: () => down(List().Cons(Context.ThreeRight(treeL, k0, v0, treeM, k1, v1), ctxs), treeR),
                        }),
                      }),
                      Two: () => undefined,
                      Three: () => undefined,
                    }),
                    Two: () => undefined,
                    Three: () => undefined,
                  }),
                  Two: () => Ordering.cata(cmp(k, k0), {
                    EQ: () => (
                      (max => (
                        ((kMax, vMax) => (
                          Maybe().Just(Tuple().lift(v0, removeMaxNode(List().Cons(Context.ThreeLeft(kMax, vMax, treeM, k1, v1, treeR), ctxs), treeL)))
                        ))(Tuple().fst(max), Tuple().snd(max))
                      ))(maxNode(treeL))
                    ),
                    LT: () => Ordering.cata(cmp(k, k1), {
                      EQ: () => undefined,
                      LT: () => down(List().Cons(Context.ThreeLeft(k0, v0, treeM, k1, v1, treeR), ctxs), treeL),
                      GT: () => undefined,
                    }),
                    GT: () => Ordering.cata(cmp(k, k1), {
                      EQ: () => (
                        (max => (
                          ((kMax, vMax) => (
                            Maybe().Just(Tuple().lift(v0, removeMaxNode(List().Cons(Context.ThreeMiddle(treeL, k0, v0, kMax, vMax, treeR), ctxs), treeM)))
                          ))(Tuple().fst(max), Tuple().snd(max))
                        ))(maxNode(treeM))
                      ),
                      LT: () => down(List().Cons(Context.ThreeMiddle(treeL, k0, v0, k1, v1, treeR), ctxs), treeM),
                      GT: () => down(List().Cons(Context.ThreeRight(treeL, k0, v0, treeM, k1, v1), ctxs), treeR),
                    }),
                  }),
                  Three: () => Ordering.cata(cmp(k, k0), {
                    EQ: () => (
                      (max => (
                        ((kMax, vMax) => (
                          Maybe().Just(Tuple().lift(v0, removeMaxNode(List().Cons(Context.ThreeLeft(kMax, vMax, treeM, k1, v1, treeR), ctxs), treeL)))
                        ))(Tuple().fst(max), Tuple().snd(max))
                      ))(maxNode(treeL))
                    ),
                    LT: () => Ordering.cata(cmp(k, k1), {
                      EQ: () => undefined,
                      LT: () => down(List().Cons(Context.ThreeLeft(k0, v0, treeM, k1, v1, treeR), ctxs), treeL),
                      GT: () => undefined,
                    }),
                    GT: () => Ordering.cata(cmp(k, k1), {
                      EQ: () => (
                        (max => (
                          ((kMax, vMax) => (
                            Maybe().Just(Tuple().lift(v0, removeMaxNode(List().Cons(Context.ThreeMiddle(treeL, k0, v0, kMax, vMax, treeR), ctxs), treeM)))
                          ))(Tuple().fst(max), Tuple().snd(max))
                        ))(maxNode(treeM))
                      ),
                      LT: () => down(List().Cons(Context.ThreeMiddle(treeL, k0, v0, k1, v1, treeR), ctxs), treeM),
                      GT: () => down(List().Cons(Context.ThreeRight(treeL, k0, v0, treeM, k1, v1), ctxs), treeR),
                    }),
                  }),
                }),
              })
            ))({
              /** removeMaxNode :: List (Context k v) -> Tree23 k v -> Partial (Tree23 k v) */
              removeMaxNode: F.define((removeMaxNode, ctxs, tree) => (
                Tree23.cata(tree, {
                  Leaf: () => undefined,
                  Two: (treeL, k0, v0, treeR) => Tree23.cata(treeL, {
                    Leaf: () => Tree23.cata(treeR, {
                      Leaf: () => up(ctxs, Tree23.Leaf),
                      Two: () => undefined,
                      Three: () => undefined,
                    }),
                    Two: () => removeMaxNode(List().Cons(Context.TwoRight(treeL, k0, v0), ctxs), treeR),
                    Three: () => removeMaxNode(List().Cons(Context.TwoRight(treeL, k0, v0), ctxs), treeR),
                  }),
                  Three: (treeL, k0, v0, treeM, k1, v1, treeR) => Tree23.cata(treeL, {
                    Leaf: () => Tree23.cata(treeM, {
                      Leaf: () => Tree23.cata(treeR, {
                        Leaf: () => up(List().Cons(Context.TwoRight(Tree23.Leaf, k0, v0), ctxs), Tree23.Leaf),
                        Two: () => undefined,
                        Three: () => undefined,
                      }),
                      Two: () => undefined,
                      Three: () => undefined,
                    }),
                    Two: () => removeMaxNode(List().Cons(Context.ThreeRight(treeL, k0, v0, treeM, k1, v1), ctxs), treeR),
                    Three: () => removeMaxNode(List().Cons(Context.ThreeRight(treeL, k0, v0, treeM, k1, v1), ctxs), treeR),
                  }),
                })
              )),
            })
          ))({
            /** up :: List (Context k v) -> Tree23 k v -> Tree23 k v */
            up: F.define((up, ctxs, tree) => (
              List().cata(ctxs, {
                Nil: () => tree,
                Cons: (ctx, ctxs) => (
                  Context.cata(ctx, {
                    TwoLeft: (k0, v0, treeR) => Tree23.cata(tree, {
                      Leaf: () => Tree23.cata(treeR, {
                        Leaf: () => prevZipper(ctxs, Tree23.Two(Tree23.Leaf, k0, v0, Tree23.Leaf)),
                        Two: (tree0, k1, v1, tree1) => up(ctxs, Tree23.Three(tree, k0, v0, tree0, k1, v1, tree1)),//---
                        Three: (tree0, k1, v1, tree1, k2, v2, tree2) => prevZipper(ctxs, Tree23.Two(Tree23.Two(tree, k0, v0, tree0), k1, v1, Tree23.Two(tree1, k2, v2, tree2))),//---
                      }),
                      Two: () => Tree23.cata(treeR, {
                        Leaf: () => undefined,
                        Two: (tree0, k1, v1, tree1) => up(ctxs, Tree23.Three(tree, k0, v0, tree0, k1, v1, tree1)),
                        Three: (tree0, k1, v1, tree1, k2, v2, tree2) => prevZipper(ctxs, Tree23.Two(Tree23.Two(tree, k0, v0, tree0), k1, v1, Tree23.Two(tree1, k2, v2, tree2))),
                      }),
                      Three: () => Tree23.cata(treeR, {
                        Leaf: () => undefined,
                        Two: (tree0, k1, v1, tree1) => up(ctxs, Tree23.Three(tree, k0, v0, tree0, k1, v1, tree1)),
                        Three: (tree0, k1, v1, tree1, k2, v2, tree2) => prevZipper(ctxs, Tree23.Two(Tree23.Two(tree, k0, v0, tree0), k1, v1, Tree23.Two(tree1, k2, v2, tree2))),
                      }),
                    }),
                    TwoRight: (treeL, k0, v0) => Tree23.cata(tree, {
                      Leaf: () => Tree23.cata(treeL, {
                        Leaf: () => prevZipper(ctxs, Tree23.Two(Tree23.Leaf, k0, v0, Tree23.Leaf)),
                        Two: (tree0, k1, v1, tree1) => up(ctxs, Tree23.Three(tree0, k1, v1, tree1, k0, v0, tree)),//---
                        Three: (tree0, k1, v1, tree1, k2, v2, tree2) => prevZipper(ctxs, Tree23.Two(Tree23.Two(tree0, k1, v1, tree1), k2, v2, Tree23.Two(tree2, k0, v0, tree))),//---
                      }),
                      Two: () => Tree23.cata(treeL, {
                        Leaf: () => undefined,
                        Two: (tree0, k1, v1, tree1) => up(ctxs, Tree23.Three(tree0, k1, v1, tree1, k0, v0, tree)),
                        Three: (tree0, k1, v1, tree1, k2, v2, tree2) => prevZipper(ctxs, Tree23.Two(Tree23.Two(tree0, k1, v1, tree1), k2, v2, Tree23.Two(tree2, k0, v0, tree))),
                      }),
                      Three: () => Tree23.cata(treeL, {
                        Leaf: () => undefined,
                        Two: (tree0, k1, v1, tree1) => up(ctxs, Tree23.Three(tree0, k1, v1, tree1, k0, v0, tree)),
                        Three: (tree0, k1, v1, tree1, k2, v2, tree2) => prevZipper(ctxs, Tree23.Two(Tree23.Two(tree0, k1, v1, tree1), k2, v2, Tree23.Two(tree2, k0, v0, tree))),
                      }),
                    }),
                    ThreeLeft: (k0, v0, treeM, k1, v1, treeR) => Tree23.cata(tree, {
                      Leaf: () => Tree23.cata(treeM, {
                        Leaf: () => Tree23.cata(treeR, {
                          Leaf: () => prevZipper(ctxs, Tree23.Three(Tree23.Leaf, k0, v0, Tree23.Leaf, k1, v1, Tree23.Leaf)),
                          Two: () => undefined,
                          Three: () => undefined,
                        }),
                        Two: (tree0, k2, v2, tree1) => prevZipper(ctxs, Tree23.Two(Tree23.Three(tree, k0, v0, tree0, k2, v2, tree1), k1, v1, treeR)),//---
                        Three: (tree0, k2, v2, tree1, k3, v3, tree2) => prevZipper(ctxs, Tree23.Three(Tree23.Two(tree, k0, v0, tree0), k2, v2, Tree23.Two(tree1, k3, v3, tree2), k1, v1, treeR)),//---
                      }),
                      Two: () => Tree23.cata(treeM, {
                        Leaf: () => undefined,
                        Two: (tree0, k2, v2, tree1) => prevZipper(ctxs, Tree23.Two(Tree23.Three(tree, k0, v0, tree0, k2, v2, tree1), k1, v1, treeR)),
                        Three: (tree0, k2, v2, tree1, k3, v3, tree2) => prevZipper(ctxs, Tree23.Three(Tree23.Two(tree, k0, v0, tree0), k2, v2, Tree23.Two(tree1, k3, v3, tree2), k1, v1, treeR)),
                      }),
                      Three: () => Tree23.cata(treeM, {
                        Leaf: () => undefined,
                        Two: (tree0, k2, v2, tree1) => prevZipper(ctxs, Tree23.Two(Tree23.Three(tree, k0, v0, tree0, k2, v2, tree1), k1, v1, treeR)),
                        Three: (tree0, k2, v2, tree1, k3, v3, tree2) => prevZipper(ctxs, Tree23.Three(Tree23.Two(tree, k0, v0, tree0), k2, v2, Tree23.Two(tree1, k3, v3, tree2), k1, v1, treeR)),
                      }),
                    }),
                    ThreeMiddle: (treeL, k0, v0, k1, v1, treeR) => Tree23.cata(tree, {
                      Leaf: () => Tree23.cata(treeL, {
                        Leaf: () => Tree23.cata(treeR, {
                          Leaf: () => prevZipper(ctxs, Tree23.Three(Tree23.Leaf, k0, v0, Tree23.Leaf, k1, v1, Tree23.Leaf)),
                          Two: (tree0, k2, v2, tree1) => prevZipper(ctxs, Tree23.Two(treeL, k0, v0, Tree23.Three(tree, k1, v1, tree0, k2, v2, tree1))),//---
                          Three: (tree0, k2, v2, tree1, k3, v3, tree2) => prevZipper(ctxs, Tree23.Three(treeL, k0, v0, Tree23.Two(tree, k1, v1, tree0), k2, v2, Tree23.Two(tree1, k3, v3, tree2))),//---
                        }),
                        Two: (tree0, k2, v2, tree1) => prevZipper(ctxs, Tree23.Two(Tree23.Three(tree0, k2, v2, tree1, k0, v0, tree), k1, v1, treeR)),//---
                        Three: (tree0, k2, v2, tree1, k3, v3, tree2) => Tree23.cata(treeR, {
                          Leaf: () => undefined,
                          Two: (tree3, k4, v4, tree4) => prevZipper(ctxs, Tree23.Two(treeL, k0, v0, Tree23.Three(tree, k1, v1, tree3, k4, v4, tree4))),
                          Three: () => prevZipper(ctxs, Tree23.Three(Tree23.Two(tree0, k2, v2, tree1), k3, v3, Tree23.Two(tree2, k0, v0, tree), k1, v1, treeR)),
                        }),//---
                      }),
                      Two: () => Tree23.cata(treeL, {
                        Leaf: () => undefined,
                        Two: (tree0, k2, v2, tree1) => prevZipper(ctxs, Tree23.Two(Tree23.Three(tree0, k2, v2, tree1, k0, v0, tree), k1, v1, treeR)),
                        Three: (tree0, k2, v2, tree1, k3, v3, tree2) => Tree23.cata(treeR, {
                          Leaf: () => undefined,
                          Two: (tree3, k4, v4, tree4) => prevZipper(ctxs, Tree23.Two(treeL, k0, v0, Tree23.Three(tree, k1, v1, tree3, k4, v4, tree4))),
                          Three: () => prevZipper(ctxs, Tree23.Three(Tree23.Two(tree0, k2, v2, tree1), k3, v3, Tree23.Two(tree2, k0, v0, tree), k1, v1, treeR)),
                        }),
                      }),
                      Three: () => Tree23.cata(treeL, {
                        Leaf: () => undefined,
                        Two: (tree0, k2, v2, tree1) => prevZipper(ctxs, Tree23.Two(Tree23.Three(tree0, k2, v2, tree1, k0, v0, tree), k1, v1, treeR)),
                        Three: (tree0, k2, v2, tree1, k3, v3, tree2) => Tree23.cata(treeR, {
                          Leaf: () => undefined,
                          Two: (tree3, k4, v4, tree4) => prevZipper(ctxs, Tree23.Two(treeL, k0, v0, Tree23.Three(tree, k1, v1, tree3, k4, v4, tree4))),
                          Three: () => prevZipper(ctxs, Tree23.Three(Tree23.Two(tree0, k2, v2, tree1), k3, v3, Tree23.Two(tree2, k0, v0, tree), k1, v1, treeR)),
                        }),
                      }),
                    }),
                    ThreeRight: (treeL, k0, v0, treeM, k1, v1) => Tree23.cata(tree, {
                      Leaf: () => Tree23.cata(treeL, {
                        Leaf: () => Tree23.cata(treeM, {
                          Leaf: () => prevZipper(ctxs, Tree23.Three(Tree23.Leaf, k0, v0, Tree23.Leaf, k1, v1, Tree23.Leaf)),
                          Two: () => undefined,
                          Three: () => undefined,
                        }),
                        Two: (tree0, k2, v2, tree1) => prevZipper(ctxs, Tree23.Two(treeL, k0, v0, Tree23.Three(tree0, k2, v2, tree1, k1, v1, tree))),//---
                        Three: (tree0, k2, v2, tree1, k3, v3, tree2) => prevZipper(ctxs, Tree23.Three(treeL, k0, v0, Tree23.Two(tree0, k2, v2, tree1), k3, v3, Tree23.Two(tree2, k1, v1, tree))),//---
                      }),
                      Two: () => Tree23.cata(treeM, {
                        Leaf: () => undefined,
                        Two: (tree0, k2, v2, tree1) => prevZipper(ctxs, Tree23.Two(treeL, k0, v0, Tree23.Three(tree0, k2, v2, tree1, k1, v1, tree))),
                        Three: (tree0, k2, v2, tree1, k3, v3, tree2) => prevZipper(ctxs, Tree23.Three(treeL, k0, v0, Tree23.Two(tree0, k2, v2, tree1), k3, v3, Tree23.Two(tree2, k1, v1, tree))),
                      }),
                      Three: () => Tree23.cata(treeM, {
                        Leaf: () => undefined,
                        Two: (tree0, k2, v2, tree1) => prevZipper(ctxs, Tree23.Two(treeL, k0, v0, Tree23.Three(tree0, k2, v2, tree1, k1, v1, tree))),
                        Three: (tree0, k2, v2, tree1, k3, v3, tree2) => prevZipper(ctxs, Tree23.Three(treeL, k0, v0, Tree23.Two(tree0, k2, v2, tree1), k3, v3, Tree23.Two(tree2, k1, v1, tree))),
                      }),
                    }),
                  })
                ),
              })
            )),
            /** maxNode :: Tree23 k v => Partial (Tuple k v) */
            maxNode: F.define((maxNode, tree) => (
              Tree23.cata(tree, {
                Leaf: () => undefined,
                Two: (_, k0, v0, treeR) => Tree23.cata(treeR, {
                  Leaf: () => Tuple().lift(k0, v0),
                  Two: () => maxNode(treeR),
                  Three: () => maxNode(treeR),
                }),
                Three: (_0, _1, _2, _3, k0, v0, treeR) => Tree23.cata(treeR, {
                  Leaf: () => Tuple().lift(k0, v0),
                  Two: () => maxNode(treeR),
                  Three: () => maxNode(treeR),
                }),
              })
            )),
          })
        )),
      })
    ))(Ord.defaultCompare)
  ));
  /** pop :: Ord k => Tree23 k v ~> k -> Maybe (Tuple v (Tree23 k v)) */
  Tree23.prototype.pop = function(k) {return Tree23.pop(k, this)};

  /** delete :: Ord k => k -> Tree23 k v -> Tree23 k v */
  Tree23.delete = F.curry((k, tree) => (
    Functor.map(Tuple().snd)(Tree23.pop(k, tree)).cata({
      Just: F.identity,
      Nothing: () => tree,
    })
  ));

  /** fromFoldable :: Foldable f => f a -> Tree23 a a */
  Tree23.fromFoldable = foldable => Foldable.foldl((tree, a) => Tree23.insert(a, a, tree), Tree23.Leaf, foldable);

  return Tree23;
};

module.exports = {
  default: Tree23,
  Tree23,
};