import { createSlice } from '@reduxjs/toolkit'

import { Session } from '@/models/Session'
import { Record } from '@/models/Record'
import { Clock } from '@/models/Clock'

type ClockState = {
  clock: Clock
  sessions: Session[]
  records: Record[]
}

type SessionState = {
  clocks: ClockState[]
}

type SessionSlice = {
  clocks: SessionState
}

export const sessionSlice = createSlice({
  name: 'sessions',
  initialState: {
    clocks: [],
  },
  reducers: {
    set: (state, action) => {
      state.clocks = action.payload
    },
    clear: (state) => {
      state.clocks = []
    },
  },
})

export const { set, clear } = sessionSlice.actions

export const selectClocks = (state: SessionSlice) => state.clocks?.clocks

export default sessionSlice.reducer
