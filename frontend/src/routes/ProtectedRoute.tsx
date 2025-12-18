import type { JSX } from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const user = JSON.parse(localStorage.getItem("glideUser") || "null")

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!user.emailVerified || !user.phoneVerified) {
    return <Navigate to="/verify" replace />
  }

  return children
}
