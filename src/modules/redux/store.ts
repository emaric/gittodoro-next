import { configureStore } from '@reduxjs/toolkit'

import userReducer from '@/modules/redux/features/userSlice'
import durationReducer from '@/modules/redux/features/durationSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    duration: durationReducer,
  },
})
