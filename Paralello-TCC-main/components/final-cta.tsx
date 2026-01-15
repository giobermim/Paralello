import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="border-b border-border/40 bg-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {"Ready to transform your workflow?"}
          </h2>
          <p className="mb-10 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            {
              "Join thousands of teams already using StreamLine to work smarter. Start your free 14-day trial today—no credit card required."
            }
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group w-full sm:w-auto">
              {"Get Started Free"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              {"Schedule a Demo"}
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            {"No credit card required • 14-day free trial • Cancel anytime"}
          </p>
        </div>
      </div>
    </section>
  )
}
