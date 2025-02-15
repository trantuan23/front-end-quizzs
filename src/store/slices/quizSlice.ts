import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface QuizState {
  quizId: string | null;
}

const initialState: QuizState = {
  quizId: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizId: (state, action: PayloadAction<string>) => {
      state.quizId = action.payload;
    },
    clearQuizId: (state) => {
      state.quizId = null;
    },
  },
});

export const { setQuizId, clearQuizId } = quizSlice.actions;
export default quizSlice.reducer;
