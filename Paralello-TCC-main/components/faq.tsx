// FAQ (Dúvidas Frequentes)
// - Lista de perguntas e respostas mostrada usando o componente Accordion.
// - Mantemos as perguntas em um array local por simplicidade; se preferir
//   podemos carregar dinamicamente de uma fonte externa mais tarde.
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Como funciona a plataforma Paralello?",
    answer:
      "O Paralello é uma plataforma completa de organização de estudos. Você pode criar cronogramas personalizados, acompanhar seu progresso, acessar materiais de estudo e se preparar para os principais vestibulares do Brasil de forma estruturada e eficiente.",
  },
  {
    question: "Quais vestibulares são cobertos pela plataforma?",
    answer:
      "Cobrimos os principais vestibulares do Brasil, incluindo FUVEST, UNICAMP, ENEM e VUNESP. Nossa plataforma oferece conteúdo específico e cronogramas adaptados para cada um desses processos seletivos.",
  },
  {
    question: "O Paralello é gratuito?",
    answer:
      "Sim! A plataforma em seu todo é completamente gratuita, sem recursos de plano ou assinaturas, sendo necessário apenas o cadastro do usúario para utulizar das ferramentas disponibilizadas.",
  },
  {
    question: "Como posso acompanhar meu progresso?",
    answer:
      "A plataforma oferece dashboards intuitivos onde você pode visualizar seu progresso em tempo real, ver estatísticas de estudo, acompanhar metas cumpridas e identificar áreas que precisam de mais atenção.",
  },
  {
    question: "Posso usar o Paralello no celular?",
    answer:
      "Sim! O Paralello é totalmente responsivo e funciona perfeitamente em dispositivos móveis, tablets e desktops. Você pode estudar e se organizar de qualquer lugar, a qualquer momento.",
  },
]

export function FAQ() {
  return (
    <section id="duvidas" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-primary md:text-4xl">Dúvidas Frequentes</h2>

          <Accordion type="single" collapsible className="w-full space-y-4 pb-1">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-lg border border-border bg-card px-6"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline md:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-pretty text-sm leading-relaxed text-foreground/80 md:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
