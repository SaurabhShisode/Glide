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
}

export default function VerifyPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("glideUser") || "{}") as IUser
  const token = localStorage.getItem("token")

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user.emailVerified) {
      navigate("/home")
    }
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
          Verify your email to unlock rides
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

        <p className="text-xs text-gray-500 text-center mt-6">
          Glide uses secure email verification
        </p>
      </motion.div>
    </div>
  )
}
