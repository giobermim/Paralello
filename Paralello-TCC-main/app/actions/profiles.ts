"use server"

import { createServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProfile() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) return { error: error.message }
  return { data }
}

export async function createProfile(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const nome = formData.get("nome") as string

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    nome,
    is_admin: false,
  })

  if (error) return { error: error.message }

  revalidatePath("/")
  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const nome = formData.get("nome") as string

  const { error } = await supabase.from("profiles").update({ nome }).eq("id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/")
  return { success: true }
}
