import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import heroImage from "../assets/svgviewer-output.svg";
import { motion, AnimatePresence } from "framer-motion";
import { HighlightText } from '../components/animate-ui/text/highlight';
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const [filterStatus, setFilterStatus] = useState<'glidecampus' | 'glideaway'>('glidecampus');
    const [loginStatus, setLoginStatus] = useState<'yes' | 'no'>('no');
    const [showSplash, setShowSplash] = useState(true);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    toast.success("Login successful!");
    navigate("/home");  
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
    localStorage.setItem("token", res.data.token);
    toast.success("Registration successful!");
    navigate("/home");   
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Registration failed");
  }
};

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    const res = await axios.post("http://localhost:5000/api/auth/google", { idToken });
    localStorage.setItem("token", res.data.token);
    toast.success("Google login successful!");
    navigate("/home");   
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Google login failed");
  }
};

    return (
        <>
            <AnimatePresence>
                {showSplash && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-[#070F2B] z-50"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.h1
                            layoutId="glide-logo"
                            className="text-3xl font-comfortaa font-bold"
                            style={{
                                width: "fit-content",
                                WebkitTextStroke: "1px #9290C3",
                                color: "transparent",
                                transition: "color 0.8s ease, WebkitTextStroke 0.8s ease"
                            }}
                            initial={{ scale: 4 }}
                            animate={{ scale: 2, color: "#9290C3" }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            Glide
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>

            {!showSplash && <Navbar setLoginStatus={setLoginStatus} />}
            <div className="w-full min-h-screen bg-[#070F2B]">
                <div className="flex items-center justify-center px-6">
                    <section className="flex flex-col md:flex-row items-center max-w-6xl gap-40 mt-20">


                        <motion.div
                            className="relative -ml-40 md:-ml-60 lg:-ml-100"
                            initial={{ opacity: 0, y: 150 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 2.5 }}
                        >
                            <img
                                src={heroImage}
                                alt="Glide Hero"
                                className="w-[500px] md:w-[700px] lg:w-[900px] object-contain mt-10 fit-content"
                            />
                        </motion.div>


                        {loginStatus === 'no' ? (
                            <motion.div
                                className="flex-1 text-center md:text-left px-7"
                                initial={{ opacity: 0, y: 150 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 2.5 }}
                            >
                                <h1 className="text-5xl md:text-6xl font-oswald text-white leading-tight mb-2">
                                    Glide through your campus,<br />
                                </h1>
                                <HighlightText className="text-5xl md:text-6xl font-oswald text-white leading-tight " text="commute smarter." />
                                <p className="mt-6 text-lg font-comfortaa text-gray-300">
                                    From hostel to academic block or to the Bhopal station - Glide connects students
                                    for faster, cheaper, and eco-friendly rides.
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                                    <button
                                        className="cursor-pointer px-6 py-3 rounded-2xl bg-[#1B1A55] text-white font-semibold hover:bg-[#535C91] transition"
                                        onClick={() => setLoginStatus('yes')}
                                    >
                                        Get Started
                                    </button>
                                    <button className="cursor-pointer px-6 py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white hover:text-[#070F2B] transition">
                                        Learn More
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="flex-1 text-center md:text-left"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            >
                                {authMode === "login" ? (
                                    <>
                                        <h1 className="text-5xl md:text-6xl font-oswald text-white leading-tight">
                                            Welcome Back!<br />Please Log In.
                                        </h1>
                                        <p className="mt-6 text-lg font-comfortaa text-gray-300">
                                            Enter your credentials to access your account.
                                        </p>
                                        <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
                                            <input
                                                type="email"
                                                placeholder="VIT Email"
                                                className="p-3 rounded-md bg-gray-800 text-white"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                className="p-3 rounded-md bg-gray-800 text-white"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="cursor-pointer px-6 py-3 rounded-2xl bg-[#535C91] text-white font-semibold hover:bg-[#7c81f3] transition"
                                            >
                                                Log In
                                            </button>
                                        </form>

                                        <div className="w-full h-px bg-gray-300 my-6"></div>

                                        <div className="mt-6 flex justify-center">
                                            <button
                                                type="button"
                                                onClick={handleGoogleLogin}
                                                className="flex items-center gap-3 cursor-pointer px-6 py-3 rounded-2xl bg-white text-gray-700 font-semibold shadow-md hover:bg-gray-100 transition "
                                            >
                                                <FcGoogle size={24} />
                                                <span>Continue with Google</span>
                                            </button>
                                        </div>

                                        <p className="mt-4 text-gray-400 text-sm text-center">
                                            Don’t have an account?{" "}
                                            <span
                                                className="text-[#7c81f3] cursor-pointer hover:underline"
                                                onClick={() => setAuthMode("register")}
                                            >
                                                Register
                                            </span>
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h1 className="text-5xl md:text-6xl font-oswald text-white leading-tight">
                                            Create an Account
                                        </h1>
                                        <p className="mt-6 text-lg font-comfortaa text-gray-300">
                                            Enter your credentials to create your account.
                                        </p>
                                        <form onSubmit={handleRegister} className="mt-8 flex flex-col gap-4">
                                            <input type="text" placeholder="Name" className="p-3 rounded-md bg-gray-800 text-white" value={name} onChange={(e) => setName(e.target.value)} />
                                            <input type="email" placeholder="VIT Email" className="p-3 rounded-md bg-gray-800 text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            <input type="password" placeholder="Password" className="p-3 rounded-md bg-gray-800 text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <button type="submit" className="cursor-pointer px-6 py-3 rounded-2xl bg-[#535C91] text-white font-semibold hover:bg-[#7c81f3] transition">
                                                Register
                                            </button>
                                        </form>

                                        <p className="text-center mt-4 text-gray-400 text-sm">
                                            Already have an account?{" "}
                                            <span
                                                className="text-[#7c81f3] cursor-pointer hover:underline"
                                                onClick={() => setAuthMode("login")}
                                            >
                                                Log In
                                            </span>
                                        </p>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </section>
                </div>


                <section className=" flex flex-col items-center justify-center px-6 mt-16 sm:mt-30 py-5 border-3 border-[#535C91] pt-5 rounded-3xl bg-[#04081b] mx-30">
                    <div className=" mt-4 text-4xl font-poppins text-white text-center mb-8 tracking-wide">
                        How It Works
                    </div>
                    <div className="flex mb-2 gap-4 font-comfortaa items-center justify-center">
                        {
                            (['glidecampus', 'glideaway'] as const).map((type, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setFilterStatus(type)}
                                    className={`px-5 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-base transition-all duration-300 shadow-md cursor-pointer ${filterStatus === type
                                        ? "bg-[#535C91] text-white shadow-lg scale-105"
                                        : "bg-[#1B1A55] text-gray-400 hover:text-white "
                                        }`}
                                >
                                    {type === "glidecampus" ? "Glide-Campus" : "Glide-Away"}
                                </button>
                            ))
                        }
                    </div>
                    <div className="relative w-full overflow-x-auto py-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-16 mb-10 ">
                            {(filterStatus === "glidecampus"
                                ? [
                                    "Open the app and see nearby campus rides",
                                    "Request a ride or offer a ride",
                                    "Earn Glide Points and badges for each ride",
                                    "Track rides in real-time and connect safely",
                                ]
                                : [
                                    "Create or join a long-distance trip",
                                    "Coordinate with other students in private chat",
                                    "Optimize timing based on train/flight schedule",
                                    "Share cab and reduce travel costs",
                                ]
                            ).map((step, index) => (
                                <div
                                    key={index}
                                    className="relative flex flex-col items-center min-w-[220px] bg-[#1B1A55] rounded-3xl py-14 px-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 mt-10 min-h-[250px] justify-between"
                                >
                                    <div className="absolute -top-10 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tr from-[#6975c1] to-[#474a8f] text-white font-bold text-5xl shadow-lg font-oswald">
                                        {index + 1}
                                    </div>
                                    <div className="text-white text-center text-lg font-poppins mt-6">
                                        {step}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                < Footer />
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="dark"
            />

        </>
    );
}