import { useState, useEffect } from "react";
import userImg from "../assets/icons/user.svg";
import clipboardImg from "../assets/icons/clipboard.svg";
import Footer from "@/components/footer";
import coinImg from "../assets/icons/coin.svg";
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import findImg from "../assets/icons/find.svg";
import addImg from "../assets/icons/add.svg";
import BouncingDotsLoader from "@/components/bouncingdotsloader";

export default function HomePage() {
    const [active, setActive] = useState("glide-campus");
    const [campusTab, setCampusTab] = useState<"find" | "add">("find");
    const [awayTab, setAwayTab] = useState<"find" | "add">("find");
    const [loadingGlides, setLoadingGlides] = useState(false);
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    const [campusSource, setCampusSource] = useState("");
    const [campusResults, setCampusResults] = useState<any[]>([]);

    const [awaySource, setAwaySource] = useState("");
    const [awayDestination, setAwayDestination] = useState("");
    const [awayDate, setAwayDate] = useState("");
    const [awayPrice, setAwayPrice] = useState("");
    const [awayResults, setAwayResults] = useState<any[]>([]);

    const [user, setUser] = useState<any>(null);


    useEffect(() => {
        const storedUser = localStorage.getItem("glideUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);


    const handleGlideCampusSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (campusTab === "find") {
                setLoadingGlides(true);
                const res = await fetch(`${API_BASE}/glide-campus?source=${campusSource}`);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const data = await res.json();
                if (res.ok) {
                    setCampusResults(data.rides || []);

                } else {
                    toast.error(data.message || "Failed to fetch campus glides");
                }

            } else {
                if (!user) {
                    toast.error("You must be logged in to create a campus glide");
                    return;
                }
                const payload = { source: campusSource, creator: user.id };
                console.log(payload.creator);
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
        } finally {
            setLoadingGlides(false);
        }
    };


    const handleGlideAwaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (awayTab === "find") {
                setLoadingGlides(true);
                const query = new URLSearchParams({
                    source: awaySource,
                    destination: awayDestination,
                });
                await new Promise((resolve) => setTimeout(resolve, 2000));
                const res = await fetch(`${API_BASE}/glide-away?${query.toString()}`);
                const data = await res.json();
                if (res.ok) {
                    setAwayResults(data.rides || []);

                } else {
                    toast.error(data.message || "Failed to fetch away glides");
                }
            } else {
                alert(JSON.stringify(user))
                if (!user) {
                    toast.error("You must be logged in to create an away glide");
                    return;
                }
                if (!awaySource || !awayDestination || !awayDate || !awayPrice) {
                    toast.error(" required");
                    return;
                }
                const payload = {
                    source: awaySource,
                    destination: awayDestination,
                    date: awayDate,
                    price: Number(awayPrice),
                    creator: user.id,
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
        } finally {
            setLoadingGlides(false);
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
                                <img className="rounded-full" src={coinImg} width="23px" />
                                <p className="font-comfortaa text-[#9290C3] text-base font-semibold group-hover:text-[#070F2B]">
                                    {user?.glidePoints ?? 0}
                                </p>
                            </div>
                        )}
                        <div className="group flex items-center gap-2  p-2 rounded-4xl cursor-pointer hover:bg-white px-4">
                            <img className="rounded-full  " src={clipboardImg} width="30px"></img>
                            <p className="font-comfortaa text-[#9290C3] text-sm font-semibold group-hover:text-[#070F2B]">Glide-History</p>
                        </div>
                        <div className="group flex items-center gap-2 p-2 hover:bg-white rounded-4xl cursor-pointer px-4">
                            <img className="rounded-full" src={userImg} width="30px" />
                            <p className="font-comfortaa text-[#9290C3] text-sm font-semibold group-hover:text-[#070F2B]">
                                Hello, {user?.name ?? "Lion"}
                            </p>
                        </div>

                    </div>
                </div>
            </nav>

            <div className="relative w-full mb-[-44px]">
                <div className="absolute top-0 left-0 w-full h-[550px] ">
                    <StarsBackground className="absolute inset-0 flex items-center justify-center " />
                </div>
                <section className="relative max-w-4xl pt-60 items-center mx-auto rounded-3xl mb-20">
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
                                                    <option value="Boys Hostel B-1">Boys Hostel B-1</option>
                                                    <option value="Boys Hostel B-1">Boys Hostel B-1</option>
                                                    <option value="AB-2">AB-2</option>
                                                    <option value="AB-1">AB-1</option>
                                                    <option value="Girls Hostel B-2">Girls Hostel B-2</option>
                                                    <option value="Girls Hostel B-1">Girls Hostel B-1</option>
                                                </select>
                                            </div>

                                            <button
                                                type="submit"
                                                className="cursor-pointer mt-8 px-8 py-4 rounded-2xl bg-[#474a8f] text-white font-bold text-lg hover:bg-[#6d72ff] font-comfortaa hover:shadow-2xl transition-all duration-300"
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
                                                    <option value="Boys Hostel B-1">Boys Hostel B-1</option>
                                                    <option value="Boys Hostel B-1">Boys Hostel B-1</option>
                                                    <option value="AB-2">AB-2</option>
                                                    <option value="AB-1">AB-1</option>
                                                    <option value="Girls Hostel B-2">Girls Hostel B-2</option>
                                                    <option value="Girls Hostel B-1">Girls Hostel B-1</option>
                                                </select>
                                            </div>

                                            <button
                                                type="submit"
                                                className="cursor-pointer mt-8 px-8 py-4 rounded-2xl bg-[#474a8f] text-white font-bold text-lg hover:bg-[#6d72ff] font-comfortaa hover:shadow-2xl transition-all duration-300"
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
                                                    <option value="VIT Highway">VIT Highway</option>
                                                    <option value="Bhopal">Bhopal</option>
                                                    <option value="Indore">Indore</option>
                                                    <option value="RKMP Railway Station">RKMP Railway Station</option>
                                                    <option value="Nadra Bus Stand">Nadra Bus Stand</option>
                                                    <option value="DB Mall">DB Mall</option>
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
                                                    <option value="VIT Highway">VIT Highway</option>
                                                    <option value="Bhopal">Bhopal</option>
                                                    <option value="Indore">Indore</option>
                                                    <option value="RKMP Railway Station">RKMP Railway Station</option>
                                                    <option value="Nadra Bus Stand">Nadra Bus Stand</option>
                                                    <option value="DB Mall">DB Mall</option>
                                                </select>
                                            </div>

                                            <button
                                                type="submit"
                                                className="cursor-pointer mt-8 px-8 py-4 rounded-2xl bg-[#474a8f] text-white font-bold text-lg hover:bg-[#6d72ff] font-comfortaa hover:shadow-2xl transition-all duration-300"
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
                                                className="cursor-pointer mt-8 px-8 py-4 rounded-2xl bg-[#474a8f] text-white  text-lg hover:bg-[#6d72ff] hover:shadow-2xl font-bold transition-all duration-300 font-comfortaa"
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
            {loadingGlides && (
                <div className="flex justify-center items-center text-white/80 mt[-20px] mb-20">
                    <BouncingDotsLoader />
                </div>

            )}

            {campusTab === "find" && active === "glide-campus" && (
                <div className="mx-40">
                    {campusResults.length > 0 ? (
                        <div>
                            <h3 className="text-xl font-semibold text-white font-poppins mb-7 mt-10">
                                Available Campus Glides
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {campusResults.map((ride, idx) => (
                                    <li
                                        key={idx}
                                        className="p-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform  font-comfortaa cursor-pointer"
                                    >
                                        <div className="flex flex-col gap-5">

                                            <span className=" text-lg  w-max
                                            ml-2 px-4 py-2 pt-3 rounded-lg justify-center text-center font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30  tracking-wide">
                                                {ride.source}
                                            </span>

                                            <span className="px-3 py-1 rounded-xl  text-white text-lg font-medium w-max">
                                                <span className="text-gray-400">Glide-owner:</span> {ride.creator?.name || "Unknown"}
                                            </span>
                                            <button className="text-white text-lg bg-[#474a8f] px-5 p-3 rounded-xl cursor-pointer hover:bg-[#6d72ff] transition duration-300 font-comfortaa">
                                               Book
                                            </button>
                                        </div>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div>

                            <h1 className="font-oswald text-5xl text-white text-center">Walking ain't that bad.</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-center py-5">
                                No campus glides found. Try searching with a different source.
                            </p>
                        </div>
                    )}
                </div>
            )}


            {awayTab === "find" && active !== "glide-campus" && (
                <div className="mx-40">


                    {awayResults.length > 0 ? (
                        <div>
                            <h3 className="text-xl font-semibold text-white font-poppins mb-4">
                                Available Away Glides
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {awayResults.map((ride, idx) => (
                                    <li
                                        key={idx}
                                        className="p-6 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2 font-comfortaa"
                                    >

                                        <div className="flex items-center justify-between mb-4">
                                            <span className="px-3 py-1 rounded-xl bg-[#474a8f] text-white text-base font-medium">
                                                {ride.source}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                                                ➝
                                            </span>
                                            <span className="px-3 py-1 rounded-xl bg-[#474a8f] text-white text-base font-medium">
                                                {ride.destination}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                                            <p>
                                                <span className="font-semibold">Date:</span> {ride.date}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Price:</span> ₹{ride.price}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Creator:</span>{" "}
                                                {ride.creator?.name || "Unknown"}
                                            </p>
                                        </div>

                                        <button className="mt-5 w-full px-4 py-2 bg-[#474a8f] text-white rounded-xl font-medium shadow-sm hover:bg-[#6062db] hover:shadow-md transition duration-300 cursor-pointer">
                                            Request Ride
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <h1 className="font-oswald text-5xl text-white text-center">No Away glides found.</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-center py-5">
                                Why not create one and be the first?
                            </p>
                        </div>
                    )}
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



