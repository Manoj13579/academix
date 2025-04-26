import { User } from "./UserType";

// no need to use export for use in same file but good so we can use in other files
export interface Lecture {
    lectureId: string;
    lectureTitle: string;
    lectureDuration: number;
    lectureUrl: string;
    isPreviewFree: boolean;
    lectureOrder: number;
  }
  
  export interface Chapter {
    chapterId: string;
    chapterOrder: number;
    chapterTitle: string;
    chapterContent: Lecture[];
  }
  
  export interface CourseRating {
    userId: string;
    rating: number;
    _id: string;
  }
  /* Interfaces describe objects not arrays so interface Course as object here but array declared in variable course where it is used. others like Chapter[] used here but in above interface described as object. can't use Chapter[{...}] here */
  /* The Course[] means an array of Course objects. so here described as object n used as Course[] in declaring type so works for array with multiple objects */
  export interface Course {
    _id: string;
    courseTitle: string;
    courseDescription: string;
    coursePrice: number;
    isPublished: boolean;
    discount: number;
    courseContent: Chapter[];
    educator: User;
    enrolledStudents: string[];
    courseRating: CourseRating[];
    createdAt: string;
    updatedAt: string;
    courseThumbnail: string;
  }