import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerCartReducer from "./slices/cartSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        customerCart:customerCartReducer,
    },
});

export default store;
