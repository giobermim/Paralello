"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signup } from "@/app/auth/actions"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { ErrorPopup, useErrorPopup } from "@/components/ui/error-popup"
import { TermsDialog } from "@/components/terms-dialog"

export default function CadastroPage() {
  const router = useRouter()
  const { popup, showError, showSuccess, closePopup } = useErrorPopup()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const email = formData.get("email") as string
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showError("Por favor, insira um email válido.")
      setIsLoading(false)
      return
    }

    // Validate username (3-20 characters, alphanumeric and underscore)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(username)) {
      showError("O nome de usuário deve ter entre 3 e 20 caracteres e conter apenas letras, números e underscore (_).")
      setIsLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres.")
      setIsLoading(false)
      return
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      showError("As senhas digitadas não são iguais.")
      setIsLoading(false)
      return
    }

    const result = await signup(formData)

    if (result?.error) {
      showError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      showSuccess(result.success)
      setIsLoading(false)
      if (result.redirectTo) {
        setTimeout(() => {
          router.push(result.redirectTo)
        }, 2000)
      }
    }
  }

  return (
    <div className="flex min-h-screen">
      {popup && <ErrorPopup message={popup.message} type={popup.type} onClose={closePopup} />}
      <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} />

      <div className="hidden lg:flex lg:w-[40%] bg-[#38B6FF] flex-col p-12 justify-center">
        <div className="flex flex-col">
          <h1
            className="text-[4.5rem] leading-[0.95] font-black text-white tracking-tight px-4"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            MISSÃO
            <br />
            PARALELLO
          </h1>

          <p className="text-[#FC1F69] text-xl font-bold mt-2 px-4">JUNTE-SE A NÓS!</p>
        </div>
      </div>

      <div className="flex w-full lg:w-[60%] items-center justify-center bg-white p-6">
        <div className="w-full max-w-[320px] space-y-3">
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-3xl font-bold text-[#38B6FF]">PARALELLO</h1>
            <p className="text-lg font-bold text-[#FC1F69]">JUNTE-SE A NÓS!</p>
          </div>

          <div className="flex flex-col items-center mb-3">
            <h2 className="text-2xl font-normal text-black">Cadastro</h2>
            <div className="mt-1.5 flex gap-0.5">
              <div className="h-0.5 w-6 bg-[#38B6FF]" />
              <div className="h-0.5 w-6 bg-[#FC1F69]" />
              <div className="h-0.5 w-6 bg-[#FFD700]" />
              <div className="h-0.5 w-6 bg-[#CADDFF]" />
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-2.5">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs text-black font-normal">
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                required
                className="h-8 text-xs border border-gray-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="username" className="text-xs text-black font-normal">
                Nome de usuário
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Digite seu nome de usuário"
                required
                className="h-8 text-xs border border-gray-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs text-black font-normal">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                required
                className="h-8 text-xs border border-gray-300 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirm-password" className="text-xs text-black font-normal">
                Confirme sua senha
              </Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                placeholder="Digite sua senha"
                required
                className="h-8 text-xs border border-gray-300 rounded-xl"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required className="h-3.5 w-3.5" />
              <label
                htmlFor="terms"
                className="text-xs font-normal text-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {"Concordo com os"}{" "}
                <button type="button" onClick={() => setTermsOpen(true)} className="text-[#FC1F69] hover:underline">
                  Termos de uso
                </button>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-9 bg-[#FC1F69] hover:bg-[#e01b5f] text-white font-medium rounded-xl text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>

            <p className="text-center text-xs text-black">
              {"Já possui cadastro?"}{" "}
              <Link href="/login" className="font-medium text-[#FC1F69] hover:underline">
                Faça login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
