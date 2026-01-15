"use server"

import { createServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getTestes() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase
    .from("testes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return { error: error.message }
  return { data }
}

export async function createTeste(formData: FormData) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("testes").insert({
    area1: formData.get("area1") as string,
    porcentagem1: Number.parseFloat(formData.get("porcentagem1") as string),
    area2: formData.get("area2") as string,
    porcentagem2: Number.parseFloat(formData.get("porcentagem2") as string),
    area3: formData.get("area3") as string,
    porcentagem3: Number.parseFloat(formData.get("porcentagem3") as string),
    area4: formData.get("area4") as string,
    porcentagem4: Number.parseFloat(formData.get("porcentagem4") as string),
    area5: formData.get("area5") as string,
    porcentagem5: Number.parseFloat(formData.get("porcentagem5") as string),
    area6: formData.get("area6") as string,
    porcentagem6: Number.parseFloat(formData.get("porcentagem6") as string),
    area7: formData.get("area7") as string,
    porcentagem7: Number.parseFloat(formData.get("porcentagem7") as string),
    area8: formData.get("area8") as string,
    porcentagem8: Number.parseFloat(formData.get("porcentagem8") as string),
    area9: formData.get("area9") as string,
    porcentagem9: Number.parseFloat(formData.get("porcentagem9") as string),
    user_id: user.id,
  })

  if (error) return { error: error.message }

  revalidatePath("/teste-vocacional")
  return { success: true }
}

export async function deleteTeste(id: string) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.from("testes").delete().eq("id", id).eq("user_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/teste-vocacional")
  return { success: true }
}
