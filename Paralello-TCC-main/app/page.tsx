// app/page.tsx
// Página principal (Home). Responsável por montar a tela inicial do site,
// buscar informações do usuário (autenticação) e renderizar as seções principais.

// Componentes visuais usados na página
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { AboutSection } from "@/components/about-section"
import { FeaturesSection } from "@/components/features-section"
import { Showcase } from "@/components/showcase"
import { VestibularCards } from "@/components/vestibular-cards"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

// Cliente Supabase para chamadas server-side (autenticação/dados)
import { createClient } from "@/utils/supabase/server"

// Helper do Next para acessar cookies no servidor
import { cookies } from "next/headers"

export default async function Home() {
  // Inicializa o cliente Supabase no ambiente server-side
  const supabase = await createClient()

  // Pega o usuário autenticado (se houver)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Lê cookies do request atual; usamos um cookie chamado "bypass_user"
  // para permitir acesso em ambiente de testes ou debug quando necessário.
  const cookieStore = await cookies()
  const bypassUser = cookieStore.get("bypass_user")?.value

  // Considera autenticado se houver usuário no Supabase ou se o cookie de bypass existir
  const isAuthenticated = !!user || !!bypassUser

  // Estrutura da página: navbar + área com fundo estilizado + seções principais
  return (
    <div className="min-h-screen">
      {/* Barra de navegação no topo */}
      <Navbar />

      <div className="relative">
        {/* Fundo azul com uma curva (decorativo) */}
        <div className="absolute inset-x-0 top-0 bg-[#CADDFF] overflow-hidden" style={{ height: "600px" }}>
          {/* SVG usado para criar a curva branca na parte de baixo do fundo */}
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 w-full h-auto"
            preserveAspectRatio="none"
          >
            <path d="M0 120V60C240 20 480 0 720 0C960 0 1200 20 1440 60V120H0Z" fill="white" />
          </svg>
        </div>

        {/* Conteúdo principal que fica sobre o fundo decorativo */}
        <div className="relative z-10">
          {/* Hero recebe informação se o usuário está autenticado para ajustar CTA */}
          <Hero isAuthenticated={isAuthenticated} />
          <AboutSection />
          <FeaturesSection />
        </div>
      </div>

      <main>
        {/* Seções abaixo do fold: showcase, cartões de vestibular e FAQ */}
        <Showcase />
        <VestibularCards />
        <FAQ />
      </main>

      {/* Rodapé com links e informações finais */}
      <Footer />
    </div>
  )
}
