"use server"

import { createServiceRoleClient, createServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// Mapeamento de disciplinas para seus IDs
const DISCIPLINA_MAP: Record<string, number> = {
  "Língua Portuguesa": 1,
  Literatura: 2,
  Redação: 3,
  "Língua Estrangeira": 4,
  Matemática: 5,
  Física: 6,
  Química: 7,
  Biologia: 8,
  História: 9,
  Geografia: 10,
  Sociologia: 11,
  Filosofia: 12,
  Pausa: 13,
}

// Mapeamento de horários para hora_inicio e hora_fim
const HORARIO_MAP: Record<string, { inicio: string; fim: string }> = {
  "7 AM": { inicio: "07:00:00", fim: "08:00:00" },
  "8 AM": { inicio: "08:00:00", fim: "09:00:00" },
  "9 AM": { inicio: "09:00:00", fim: "10:00:00" },
  "10 AM": { inicio: "10:00:00", fim: "11:00:00" },
  "11 AM": { inicio: "11:00:00", fim: "12:00:00" },
  "12 PM": { inicio: "12:00:00", fim: "13:00:00" },
  "1 PM": { inicio: "13:00:00", fim: "14:00:00" },
  "2 PM": { inicio: "14:00:00", fim: "15:00:00" },
  "3 PM": { inicio: "15:00:00", fim: "16:00:00" },
  "4 PM": { inicio: "16:00:00", fim: "17:00:00" },
  "5 PM": { inicio: "17:00:00", fim: "18:00:00" },
}

// Mapeamento de dias da semana para números (0 = Domingo, 6 = Sábado)
const DIA_MAP: Record<string, number> = {
  Dom: 0,
  Seg: 1,
  Ter: 2,
  Qua: 3,
  Qui: 4,
  Sex: 5,
  Sáb: 6,
}

async function getUserId() {
  const cookieStore = await cookies()
  const bypassUser = cookieStore.get("bypass_user")
  const supabase = await createServiceRoleClient()

  // Se existe bypass cookie, buscar o usuário pelo email no Supabase Auth
  if (bypassUser?.value) {
    console.log("[v0] Bypass user encontrado:", bypassUser.value)

    // Buscar o usuário no Supabase Auth pelo email
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers()

    if (error) {
      console.log("[v0] Erro ao buscar usuários:", error.message)
      return null
    }

    const user = users.find((u) => u.email === bypassUser.value)
    if (user) {
      console.log("[v0] Usuário encontrado pelo bypass:", user.id)
      return user.id
    }

    console.log("[v0] Usuário não encontrado pelo email:", bypassUser.value)
    return null
  }

  // Tentar obter usuário autenticado normalmente
  const serverSupabase = await createServerClient()
  const {
    data: { user },
  } = await serverSupabase.auth.getUser()
  console.log("[v0] getUserId - user:", user?.id, user?.email)
  return user?.id || null
}

export async function saveCronogramaPersonalizado(data: {
  titulo: string
  schedule: Record<string, Record<string, string | null>>
}) {
  const userId = await getUserId()
  // Usar service role para inserir no banco (ignora RLS)
  const supabase = await createServiceRoleClient()

  console.log("[v0] Salvando cronograma para userId:", userId)

  if (!userId) {
    console.log("[v0] Usuário não autenticado!")
    return { error: "Usuário não autenticado. Faça login para salvar cronogramas." }
  }

  const { data: cronograma, error: cronogramaError } = await supabase
    .from("cronograma")
    .insert({
      cronograma_titulo: data.titulo,
      usuario_id: userId,
    })
    .select()
    .single()

  if (cronogramaError) {
    console.log("[v0] Erro ao inserir cronograma:", cronogramaError.message)
    return { error: cronogramaError.message }
  }

  console.log("[v0] Cronograma inserido com sucesso:", cronograma.cronograma_id)

  const slots = []
  for (const [dia, horarios] of Object.entries(data.schedule)) {
    for (const [horario, disciplina] of Object.entries(horarios)) {
      if (disciplina) {
        const diaNumero = DIA_MAP[dia]
        const horarioInfo = HORARIO_MAP[horario]
        const disciplinaId = DISCIPLINA_MAP[disciplina]

        if (diaNumero !== undefined && horarioInfo && disciplinaId) {
          slots.push({
            cronograma_id: cronograma.cronograma_id,
            slots_dia: diaNumero,
            slots_hora_inicio: horarioInfo.inicio,
            slots_hora_fim: horarioInfo.fim,
            disciplina_id: disciplinaId,
          })
        }
      }
    }
  }

  console.log("[v0] Inserindo", slots.length, "slots")

  if (slots.length > 0) {
    const { error: slotsError } = await supabase.from("slots").insert(slots)

    if (slotsError) {
      console.log("[v0] Erro ao inserir slots:", slotsError.message)
      await supabase.from("cronograma").delete().eq("cronograma_id", cronograma.cronograma_id)
      return { error: slotsError.message }
    }
  }

  console.log("[v0] Cronograma salvo com sucesso!")
  revalidatePath("/agenda/cronograma")
  return { success: true, cronogramaId: cronograma.cronograma_id }
}

export async function getCronogramasPersonalizados() {
  const userId = await getUserId()
  const supabase = await createServiceRoleClient()

  console.log("[v0] Buscando cronogramas para userId:", userId)

  let query = supabase.from("cronograma").select(`
      cronograma_id,
      cronograma_titulo,
      slots (
        slots_id,
        slots_dia,
        slots_hora_inicio,
        slots_hora_fim,
        disciplina (
          disciplina_id,
          disciplina_nome,
          disciplina_cor
        )
      )
    `)

  if (userId === null) {
    query = query.is("usuario_id", null)
  } else {
    query = query.eq("usuario_id", userId)
  }

  const { data, error } = await query

  if (error) {
    console.log("[v0] Erro ao buscar cronogramas:", error.message)
    return { error: error.message }
  }

  console.log("[v0] Cronogramas encontrados:", data?.length)
  return { data }
}

export async function deleteCronogramaPersonalizado(cronogramaId: number) {
  const supabase = await createServiceRoleClient()

  await supabase.from("slots").delete().eq("cronograma_id", cronogramaId)

  const { error } = await supabase.from("cronograma").delete().eq("cronograma_id", cronogramaId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/agenda/cronograma")
  return { success: true }
}
