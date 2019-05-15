// Module imports
import ElectronStore from 'electron-store'





// Local imports
// import localStoreSchema from './localStoreSchema'





// Local constants
const localStore = new ElectronStore // ({ schema: localStoreSchema })





const localStoreMiddleware = store => next => action => {
  const result = next(action)

  localStore.set('state', store.getState())

  return result
}





export { localStoreMiddleware }
