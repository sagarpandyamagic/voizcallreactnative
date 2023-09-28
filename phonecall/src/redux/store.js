import {configureStore} from '@reduxjs/toolkit'
import sipSlice from './sipSlice';


export const store = configureStore({
    reducer: {
      sip:sipSlice, 
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  })
  
export default store;