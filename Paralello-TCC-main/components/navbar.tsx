"use client"

// Navbar: componente responsável pela barra de navegação principal.
// - Mostra logo, links de navegação e botões de ação (login/agenda/teste).
// - Lida com estado mobile (menu), autenticação básica via Supabase e um diálogo "Sobre Nós".

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { signout } from "@/app/auth/actions"
import type { User } from "@supabase/supabase-js"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Função helper para ler um cookie `bypass_user` no client. Usada para cenários
// de desenvolvimento onde queremos burlar o processo de login sem Supabase.
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

export function Navbar() {
  // Estado do menu mobile, usuário atual e indicadores de loading/status
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isBypassUser, setIsBypassUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const [aboutOpen, setAboutOpen] = useState(false)

  // Efeito que verifica se há usuário logado (client-side)
  useEffect(() => {
    const checkUser = async () => {
      const bypassUser = getBypassUser()
      if (bypassUser) {
        // Se existe o cookie de bypass, consideramos um usuário de teste
        setIsBypassUser(true)
        setLoading(false)
        return
      }

      // Caso contrário, inicializa o cliente Supabase e tenta obter o usuário
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [])

  // Faz sign out via action do app e limpa estado local
  const handleSignOut = async () => {
    await signout()
    setUser(null)
    setIsBypassUser(false)
  }

  // Smooth scroll para âncoras internas, levando em conta a altura da navbar
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      const navbarHeight = 64 // h-16 = 64px
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - navbarHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
      setMobileMenuOpen(false)
    }
  }

  const isAuthenticated = user || isBypassUser

  return (
    <>
      {/* Navbar principal */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto grid h-16 grid-cols-3 items-center px-4">
          {/* Logo - área à esquerda */}
          <Link href="/" className="flex items-center gap-2 justify-self-start" aria-label="Paralello Home">
            <Image
              src="/logo-paralello.png"
              alt="Paralello Logo"
              width={216}
              height={58}
              className="h-[67px] w-auto"
              priority
            />
          </Link>

          {/* Links principais (visíveis em telas md+) */}
          <div className="hidden items-center justify-center gap-8 md:flex whitespace-nowrap">
            <Link
              href="/#vestibulares"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Informações
            </Link>
            <Link
              href={isAuthenticated ? "/teste-vocacional" : "/login?redirectTo=/teste-vocacional"}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Teste Vocacional
            </Link>
            <Link
              href={isAuthenticated ? "/agenda" : "/login?redirectTo=/agenda"}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Agenda
            </Link>
            <Link
              href="/#duvidas"
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Dúvidas
            </Link>
          </div>

          {/* Área de ações (direita): login/logout e botão do menu mobile */}
          <div className="flex items-center gap-4 justify-self-end">
            {!loading &&
              (isAuthenticated ? (
                // Se autenticado, mostra botão de sair
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="hidden rounded-full px-6 hover:bg-accent/90 md:inline-flex bg-transparent gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              ) : (
                // Se não autenticado, mostra botão de login
                <>
                  <Link href="/cadastro"></Link>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="hidden rounded-full px-6 hover:bg-accent/90 md:inline-flex bg-transparent"
                      aria-label="Fazer login"
                    >
                      Login
                    </Button>
                  </Link>
                </>
              ))}

            {/* Botão que abre o menu mobile */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu (aparece quando mobileMenuOpen == true) */}
        {mobileMenuOpen && (
          <div className="border-t border-border/40 bg-background md:hidden">
            <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
              <Link
                href="/#vestibulares"
                className="text-sm font-medium text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Informações
              </Link>
              <Link
                href={isAuthenticated ? "/teste-vocacional" : "/login?redirectTo=/teste-vocacional"}
                className="text-sm font-medium text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Teste Vocacional
              </Link>
              <Link
                href={isAuthenticated ? "/agenda" : "/login?redirectTo=/agenda"}
                className="text-sm font-medium text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Agenda
              </Link>
              <Link
                href="/#duvidas"
                className="text-sm font-medium text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dúvidas
              </Link>
              {isAuthenticated ? (
                <Button
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full rounded-full bg-accent hover:bg-accent/90 gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              ) : (
                <>
                  <Link href="/login?redirectTo=/teste-vocacional" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-full bg-[rgba(1,176,255,1)] hover:bg-[rgba(1,176,255,0.9)]">
                      Começar
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full bg-transparent hover:bg-accent/90">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Diálogo "Sobre Nós" (abre via aboutOpen) */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2">Sobre Nós</DialogTitle>
            <div className="flex h-1 w-24 mx-auto mb-6 rounded-full overflow-hidden">
              <div className="flex-1 bg-[#01B0FF]" />
              <div className="flex-1 bg-[#6B5CE7]" />
              <div className="flex-1 bg-[#F72585]" />
              <div className="flex-1 bg-[#FFD700]" />
            </div>
          </DialogHeader>
          <div className="text-base space-y-5 text-foreground/80 leading-relaxed">
            <p className="text-justify indent-8">
              O Paralello nasceu da vontade de democratizar o acesso à educação superior no Brasil. Acreditamos que
              todos os estudantes, independentemente da rede de ensino, merecem ter as mesmas oportunidades e
              ferramentas para alcançar seus sonhos acadêmicos.
            </p>
            <p className="text-justify indent-8">
              Desenvolvemos uma plataforma digital completa que centraliza informações sobre vestibulares, organiza
              estudos e otimiza o tempo dos vestibulandos. Nossa solução é especialmente pensada para estudantes da rede
              pública, que muitas vezes enfrentam dificuldades no acesso a informações claras sobre processos seletivos,
              programas de cotas, isenções e auxílios estudantis.
            </p>
            <p className="text-justify italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
              Inspirados pela frase de Paulo Freire — "Educação não transforma o mundo. Educação muda as pessoas.
              Pessoas transformam o mundo." — trabalhamos alinhados ao ODS 4 da ONU, promovendo uma educação igualitária
              e de qualidade para todos.
            </p>
            <p className="font-semibold text-primary text-center pt-2">
              Porque seu caminho até a universidade merece ser mais simples, organizado e acessível. Estamos aqui para
              caminhar ao seu lado nessa jornada.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
