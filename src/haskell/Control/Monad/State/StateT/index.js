/**
 * newtype StateT s m a = StateT (s -> m (Tuple a s))
 * 
 * Functor m => Functor (StateT s m)
 * Monad m => Applicative (StateT s m)
 * Monad m => Bind (StateT s m)
 * Monad m => Monad (StateT s m)
 * Monad m => Apply (StateT s m)
 * Monad m => MonadState s (StateT s m)
 */

let {taggedSum} = require('../../../../daggy');
let {curry} = require('../../../../curry');
let {compose} = require('../../../../compose');
let {Bifunctor} = require('../../../../Data/Bifunctor');
let {Monad} = require('../..');
let {MonadState} = require('../MonadState');
let {Function:F} = require('../../../../Data/Function');
let {Tuple} = require('../../../../Data/Tuple');

const StateT = (s, m, a) => {
  /** StateT :: Type -> Type -> Type -> Type */
  let StateT = {};
  StateT = taggedSum('StateT', {
    /** _ :: (s -> m (Tuple a s)) -> StateT s m a */
    _: ['f'],
  });
  StateT.prototype.constructor = StateT;

  /** lift :: (s -> m (Tuple a s)) -> StateT s m a */
  StateT.lift = f => StateT._(f);

  /** unlift :: StateT s m a -> s -> m (Tuple a s) */
  StateT.unlift = state => state.f;
  /** unlift :: StateT s m a ~> Unit -> s -> m (Tuple a s) */
  StateT.prototype.unlift = function() {return StateT.unlift(this)};

  /** run :: StateT s m a -> s -> m (Tuple a s) */
  StateT.run = curry((state, s) => StateT.unlift(state)(s));
  /** run :: StateT s m a ~> s -> m (Tuple a s) */
  StateT.prototype.run = function(s) {return StateT.run(this, s)};

  /** eval :: Functor m => StateT s m a -> s -> m a */
  StateT.eval = curry((state, s) => (
    state.run(s).map(Tuple().fst)
  ));
  /** eval :: Functor m => StateT s m a ~> s -> m a */
  StateT.prototype.eval = function(s) {return StateT.eval(this, s)};

  /** exec :: Functor m => StateT s m a -> s -> m s */
  StateT.exec = curry((state, s) => (
    state.run(s).map(Tuple().snd)
  ));
  /* exec :: Functor m => StateT s m a ~> s -> m s */
  StateT.prototype.exec = function(s) {return StateT.exec(this, s)};

  /** map :: Functor m => Functor (StateT s m) => (a -> b) -> StateT s m a -> StateT s m b */
  StateT.map = curry((f, stateA) => (
    StateT.lift(s => stateA.run(s).map(Bifunctor.lmap(f)))
  ));
  /** map :: Functor m => Functor (StateT s m) => StateT s m a ~> (a -> b) -> StateT s m b */
  StateT.prototype.map = function(f) {return StateT.map(f, this)};

  /** pure :: Monad m => Applicative (StateT s m) => a -> StateT s m a */
  StateT.pure = a => StateT.lift(s => m.pure(Tuple().lift(a, s)));

  /** bind :: Monad m => Bind (StateT s m) => StateT s m a -> (a -> StateT s m b) -> StateT s m b */
  StateT.bind = curry((stateA, f) => (
    StateT.lift(s => (
      stateA.run(s)
        .bind(tupleAS => (
          ((a, s) => (
            f(a).run(s)
          ))(tupleAS.fst(), tupleAS.snd())
        ))
    ))
  ));
  /** bind :: Monad m => Bind (StateT s m) => StateT s m a ~> (a -> StateT s m b) -> StateT s m b */
  StateT.prototype.bind = function(f) {return StateT.bind(this, f)};

  /** ap :: Monad m => Apply (StateT s m) => StateT s m (a -> b) -> StateT s m a -> StateT s m b */
  StateT.ap = Monad.apDefault0;
  /** ap :: Monad m => Apply (StateT s m) => StateT s m a ~> StateT s m (a -> b) -> StateT s m b */
  StateT.prototype.ap = function(stateF) {return StateT.ap(stateF, this)};

  /** state :: Monad m => MonadState s (StateT s m) => (s -> (Tuple a s)) -> StateT s m a */
  StateT.state = f => (
    StateT.lift(m.pure.compose(f))
  );

  /** get :: Monad m => MonadState s (StateT s m) => typeof m -> StateT s m s */
  StateT.get = undefined;
  /** gets :: Monad m => MonadState s (StateT s m) => typeof m -> (s -> a) -> StateT s m a */
  StateT.gets = undefined;
  /** put :: Monad m => MonadState s (StateT s m) => s -> StateT s m Unit */
  StateT.put = undefined;
  /** modify :: Monad m => MonadState s (StateT s m) => (s -> s) -> StateT s m s */
  StateT.modify = undefined;
  /** modify_ :: Monad m => MonadState s (StateT s m) => (s -> s) -> StateT s m Unit */
  StateT.modify_ = undefined;

  StateT = compose(
    MonadState.MonadState,
  )(StateT);

  return StateT;
};

module.exports = {
  default: StateT,
  StateT,
};