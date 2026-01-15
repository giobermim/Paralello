import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TesteVocacionalHero } from "@/components/teste-vocacional/hero"
import { TesteVocacionalBeneficios } from "@/components/teste-vocacional/beneficios"
import { createClient } from "@/utils/supabase/server"

export default async function TesteVocacionalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <TesteVocacionalHero isAuthenticated={!!user} />
        <TesteVocacionalBeneficios />
      </main>
      <Footer />
    </div>
  )
}
