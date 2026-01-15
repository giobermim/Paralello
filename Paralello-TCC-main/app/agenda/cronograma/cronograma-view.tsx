"use client"

// Este componente roda no cliente (React). Ele exibe um cronograma semanal
// com suporte a preferências pré-definidas, criação de cronogramas
// personalizados (arrastar e soltar) e salvar/recuperar cronogramas do servidor.
// Comentários em PT-BR: explico a intenção de cada bloco para facilitar leitura.
import type React from "react"
import { Fragment, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Pencil, X, Check, Coffee, GripVertical, Eye, Loader2, Trash2 } from "lucide-react"
import {
  saveCronogramaPersonalizado,
  getCronogramasPersonalizados,
  deleteCronogramaPersonalizado,
} from "@/app/actions/cronograma-personalizado"
import { toast } from "sonner"

// Tipos simples para preferências do usuário. Usamos essas chaves para
// indexar o mapa `schedules` com cronogramas pré-definidos.
type Preference = "exatas" | "humanas" | "naturais" | "equilibrado"

// Estrutura esperada para um cronograma salvo no servidor.
// Mantemos esse tipo para tipar o estado local quando carregamos
// cronogramas do backend e para converter o formato para exibição.
interface SavedCronograma {
  cronograma_id: number
  cronograma_titulo: string
  slots: {
    slots_id: number
    // índice do dia (0..6)
    slots_dia: number
    // hora no formato HH:MM:SS — usamos para mapear para a coluna correta
    slots_hora_inicio: string
    slots_hora_fim: string
    disciplina: {
      disciplina_id: number
      disciplina_nome: string
      disciplina_cor: string
    }
  }[]
}

