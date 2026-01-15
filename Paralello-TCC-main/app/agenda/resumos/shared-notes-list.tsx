"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, User } from "lucide-react"
import { NoteViewDialog } from "@/components/notes/note-view-dialog"

interface Note {
  anotacao_id: number
  anotacao_titulo: string
  anotacao_descricao: string
  anotacao_texto: string
  anotacao_publica: boolean
  anotacao_publicacao: string
  anotacao_favoritar: boolean
  disciplina_id: number | null
  disciplina: {
    disciplina_id: number
    disciplina_nome: string
    disciplina_cor: string
  } | null
  perfil_usuario: {
    perfil_nome: string
    perfil_foto: string | null
  } | null
}

interface Disciplina {
  disciplina_id: number
  disciplina_nome: string
  disciplina_cor: string
}

export function SharedNotesList({
  publicNotes,
  availableDisciplinas,
}: {
  publicNotes: Note[]
  availableDisciplinas: Disciplina[]
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredNotes = publicNotes.filter((note) => {
    const matchesSearch = note.anotacao_titulo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "all" || note.disciplina_id?.toString() === selectedSubject
    return matchesSearch && matchesSubject
  })

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note)
    setIsViewDialogOpen(true)
  }

  const uniqueSubjects = availableDisciplinas.filter(
    (disciplina, index, self) => index === self.findIndex((d) => d.disciplina_nome === disciplina.disciplina_nome),
  )

  if (publicNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-3 bg-white rounded-lg border border-dashed p-4">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Nenhum resumo público encontrado</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Ainda não há resumos públicos compartilhados. Seja o primeiro a compartilhar seu conhecimento!
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px] h-10">
            <SelectValue placeholder="Filtrar por matéria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as matérias</SelectItem>
            {uniqueSubjects.map((disciplina) => (
              <SelectItem key={disciplina.disciplina_id} value={disciplina.disciplina_id.toString()}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: disciplina.disciplina_cor }}
                  />
                  <span style={{ color: disciplina.disciplina_cor }} className="font-medium">
                    {disciplina.disciplina_nome}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
          <Search className="h-10 w-10 text-muted-foreground/30" />
          <div>
            <h3 className="text-sm font-semibold">Nenhum resumo encontrado</h3>
            <p className="text-xs text-muted-foreground">Tente ajustar sua busca ou selecionar outra matéria</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredNotes.map((note) => (
            <Card
              key={note.anotacao_id}
              className="h-[180px] cursor-pointer hover:shadow-lg transition-all relative overflow-hidden group"
              onClick={() => handleNoteClick(note)}
              style={{ borderLeft: `4px solid ${note.disciplina?.disciplina_cor || "#E5E7EB"}` }}
            >
              <CardHeader className="pb-2 px-3 pt-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle
                    className="line-clamp-1 text-sm"
                    style={{ color: note.disciplina?.disciplina_cor || "inherit" }}
                  >
                    {note.anotacao_titulo}
                  </CardTitle>
                </div>
                {note.disciplina && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 w-fit mt-1"
                    style={{
                      backgroundColor: `${note.disciplina.disciplina_cor}20`,
                      color: note.disciplina.disciplina_cor,
                    }}
                  >
                    {note.disciplina.disciplina_nome}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {note.anotacao_descricao || "Sem descrição"}
                </p>
                {note.perfil_usuario && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {note.perfil_usuario.perfil_foto ? (
                      <img
                        src={note.perfil_usuario.perfil_foto || "/placeholder.svg"}
                        alt={note.perfil_usuario.perfil_nome}
                        className="h-6 w-6 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <span className="truncate font-medium">{note.perfil_usuario.perfil_nome}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NoteViewDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        note={selectedNote}
        onEdit={undefined}
      />
    </>
  )
}
