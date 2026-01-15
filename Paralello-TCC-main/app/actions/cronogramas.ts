"use server"

import { createServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getCronogramas() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase
    .from("cronogramas")
    .select("*")
    .eq("user_id", user.id)
    .order("dia", { ascending: true })

  if (error) return { error: error.message }
  return { data }
}

export async function createCronograma(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const titulo = formData.get("titulo") as string
  const dia = formData.get("dia") as string
  const materia = formData.get("materia") as string
  const hora_inicio = formData.get("hora_inicio") as string
  const hora_fim = formData.get("hora_fim") as string
  const cor = formData.get("cor") as string

  const { error } = await supabase.from("cronogramas").insert({
    titulo,
    dia,
    materia,
    hora_inicio,
    hora_fim,
    cor,
    user_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath("/agenda")
  return { success: true }
}

export async function updateCronograma(id: string, formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const titulo = formData.get("titulo") as string
  const dia = formData.get("dia") as string
  const materia = formData.get("materia") as string
  const hora_inicio = formData.get("hora_inicio") as string
  const hora_fim = formData.get("hora_fim") as string
  const cor = formData.get("cor") as string

  const { error } = await supabase
    .from("cronogramas")
    .update({
      titulo,
      dia,
      materia,
      hora_inicio,
      hora_fim,
      cor,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/agenda")
  return { success: true }
}

export async function deleteCronograma(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("cronogramas").delete().eq("id", id).eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/agenda")
  return { success: true }
}
