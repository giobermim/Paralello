// Hero: seção de destaque da home. Mostra título, subtítulo e CTA.
// Recebe `isAuthenticated` para decidir se exibe o botão de início (login/CTA).

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroProps {
  isAuthenticated?: boolean
}

export function Hero({ isAuthenticated }: HeroProps) {
  return (
    <section id="hero" className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/*
        Nota: o fundo azul orgânico é aplicado no wrapper da página (app/page.tsx),
        então o Hero fica "sobre" esse background e mantém consistência visual.
      */}

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Título principal */}
          <h1 className="mb-6 text-balance text-4xl leading-tight text-primary lg:text-6xl md:text-4xl leading-7 tracking-tight font-medium">
            Paralello, seu caminho até a universidade!
          </h1>

          {/* Subtítulo explicativo */}
          <p className="mb-10 text-pretty text-base leading-relaxed text-foreground/70 md:text-lg lg:text-xl">
            Já passou horas tentando organizar seus estudos, mas não sabe por onde começar?
          </p>

          {/* Botão de CTA — só aparece quando o usuário NÃO está autenticado */}
          {!isAuthenticated && (
            <Link href="/login?redirectTo=/teste-vocacional">
              <Button
                size="lg"
                className="rounded-full px-8 text-base font-semibold hover:bg-secondary/90 md:px-10 md:text-lg shadow-xl bg-[rgba(251,202,63,1)]"
                aria-label="Começar a usar o Paralello"
              >
                Começar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
