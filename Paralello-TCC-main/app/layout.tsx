// app/layout.tsx
// Layout raiz do aplicativo (App Router do Next.js).
// Aqui definimos o HTML base, carregamos estilos globais e providers que
// precisam envolver toda a aplicação (por ex. contexto do Pomodoro, toasts, analytics).

import type React from "react"
import type { Metadata } from "next"

// Fonte do Google (Next.js fornece helper para otimizar carregamento)
import { Inter } from "next/font/google"

// Analytics e componente de notificação (toaster)
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"

// Contexto do Pomodoro e widget flutuante que fica visível em todas as páginas
import { PomodoroProvider } from "@/contexts/pomodoro-context"
import { PomodoroWidget } from "@/components/pomodoro-widget"

// Estilos globais aplicados em toda a aplicação
import "./globals.css"

// Inicializa a fonte Inter (subconjunto latin) e expõe a classe CSS para uso
const inter = Inter({ subsets: ["latin"] })

// Metadados da aplicação (Next usa isso para HEAD padrão)
export const metadata: Metadata = {
  title: "Paralello - Seu caminho até a universidade",
  description:
    "Plataforma completa para organização de estudos e preparação para os principais vestibulares do Brasil.",
  generator: "v0.app",
}

// RootLayout: componente que envolve todas as rotas do app
// Recebe `children` — o conteúdo específico de cada rota — e adiciona providers e elementos globais.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Declara a linguagem da página e aplica classes globais (fonte + antialias)
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        {/*
          PomodoroProvider: fornece o estado do pomodoro (tempo, sessão, pausas)
          para qualquer componente que precise consumir esse contexto.
          Colocamos o Toaster e o Analytics aqui para que estejam disponíveis
          em todas as rotas sem a necessidade de re-importar.
        */}
        <PomodoroProvider>
          {/* children = conteúdo da rota atual (páginas, componentes da rota) */}
          {children}

          {/* Componente responsável por mostrar notificações (toast) no app */}
          <Toaster />

          {/* Integração simples com analytics do Vercel */}
          <Analytics />

          {/* Widget flutuante do Pomodoro — fica visível globalmente */}
          <PomodoroWidget />
        </PomodoroProvider>
      </body>
    </html>
  )
}
