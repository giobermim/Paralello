// Seção "Sobre" da página inicial.
// Explica rapidamente o propósito do Paralello e exibe uma ilustração.
// Mantive a marcação simples: à esquerda a ilustração (em telas grandes)
// e à direita o conteúdo (título + parágrafo). Ideal para apresentar o
// produto logo abaixo do hero.
import Image from "next/image"

export function AboutSection() {
  return (
    <section id="informacoes" className="relative pt-16 pb-0 md:pt-24 md:pb-0">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-5xl items-center gap-0 md:grid-cols-2">
          {/* Pencil illustration */}
          <div className="flex justify-center md:justify-end md:-mr-16">
            <div className="relative h-80 w-80 md:h-[500px] md:w-[500px]" style={{ transform: "rotate(-15deg)" }}>
              <Image
                src="/images/design-mode/img_lapis.png"
                alt="Ilustração de lápis amarelo com olhos"
                width={500}
                height={500}
                className="object-contain px-0 mx-[-100px] py-[38px]"
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center md:text-left">
            <h2 className="mb-6 text-balance text-3xl text-primary lg:text-5xl font-black md:text-6xl px-[-14px] px-[-px] px-[0-] ml-0 text-left mr-0 px-0">
              O QUE É O PARALELLO?
            </h2>
            <p className="text-pretty text-base leading-relaxed text-foreground/80 md:text-lg">
              Paralello é uma plataforma que ajuda você a se organizar e se preparar para os principais vestibulares do
              Brasil. Com ferramentas inteligentes, você pode criar cronogramas personalizados, acompanhar seu progresso
              e acessar conteúdos exclusivos para cada prova.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
