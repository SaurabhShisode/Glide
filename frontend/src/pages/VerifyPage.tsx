import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api"

interface IUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  phone?: string
}

export default function VerifyPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [user, setUser] = useState<IUser | null>(null)
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/auth/me`,
          { headers: { "x-auth-token": token } }
        )

        setUser(res.data)
        localStorage.setItem("glideUser", JSON.stringify(res.data))

        if (res.data.emailVerified && res.data.phone) {
          navigate("/home")
        }
      } catch {
        toast.error("Failed to fetch verification status")
      }
    }

    fetchUser()
  }, [])

  const sendEmailVerification = async () => {
    try {
      setLoading(true)
      await axios.post(
        `${API_BASE}/auth/send-email-verification`,
        {},
        { headers: { "x-auth-token": token } }
      )
      toast.success("Verification email sent")
    } catch {
      toast.error("Failed to send verification email")
    } finally {
      setLoading(false)
    }
  }

  const savePhone = async () => {
    if (!phone) {
      toast.error("Enter phone number")
      return
    }

    try {
      setLoading(true)
      await axios.post(
        `${API_BASE}/auth/save-phone`,
        { phone },
        { headers: { "x-auth-token": token } }
      )

      const updatedUser = { ...user!, phone }
      setUser(updatedUser)
      localStorage.setItem("glideUser", JSON.stringify(updatedUser))

      toast.success("Phone number saved")
      navigate("/home")
    } catch {
      toast.error("Failed to save phone number")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090014] via-[#120027] to-[#1a003d] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md rounded-2xl bg-[#0b061a]/80 backdrop-blur-2xl border border-[#ffffff1a] shadow-[0_0_80px_#7c3aed40] p-8"
      >
        <h1 className="text-3xl font-bold text-white mb-1">
          Secure your Glide account
        </h1>
        <p className="text-gray-400 mb-8 text-sm">
          Verify your email and add your phone number
        </p>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Email verification</h3>
            {user.emailVerified && (
              <div className="flex items-center gap-1 text-emerald-400 text-xs">
                <Check size={16} /> Verified
              </div>
            )}
          </div>

          {!user.emailVerified && (
            <button
              onClick={sendEmailVerification}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#6f12f0] text-white font-semibold hover:bg-[#5e14c6] transition cursor-pointer"
            >
              Send verification email
            </button>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2">Phone number</h3>

          <input
            className="w-full mb-3 px-4 py-3 rounded-xl bg-[#140b2e] border border-[#ffffff1a] text-white outline-none"
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />

          <button
            onClick={savePhone}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#6f12f0] text-white font-semibold hover:bg-[#5e14c6] transition cursor-pointer"
          >
            Save phone number
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Glide stores your phone number for contact purposes only
        </p>
      </motion.div>
    </div>
  )
}
