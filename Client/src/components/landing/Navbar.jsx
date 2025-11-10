import { useState } from "react";
import { close, menu, logo } from "../../assets";
import { navLinks } from "../../constants";
import Button from "./Button";
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const location = useLocation();

  // إظهار القائمة فقط في الصفحة الرئيسية
  const showNavLinks = location.pathname === "/";

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="sparkit" className="w-32 h-auto object-contain p-0 m-0" />

      {/* القائمة الرئيسية - تظهر فقط في الصفحة الرئيسية */}
      {showNavLinks && (
        <ul className="list-none sm:flex hidden justify-center items-center flex-1">
          {navLinks.map((nav, index) => (
            <li
              key={nav.id}
              className={`font-poppins font-normal cursor-pointer text-[16px] ${
                active === nav.title ? "text-white" : "text-dimWhite"
              } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
        </ul>
      )}

      {/* الأزرار - تظهر دائماً */}
      <div className="hidden sm:flex gap-4">
        <Link to={"/login"} >
          <button className="py-4 px-6 font-poppins font-medium text-[15px] text-white border border-white bg-transparent rounded-[10px] outline-none transition-all duration-300 hover:scale-105 ">
            Sign In
          </button>
        </Link>
        
        <Link to={"/signup"} >
          <Button text={"Sign Up"} styles={`hover:scale-105`}/>
        </Link> 
      </div>

      {/* القائمة المتنقلة للجوال - تظهر فقط في الصفحة الرئيسية */}
      <div className="sm:hidden flex flex-1 justify-end items-center">
        {showNavLinks && (
          <>
            <img
              src={toggle ? close : menu}
              alt="menu"
              className="w-[28px] h-[28px] object-contain"
              onClick={() => setToggle(!toggle)}
            />

            <div
              className={`${
                !toggle ? "hidden" : "flex"
              } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
            >
              <ul className="list-none flex justify-end items-start flex-1 flex-col">
                {navLinks.map((nav, index) => (
                  <li
                    key={nav.id}
                    className={`font-poppins font-medium cursor-pointer text-[16px] ${
                      active === nav.title ? "text-white" : "text-dimWhite"
                    } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                    onClick={() => setActive(nav.title)}
                  >
                    <a href={`#${nav.id}`}>{nav.title}</a>
                  </li>
                ))}

                <li className="mt-4">
                  <Link to={"/login"} >
                    <button className="w-full mb-2 px-4 py-2 bg-transparent border border-white text-white rounded hover:bg-white hover:text-black transition">
                      Sign In
                    </button>
                  </Link>
                  <Link to={"/signup"} > 
                    <button className="w-full px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition">
                      Sign Up
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* إذا لم نكن في الصفحة الرئيسية، نظهر فقط الأزرار في نسخة الجوال */}
        {!showNavLinks && (
          <div className="flex gap-2">
            <Link to={"/login"} >
              <button className="px-4 py-2 bg-transparent border border-white text-white rounded hover:bg-white hover:text-black transition text-sm">
                Sign In
              </button>
            </Link>
            <Link to={"/signup"} > 
              <button className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition text-sm">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;