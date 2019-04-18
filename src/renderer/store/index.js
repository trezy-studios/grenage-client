// Moduel imports
import {
  configureStore,
  getDefaultMiddleware,
} from 'redux-starter-kit'
import isDevelopment from 'electron-is-dev'
import logger from 'redux-logger'
import thunk from 'redux-thunk'





// Local imports
import * as actions from './actions'
import rootReducer from './reducers'
import initialState from './initialState'





// Local constants
let store = null





const initStore = preloadedState => {
  if (!store) {
    store = configureStore({
      middleware: [thunk, logger],
      preloadedState: initialState,
      reducer: rootReducer,
    })
  }

  if (isDevelopment && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}



export {
  actions,
  initStore,
}
