import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { WritableDraft } from "immer";
/* WritableDraft<Socket> | null; in  action.payload used for ts coz with Redux Toolkit when using external types like Socket (from socket.io-client), especially since Socket instances are class-based and not always draftable by Immer. */
interface SocketState {
  socket: Socket | null;
}

const initialState: SocketState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<Socket | null>) => {
      state.socket = action.payload as WritableDraft<Socket> | null;
    },
  },
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
