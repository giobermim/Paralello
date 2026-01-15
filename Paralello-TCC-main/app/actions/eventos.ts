"use server"

import { createServiceRoleClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

async function getUserId() {
  const cookieStore = await cookies()
  const bypassUser = cookieStore.get("bypass_user")

  if (bypassUser) {
    return null
  } else {
    const supabase = await createServiceRoleClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id || null
  }
}

export async function getEventos() {
  const userId = await getUserId()
  const supabase = await createServiceRoleClient()

  let query = supabase.from("evento").select("*").order("evento_data", { ascending: true })

  if (userId === null) {
    query = query.is("usuario_id", null)
  } else {
    query = query.eq("usuario_id", userId)
  }

  const [{ data: eventos, error: eventosError }, { data: allTags }] = await Promise.all([
    query,
    supabase.from("tag").select("*"),
  ])

  if (eventosError) return { error: eventosError.message }

  const eventoIds = eventos?.map((e) => e.evento_id) || []

  console.log("[v0] Eventos encontrados:", eventoIds.length)

  const { data: tagRelations, error: tagRelationsError } = await supabase
    .from("tag_has_evento")
    .select("*")
    .in("evento_id", eventoIds)

  console.log("[v0] Tag relations encontradas:", tagRelations?.length || 0, tagRelationsError?.message || "")

  const tagRelationsMap = new Map<string, number[]>()
  tagRelations?.forEach((rel) => {
    const eventId = String(rel.evento_id)
    if (!tagRelationsMap.has(eventId)) {
      tagRelationsMap.set(eventId, [])
    }
    tagRelationsMap.get(eventId)!.push(rel.tag_id)
  })

  const tagsMap = new Map(allTags?.map((tag) => [tag.tag_id, tag]))

  const eventosWithTags = (eventos || []).map((evento) => {
    const tagIds = tagRelationsMap.get(String(evento.evento_id)) || []
    const tags = tagIds.map((id) => tagsMap.get(id)).filter(Boolean)
    console.log("[v0] Evento", evento.evento_id, "tags:", tags.length)
    return { ...evento, tags }
  })

  return { data: eventosWithTags }
}

export async function createEvento(formData: FormData) {
  const userId = await getUserId()
  const supabase = await createServiceRoleClient()

  const titulo = formData.get("titulo") as string
  const descricao = formData.get("descricao") as string
  const data = formData.get("data") as string
  const notificacao = formData.get("notificacao") === "true"
  const selectedTagIds = formData.get("tag_ids") as string

  const { data: eventoData, error } = await supabase
    .from("evento")
    .insert({
      evento_titulo: titulo,
      evento_descricao: descricao,
      evento_data: data,
      evento_notificacao: notificacao,
      usuario_id: userId,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  if (selectedTagIds) {
    const tagIds = selectedTagIds.split(",").filter(Boolean)
    const tagRelations = tagIds.map((tagId) => ({
      evento_id: eventoData.evento_id,
      tag_id: Number.parseInt(tagId),
    }))

    const { error: tagError } = await supabase.from("tag_has_evento").insert(tagRelations)
    if (tagError) console.error("Error adding tags:", tagError)
  }

  revalidatePath("/agenda/calendario")
  return { success: true, data: eventoData }
}

export async function updateEvento(id: string, formData: FormData) {
  const userId = await getUserId()
  const supabase = await createServiceRoleClient()

  const titulo = formData.get("titulo") as string
  const descricao = formData.get("descricao") as string
  const data = formData.get("data") as string
  const notificacao = formData.get("notificacao") === "true"
  const selectedTagIds = formData.get("tag_ids") as string

  let query = supabase
    .from("evento")
    .update({
      evento_titulo: titulo,
      evento_descricao: descricao,
      evento_data: data,
      evento_notificacao: notificacao,
    })
    .eq("evento_id", id)

  if (userId === null) {
    query = query.is("usuario_id", null)
  } else {
    query = query.eq("usuario_id", userId)
  }

  const { error } = await query

  if (error) return { error: error.message }

  await supabase.from("tag_has_evento").delete().eq("evento_id", Number.parseInt(id))

  if (selectedTagIds) {
    const tagIds = selectedTagIds.split(",").filter(Boolean)
    const tagRelations = tagIds.map((tagId) => ({
      evento_id: Number.parseInt(id),
      tag_id: Number.parseInt(tagId),
    }))

    await supabase.from("tag_has_evento").insert(tagRelations)
  }

  revalidatePath("/agenda/calendario")
  return { success: true }
}

export async function deleteEvento(id: string) {
  const userId = await getUserId()
  const supabase = await createServiceRoleClient()

  await Promise.all([
    supabase.from("tag_has_evento").delete().eq("evento_id", Number.parseInt(id)),
    (async () => {
      let query = supabase.from("evento").delete().eq("evento_id", id)
      if (userId === null) {
        query = query.is("usuario_id", null)
      } else {
        query = query.eq("usuario_id", userId)
      }
      return query
    })(),
  ])

  revalidatePath("/agenda/calendario")
  return { success: true }
}

export async function getTodayNotifications() {
  const userId = await getUserId()
  const supabase = await createServiceRoleClient()

  const today = new Date().toISOString().split("T")[0]

  let query = supabase
    .from("evento")
    .select("*")
    .eq("evento_data", today)
    .eq("evento_notificacao", true)
    .order("evento_titulo", { ascending: true })

  if (userId === null) {
    query = query.is("usuario_id", null)
  } else {
    query = query.eq("usuario_id", userId)
  }

  const [{ data: eventos, error }, { data: allTags }] = await Promise.all([query, supabase.from("tag").select("*")])

  if (error) return { error: error.message }

  const eventoIds = eventos?.map((e) => e.evento_id) || []
  const { data: tagRelations } = await supabase.from("tag_has_evento").select("*").in("evento_id", eventoIds)

  const tagRelationsMap = new Map<string, number[]>()
  tagRelations?.forEach((rel) => {
    const eventId = String(rel.evento_id)
    if (!tagRelationsMap.has(eventId)) {
      tagRelationsMap.set(eventId, [])
    }
    tagRelationsMap.get(eventId)!.push(rel.tag_id)
  })

  const tagsMap = new Map(allTags?.map((tag) => [tag.tag_id, tag]))

  const notificationsWithTags = (eventos || []).map((evento) => {
    const tagIds = tagRelationsMap.get(String(evento.evento_id)) || []
    const tags = tagIds.map((id) => tagsMap.get(id)).filter(Boolean)
    return { ...evento, tags }
  })

  return { data: notificationsWithTags }
}
