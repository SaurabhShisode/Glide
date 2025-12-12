import { useEffect, useState } from "react";
import axios from "axios";
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars";
import Footer from "@/components/footer";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api";

interface IUser {
    id: string;
    name: string;
    email: string;
}

interface IRide {
    _id: string;
    source: string;
    price?: number;
    bookedAt: string;
    creator?: IUser;
    taker?: IUser;
}

interface IHistoryResponse {
    taken: IRide[];
    posted: IRide[];
}

export default function HistoryPage() {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<IHistoryResponse>({
        taken: [],
        posted: []
    });

    const [activeTab, setActiveTab] = useState<"taken" | "posted">("taken");

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("glideUser") || "{}") as IUser;

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await axios.get<IHistoryResponse>(
                    `${API_BASE}/glide/history/${user.id}`
                );
                setHistory(res.data);
            } finally {
                setLoading(false);
            }
        }

        if (user?.id) fetchHistory();
        else navigate("/login");
    }, []);

    if (loading)
        return (
            <>
                <div className="w-full bg-gradient-to-b 
      from-[#1a0734] via-[#2d085a] to-[#682db1] h-screen flex items-center justify-center text-white text-xl font-grotesk">
                    Loading your Glide history
               
                </div>
                
            </>
        );

    return (
        <div className="w-full min-h-screen bg-gradient-to-b 
      from-[#1a0734] via-[#2d085a] to-[#682db1] pb-40">

            <nav className="fixed w-full left-0 z-50 pt-5 pb-2 bg-[#1a0734] shadow-2xl">
                <div className="grid grid-cols-12 mx-5 px-6 items-center h-16">
                    <div className="col-span-3">
                        <h1
                            className="text-3xl font-comfortaa font-bold text-[#9290C3] cursor-pointer"
                            onClick={() => navigate("/home")}
                        >
                            Glide
                        </h1>
                    </div>
                    <div className="col-span-9 flex justify-end">
                        <p className="font-grotesk text-white text-lg">
                            Hello, {user?.name}
                        </p>
                    </div>
                </div>
            </nav>
            <div className="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] z-0">
                <StarsBackground />
            </div>

            <div className="relative w-full z-20">





                <section className="relative max-w-5xl pt-60 mx-auto px-6">

                    <h1 className="text-5xl font-grotesk text-white mb-4">
                        Your Glide History
                    </h1>

                    <p className="text-gray-300 font-grotesk text-lg mb-12">
                        View all your taken and posted glides.
                    </p>


                    <div className="flex gap-4 mb-10">
                        <button
                            onClick={() => setActiveTab("taken")}
                            className={`px-6 py-3 rounded-xl cursor-pointer font-grotesk transition 
                ${activeTab === "taken"
                                    ? "bg-[#682db1] text-white shadow-xl"
                                    : "bg-[#2d085a] text-gray-300 hover:bg-[#3c0b6f]"
                                }`}
                        >
                            Glides You Took
                        </button>

                        <button
                            onClick={() => setActiveTab("posted")}
                            className={`px-6 py-3 rounded-xl cursor-pointer font-grotesk transition 
                ${activeTab === "posted"
                                    ? "bg-[#682db1] text-white shadow-xl"
                                    : "bg-[#2d085a] text-gray-300 hover:bg-[#3c0b6f]"
                                }`}
                        >
                            Glides You Posted
                        </button>
                    </div>


                    <AnimatePresence mode="wait">
                        {activeTab === "taken" ? (
                            <motion.div
                                key="taken"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <GlideList data={history.taken} type="taken" user={user} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="posted"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <GlideList data={history.posted} type="posted" user={user} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
                <Footer />
            </div>


        </div>
    );
}




function GlideList({
    data,
    type,

}: {
    data: IRide[];
    type: "taken" | "posted";
    user: IUser;
}) {
    const [open, setOpen] = useState<string | null>(null);

    if (data.length === 0)
        return (
            <p className="text-gray-400 font-grotesk">
                {type === "taken"
                    ? "You have not taken any glides yet."
                    : "None of your glides have been booked yet."}
            </p>
        );

    return (
        <ul className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {data.map((ride) => {
                const otherPerson =
                    type === "taken" ? ride.creator?.name : ride.taker?.name;

                const isOpen = open === ride._id;

                return (
                    <li
                        key={ride._id}
                        onClick={() => setOpen(isOpen ? null : ride._id)}
                        className="p-6 bg-[#111827] border border-gray-700 rounded-2xl shadow-md 
              hover:shadow-xl hover:scale-[1.02] transition-all duration-300 
              text-white font-grotesk backdrop-blur-lg cursor-pointer"
                    >

                        <div className="flex items-center justify-between w-full mb-2">
                            {type === "taken" ? (
                                <p className="text-lg">
                                    You booked a glide from{" "}
                                    <span className="text-[#8e7fff] font-semibold">{ride.source}</span>{" "}
                                    by <span className="font-semibold">{otherPerson}</span>.
                                </p>
                            ) : (
                                <p className="text-lg">
                                    Your glide from{" "}
                                    <span className="text-[#8e7fff] font-semibold">{ride.source}</span>{" "}
                                    was booked by <span className="font-semibold">{otherPerson}</span>.
                                </p>
                            )}

                            <p className="text-gray-300 text-sm whitespace-nowrap ml-4">
                                {new Date(ride.bookedAt).toLocaleString()}
                            </p>
                        </div>


                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className=" overflow-hidden"
                                >
                                    <div className="p-4  rounded-xl  ">
                                        <p className="text-gray-300 text-sm mb-2">
                                            Source: {ride.source}
                                        </p>

                                        {ride.price && (
                                            <p className="text-gray-300 text-sm mb-2">
                                                Price: ₹{ride.price}
                                            </p>
                                        )}

                                        <p className="text-gray-300 text-sm mb-2">
                                            {type === "taken"
                                                ? `Owner Email: ${ride.creator?.email}`
                                                : `Booker Email: ${ride.taker?.email}`}
                                        </p>

                                        <p className="text-gray-300 text-sm">
                                            Booked At: {new Date(ride.bookedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </li>
                );
            })}
        </ul>
    );
}
