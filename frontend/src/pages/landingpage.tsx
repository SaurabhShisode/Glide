import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import heroImage from "../assets/svgviewer-output.svg";
export default function LandingPage() {





    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen bg-[#070F2B] flex items-center justify-center px-6">
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



        </>
    );
}

