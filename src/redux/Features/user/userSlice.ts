'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Team {
  id: number;
  name: string;
  logo: string;
  owner_id: number;
}

export interface UserData {
  username: string;
  team: Team;
  picture: string;
}

interface UserState {
  user: UserData | null;
}

const initialState: UserState = {
  user: typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      typeof window !== 'undefined' && localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setLogout: (state) => {
      state.user = null;
      typeof window !== 'undefined' && localStorage.removeItem('user');
    },
  },
});

export const { setUser, setLogout } = userSlice.actions;
export default userSlice.reducer;