import { configureStore } from '@reduxjs/toolkit'

import userReducer from '@/modules/redux/features/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})
