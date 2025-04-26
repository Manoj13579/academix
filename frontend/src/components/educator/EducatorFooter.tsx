import logo from '../../assets/logo.png';
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";






const EducatorFooter = () => {
  return (
   <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full border-t border-white/30">
 <div className='flex items-center gap-4'>
  <img className="hidden md:block w-20 h-5 object-cover pl-3" src={logo} alt='logo'/>
  <div className='hidden md:block h-20 w-px bg-gray-500/60'></div>
  <p className='py-4 text-center text-xs md:text-sm text-gray-500'>
  Copyright 2024 © Manoj, All Rights Reserved.
  </p>
 </div>
 <div className='flex items-center gap-3 max-md:mt-4 pr-3'>
  <a href='#'><FaFacebook /></a>
  <a href='#'><FaInstagram /></a>
  <a href='#'><FaXTwitter /></a>
 </div>
   </footer>
  )
}

export default EducatorFooter;
