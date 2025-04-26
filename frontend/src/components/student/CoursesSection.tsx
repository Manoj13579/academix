import { Link } from "react-router";
import CourseCard from "./CourseCard";
import { AppDispatch, RootState } from "../../store/Store";
import { useSelector, useDispatch } from "react-redux";
import { getCourses } from "../../store/coursesSlice";
import { useEffect } from "react";
import statusCode from "../../utils/statusCode";
import Loader from "../../utils/Loader";
import StatusError from "../../utils/StatusError";
import { motion } from "framer-motion";

const CoursesSection = () => {
  const courses = useSelector((state: RootState) => state.courses.data);
  const status = useSelector((state: RootState) => state.courses.status);
  const coursesSectionCourses = courses.slice(0, 4);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getCourses());
  }, []);

  if (status === statusCode.LOADING) {
    return <Loader />;
  }

  if (status === statusCode.ERROR) {
    return <StatusError />;
  }

  return (
    <motion.div
      className="flex flex-wrap flex-col items-center justify-center gap-y-4 "
      initial={{ opacity: 0.2, x: -100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-medium text-gray-100">
        Learn from top educators
      </h2>
      <p className="text-sm md:text-base text-gray-200 mt-3">
        Our courses provide comprehensive, engaging learning experiences with
        flexible schedules, expert-led content, and <br /> interactive materials
        designed to enhance skill development.
      </p>
      <CourseCard courses={coursesSectionCourses} />
      <Link
        to="/course-list-page"
        onClick={() => scrollTo(0, 0)}
        className="text-gray-200 border border-gray-200 px-10 py-3 rounded"
      >
        View all courses
      </Link>
    </motion.div>
  );
};

export default CoursesSection;
