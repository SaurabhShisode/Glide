import { motion } from "framer-motion";

interface NavbarProps {
  setLoginStatus: (status: "yes" | "no") => void;
}

export default function Navbar({ setLoginStatus }: NavbarProps) {
  const handleLoginClick = () => {
    setLoginStatus("yes");
  };

  return (
    <nav className="w-full left-0 z-50 py-5 bg-[#070F2B]">
      <div className="grid grid-cols-12 mx-5 px-6 lg:px-6 items-center gap-10 h-16">
        <div className="col-span-6">
          <motion.h1
            layoutId="glide-logo"
            className="text-3xl font-comfortaa font-bold text-[#9290C3] cursor-pointer"
            style={{ width: "fit-content" }}
            onClick={() => (window.location.href = "/")}
          >
            Glide
          </motion.h1>
        </div>

        

        <div className="col-span-6 flex justify-end">
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
