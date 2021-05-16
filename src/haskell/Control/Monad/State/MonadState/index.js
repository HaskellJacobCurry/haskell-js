/**
 * class Monad m <= MonadState s m | m -> s where
 *  state :: (s -> (Tuple a s)) -> m a
 * get :: m s
 * gets :: (s -> a) -> m a
 * put :: s -> m Unit
 * modify :: (s -> s) -> m s
 * modify_ :: (s -> s) -> m Unit
 */

let {compose} = require('../../../../compose');
let {Unit} = require('../../../../Data/Unit');
let {Tuple} = require('../../../../Data/Tuple');

const MonadState = {};

/** state :: Monad m => MonadState s m => typeof m -> (s -> (Tuple a s)) -> m s */
MonadState.state = (MonadState) => MonadState.state;

/** get :: Monad m => MonadState s m => typeof m -> m s */
MonadState.get = (MonadState) => (
  MonadState.state(s => Tuple().lift(s, s))
);

/** gets :: Monad m => MonadState s m => typeof m -> (s -> a) -> m a */
MonadState.gets = (MonadState) => f => (
  MonadState.state(s => Tuple().lift(f(s), s))
);

/** put :: Monad m => MonadState s m => typeof m -> s -> m Unit */
MonadState.put = (MonadState) => (
  s => MonadState.state(() => Tuple().lift(Unit.lift(), s))
);

/** modify :: Monad m => MonadState s m => typeof m -> (s -> s) -> m s */
MonadState.modify = (MonadState) => (
  f => MonadState.state(s => (s => Tuple().lift(s, s))(f(s)))
);

/** modify_ :: Monad m => MonadState s m => typeof m -> (s -> s) -> m Unit */
MonadState.modify_ = (MonadState) => (
  f => MonadState.state(s => (s => Tuple().lift(Unit.lift(), s))(f(s)))
);

MonadState['MonadState'] = compose(
  M => (
    M.get = MonadState.get(M),
    M
  ),
  M => (
    M.gets = MonadState.gets(M),
    M
  ),
  M => (
    M.put = MonadState.put(M),
    M
  ),
  M => (
    M.modify = MonadState.modify(M),
    M
  ),
  M => (
    M.modify_ = MonadState.modify_(M),
    M
  ),
);

module.exports = {
  default: MonadState,
  MonadState,
};