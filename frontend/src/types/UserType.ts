export interface User {
    firstName: string;
    email: string;
    _id: string;
    image: string;
    role: "user" | "admin";
    authProvider: "jwt" | "google";
    enrolledCourses: string[];
  }
  
  /* User can be null. need to check for null so type used. TS default knows storage type.storage is stringify before storage so all values will be string so can check for all value for null. later JSON.parse value by data type */
  export type UserType = User | null;