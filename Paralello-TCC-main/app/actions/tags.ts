"use server"

import { createServiceRoleClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAllTags() {
  const supabase = await createServiceRoleClient()
  const { data, error } = await supabase.from("tag").select("*").order("tag_nome", { ascending: true })

  if (error) return { data: [], error: error.message }
  return { data: data || [] }
}

export async function createCustomTag(formData: FormData) {
  const supabase = await createServiceRoleClient()

  const nome = formData.get("nome") as string
  const cor = formData.get("cor") as string

  const { error } = await supabase.from("tag").insert({
    tag_nome: nome,
    tag_cor: cor,
  })

  if (error) return { error: error.message }

  revalidatePath("/agenda/calendario")
  return { success: true }
}

export async function updateCustomTag(id: string, formData: FormData) {
  const supabase = await createServiceRoleClient()

  const nome = formData.get("nome") as string
  const cor = formData.get("cor") as string

  const { error } = await supabase.from("tag").update({ tag_nome: nome, tag_cor: cor }).eq("tag_id", Number(id))

  if (error) return { error: error.message }

  revalidatePath("/agenda/calendario")
  return { success: true }
}

export async function deleteCustomTag(id: string) {
  const supabase = await createServiceRoleClient()

  const { error } = await supabase.from("tag").delete().eq("tag_id", Number(id))

  if (error) return { error: error.message }

  revalidatePath("/agenda/calendario")
  return { success: true }
}
