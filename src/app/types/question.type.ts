export interface Question {
    question_text: string;
    question_type: QuestionType;
    quizzId: string;
    media_url?: string;
   
  }
  
  
  export enum QuestionType {
    audio_guess = "audio_guess",
    multiple_choice = "multiple_choice",
    drag_drop = "drag_drop",
  }
  