// Cronogramas pré-definidos por preferência. Cada entrada tem 7 dias e
// 8 slots por dia (a estrutura esperada para renderização da tabela).
const schedules: Record<Preference, { day: string; slots: string[] }[]> = {
  exatas: [
    {
      day: "Domingo",
      slots: [
        "Revisão (Matemática)",
        "Revisão (Física)",
        "Revisão (Química)",
        "Pausa",
        "Leitura (Literatura)",
        "História",
        "Geografia",
        "Pausa",
      ],
    },
    {
      day: "Segunda",
      slots: ["Matemática", "Física", "Química", "Pausa", "Língua Portuguesa", "Literatura", "História", "Pausa"],
    },
    {
      day: "Terça",
      slots: ["Matemática", "Matemática", "Física", "Química", "Pausa", "Redação", "Geografia", "Filosofia"],
    },
    {
      day: "Quarta",
      slots: ["Física", "Matemática", "Língua Portuguesa", "Química", "Pausa", "Sociologia", "Biologia", "Pausa"],
    },
    {
      day: "Quinta",
      slots: ["Matemática", "Física", "Matemática", "Pausa", "Química", "Língua Estrangeira", "Literatura", "História"],
    },
    { day: "Sexta", slots: ["Química", "Matemática", "Física", "Pausa", "Biologia", "Redação", "Sociologia", "Pausa"] },
    {
      day: "Sábado",
      slots: ["Simulado (Exatas)", "Simulado", "Pausa", "Matemática", "Física", "Química", "Pausa", "Pausa"],
    },
  ],
  humanas: [
    {
      day: "Domingo",
      slots: [
        "Leitura (Literatura)",
        "Língua Portuguesa",
        "Pausa",
        "História",
        "Geografia",
        "Sociologia",
        "Filosofia",
        "Pausa",
      ],
    },
    {
      day: "Segunda",
      slots: ["História", "Geografia", "Sociologia", "Pausa", "Filosofia", "Redação", "Matemática", "Pausa"],
    },
    {
      day: "Terça",
      slots: [
        "Geografia",
        "História",
        "Sociologia",
        "Filosofia",
        "Pausa",
        "Língua Portuguesa",
        "Literatura",
        "Biologia",
      ],
    },
    {
      day: "Quarta",
      slots: ["História", "Geografia", "Filosofia", "Pausa", "Sociologia", "Matemática", "Física", "Química"],
    },
    {
      day: "Quinta",
      slots: [
        "Geografia",
        "História",
        "Literatura",
        "Pausa",
        "Língua Estrangeira",
        "Língua Portuguesa",
        "Sociologia",
        "Filosofia",
      ],
    },
    {
      day: "Sexta",
      slots: ["História", "Sociologia", "Geografia", "Pausa", "Filosofia", "Redação", "Matemática", "Pausa"],
    },
    {
      day: "Sábado",
      slots: [
        "Simulado (Humanas)",
        "Simulado",
        "Pausa",
        "Revisão História",
        "Revisão Geografia",
        "Revisão Sociologia/Filosofia",
        "Pausa",
        "Pausa",
      ],
    },
  ],
  naturais: [
    {
      day: "Domingo",
      slots: [
        "Revisão (Biologia)",
        "Revisão (Química)",
        "Revisão (Física)",
        "Pausa",
        "História",
        "Língua Estrangeira",
        "Filosofia",
        "Pausa",
      ],
    },
    {
      day: "Segunda",
      slots: ["Biologia", "Química", "Física", "Pausa", "Matemática", "Língua Portuguesa", "História", "Pausa"],
    },
    {
      day: "Terça",
      slots: ["Química", "Biologia", "Física", "Matemática", "Pausa", "Redação", "Geografia", "Sociologia"],
    },
    {
      day: "Quarta",
      slots: ["Biologia", "Física", "Química", "Pausa", "Matemática", "Literatura", "Filosofia", "Língua Estrangeira"],
    },
    {
      day: "Quinta",
      slots: ["Física", "Química", "Biologia", "Pausa", "Matemática", "Redação", "História", "Geografia"],
    },
    {
      day: "Sexta",
      slots: ["Biologia", "Química", "Física", "Pausa", "Língua Portuguesa", "Literatura", "Sociologia", "Pausa"],
    },
    {
      day: "Sábado",
      slots: ["Simulado (Natureza)", "Simulado", "Pausa", "Biologia", "Física", "Química", "Pausa", "Pausa"],
    },
  ],
  equilibrado: [
    {
      day: "Domingo",
      slots: ["Leitura (Literatura)", "Biologia", "Química", "Pausa", "Geografia", "História", "Física", "Pausa"],
    },
    {
      day: "Segunda",
      slots: ["Língua Portuguesa", "Matemática", "Biologia", "Pausa", "História", "Redação", "Física", "Pausa"],
    },
    {
      day: "Terça",
      slots: [
        "Literatura",
        "Geografia",
        "Química",
        "Pausa",
        "Matemática",
        "Língua Estrangeira",
        "Filosofia",
        "Biologia",
      ],
    },
    {
      day: "Quarta",
      slots: ["Sociologia", "Matemática", "Física", "Pausa", "História", "Língua Portuguesa", "Química", "Pausa"],
    },
    {
      day: "Quinta",
      slots: ["Redação", "Geografia", "Biologia", "Pausa", "Literatura", "Matemática", "Filosofia", "Física"],
    },
    {
      day: "Sexta",
      slots: ["História", "Sociologia", "Química", "Pausa", "Língua Estrangeira", "Literatura", "Matemática", "Pausa"],
    },
    {
      day: "Sábado",
      slots: [
        "Simulado Geral",
        "Simulado",
        "Pausa",
        "Revisão Redação",
        "Revisão Humanas",
        "Revisão Exatas",
        "Revisão Natureza",
        "Pausa",
      ],
    },
  ],
}

// Lista de disciplinas disponíveis para arrastar/soltar ao criar um
// cronograma personalizado. Cada disciplina carrega uma cor usada na UI.
const DISCIPLINAS = [
  { nome: "Língua Portuguesa", cor: "#FC1F69" },
  { nome: "Literatura", cor: "#1a1a1a" },
  { nome: "Redação", cor: "#9333EA" },
  { nome: "Língua Estrangeira", cor: "#0EA5E9" },
  { nome: "Matemática", cor: "#EAB308" },
  { nome: "Física", cor: "#FC1F69" },
  { nome: "Química", cor: "#F97316" },
  { nome: "Biologia", cor: "#22C55E" },
  { nome: "História", cor: "#EF4444" },
  { nome: "Geografia", cor: "#22C55E" },
  { nome: "Sociologia", cor: "#3B82F6" },
  { nome: "Filosofia", cor: "#6B7280" },
  { nome: "Pausa", cor: "#D97706" },
]

// Mapas auxiliares para renderização: labels curtas, labels completas e
// horários visuais (essas strings aparecem na tabela do cronograma).
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const DIAS_SEMANA_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
const HORARIOS = ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM"]

