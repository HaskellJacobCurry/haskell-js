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
let {LambdaCase} = require('../../Control/LambdaCase');
let { Tuple } = require('../Tuple');
let { List } = require('../List');
let {Bool} = require('../Bool');

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
        F.assign(() => (
          Tree23.cata(tree, {
            Leaf: () => LambdaCase(1, []),
            Two: (treeL, k0, v0, treeR) => (
              Ordering.cata(cmp(k, k0), {
                EQ: () => LambdaCase(2, [v0]),
                LT: () => LambdaCase(3, [treeL]),
                GT: () => LambdaCase(3, [treeR]),
              })
            ),
            Three: (treeL, k0, v0, treeM, k1, v1, treeR) => (
              Ordering.cata(cmp(k, k0), {
                EQ: () => LambdaCase(2, [v0]),
                LT: () => (
                  Ordering.cata(cmp(k, k1), {
                    EQ: () => LambdaCase(0, []),
                    LT: () => LambdaCase(3, [treeL]),
                    GT: () => LambdaCase(0, []),
                  })
                ),
                GT: () => (
                  Ordering.cata(cmp(k, k1), {
                    EQ: () => LambdaCase(2, [v1]),
                    LT: () => LambdaCase(3, [treeM]),
                    GT: () => LambdaCase(3, [treeR]),
                  })
                ),
              })
            ),
          })
        ))(lambdaCase => (
          LambdaCase.cata(lambdaCase, {
            0: () => undefined,
            1: () => Maybe().Nothing,
            2: (v) => Maybe().Just(v),
            3: (tree) => lookup(tree),
          })
        ))
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
      List().cata(ctxs, {
        Nil: () => tree,
        Cons: (ctx, ctxs) => (
          Context.cata(ctx, {
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
  /** KickUp :: (Tree23 k v) -> k -> v -> (Tree23 k v) -> KickUp k v */
  let KickUp = {};
  /** cata :: KickUp k v -> { [KickUp]: (...as) -> b } -> b */
  KickUp.cata = undefined;
  KickUp = F.tagged('KickUp', ['tree0', 'k', 'v', 'tree1']);
  KickUp = Object.assign((f => F.curry(f))(KickUp), KickUp);
  KickUp.prototype.constructor = KickUp;

  /** insert :: Ord k => k -> v -> Tree23 k v -> Tree23 k v */
  Tree23.insert = F.curry((k, v, tree) => (
    (cmp => (
      (({down}) => (
        down(List().Nil, tree)
      ))({
        /** down :: List (Context k v) -> Tree23 k v -> Tree23 k v */
        down: F.define((down, ctxs, tree) => (
          (({up}) => (
            Tree23.cata(tree, {
              Leaf: () => up(ctxs, KickUp(Tree23.Leaf, k, v, Tree23.Leaf)),
              Two: (treeL, k0, v0, treeR) => (
                Ordering.cata(cmp(k)(k0), {
                  EQ: () => prevZipper(ctxs, Tree23.Two(treeL, k, v, treeR)),
                  LT: () => down(List().Cons(Context.TwoLeft(k0, v0, treeR), ctxs), treeL),
                  GT: () => down(List().Cons(Context.TwoRight(treeL, k0, v0), ctxs), treeR),
                })
              ),
              Three: (treeL, k0, v0, treeM, k1, v1, treeR) => (
                Ordering.cata(cmp(k)(k0), {
                  EQ: () => prevZipper(ctxs, Tree23.Three(treeL, k, v, treeM, k1, v1, treeR)),
                  LT: () => down(List().Cons(Context.ThreeLeft(k0, v0, treeM, k1, v1, treeR), ctxs), treeL),
                  GT: () => (
                    Ordering.cata(cmp(k)(k1), {
                      EQ: () => prevZipper(ctxs, Tree23.Three(treeL, k0, v0, treeM, k, v, treeR)),
                      LT: () => down(List().Cons(Context.ThreeMiddle(treeL, k0, v0, k1, v1, treeR), ctxs), treeM),
                      GT: () => down(List().Cons(Context.ThreeRight(treeL, k0, v0, treeM, k1, v1), ctxs), treeR),
                    })
                  ),
                })
              ),
            })
          ))({
            /** up :: List (Context k v) -> KickUp k v -> Tree23 k v */
            up: F.define((up, ctxs, kickup) => (
              Context.cata(ctxs, {
                Nil: () => (
                  KickUp.cata(kickup, (treeL, k0, v0, treeR) => (
                    Tree23.Two(treeL, k0, v0, treeR)
                  ))
                ),
                Cons: (ctx, ctxs) => (
                  Context.cata(ctx, {
                    TwoLeft: (k0, v0, treeR) => (
                      KickUp.cata(kickup, (treeL, k1, v1, treeM) => (
                        prevZipper(ctxs, Tree23.Three(treeL, k1, v1, treeM, k0, v0, treeR))
                      ))
                    ),
                    TwoRight: (treeL, k0, v0) => (
                      KickUp.cata(kickup, (treeM, k1, v1, treeR) => (
                        prevZipper(ctxs, Tree23.Three(treeL, k0, v0, treeM, k1, v1, treeR))
                      ))
                    ),
                    ThreeLeft: (k1, v1, tree2, k2, v2, tree3) => (
                      KickUp.cata(kickup, (tree0, k0, v0, tree1) => (
                        up(ctxs, KickUp(Tree23.Two(tree0, k0, v0, tree1), k1, v1, Tree23.Two(tree2, k2, v2, tree3)))
                      ))
                    ),
                    ThreeMiddle: (tree0, k0, v0, k2, v2, tree3) => (
                      KickUp.cata(kickup, (tree1, k1, v1, tree2) => (
                        up(ctxs, KickUp(Tree23.Two(tree0, k0, v0, tree1), k1, v1, Tree23.Two(tree2, k2, v2, tree3)))
                      ))
                    ),
                    ThreeRight: (tree0, k0, v0, tree1, k1, v1) => (
                      KickUp.cata(kickup, (tree2, k2, v2, tree3) => (
                        up(ctxs, KickUp(Tree23.Two(tree0, k0, v0, tree1), k1, v1, Tree23.Two(tree2, k2, v2, tree3)))
                      ))
                    ),
                  })
                ),
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
        Tree23.cata(tree, {
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
        Tree23.cata(tree, {
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
        Tree23.cata(tree, {
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
        Tree23.cata(tree, {
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
      Tree23.cata(tree, {
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
        Tree23.cata(tree, {
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
                Two: (treeL, k0, v0, treeR) => (
                  F.assign(() => (
                    Tree23.cata(treeR, {
                      Leaf: () => (
                        Ordering.cata(cmp(k, k0), {
                          EQ: () => LambdaCase(0, []),
                          LT: () => LambdaCase(2, []),
                          GT: () => LambdaCase(3, []),
                        })
                      ),
                      Two: () => (
                        Ordering.cata(cmp(k, k0), {
                          EQ: () => LambdaCase(1, []),
                          LT: () => LambdaCase(2, []),
                          GT: () => LambdaCase(3, []),
                        })
                      ),
                      Three: () => (
                        Ordering.cata(cmp(k, k0), {
                          EQ: () => LambdaCase(1, []),
                          LT: () => LambdaCase(2, []),
                          GT: () => LambdaCase(3, []),
                        })
                      ),
                    })
                  ))(lambdaCase => (
                    /** case treeR, cmp k k0 of */
                    LambdaCase.cata(lambdaCase, {
                      /** Leaf, EQ */
                      0: () => Maybe().Just(Tuple()(v0, up(ctxs, Tree23.Leaf))),
                      /** _, EQ */
                      1: () => (
                        (max => (
                          ((kMax, vMax) => (
                            Maybe().Just(Tuple()(v0, removeMaxNode(List().Cons(Context.TwoLeft(kMax, vMax, treeR), ctxs), treeL)))
                          ))(Tuple().fst(max), Tuple().snd(max))
                        ))(maxNode(treeL))
                      ),
                      /** _, LT */
                      2: () => down(List().Cons(Context.TwoLeft(k0, v0, treeR), ctxs), treeL),
                      /** _, _ */
                      3: () => down(List().Cons(Context.TwoRight(treeL, k0, v0), ctxs), treeR),
                    })
                  ))
                ),
                Three: (treeL, k0, v0, treeM, k1, v1, treeR) => (
                  F.assign(() => (
                    Tree23.cata(treeL, {
                      Leaf: () => (
                        Tree23.cata(treeM, {
                          Leaf: () => (
                            Tree23.cata(treeR, {
                              Leaf: () => Bool.True,
                              Two: () => undefined,
                              Three: () => undefined,
                            })
                          ),
                          Two: () => undefined,
                          Three: () => undefined,
                        })
                      ),
                      Two: () => Bool.False,
                      Three: () => Bool.False,
                    })
                  ))(leaves => (
                    F.assign(() => (
                      Bool.cata(leaves, {
                        True: () => (
                          Ordering.cata(cmp(k, k0), {
                            EQ: () => LambdaCase(0, []),
                            LT: () => (
                              Ordering.cata(cmp(k, k1), {
                                EQ: () => LambdaCase(7, []),
                                LT: () => LambdaCase(4, []),
                                GT: () => LambdaCase(7, []),
                              })
                            ),
                            GT: () => (
                              Ordering.cata(cmp(k, k1), {
                                EQ: () => LambdaCase(1, []),
                                LT: () => LambdaCase(5, []),
                                GT: () => LambdaCase(6, []),
                              })
                            ),
                          })
                        ),
                        False: () => (
                          Ordering.cata(cmp(k, k0), {
                            EQ: () => LambdaCase(2, []),
                            LT: () => (
                              Ordering.cata(cmp(k, k1), {
                                EQ: () => LambdaCase(7, []),
                                LT: () => LambdaCase(4, []),
                                GT: () => LambdaCase(7, []),
                              })
                            ),
                            GT: () => (
                              Ordering.cata(cmp(k, k1), {
                                EQ: () => LambdaCase(3, []),
                                LT: () => LambdaCase(5, []),
                                GT: () => LambdaCase(6, []),
                              })
                            ),
                          })
                        ),
                      })
                    ))
                  ))(lambdaCase => (
                    /** case leaves, cmp k k0, cmp k k1 of */
                    LambdaCase.cata(lambdaCase, {
                      /** True, EQ, _ */
                      0: () => Maybe().Just(Tuple()(v0, prevZipper(ctxs, Tree23.Two(Tree23.Leaf, k1, v1, Tree23.Leaf)))),
                      /** True, _, EQ */
                      1: () => Maybe().Just(Tuple()(v1, prevZipper(ctxs, Tree23.Two(Tree23.Leaf, k0, v0, Tree23.Leaf)))),
                      /** _, EQ, _ */
                      2: () => (
                        (max => (
                          ((kMax, vMax) => (
                            Maybe().Just(Tuple()(v0, removeMaxNode(List().Cons(Context.ThreeLeft(kMax, vMax, treeM, k1, v1, treeR), ctxs), treeL)))
                          ))(Tuple().fst(max), Tuple().snd(max))
                        ))(maxNode(treeL))
                      ),
                      /** _, _, EQ */
                      3: () => (
                        (max => (
                          ((kMax, vMax) => (
                            Maybe().Just(Tuple()(v0, removeMaxNode(List().Cons(Context.ThreeMiddle(treeL, k0, v0, kMax, vMax, treeR), ctxs), treeM)))
                          ))(Tuple().fst(max), Tuple().snd(max))
                        ))(maxNode(treeM))
                      ),
                      /** _, LT, _ */
                      4: () => down(List().Cons(Context.ThreeLeft(k0, v0, treeM, k1, v1, treeR), ctxs), treeL),
                      /** _, GT, LT */
                      5: () => down(List().Cons(Context.ThreeMiddle(treeL, k0, v0, k1, v1, treeR), ctxs), treeM),
                      /** _, _, _ */
                      6: () => down(List().Cons(Context.ThreeMiddle(treeL, k0, v0, k1, v1, treeR), ctxs), treeM),
                      7: () => undefined,
                    })
                  ))
                ),
              })
            ))({
              /** removeMaxNode :: List (Context k v) -> Tree23 k v -> Partial (Tree23 k v) */
              removeMaxNode: F.define((removeMaxNode, ctxs, tree) => (
                F.assign(() => (
                  Tree23.cata(tree, {
                    Leaf: () => LambdaCase(4, []),
                    Two: (treeL, k0, v0, treeR) => (
                      Tree23.cata(treeL, {
                        Leaf: () => LambdaCase(0, []),
                        Two: () => LambdaCase(1, [treeL, k0, v0, treeR]),
                        Three: () => LambdaCase(1, [treeL, k0, v0, treeR]),
                      })
                    ),
                    Three: (treeL, k0, v0, treeM, k1, v1, treeR) => (
                      Tree23.cata(treeL, {
                        Leaf: () => LambdaCase(2, [k0, v0]),
                        Two: () => LambdaCase(3, [treeL, k0, v0, treeM, k1, v1, treeR]),
                        Three: () => LambdaCase(3, [treeL, k0, v0, treeM, k1, v1, treeR]),
                      })
                    ),
                  })
                ))(lambdaCase => (
                  /** case tree of */
                  LambdaCase.cata(lambdaCase, {
                    /** Two Leaf _ _ Leaf */
                    0: () => up(ctxs, Tree23.Leaf),
                    /** Two treeL k0 v0 treeR */
                    1: (treeL, k0, v0, treeR) => removeMaxNode(List().Cons(Context.TwoRight(treeL, k0, v0), ctxs), treeR),
                    /** Three Leaf k0 v0 Leaf _ _ Leaf */
                    2: (k0, v0) => up(List().Cons(Context.TwoRight(Tree23.Leaf, k0, v0), ctxs), Tree23.Leaf),
                    /** Three left k0 v0 mid k1 v1 right */
                    3: (treeL, k0, v0, treeM, k1, v1, treeR) => removeMaxNode(List().Cons(Context.ThreeRight(treeL, k0, v0, treeM, k1, v1), ctxs), treeR),
                    4: () => undefined,
                  })
                ))
              )),
            })
          ))({
            /** up :: List (Context k v) -> Tree23 k v -> Tree23 k v */
            up: F.define((up, ctxs, tree) => (
              List().cata(ctxs, {
                Nil: () => tree,
                Cons: (ctx, ctxs) => (
                  F.assign(() => (
                    Context.cata(ctx, {
                      TwoLeft: (k0, v0, treeR) => (
                        Tree23.cata(treeR, {
                          Leaf: () => LambdaCase(0, [k0, v0]),
                          Two: (tree0, k1, v1, tree1) => LambdaCase(2, [k0, v0, tree0, k1, v1, tree1, tree]),
                          Three: (tree0, k1, v1, tree1, k2, v2, tree2) => LambdaCase(4, [k0, v0, tree0, k1, v1, tree1, k2, v2, tree2, tree]),
                        })
                      ),
                      TwoRight: (treeL, k0, v0) => (
                        Tree23.cata(treeL, {
                          Leaf: () => LambdaCase(1, [k0, v0]),
                          Two: (tree0, k1, v1, tree1) => LambdaCase(3, [k0, v0, tree0, k1, v1, tree1, tree]),
                          Three: (tree0, k1, v1, tree1, k2, v2, tree2) => LambdaCase(5, [k0, v0, tree0, k1, v1, tree1, k2, v2, tree2, tree]),
                        })
                      ),
                      ThreeLeft: (k0, v0, treeM, k1, v1, treeR) => (
                        Tree23.cata(treeM, {
                          Leaf: () => LambdaCase(6, [k0, v0, k1, v1]),
                          Two: (tree0, k2, v2, tree1) => LambdaCase(9, [k0, v0, k1, v1, treeR, tree0, k2, v2, tree1, tree]),
                          Three: (tree0, k2, v2, tree1, k3, v3, tree2) => LambdaCase(13, [k0, v0, k1, v1, treeR, tree0, k2, v2, tree1, k3, v3, tree2, tree]),
                        })
                      ),
                      ThreeMiddle: (treeL, k0, v0, k1, v1, treeR) => (
                        Tree23.cata(treeL, {
                          Leaf: () => LambdaCase(7, [k0, v0, k1, v1]),
                          Two: (tree0, k2, v2, tree1) => LambdaCase(10, [k0, v0, k1, v1, treeR, tree0, k2, v2, tree1, tree]),
                          Three: (tree0, k2, v2, tree1, k3, v3, tree2) => LambdaCase(14, [k0, v0, k1, v1, treeR, tree0, k2, v2, tree1, k3, v3, tree2, tree]),
                        })
                      ),
                      ThreeRight: (treeL, k0, v0, treeM, k1, v1) => (
                        Tree23.cata(treeM, {
                          Leaf: () => LambdaCase(8, [k0, v0, k1, v1]),
                          Two: (tree0, k2, v2, tree1) => LambdaCase(12, [treeL, k0, v0, k1, v1, tree0, k2, v2, tree1, tree]),
                          Three: (tree0, k2, v2, tree1, k3, v3, tree2) => LambdaCase(16, [treeL, k0, v0, k1, v1, tree0, k2, v2, tree1, k3, v3, tree2, tree]),
                        })
                      ),
                    })
                  ))(lambdaCase => (
                    /** case ctx, tree of */
                    LambdaCase.cata(lambdaCase, {
                      /** TwoLeft k0 v0 Leaf, Leaf */
                      0: (k0, v0) => prevZipper(ctxs, Tree23.Two(Tree23.Leaf, k0, v0, Tree23.Leaf)),
                      /** TwoRight Leaf k0 v0, Leaf */
                      1: (k0, v0) => prevZipper(ctxs, Tree23.Two(Tree23.Leaf, k0, v0, Tree23.Leaf)),
                      /** TwoLeft k0 v0 (Two treeM k1 v1 treeR), treeL */
                      2: (k0, v0, treeM, k1, v1, treeR, treeL) => up(ctxs, Tree23.Three(treeL, k0, v0, treeM, k1, v1, treeR)),
                      /** TwoRight (Two treeL k0 v0 treeM) k1 v1, treeR */
                      3: (k0, v0, treeL, k1, v1, treeM, treeR) => up(ctxs, Tree23.Three(treeL, k0, v0, treeM, k1, v1, treeR)),
                      /** TwoLeft k0 v0 (Three tree1 k1 v1 tree2 k2 v2 tree3), tree0 */
                      4: (k0, v0, tree1, k1, v1, tree2, k2, v2, tree3, tree0) => prevZipper(ctxs, Tree23.Two(Tree23.Two(tree0, k0, v0, tree1), k1, v1, Tree23.Two(tree2, k2, v2, tree3))),
                      /** TwoRight (Three tree0 k0 v0 tree1 k1 v1 tree2) k2 v2, tree3 */
                      5: (k2, v2, tree0, k0, v0, tree1, k1, v1, tree2, tree3) => prevZipper(ctxs, Tree23.Two(Tree23.Two(tree0, k0, v0, tree1), k1, v1, Tree23.Two(tree2, k2, v2, tree3))),
                      /** ThreeLeft k0 v0 Leaf k1 v1 Leaf, Leaf */
                      6: (k0, v0, k1, v1) => prevZipper(ctxs, Tree23.Three(Tree23.Leaf, k0, v0, Tree23.Leaf, k1, v1, Tree23.Leaf)),
                      /** ThreeMiddle Leaf k0 v0 k1 v1 Leaf, Leaf */
                      7: (k0, v0, k1, v1) => prevZipper(ctxs, Tree23.Three(Tree23.Leaf, k0, v0, Tree23.Leaf, k1, v1, Tree23.Leaf)),
                      /** ThreeRight Leaf k0 v0 Leaf k1 v1, Leaf */
                      8: (k0, v0, k1, v1) => prevZipper(ctxs, Tree23.Three(Tree23.Leaf, k0, v0, Tree23.Leaf, k1, v1, Tree23.Leaf)),
                      /** ThreeLeft k0 v0 (Two tree1 k1 v1 tree2) k2 v2 tree3, tree0 */
                      9: (k0, v0, k2, v2, tree3, tree1, k1, v1, tree2, tree0) => prevZipper(ctxs, Tree23.Two(Tree23.Three(tree0, k0, v0, tree1, k1, v1, tree2), k2, v2, tree3)),
                      /** ThreeMiddle (Two tree0 k0 v0 tree1) k1 v1 k2 v2 tree3, tree2 */
                      10: (k1, v1, k2, v2, tree3, tree0, k0, v0, tree1, tree2) => prevZipper(ctxs, Tree23.Two(Tree23.Three(tree0, k0, v0, tree1, k1, v1, tree2), k2, v2, tree3)),
                      /** ThreeMiddle tree0 k0 v0 k1 v1 (Two tree2 k2 v2 tree3), tree1 */
                      11: (tree0, k0, v0, k1, v1, tree2, k2, v2, tree3, tree1) => prevZipper(ctxs, Tree23.Two(tree0, k0, v0, Tree23.Three(tree1, k1, v1, tree2, k2, v2, tree3))),
                      /** ThreeRight tree0 k0 v0 (Two tree1 k1 v1 tree2) k2 v2, tree3 */
                      12: (tree0, k0, v0, k2, v2, tree1, k1, v1, tree2, tree3) => prevZipper(ctxs, Tree23.Two(tree0, k0, v0, Tree23.Three(tree1, k1, v1, tree2, k2, v2, tree3))),
                      /** ThreeLeft k0 v0 (Three tree1 k1 v1 tree2 k2 v2 tree3) k3 v3 tree4, tree0 */
                      13: (k0, v0, k3, v3, tree4, tree1, k1, v1, tree2, k2, v2, tree3, tree0) => prevZipper(ctxs, Tree23.Three(Tree23.Two(tree0, k0, v0, tree1), k1, v1, Tree23.Two(tree2, k2, v2, tree3), k3, v3, tree4)),
                      /** ThreeMiddle (Three tree0 k0 v0 tree1 k1 v1 tree2) k2 v2 k3 v3 tree4, tree3 */
                      14: (k2, v2, k3, v3, tree4, tree0, k0, v0, tree1, k1, v1, tree2, tree3) => prevZipper(ctxs, Tree23.Three(Tree23.Two(tree0, k0, v0, tree1), k1, v1, Tree23.Two(tree2, k2, v2, tree3), k3, v3, tree4)),
                      /** ThreeMiddle tree0 k0 v0 k1 v1 (Three tree2 k2 v2 tree3 k3 v3 tree4), tree1 */
                      15: (tree0, k0, v0, k1, v1, tree2, k2, v2, tree3, k3, v3, tree4, tree1) => prevZipper(ctxs, Tree23.Three(tree0, k0, v0, Tree23.Two(tree1, k1, v1, tree2), k2, v2, Tree23.Two(tree3, k3, v3, tree4))),
                      /** ThreeRight tree0 k0 v0 (Three tree1 k1 v1 tree2 k2 v2 tree3) k3 v3, tree4 */
                      16: (tree0, k0, v0, k3, v3, tree1, k1, v1, tree2, k2, v2, tree3, tree4) => prevZipper(ctxs, Tree23.Three(tree0, k0, v0, Tree23.Two(tree1, k1, v1, tree2), k2, v2, Tree23.Two(tree3, k3, v3, tree4))),
                    })
                  ))
                ),
              })
            )),
            /** maxNode :: Tree23 k v => Partial (Tuple k v) */
            maxNode: F.define((maxNode, tree) => (
              Tree23.cata(tree, {
                Leaf: () => undefined,
                Two: (_, k0, v0, treeR) => (
                  Tree23.cata(treeR, {
                    Leaf: () => Tuple()(k0, v0),
                    Two: () => maxNode(treeR),
                    Three: () => maxNode(treeR),
                  })
                ),
                Three: (_0, _1, _2, _3, k0, v0, treeR) => (
                  Tree23.cata(treeR, {
                    Leaf: () => Tuple()(k0, v0),
                    Two: () => maxNode(treeR),
                    Three: () => maxNode(treeR),
                  })
                ),
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
    F.assign(() => (
      Functor.map(Tuple().snd)(Tree23.pop(k, tree))
    ))(maybe => (
      Maybe().cata(maybe, {
        Just: F.identity,
        Nothing: () => tree,
      })
    ))
  ));

  /** fromFoldable :: Foldable f => f a -> Tree23 a a */
  Tree23.fromFoldable = foldable => Foldable.foldl((tree, a) => Tree23.insert(a, a, tree), Tree23.Leaf, foldable);

  return Tree23;
};

module.exports = {
  default: Tree23,
  Tree23,
};