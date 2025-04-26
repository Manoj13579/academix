import { IoHomeOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { GoBook } from "react-icons/go";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { NavLink } from "react-router";


interface MenuItems {
  name: string;
  path: string;
  icon: React.ReactElement;
}



const SideBar = () => {


const menuItems: MenuItems[] = [
  {name: "Dashboard", path: "/educator", icon: <IoHomeOutline />},
  {name: "My Courses", path: "/educator/get-educator-courses", icon: <GoBook />},
  {name: "Add Course", path: "/educator/add-course", icon: <IoMdAdd />},
  {name: "Students Enrolled", path: "/educator/get-enrolled-students", icon: <BsFillPersonCheckFill />}
];
   
  return (
    <div className="md:w-64 w-16 border-r border-gray-500 min-h-screen text-base py-2 flex flex-col">
     {menuItems.map((item, index) => (
      <NavLink to={item.path} key={index} end={item.path === "/educator"}
    className={({isActive}) => `flex items-center md:flex-row flex-col md:justify-start justify-center gap-3 py-3.5 md:px-10 ${isActive ? "bg-indigo-50 border-r-[6px] border-indigo-500/90": "hover-bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"}`}
      >
      <p className="w-6 h-6">{item.icon}</p>
      <p className="hidden md:block text-center">{item.name}</p>
      </NavLink>
     ))}
    </div>
  )
}

export default SideBar
