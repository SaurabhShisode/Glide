import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NavbarProps {
  setLoginStatus: (status: "yes" | "no") => void;
  children?: ReactNode; 
}

export default function Navbar({ setLoginStatus, children }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setLoginStatus("yes");
  };

  return (
    <nav className="w-full left-0 z-50 py-5 bg-[#070F2B]">
      <div className="grid grid-cols-12 mx-5 px-6 lg:px-6 items-center gap-10 h-16">
        <div className="col-span-3">
          
          <motion.h1
            layoutId="glide-logo"
            className=" text-3xl font-comfortaa font-bold text-[#9290C3]"
            style={{ width: "fit-content" }}
          >
            Glide
          </motion.h1>
        </div>

        <div className="col-span-6 items-center">
          <ul className="hidden md:flex gap-8 font-comfortaa text-[#9290C3] font-medium justify-center">
            <li className="relative group cursor-pointer transition">
              <span className="group-hover:text-white">Home</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="relative group cursor-pointer transition">
              <span className="group-hover:text-white">About</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="relative group cursor-pointer transition">
              <span className="group-hover:text-white">Services</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="relative group cursor-pointer transition">
              <span className="group-hover:text-white">Contact</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
          </ul>
        </div>

        <div className="col-span-3 flex justify-end">
          <button
            onClick={handleLoginClick}
            className="font-comfortaa rounded-2xl px-5 py-2 bg-[#1B1A55] text-white font-semibold hover:bg-[#535C91] transition cursor-pointer"
            aria-label="Login"
          >
            Log in
          </button>
        </div>
      </div>
    </nav>
  );
}
