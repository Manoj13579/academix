import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrencyState {
    data: string;
}

const initialState: CurrencyState = {
    data: "$",
};

const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {
        //  PayloadAction is generics provided by redux toolkit
        setCurrency: (state, action: PayloadAction<string>) => {
            state.data = action.payload;
        },
    },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;