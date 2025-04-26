import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router";



const SearchBar = () => {

 const [input, setInput] = useState("");
const navigate = useNavigate();


const onSeaarchHandler = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  navigate(`/searched-course-list-page/${input}`);
}

  return (
      <form onSubmit={onSeaarchHandler} className="max-w-xl w-full md:mb-14 h-12 flex items-center bg-white border border-gray-500/20 rounded">
      <FaSearch className="md:w-auto w-10 px-3"/>
      <input 
      type="text"
      placeholder="Search for courses"
      required
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="w-full h-full outline-none text-gray-500/80 placeholder:text-gray-500"
      />
      <button type="submit" className="bg-cyan-500 rounded text-white md:px-9 px-7 md:py-3 py-2 mx-1 cursor-pointer">Search</button>
      </form>
  )
}

export default SearchBar
