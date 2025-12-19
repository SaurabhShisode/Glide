import { useEffect, useState } from "react"
import axios from "axios"
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars"
import Footer from "@/components/footer"
import { useNavigate } from "react-router-dom"

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api"

interface IUser {
    id: string
    name: string
    email: string
    tags?: string[]
}

interface IDayStats {
    date: string
    taken: number
    posted: number
}

type HeatCell = {
    date: string | null
    count: number | null
}

function getLast12Months() {
    const months = []
    const today = new Date()

    for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        months.push({
            year: d.getFullYear(),
            month: d.getMonth(),
            label: d.toLocaleString("en-US", { month: "short" })
        })
    }

    return months
}

export default function ProfilePage() {
    const user = JSON.parse(localStorage.getItem("glideUser") || "{}") as IUser
    const navigate = useNavigate()

    const [stats, setStats] = useState({
        takenMonth: 0,
        postedMonth: 0,
        takenTotal: 0,
        postedTotal: 0
    })

    const [heatmap, setHeatmap] = useState<IDayStats[]>([])

    useEffect(() => {
        async function loadStats() {
            const res = await axios.get(`${API_BASE}/profile/stats/${user.id}`)
            setStats(res.data.stats)
            setHeatmap(res.data.heatmap)
        }
        loadStats()
    }, [])

    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const startDate = new Date()
    startDate.setFullYear(today.getFullYear() - 1)
    startDate.setHours(0, 0, 0, 0)


    function buildMonthHeatmaps(days: IDayStats[]) {
        const map = new Map<string, number>()

        days.forEach(d => {
            map.set(d.date, d.taken + d.posted)
        })

        function format(d: Date) {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
                d.getDate()
            ).padStart(2, "0")}`
        }

        const monthsMeta = getLast12Months()
        const months: HeatCell[][][] = []

        monthsMeta.forEach(({ year, month }) => {
            const firstDay = new Date(year, month, 1)
            const lastDay = new Date(year, month + 1, 0)

            let date = new Date(firstDay)
            let monthMatrix: HeatCell[][] = []
            let week: HeatCell[] = Array.from({ length: 7 }, () => ({
                date: null,
                count: null
            }))

            const offset = date.getDay()
            for (let i = 0; i < offset; i++) {
                week[i] = { date: null, count: null }
            }

            while (date <= lastDay) {
                const dayIndex = date.getDay()
                const key = format(date)

                if (date >= startDate && date <= today) {
                    week[dayIndex] = {
                        date: key,
                        count: map.get(key) ?? 0
                    }
                } else {
                    week[dayIndex] = {
                        date: null,
                        count: null
                    }
                }

                if (dayIndex === 6) {
                    monthMatrix.push(week)
                    week = Array.from({ length: 7 }, () => ({
                        date: null,
                        count: null
                    }))
                }

                date.setDate(date.getDate() + 1)
            }


            monthMatrix.push(week)
            months.push(monthMatrix)
        })

        return months
    }

    function getColor(count: number | null) {
        if (count === null) return "transparent"
        if (count === 0) return "#1f2937"
        if (count === 1) return "#3730a3"
        if (count <= 3) return "#4f46e5"
        if (count <= 6) return "#6366f1"
        return "#a5b4fc"
    }

    function formatDMY(date: string) {
        const d = new Date(date)
        return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const monthHeatmaps = buildMonthHeatmaps(heatmap)
    const monthsMeta = getLast12Months()

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#1a0734] via-[#2d085a] to-[#682db1] pb-40">
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

            <div className="fixed h-full left-0 w-full z-0 opacity-80">
                <StarsBackground />
            </div>

            <div className="relative z-40">
                <section className="relative max-w-6xl mx-auto pt-40 px-6 text-white">
                    <div className="flex items-center gap-6 mb-12">
                        <img
                            src={`https://api.dicebear.com/6.x/thumbs/svg?seed=${user.name}`}
                            className="w-24 h-24 rounded-2xl shadow-xl"
                        />
                        <div>
                            <h1 className="text-4xl font-comfortaa font-bold">{user.name}</h1>
                            <p className="text-gray-300">{user.email}</p>

                            <div className="flex gap-3 mt-3">
                                {user.tags?.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-[#5e2da6]/40 text-[#d3b3ff] border border-[#8d5cff] rounded-xl text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {[
                            { label: "Glides Taken This Month", value: stats.takenMonth },
                            { label: "Glides Posted This Month", value: stats.postedMonth },
                            { label: "Total Glides Taken", value: stats.takenTotal },
                            { label: "Total Glides Posted", value: stats.postedTotal }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="p-6 bg-[#111827]/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl"
                            >
                                <p className="text-gray-300 text-sm mb-1">{item.label}</p>
                                <h2 className="text-3xl font-bold">{item.value}</h2>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Your Glide Activity</h2>
                    <p className="text-gray-400 mb-6">
                        A visual map of your gliding habits over the last year
                    </p>

                    <div className="shadow-2xl w-full">
                        <div className="bg-[#111827]/60 backdrop-blur-lg border border-gray-700 rounded-2xl p-5 overflow-hidden">

                          
                            <div
                                className="
        w-full
        overflow-x-auto
        overflow-y-hidden
        scrollbar-thin
        scrollbar-thumb-gray-600
        scrollbar-track-transparent
      "
                            >
                               
                                <div className="flex gap-4 w-max">
                                    {monthHeatmaps.map((month, mIdx) => (
                                        <div key={mIdx} className="flex-shrink-0">
                                            <p className="text-gray-400 text-sm mb-2 text-center font-inter">
                                                {monthsMeta[mIdx].label}
                                            </p>

                                            <div className="flex gap-[3px]">
                                                {month.map((week, w) => (
                                                    <div key={w} className="flex flex-col gap-[3px]">
                                                        {week.map((cell, d) =>
                                                            cell.count === null ? (
                                                                <div key={d} className="w-[11px] h-[11px]" />
                                                            ) : (
                                                                <div
                                                                    key={d}
                                                                    className="w-[11px] h-[11px] rounded-[2px] cursor-pointer hover:scale-125 transition"
                                                                    style={{ backgroundColor: getColor(cell.count) }}
                                                                    title={
                                                                        cell.date
                                                                            ? `${formatDMY(cell.date)} • ${cell.count} glides`
                                                                            : ""
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>



                </section>

                <Footer />
            </div>
        </div>
    )
}
