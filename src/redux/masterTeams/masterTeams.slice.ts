import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IMasterTeamsSliceState {
  masterTeams: unknown[]
  limit: number
  offset: number
  total: number
  ordering: string | null
  createdRecordsNames: string[]
  deletedRecordsErrors: []
  tableRecords: []
  duplicates: []
  orderBy: string | null
}

const masterTeamsSliceState: IMasterTeamsSliceState = {
  masterTeams: [
    {
      id: '123',
      name: 'Sky',
      admin: 'Joe Doe',
      adminEmail: 'joedoe@example.com',
      headCoach: 'John Appleseed',
      headCoachEmail: 'jappleseed@example.com',
      leagues: 'league1, league2, league3, league4',
    },
    {
      id: '1234',
      name: 'Dog',
      admin: 'Mike Orthon',
      adminEmail: 'mikeo@example.com',
      headCoach: 'Kevin Li',
      headCoachEmail: 'keli@example.com',
      leagues: 'league1, league2, league3, league4',
    },
  ],
  limit: 10,
  offset: 0,
  total: 0,
  ordering: null,
  deletedRecordsErrors: [],
  tableRecords: [],
  createdRecordsNames: [],
  duplicates: [],
  orderBy: null,
}

export const masterTeamsSlice = createSlice({
  name: 'masterTeamsSlice',
  initialState: masterTeamsSliceState,
  reducers: {
    setPaginationParams: (
      state,
      action: PayloadAction<{
        limit: number
        offset: number
        ordering: string | null
      }>,
    ) => {
      state.limit = action.payload.limit
      state.offset = action.payload.offset
      state.ordering = action.payload.ordering
    },
    removeCreatedRecordsNames: (state) => {
      state.createdRecordsNames = []
    },
  },
  extraReducers: (builder) => builder,
})

