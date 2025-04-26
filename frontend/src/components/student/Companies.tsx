import microsoft from "../../assets/microsoft.png";
import { motion } from "framer-motion";

const Companies = () => {
  return (
    <motion.div
      className="pt-16 "
      initial={{ opacity: 0.2, x: -100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <p className="text-base text-gray-200">Trusted by lead companies</p>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16 mt-5 md:mt-10">
        <img src={microsoft} alt="microsoft logo" className="w-2- md:w-28" />
        <img src={microsoft} alt="microsoft logo" className="w-2- md:w-28" />
        <img src={microsoft} alt="microsoft logo" className="w-2- md:w-28" />
        <img src={microsoft} alt="microsoft logo" className="w-2- md:w-28" />
        <img src={microsoft} alt="microsoft logo" className="w-2- md:w-28" />
      </div>
    </motion.div>
  );
};

export default Companies;
