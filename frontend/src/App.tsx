import {  Route, Routes } from "react-router";

// pages
import HomePage from "./pages/student/HomePage";
import CoursesListPage from "./pages/student/CoursesListPage";
import CourseDetailPage from "./pages/student/CourseDetailPage";
import MyEnrollmentsPage from "./pages/student/MyEnrollmentsPage";
import Player from "./pages/student/Player";
import Navbar from "./components/student/Navbar";
import Register from "./pages/auth/Register";
import SearchedCoursesListPage from "./pages/student/SearchedCoursesListPage";
import AddCourse from "./pages/educator/AddCourse";
import EducatorNavbar from "./components/educator/EducatorNavbar";
import GetEducatorCourses from "./pages/educator/GetEducatorCourses";
import "quill/dist/quill.snow.css";
import RegisterVerification from "./pages/auth/RegisterVerification";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import GoogleLoginSuccess from "./pages/auth/GoogleLoginSuccess";
import UserProfileEdit from "./pages/auth/UserProfileEdit";
import AdminProfileEdit from "./pages/auth/AdminProfileEdit";
import Test from "./pages/Test";
import UserProtectedRoute from "./protectedRoute/UserProtectedRoute";
import StripeSuccess from "./pages/student/StripeSuccess";
import StripeCancel from "./pages/student/StripeCancell";
import GetEnrolledStudents from "./pages/educator/GetEnrolledStudents";
import GetEducatorDashboardData from "./pages/educator/GetEducatorDashboardData";
import NotFound from "./components/NotFound";
import AdminProtectedRoute from "./protectedRoute/AdminProtectedRoute";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/Store";
import { setSocket } from "./store/socketSlice";
import Notification from "./components/Notification";


const App = () => {

 
  /* socket workflow: 1-when user login, connect to socket server-> when user logout, disconnect from socket server(socket.disconnect() runs on unmount or when user logout by authSlice logout action) 
  2-in player.tsx when /api/user/get-user-course-progress is called,  socket in backend controller will emit notification to the provided user.
  3-in Navbar.tsx, this notification will be captured and used.
  */
  
  /* On login
user logs in.
sessionStorage.setItem("user", JSON.stringify(user)) happens in your login page n authSlice by using dispatch gets the user data and stores it in the store. dispatch changes user value in redux store/slice n  value change makes component render.Then the re-render makes useEffect re-evaluate(coz of user in dependency in useEffect).useEffect compares the new user vs previous user, sees a change → runs again
useEffect runs:
Socket connects with userId in auth.

On logout
user logs out by removing user from sessionStorage n authSlice by using dispatch makes user falsy.
same behaviour of dispatch n useEffect as on login 
useEffect in App.tsx runs the cleanup → socket.disconnect() fires.
Also on full page refresh

using user from sessionStorage won't work because only in login n full page refresh useEffect runs but in logout n going from one page to other useEffect won't run. for more on useEffect look useEffect behaviour in misc.
*/
/* return/cleanup in useEffect runs in below 2 conditions
1-When the component unmounts — React calls the cleanup function to clean up side effects like subscriptions, timers, or in this case, WebSocket connections. socket?.disconnect() runs in user logout

2-Before the effect re-runs — If the user dependency changes, React runs the cleanup for the previous effect before running the new one(disconnects previous socket n connects new socket.). here user changes in login n logout. useEffect runs in user changes.

in page refresh although useEffect will re-run once the component remounts after refresh cleanup doesnot get chance to run. return/cleanup function will not run on refresh because the app is unmounted due to a full reload, not a React state(here user in redux) or route change.*/
const user = useSelector((state: RootState) => state.auth.data);
const dispatch = useDispatch();


useEffect(() => {
  let socket: Socket | null = null;
  if (user?._id) {
    socket = io(import.meta.env.VITE_API_BASE_URL, {
      query: { userId: user._id },
      transports: ["websocket"]
    });

    dispatch(setSocket(socket));

    return () => {
      socket?.disconnect();
      dispatch(setSocket(null));
    };
  }
}, [user]);




  return (
    <div>
    <Routes>
        <Route path="/" element={<Navbar />}>
        <Route index element={<HomePage />} />
        <Route path="course-list-page" element={<CoursesListPage />} />
        <Route path="searched-course-list-page/:input" element={<SearchedCoursesListPage />} />
        <Route path="register" element={<Register />} />
        <Route path="register-verification/:id" element={<RegisterVerification />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="google-login-success" element={<GoogleLoginSuccess />} />
        <Route path="stripe-success" element={<StripeSuccess />} />
        <Route path="stripe-cancell" element={<StripeCancel/>} />
        <Route path="/test" element={<Test />} />
        <Route element = {<UserProtectedRoute />}>
        <Route path="course-detail-page/:_id" element={<CourseDetailPage />} />
        <Route path="my-enrollments-page" element={<MyEnrollmentsPage />} />
        <Route path="player/:_id" element={<Player />} />
        <Route path="user-profile-edit" element={<UserProfileEdit />} />
        <Route path="notification/:notificationId" element={<Notification />} />
        </Route>
        </Route>
        <Route element = {<AdminProtectedRoute />}>
        <Route path="/educator" element={<EducatorNavbar />}>
        <Route index element={<GetEducatorDashboardData />} />
        <Route path="get-educator-courses" element={<GetEducatorCourses />} />
        <Route path="add-course" element={<AddCourse />} />
        <Route path="get-enrolled-students" element={<GetEnrolledStudents />} />
        <Route path="admin-profile-edit" element={<AdminProfileEdit />} />
        </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
  );
};

export default App;