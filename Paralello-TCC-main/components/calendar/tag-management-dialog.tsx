"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCustomTag, updateCustomTag, deleteCustomTag, getAllTags } from "@/app/actions/tags"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Trash2, Plus, Palette } from "lucide-react"
import { useRouter } from "next/navigation"

interface Tag {
  tag_id: number
  tag_nome: string
  tag_cor: string
}

interface TagManagementDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function TagManagementDialog({ isOpen, onClose }: TagManagementDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [nome, setNome] = useState("")
  const [cor, setCor] = useState("#FF6B6B")
  const [editingTag, setEditingTag] = useState<{ id: string; nome: string; cor: string } | null>(null)
  const { toast } = useToast()
  const [customTags, setCustomTags] = useState<Tag[]>([])
  const router = useRouter()

  const PRESET_COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFD93D",
    "#6C5CE7",
    "#95E1D3",
    "#F38181",
    "#AA96DA",
    "#FCBAD3",
    "#FFFFD2",
    "#A8E6CF",
  ]

  useEffect(() => {
    async function loadTags() {
      if (!isOpen) return

      try {
        const result = await getAllTags()
        if (result.data) {
          const allTags = result.data as Tag[]
          setCustomTags(allTags.slice(6))
        }
      } catch (error) {
        console.error("Erro ao carregar tags:", error)
      }
    }

    loadTags()
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da tag é obrigatório",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("nome", nome)
    formData.append("cor", cor)

    try {
      let result
      if (editingTag) {
        result = await updateCustomTag(editingTag.id, formData)
      } else {
        result = await createCustomTag(formData)
      }

      if (result.error) throw new Error(result.error)

      toast({
        title: "Sucesso",
        description: editingTag ? "Tag atualizada com sucesso" : "Tag criada com sucesso",
      })

      setNome("")
      setCor("#FF6B6B")
      setEditingTag(null)
      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar tag",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [nome, cor, editingTag, toast, router])

  const handleEdit = useCallback((tag: { id: string; nome: string; cor: string }) => {
    setEditingTag(tag)
    setNome(tag.nome)
    setCor(tag.cor)
  }, [])

  const handleDelete = useCallback(
    async (tagId: number) => {
      setIsLoading(true)
      try {
        const result = await deleteCustomTag(String(tagId))
        if (result.error) throw new Error(result.error)

        toast({
          title: "Sucesso",
          description: "Tag removida com sucesso",
        })

        router.refresh()
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao remover tag",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast, router],
  )

  const resetForm = useCallback(() => {
    setNome("")
    setCor("#FF6B6B")
    setEditingTag(null)
  }, [])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) resetForm()
        onClose()
      }}
    >
      <DialogContent className="max-w-md">
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Gerenciar Tags Personalizadas</h2>
          </div>

          {/* Create/Edit Form */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold text-sm">{editingTag ? "Editar Tag" : "Criar Nova Tag"}</h3>

            <div className="space-y-2">
              <Label>Nome da Tag</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Prova, Trabalho..." />
            </div>

            <div className="space-y-2">
              <Label>Escolha uma Cor</Label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((presetCor) => (
                  <button
                    key={presetCor}
                    className={`h-10 w-10 rounded-full border-2 ${
                      cor === presetCor ? "border-foreground scale-110" : "border-transparent"
                    } transition-all`}
                    style={{ backgroundColor: presetCor }}
                    onClick={() => setCor(presetCor)}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {editingTag && (
                <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
              )}
              <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingTag ? (
                  "Salvar"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Tag
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* List of Custom Tags */}
          {customTags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Suas Tags</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {customTags.map((tag) => (
                  <div
                    key={tag.tag_id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full" style={{ backgroundColor: tag.tag_cor }} />
                      <span className="font-medium">{tag.tag_nome}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit({ id: String(tag.tag_id), nome: tag.tag_nome, cor: tag.tag_cor })}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(tag.tag_id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
