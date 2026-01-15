"use client"

import { useRef } from "react"

const beneficios = [
  {
    titulo: "Mapeamento de Habilidades e Talentos",
    descricao:
      "O teste ajuda a identificar quais são as aptidões naturais e competências mais desenvolvidas da pessoa, indicando áreas em que ela tende a se destacar.",
    cor: "#3A86FF", // Azul
    corTexto: "#FFFFFF",
  },
  {
    titulo: "Reconhecimento de Limitações e Dificuldades",
    descricao:
      "Além do mapeamento de pontos fortes, o teste também permite reconhecer fragilidades ou áreas em que o desenvolvimento pode ser mais desafiador.",
    cor: "#FF006E", // Rosa
    corTexto: "#FFFFFF",
  },
  {
    titulo: "Eliminação de Opções Incompatíveis com o Perfil",
    descricao:
      "O teste auxilia a descartar cursos e carreiras que não tem muito a ver com o interesse, personalidade ou competências do indivíduo, refinando escolhas equivocadas.",
    cor: "#808080", // Cinza
    corTexto: "#FFFFFF",
  },
  {
    titulo: "Estímulo à Autorreflexão e ao Autoconhecimento",
    descricao:
      "Ao responder às perguntas, o estudante é incentivado a refletir sobre seus gostos, preferências, valores e objetivos, o que contribui para uma escolha mais consciente.",
    cor: "#FFD60A", // Amarelo
    corTexto: "#000000",
  },
  {
    titulo: "Identificação de Interesses e Afinidades",
    descricao:
      "O teste vocacional revela áreas de interesse que talvez não estejam tão visíveis, ampliando o conhecimento sobre suas preferências profissionais.",
    cor: "#FF6D00", // Laranja
    corTexto: "#FFFFFF",
  },
  {
    titulo: "Alinhamento entre Expectativas e Realidade do Mercado",
    descricao:
      "Ele contribui para que as expectativas sobre determinada carreira sejam mais realistas, ajudando o estudante a entender melhor as exigências e características do curso e da profissão.",
    cor: "#E91E63", // Rosa/Magenta
    corTexto: "#FFFFFF",
  },
  {
    titulo: "Apresentação de Novas Possibilidades de Cursos e Carreiras",
    descricao:
      "O teste pode sugerir opções que o estudante nunca havia considerado, ampliando o leque de possibilidades e aumentando a chance de encontrar uma área assertiva.",
    cor: "#00BCD4", // Ciano
    corTexto: "#FFFFFF",
  },
]

export function TesteVocacionalBeneficios() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Título da seção */}
        <div className="mb-12 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-black text-[#E91E63] uppercase mb-4">
            Os Benefícios de Realizar um Teste Vocacional
          </h2>
          <p className="text-foreground/70">
            Fazer um teste vocacional pode ser uma etapa decisiva na escolha da carreira e do curso superior. Confira
            algumas das principais vantagens:
          </p>
        </div>

        {/* Cards em formato de notebook/tablet */}
        <div className="relative bg-[#e7e7e7] rounded-[40px] p-8 md:p-12 max-w-6xl mx-auto">
          {/* Decorative circles at top */}
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-[#BDBDBD]" />
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* First row - 4 cards */}
            {beneficios.slice(0, 4).map((beneficio, index) => (
              <div
                key={index}
                className="rounded-2xl p-5 min-h-[180px] flex flex-col"
                style={{ backgroundColor: beneficio.cor }}
              >
                <h3 className="text-sm font-bold mb-3 uppercase" style={{ color: beneficio.corTexto }}>
                  {beneficio.titulo}
                </h3>
                <p className="text-xs leading-relaxed opacity-90" style={{ color: beneficio.corTexto }}>
                  {beneficio.descricao}
                </p>
              </div>
            ))}
          </div>

          {/* Second row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {beneficios.slice(4, 7).map((beneficio, index) => (
              <div
                key={index}
                className="rounded-2xl p-5 min-h-[180px] flex flex-col"
                style={{ backgroundColor: beneficio.cor }}
              >
                <h3 className="text-sm font-bold mb-3 uppercase" style={{ color: beneficio.corTexto }}>
                  {beneficio.titulo}
                </h3>
                <p className="text-xs leading-relaxed opacity-90" style={{ color: beneficio.corTexto }}>
                  {beneficio.descricao}
                </p>
              </div>
            ))}
          </div>

          {/* Decorative circles at bottom */}
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-[#BDBDBD]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
