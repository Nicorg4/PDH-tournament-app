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
  role: string;
  money: number;
  picture: string;
}

interface UserState {
  user: UserData | null;
  token: string | null;
}

const initialState: UserState = {
  user: typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: typeof window !== 'undefined' && localStorage.getItem('token') ? localStorage.getItem('token') : null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      typeof window !== 'undefined' && localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      typeof window !== 'undefined' && localStorage.setItem('token', action.payload);
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      typeof window !== 'undefined' && localStorage.removeItem('user');
      typeof window !== 'undefined' && localStorage.removeItem('token');
    },
    setMoney: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.money = action.payload;
        typeof window !== 'undefined' && localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
});

export const { setUser, setLogout, setMoney, setToken } = userSlice.actions;
export default userSlice.reducer;