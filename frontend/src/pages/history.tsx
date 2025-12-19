import { useEffect, useState } from "react"
import axios from "axios"
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars"
import Footer from "@/components/footer"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api"

interface IUser {
    id: string
    name: string
    email: string
    phone?: string
}


interface IRide {
    _id: string
    source: string
    destination?: string
    price?: number
    creator?: IUser
    taker?: IUser
    members?: IUser[]
    bookedAt: string
    glideType: "campus" | "away"
    date?: string
    departureTime?: string
    whatsappGroup?: string | null
}


interface IHistoryResponse {
    taken: IRide[]
    posted: IRide[]
}

export default function HistoryPage() {
    const [loading, setLoading] = useState(true)
    const [history, setHistory] = useState<IHistoryResponse>({
        taken: [],
        posted: []
    })
    const [activeTab, setActiveTab] = useState<"taken" | "posted">("taken")

    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("glideUser") || "{}") as IUser

    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await axios.get<IHistoryResponse>(
                    `${API_BASE}/glide/history/${user.id}`
                )
                setHistory(res.data)
            } finally {
                setLoading(false)
            }
        }

        if (user?.id) fetchHistory()
        else navigate("/login")
    }, [])

    if (loading) {
        return (
            <div className="w-full h-screen bg-gradient-to-b from-[#1a0734] via-[#2d085a] to-[#682db1] flex items-center justify-center text-white text-xl font-grotesk">
                Loading your Glide history
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-[#1a0734] via-[#2d085a] to-[#682db1] pb-40">
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
                            Hello, {user.name}
                        </p>
                    </div>
                </div>
            </nav>

            <div className="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] z-0">
                <StarsBackground />
            </div>

            <div className="relative z-20">
                <section className="max-w-5xl pt-60 mx-auto px-6">
                    <h1 className="text-5xl font-grotesk text-white mb-4">
                        Your Glide History
                    </h1>

                    <div className="flex gap-4 mb-10">
                        <button
                            onClick={() => setActiveTab("taken")}
                            className={`px-6 py-3 rounded-xl font-grotesk transition cursor-pointer ${activeTab === "taken"
                                ? "bg-[#682db1] text-white shadow-xl"
                                : "bg-[#2d085a] text-gray-300"
                                }`}
                        >
                            Glides You Took
                        </button>

                        <button
                            onClick={() => setActiveTab("posted")}
                            className={`px-6 py-3 rounded-xl font-grotesk transition cursor-pointer ${activeTab === "posted"
                                ? "bg-[#682db1] text-white shadow-xl"
                                : "bg-[#2d085a] text-gray-300"
                                }`}
                        >
                            Glides You Posted
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GlideList
                                data={activeTab === "taken" ? history.taken : history.posted}
                                type={activeTab}
                            />
                        </motion.div>
                    </AnimatePresence>
                </section>
                <Footer />
            </div>
        </div>
    )
}

function GlideList({
    data,
    type
}: {
    data: IRide[]
    type: "taken" | "posted"
}) {
    const [open, setOpen] = useState<string | null>(null)

    if (data.length === 0) {
        return (
            <p className="text-gray-400 font-grotesk">
                {type === "taken"
                    ? "You have not taken any glides yet."
                    : "None of your glides have been booked yet."}
            </p>
        )
    }

    return (
        <ul className="grid grid-cols-1 gap-8">
            {data.map(ride => {
                const isOpen = open === ride._id
                const otherPerson =
                    type === "taken"
                        ? ride.creator?.name
                        : ride.glideType === "campus"
                            ? ride.taker?.name
                            : `${ride.members?.length || 0} members`

                return (
                    <li
                        key={ride._id}
                        onClick={() => setOpen(isOpen ? null : ride._id)}
                        className="p-6 bg-[#111827] border border-gray-700 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer font-poppins"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-white text-lg">
                                {ride.glideType === "campus"
                                    ? `${ride.source}`
                                    : `${ride.source} → ${ride.destination}`}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {new Date(ride.bookedAt).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true
                                })}

                            </p>
                        </div>

                        <p className="text-gray-300 ">
                            {type === "taken"
                                ? `Booked from ${otherPerson}`
                                : `Booked by ${otherPerson}`}
                        </p>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3 }}
>
    <div className="mt-4 text-gray-300 text-sm space-y-3">

        {ride.price && (
            <p>
                <span className="text-gray-400">Price:</span> ₹{ride.price}
            </p>
        )}

        {ride.glideType === "away" && ride.date && (
            <p>
                <span className="text-gray-400">Departure Date:</span>{" "}
                {new Date(ride.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })}
            </p>
        )}

        {ride.glideType === "away" && ride.departureTime && (
            <p>
                <span className="text-gray-400">Departure Time:</span>{" "}
                {new Date(`1970-01-01T${ride.departureTime}`).toLocaleTimeString(
                    "en-IN",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    }
                )}
            </p>
        )}

        {type === "taken" && ride.creator && (
            <>
                <p>
                    <span className="text-gray-400">Owner Email:</span>{" "}
                    {ride.creator.email}
                </p>

                <p>
                    <span className="text-gray-400">Owner Phone:</span>{" "}
                    {ride.creator.phone ? (
                        <a
                            href={`tel:${ride.creator.phone}`}
                            className="text-[#8e7fff] hover:underline"
                            onClick={e => e.stopPropagation()}
                        >
                            {ride.creator.phone}
                        </a>
                    ) : (
                        "Not provided"
                    )}
                </p>
            </>
        )}

        {type === "posted" && ride.glideType === "campus" && ride.taker && (
            <>
                <p>
                    <span className="text-gray-400">Booker Email:</span>{" "}
                    {ride.taker.email}
                </p>

                <p>
                    <span className="text-gray-400">Booker Phone:</span>{" "}
                    {ride.taker.phone ? (
                        <a
                            href={`tel:${ride.taker.phone}`}
                            className="text-[#8e7fff] hover:underline"
                            onClick={e => e.stopPropagation()}
                        >
                            {ride.taker.phone}
                        </a>
                    ) : (
                        "Not provided"
                    )}
                </p>
            </>
        )}

        {ride.glideType === "away" && ride.members && (
            <p>
                <span className="text-gray-400">Total Members:</span>{" "}
                {ride.members.length}
            </p>
        )}

        {ride.glideType === "away" && ride.whatsappGroup && (
            <p>
                <span className="text-gray-400">WhatsApp Group:</span>{" "}
                <a
                    href={ride.whatsappGroup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline"
                    onClick={e => e.stopPropagation()}
                >
                    Join Group
                </a>
            </p>
        )}

    </div>
</motion.div>


                            )}
                        </AnimatePresence>
                    </li>
                )
            })}
        </ul>
    )
}
