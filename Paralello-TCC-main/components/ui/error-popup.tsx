"use client"

import { X, AlertCircle, CheckCircle, Info } from "lucide-react"
import { useEffect, useState } from "react"

interface ErrorPopupProps {
  message: string
  type?: "error" | "success" | "info"
  onClose: () => void
  duration?: number
}

export function ErrorPopup({ message, type = "error", onClose, duration = 5000 }: ErrorPopupProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to finish
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor =
    type === "error"
      ? "bg-red-50 border-red-200"
      : type === "success"
        ? "bg-green-50 border-green-200"
        : "bg-blue-50 border-blue-200"

  const textColor = type === "error" ? "text-red-800" : type === "success" ? "text-green-800" : "text-blue-800"

  const iconColor = type === "error" ? "text-red-500" : type === "success" ? "text-green-500" : "text-blue-500"

  const Icon = type === "error" ? AlertCircle : type === "success" ? CheckCircle : Info

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className={`${bgColor} border rounded-lg shadow-lg p-4 flex items-start gap-3`}>
        <Icon className={`${iconColor} h-5 w-5 flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <p className={`${textColor} text-sm font-medium`}>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className={`${textColor} hover:opacity-70 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Hook for managing popups
export function useErrorPopup() {
  const [popup, setPopup] = useState<{ message: string; type: "error" | "success" | "info" } | null>(null)

  const showError = (message: string) => setPopup({ message, type: "error" })
  const showSuccess = (message: string) => setPopup({ message, type: "success" })
  const showInfo = (message: string) => setPopup({ message, type: "info" })
  const closePopup = () => setPopup(null)

  return { popup, showError, showSuccess, showInfo, closePopup }
}
