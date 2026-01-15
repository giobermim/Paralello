"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createNote, updateNote, deleteNote } from "@/app/agenda/notas/actions"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Trash2, CheckCircle2 } from "lucide-react"

interface Note {
  anotacao_id: number
  anotacao_titulo: string
  anotacao_descricao: string
  anotacao_texto: string
  anotacao_publica: boolean
  disciplina_id: number | null
  disciplina: {
    disciplina_id: number
    disciplina_nome: string
    disciplina_cor: string
  } | null
}

interface Disciplina {
  disciplina_id: number
  disciplina_nome: string
  disciplina_cor: string
}

interface NoteDialogProps {
  isOpen: boolean
  onClose: () => void
  note?: Note | null
  availableDisciplinas: Disciplina[]
}

export function NoteDialog({ isOpen, onClose, note, availableDisciplinas }: NoteDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [titulo, setTitulo] = useState("")
  const [conteudo, setConteudo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState<string | null>(null)
  const [publica, setPublica] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { toast } = useToast()

  const uniqueDisciplinas = availableDisciplinas.filter(
    (disciplina, index, self) => index === self.findIndex((d) => d.disciplina_nome === disciplina.disciplina_nome),
  )

  useEffect(() => {
    if (note) {
      setTitulo(note.anotacao_titulo)
      setConteudo(note.anotacao_texto || "")
      setDescricao(note.anotacao_descricao || "")
      setSelectedDisciplinaId(note.disciplina_id?.toString() || null)
      setPublica(note.anotacao_publica || false)
    } else {
      resetForm()
    }
  }, [note, isOpen])

  const resetForm = () => {
    setTitulo("")
    setConteudo("")
    setDescricao("")
    setSelectedDisciplinaId(null)
    setPublica(false)
    setShowDeleteConfirm(false)
    setShowSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (!descricao.trim()) {
      toast({
        title: "Erro",
        description: "A descrição é obrigatória",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("titulo", titulo.trim())
    formData.append("descricao", descricao.trim())
    formData.append("texto", conteudo)
    formData.append("publica", String(publica))

    if (selectedDisciplinaId) {
      formData.append("disciplina_id", selectedDisciplinaId)
    }

    try {
      let result
      if (note) {
        result = await updateNote(note.anotacao_id.toString(), formData)
      } else {
        result = await createNote(formData)
      }

      if (result.error) {
        throw new Error(result.error)
      }

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        resetForm()
        onClose()
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.log("[v0] Error saving note:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar nota",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!note) return
    setIsLoading(true)
    try {
      const result = await deleteNote(note.anotacao_id.toString())
      if (result.error) throw new Error(result.error)

      toast({
        title: "Sucesso",
        description: "Nota removida com sucesso",
      })
      onClose()
      window.location.reload()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover nota",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Nota Salva!</h3>
            <p className="text-muted-foreground text-sm">
              {publica ? "Obrigado por contribuir com a nossa comunidade!" : "Sua nota foi salva com sucesso."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] w-[1600px] h-[90vh] p-0 flex flex-col overflow-hidden">
        <div className="flex gap-0 h-full">
          {/* Área principal de edição */}
          <div className="flex-1 flex flex-col space-y-4 p-8 overflow-y-auto min-w-0">
            <div className="space-y-2">
              <Input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título da nota"
                className="text-3xl font-bold border-none px-0 focus-visible:ring-0 h-16"
              />
            </div>

            <div className="flex-1 min-h-0">
              <Textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Comece a escrever..."
                className="h-full border-none px-0 focus-visible:ring-0 resize-none text-lg leading-relaxed"
              />
            </div>
          </div>

          <div className="w-[220px] flex-shrink-0 flex flex-col space-y-3 border-l bg-muted/30 p-3 overflow-y-auto">
            <div>
              <h3 className="font-semibold text-xs">Configurações Gerais</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-medium">Tag por Matéria</Label>
                <Select value={selectedDisciplinaId || ""} onValueChange={(value) => setSelectedDisciplinaId(value)}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueDisciplinas.map((disciplina) => (
                      <SelectItem key={disciplina.disciplina_id} value={disciplina.disciplina_id.toString()}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: disciplina.disciplina_cor }}
                          />
                          <span style={{ color: disciplina.disciplina_cor }} className="font-medium text-xs">
                            {disciplina.disciplina_nome}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-medium">Descrição*</Label>
                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Breve descrição..."
                  maxLength={300}
                  className="min-h-[60px] text-xs resize-none"
                />
                <p className="text-[9px] text-muted-foreground text-right">{descricao.length}/300</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-medium">Publicar?</Label>
                  <Switch checked={publica} onCheckedChange={setPublica} className="scale-75" />
                </div>
                <p className="text-[9px] text-muted-foreground">{publica ? "Pública" : "Privada"}</p>
              </div>
            </div>

            <div className="flex-1" />

            {showDeleteConfirm ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 space-y-2">
                <div className="flex items-start gap-1.5">
                  <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trash2 className="h-2.5 w-2.5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[10px]">Deletar?</h3>
                    <p className="text-[9px] text-muted-foreground">Ação irreversível</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 text-[10px] h-7"
                  >
                    Não
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="flex-1 text-[10px] h-7"
                  >
                    {isLoading ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : "Sim"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Button
                  className="w-full bg-[#FC1F69] hover:bg-[#FC1F69]/90 text-white text-[10px] h-8 font-medium"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
                  Salvar Nota
                </Button>
                <Button variant="outline" className="w-full text-[10px] h-8 bg-transparent" onClick={onClose}>
                  Cancelar
                </Button>
                {note && (
                  <Button
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 text-[10px] h-7"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-2.5 w-2.5 mr-1" />
                    Deletar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
