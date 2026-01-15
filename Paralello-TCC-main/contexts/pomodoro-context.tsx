"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"

type PomodoroPhase = "pomodoro" | "shortBreak" | "longBreak"

export interface PomodoroTask {
  id: string
  text: string
  completedCycles: number
  totalCycles: number
  isCompleted: boolean
}

interface PomodoroState {
  phase: PomodoroPhase
  timeLeft: number
  isRunning: boolean
  pomodorosCompleted: number
  currentCycle: number
  widgetVisible: boolean
  tasks: PomodoroTask[]
  activeTaskId: string | null
}

interface PomodoroContextType {
  state: PomodoroState
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipPhase: () => void
  formatTime: (seconds: number) => string
  showWidget: () => void
  hideWidget: () => void
  addTask: (text: string, totalCycles: number) => void
  deleteTask: (id: string) => void
  setActiveTask: (id: string | null) => void
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

const PHASE_DURATIONS = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

const STORAGE_KEY = "pomodoro-state"
const TASKS_STORAGE_KEY = "pomodoro-tasks"

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PomodoroState>({
    phase: "pomodoro",
    timeLeft: PHASE_DURATIONS.pomodoro,
    isRunning: false,
    pomodorosCompleted: 0,
    currentCycle: 1,
    widgetVisible: false,
    tasks: [],
    activeTaskId: null,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastTickRef = useRef<number>(Date.now())

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.isRunning && parsed.lastTick) {
          const elapsed = Math.floor((Date.now() - parsed.lastTick) / 1000)
          parsed.timeLeft = Math.max(0, parsed.timeLeft - elapsed)
        }

        // Merge tasks from separate storage
        if (savedTasks) {
          try {
            parsed.tasks = JSON.parse(savedTasks)
          } catch (e) {
            parsed.tasks = []
          }
        }

        setState(parsed)
      } catch (e) {
        console.error("Failed to load pomodoro state:", e)
      }
    } else if (savedTasks) {
      try {
        setState((prev) => ({ ...prev, tasks: JSON.parse(savedTasks) }))
      } catch (e) {
        console.error("Failed to load tasks:", e)
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const toSave = {
      ...state,
      lastTick: state.isRunning ? Date.now() : undefined,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(state.tasks))
  }, [state])

  // Timer tick logic
  useEffect(() => {
    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - lastTickRef.current) / 1000)
        lastTickRef.current = now

        setState((prev) => {
          const newTimeLeft = Math.max(0, prev.timeLeft - elapsed)

          if (newTimeLeft === 0) {
            const nextPhase = getNextPhase(prev.phase, prev.pomodorosCompleted)
            const newPomodorosCompleted =
              prev.phase === "pomodoro" ? prev.pomodorosCompleted + 1 : prev.pomodorosCompleted
            const newCycle =
              nextPhase === "pomodoro" && prev.phase === "longBreak" ? prev.currentCycle + 1 : prev.currentCycle

            let updatedTasks = prev.tasks
            let updatedActiveTaskId = prev.activeTaskId

            if (prev.phase === "pomodoro" && prev.activeTaskId) {
              updatedTasks = prev.tasks.map((task) => {
                if (task.id === prev.activeTaskId) {
                  const newCompleted = task.completedCycles + 1
                  const isNowCompleted = newCompleted >= task.totalCycles

                  // If task is completed, show notification
                  if (isNowCompleted) {
                    playTaskCompleteNotification(task.text)
                  }

                  return {
                    ...task,
                    completedCycles: newCompleted,
                    isCompleted: isNowCompleted,
                  }
                }
                return task
              })

              // Check if active task is now complete
              const activeTask = updatedTasks.find((t) => t.id === prev.activeTaskId)
              if (activeTask?.isCompleted) {
                updatedActiveTaskId = null
                // If no more incomplete tasks, stop the timer
                const hasIncompleteTasks = updatedTasks.some((t) => !t.isCompleted)
                if (!hasIncompleteTasks) {
                  playNotification()
                  return {
                    phase: "pomodoro",
                    timeLeft: PHASE_DURATIONS.pomodoro,
                    isRunning: false,
                    pomodorosCompleted: 0,
                    currentCycle: prev.currentCycle,
                    widgetVisible: true,
                    tasks: updatedTasks,
                    activeTaskId: null,
                  }
                }
              }
            }

            playNotification()

            return {
              phase: nextPhase,
              timeLeft: PHASE_DURATIONS[nextPhase],
              isRunning: false,
              pomodorosCompleted: newPomodorosCompleted % 4,
              currentCycle: newCycle,
              widgetVisible: true,
              tasks: updatedTasks,
              activeTaskId: updatedActiveTaskId,
            }
          }

          return { ...prev, timeLeft: newTimeLeft }
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [state.isRunning, state.timeLeft])

  const getNextPhase = (currentPhase: PomodoroPhase, completed: number): PomodoroPhase => {
    if (currentPhase === "pomodoro") {
      return (completed + 1) % 4 === 0 ? "longBreak" : "shortBreak"
    }
    return "pomodoro"
  }

  const playNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Pomodoro", {
          body: "Fase concluída! Hora de uma pausa.",
          icon: "/favicon.ico",
        })
      }
    }
    const audio = new Audio("/notification.mp3")
    audio.play().catch(() => {})
  }

  const playTaskCompleteNotification = (taskName: string) => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Tarefa Concluída! 🎉", {
          body: `Parabéns! Você completou: ${taskName}`,
          icon: "/favicon.ico",
        })
      }
    }
    const audio = new Audio("/notification.mp3")
    audio.play().catch(() => {})
  }

  const startTimer = useCallback(() => {
    lastTickRef.current = Date.now()
    setState((prev) => ({ ...prev, isRunning: true, widgetVisible: true }))

    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const pauseTimer = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }))
  }, [])

  const resetTimer = useCallback(() => {
    setState({
      phase: "pomodoro",
      timeLeft: PHASE_DURATIONS.pomodoro,
      isRunning: false,
      pomodorosCompleted: 0,
      currentCycle: 1,
      widgetVisible: false,
      tasks: state.tasks, // Keep tasks when resetting
      activeTaskId: null,
    })
  }, [state.tasks])

  const skipPhase = useCallback(() => {
    setState((prev) => {
      const nextPhase = getNextPhase(prev.phase, prev.pomodorosCompleted)
      const newPomodorosCompleted = prev.phase === "pomodoro" ? prev.pomodorosCompleted + 1 : prev.pomodorosCompleted
      const newCycle =
        nextPhase === "pomodoro" && prev.phase === "longBreak" ? prev.currentCycle + 1 : prev.currentCycle

      return {
        ...prev,
        phase: nextPhase,
        timeLeft: PHASE_DURATIONS[nextPhase],
        isRunning: false,
        pomodorosCompleted: newPomodorosCompleted % 4,
        currentCycle: newCycle,
        widgetVisible: true,
      }
    })
  }, [])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  const showWidget = useCallback(() => {
    setState((prev) => ({ ...prev, widgetVisible: true }))
  }, [])

  const hideWidget = useCallback(() => {
    setState((prev) => ({ ...prev, widgetVisible: false }))
  }, [])

  const addTask = useCallback((text: string, totalCycles: number) => {
    const newTask: PomodoroTask = {
      id: Date.now().toString(),
      text,
      completedCycles: 0,
      totalCycles,
      isCompleted: false,
    }
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
      activeTaskId: prev.activeTaskId === id ? null : prev.activeTaskId,
    }))
  }, [])

  const setActiveTask = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, activeTaskId: id }))
  }, [])

  return (
    <PomodoroContext.Provider
      value={{
        state,
        startTimer,
        pauseTimer,
        resetTimer,
        skipPhase,
        formatTime,
        showWidget,
        hideWidget,
        addTask,
        deleteTask,
        setActiveTask,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}

export function usePomodoro() {
  const context = useContext(PomodoroContext)
  if (!context) {
    throw new Error("usePomodoro must be used within PomodoroProvider")
  }
  return context
}
