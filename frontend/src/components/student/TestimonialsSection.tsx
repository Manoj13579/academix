import { dummyTestimonials } from "./dummyTestimonials";
import star from "../../assets/star.png";
import blank_star from "../../assets/blank_star.png";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  return (
    <motion.section
      className="pb-14 px-8 md:px-0"
      initial={{ opacity: 0.2, x: -100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-medium text-gray-100">Testimonials</h2>
      <p className="text-sm md:text-base text-gray-200 mt-3">
        What our students say about us
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 mt-14">
        {dummyTestimonials.map((testimonial) => (
          <div
            key={testimonial._id}
            className="text-sm text-left border border-gray-500/30 rounded-lg pb-6 bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden"
          >
            <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-lg font-medium text-gray-800">
                  {testimonial.name}
                </h1>
                <p className="text-gray-800/80">{testimonial.role}</p>
              </div>
            </div>
            <div className="p-5 pb-7">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, index) => (
                  <img
                    key={index}
                    src={
                      index < Math.floor(testimonial.rating) ? star : blank_star
                    }
                    alt="star icon"
                    className="h-5"
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
            </div>
            <a href="#" className="text-blue-500 underline px-5">
              Read more
            </a>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
