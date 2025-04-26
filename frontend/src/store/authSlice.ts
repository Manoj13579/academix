import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserType } from '../types/UserType'


// this slice just for socket in app.tsx. sessionStorage for making value in page refresh available
const storedUser = sessionStorage.getItem('user')
const user: UserType | null = storedUser ? JSON.parse(storedUser) : null

interface AuthState {
  data: UserType | null
}

const initialState: AuthState = {
  data: user,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserType>) => {
      state.data = action.payload
    },
    logout: (state) => {
      state.data = null
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer