// Module imports
import { createWorker } from 'redux-worker'





// Local imports
import reducer from './reducers'





const worker = createWorker()

worker.registerReducer(reducer)
