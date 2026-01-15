"use client"

import type React from "react"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { useState, useMemo, useCallback } from "react"
import { EventDialog } from "@/components/calendar/event-dialog"
import { TagManagementDialog } from "@/components/calendar/tag-management-dialog"
import { deleteCustomTag } from "@/app/actions/tags"
import { createEvento, updateEvento, deleteEvento } from "@/app/actions/eventos"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Tag {
  tag_id: number
  tag_nome: string
  tag_cor: string
}

interface Evento {
  evento_id: string
  evento_titulo: string
  evento_descricao: string
  evento_data: string
  evento_notificacao: boolean
  tags?: Tag[]
}

interface CalendarViewProps {
  initialEventos: Evento[]
  availableTags: Tag[]
}

export function CalendarView({ initialEventos, availableTags }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const router = useRouter()

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const days = []

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, daysInPrevMonth - i),
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isCurrentMonth: true, fullDate: new Date(year, month, i) })
    }

    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: i, isCurrentMonth: false, fullDate: new Date(year, month + 1, i) })
    }

    return days
  }

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Evento[]>()
    initialEventos.forEach((event) => {
      if (!map.has(event.evento_data)) {
        map.set(event.evento_data, [])
      }
      map.get(event.evento_data)!.push(event)
    })
    return map
  }, [initialEventos])

  const getEventsForDate = useCallback(
    (date: Date) => {
      const dateStr = date.toISOString().split("T")[0]
      return eventsByDate.get(dateStr) || []
    },
    [eventsByDate],
  )

  const today = useMemo(() => {
    const now = new Date()
    return {
      date: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    }
  }, [])

  const isToday = useCallback(
    (date: Date) => {
      return date.getDate() === today.date && date.getMonth() === today.month && date.getFullYear() === today.year
    },
    [today],
  )

  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }, [])

  const handleDayClick = useCallback((date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setIsEventDialogOpen(true)
  }, [])

  const handleEventClick = useCallback((event: Evento, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setSelectedDate(null)
    setIsEventDialogOpen(true)
  }, [])

  const handleCreateClick = useCallback(() => {
    setSelectedEvent(null)
    setSelectedDate(new Date())
    setIsEventDialogOpen(true)
  }, [])

  const predefinedTagNames = ["Inscrição", "Simulados", "Aula de Revisão", "Palestra", "Day OFF", "Redação"]

  const predefinedTags = availableTags.filter((tag) => predefinedTagNames.includes(tag.tag_nome))
  const customTags = availableTags.filter((tag) => !predefinedTagNames.includes(tag.tag_nome))

  const handleDeleteTag = async (tagId: number, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm("Tem certeza que deseja apagar esta tag?")) {
      return
    }

    const result = await deleteCustomTag(tagId.toString())

    if (result.error) {
      toast.error("Erro ao apagar tag")
    } else {
      toast.success("Tag apagada com sucesso!")
      window.location.reload()
    }
  }

  const handleSaveEvent = async (formData: FormData) => {
    const eventoId = formData.get("evento_id") as string | null

    if (eventoId) {
      // Update existing event - pass id as first argument
      await updateEvento(eventoId, formData)
    } else {
      // Create new event
      if (selectedDate) {
        formData.set("data", selectedDate.toISOString().split("T")[0])
      }
      await createEvento(formData)
    }
    router.refresh()
  }

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvento(eventId)
    router.refresh()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[rgba(1,176,255,1)]">
      <DashboardSidebar activePage="Calendário" />

      <main className="flex-1 p-4 overflow-hidden">
        <div className="h-full overflow-hidden">
          <div className="rounded-3xl bg-background p-4 shadow-lg h-full flex flex-col lg:flex-row gap-4 overflow-hidden">
            {/* Tags Section */}
            <div className="hidden lg:block w-44 flex-shrink-0 overflow-y-auto">
              <Button
                className="w-full mb-4 bg-primary hover:bg-primary/90 text-white rounded-full text-xs py-2"
                onClick={handleCreateClick}
              >
                <Plus className="h-3.5 w-3.5 mr-2" />
                Criar Evento
              </Button>

              <div className="mb-4">
                <h3 className="text-[10px] font-semibold text-muted-foreground mb-2">TAGS PREDEFINIDAS</h3>
                <div className="space-y-1.5">
                  {predefinedTags.map((tag) => (
                    <div
                      key={tag.tag_id}
                      className="px-2.5 py-1 rounded-full text-[10px] font-medium text-white"
                      style={{
                        backgroundColor: tag.tag_cor,
                      }}
                    >
                      {tag.tag_nome}
                    </div>
                  ))}
                </div>
              </div>

              {customTags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-[10px] font-semibold text-muted-foreground mb-2">MINHAS TAGS</h3>
                  <div className="space-y-1.5">
                    {customTags.map((tag) => (
                      <div key={tag.tag_id} className="flex items-center gap-1 group">
                        <div
                          className="flex-1 px-2.5 py-1 rounded-full text-[10px] font-medium text-white"
                          style={{
                            backgroundColor: tag.tag_cor,
                          }}
                        >
                          {tag.tag_nome}
                        </div>
                        <button
                          onClick={(e) => handleDeleteTag(tag.tag_id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                          aria-label="Apagar tag"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-2 text-[10px]"
                  onClick={() => setIsTagDialogOpen(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Nova Tag
                </Button>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-base font-semibold text-foreground whitespace-nowrap">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 mb-1 flex-shrink-0">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[10px] font-semibold text-muted-foreground py-1 border-b border-border"
                  >
                    {day.slice(0, 3)}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-7 h-full" style={{ gridAutoRows: "1fr" }}>
                  {days.map((day, index) => {
                    const dayEvents = day.isCurrentMonth ? getEventsForDate(day.fullDate) : []
                    const isTodayDate = isToday(day.fullDate)

                    return (
                      <div
                        key={index}
                        className={`p-1 border-r border-b border-border last:border-r-0 cursor-pointer overflow-hidden ${
                          !day.isCurrentMonth
                            ? "bg-accent/10"
                            : isTodayDate
                              ? "bg-primary/10 ring-2 ring-primary/30"
                              : "bg-background hover:bg-accent/5"
                        } transition-colors`}
                        onClick={() => day.isCurrentMonth && handleDayClick(day.fullDate)}
                      >
                        <div
                          className={`text-[10px] font-medium mb-0.5 ${
                            !day.isCurrentMonth
                              ? "text-muted-foreground"
                              : isTodayDate
                                ? "text-primary font-bold"
                                : "text-foreground"
                          }`}
                        >
                          {day.date}
                        </div>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map((event) => {
                            const firstTag = event.tags && event.tags.length > 0 ? event.tags[0] : null
                            return (
                              <div
                                key={event.evento_id}
                                className="px-1 py-0.5 rounded text-[9px] font-medium truncate cursor-pointer hover:opacity-80"
                                style={{
                                  backgroundColor: firstTag ? firstTag.tag_cor : "#E5E7EB",
                                  color: "#FFFFFF",
                                }}
                                title={event.evento_titulo}
                                onClick={(e) => handleEventClick(event, e)}
                              >
                                {event.evento_titulo}
                              </div>
                            )
                          })}
                          {dayEvents.length > 2 && (
                            <div className="text-[8px] text-muted-foreground">+{dayEvents.length - 2} mais</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <EventDialog
        event={selectedEvent}
        open={isEventDialogOpen}
        onOpenChange={() => setIsEventDialogOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        availableTags={availableTags}
      />

      <TagManagementDialog isOpen={isTagDialogOpen} onClose={() => setIsTagDialogOpen(false)} />
    </div>
  )
}
