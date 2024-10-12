
export enum UserRole {
    STUDENT = 'student',
    TEACHER = 'teacher',
    ADMIN = 'admin',
  }
  
  export interface Class {
    class_id: string;
    class_name: string;
  }
  
  export interface User {
    user_id: string;
    username: string;
    email: string;
    role: UserRole;
    created_at: string; 
    class?: Class;
  }
  
  export interface CreateUserDto {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    classId?: string;
  }
  
  export interface UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    classId?: string;
  }
  