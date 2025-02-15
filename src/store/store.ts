import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import quizReducer from "./slices/quizSlice"
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Lưu vào localStorage
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage, // Sử dụng localStorage để lưu Redux state
};

const rootReducer = combineReducers({
  user: userReducer,
  quiz: quizReducer,
  
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Bỏ kiểm tra tuần tự hóa
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
