import { createSlice } from '@reduxjs/toolkit'

import { User } from '@/models/User'

type UserState = {
  user?: User
}

type UserSlice = {
  user: UserState
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: undefined,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = undefined
    },
  },
})

export const { login, logout } = userSlice.actions

export const selectUser = (state: UserSlice) => state.user.user

export default userSlice.reducer
