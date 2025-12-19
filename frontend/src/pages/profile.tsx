import { useEffect, useState } from "react"
import axios from "axios"
import { StarsBackground } from "@/components/animate-ui/backgrounds/stars"
import Footer from "@/components/footer"

import { useNavigate } from "react-router-dom";
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

export default function ProfilePage() {
    const user = JSON.parse(localStorage.getItem("glideUser") || "{}") as IUser

    const [stats, setStats] = useState({
        takenMonth: 0,
        postedMonth: 0,
        takenTotal: 0,
        postedTotal: 0
    })
    const navigate = useNavigate();
    const [heatmap, setHeatmap] = useState<IDayStats[]>([])

    useEffect(() => {
    async function loadStats() {
        const res = await axios.get(`${API_BASE}/profile/stats/${user.id}`)

       
        setStats(res.data.stats)
        setHeatmap(res.data.heatmap)
    }
    loadStats()
}, [])


function generateGitHubHeatmap(days: IDayStats[]) {
    const year = new Date().getFullYear()

  
    const start = new Date(year, 0, 1)
    start.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(23, 59, 59, 999)


    const map = new Map<string, number>()
    days.forEach(d => map.set(d.date, d.taken + d.posted))

    const matrix: { date: string | null; count: number | null }[][] = []

    let week = Array.from({ length: 7 }, () => ({ date: null as string | null, count: null as number | null }))

    let date = new Date(start)


    const offset = date.getDay()
    for (let i = 0; i < offset; i++) {
        week[i] = { date: null, count: null }
    }

    function formatLocal(d: Date) {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
    }

  
    while (date <= today) {

        const formatted = formatLocal(date)
        const dayIndex = date.getDay()

        const count = map.get(formatted) ?? 0

        week[dayIndex] = {
            date: formatted,
            count: count
        }

        if (dayIndex === 6) {
            matrix.push(week)
            week = Array.from({ length: 7 }, () => ({ date: null, count: null }))
        }

     
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    }

    
    matrix.push(week)

    return matrix
}





    function getColor(count: number | null) {
    if (count === null) return "transparent"
    if (count === 0) return "#1f1133"      
    if (count === 1) return "#3a2a5f"      
    if (count <= 3) return "#5a47a0"        
    if (count <= 6) return "#7b63d9"      
    return "#9e85ff"                        
}


    const matrix = generateGitHubHeatmap(heatmap)
    function formatDMY(date: string) {
        const [y, m, d] = date.split("-")
        return `${d}-${m}-${y}`
    }

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
                                        className="px-3 py-1 bg-[#5e2da6]/40 text-[#d3b3ff] border border-[#8d5cff] rounded-xl text-sm font-grotesk"
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
                                className="p-6 bg-[#111827]/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl hover:scale-[1.03] transition duration-300"
                            >
                                <p className="text-gray-300 text-sm mb-1">{item.label}</p>
                                <h2 className="text-3xl font-grotesk font-bold">{item.value}</h2>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-3xl font-grotesk font-bold mb-2">Your Glide Activity</h2>
                    <p className="text-gray-400 mb-6">A visual map of your gliding habits this year</p>

                    <div className="flex gap-[4px] pb-4 ">
                        {matrix.map((week, w) => (
                            <div key={w} className="flex flex-col gap-[4px]">
                                {week.map((cell, d) => (
                                    cell.count === null ? (

                                        
                                        <div key={d} className="w-4 h-4" />

                                    ) : (

                                    
                                        <div
                                            key={d}
                                            className="w-4 h-4 rounded-[3px] border border-[#ffffff15] hover:scale-125 transition cursor-pointer"
                                            style={{ backgroundColor: getColor(cell.count) }}
                                            title={
  cell.date
    ? `${formatDMY(cell.date)} • ${cell.count} glides`
    : ""
}

                                        />
                                    )
                                ))}

                            </div>
                        ))}
                    </div>

                </section>

                <Footer />
            </div>
        </div>
    )
}
