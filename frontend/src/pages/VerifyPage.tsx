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
  phoneVerified: boolean
}

declare global {
  interface Window {
    initSendOTP: any
  }
}

export default function VerifyPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("glideUser") || "{}") as IUser
  const token = localStorage.getItem("token")

  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user.emailVerified && user.phoneVerified) {
      navigate("/home")
    }
  }, [])

  useEffect(() => {
  if (document.getElementById("msg91-otp-script")) return

  const urls = [
    "https://verify.msg91.com/otp-provider.js",
    "https://verify.phone91.com/otp-provider.js"
  ]

  let i = 0

  function load() {
    const s = document.createElement("script")
    s.id = "msg91-otp-script"
    s.src = urls[i]
    s.async = true
    s.onerror = () => {
      i++
      if (i < urls.length) load()
    }
    document.head.appendChild(s)
  }

  load()
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

  const sendOtp = () => {
    if (loading) return

    if (!phone.startsWith("+")) {
      toast.error("Use country code like +91XXXXXXXXXX")
      return
    }

    if (!window.initSendOTP) {
      toast.error("OTP service not ready")
      return
    }

    setLoading(true)

    const configuration = {
      widgetId: import.meta.env.VITE_MSG91_WIDGET_ID,
      tokenAuth: import.meta.env.VITE_MSG91_TOKEN_AUTH,
      identifier: phone,
      exposeMethods: true,

      success: async () => {
        try {
          await axios.post(
            `${API_BASE}/auth/verify-phone`,
            { phone },
            { headers: { "x-auth-token": token } }
          )

          localStorage.setItem(
            "glideUser",
            JSON.stringify({ ...user, phoneVerified: true })
          )

          toast.success("Phone verified successfully")
          navigate("/home")
        } catch {
          toast.error("Phone verification failed")
        } finally {
          setLoading(false)
        }
      },

      failure: () => {
        toast.error("OTP verification failed")
        setLoading(false)
      }
    }

    window.initSendOTP(configuration)
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
          Verify your identity to unlock rides
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
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Phone verification</h3>
            {user.phoneVerified && (
              <span className="text-emerald-400 text-xs">Verified</span>
            )}
          </div>

          {!user.phoneVerified && (
            <>
              <input
                className="w-full mb-3 px-4 py-3 rounded-xl bg-[#140b2e] border border-[#ffffff1a] text-white outline-none"
                placeholder="+91XXXXXXXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#6f12f0] text-white font-semibold hover:bg-[#5e14c6] transition cursor-pointer"
              >
                Verify phone number
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Glide uses secure OTP verification
        </p>
      </motion.div>
    </div>
  )
}
