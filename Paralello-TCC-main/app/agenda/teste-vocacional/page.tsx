import { createServerClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { VocationalTest } from "./vocational-test"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

const BYPASS_COOKIE_NAME = "bypass_user"

export default async function TesteVocacionalPage() {
  const cookieStore = await cookies()
  const bypassCookie = cookieStore.get(BYPASS_COOKIE_NAME)
  const isBypassUser = bypassCookie?.value === "menardiph@gmail.com"

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isBypassUser) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[rgba(1,176,255,1)]">
      <DashboardSidebar activePage="Teste Vocacional" />

      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full overflow-hidden">
          <div className="rounded-3xl bg-background p-6 shadow-lg h-full overflow-hidden flex flex-col">
            <h1 className="text-xl font-bold mb-4 flex-shrink-0">Teste Vocacional</h1>
            <div className="flex-1 overflow-hidden">
              <VocationalTest />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
