"use server"

import { createServerClient } from "@/utils/supabase/server"

const BYPASS_USER_ID = "00000000-0000-0000-0000-000000000000"

// Mapeamento das áreas para os nomes no banco de dados
const areaNames: Record<string, string> = {
  "logico-matematica": "Ciências Exatas e Tecnologia",
  linguistica: "Comunicação e Letras",
  espacial: "Artes, Design e Arquitetura",
  "corporal-cinestesica": "Educação Física e Saúde",
  musical: "Música e Artes Cênicas",
  interpessoal: "Ciências Humanas e Sociais",
  intrapessoal: "Filosofia e Autoconhecimento",
  naturalista: "Ciências Biológicas e Meio Ambiente",
  existencial: "Filosofia e Ciências Humanas",
}

export interface TestResults {
  "logico-matematica": number
  linguistica: number
  espacial: number
  "corporal-cinestesica": number
  musical: number
  interpessoal: number
  intrapessoal: number
  naturalista: number
  existencial: number
}

export async function saveTestResults(results: TestResults) {
  const supabase = await createServerClient()

  // Obter o usuário atual
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id || BYPASS_USER_ID

  const { data: existingTest } = await supabase.from("teste").select("teste_id").eq("usuario_id", userId).maybeSingle()

  const testData = {
    usuario_id: userId,
    teste_area1: areaNames["logico-matematica"],
    teste_porcentagem1: results["logico-matematica"],
    teste_area2: areaNames["linguistica"],
    teste_porcentagem2: results["linguistica"],
    teste_area3: areaNames["espacial"],
    teste_porcentagem3: results["espacial"],
    teste_area4: areaNames["corporal-cinestesica"],
    teste_porcentagem4: results["corporal-cinestesica"],
    teste_area5: areaNames["musical"],
    teste_porcentagem5: results["musical"],
    teste_area6: areaNames["interpessoal"],
    teste_porcentagem6: results["interpessoal"],
    teste_area7: areaNames["intrapessoal"],
    teste_porcentagem7: results["intrapessoal"],
    teste_area8: areaNames["naturalista"],
    teste_porcentagem8: results["naturalista"],
    teste_area9: areaNames["existencial"],
    teste_porcentagem9: results["existencial"],
  }

  if (existingTest) {
    // Atualizar resultado existente
    const { error } = await supabase.from("teste").update(testData).eq("teste_id", existingTest.teste_id)

    if (error) {
      console.error("Error updating test results:", error)
      return { success: false, error: error.message }
    }
  } else {
    // Inserir novo resultado
    const { error } = await supabase.from("teste").insert(testData)

    if (error) {
      console.error("Error saving test results:", error)
      return { success: false, error: error.message }
    }
  }

  return { success: true }
}

export async function getTestResults() {
  const supabase = await createServerClient()

  // Obter o usuário atual
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id || BYPASS_USER_ID

  const { data, error } = await supabase.from("teste").select("*").eq("usuario_id", userId).maybeSingle()

  if (error) {
    console.error("Error fetching test results:", error)
    return { success: false, data: null }
  }

  if (!data) {
    // No test results found for this user - this is normal, not an error
    return { success: true, data: null }
  }

  // Converter de volta para o formato do frontend
  const results: TestResults = {
    "logico-matematica": data.teste_porcentagem1,
    linguistica: data.teste_porcentagem2,
    espacial: data.teste_porcentagem3,
    "corporal-cinestesica": data.teste_porcentagem4,
    musical: data.teste_porcentagem5,
    interpessoal: data.teste_porcentagem6,
    intrapessoal: data.teste_porcentagem7,
    naturalista: data.teste_porcentagem8,
    existencial: data.teste_porcentagem9,
  }

  return { success: true, data: results }
}

export async function deleteTestResults() {
  const supabase = await createServerClient()

  // Obter o usuário atual
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id || BYPASS_USER_ID

  const { error } = await supabase.from("teste").delete().eq("usuario_id", userId)

  if (error) {
    console.error("Error deleting test results:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
