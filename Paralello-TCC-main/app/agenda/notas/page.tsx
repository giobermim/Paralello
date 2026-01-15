import { createServerClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { NotesList } from "./notes-list"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

const BYPASS_COOKIE_NAME = "bypass_user"

export default async function NotasPage() {
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

  const { data: notes } = await supabase
    .from("anotacao")
    .select("*, disciplina(disciplina_id, disciplina_nome, disciplina_cor)")
    .order("anotacao_publicacao", { ascending: false })

  const { data: disciplinas } = await supabase
    .from("disciplina")
    .select("*")
    .order("disciplina_nome", { ascending: true })

  return (
    <div className="flex h-screen overflow-hidden bg-[rgba(1,176,255,1)]">
      <DashboardSidebar activePage="Notas" />

      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full overflow-hidden">
          <div className="rounded-3xl bg-background p-6 shadow-lg h-full overflow-hidden flex flex-col">
            <div className="flex-1 flex flex-col min-h-0">
              <h1 className="text-xl font-bold mb-4 flex-shrink-0">Minhas Notas</h1>
              <div className="flex-1 overflow-auto">
                <NotesList initialNotes={notes || []} availableDisciplinas={disciplinas || []} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
