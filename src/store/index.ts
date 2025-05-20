import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user'
import repoReducer from './repo'

const store = configureStore({
  reducer: {
    user: userReducer,
    repo: repoReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
