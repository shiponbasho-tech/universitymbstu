import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FaGraduationCap,
  FaFlask,
  FaLaptopCode,
  FaUsers,
} from "react-icons/fa";
import Image from "next/image";

const HomePage = () => {
  const universityHighlights = [
    {
      icon: FaGraduationCap,
      title: "Academic Excellence",
      description:
        "Offering a wide range of programs in science, technology, and engineering.",
    },
    {
      icon: FaFlask,
      title: "Research Opportunities",
      description:
        "State-of-the-art laboratories and research centers for groundbreaking discoveries.",
    },
    {
      icon: FaLaptopCode,
      title: "Innovation Hub",
      description:
        "Fostering entrepreneurship and technological innovation among students.",
    },
    {
      icon: FaUsers,
      title: "Diverse Community",
      description:
        "A vibrant campus life with students from various backgrounds and cultures.",
    },
  ];

  return (
    <div className="min-h-svh relative flex flex-col bg-white text-stone-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Banner Section */}
        <Image
          src="/hero.jpg"
          alt="Hero image"
          width={400}
          height={400}
          className=" mx-auto h-auto object-cover rounded-lg"
        />
        <div className="bg-gradient-to-br from-stone-100 via-stone-50 to-white p-6 my-8 rounded-lg border border-stone-200 shadow-sm">
          <h1 className="text-4xl font-bold text-center mb-4 text-stone-900 tracking-wide">
            Welcome to Mawlana Bhashani Science and Technology University
          </h1>
          <h2 className="text-2xl font-semibold text-center mb-2 text-stone-600">
            Empowering Minds, Advancing Technology
          </h2>
        </div>

        {/* About Section */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-2xl font-bold text-stone-900 mb-4">
            About MBSTU
          </h3>
          <p className="text-stone-700 mb-4 leading-relaxed">
            Mawlana Bhashani Science and Technology University (MBSTU) is a
            leading institution dedicated to advancing knowledge in science,
            technology, engineering, and mathematics. Founded with the vision of
            nurturing innovative minds, MBSTU has become a hub for cutting-edge
            research and technological breakthroughs.
          </p>
          <p className="text-stone-700 leading-relaxed">
            Our commitment to academic excellence, coupled with state-of-the-art
            facilities, provides students with an unparalleled learning
            experience. At MBSTU, we believe in preparing our students not just
            for careers, but for leadership roles in shaping the future of
            technology and science.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {universityHighlights.map((highlight, index) => (
            <div
              key={index}
              className="bg-white border border-stone-200 hover:border-stone-400 rounded-lg p-6 text-stone-800 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <highlight.icon className="text-4xl mb-4 text-stone-900" />
              <h4 className="text-xl font-semibold mb-2 text-stone-900">
                {highlight.title}
              </h4>
              <p className="text-stone-600">{highlight.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <a
            href="/about"
            className="inline-block bg-stone-900 text-white font-bold py-3 px-6 rounded-full hover:bg-stone-800 transition-all duration-200 shadow-sm hover:shadow"
          >
            Learn More About Our Programs
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
