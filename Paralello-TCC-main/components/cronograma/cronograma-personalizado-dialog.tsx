"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, X, Check, Coffee, GripVertical } from "lucide-react"
import { saveCronogramaPersonalizado } from "@/app/actions/cronograma-personalizado"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const HORARIOS = ["7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"]

interface CronogramaPersonalizadoDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (data: { titulo: string; schedule: Record<string, Record<string, string | null>> }) => void
}

export function CronogramaPersonalizadoDialog({ isOpen, onClose, onSave }: CronogramaPersonalizadoDialogProps) {
  const [titulo, setTitulo] = useState("")
  const [schedule, setSchedule] = useState<Record<string, Record<string, string | null>>>({})
  const [draggedDisciplina, setDraggedDisciplina] = useState<string | null>(null)
  const [dragOverCell, setDragOverCell] = useState<{ dia: string; horario: string } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const initialSchedule: Record<string, Record<string, string | null>> = {}
    DIAS_SEMANA.forEach((dia) => {
      initialSchedule[dia] = {}
      HORARIOS.forEach((horario) => {
        initialSchedule[dia][horario] = null
      })
    })
    setSchedule(initialSchedule)
  }, [isOpen])

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
      setSchedule((prev) => ({
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
    setSchedule((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [horario]: null,
      },
    }))
  }

  const handleSave = async () => {
    if (titulo.trim()) {
      setIsSaving(true)

      try {
        console.log("[v0] Iniciando salvamento do cronograma:", titulo)
        console.log("[v0] Schedule data:", JSON.stringify(schedule))

        const result = await saveCronogramaPersonalizado({
          titulo: titulo.trim(),
          schedule,
        })

        console.log("[v0] Resultado do salvamento:", result)

        setIsSaving(false)

        if (result.error) {
          toast.error("Erro ao salvar cronograma: " + result.error)
          return
        }

        toast.success("Cronograma salvo com sucesso!")

        if (onSave) {
          onSave({ titulo: titulo.trim(), schedule })
        }

        router.refresh()
        onClose()
      } catch (error) {
        console.error("[v0] Erro ao salvar:", error)
        setIsSaving(false)
        toast.error("Erro inesperado ao salvar cronograma")
      }
    }
  }

  const handleClose = () => {
    setTitulo("")
    setDraggedDisciplina(null)
    setDragOverCell(null)
    onClose()
  }

  const getDisciplinaInfo = (nome: string) => {
    return DISCIPLINAS.find((d) => d.nome === nome)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[98vw] h-[90vh] max-w-none p-0 flex flex-col overflow-hidden">
        {/* Header com título */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-xl font-bold">Cronograma personalizado</h2>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">
              Título<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Escreva seu Título"
                className="pr-10 w-[250px]"
              />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Painel de disciplinas à esquerda */}
          <div className="w-[180px] flex-shrink-0 border-r bg-gray-50 p-3 flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground mb-3">Arraste as disciplinas:</span>
            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
              {DISCIPLINAS.map((disciplina) => (
                <div
                  key={disciplina.nome}
                  draggable
                  onDragStart={(e) => handleDragStart(e, disciplina.nome)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-grab active:cursor-grabbing border transition-all select-none ${
                    draggedDisciplina === disciplina.nome ? "opacity-50 scale-95" : "hover:scale-[1.02] hover:shadow-sm"
                  }`}
                  style={{
                    backgroundColor: `${disciplina.cor}15`,
                    borderColor: `${disciplina.cor}40`,
                  }}
                >
                  <GripVertical className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  {disciplina.nome === "Pausa" ? (
                    <Coffee className="h-3 w-3 flex-shrink-0" style={{ color: disciplina.cor }} />
                  ) : (
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: disciplina.cor }}
                    />
                  )}
                  <span className="text-xs font-medium truncate" style={{ color: disciplina.cor }}>
                    {disciplina.nome}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 pt-3 border-t">Clique direito para remover</p>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <table className="w-full h-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="w-[60px] p-2 text-left text-sm font-medium text-muted-foreground border-b"></th>
                  {DIAS_SEMANA.map((dia) => (
                    <th
                      key={dia}
                      className={`p-2 text-center text-sm font-semibold border-b ${
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
                  <tr key={horario} className="h-[calc((90vh-180px)/11)]">
                    <td className="p-2 text-xs text-muted-foreground border-b whitespace-nowrap">{horario}</td>
                    {DIAS_SEMANA.map((dia) => {
                      const selectedDisciplina = schedule[dia]?.[horario]
                      const disciplinaInfo = selectedDisciplina ? getDisciplinaInfo(selectedDisciplina) : null
                      const isPausa = selectedDisciplina === "Pausa"
                      const isDragOver = dragOverCell?.dia === dia && dragOverCell?.horario === horario

                      return (
                        <td
                          key={`${dia}-${horario}`}
                          className={`p-1 border-b border-r transition-all ${
                            dia === "Qui" ? "bg-[#6366F1]/5" : ""
                          } ${isDragOver ? "bg-blue-100 ring-2 ring-blue-400 ring-inset" : ""}`}
                          onDragOver={(e) => handleDragOver(e, dia, horario)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, dia, horario)}
                          onContextMenu={(e) => handleClearCell(e, dia, horario)}
                        >
                          {selectedDisciplina && disciplinaInfo ? (
                            <div
                              className="text-xs font-medium px-2 py-2 rounded flex items-center justify-center h-full"
                              style={{
                                backgroundColor: `${disciplinaInfo.cor}20`,
                                color: disciplinaInfo.cor,
                              }}
                            >
                              {isPausa && <Coffee className="h-3 w-3 mr-1 flex-shrink-0" />}
                              <span className="truncate">{selectedDisciplina}</span>
                            </div>
                          ) : (
                            <div
                              className={`h-full min-h-[40px] rounded border-2 border-dashed transition-colors ${
                                isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                              }`}
                            />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3 p-4 border-t bg-white">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleClose}>
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            className="bg-[#FC1F69] hover:bg-[#E01B5E] gap-2"
            onClick={handleSave}
            disabled={!titulo.trim() || isSaving}
          >
            <Check className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
