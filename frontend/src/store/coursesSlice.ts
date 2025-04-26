import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import statusCode from "../utils/statusCode";
import axios from "axios";
import { Course } from "../types/dummyCoursesType";



const initialState = {
    data: [] as Course[],
    status: statusCode.IDLE,
}
const getCourses = createAsyncThunk('courses/get', async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/course/get-all-courses`);
        
        return response.data.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
});

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCourses.pending, (state) => {
                state.status = statusCode.LOADING;
            })
            .addCase(getCourses.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = statusCode.IDLE;
            })
            .addCase(getCourses.rejected, (state) => {
                state.status = statusCode.ERROR;
            });
    }
});

export { getCourses };
export default coursesSlice.reducer;
