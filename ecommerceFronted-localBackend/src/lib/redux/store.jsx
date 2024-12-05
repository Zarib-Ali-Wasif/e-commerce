import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // This uses localStorage by default
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import productsReducer from "./slices/productsSlice";

// Persist configuration
const persistConfig = {
  key: "root", // This is the key under which all the persisted data will be saved in localStorage
  storage, // The storage mechanism (localStorage by default)
  whitelist: ["cart", "cartSummary", "productsList"], // Specify which slices to persist (cart, productsList, and cartSummary in your case)
};

// Wrap the cartReducer and productsReducer with persistReducer to enable persistence
const persistedCartReducer = persistReducer(persistConfig, cartReducer);
const persistedProductsReducer = persistReducer(persistConfig, productsReducer);

// Configure the Redux store with both auth and persisted cart reducers
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: persistedCartReducer, // Persisted cart reducer
    products: persistedProductsReducer, // Persisted cart reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializableCheck temporarily
    }),
});

// Create a persistor to handle rehydration and state persistence
const persistor = persistStore(store);

export { store, persistor };
