"use client"

// Showcase: área interativa que apresenta exemplos de funcionalidades do produto.
// - O componente mantém um estado local `activeFeature` para controlar
//   qual imagem/feature está em destaque.
// - Os botões acima da imagem permitem trocar a feature ativa sem recarregar a
//   página (UI client-side). As imagens são carregadas via `next/image`.
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const features = [
  {
    id: "agenda",
    label: "Edite sua agenda",
    image: "/images/prototipo1.png",
    alt: "Interface do editor de agenda do Paralello",
  },
  {
    id: "cronogramas",
    label: "Cronogramas Personalizados",
    image: "/images/prototipo2.png",
    alt: "Interface de cronogramas personalizados",
  },
  {
    id: "compartilhar",
    label: "Compartilhe seu resumo",
    image: "/images/prototipo3.png",
    alt: "Interface de compartilhamento de resumos",
  },
  {
    id: "teste",
    label: "Teste Vocacional",
    image: "/images/prototipo4.png",
    alt: "Interface do teste vocacional",
  },
  {
    id: "alertas",
    label: "Alerta de prazos",
    image: "/images/prototipo5.png",
    alt: "Interface de alertas de prazos",
  },
]

export function Showcase() {
  const [activeFeature, setActiveFeature] = useState(features[0])

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-primary md:text-3xl">Por que usar o Paralello?</h2>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {features.map((feature) => (
              <Button
                key={feature.id}
                variant={activeFeature.id === feature.id ? "default" : "outline"}
                onClick={() => setActiveFeature(feature)}
                className={`rounded-full px-4 py-2 text-sm transition-all md:px-6 md:text-base ${
                  activeFeature.id === feature.id
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-primary/20 text-foreground hover:bg-primary/10"
                }`}
              >
                {feature.label}
              </Button>
            ))}
          </div>

          {/* 
            🎨 COMO TROCAR AS IMAGENS DAS FUNCIONALIDADES:
            1. Vá até o array "features" no início deste componente
            2. Substitua a propriedade "image" de cada feature pela URL da sua imagem
            3. Ajuste o "alt" para descrever a imagem
            4. Mantenha proporção 16:9 ou similar para melhor visualização
          */}
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
            <Image
              src={activeFeature.image || "/placeholder.svg"}
              alt={activeFeature.alt}
              width={1000}
              height={600}
              className="w-full transition-opacity duration-300"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
