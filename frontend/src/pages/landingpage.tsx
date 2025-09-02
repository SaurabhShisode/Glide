import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import heroImage from "../assets/svgviewer-output.svg";
import { motion } from "framer-motion";

export default function LandingPage() {
    const [filterStatus, setFilterStatus] = useState<'glidecampus' | 'glideaway'>('glidecampus');

    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen bg-[#070F2B]">
                <div className=" flex items-center justify-center px-6">
                    <section className="flex flex-col md:flex-row items-center max-w-6xl gap-40 mt-20">
                        <div className="relative -ml-40 md:-ml-60 lg:-ml-100">
                            <img
                                src={heroImage}
                                alt="Glide Hero"
                                className="w-[500px] md:w-[700px] lg:w-[900px] object-contain mt-10"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-5xl md:text-6xl font-oswald text-white leading-tight">
                                Glide through your campus,<br /> commute smarter.
                            </h1>
                            <p className="mt-6 text-lg font-comfortaa text-gray-300">
                                From hostel to academic block or to the Bhopal station - Glide connects students
                                for faster, cheaper, and eco-friendly rides.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                                <button className="px-6 py-3 rounded-2xl bg-[#1B1A55] text-white font-semibold hover:bg-[#535C91] transition">
                                    Get Started
                                </button>
                                <button className="px-6 py-3 rounded-2xl border border-white text-white font-semibold hover:bg-white hover:text-[#070F2B] transition">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                <section className=" flex flex-col items-center justify-center px-6 mt-16 sm:mt-30 py-16 border-3 border-[#535C91] pt-5 rounded-3xl bg-[#04081b] mx-30">
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
                                    <div className="absolute -top-10 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tr from-[#535C91] to-[#7c81f3] text-white font-bold text-4xl shadow-lg">
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

        </>
    );
}