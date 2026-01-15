// Seção de features/benefícios.
// Mostra uma breve explicação sobre por que a plataforma facilita a organização.
// A ilustração (borracha) alterna posição dependendo do breakpoint: no móvel
// ela aparece antes do conteúdo; em desktop ela fica ao lado direito.
import Image from "next/image"

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden pt-0 pb-16 md:mt-12 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-5xl items-center gap-0 md:grid-cols-2">
          {/* Content - appears first on mobile, second on desktop */}
          <div className="order-2 text-center md:order-1 md:text-left md:pr-12 md:-mr-16 z-10">
            <h2 className="mb-6 text-balance text-3xl text-secondary lg:text-5xl font-black md:text-6xl">
              FACILIDADE AO SE ORGANIZAR
            </h2>
            <p className="text-pretty text-base leading-relaxed text-foreground/80 md:text-lg">
              Com o Paralello, você tem acesso a ferramentas que facilitam sua organização de estudos. Crie listas de
              tarefas, defina metas semanais, acompanhe seu desempenho e mantenha-se motivado durante toda a jornada até
              a aprovação.
            </p>
          </div>

          {/* Eraser illustration - appears second on mobile, first on desktop */}
          <div className="order-1 flex justify-center md:order-2 md:justify-start md:-ml-16">
            <div className="relative h-80 w-80 md:h-[500px] md:w-[500px]" style={{ transform: "rotate(15deg)" }}>
              <Image
                src="/images/design-mode/img_caneta.png"
                alt="Ilustração de borracha rosa com olhos"
                width={500}
                height={500}
                className="object-contain my-[97px] mx-[33px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
