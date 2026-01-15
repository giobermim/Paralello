"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Globe, Lock } from "lucide-react"

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

interface NoteViewDialogProps {
  isOpen: boolean
  onClose: () => void
  note: Note | null
  onEdit?: () => void // Made onEdit optional for read-only views
}

export function NoteViewDialog({ isOpen, onClose, note, onEdit }: NoteViewDialogProps) {
  if (!note) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] w-[90vw] max-h-[80vh] p-0 flex flex-col overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="p-6 border-b"
            style={{ borderLeftColor: note.disciplina?.disciplina_cor || "#E5E7EB", borderLeftWidth: "4px" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-bold" style={{ color: note.disciplina?.disciplina_cor || "inherit" }}>
                  {note.anotacao_titulo}
                </h2>

                <div className="flex items-center gap-2 flex-wrap">
                  {note.disciplina && (
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: `${note.disciplina.disciplina_cor}20`,
                        color: note.disciplina.disciplina_cor,
                      }}
                    >
                      {note.disciplina.disciplina_nome}
                    </Badge>
                  )}

                  <Badge variant="outline" className="text-xs gap-1">
                    {note.anotacao_publica ? (
                      <>
                        <Globe className="h-3 w-3" />
                        Pública
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        Privada
                      </>
                    )}
                  </Badge>
                </div>

                {onEdit && (
                  <div className="pt-3">
                    <Button onClick={onEdit} size="sm" className="bg-[#FC1F69] hover:bg-[#FC1F69]/90 text-white gap-2">
                      <Pencil className="h-4 w-4" />
                      Editar Nota
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {note.anotacao_descricao && (
            <div className="px-6 py-4 bg-muted/30 border-b">
              <p className="text-sm text-muted-foreground italic">{note.anotacao_descricao}</p>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto min-h-[200px] max-h-[400px]">
            <div className="prose prose-sm max-w-none">
              {note.anotacao_texto ? (
                <div className="whitespace-pre-wrap text-base leading-relaxed">{note.anotacao_texto}</div>
              ) : (
                <p className="text-muted-foreground italic">Esta nota não possui conteúdo.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
