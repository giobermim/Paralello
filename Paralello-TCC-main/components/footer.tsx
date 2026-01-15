"use client"

// Footer: rodapé do site com links úteis, atalhos e um diálogo "Sobre Nós".
// Mantém ações simples como abertura do modal de 'Sobre' e links de contato.

import Link from "next/link"
import { Instagram } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Footer() {
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <>
      <footer className="bg-primary py-12 text-primary-foreground md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand section: descrição curta e direitos autorais */}
            <div className="lg:col-span-1">
              <h3 className="mb-4 font-semibold">Paralello</h3>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-primary-foreground/80">
                Seu caminho até a universidade começa aqui. Organize seus estudos e conquiste a aprovação.
              </p>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-primary-foreground/80">
                © 2025 - Projeto Paralello
              </p>
            </div>

            {/* Product links / atalhos */}
            <div>
              <h3 className="mb-4 font-semibold">Atalhos</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/#vestibulares"
                    className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    Informações
                  </Link>
                </li>
                <li>
                  <Link
                    href="/teste-vocacional"
                    className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    Teste Vocacional
                  </Link>
                </li>
                <li>
                  <Link
                    href="/agenda"
                    className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    Agenda
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company links: abre diálogo Sobre Nós e e-mail de contato */}
            <div>
              <h3 className="mb-4 font-semibold">Plataforma</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={() => setAboutOpen(true)}
                    className="text-primary-foreground/80 transition-colors hover:text-primary-foreground text-left"
                  >
                    Sobre Nós
                  </button>
                </li>
                <li>
                  <a
                    href="mailto:paralello.tcc@gmail.com"
                    className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h3 className="mb-4 font-semibold">Suporte</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/#duvidas"
                    className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    Dúvidas Frequentes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/termos-de-uso"
                    className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  >
                    Termos de Uso
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social media e copyright */}
          <div className="mt-12 border-t border-primary-foreground/20 pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              {/* Ícones sociais */}
              <div className="flex gap-4">
                <Link
                  href="https://www.instagram.com/paralello.tcc"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Sobre Nós (mesmo conteúdo usado em outros pontos) */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2">Sobre Nós</DialogTitle>
            <div className="flex h-1 w-24 mx-auto mb-6 rounded-full overflow-hidden">
              <div className="flex-1 bg-[#01B0FF]" />
              <div className="flex-1 bg-[#ff0068]" />
              <div className="flex-1 bg-[#fbca3f]" />
              <div className="flex-1 bg-[#caddff]" />
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
