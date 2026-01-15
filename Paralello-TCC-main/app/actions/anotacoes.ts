"use server"

import { createServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAnotacoes() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase
    .from("anotacoes")
    .select("*, tags(nome, cor)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function createAnotacao(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const titulo = formData.get("titulo") as string
  const descricao = formData.get("descricao") as string
  const publica = formData.get("publica") === "true"
  const tag_id = (formData.get("tag_id") as string) || null

  const { error } = await supabase.from("anotacoes").insert({
    titulo,
    descricao,
    publica,
    tag_id,
    user_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath("/agenda/notas")
  return { success: true }
}

export async function updateAnotacao(id: string, formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const titulo = formData.get("titulo") as string
  const descricao = formData.get("descricao") as string
  const publica = formData.get("publica") === "true"
  const tag_id = (formData.get("tag_id") as string) || null

  const { error } = await supabase
    .from("anotacoes")
    .update({
      titulo,
      descricao,
      publica,
      tag_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/agenda/notas")
  return { success: true }
}

export async function deleteAnotacao(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("anotacoes").delete().eq("id", id).eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/agenda/notas")
  return { success: true }
}
