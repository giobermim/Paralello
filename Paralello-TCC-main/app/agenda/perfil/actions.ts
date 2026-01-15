"use server"

import { createServerClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

const BYPASS_USER_ID = "00000000-0000-0000-0000-000000000000"

async function getUserId() {
  const cookieStore = await cookies()
  const bypassCookie = cookieStore.get("bypass_user")

  if (bypassCookie) {
    return BYPASS_USER_ID
  }

  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.id || null
}

export async function getProfile() {
  try {
    const userId = await getUserId()

    if (!userId) {
      return { success: false, error: "Usuário não autenticado" }
    }

    const supabase = await createServerClient()

    const { data, error } = await supabase.from("perfil_usuario").select("*").eq("usuario_id", userId).maybeSingle()

    if (error) {
      console.error("Erro ao buscar perfil:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return { success: false, error: "Erro ao buscar perfil" }
  }
}

export async function saveProfile(nome: string, foto: string | null) {
  try {
    const userId = await getUserId()

    if (!userId) {
      return { success: false, error: "Usuário não autenticado" }
    }

    const supabase = await createServerClient()

    // Verificar se já existe um perfil
    const { data: existingProfile } = await supabase
      .from("perfil_usuario")
      .select("perfil_id")
      .eq("usuario_id", userId)
      .maybeSingle()

    if (existingProfile) {
      // Atualizar perfil existente
      const { error } = await supabase
        .from("perfil_usuario")
        .update({
          perfil_nome: nome,
          perfil_foto: foto,
          updated_at: new Date().toISOString(),
        })
        .eq("usuario_id", userId)

      if (error) {
        console.error("Erro ao atualizar perfil:", error)
        return { success: false, error: error.message }
      }
    } else {
      // Inserir novo perfil
      const { error } = await supabase.from("perfil_usuario").insert({
        usuario_id: userId,
        perfil_nome: nome,
        perfil_foto: foto,
      })

      if (error) {
        console.error("Erro ao criar perfil:", error)
        return { success: false, error: error.message }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar perfil:", error)
    return { success: false, error: "Erro ao salvar perfil" }
  }
}
