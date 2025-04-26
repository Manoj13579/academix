import SearchBar from "./SearchBar"
import { motion } from 'framer-motion';


const Hero = () => {
  return (
    <motion.div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center'
    initial={{ opacity: 0.2, x: -100 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}    
    >
      <h1 className='md:text-6xl text-3xl font-bold text-gray-100 max-w-3xl mx-auto '>Empower Your Future with the courses designed to <span className='text-cyan-500'>
        fit your choice</span></h1>
        <p className='md:block hidden text-gray-200 max-w-sm md:max-w-2xl mx-auto'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. At qui vel iure repudiandae maxime est exercitationem, nihil eveniet voluptates doloremque quidem quos porro laborum similique cumque maiores nulla dolorum eaque.</p>
        <SearchBar/>
    </motion.div>
  )
}

export default Hero;