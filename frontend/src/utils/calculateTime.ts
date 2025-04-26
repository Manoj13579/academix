// no need to import Lecture type here as it's(Lecture[]) part of Chapter
import { Chapter, Course } from "../types/dummyCoursesType";
/* npm i --save-dev @types/humanize-duration  ( @types created by TypeScript community might create a definition for it giving type to popular JavaScript libraries that don't include their own TypeScript definitions like humanize-duration. if not covered by @types need to provide type manually by using d.ts extension which will provide any type eg. humanize-duration.d.ts. using  --save-dev coz we use types in dev mode only) */
/* humanize-duration library is imported to convert a duration (in milliseconds) into a more readable, human-friendly string (like "2 hours 30 minutes"). */
import humanizeDuration from "humanize-duration";

 /*no return type needed coz TypeScript Infers the Return Type Automatically
Since humanizeDuration() is correctly typed, TypeScript knows it returns a string.
Because the function directly returns humanizeDuration(...), TypeScript infers string as the return type of calculateChapterTime and calculateCourseDuration.
Type Definitions from @types/humanize-duration

The installed @types/humanize-duration package provides proper TypeScript definitions for humanizeDuration().
If @types/humanize-duration was not installed, TypeScript might treat humanizeDuration as returning any, which could make it necessary to explicitly define the return type. */
// function to calculate course chapter time since one chapter consists of multiple lectures.

export const calculateChapterTime = (chapter: Chapter) => {
    let total = 0;
    chapter.chapterContent.map((lecture) => (total += lecture.lectureDuration));

    return humanizeDuration(total * 60 * 1000, { units: ["h", "m"] });
};


// function to calculate course duration since one course consists of multiple chapters.

export const calculateCourseDuration = (course: Course) => {
    let total = 0;
    course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => (total += lecture.lectureDuration)));

    return humanizeDuration(total * 60 * 1000, { units: ["h", "m"] });

};


// function to calculate no. of lectures in a course

export const calculateNoOfLectures = (course: Course) => {
    let totalLectures = 0;
    course.courseContent.map((chapter) => totalLectures += chapter.chapterContent.length);

    return totalLectures;
}