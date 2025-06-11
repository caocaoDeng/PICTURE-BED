import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import repoReducer from './repo'
import commonReducer from './common'

const store = configureStore({
  reducer: {
    user: userReducer,
    repo: repoReducer,
    common: commonReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
