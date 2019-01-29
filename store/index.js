// Module imports
import {
  createStore,
  applyMiddleware,
} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { applyWorker } from 'redux-worker'
import thunkMiddleware from 'redux-thunk'





// Component imports
import * as actions from './actions'
import defaultState from './initialState'
import reducer from './reducers'
import { isBrowser } from '../helpers'





const initStore = (initialState = defaultState) => {
  let reduxComposition = null

  if (isBrowser()) {
    const reductionWorker = new (require('./redux.worker.js'))

    reduxComposition = composeWithDevTools(
      applyMiddleware(thunkMiddleware),
      applyWorker(reductionWorker)
    )
  } else {
    reduxComposition = composeWithDevTools(applyMiddleware(thunkMiddleware))
  }

  return createStore(reducer, initialState, reduxComposition)
}

export {
  actions,
  initStore,
}
