import CallToAction from "../../components/student/CallToAction"
import Companies from "../../components/student/Companies"
import CoursesSection from "../../components/student/CoursesSection"
import Hero from "../../components/student/Hero"
import TestimonialsSection from "../../components/student/TestimonialsSection"



const HomePage = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center bg-[linear-gradient(to_bottom,#9d1c95,#a21caf,#c026d3,#c026d3,#a21caf,#9d1c95)]">
      <Hero />
      <Companies />
      <CoursesSection />
      <TestimonialsSection />
      <CallToAction />
    </div>
  )
}

export default HomePage
