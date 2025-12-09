import { useEffect, useState, } from "react";
import type { FC } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import heroImage from "../assets/svgviewer-output (2).svg";
import { motion, AnimatePresence } from "framer-motion";
import { HighlightText } from "../components/animate-ui/text/highlight";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Marquee } from "@/components/ui/marquee";
import bracket from "../assets/bracket.svg";

export default function LandingPage() {

    const [loginStatus, setLoginStatus] = useState<"yes" | "no">("no");
    const [showSplash, setShowSplash] = useState(true);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



    const loopelements = [
        { name: "Glide in campus with eco-friendly rides." },
        { name: "Save money by sharing rides with classmates." },
        { name: "Earn Glide Points and unlock cool badges." },
        { name: "Find rides instantly from hostel to AB." },
        { name: "Track your rides in real time for peace of mind." },
        { name: "Join us in making campus travel smarter." },
    ];

    const loopelementsRight = [
        { name: "Plan your next outing with Glide." },
        { name: "Coordinate group rides to RKMP." },
        { name: "Chat with fellow students before your trip." },
        { name: "Reduce your carbon footprint with shared rides." },
        { name: "Glide Away for cheaper long-distance travel." },
        { name: "Your commute, simplified with Glide." },
    ];


    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
            { email, password }
        )
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("glideUser", JSON.stringify(res.data.user))

        toast.success(`Logged in as ${res.data.user.name}`, {
            style: { background: "#14532d", color: "white" },
            onClose: () => navigate("/home")
        })
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Login failed")
    }
}


    const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
            { name, email, password }
        )
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("glideUser", JSON.stringify(res.data.user))

        toast.success("Registration successful", {
            onClose: () => navigate("/home")
        })
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Registration failed")
    }
}

    const handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider)
        const idToken = await result.user.getIdToken()

        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
            { idToken }
        )
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("glideUser", JSON.stringify(res.data.user))

        toast.success("Google login successful", {
            onClose: () => navigate("/home")
        })
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Google login failed")
    }
}


    return (
        <div className="overflow-hidden">
            <AnimatePresence>
                {showSplash && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-[#1a0734] z-50"
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
                                transition: "color 0.8s ease, WebkitTextStroke 0.8s ease",
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
            <div className="w-full  min-h-screen p-0 relativen bg-black">
                <div className="flex items-center justify-center px-6 bg-gradient-to-b 
  from-[#1a0734] from-0% 
  via-[#2d085a] via-50%
  to-[#682db1] to-100% ">
                    <section className="flex flex-col md:flex-row items-center min-h-screen max-w-7xl gap-10 md:gap-40 md:mt-[-5rem]">
                        <motion.div
                            className="relative -ml-40 md:-ml-60 lg:-ml-85"
                            initial={{ opacity: 0, y: 150 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 2.5 }}
                        >
                            <img
                                src={heroImage}
                                alt="Glide Hero"
                                className="w-[400px] md:w-[700px] lg:w-[900px] object-contain mt-10 fit-content"
                            />
                        </motion.div>

                        {loginStatus === "no" ? (
                            <motion.div
                                className="flex-1 text-center md:text-left px-7"
                                initial={{ opacity: 0, y: 150 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut", delay: 2.5 }}
                            >
                                <h1 className="text-4xl md:text-7xl font-oswald text-white leading-tight mb-2">
                                    Glide through your campus,<br />
                                </h1>
                                <HighlightText
                                    className="text-4xl md:text-7xl font-oswald text-white leading-tight mt-2"
                                    text="commute smarter."
                                />
                                <p className="mt-6 text-md md:text-xl font-grotesk text-gray-300">
                                    From hostel to academic block or to the Bhopal station - Glide
                                    connects students for faster, cheaper, and eco-friendly rides.
                                </p>
                                <div className="mt-4 md:mt-8 flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                                    <button
                                        className="cursor-pointer px-6 py-3 rounded-2xl bg-[#330d6a] text-white font-semibold hover:bg-[#400e86] transition "
                                        onClick={() => setLoginStatus("yes")}
                                    >
                                        Get Started
                                    </button>
                                    <button className="cursor-pointer px-6 py-3 rounded-2xl border-1 border-white text-white font-semibold hover:bg-white hover:text-[#070F2B] transition">
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
                                    <div className="px-5 md:px-14">
                                        <h1 className="text-4xl md:text-7xl font-oswald text-white leading-tight">
                                            Welcome Back!<br />Please Log In.
                                        </h1>
                                        <p className="mt-3 md:mt-6 text-sm md:text-xl font-grotesk text-gray-300">
                                            Enter your credentials to access your account.
                                        </p>
                                        <form onSubmit={handleLogin} className="mt-4 md:mt-8 flex flex-col gap-4">
                                            <input
                                                type="email"
                                                placeholder="VIT Email"
                                                className="p-3 rounded-md bg-gray-700 text-white"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                className="p-3 rounded-md bg-gray-700 text-white"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="cursor-pointer px-6 py-3 rounded-2xl bg-[#6f12f0] text-white font-semibold hover:bg-[#5e14c6] transition"
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

                                        <p className="mt-4 text-white text-sm text-center">
                                            Don’t have an account?{" "}
                                            <span
                                                className="text-[#7c81f3] cursor-pointer hover:underline"
                                                onClick={() => setAuthMode("register")}
                                            >
                                                Register
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="px-5 md:px-16">
                                        <h1 className="text-4xl md:text-7xl font-oswald text-white leading-tight">
                                            Create your Account
                                        </h1>
                                        <p className="mt-3 md:mt-6 text-sm md:text-xl font-grotesk text-gray-300">
                                            Enter your credentials to create your account.
                                        </p>
                                        <form onSubmit={handleRegister} className="mt-4 md:mt-8 flex flex-col gap-4">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                className="p-3 rounded-md bg-gray-700 text-white"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <input
                                                type="email"
                                                placeholder="VIT Email"
                                                className="p-3 rounded-md bg-gray-700 text-white"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                className="p-3 rounded-md bg-gray-700 text-white"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="cursor-pointer px-6 py-3 rounded-2xl bg-[#6f12f0] text-white font-semibold hover:bg-[#5e14c6] transition"
                                            >
                                                Register
                                            </button>
                                        </form>

                                        <p className="text-center mt-4 text-white text-sm">
                                            Already have an account?{" "}
                                            <span
                                                className="text-[#7c81f3] cursor-pointer hover:underline"
                                                onClick={() => setAuthMode("login")}
                                            >
                                                Log In
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </section>
                </div>

                <div className="relative flex w-full flex-col items-center justify-center overflow-hidden my-5 bg-black">
                    <Marquee pauseOnHover className="[--duration:50s]">
                        {loopelements.map((review, ind) => (

                            <ReviewCard key={ind} msg={review.name} />
                        ))}
                    </Marquee>
                    <Marquee reverse pauseOnHover className="[--duration:50s]">
                        {loopelementsRight.map((review, ind) => (
                            <ReviewCard key={ind} msg={review.name} />
                        ))}
                    </Marquee>

                </div>
                <section className="bg-black text-white p-10 mt-10 flex flex-col md:flex-row gap-4 md:gap-10 items-center mx-10 md:mx-20 md:mr-140">
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-5xl font-grotesk text-right">
                            Glide-Campus
                        </h1>
                    </div>

                    <div className="flex justify-center items-center">
                        <img
                            src={bracket}
                            className="w-16 md:w-[80px] rotate-90 md:rotate-0"
                            alt="bracket"
                        />
                    </div>

                    <div className="flex flex-col gap-4 md:gap-8 pt-4 md:pt-0 md:pl-10 text-center md:text-left font-grotesk text-lg text-white">
                        <p>Open the app and see nearby campus rides</p>
                        <p>Request a ride or offer a ride</p>
                        <p>Earn Glide Points and badges for each ride</p>
                        <p>Track rides in real-time and connect safely</p>
                    </div>
                </section>

                <section className="bg-black text-white p-10  flex flex-col md:flex-row gap-4 md:gap-10 items-center mx-10 md:mx-20 md:ml-140">



                    <div className="flex flex-col gap-4 md:gap-8 pt-4 md:pt-0 md:pr-10 text-center md:text-right font-grotesk text-lg font-gretosk text-white">
                        <p>Create or join a long-distance trip</p>
                        <p>Coordinate with other students in private chat</p>
                        <p>Optimize timing based on train/flight schedule</p>
                        <p>Share cab and reduce travel costs</p>
                    </div>

                    <div>

                        <img src={bracket} width="80px" className="rotate-270 md:rotate-180 w-16 md:w-[80px] " />
                    </div>

                    <div className="flex-1 ">
                        <h1 className="text-3xl md:text-5xl font-grotesk ">Glide-Away</h1>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="px-10 md:px-60 flex flex-col md:flex-row gap-3 md:gap-10 justify-center items-center bg-gray-50/[.10] border-t border-b border-gray-50/[.1]">

                        <div className="flex-1 p-3 md:p-6 rounded-2xl text-center">
                            <p className="text-white text-md md:text-lg font-grotesk">Total Users</p>
                            <p className="text-white text-4xl font-bold mt-2 font-grotesk">500+</p>
                        </div>

                        <div className="flex-1 p-3 md:p-6 rounded-2xl text-center">
                            <p className="text-white text-md md:text-lg font-grotesk">Total Glides</p>
                            <p className="text-white text-4xl font-bold mt-2 font-grotesk">1200+</p>
                        </div>

                        <div className="flex-1 p-3 md:p-6 rounded-2xl text-center">
                            <p className="text-white text-md md:text-lg font-grotesk">Active Gliders</p>
                            <p className="text-white text-4xl font-bold mt-2 font-grotesk">350+</p>
                        </div>
                        

                    </div>
                </section>

                <section className="mt-10 md:mt-20 mx-10 sm:mx-0">
                    <div>
                        <p className="text-white font-grotesk text-xl md:text-5xl text-center">
                            <span className=" text-3xl md:text-8xl">“</span>Why walk when you can glide… and brag about it?<span className="text-3xl md:text-8xl">”</span>
                        </p>
                        <p className="text-gray-400 font-grotesk text-md md:text-2xl text-center">- Someone who hates walking.</p>
                    </div>

                </section>

















                <Footer />
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
        </div>
    );
}


type ReviewCardProps = {
    msg: string;
};

const ReviewCard: FC<ReviewCardProps> = ({ msg }) => {
    return (
        <div
            className="relative max-w-md mx-auto h-full  cursor-pointer overflow-hidden 
             rounded-2xl border border-gray-50/[.1] bg-gray-50/[.10] p-6 
             shadow-lg transition-all duration-300 hover:bg-gray-50/[.15] hover:shadow-xl"
        >
            <p className="text-white text-base leading-relaxed font-grotesk">
                {msg}
            </p>
        </div>

    );
};