// Quando carregamos cronogramas salvos o backend pode enviar horas no
// formato HH:MM:SS; esse mapa traduz para o índice (0..7) usado na tabela.
const HORARIO_INDEX_MAP: Record<string, number> = {
  "07:00:00": 0,
  "08:00:00": 1,
  "09:00:00": 2,
  "10:00:00": 3,
  "11:00:00": 4,
  "12:00:00": 5,
  "13:00:00": 6,
  "14:00:00": 7,
}

// Estilos (classes Tailwind) por assunto; usados ao renderizar a célula
// para dar contraste e indicar o tipo de atividade.
const subjectColors: Record<string, string> = {
  Matemática: "bg-blue-200 border-l-4 border-blue-600 text-blue-700",
  Física: "bg-pink-200 border-l-4 border-pink-600 text-pink-700",
  Química: "bg-purple-200 border-l-4 border-purple-600 text-purple-700",
  Biologia: "bg-green-200 border-l-4 border-green-600 text-green-700",
  História: "bg-yellow-200 border-l-4 border-yellow-600 text-yellow-700",
  Geografia: "bg-orange-200 border-l-4 border-orange-600 text-orange-700",
  "Língua Portuguesa": "bg-red-100 border-l-4 border-red-500 text-red-700",
  Literatura: "bg-red-200 border-l-4 border-red-600 text-red-700",
  Redação: "bg-fuchsia-200 border-l-4 border-fuchsia-600 text-fuchsia-700",
  Filosofia: "bg-gray-200 border-l-4 border-gray-600 text-gray-700",
  Sociologia: "bg-cyan-200 border-l-4 border-cyan-600 text-cyan-700",
  "Língua Estrangeira": "bg-violet-200 border-l-4 border-violet-600 text-violet-700",
  Pausa: "bg-amber-100 border-l-4 border-amber-400 text-amber-700",
  Simulado: "bg-rose-200 border-l-4 border-rose-500 text-rose-700",
}

