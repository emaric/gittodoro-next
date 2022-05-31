import { createSlice } from '@reduxjs/toolkit'

import { Duration } from '@/models/Duration'

type DurationState = {
  default?: Duration
}

type DurationSlice = {
  duration: DurationState
}

export const durationSlice = createSlice({
  name: 'duration',
  initialState: {
    default: undefined,
  },
  reducers: {
    setDefault: (state, action) => {
      state.default = action.payload
    },
  },
})

export const { setDefault } = durationSlice.actions

export const selectDuration = (state: DurationSlice) => state.duration.default

export default durationSlice.reducer
