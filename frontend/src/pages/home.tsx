import { useState } from "react";
import userImg from "../assets/icons/user.svg";
import clipboardImg from "../assets/icons/clipboard.svg";
import Footer from "@/components/footer";
import coinImg from "../assets/icons/coin.svg";
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import findImg from "../assets/icons/find.svg";
import addImg from "../assets/icons/add.svg";

export default function HomePage() {
    const [active, setActive] = useState("glide-campus");
    const [campusTab, setCampusTab] = useState<"find" | "add">("find");
    const [awayTab, setAwayTab] = useState<"find" | "add">("find");

    // ✅ API base URL
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    // State
    const [campusSource, setCampusSource] = useState("");
    const [campusResults, setCampusResults] = useState<any[]>([]);

    const [awaySource, setAwaySource] = useState("");
    const [awayDestination, setAwayDestination] = useState("");
    const [awayDate, setAwayDate] = useState("");
    const [awayPrice, setAwayPrice] = useState("");
    const [awayResults, setAwayResults] = useState<any[]>([]);

    const currentUserId = "66e05afc9a1234567890abcd";


    const handleGlideCampusSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (campusTab === "find") {
                const res = await fetch(`${API_BASE}/glide-campus?source=${campusSource}`);
                const data = await res.json();
                if (res.ok) {
                    setCampusResults(data.rides || []);
                    toast.success("Campus glides fetched successfully");
                } else {
                    toast.error(data.message || "Failed to fetch campus glides");
                }
            } else {
                const payload = { source: campusSource, creator: currentUserId };
                const res = await fetch(`${API_BASE}/glide-campus`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (res.ok) {
                    toast.success("Campus glide created successfully");
                } else {
                    toast.error(data.message || "Failed to create campus glide");
                }
            }
        } catch (error) {
            console.error("Error handling campus glide:", error);
            toast.error("Something went wrong");
        }
    };

    // ✅ Away Glide
    const handleGlideAwaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (awayTab === "find") {
                const query = new URLSearchParams({
                    source: awaySource,
                    destination: awayDestination,
                });
                const res = await fetch(`${API_BASE}/glide-away?${query.toString()}`);
                const data = await res.json();
                if (res.ok) {
                    setAwayResults(data.rides || []);
                    toast.success("Away glides fetched successfully");
                } else {
                    toast.error(data.message || "Failed to fetch away glides");
                }
            } else {
                const payload = {
                    source: awaySource,
                    destination: awayDestination,
                    date: awayDate,
                    price: Number(awayPrice),
                    creator: currentUserId,
                };
                const res = await fetch(`${API_BASE}/glide-away`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (res.ok) {
                    toast.success("Away glide created successfully");
                } else {
                    toast.error(data.message || "Failed to create away glide");
                }
            }
        } catch (error) {
            console.error("Error handling away glide:", error);
            toast.error("Something went wrong");
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


                    <div className="col-span-3">
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


                    <div className="col-span-6 flex gap-10">
                        {active === "glide-campus" && (
                            <div className="group flex items-center gap-2 p-2 rounded-4xl cursor-pointer hover:bg-white px-4">
                                <img className="rounded-full" src={coinImg} width="25px" />
                                <p className="font-comfortaa text-[#9290C3] text-sm font-semibold group-hover:text-[#070F2B]">
                                    Glide-Coins
                                </p>
                            </div>
                        )}
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
                <section className="relative max-w-6xl pt-60 items-center mx-auto rounded-3xl mb-40">
                    {active === "glide-campus" ? (
                        <div className="rounded-2xl p-10 bg-[#080e2a] border-2 border-[#9290C3]">
                            <h1 className="text-5xl md:text-6xl font-oswald text-white leading-tight">
                                Glide Through Campus
                            </h1>
                            <p className="mt-6 text-lg font-comfortaa text-gray-300">
                                Switch between finding or adding a campus glide 
                            </p>


                            <div className="mt-8 flex gap-4 ">
                                <button
                                    onClick={() => setCampusTab("find")}
                                    className={`justify-center flex px-4 py-2 rounded-xl font-comfortaa transition cursor-pointer items-center gap-2 ${campusTab === "find"
                                        ? "bg-[#6975c1] text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                >
                                    <img src={findImg} width="18px"></img>
                                    <p className="">Find Glide</p>
                                </button>
                                <button
                                    onClick={() => setCampusTab("add")}
                                    className={`justify-center flex px-4 py-2 rounded-xl font-comfortaa transition cursor-pointer items-center gap-2 ${campusTab === "add"
                                        ? "bg-[#6975c1] text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                ><img src={addImg} width="18px"></img>
                                    <p>Add Glide</p>
                                </button>
                            </div>


                            <div className="mt-10">
                                <AnimatePresence mode="wait">
                                    {campusTab === "find" ? (
                                        <motion.form
                                            key="find-campus"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            onSubmit={handleGlideCampusSubmit}
                                            className="flex flex-col gap-6"
                                        >
                                            <div className="flex flex-col">
                                                <label className="text-gray-300 font-comfortaa mb-2">
                                                    Source Point
                                                </label>
                                                <select
                                                    value={campusSource}
                                                    onChange={(e) => setCampusSource(e.target.value)}
                                                    className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600"
                                                >
                                                    <option value="">Select source</option>
                                                    <option value="bh-b1">Boys Hostel B-1</option>
                                                    <option value="bh-b2">Boys Hostel B-2</option>
                                                    <option value="ab2">AB-2</option>
                                                    <option value="ab1">AB-1</option>
                                                    <option value="gh-b2">Girls Hostel B-2</option>
                                                    <option value="gh-b1">Girls Hostel B-1</option>
                                                </select>
                                            </div>

                                            <button
                                                type="submit"
                                                className="cursor-pointer mt-8 px-8 py-4 rounded-2xl bg-[#474a8f] text-white font-bold text-lg hover:bg-white hover:text-[#474a8f] hover:shadow-2xl transition-all duration-300"
                                            >
                                                Find My Glide
                                            </button>
                                        </motion.form>
                                    ) : (
                                        <motion.form
                                            key="add-campus"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            onSubmit={handleGlideCampusSubmit}
                                            className="flex flex-col gap-6"
                                        >
                                            <div className="flex flex-col">
                                                <label className="text-gray-300 font-comfortaa mb-2">
                                                    Source Point
                                                </label>
                                                <select

                                                    value={campusSource}
                                                    onChange={(e) => setCampusSource(e.target.value)}

                                                    className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600"
                                                >
                                                    <option value="">Select source</option>
                                                    <option value="bh-b1">Boys Hostel B-1</option>
                                                    <option value="bh-b2">Boys Hostel B-2</option>
                                                    <option value="ab2">AB-2</option>
                                                    <option value="ab1">AB-1</option>
                                                    <option value="gh-b2">Girls Hostel B-2</option>
                                                    <option value="gh-b1">Girls Hostel B-1</option>
                                                </select>
                                            </div>

                                            <button
                                                type="submit"
                                                className="cursor-pointer mt-8 px-8 py-4 rounded-2xl bg-[#474a8f] text-white font-bold text-lg hover:bg-white hover:text-[#474a8f] hover:shadow-2xl transition-all duration-300"
                                            >
                                                Add New Glide
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl p-10 bg-[#080e2a] border-2 border-[#9290C3]">
                            <h1 className="text-5xl md:text-6xl font-oswald text-white leading-tight">
                                Glide Away From Campus
                            </h1>
                            <p className="mt-6 text-lg font-comfortaa text-gray-300">
                                Switch between finding or adding an away glide 🚐
                            </p>


                            <div className="mt-8 flex gap-4">
                                <button
                                    onClick={() => setAwayTab("find")}
                                    className={`flex justify-center gap-2 px-4 py-2 rounded-xl font-comfortaa transition cursor-pointer ${awayTab === "find"
                                        ? "bg-[#6975c1] text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                ><img src={findImg} width="18px"></img>
                                    <p>Find Glide</p>
                                </button>
                                <button
                                    onClick={() => setAwayTab("add")}
                                    className={`flex justify-center gap-2  px-4 py-2 rounded-xl font-comfortaa transition cursor-pointer ${awayTab === "add"
                                        ? "bg-[#6975c1] text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                ><img src={addImg} width="18px"></img>
                                   <p> Add Glide</p>
                                </button>
                            </div>


                            <div className="mt-10">
                                <AnimatePresence mode="wait">
                                    {awayTab === "find" ? (
                                        <motion.form
                                            key="find-away"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            onSubmit={handleGlideAwaySubmit}
                                            className="flex flex-col gap-6"
                                        >

                                            <div className="flex flex-col">
                                                <label className="text-gray-300 font-comfortaa mb-2">
                                                    Source Point
                                                </label>
                                                <select

                                                    value={awaySource}
                                                    onChange={(e) => setAwaySource(e.target.value)}

                                                    className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600"
                                                >
                                                    <option value="">Select source</option>
                                                    <option value="vit-highway">VIT Highway</option>
                                                    <option value="bhopal">Bhopal</option>
                                                    <option value="indore">Indore</option>
                                                    <option value="rkmp">RKMP Railway Station</option>
                                                    <option value="nadra-bus">Nadra Bus Stand</option>
                                                    <option value="db-mall">DB Mall</option>
                                                </select>
                                            </div>

                                            {/* Destination */}
                                            <div className="flex flex-col">
                                                <label className="text-gray-300 font-comfortaa mb-2">
                                                    Destination Point
                                                </label>
                                                <select

                                                    value={awayDestination}
                                                    onChange={(e) => setAwayDestination(e.target.value)}

                                                    className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600"
                                                ><option value="">Select Destination</option>
                                                    <option value="vit-highway">VIT Highway</option>
                                                    <option value="bhopal">Bhopal</option>
                                                    <option value="indore">Indore</option>
                                                    <option value="rkmp">RKMP Railway Station</option>
                                                    <option value="nadra-bus">Nadra Bus Stand</option>
                                                    <option value="db-mall">DB Mall</option>
                                                </select>
                                            </div>

                                            <button
                                                type="submit"
                                                className="cursor-pointer mt-8 px-8 py-4 rounded-2xl bg-[#474a8f] text-white font-bold text-lg hover:bg-white hover:text-[#474a8f] hover:shadow-2xl transition-all duration-300"
                                            >
                                                Find My Glide
                                            </button>
                                        </motion.form>
                                    ) : (
                                        <motion.form
                                            key="add-away"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            onSubmit={handleGlideAwaySubmit}
                                            className="flex flex-col gap-6"
                                        >
                                            {/* Source */}
                                            <div className="flex flex-col">
                                                <label className="text-gray-300 font-comfortaa mb-2">
                                                    Source Point
                                                </label>
                                                <select
                                                    
                                                    value={awaySource}
                                                    onChange={(e) => setAwaySource(e.target.value)}
                                                    className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600"
                                                >
                                                    <option value="">Select Source</option>
                                                    <option value="vit-highway">VIT Highway</option>
                                                    <option value="bhopal">Bhopal</option>
                                                    <option value="indore">Indore</option>
                                                    <option value="rkmp">RKMP Railway Station</option>
                                                    <option value="nadra-bus">Nadra Bus Stand</option>
                                                    <option value="db-mall">DB Mall</option>
                                                    </select>
                                            </div>


                                            <div className="flex flex-col">
                                                <label className="text-gray-300 font-comfortaa mb-2">
                                                    Destination Point
                                                </label>
                                                <select
                                                    
                                                    value={awayDestination}
                                                    onChange={(e) => setAwayDestination(e.target.value)}
                                                    
                                                    className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600"
                                                ><option value="">Select Destination</option>
                                                    <option value="vit-highway">VIT Highway</option>
                                                    <option value="bhopal">Bhopal</option>
                                                    <option value="indore">Indore</option>
                                                    <option value="rkmp">RKMP Railway Station</option>
                                                    <option value="nadra-bus">Nadra Bus Stand</option>
                                                    <option value="db-mall">DB Mall</option>
                                                    </select>
                                            </div>

                                            
                                            <div className="flex flex-col">
                                                <label className="text-gray-300 font-comfortaa mb-2">Date</label>
                                                <input
                                                    type="date"
                                                    value={awayDate}
                                                    onChange={(e) => setAwayDate(e.target.value)}
                                                    className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600"
                                                />
                                            </div>

                                            
                                            <div className="flex flex-col">
                                                <label className="text-gray-300 font-comfortaa mb-2">Price</label>
                                                <input
                                                    type="number"
                                                    value={awayPrice}
                                                    onChange={(e) => setAwayPrice(e.target.value)}
                                                    placeholder="Enter price"
                                                    className="p-4 rounded-xl bg-gray-800 text-white border border-gray-600"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="cursor-pointer mt-8 px-8 py-4 rounded-2xl bg-[#474a8f] text-white font-bold text-lg hover:bg-white hover:text-[#474a8f] hover:shadow-2xl transition-all duration-300"
                                            >
                                                Add New Glide
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                    )}
                </section>
            </div>
            {campusTab === "find" && campusResults.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Available Campus Glides</h3>
                    <ul className="space-y-3 mt-2">
                        {campusResults.map((ride, idx) => (
                            <li key={idx} className="p-3 border rounded-lg bg-gray-50">
                                <p><strong>Source:</strong> {ride.source}</p>
                                <p><strong>Creator:</strong> {ride.creator?.name || "Unknown"}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {awayTab === "find" && awayResults.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Available Away Glides</h3>
                    <ul className="space-y-3 mt-2">
                        {awayResults.map((ride, idx) => (
                            <li key={idx} className="p-3 border rounded-lg bg-gray-50">
                                <p><strong>From:</strong> {ride.source}</p>
                                <p><strong>To:</strong> {ride.destination}</p>
                                <p><strong>Date:</strong> {ride.date}</p>
                                <p><strong>Price:</strong> ₹{ride.price}</p>
                                <p><strong>Creator:</strong> {ride.creator?.name || "Unknown"}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            <div className="mt-20">
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
        </div >
    );
}



