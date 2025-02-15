export interface Quiz {
    quizz_id: string;
    title: string;
    description?: string;
    article?:string
    user:any,
    class:any,
    subject:any,
    userId:string
    quizz:any
    time:number
    answer:any
    created_at: Date;
    updated_at: Date;
    
    
  }


  export interface CreateQuizzrDto {
    title: string;
    description: string; 
    time: number; 
    userId?: string; 
    classId?:string
    subjectId?:string
    article:string,
    
  }


  export interface UpdateQuizDto {
    title: string;
    description: string; 
    time: number; 
    userId?: string; 
    classId?:string
    subjectId?:string
    article?:string
    
  }
  
 