import { Course } from "../types/dummyCoursesType";


/* this function used for one course only that's why Course if multiple course object then should be Course[].
 this function will be used in map so one course object n multiple rating inside this handled by forEach. although courseRatings is array of objects we don't need to declare it's type once Course type is declared coz it's inside it and it's type is already declared in Course */
export const calculateRating = (course: Course): number => {
    //if no rating then courseRatings will be empty without id n rating
    if (course.courseRating.length === 0) 
        return 0;

    let totalRating = 0;

    course.courseRating.forEach(rating=> totalRating += rating.rating);
    
    return totalRating / course.courseRating.length;
};