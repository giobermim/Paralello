import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "StreamLine has completely transformed how our team works. We've cut our project delivery time in half and our team couldn't be happier.",
    author: "Sarah Chen",
    role: "VP of Engineering",
    company: "TechCorp",
    rating: 5,
  },
  {
    quote:
      "The best investment we've made this year. The ROI was immediate and the support team is incredibly responsive.",
    author: "Michael Rodriguez",
    role: "Product Manager",
    company: "InnovateLabs",
    rating: 5,
  },
  {
    quote:
      "We tried several solutions before StreamLine. Nothing comes close to the ease of use and powerful features it offers.",
    author: "Emily Thompson",
    role: "CTO",
    company: "StartupXYZ",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="border-b border-border/40 bg-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {"Loved by teams worldwide"}
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            {"Join thousands of satisfied customers who have transformed their workflow with StreamLine."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="mb-6 leading-relaxed text-card-foreground">
                  {`"${testimonial.quote}"`}
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
