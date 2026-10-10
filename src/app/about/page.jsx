import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  FaRobot,
  FaEnvelope,
  FaChartBar,
  FaGraduationCap,
  FaFileAlt,
  FaTicketAlt,
  FaCalendarAlt,
  FaUserGraduate,
  FaComments,
} from "react-icons/fa";

const AboutPage = () => {
  const features = [
    {
      icon: FaRobot,
      title: "Admission Process Automation",
      description: "Streamline your application with our automated system.",
      isNew: true,
    },
    {
      icon: FaEnvelope,
      title: "Automated Email Notifications",
      description:
        "Stay updated with timely email alerts about your application status.",
      isNew: true,
    },
    {
      icon: FaChartBar,
      title: "Analytics for Admins",
      description: "Powerful insights to manage admissions effectively.",
    },
    {
      icon: FaGraduationCap,
      title: "Scholarship Eligibility Checker",
      description:
        "Find out if you qualify for scholarships with our easy-to-use tool.",
    },
    {
      icon: FaFileAlt,
      title: "AI-Powered Resume & CV Analysis",
      description: "Get instant feedback on your application documents.",
      isNew: true,
    },
    {
      icon: FaTicketAlt,
      title: "Auto-Generated Exam Hall Tickets",
      description:
        "Receive your exam hall ticket automatically upon successful application.",
    },
    {
      icon: FaCalendarAlt,
      title: "Interactive Admission Calendar",
      description:
        "Stay on top of important dates and deadlines with our dynamic calendar.",
      isNew: true,
    },
    {
      icon: FaUserGraduate,
      title: "Virtual Campus Tours",
      description:
        "Explore our campus from anywhere with immersive 360° virtual tours.",
    },
    {
      icon: FaComments,
      title: "Live Chat Support",
      description:
        "Get real-time assistance from our admissions team through our live chat feature.",
    },
  ];

  return (
    <div className="min-h-svh relative flex flex-col bg-white text-stone-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-br from-stone-100 via-stone-50 to-white p-6 my-8 rounded-lg border border-stone-200 shadow-sm">
          <h1 className="text-4xl font-bold text-center mb-4 text-stone-900 tracking-wide">
            Mawlana Bhashani Science and Technology University (MBSTU)
          </h1>
          <h2 className="text-2xl font-semibold text-center mb-4 text-stone-600">
            University Admission Management System
          </h2>
          <div className="text-center mb-2">
            <span className="inline-block bg-stone-900 text-white px-5 py-2 rounded-full font-bold text-lg shadow-sm">
              Project Features
            </span>
          </div>
        </div>

        {/* Feature Cards Grid Wrapper */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 shadow-sm">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="mt-12 text-center text-stone-900">
          <h3 className="text-3xl font-bold text-stone-900 mb-6 tracking-tight">
            Why Choose MBSTU?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-stone-200 bg-white text-stone-800 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-xl font-semibold mb-2 text-stone-900">
                Excellence in Education
              </h4>
              <p className="text-stone-600 leading-relaxed">
                MBSTU is committed to providing high-quality education and
                fostering innovation in science and technology.
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white text-stone-800 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-xl font-semibold mb-2 text-stone-900">
                State-of-the-Art Facilities
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Our campus boasts modern laboratories, libraries, and research
                centers to support your academic journey.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
