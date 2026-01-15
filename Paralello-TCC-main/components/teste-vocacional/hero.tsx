"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

function getBypassUser(): string | null {
  if (typeof document === "undefined") return null
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "bypass_user") {
      return decodeURIComponent(value)
    }
  }
  return null
}

interface TesteVocacionalHeroProps {
  isAuthenticated: boolean
}

export function TesteVocacionalHero({ isAuthenticated: serverAuth }: TesteVocacionalHeroProps) {
  const [isBypassUser, setIsBypassUser] = useState(false)

  useEffect(() => {
    const bypassUser = getBypassUser()
    if (bypassUser) {
      setIsBypassUser(true)
    }
  }, [])

  const isAuthenticated = serverAuth || isBypassUser

  return (
    <section className="relative bg-[#E91E63] overflow-hidden">
      {/* Wave pattern at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path d="M0 120V60C240 20 480 0 720 0C960 0 1200 20 1440 60V120H0Z" fill="white" />
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-32 relative z-10">
        {/* Logo */}
        <div className="flex justify-start mb-8">
          
        </div>

        {/* Content */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight uppercase">
            Qual área combina comigo?
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10">
            Em apenas 10 minutos, tenha ideia da carreira que você mais se encaixa
          </p>

          {isAuthenticated ? (
            <Link href="/fazer-teste">
              <Button
                size="lg"
                className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white rounded-full px-8 py-6 text-lg font-semibold gap-2"
              >
                Fazer teste
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button
                size="lg"
                className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white rounded-full px-8 py-6 text-lg font-semibold gap-2"
              >
                Fazer teste
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
