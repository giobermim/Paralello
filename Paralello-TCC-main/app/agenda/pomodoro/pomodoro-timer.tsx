"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Play, Pause, RotateCcw, SkipForward, HelpCircle, Plus, MoreVertical, GripVertical } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Phase = "pomodoro" | "shortBreak" | "longBreak"

interface Task {
  id: string
  title: string
  completed: boolean
  cyclesCompleted: number
  totalCycles: number
}

const PHASE_TIMES = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

export function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>("pomodoro")
  const [timeLeft, setTimeLeft] = useState(PHASE_TIMES.pomodoro)
  const [isRunning, setIsRunning] = useState(false)
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(1)

  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handlePhaseComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const handlePhaseComplete = () => {
    setIsRunning(false)

    if (phase === "pomodoro") {
      const newPomodorosCompleted = pomodorosCompleted + 1
      setPomodorosCompleted(newPomodorosCompleted)

      if (newPomodorosCompleted % 4 === 0) {
        setPhase("longBreak")
        setTimeLeft(PHASE_TIMES.longBreak)
      } else {
        setPhase("shortBreak")
        setTimeLeft(PHASE_TIMES.shortBreak)
      }
    } else {
      setPhase("pomodoro")
      setTimeLeft(PHASE_TIMES.pomodoro)
      if (phase === "longBreak") {
        setCurrentCycle(currentCycle + 1)
        setPomodorosCompleted(0)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startTimer = () => setIsRunning(true)
  const pauseTimer = () => setIsRunning(false)

  const resetTimer = () => {
    setIsRunning(false)
    setPhase("pomodoro")
    setTimeLeft(PHASE_TIMES.pomodoro)
    setPomodorosCompleted(0)
    setCurrentCycle(1)
  }

  const skipPhase = () => {
    setIsRunning(false)
    handlePhaseComplete()
  }

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        cyclesCompleted: 0,
        totalCycles: 4,
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle("")
    }
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskComplete = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const colors = {
    pomodoro: "from-[#FC1F69] to-[#FF6B9D]",
    shortBreak: "from-[#38B6FF] to-[#7DD3FF]",
    longBreak: "from-[#FFDE59] to-[#FFE999]",
  }

  const buttonColors = {
    pomodoro: "bg-[#FC1F69] hover:bg-[#E01B5E]",
    shortBreak: "bg-[#38B6FF] hover:bg-[#2A9DE5]",
    longBreak: "bg-[#FFDE59] hover:bg-[#EFD04F]",
  }

  const phaseNames = {
    pomodoro: "Pomodoro",
    shortBreak: "Pequena Pausa",
    longBreak: "Longa Pausa",
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Método Pomodoro</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/20">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-center">
                  Como funciona o Método Pomodoro?
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex h-1 w-full rounded-full overflow-hidden">
                  <div className="flex-1 bg-[#38B6FF]" />
                  <div className="flex-1 bg-[#ff0068]" />
                  <div className="flex-1 bg-[#fbca3f]" />
                  <div className="flex-1 bg-[#caddff]" />
                </div>

                <p className="text-sm text-muted-foreground">
                  O Método Pomodoro é uma técnica de gerenciamento de tempo que ajuda a manter o foco e a produtividade.
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#FC1F69] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      25
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Pomodoro</h4>
                      <p className="text-xs text-muted-foreground">
                        Período de foco intenso de 25 minutos dedicado ao estudo ou tarefa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#38B6FF] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Pequena Pausa</h4>
                      <p className="text-xs text-muted-foreground">Descanso curto de 5 minutos após cada pomodoro.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#FFDE59] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      15
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Longa Pausa</h4>
                      <p className="text-xs text-muted-foreground">
                        Descanso maior de 15 minutos após completar 4 pomodoros.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <h4 className="text-sm font-medium mb-1">Ciclo completo:</h4>
                  <p className="text-xs text-muted-foreground">
                    Pomodoro → Pequena Pausa → Pomodoro → Pequena Pausa → Pomodoro → Pequena Pausa → Pomodoro →{" "}
                    <span className="font-medium text-[#FFDE59]">Longa Pausa</span>
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm">Ciclo {currentCycle}</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i < pomodorosCompleted ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <Card className={`bg-gradient-to-br ${colors[phase]} p-6 rounded-3xl shadow-2xl`}>
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2">
            <span className="text-white text-base font-medium">{phaseNames[phase]}</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-7xl font-bold text-white mb-6 tracking-tight">{formatTime(timeLeft)}</div>

          <div className="flex gap-4 justify-center items-center">
            <Button
              onClick={resetTimer}
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/20 rounded-full h-12 w-12"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>

            <Button
              onClick={isRunning ? pauseTimer : startTimer}
              size="lg"
              className={`${buttonColors[phase]} text-white rounded-full px-12 py-5 text-base font-semibold shadow-xl hover:scale-105 transition-transform`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Iniciar
                </>
              )}
            </Button>

            <Button
              onClick={skipPhase}
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/20 rounded-full h-12 w-12"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-3">Tarefas</h2>

        <div className="space-y-2 mb-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />

              <div className="flex-1">
                <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.title}</span>
              </div>

              <span className="text-sm text-muted-foreground">
                {task.cyclesCompleted}/{task.totalCycles}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toggleTaskComplete(task.id)}>
                    {task.completed ? "Marcar como não concluída" : "Marcar como concluída"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-destructive">
                    Deletar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Nova tarefa..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1"
          />
          <Button onClick={addTask} className="bg-[#6366F1] hover:bg-[#5558E3]">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </Card>
    </div>
  )
}
