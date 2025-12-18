import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api"

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] =
    useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const token = params.get("token")

    if (!token) {
      setStatus("error")
      return
    }

    axios
      .get(`${API_BASE}/auth/verify-email?token=${token}`)
      .then(() => {
        const user = JSON.parse(localStorage.getItem("glideUser") || "{}")
        user.emailVerified = true
        localStorage.setItem("glideUser", JSON.stringify(user))
        setStatus("success")
        setTimeout(() => navigate("/verify"), 2000)
      })
      .catch(() => {
        setStatus("error")
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090014] via-[#120027] to-[#1a003d] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md rounded-2xl bg-[#0b061a]/80 backdrop-blur-2xl border border-[#ffffff1a] shadow-[0_0_80px_#7c3aed40] p-8 text-center"
      >
        <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br from-purple-500/10 to-indigo-500/10" />

        {status === "loading" && (
          <>
            <div className="w-10 h-10 mx-auto mb-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Verifying your email
            </h2>
            <p className="text-gray-400 text-sm">
              Please wait while we secure your Glide account
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-2xl">
              ✓
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Email verified successfully
            </h2>
            <p className="text-gray-400 text-sm">
              Redirecting you to complete verification
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 text-2xl">
              !
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Verification failed
            </h2>
            <p className="text-gray-400 text-sm">
              This link may be invalid or expired
            </p>
          </>
        )}

        <p className="text-xs text-gray-500 mt-8">
          Glide uses secure verification to protect your account
        </p>
      </motion.div>
    </div>
  )
}
