import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlicer from "./userSlicer";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import postSlicer from "./postSlicer";
import chatSlicer from "./chatSlicer";

let persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: userSlicer,
  frame: postSlicer,
  chat: chatSlicer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  
});

const persistor = persistStore(store);

export { store, persistor };
