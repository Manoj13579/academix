import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <motion.div
      className="flex flex-col items-center gap-5 pt-10 pb-24 px-8 md:px-0"
      initial={{ opacity: 0.2, x: -100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <h1 className="text-xl md:text-4xl text-gray-100 font-semibold">
        Learn anything, anytime, anywhere
      </h1>
      <p className="text-sm text-gray-200">
        Access a wide range of courses and resources to learn at your own pace,
        wherever you are
      </p>
      <div className="flex items-center gap-6 font-medium mt-4">
        <button className="px-10 py-3 rounded-md bg-cyan-500 text-white cursor-pointer">
          Get started
        </button>
        <button className="flex items-center gap-2 cursor-pointer">
          Learn more <FaArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default CallToAction;
