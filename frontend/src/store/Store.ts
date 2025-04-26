import { configureStore } from "@reduxjs/toolkit";
import currencySlice from "./currencySlice";
import coursesSlice from "./coursesSlice";
import authSlice from "./authSlice";
import socketSlice from "./socketSlice";



const store = configureStore({
  reducer: {
    currency: currencySlice,
    courses: coursesSlice,
    auth: authSlice,
    socket: socketSlice,
  },
  /*This disables the warning for:socket/setSocket action, socket.socket state path for deserialize warning for socket from redux.Everything else remains protected by Redux Toolkit’s serializability checks. this can be used for deserilization warning for audio, time etc. */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["socket/setSocket"],
        ignoredPaths: ["socket.socket"],
      },
    }),
});
//The entire Redux state is an object that contains different slices of state.
// for typechecking in useSelector
export type RootState = ReturnType<typeof store.getState>;
// for typechecking in dispatch
export type AppDispatch = typeof store.dispatch;

export default store;