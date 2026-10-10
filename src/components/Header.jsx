import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-white/90 border-b border-stone-200 sticky top-0 z-50 backdrop-blur-md p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center text-stone-900 hover:text-stone-700 transition-colors"
        >
          <FaGraduationCap className="text-3xl mr-2 text-stone-900" />
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            MBSTU Admissions
          </h1> 
        </Link>
        <nav className="text-stone-700 font-semibold">
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/about"
                className="hover:text-stone-900 transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/sign-in"
                className="hover:text-stone-900 transition-colors"
              >
                Sign-in
              </Link>
            </li>
            {/* <li>
              <Link
                href="/contact"
                className="hover:text-stone-900 transition-colors"
              >
                Contact
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
