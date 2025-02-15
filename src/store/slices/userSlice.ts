import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userId: string | null;
  username: string | null;
  role : string | null
}

const initialState: UserState = {
  userId: null,
  username: null,
  role : null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ userId: string; username: string ; role : string }>) => {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.role = action.payload.role
    },
    Logout: (state) => {
      state.userId = null;
      state.username = null;
      state.role = null
    },
  },
});

export const { setUser, Logout } = userSlice.actions;
export default userSlice.reducer;
