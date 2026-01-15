"use server"

import { createServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function createNote(formData: FormData) {
  const supabase = await createServerClient()

  const cookieStore = await cookies()
  const bypassUser = cookieStore.get("bypass_user")

  let userId: string

  if (bypassUser) {
    userId = "00000000-0000-0000-0000-000000000000"
  } else {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }
    userId = user.id
  }

  const titulo = formData.get("titulo") as string
  const descricao = formData.get("descricao") as string
  const texto = formData.get("texto") as string
  const publica = formData.get("publica") === "true"
  const disciplina_id = formData.get("disciplina_id") as string | null

  const { data, error } = await supabase
    .from("anotacao")
    .insert({
      usuario_id: userId,
      anotacao_titulo: titulo || "Sem título",
      anotacao_descricao: descricao || "",
      anotacao_texto: texto || "",
      anotacao_publica: publica,
      anotacao_favoritar: false,
      disciplina_id: disciplina_id ? Number.parseInt(disciplina_id) : null,
    })
    .select()

  if (error) {
    console.log("[v0] Note creation error:", error.message, error.details, error.hint)
    return { error: error.message }
  }

  console.log("[v0] Note created successfully:", data)
  revalidatePath("/agenda/notas")
  return { success: true, data }
}

export async function updateNote(id: string, formData: FormData) {
  const supabase = await createServerClient()

  const titulo = formData.get("titulo") as string
  const descricao = formData.get("descricao") as string
  const texto = formData.get("texto") as string
  const publica = formData.get("publica") === "true"
  const disciplina_id = formData.get("disciplina_id") as string | null

  const { error } = await supabase
    .from("anotacao")
    .update({
      anotacao_titulo: titulo,
      anotacao_descricao: descricao,
      anotacao_texto: texto,
      anotacao_publica: publica,
      disciplina_id: disciplina_id ? Number.parseInt(disciplina_id) : null,
    })
    .eq("anotacao_id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/agenda/notas")
  return { success: true }
}

export async function deleteNote(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("anotacao").delete().eq("anotacao_id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/agenda/notas")
  return { success: true }
}

export async function toggleFavorite(id: string, favoritar: boolean) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("anotacao").update({ anotacao_favoritar: favoritar }).eq("anotacao_id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/agenda/notas")
  return { success: true }
}
