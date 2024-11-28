export interface Quiz {
    quizz_id: string;
    title: string;
    description?: string;
    user:any,
    userId:string
    quizz:any
    time:number
    created_at: Date;
    updated_at: Date;
  }


  export interface CreateQuizzrDto {
    title: string;
    description: string; 
    time: number; 
    userId?: string; 
    
  }


  export interface UpdateQuizDto {
    title: string;
    description: string; 
    time: number; 
    userId?: string; 
    
  }
  
 