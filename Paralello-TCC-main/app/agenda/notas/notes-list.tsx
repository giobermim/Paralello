"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Star } from "lucide-react"
import { NoteDialog } from "@/components/notes/note-dialog"
import { NoteViewDialog } from "@/components/notes/note-view-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toggleFavorite } from "./actions"

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
}

interface Disciplina {
  disciplina_id: number
  disciplina_nome: string
  disciplina_cor: string
}

export function NotesList({
  initialNotes,
  availableDisciplinas,
}: {
  initialNotes: Note[]
  availableDisciplinas: Disciplina[]
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [favorites, setFavorites] = useState<Set<number>>(
    new Set(initialNotes.filter((n) => n.anotacao_favoritar).map((n) => n.anotacao_id)),
  )
  const [selectedSubject, setSelectedSubject] = useState<string>("all")

  const handleCreateClick = () => {
    setSelectedNote(null)
    setIsEditDialogOpen(true)
  }

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note)
    setIsViewDialogOpen(true)
  }

  const handleEditFromView = () => {
    setIsViewDialogOpen(false)
    setIsEditDialogOpen(true)
  }

  const toggleFavoriteNote = async (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const isFavorite = favorites.has(noteId)
    const newFavorites = new Set(favorites)

    if (isFavorite) {
      newFavorites.delete(noteId)
    } else {
      newFavorites.add(noteId)
    }

    setFavorites(newFavorites)
    await toggleFavorite(noteId.toString(), !isFavorite)
  }

  const favoriteNotes = initialNotes.filter((note) => favorites.has(note.anotacao_id))

  const getFilteredNotes = (notes: Note[]) => {
    if (selectedSubject === "all") return notes
    return notes.filter((note) => note.disciplina_id?.toString() === selectedSubject)
  }

  const filteredNotes = getFilteredNotes(initialNotes)
  const filteredFavorites = getFilteredNotes(favoriteNotes)

  const uniqueSubjects = availableDisciplinas.filter(
    (disciplina, index, self) => index === self.findIndex((d) => d.disciplina_nome === disciplina.disciplina_nome),
  )

  const renderNoteCard = (note: Note) => (
    <Card
      key={note.anotacao_id}
      className="h-[140px] cursor-pointer hover:shadow-lg transition-all relative overflow-hidden group"
      onClick={() => handleNoteClick(note)}
      style={{ borderLeft: `4px solid ${note.disciplina?.disciplina_cor || "#E5E7EB"}` }}
    >
      <CardHeader className="pb-1.5 px-3 pt-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-sm" style={{ color: note.disciplina?.disciplina_cor || "inherit" }}>
            {note.anotacao_titulo}
          </CardTitle>
          <button
            onClick={(e) => toggleFavoriteNote(note.anotacao_id, e)}
            className="flex-shrink-0 p-0.5 rounded hover:bg-accent transition-colors"
          >
            <Star
              className={`h-3.5 w-3.5 ${
                favorites.has(note.anotacao_id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>
        {note.disciplina && (
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 h-4 w-fit mt-1"
            style={{ backgroundColor: `${note.disciplina.disciplina_cor}20`, color: note.disciplina.disciplina_cor }}
          >
            {note.disciplina.disciplina_nome}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="px-3 pb-2">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">
          {note.anotacao_descricao || "Sem descrição"}
        </p>
        {note.anotacao_publica && (
          <Badge variant="outline" className="text-[10px] h-4 px-1.5">
            Pública
          </Badge>
        )}
      </CardContent>
    </Card>
  )

  if (initialNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-3 bg-white rounded-lg border border-dashed p-4">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Nenhuma nota encontrada</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Você ainda não criou nenhuma nota. Comece criando sua primeira nota para organizar seus estudos.
          </p>
        </div>
        <Button onClick={handleCreateClick} size="sm" className="gap-2 text-xs h-8">
          <Plus className="h-3.5 w-3.5" />
          Criar nota
        </Button>

        <NoteDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          note={selectedNote}
          availableDisciplinas={availableDisciplinas}
        />
      </div>
    )
  }

  return (
    <>
      <Tabs defaultValue="all" className="w-full h-full flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 mb-2 flex-shrink-0">
          <TabsList className="h-8 flex-shrink-0">
            <TabsTrigger value="all" className="text-xs h-7">
              Todas as Notas
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-1.5 text-xs h-7">
              <Star className="h-3 w-3" />
              Favoritos ({favoriteNotes.length})
            </TabsTrigger>
          </TabsList>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Filtrar por matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                Todas as matérias
              </SelectItem>
              {uniqueSubjects.map((disciplina) => (
                <SelectItem
                  key={disciplina.disciplina_id}
                  value={disciplina.disciplina_id.toString()}
                  className="text-xs"
                >
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

        <TabsContent value="all" className="mt-0 flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="h-[140px] flex flex-col gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5 bg-transparent"
              onClick={handleCreateClick}
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium text-xs">Criar nova nota</span>
            </Button>

            {filteredNotes.map(renderNoteCard)}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-0 flex-1 overflow-auto">
          {filteredFavorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <Star className="h-10 w-10 text-muted-foreground/30" />
              <div>
                <h3 className="text-sm font-semibold">
                  {selectedSubject === "all" ? "Nenhuma nota favorita" : "Nenhuma nota favorita nesta matéria"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedSubject === "all"
                    ? "Clique na estrela das notas para adicioná-las aos favoritos"
                    : "Tente selecionar outra matéria ou adicione notas aos favoritos"}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredFavorites.map(renderNoteCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <NoteViewDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        note={selectedNote}
        onEdit={handleEditFromView}
      />

      <NoteDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        note={selectedNote}
        availableDisciplinas={availableDisciplinas}
      />
    </>
  )
}
