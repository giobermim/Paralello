// Cartões que mostram os principais vestibulares cobertos pela plataforma.
// Cada cartão é um `Link` para a página do respectivo vestibular e usa uma
// imagem de fundo + overlay para garantir contraste do nome sobre a imagem.
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"

const vestibulares = [
  {
    name: "FUVEST",
    slug: "fuvest",
    color: "bg-[#01B0FF]",
    textColor: "text-white",
    image: "/images/fuvest_img.png",
    bgImage: "/images/usp-real.webp",
  },
  {
    name: "UNICAMP",
    slug: "unicamp",
    color: "bg-[#FC1F69]",
    textColor: "text-white",
    image: "/images/unicamp_img.png",
    bgImage: "/images/unicamp-real.jpg",
  },
  {
    name: "ENEM",
    slug: "enem",
    color: "bg-[#FBBA2E]",
    textColor: "text-white",
    image: "/images/enem_img.png",
    bgImage: "/images/enem-real.jpg",
  },
  {
    name: "VUNESP",
    slug: "vunesp",
    color: "bg-[#CADDFF]",
    textColor: "text-white",
    image: "/images/vunesp_img.png",
    bgImage: "/images/unesp-real.jpeg",
  },
]

export function VestibularCards() {
  return (
    <section id="vestibulares" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl text-[rgba(1,176,255,1)]">
            Principais Vestibulares
          </h2>
          <p className="mb-12 text-center text-base text-foreground/70 md:text-lg">
            Prepare-se para os principais processos seletivos do Brasil
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vestibulares.map((vestibular) => (
              <Link key={vestibular.name} href={`/vestibular/${vestibular.slug}`}>
                <Card
                  className={`relative overflow-hidden ${vestibular.color} ${vestibular.textColor} flex h-48 flex-col items-center justify-center gap-4 border-0 transition-transform hover:scale-105 cursor-pointer`}
                >
                  {vestibular.bgImage && (
                    <>
                      <Image
                        src={vestibular.bgImage || "/placeholder.svg"}
                        alt="Background"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </>
                  )}

                  <div className="relative z-10 h-20 w-20">
                    <Image
                      src={vestibular.image || "/placeholder.svg"}
                      alt={`Logo ${vestibular.name}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className={`relative z-10 text-2xl font-bold ${vestibular.textColor}`}>{vestibular.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