export function CronogramaView() {
  const [preference, setPreference] = useState<Preference>("equilibrado")
  const [isEditMode, setIsEditMode] = useState(false)
  const [titulo, setTitulo] = useState("")
  const [customSchedule, setCustomSchedule] = useState<Record<string, Record<string, string | null>>>({})
  const [draggedDisciplina, setDraggedDisciplina] = useState<string | null>(null)
  const [dragOverCell, setDragOverCell] = useState<{ dia: string; horario: string } | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [savedCronogramas, setSavedCronogramas] = useState<SavedCronograma[]>([])
  const [selectedSavedCronograma, setSelectedSavedCronograma] = useState<SavedCronograma | null>(null)
  const [isLoadingSaved, setIsLoadingSaved] = useState(false)

  useEffect(() => {
    loadSavedCronogramas()
  }, [])

  const loadSavedCronogramas = async () => {
    setIsLoadingSaved(true)
    const result = await getCronogramasPersonalizados()
    if (result.data) {
      // Normaliza e valida em runtime o formato retornado pelo servidor.
      // Isso evita casts amplos para `any` em outras partes do código.
      const normalize = (data: unknown): SavedCronograma[] => {
        if (!Array.isArray(data)) return []

        return data.map((c) => {
          const cronogramaId = Number((c as any)?.cronograma_id ?? NaN) || 0
          const cronogramaTitulo = String((c as any)?.cronograma_titulo ?? "")
          const rawSlots = (c as any)?.slots
          const slotsArr: SavedCronograma["slots"] = Array.isArray(rawSlots)
            ? rawSlots.map((s) => {
                const disciplinaRaw = (s as any)?.disciplina
                const disciplina = Array.isArray(disciplinaRaw) ? disciplinaRaw[0] : disciplinaRaw
                return {
                  slots_id: Number((s as any)?.slots_id ?? 0),
                  slots_dia: Number((s as any)?.slots_dia ?? 0),
                  slots_hora_inicio: String((s as any)?.slots_hora_inicio ?? ""),
                  slots_hora_fim: String((s as any)?.slots_hora_fim ?? ""),
                  disciplina: {
                    disciplina_id: Number(disciplina?.disciplina_id ?? 0),
                    disciplina_nome: String(disciplina?.disciplina_nome ?? ""),
                    disciplina_cor: String(disciplina?.disciplina_cor ?? ""),
                  },
                }
              })
            : []

          return {
            cronograma_id: cronogramaId,
            cronograma_titulo: cronogramaTitulo,
            slots: slotsArr,
          }
        })
      }

      const sanitized = normalize(result.data)
      setSavedCronogramas(sanitized)
    }
    setIsLoadingSaved(false)
  }

  const convertSavedToDisplayFormat = (cronograma: SavedCronograma): { day: string; slots: string[] }[] => {
    const result: { day: string; slots: string[] }[] = DIAS_SEMANA_FULL.map((day) => ({
      day,
      slots: Array(8).fill(""),
    }))

    cronograma.slots.forEach((slot) => {
      const dayIndex = slot.slots_dia
      const horarioIndex = HORARIO_INDEX_MAP[slot.slots_hora_inicio]
      if (dayIndex >= 0 && dayIndex < 7 && horarioIndex !== undefined) {
        result[dayIndex].slots[horarioIndex] = slot.disciplina?.disciplina_nome || ""
      }
    })

    return result
  }

  const currentSchedule = selectedSavedCronograma
    ? convertSavedToDisplayFormat(selectedSavedCronograma)
    : schedules[preference]

  const handleDragStart = (e: React.DragEvent, disciplina: string) => {
    setDraggedDisciplina(disciplina)
    e.dataTransfer.setData("text/plain", disciplina)
    e.dataTransfer.effectAllowed = "copy"
  }

  const handleDragEnd = () => {
    setDraggedDisciplina(null)
    setDragOverCell(null)
  }

  const handleDragOver = (e: React.DragEvent, dia: string, horario: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    setDragOverCell({ dia, horario })
  }

  const handleDragLeave = () => {
    setDragOverCell(null)
  }

  const handleDrop = (e: React.DragEvent, dia: string, horario: string) => {
    e.preventDefault()
    const disciplina = e.dataTransfer.getData("text/plain")
    if (disciplina) {
      setCustomSchedule((prev) => ({
        ...prev,
        [dia]: {
          ...prev[dia],
          [horario]: disciplina,
        },
      }))
    }
    setDragOverCell(null)
    setDraggedDisciplina(null)
  }

  const handleClearCell = (e: React.MouseEvent, dia: string, horario: string) => {
    e.preventDefault()
    setCustomSchedule((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [horario]: null,
      },
    }))
  }

  const handleStartEdit = () => {
    const initialSchedule: Record<string, Record<string, string | null>> = {}
    DIAS_SEMANA.forEach((dia) => {
      initialSchedule[dia] = {}
      HORARIOS.forEach((horario) => {
        initialSchedule[dia][horario] = null
      })
    })
    setCustomSchedule(initialSchedule)
    setSelectedSavedCronograma(null)
    setIsEditMode(true)
  }

  const handleSaveCustomSchedule = async () => {
    if (!titulo.trim()) return

    setIsSaving(true)
    const result = await saveCronogramaPersonalizado({
      titulo: titulo.trim(),
      schedule: customSchedule,
    })

    if (result.error) {
      toast.error("Erro ao salvar cronograma: " + result.error)
    } else {
      toast.success("Cronograma salvo com sucesso!")
      setIsEditMode(false)
      setTitulo("")
      loadSavedCronogramas()
    }
    setIsSaving(false)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setTitulo("")
    setDraggedDisciplina(null)
    setDragOverCell(null)
  }

  const handleViewSavedCronograma = (cronograma: SavedCronograma) => {
    setSelectedSavedCronograma(cronograma)
    setIsEditMode(false)
  }

  const handleBackToPredefined = () => {
    setSelectedSavedCronograma(null)
  }

  const handleDeleteCronograma = async (cronogramaId: number, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm("Deseja realmente apagar este cronograma?")) {
      return
    }

    const result = await deleteCronogramaPersonalizado(cronogramaId)

    if (result.success) {
      toast.success("Cronograma apagado com sucesso!")

      if (selectedSavedCronograma?.cronograma_id === cronogramaId) {
        setSelectedSavedCronograma(null)
      }

      loadSavedCronogramas()
    } else {
      toast.error("Erro ao apagar: " + (result.error || "Não foi possível apagar o cronograma."))
    }
  }

  const getDisciplinaInfo = (nome: string) => {
    return DISCIPLINAS.find((d) => d.nome === nome)
  }

  const getSubjectColor = (subject: string) => {
    if (subjectColors[subject]) return subjectColors[subject]

    for (const [key, color] of Object.entries(subjectColors)) {
      if (subject.includes(key)) return color
    }

    if (subject.includes("Revisão") || subject.includes("Leitura")) {
      return "bg-indigo-200 border-l-4 border-indigo-500 text-indigo-700"
    }

    return "bg-gray-200 border-l-4 border-gray-400 text-gray-700"
  }

  return (
    <div className="flex gap-3 h-full overflow-hidden">
      <div className="w-48 flex-shrink-0 space-y-2 overflow-hidden">
        {!isEditMode ? (
          <>
            <Card className="p-2.5 space-y-2">
              <div>
                <h3 className="font-semibold text-[10px] mb-0.5">Preferências</h3>
                <p className="text-[9px] text-muted-foreground mb-1.5">Escolha seu próprio Cronograma</p>
              </div>

              <RadioGroup
                value={selectedSavedCronograma ? "" : preference}
                onValueChange={(v) => {
                  setPreference(v as Preference)
                  setSelectedSavedCronograma(null)
                }}
                className="space-y-1"
              >
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="exatas" id="exatas" className="h-3 w-3" />
                  <Label htmlFor="exatas" className="text-[10px]">
                    Ciências Exatas
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="humanas" id="humanas" className="h-3 w-3" />
                  <Label htmlFor="humanas" className="text-[10px]">
                    Ciências Humanas
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="naturais" id="naturais" className="h-3 w-3" />
                  <Label htmlFor="naturais" className="text-[10px]">
                    Ciências da Natureza
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="equilibrado" id="equilibrado" className="h-3 w-3" />
                  <Label htmlFor="equilibrado" className="text-[10px]">
                    Equilibrado
                  </Label>
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-2.5 space-y-1.5">
              <div>
                <h3 className="font-semibold text-[10px] mb-0.5">Meus Cronogramas</h3>
                <p className="text-[9px] text-muted-foreground">Cronogramas salvos</p>
              </div>

              {isLoadingSaved ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : savedCronogramas.length > 0 ? (
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {savedCronogramas.map((cronograma) => (
                    <div
                      key={cronograma.cronograma_id}
                      className={`flex items-center justify-between p-1.5 rounded-md cursor-pointer transition-colors ${
                        selectedSavedCronograma?.cronograma_id === cronograma.cronograma_id
                          ? "bg-[#6366F1]/20 border border-[#6366F1]"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                      onClick={() => handleViewSavedCronograma(cronograma)}
                    >
                      <span className="text-[9px] font-medium truncate flex-1">{cronograma.cronograma_titulo}</span>
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          onClick={(e) => handleDeleteCronograma(cronograma.cronograma_id, e)}
                          className="p-0.5 hover:bg-destructive/20 rounded transition-colors"
                          title="Apagar cronograma"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                        <Eye className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[8px] text-muted-foreground italic">Nenhum cronograma salvo</p>
              )}
            </Card>

            <Card className="p-2.5 space-y-1.5">
              <div>
                <h3 className="font-semibold text-[10px] mb-0.5">Personalizado</h3>
                <p className="text-[9px] text-muted-foreground">Faça seu próprio Cronograma</p>
              </div>

              <Button
                variant="outline"
                className="w-full border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white bg-transparent text-[10px] py-1 h-6"
                onClick={handleStartEdit}
              >
                <span className="mr-1">+</span> Criar
              </Button>
            </Card>
          </>
        ) : (
          <Card className="p-2.5 h-full flex flex-col">
            <span className="text-[10px] font-semibold text-muted-foreground mb-2">Arraste as disciplinas:</span>
            <div className="flex flex-col gap-1 flex-1">
              {DISCIPLINAS.map((disciplina) => (
                <div
                  key={disciplina.nome}
                  draggable
                  onDragStart={(e) => handleDragStart(e, disciplina.nome)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md cursor-grab active:cursor-grabbing border transition-all select-none ${
                    draggedDisciplina === disciplina.nome ? "opacity-50 scale-95" : "hover:scale-[1.02] hover:shadow-sm"
                  }`}
                  style={{
                    backgroundColor: `${disciplina.cor}15`,
                    borderColor: `${disciplina.cor}40`,
                  }}
                >
                  <GripVertical className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
                  {disciplina.nome === "Pausa" ? (
                    <Coffee className="h-2.5 w-2.5 flex-shrink-0" style={{ color: disciplina.cor }} />
                  ) : (
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: disciplina.cor }} />
                  )}
                  <span className="text-[9px] font-medium truncate" style={{ color: disciplina.cor }}>
                    {disciplina.nome}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-muted-foreground mt-2 pt-2 border-t">Clique direito para remover</p>
          </Card>
        )}
      </div>

      <Card className="flex-1 p-2.5 overflow-hidden flex flex-col">
        {isEditMode && (
          <div className="flex items-center justify-between mb-2 pb-2 border-b">
            <h3 className="text-sm font-semibold">Cronograma personalizado</h3>
            <div className="flex items-center gap-2">
              <Label className="text-[10px] font-medium">
                Título<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Escreva seu Título"
                  className="pr-8 w-[200px] h-7 text-[10px]"
                />
                <Pencil className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[10px] gap-1 bg-transparent"
                onClick={handleCancelEdit}
              >
                <X className="h-3 w-3" />
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-[#FC1F69] hover:bg-[#E01B5E] h-7 text-[10px] gap-1"
                onClick={handleSaveCustomSchedule}
                disabled={!titulo.trim() || isSaving}
              >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        )}

        {selectedSavedCronograma && !isEditMode && (
          <div className="flex items-center justify-between mb-2 pb-2 border-b">
            <h3 className="text-sm font-semibold">{selectedSavedCronograma.cronograma_titulo}</h3>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px] gap-1 bg-transparent"
              onClick={handleBackToPredefined}
            >
              <X className="h-3 w-3" />
              Voltar
            </Button>
          </div>
        )}

        <div className="h-full overflow-hidden">
          {!isEditMode ? (
            <div className="grid grid-cols-8 gap-0.5 h-full">
              <div className="font-semibold text-[9px] text-muted-foreground"></div>
              {currentSchedule.map((day, idx) => (
                <div key={idx} className="font-semibold text-[9px] text-center">
                  {day.day}
                </div>
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((timeIdx) => (
                <Fragment key={`row-${timeIdx}`}>
                  <div className="text-[9px] text-muted-foreground py-0.5 flex items-center">{HORARIOS[timeIdx]}</div>
                  {currentSchedule.map((day, dayIdx) => {
                    const subject = day.slots[timeIdx]
                    return (
                      <div key={`${dayIdx}-${timeIdx}`} className="border-t py-0.5">
                        {subject && (
                          <div
                            className={`${getSubjectColor(subject)} px-1 py-0.5 rounded text-[7px] font-medium h-full flex items-center justify-center text-center`}
                          >
                            {subject}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </Fragment>
              ))}
            </div>
          ) : (
            <table className="w-full h-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="w-[50px] p-1 text-left text-[9px] font-medium text-muted-foreground border-b"></th>
                  {DIAS_SEMANA.map((dia) => (
                    <th
                      key={dia}
                      className={`p-1 text-center text-[9px] font-semibold border-b ${
                        dia === "Qui" ? "bg-[#6366F1]/10 text-[#6366F1]" : ""
                      }`}
                    >
                      {dia}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HORARIOS.map((horario) => (
                  <tr key={horario} className="h-[calc((100%-30px)/8)]">
                    <td className="p-1 text-[8px] text-muted-foreground border-b whitespace-nowrap">{horario}</td>
                    {DIAS_SEMANA.map((dia) => {
                      const selectedDisciplina = customSchedule[dia]?.[horario]
                      const disciplinaInfo = selectedDisciplina ? getDisciplinaInfo(selectedDisciplina) : null
                      const isDragOver = dragOverCell?.dia === dia && dragOverCell?.horario === horario

                      return (
                        <td
                          key={`${dia}-${horario}`}
                          className={`p-0.5 border-b border-r transition-all ${
                            dia === "Qui" ? "bg-[#6366F1]/5" : ""
                          } ${isDragOver ? "bg-blue-100 ring-2 ring-blue-400 ring-inset" : ""}`}
                          onDragOver={(e) => handleDragOver(e, dia, horario)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, dia, horario)}
                          onContextMenu={(e) => handleClearCell(e, dia, horario)}
                        >
                          {selectedDisciplina && disciplinaInfo ? (
                            <div
                              className="text-[7px] font-medium px-1 py-1 rounded flex items-center justify-center h-full"
                              style={{
                                backgroundColor: `${disciplinaInfo.cor}20`,
                                color: disciplinaInfo.cor,
                              }}
                            >
                              {selectedDisciplina}
                            </div>
                          ) : (
                            <div className="h-full min-h-[24px] border border-dashed border-gray-200 rounded flex items-center justify-center">
                              <span className="text-[7px] text-gray-300">+</span>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}
