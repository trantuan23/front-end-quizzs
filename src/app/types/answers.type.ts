export interface Answerstype {
  answer_id: string
  questionId: string;
  answer_text: string;
  is_correct: boolean;
  data: any; // Assuming this is nullable
  questionts: string;
  question: any,
  reason: string
}

type Answers = {
  answer_id: string;
  answer_text: string;
  is_correct: boolean;
  reason: string;
  data: string;
  questionId: string;
};










