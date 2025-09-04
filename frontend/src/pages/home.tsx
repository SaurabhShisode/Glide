import { useState } from "react";
import userImg from "../assets/icons/user.svg";
import clipboardImg from "../assets/icons/clipboard.svg";
import Footer from "@/components/footer";
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";

export default function HomePage() {
    const [active, setActive] = useState("glide-campus");


    const [campusSource, setCampusSource] = useState("");
    const [campusDestination, setCampusDestination] = useState("");



    const [awaySource, setAwaySource] = useState("");
    const [awayDestination, setAwayDestination] = useState("");
    const [awayDate, setAwayDate] = useState("");


    const handleGlideCampusSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            source: campusSource,
            destination: campusDestination,

        };

        try {
            const res = await fetch("/api/glide-campus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            console.log("Campus Glides:", data);

        } catch (error) {
            console.error("Error finding campus glides:", error);
        }
    };


    const handleGlideAwaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            source: awaySource,
            destination: awayDestination,
            date: awayDate,
        };

        try {
            const res = await fetch("/api/glide-away", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            console.log("Away Glides:", data);

        } catch (error) {
            console.error("Error finding away glides:", error);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#070F2B]">

            <nav className="fixed w-full left-0 z-50 pt-5 pb-2 bg-[#0b1437] shadow-2xl">
                <div className="grid grid-cols-12 mx-5 px-6 lg:px-6 items-center gap-10 h-16">

                    <div className="col-span-3">
                        <h1
                            className="text-3xl font-comfortaa font-bold text-[#9290C3] cursor-pointer"
                            style={{ width: "fit-content" }}
                            onClick={() => (window.location.href = "/home")}
                        >
                            Glide
                        </h1>
                    </div>


                    <div className="col-span-6">
                        <ul className="hidden md:flex gap-8 font-comfortaa text-[#9290C3] font-medium">

                            <li
                                className="relative group cursor-pointer transition"
                                onClick={() => setActive("glide-campus")}
                            >
                                <span
                                    className={`transition-colors duration-300 ${active === "glide-campus" ? "text-white" : "group-hover:text-white"
                                        }`}
                                >
                                    Glide-Campus
                                </span>
                                <span
                                    className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300 ${active === "glide-campus" ? "w-full" : "w-0 "
                                        }`}
                                ></span>
                            </li>


                            <li
                                className="relative group cursor-pointer transition"
                                onClick={() => setActive("glide-away")}
                            >
                                <span
                                    className={`transition-colors duration-300 ${active === "glide-away" ? "text-white" : "group-hover:text-white"
                                        }`}
                                >
                                    Glide-Away
                                </span>
                                <span
                                    className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300 ${active === "glide-away" ? "w-full" : "w-0 "
                                        }`}
                                ></span>
                            </li>
                        </ul>
                    </div>


                    <div className="col-span-3 flex  gap-5">
                        <div className="group flex items-center gap-2  p-2 rounded-4xl cursor-pointer hover:bg-white px-4">
                            <img className="rounded-full  " src={clipboardImg} width="30px"></img>
                            <p className="font-comfortaa text-[#9290C3] text-sm font-semibold group-hover:text-[#070F2B]">Glide-History</p>
                        </div>
                        <div className=" group flex items-center gap-2   p-2 hover:bg-white rounded-4xl cursor-pointer px-4">
                            <img className="rounded-full  " src={userImg} width="30px"></img>
                            <p className="font-comfortaa text-[#9290C3] text-sm font-semibold group-hover:text-[#070F2B]">Account</p>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative w-full ">
                <div className="absolute top-0 left-0 w-full h-[550px] ">
                    <StarsBackground className="absolute inset-0 flex items-center justify-center " />
                </div>
                <section className=" relative max-w-6xl pt-60 items-center mx-auto rounded-3xl mb-40 ">
                    {active === "glide-campus" ? (
                        <div className=" rounded-2xl p-10 bg-[#080e2a] border-2 border-[#9290C3]">
                            <h1 className="text-5xl md:text-6xl font-oswald text-white leading-tight">
                                Glide Through Campus
                            </h1>
                            <p className="mt-6 text-lg font-comfortaa text-gray-300">
                                Select your source and destination to find bicycles available for your ride.
                            </p>


                            <form
                                className="mt-10 flex flex-col gap-6"
                                onSubmit={handleGlideCampusSubmit}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col">
                                        <label className="text-gray-300 font-comfortaa mb-2">
                                            Starting Point
                                        </label>
                                        <select
                                            value={campusSource}
                                            onChange={(e) => setCampusSource(e.target.value)}
                                            className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600 
                        focus:border-[#7c81f3] focus:ring-2 focus:ring-[#7c81f3] transition 
                        cursor-pointer appearance-none"
                                        >
                                            <option value="hostel-a">Boys Hostel B-1</option> <option value="hostel-b">Boys Hostel B-2</option> <option value="canteen">AB-2</option> <option value="gh-b2">Girls Hostel B-2</option> <option value="gh-b1">Girls Hostel B-1</option> <option value="mph">MPH</option> <option value="ab-1">AB-1</option> <option value="arch-lab">Architecture Lab</option> <option value="lab-complex">Lab Complex</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-gray-300 font-comfortaa mb-2">
                                            Destination
                                        </label>
                                        <select
                                            value={campusDestination}
                                            onChange={(e) => setCampusDestination(e.target.value)}
                                            className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600 
                        focus:border-[#7c81f3] focus:ring-2 focus:ring-[#7c81f3] transition 
                        cursor-pointer appearance-none"
                                        >
                                            <option value="hostel-a">Boys Hostel B-1</option> <option value="hostel-b">Boys Hostel B-2</option> <option value="canteen">AB-2</option> <option value="gh-b2">Girls Hostel B-2</option> <option value="gh-b1">Girls Hostel B-1</option> <option value="mph">MPH</option> <option value="ab-1">AB-1</option> <option value="arch-lab">Architecture Lab</option> <option value="lab-complex">Lab Complex</option>
                                        </select>
                                    </div>
                                </div>



                                <button
                                    type="submit"
                                    className="cursor-pointer mt-8 px-8 py-4 rounded-2xl 
                    bg-gradient-to-r from-[#6975c1] to-[#474a8f] 
                    text-white font-bold text-lg 
                    hover:bg-white hover:from-transparent hover:to-transparent 
                    hover:text-[#474a8f] hover:shadow-2xl 
                    transition-all duration-300"
                                >
                                    Find My Glide
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="rounded-2xl p-10 bg-[#080e2a] border-2 border-[#9290C3]">
                            <h1 className="text-5xl md:text-6xl font-oswald text-white leading-tight">
                                Glide Away from Campus
                            </h1>
                            <p className="mt-6 text-lg font-comfortaa text-gray-300">
                                Choose your source and destination to join or create groups for a shared Glide.
                            </p>


                            <form
                                className="mt-10 flex flex-col gap-6"
                                onSubmit={handleGlideAwaySubmit}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col">
                                        <label className="text-gray-300 font-comfortaa mb-2">
                                            Starting Point
                                        </label>
                                        <select
                                            value={awaySource}
                                            onChange={(e) => setAwaySource(e.target.value)}
                                            className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600 
                        focus:border-[#7c81f3] focus:ring-2 focus:ring-[#7c81f3] transition 
                        cursor-pointer appearance-none"
                                        >
                                            <option value="vit-highway">VIT Highway</option> <option value="bhopal">Bhopal</option> <option value="indore">Indore</option> <option value="rkmp">RKMP Railway Station</option> <option value="nadra-bus">Nadra Bus Stand</option> <option value="db-mall">DB Mall</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-gray-300 font-comfortaa mb-2">
                                            Destination
                                        </label>
                                        <select
                                            value={awayDestination}
                                            onChange={(e) => setAwayDestination(e.target.value)}
                                            className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600 
                        focus:border-[#7c81f3] focus:ring-2 focus:ring-[#7c81f3] transition 
                        cursor-pointer appearance-none"
                                        >
                                            <option value="vit-highway">VIT Highway</option> <option value="bhopal">Bhopal</option> <option value="indore">Indore</option> <option value="rkmp">RKMP Railway Station</option> <option value="nadra-bus">Nadra Bus Stand</option> <option value="db-mall">DB Mall</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-gray-300 font-comfortaa mb-2">
                                            Glide Date
                                        </label>
                                        <input
                                            type="date"
                                            value={awayDate}
                                            onChange={(e) => setAwayDate(e.target.value)}
                                            className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600 
                        focus:border-[#7c81f3] focus:ring-2 focus:ring-[#7c81f3] transition"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="cursor-pointer mt-8 px-8 py-4 rounded-2xl 
                    bg-gradient-to-r from-[#6975c1] to-[#474a8f] 
                    text-white font-bold text-lg 
                    hover:bg-white hover:from-transparent hover:to-transparent 
                    hover:text-[#474a8f] hover:shadow-2xl 
                    transition-all duration-300"
                                >
                                    Find My Glide
                                </button>
                            </form>
                        </div>
                    )}
                </section>
            </div>

            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
}



