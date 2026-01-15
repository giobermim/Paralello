import { Card, CardContent } from "@/components/ui/card"
import { Zap, Users, Shield, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience blazing-fast performance with our optimized infrastructure. Deploy in seconds, not hours.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time collaboration tools, shared workspaces, and instant updates.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and advanced security features to keep your data safe.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Gain deep insights with powerful analytics and reporting tools. Make data-driven decisions with confidence.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-b border-border/40 bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {"Everything you need to succeed"}
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            {
              "Powerful features designed to help your team work smarter, not harder. Built for scale, optimized for speed."
            }
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
