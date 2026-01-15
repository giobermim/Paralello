"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Trash2, Calendar, Bell, Edit2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Evento {
  evento_id: string
  evento_titulo: string
  evento_descricao: string
  evento_data: string
  evento_notificacao: boolean
  tags?: Tag[]
}

interface Tag {
  tag_id: number
  tag_nome: string
  tag_cor: string
}

interface EventDialogProps {
  event?: Evento | null
  open: boolean
  onOpenChange: () => void
  onSave: (formData: FormData) => Promise<void>
  onDelete: (eventId: string) => Promise<void>
  availableTags: Tag[]
}

export function EventDialog({ event, open, onOpenChange, onSave, onDelete, availableTags }: EventDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [data, setData] = useState("")
  const [notificacao, setNotificacao] = useState(false)
  const [selectedTag, setSelectedTag] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const predefinedTagNames = ["Inscrição", "Simulados", "Aula de Revisão", "Palestra", "Day OFF", "Redação"]
  const predefinedTags = availableTags.filter((tag) => predefinedTagNames.includes(tag.tag_nome))
  const customTags = availableTags.filter((tag) => !predefinedTagNames.includes(tag.tag_nome))

  useEffect(() => {
    if (event) {
      setTitulo(event.evento_titulo)
      setDescricao(event.evento_descricao)
      setData(event.evento_data)
      setNotificacao(event.evento_notificacao)
      setSelectedTag(event.tags && event.tags.length > 0 ? event.tags[0].tag_id : null)
      setIsEditMode(false)
    } else {
      resetForm()
      setIsEditMode(true)
    }
  }, [event, open])

  const resetForm = () => {
    setTitulo("")
    setDescricao("")
    const today = new Date().toISOString().split("T")[0]
    setData(today)
    setNotificacao(false)
    setSelectedTag(null)
    setShowDeleteConfirm(false)
  }

  const toggleTag = useCallback((tagId: number) => {
    setSelectedTag((prev) => (prev === tagId ? null : tagId))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (isLoading) return

    if (!titulo || !data) {
      toast({
        title: "Erro",
        description: "Título e data são obrigatórios",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    if (event?.evento_id) {
      formData.append("evento_id", event.evento_id)
    }
    formData.append("titulo", titulo)
    formData.append("descricao", descricao)
    formData.append("data", data)
    formData.append("notificacao", String(notificacao))
    formData.append("tag_ids", selectedTag ? String(selectedTag) : "")

    try {
      await onSave(formData)
      toast({
        title: "Sucesso",
        description: event ? "Evento atualizado com sucesso" : "Evento criado com sucesso",
      })
      resetForm()
      onOpenChange()
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving event:", error)
      toast({
        title: "Erro",
        description: "Erro ao salvar evento",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [titulo, data, descricao, notificacao, selectedTag, event, toast, onOpenChange, router, onSave, isLoading])

  const handleDelete = useCallback(async () => {
    if (!event) return
    setIsLoading(true)
    try {
      await onDelete(event.evento_id)
      toast({
        title: "Sucesso",
        description: "Evento removido com sucesso",
      })
      onOpenChange()
      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover evento",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [event, toast, onOpenChange, router, onDelete])

  const getSelectedTagObject = () => {
    if (!selectedTag) return null
    return availableTags.find((t) => t.tag_id === selectedTag) || null
  }

  if (event && !isEditMode) {
    const eventTag = event.tags && event.tags.length > 0 ? event.tags[0] : null

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Detalhes do Evento</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Título</Label>
                <p className="text-lg font-semibold">{event.evento_titulo}</p>
              </div>

              {event.evento_descricao && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Descrição</Label>
                  <p className="text-base text-foreground whitespace-pre-wrap">{event.evento_descricao}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Data</Label>
                <p className="text-base">
                  {new Date(event.evento_data + "T00:00:00").toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Tag</Label>
                {eventTag ? (
                  <span
                    className="inline-block px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-sm"
                    style={{ backgroundColor: eventTag.tag_cor }}
                  >
                    {eventTag.tag_nome}
                  </span>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma tag selecionada</p>
                )}
              </div>

              {event.evento_notificacao && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bell className="h-4 w-4" />
                  <span>Notificação ativada</span>
                </div>
              )}
            </div>

            {showDeleteConfirm ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Deletar Evento?</h3>
                    <p className="text-sm text-muted-foreground mt-1">Você tem certeza que quer deletar este evento?</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="flex-1">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Deletar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={onOpenChange}>
                  Fechar
                </Button>
                <Button className="flex-1 bg-primary" onClick={() => setIsEditMode(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">{event ? "Editar Evento" : "Novo Evento"}</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                Título<span className="text-red-500">*</span>
              </Label>
              <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Nome do evento" />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Adicione detalhes sobre o evento..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Data<span className="text-red-500">*</span>
              </Label>
              <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Tag (Selecione uma)</Label>

              {/* Predefined Tags */}
              {predefinedTags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Tags Predefinidas</p>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-background">
                    {predefinedTags.map((tag) => (
                      <button
                        key={tag.tag_id}
                        type="button"
                        onClick={() => toggleTag(tag.tag_id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedTag === tag.tag_id
                            ? "text-white shadow-md ring-2 ring-offset-2"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                        style={selectedTag === tag.tag_id ? { backgroundColor: tag.tag_cor } : {}}
                      >
                        {tag.tag_nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Tags */}
              {customTags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Minhas Tags</p>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-background">
                    {customTags.map((tag) => (
                      <button
                        key={tag.tag_id}
                        type="button"
                        onClick={() => toggleTag(tag.tag_id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedTag === tag.tag_id
                            ? "text-white shadow-md ring-2 ring-offset-2"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                        style={selectedTag === tag.tag_id ? { backgroundColor: tag.tag_cor } : {}}
                      >
                        {tag.tag_nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {customTags.length === 0 && predefinedTags.length === 0 && (
                <p className="text-sm text-muted-foreground p-3 border rounded-lg bg-muted/50">
                  Nenhuma tag disponível. Crie novas tags para organizar seus eventos.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label className="cursor-pointer">Notificação</Label>
              </div>
              <Switch checked={notificacao} onCheckedChange={setNotificacao} />
            </div>
          </div>

          {showDeleteConfirm ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Deletar Evento?</h3>
                  <p className="text-sm text-muted-foreground mt-1">Você tem certeza que quer deletar este evento?</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="flex-1">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Deletar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  if (event) {
                    setIsEditMode(false)
                  } else {
                    onOpenChange()
                  }
                }}
              >
                {event ? "Voltar" : "Cancelar"}
              </Button>
              <Button className="flex-1 bg-primary" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar
              </Button>
              {event && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
