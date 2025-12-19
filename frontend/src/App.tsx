import { BrowserRouter, Routes, Route } from "react-router-dom"

import LandingPage from "./pages/landingpage"
import HomePage from "./pages/home"
import HistoryPage from "./pages/history"
import ProfilePage from "./pages/profile"
import VerifyPage from "./pages/VerifyPage"
import VerifyEmailPage from "./pages/verifyEmailPage"

import ProtectedRoute from "./routes/ProtectedRoute"
import { ToastContainer } from "react-toastify"

function App() {
  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    <BrowserRouter>
      <Routes>

        
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

       
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
