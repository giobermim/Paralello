"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { login } from "@/app/auth/actions"
import { useState, Suspense } from "react"
import { ErrorPopup, useErrorPopup } from "@/components/ui/error-popup"
import { TermsDialog } from "@/components/terms-dialog"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { popup, showError, showSuccess, closePopup } = useErrorPopup()
  const [isLoading, setIsLoading] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const redirectTo = searchParams.get("redirectTo") ?? "/"

  const isFormValid = email.trim() !== "" && password.trim() !== ""

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set("redirectTo", redirectTo)

    const emailOrUsername = formData.get("emailOrUsername") as string
    const password = formData.get("password") as string

    if (!emailOrUsername || emailOrUsername.trim() === "") {
      showError("Por favor, insira seu e-mail ou nome de usuário.")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres.")
      setIsLoading(false)
      return
    }

    const result = await login(formData)

    if (result?.error) {
      showError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      showSuccess(result.success)
      if (result.redirectTo) {
        setTimeout(() => {
          router.push(result.redirectTo)
        }, 1000)
      }
    }
  }

  return (
    <>
      {popup && <ErrorPopup message={popup.message} type={popup.type} onClose={closePopup} />}
      <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} />

      <div className="flex min-h-screen">
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

            <p className="text-[#FC1F69] text-xl font-bold mt-2 px-4">BEM-VINDO DE VOLTA!</p>
          </div>
        </div>

        <div className="flex w-full lg:w-[60%] items-center justify-center bg-white p-6">
          <div className="w-full max-w-[320px] space-y-4">
            <div className="lg:hidden text-center mb-6">
              <h1 className="text-3xl font-bold text-[#38B6FF]">PARALELLO</h1>
              <p className="text-lg font-bold text-[#FC1F69]">BEM-VINDO DE VOLTA!</p>
            </div>

            <div className="flex flex-col items-center mb-4">
              <h2 className="text-2xl font-normal text-black">Login</h2>
              <div className="mt-1.5 flex gap-0.5">
                <div className="h-0.5 w-6 bg-[#38B6FF]" />
                <div className="h-0.5 w-6 bg-[#FC1F69]" />
                <div className="h-0.5 w-6 bg-[#FFD700]" />
                <div className="h-0.5 w-6 bg-[#CADDFF]" />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="emailOrUsername" className="text-xs text-black font-normal">
                  E-mail ou nome de usuário
                </Label>
                <Input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  placeholder="Digite seu e-mail ou nome de usuário"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-xs border-gray-300 border rounded-xl"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 text-xs border border-gray-300 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-9 bg-[#FC1F69] hover:bg-[#e01b5f] text-white font-medium rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? "Entrando..." : "Continuar"}
              </Button>

              <p className="text-center text-[10px] text-gray-500">
                Ao entrar, você concorda com os{" "}
                <button type="button" onClick={() => setTermsOpen(true)} className="text-[#FC1F69] hover:underline">
                  Termos de Uso
                </button>
              </p>

              <p className="text-center text-xs text-black">
                {"Não tem uma conta?"}{" "}
                <Link href="/cadastro" className="font-medium text-[#FC1F69] hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#38B6FF]"></div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
