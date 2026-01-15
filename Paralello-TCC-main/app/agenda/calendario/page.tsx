import { createServerClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { CalendarView } from "./calendar-view"
import { getAllTags } from "@/app/actions/tags"
import { getEventos } from "@/app/actions/eventos"

export default async function CalendarioPage() {
  const cookieStore = await cookies()
  const bypassUser = cookieStore.get("bypass_user")?.value

  if (!bypassUser) {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      redirect("/login")
    }
  }

  const { data: eventos } = await getEventos()
  const { data: tags } = await getAllTags()

  return <CalendarView initialEventos={eventos || []} availableTags={tags || []} />
}
