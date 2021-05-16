const Eq = require('./Data/Eq').default;
const Semiring = require('./Data/Semiring').default;
const Ring = require('./Data/Ring').default;
const Semigroup = require('./Data/Semigroup').default;
const Monoid = require('./Data/Monoid').default;
const Additive = require('./Data/Monoid/Additive').default;
const Functor = require('./Data/Functor').default;
const FunctorWithIndex = require('./Data/FunctorWithIndex').default;
const Bifunctor = require('./Data/Bifunctor').default;
const Apply = require('./Control/Apply').default;
const FoldableWithIndex = require('./Data/FoldableWithIndex').default;
const Applicative = require('./Control/Applicative').default;
const Bind = require('./Control/Bind').default;
const Category = require('./Control/Category').default;
const Monad = require('./Control/Monad').default;
const MonadState = require('./Control/Monad/State/MonadState').default;
const Semigroupoid = require('./Control/Semigroupoid').default;
const Biapply = require('./Control/Biapply').default;
const Biapplicative = require('./Control/Biapplicative').default;
const TraversableWithIndex = require('./Data/TraversableWithIndex').default;

const Show = require('./Data/Show').default;
const String = require('./Data/String/extension').default;
const Unit = require('./Data/Unit').default;
const Foldable = require('./Data/Foldable').default;
const Traversable = require('./Data/Traversable').default;
const Json = require('./Data/Json').default;
const Array_ = require('./Data/Array/_').default;
const Bool = require('./Data/Bool').default;
const Ordering = require('./Data/Ordering').default;
const Ord = require('./Data/Ord').default;
const Maybe = require('./Data/Maybe').default;
const Number = require('./Data/Number').default;
const Int = require('./Data/Int').default;
const F = require('./Data/Function').default;
const Array = require('./Data/Array').default;
const Tuple = require('./Data/Tuple').default;
const List = require('./Data/List').default;
const Deque = require('./Data/Deque').default;
const Tree23 = require('./Data/Tree23').default;
const StateT = require('./Control/Monad/State/StateT').default;
const Object = require('./Data/Object').default;
const Either = require('./Data/Either').default;
const Error = require('./Effect/Error').default;
const AsyncEffect = require('./Effect/AsyncEffect').default;
const Effect = require('./Effect').default;
const Aff = require('./Effect/Aff').default;
const Eff = require('./Effect/Eff').default;
const Random = require('./Effect/Random').default;

const Haskell = {
  Control: {
    Applicative: {
      default: Applicative,
    },
    Apply: {
      default: Apply,
    },
    Biapplicative: {
      default: Biapplicative,
    },
    Biapply: {
      default: Biapply,
    },
    Bind: {
      default: Bind,
    },
    Category: {
      default: Category,
    },
    Monad: {
      default: Monad,
      State: {
        MonadState: {
          default: MonadState,
        },
        StateT: {
          default: StateT,
        },
      },
    },
    Semigroupoid: {
      default: Semigroupoid,
    },
  },
  Data: {
    Array: {
      default: Array,
    },
    Array_: {
      default: Array_,
    },
    Bifunctor: {
      default: Bifunctor,
    },
    Bool: {
      default: Bool,
    },
    Deque: {
      default: Deque,
    },
    Either: {
      default: Either,
    },
    Eq: {
      default: Eq,
    },
    Foldable: {
      default: Foldable,
    },
    FoldableWithIndex: {
      default: FoldableWithIndex,
    },
    Function: {
      default: F,
    },
    Functor: {
      default: Functor,
    },
    FunctorWithIndex: {
      default: FunctorWithIndex,
    },
    Int: {
      default: Int,
    },
    Json: {
      default: Json,
    },
    List: {
      default: List,
    },
    Maybe: {
      default: Maybe,
    },
    Monoid: {
      default: Monoid,
      Additive: {
        default: Additive,
      },
    },
    Number: {
      default: Number,
    },
    Object: {
      default: Object,
    },
    Ord: {
      default: Ord,
    },
    Ordering: {
      default: Ordering,
    },
    Ring: {
      default: Ring,
    },
    Semigroup: {
      default: Semigroup,
    },
    Semiring: {
      default: Semiring,
    },
    Show: {
      default: Show,
    },
    String: {
      default: String,
    },
    Traversable: {
      default: Traversable,
    },
    TraversableWithIndex: {
      default: TraversableWithIndex,
    },
    Tree23: {
      default: Tree23,
    },
    Tuple: {
      default: Tuple,
    },
    Unit: {
      default: Unit,
    },
  },
  Effect: {
    default: Effect,
    Aff: {
      default: Aff,
    },
    AsyncEffect: {
      default: AsyncEffect,
    },
    Eff: {
      default: Eff,
    },
    Error: {
      default: Error,
    },
    Random: {
      default: Random,
    },
  },
};

module.exports = Haskell;